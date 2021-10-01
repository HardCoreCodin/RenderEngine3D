import Geometry from "../../../nodes/geometry.js";
import Matrix4x4 from "../../../accessors/matrix4x4.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/base.js";
import BaseRenderPipeline from "../../base/pipelines.js";
import {VertexPositions3D, VertexPositions4D} from "../../../buffers/attributes/positions.js";
import {CUBE_FACE_VERTICES, CUBE_VERTEX_COUNT} from "../../../geometry/cube.js";
import {IRasterRenderPipeline, ISize} from "../../../core/interfaces/render.js";
import Mesh from "../../../geometry/mesh.js";
import {FlagsBuffer1D} from "../../../buffers/flags.js";
import {cullVertices} from "./core/cull.js";
import {MAX_RENDER_TARGET_SIZE, NDC, NEAR, NORMAL_SOURCING, OUT} from "../../../core/constants.js";
import {projectVertex, shadeFace} from "./core/half_space.js";
import {Pixels, UVs2D} from "../../../buffers/vectors.js";
import {IAttributeBuffers} from "./core/clip.js";
import {Color3D, rgba} from "../../../accessors/color.js";
import {Direction3D} from "../../../accessors/direction.js";
import {UV2D} from "../../../accessors/uv.js";
import {Position3D} from "../../../accessors/position.js";
import Scene from "../../../nodes/scene.js";
import {IShaded} from "./materials/shaders/pixel.js";
import {drawPixel} from "../../../core/utils.js";
import {VertexNormals3D} from "../../../buffers/attributes/normals.js";
import {IMeshShaderInputs, IMeshShaderOutputs} from "./materials/shaders/mesh.js";

export default class Rasterizer
    extends BaseRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport>
    implements IRasterRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport>
{
    protected current_max_face_count: number = 0;
    protected current_max_vertex_count: number = 0;

    protected pixels = new Pixels().init(MAX_RENDER_TARGET_SIZE);
    protected vertex_flags = new FlagsBuffer1D().init(CUBE_VERTEX_COUNT);

    protected readonly clipped_world_positions = new VertexPositions3D().init(6);
    protected readonly clipped_vertex_positions = new VertexPositions4D().init(6);
    protected readonly clipped_vertex_normals = new VertexPositions3D().init(6);
    protected readonly clipped_vertex_uvs = new UVs2D().init(6);
    protected readonly _scratch_vectors3D = new VertexPositions3D().init(9);
    protected readonly _scratch_vectors2D = new UVs2D().init(2);
    protected readonly _shaded: IShaded = {
        viewing_origin: null,
        viewing_direction: null,
        light_direction: null,
        reflected_direction: null,
        half_vector: null,
        ambient_color: null,
        combined_color: null,
        temp_color: null,
        position: null,
        normal: null,
        UV: null,
        dUV: null,
        coords: { x: 0, y: 0 },
        perspective_corrected_barycentric_coords: null,
        pixel: null,
        lights: null,
        material: null
    };
    protected readonly _mesh_shader_inputs: IMeshShaderInputs = {
        mesh: null,
        model_to_clip: null,
        world_to_clip: null,
        model_to_world: null,
        model_to_world_inverted_transposed: new Matrix4x4()
    };
    protected readonly _mesh_shader_outputs: IMeshShaderOutputs = {
        clip_space_vertex_positions: new VertexPositions4D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES),
        world_space_vertex_normals: new VertexNormals3D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES),
        world_space_vertex_positions: new VertexPositions3D().init(6)
    };

    constructor(context: CanvasRenderingContext2D, scene: Scene<CanvasRenderingContext2D>) {
        super(context, scene);

        this._mesh_shader_inputs.model_to_clip = this.model_to_clip;
        this._shaded.perspective_corrected_barycentric_coords = this._scratch_vectors3D.arrays[0];
        this._shaded.viewing_direction   = new Direction3D(     this._scratch_vectors3D.arrays[1]);
        this._shaded.light_direction     = new Direction3D(     this._scratch_vectors3D.arrays[2]);
        this._shaded.reflected_direction = new Direction3D(     this._scratch_vectors3D.arrays[3]);
        this._shaded.half_vector         = new Direction3D(     this._scratch_vectors3D.arrays[4]);
        this._shaded.position            = new Position3D(      this._scratch_vectors3D.arrays[5]);
        this._shaded.normal              = new Direction3D(     this._scratch_vectors3D.arrays[6]);
        this._shaded.temp_color          = new Color3D(         this._scratch_vectors3D.arrays[7]);
        this._shaded.combined_color      = new Color3D(         this._scratch_vectors3D.arrays[8]);
        this._shaded.ambient_color = scene.ambient_color;
        this._shaded.UV  = new UV2D(this._scratch_vectors2D.arrays[0]);
        this._shaded.dUV = new UV2D(this._scratch_vectors2D.arrays[1]);
        this._shaded.pixel = this.pixels.current;
        this._shaded.lights = scene.lights;
    }

    protected _updateClippingBuffers(): void {
        let max_face_count = 0;
        let max_vertex_count = 0;

        for (const mesh of this.scene.mesh_geometries.meshes) {
            for (const geometry of this.scene.mesh_geometries.getGeometries(mesh)) {
                if (geometry.is_renderable) {
                    if (geometry.mesh.face_count > max_face_count)
                        max_face_count = geometry.mesh.face_count;

                    if (geometry.mesh.vertex_count > max_vertex_count)
                        max_vertex_count = geometry.mesh.vertex_count;
                }
            }
        }

        if (max_vertex_count > this.current_max_vertex_count) {
            this.current_max_vertex_count = max_vertex_count;
            this.vertex_flags.init(max_vertex_count);
            this._mesh_shader_outputs.clip_space_vertex_positions.init(max_vertex_count);
            this._mesh_shader_outputs.world_space_vertex_positions.init(max_vertex_count);
            this._mesh_shader_outputs.world_space_vertex_normals.init(max_vertex_count);
        }
    }

    render(viewport: SoftwareRasterViewport): void {
        if (!this.scene.mesh_geometries.mesh_count)
            return;

        viewport.render_target.clear();
        const pixel_count = viewport.size.height * viewport.size.width;
        let pixel_array: Float32Array;
        for (let i = 0; i < pixel_count; i++) {
            pixel_array = this.pixels.arrays[i];
            pixel_array[0] = 0;
            pixel_array[1] = 0;
            pixel_array[2] = 0;
            pixel_array[3] = 1;
            pixel_array[4] = Infinity;
        }

        this._updateClippingBuffers();

        this._shaded.viewing_origin = viewport.camera.position;

        let mesh: Mesh;
        let mesh_geometry: Geometry;

        const half_width  = viewport.size.width  >>> 1;
        const half_height = viewport.size.height >>> 1;
        const clip_positions = this._mesh_shader_outputs.clip_space_vertex_positions;
        const world_positions = this._mesh_shader_outputs.world_space_vertex_positions;
        const world_normals = this._mesh_shader_outputs.world_space_vertex_normals;
        const vertex_positions = clip_positions.arrays;
        const clipped_faces_vertex_positions = this.clipped_vertex_positions.arrays;
        const positions = this.clipped_world_positions.arrays;
        const normals = this.clipped_vertex_normals.arrays;
        const uvs = this.clipped_vertex_uvs.arrays;

        const n = viewport.view_frustum.near;
        const vf = this.vertex_flags.array;
        let indices: Uint32Array[];

        let v1_index, v1_flags, x1, y1, z1, new_v1x, new_v2x, in2x, nx, d1_x, d2_x,
            v2_index, v2_flags, x2, y2, z2, new_v1y, new_v2y, in2y, ny, d1_y, d2_y,
            v3_index, v3_flags, x3, y3, z3, new_v1z, new_v2z, in2z, nz, d1_z, d2_z,
            new_v2num, out1_index, out1_num, out1z, in1_index, in1_num, in1z,
            new_v1num, out2_index, out2_num, out2z, in2_index, in2_num, dot,
            t, one_minus_t, clipped_index, component_count, one_over_length,
            face_index, vertex_index, face_count, vertex_count: number;

        let clipped, in1, in2, out1, out2, attr_in, attr_out, attr_clipped: Float32Array;

        const pz = viewport.projection_matrix.translation.z;

        const context = viewport.render_target.context;
        const wire_frame_color = `${rgba(1)}`;
        const wire_frame_clipped_color = `${rgba(1, 0,  0)}`;
        let v1, v2, v3: Float32Array;
        let face_vertex_indices: Uint32Array;
        let mesh_has_normals, mesh_has_uvs, clipping_produced_an_extra_face: boolean;

        for (const material of this.scene.materials) if (material instanceof SoftwareRasterMaterial) {
            this._shaded.material = material.params;
            for (mesh of material.mesh_geometries.meshes) {
                mesh_has_normals = mesh.options.normal >= NORMAL_SOURCING.LOAD_VERTEX__NO_FACE;
                mesh_has_uvs = mesh.options.include_uvs;
                indices = mesh.face_vertices.arrays as Uint32Array[];

                const attributes: IAttributeBuffers[] = [[  world_positions.arrays, indices, positions, false]];
                if (mesh_has_normals) attributes.push(   [    world_normals.arrays, indices, normals,   true ]);
                if (mesh_has_uvs)     attributes.push(   [mesh.vertices.uvs.arrays, indices, uvs,       false]);

                for (mesh_geometry of material.mesh_geometries.getGeometries(mesh)) if (mesh_geometry.is_renderable) {
                    // Prepare a matrix for converting from model space to clip space:

                    // Bind the inputs and outputs for the mesh shader, and execute it.
                    // Skip this geometry if it returns a CULL flag (0):

                    this._mesh_shader_inputs.mesh = mesh;
                    this._mesh_shader_inputs.model_to_world = mesh_geometry.model_to_world;
                    this._mesh_shader_inputs.model_to_world_inverted_transposed.setFrom(mesh_geometry.model_to_world);
                    this._mesh_shader_inputs.model_to_world_inverted_transposed.invert().transpose();
                    this._mesh_shader_inputs.model_to_clip.setFrom(mesh_geometry.model_to_world);
                    this._mesh_shader_inputs.model_to_clip.imul(viewport.world_to_clip);
                    this._mesh_shader_inputs.world_to_clip = viewport.world_to_clip;

                    if (material.mesh_shader(this._mesh_shader_inputs, this._mesh_shader_outputs)) {
                        // The mesh shader did not cull this geometry.
                        // Cull the vertices against the view frustum:

                        face_count = mesh.face_count;
                        vertex_count = mesh.vertex_count;

                        if (cullVertices(vertex_positions, vf, vertex_count)) {
                            // The mesh could not be determined to be outside the view frustum based on vertex culling alone.

                            // Check it's faces as well and check for clipping cases:
                            for (face_index = 0; face_index < face_count; face_index++) {
                                // Fetch the index and out-direction flags of each of the face's vertices:
                                face_vertex_indices = mesh.face_vertices.arrays[face_index] as Uint32Array;
                                v1_index = face_vertex_indices[0];
                                v2_index = face_vertex_indices[1];
                                v3_index = face_vertex_indices[2];

                                v1 = vertex_positions[v1_index];
                                v2 = vertex_positions[v2_index];
                                v3 = vertex_positions[v3_index];

                                clipped_faces_vertex_positions[0].set(v1);
                                clipped_faces_vertex_positions[1].set(v2);
                                clipped_faces_vertex_positions[2].set(v3);

                                if (attributes) {
                                    for (const [attrs, attr_indices, clipped_attrs] of attributes) {
                                        clipped_attrs[0].set(attrs[attr_indices[face_index][0]]);
                                        clipped_attrs[1].set(attrs[attr_indices[face_index][1]]);
                                        clipped_attrs[2].set(attrs[attr_indices[face_index][2]]);
                                    }
                                }

                                if (viewport.cull_back_faces) {
                                    // Check face orientation "early" (before the perspective divide)
                                    // Note:
                                    // This assumes that vertex positions were provided in 'clip' or 'view' space(!).
                                    // Also, that projected_origin_x/y/z were provided - these are the coordinates of the origin
                                    // which has the projection matrix alone applied to them.
                                    x1 = v1[0]; x2 = v2[0]; x3 = v3[0];
                                    y1 = v1[1]; y2 = v2[1]; y3 = v3[1];
                                    z1 = v1[2]; z2 = v2[2]; z3 = v3[2];

                                    // Compute 2 direction vectors forming a plane for the face:
                                    d1_x = x2 - x1; d2_x = x3 - x1;
                                    d1_y = y2 - y1; d2_y = y3 - y1;
                                    d1_z = z2 - z1; d2_z = z3 - z1;

                                    // Compute a normal vector of the face from these 2 direction vectors:
                                    nx = (d1_z * d2_y) - (d1_y * d2_z);
                                    ny = (d1_x * d2_z) - (d1_z * d2_x);
                                    nz = (d1_y * d2_x) - (d1_x * d2_y);

                                    // Dot the vector from the face to the origin with the normal:
                                    dot = nz*(pz - z1) - ny*y1 - nx*x1;
                                    if (dot <= 0) {
                                        // if the angle is 90 the face is at grazing angle to the camera.
                                        // if the angle is greater then 90 degrees the face faces away from the camera.
                                        continue;
                                    }
                                }

                                clipping_produced_an_extra_face = false;

                                v1_flags = vf[v1_index] & OUT;
                                v2_flags = vf[v2_index] & OUT;
                                v3_flags = vf[v3_index] & OUT;

                                if ((v1_flags | v2_flags) | v3_flags) {
                                    // One or more vertices are outside - check edges for intersections:
                                    if ((v1_flags & v2_flags) & v3_flags) {
                                        // All vertices share one or more out-direction(s).
                                        // The face is fully outside the frustum, and does not intersect it.
                                        continue;
                                        // Note: This includes the cases where "all" 3 vertices cross the near clipping plane.
                                        // Below there are checks for when "any" of the vertices cross it (1 or 2, but not 3).
                                    }

                                    // One or more vertices are outside, and no out-direction is shared across them.
                                    // The face is visible in the view frustum in some way.
                                    vf[v1_index] |= NDC;
                                    vf[v2_index] |= NDC;
                                    vf[v3_index] |= NDC;

                                    // Check if any vertex crosses the near clipping plane:
                                    if (v1_flags & NEAR ||
                                        v2_flags & NEAR ||
                                        v3_flags & NEAR) {
                                        // There is at least one vertex behind the near clipping plane.
                                        // The face needs to be clipped
                                        // Clipping is done only against the near clipping plane, so there are only 2 possible cases:
                                        // 1: One vertex is inside the frustum and the other two are outside beyond the near clipping plane.
                                        // 2: Two vertices are inside the frustum and the third is outside beyond the near clipping plane.

                                        // Figure out which case applies to this current face, and which vertices are in/out:
                                        in2_num   = out2_num = 0;
                                        in2_index = out2_index = -1;
                                        if (v1_flags & NEAR) {
                                            out1_index = v1_index;
                                            out1_num = 1;
                                            if (v2_flags & NEAR) {
                                                out2_index = v2_index;
                                                out2_num = 2;
                                                in1_index = v3_index;
                                                in1_num = 3;
                                            } else {
                                                in1_index = v2_index;
                                                in1_num = 2;
                                                if (v3_flags & NEAR) {
                                                    out2_index = v3_index;
                                                    out2_num = 3;
                                                } else {
                                                    in2_index = v3_index;
                                                    in2_num = 3;
                                                }
                                            }
                                        } else {
                                            in1_index = v1_index;
                                            in1_num = 1;
                                            if (v2_flags & NEAR) {
                                                out1_index = v2_index;
                                                out1_num = 2;
                                                if (v3_flags & NEAR) {
                                                    out2_index = v3_index;
                                                    out2_num = 3;
                                                } else {
                                                    in2_index = v3_index;
                                                    in2_num = 3;
                                                }
                                            } else {
                                                in2_index = v2_index;
                                                in2_num = 2;
                                                out1_index = v3_index;
                                                out1_num = 3;
                                            }
                                        }
                                        in1  = vertex_positions[in1_index];  in1z  = in1[2];
                                        out1 = vertex_positions[out1_index]; out1z = out1[2];

                                        // Compute and store the (relative)amount by which the FIRST outside
                                        // vertex would need to be moved 'inwards' towards the FIRST inside vertex:
                                        t = out1z / (out1z - in1z);
                                        one_minus_t = 1 - t;
                                        // Note:
                                        // Clip space is set up such that a depth of 0 is where the near clipping plane is.
                                        // So 'out1z' would be (negative)distance of the vertex from the near clipping plane,
                                        // representing the 'amount' by which the 'outside' vertex would needs to be 'pushed' forward
                                        // to land it on the near clipping plane. The denominator here is the 'full' depth-distance
                                        // between the 2 vertices - the sum of distances of the 2 vertices from to the clipping plane.
                                        // The ratio of the former from the latter is thus the (positive)interpolation amount 't' (0->1).
                                        // Since 'out1z' would be negative here, 'in1z' is negated as well to get the full (negative)sum.
                                        // Since both the numerator and the denominator here would be negative, the result is positive.
                                        // The interpolation value 't' is with respect to the 'outside' vertex, and so would be multiplied
                                        // by any attribute-value of the 'outside' vertex. The complement of that (1 - t) would be multiplied
                                        // by any attribute-value of the 'inside' vertex, and the sum would be the interpolated value.
                                        // *The same logic applies for the second interpolation in either of it's 2 cases below.

                                        // Compute the index of the "unshared" position-value(s) of the 'clipped' vertex of this face:
                                        clipped_index = out1_num - 1;
                                        clipped = clipped_faces_vertex_positions[clipped_index];

                                        // Compute the new clip-space coordinates of the clipped-vertex:
                                        new_v1x = one_minus_t*out1[0] + t*in1[0];
                                        new_v1y = one_minus_t*out1[1] + t*in1[1];
                                        new_v1z = one_minus_t*out1[2] + t*in1[2];

                                        clipped[0] = new_v1x;
                                        clipped[1] = new_v1y;
                                        clipped[2] = 0;
                                        clipped[3] = n;
                                        // Note:
                                        // The 'Z' coordinate of this new vertex position in clip-space is set to '0' since it has
                                        // now been moved onto the clipping plane itself. Similarly, the 'W' coordinate is set to
                                        // what the "original" Z-depth value this vertex "would have had", had it been on the
                                        // near clipping plane in view-space in the first place.
                                        // *The same logic applies for the second interpolation in either of it's 2 cases below.

                                        if (attributes) {
                                            for (const [attrs, attr_indices, clipped_attrs, normalize] of attributes) {
                                                attr_in = attrs[attr_indices[face_index][in1_num - 1]];
                                                attr_out =attrs[attr_indices[face_index][out1_num - 1]];
                                                attr_clipped = clipped_attrs[clipped_index];
                                                component_count = attrs[0].length;
                                                for (let component = 0; component < component_count; component++)
                                                    attr_clipped[component] = one_minus_t*attr_out[component] + t*attr_in[component];
                                                if (normalize) {
                                                    one_over_length = 1.0 / Math.sqrt(attr_clipped[0] * attr_clipped[0] + attr_clipped[1] * attr_clipped[1] + attr_clipped[2] * attr_clipped[2]);
                                                    attr_clipped[0] *= one_over_length;
                                                    attr_clipped[1] *= one_over_length;
                                                    attr_clipped[2] *= one_over_length;
                                                }
                                            }
                                        }

                                        if (out2_num) {
                                            // One vertex is inside the frustum, and the other two are outside beyond the near clipping plane.
                                            // The triangle just needs to get smaller by moving the 2 outside-vertices back to the near clipping plane.

                                            // Compute and store the (relative)amount by which the SECOND outside
                                            // vertex needs to be moved inwards towards the FIRST inside vertex:
                                            out2 = vertex_positions[out2_index];
                                            out2z = out2[2];
                                            t = out2z / (out2z - in1z);
                                            one_minus_t = 1 - t;

                                            // Compute the index of the "unshared" position-value(s) of the 'clipped' vertex of this face:
                                            clipped_index = out2_num - 1;
                                            clipped = clipped_faces_vertex_positions[clipped_index];

                                            // Compute the new clip-space coordinates of the clipped-vertex:
                                            clipped[0] = one_minus_t*out2[0] + t*in1[0];
                                            clipped[1] = one_minus_t*out2[1] + t*in1[1];
                                            clipped[2] = 0;
                                            clipped[3] = n;

                                            if (attributes) {
                                                for (const [attrs, attr_indices, clipped_attrs, normalize] of attributes) {
                                                    attr_in = attrs[attr_indices[face_index][in1_num - 1]];
                                                    attr_out =attrs[attr_indices[face_index][out2_num - 1]];
                                                    attr_clipped = clipped_attrs[clipped_index];
                                                    component_count = attrs[0].length;
                                                    for (let component = 0; component < component_count; component++)
                                                        attr_clipped[component] = one_minus_t*attr_out[component] + t*attr_in[component];
                                                    if (normalize) {
                                                        one_over_length = 1.0 / Math.sqrt(attr_clipped[0] * attr_clipped[0] + attr_clipped[1] * attr_clipped[1] + attr_clipped[2] * attr_clipped[2]);
                                                        attr_clipped[0] *= one_over_length;
                                                        attr_clipped[1] *= one_over_length;
                                                        attr_clipped[2] *= one_over_length;
                                                    }
                                                }
                                            }
                                        } else {
                                            // Two vertices are inside the frustum, and the third one is behind the near clipping plane.
                                            // Clipping forms a quad which needs to be split into 2 triangles.
                                            // The first one is formed from the original one, by moving the vertex that is behind the
                                            // clipping plane right up-to the near clipping plane itself (exactly as in the first case).
                                            // The second triangle is a new triangle that needs to be created, from the 2 vertices that
                                            // are inside, plus a new vertex that would need to be interpolated by moving the same vertex
                                            // that is outside up-to the near clipping plane but towards the other vertex that is inside.

                                            // Compute and store the (relative)amount by which the FIRST outside vertex
                                            // needs to be moved inwards towards the SECOND inside vertex:
                                            in2 = vertex_positions[in2_index];
                                            in2x = in2[0];
                                            in2y = in2[1];
                                            in2z = in2[2];
                                            t = out1z / (out1z - in2z);
                                            one_minus_t = 1 - t;

                                            new_v2x = one_minus_t*out1[0] + t*in2x;
                                            new_v2y = one_minus_t*out1[1] + t*in2y;
                                            new_v2z = one_minus_t*out1[2] + t*in2z;

                                            // Determine orientation:
                                            // Compute 2 direction vectors forming a plane for the face:
                                            d1_x = new_v2x - in2x; d2_x = new_v1x - in2x;
                                            d1_y = new_v2y - in2y; d2_y = new_v1y - in2y;
                                            d1_z = new_v2z - in2z; d2_z = new_v1z - in2z;

                                            // Compute a normal vector of the face from these 2 direction vectors:
                                            nx = (d1_z * d2_y) - (d1_y * d2_z);
                                            ny = (d1_x * d2_z) - (d1_z * d2_x);
                                            nz = (d1_y * d2_x) - (d1_x * d2_y);

                                            // Dot the vector from the face to the origin with the normal:
                                            if (nz*(pz - in2z) - ny*in2y - nx*in2x > 0) {
                                                // if the angle is greater than 90 degrees the face is facing the camera
                                                new_v1num = 2;
                                                new_v2num = 1;
                                            } else {
                                                // if the angle is 90 the face is at grazing angle to the camera.
                                                // if the angle is greater then 90 degrees the face faces away from the camera.
                                                new_v1num = 1;
                                                new_v2num = 2;
                                            }

                                            // Since this vertex belongs to an 'extra' new face, the index is offset to that index-space
                                            clipped_index = 3 + new_v2num;
                                            clipped_faces_vertex_positions[3].set(in2);
                                            clipped_faces_vertex_positions[3 + new_v1num].set(clipped);
                                            clipped = clipped_faces_vertex_positions[clipped_index];

                                            // Compute the new clip-space coordinates of the clipped-vertex:
                                            clipped[0] = new_v2x;
                                            clipped[1] = new_v2y;
                                            clipped[2] = 0;
                                            clipped[3] = n;

                                            if (attributes) {
                                                for (const [attrs, attr_indices, clipped_attrs, normalize] of attributes) {
                                                    attr_in = attrs[attr_indices[face_index][in2_num - 1]];
                                                    attr_out =attrs[attr_indices[face_index][out1_num - 1]];

                                                    clipped_attrs[3].set(attr_in);
                                                    clipped_attrs[3 + new_v1num].set(clipped_attrs[out1_num - 1]);
                                                    attr_clipped = clipped_attrs[clipped_index];
                                                    component_count = attrs[0].length;
                                                    for (let component = 0; component < component_count; component++)
                                                        attr_clipped[component] = one_minus_t*attr_out[component] + t*attr_in[component];
                                                    if (normalize) {
                                                        one_over_length = 1.0 / Math.sqrt(attr_clipped[0] * attr_clipped[0] + attr_clipped[1] * attr_clipped[1] + attr_clipped[2] * attr_clipped[2]);
                                                        attr_clipped[0] *= one_over_length;
                                                        attr_clipped[1] *= one_over_length;
                                                        attr_clipped[2] *= one_over_length;
                                                    }
                                                }
                                            }

                                            clipping_produced_an_extra_face = true;
                                        }
                                    }
                                    // Even if no vertices are behind the view frustum the face is still visible.
                                    // It either intersects the frustum in direction(s) other than the near clipping plane,
                                    // or it may fully surround the whole view frustum.
                                    // No geometric clipping is needed, but the face can not be culled.
                                }
                                // No vertices are outside the frustum (the face is fully within it).

                                vertex_count = clipping_produced_an_extra_face ? 6 : 3;
                                for (vertex_index = 0; vertex_index < vertex_count; vertex_index++)
                                    projectVertex(clipped_faces_vertex_positions[vertex_index], half_width, half_height);

                                vertex_count = clipping_produced_an_extra_face ? 2 : 1;
                                v1_index = 0;
                                v2_index = 1;
                                v3_index = 2;

                                for (vertex_index = 0; vertex_index < vertex_count; vertex_index++, v1_index += 3, v2_index += 3, v3_index += 3) {
                                    v1 = clipped_faces_vertex_positions[v1_index];
                                    v2 = clipped_faces_vertex_positions[v2_index];
                                    v3 = clipped_faces_vertex_positions[v3_index];

                                    if (viewport.show_wire_frame) {
                                        context.beginPath();
                                        context.moveTo(v1[0], v1[1]);
                                        context.lineTo(v2[0], v2[1]);
                                        context.lineTo(v3[0], v3[1]);
                                        context.lineTo(v1[0], v1[1]);
                                        context.closePath();
                                        context.strokeStyle = vertex_index ? wire_frame_clipped_color : wire_frame_color;
                                        context.stroke();
                                    } else {
                                        shadeFace(
                                            material.pixel_shader,
                                            this._shaded,
                                            this.pixels,
                                            viewport.size,

                                            v1, v2, v3,

                                            positions[v1_index],
                                            positions[v2_index],
                                            positions[v3_index],

                                            normals[v1_index],
                                            normals[v2_index],
                                            normals[v3_index],

                                            uvs[v1_index],
                                            uvs[v2_index],
                                            uvs[v3_index],

                                            mesh_has_normals,
                                            mesh_has_uvs
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < pixel_count; i++) {
            pixel_array = this.pixels.arrays[i];
            drawPixel(viewport.render_target.array, i, pixel_array[0], pixel_array[1], pixel_array[2], pixel_array[3]);
        }

        if (!viewport.show_wire_frame)
            viewport.render_target.draw();
    }
}