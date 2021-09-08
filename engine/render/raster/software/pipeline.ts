import Geometry from "../../../nodes/geometry.js";
import Matrix4x4 from "../../../accessors/matrix4x4.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/_base.js";
import BaseRenderPipeline from "../../_base/pipelines.js";
import {VertexPositions3D, VertexPositions4D} from "../../../buffers/attributes/positions.js";
import {CUBE_FACE_VERTICES, CUBE_VERTEX_COUNT} from "../../../geometry/cube.js";
import {IRasterRenderPipeline} from "../../../core/_interfaces/render.js";
import Mesh from "../../../geometry/mesh.js";
import {FlagsBuffer1D} from "../../../buffers/flags.js";
import {cullFaces, cullVertices} from "./_core/cull.js";
import {CLIP, CULL, MAX_RENDER_TARGET_SIZE, NORMAL_SOURCING} from "../../../core/constants.js";
import {projectFaceVertexPositions, projectSomeVertexPositions, shadeFace} from "./_core/half_space.js";
import {UVs2D} from "../../../buffers/vectors.js";
import {clipFaces, IAttributeBuffers} from "./_core/clip.js";
import {rgba} from "../../../accessors/color.js";


export default class Rasterizer
    extends BaseRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport>
    implements IRasterRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport>
{
    readonly model_to_clip: Matrix4x4 = new Matrix4x4();

    protected current_max_face_count: number = 0;
    protected current_max_vertex_count: number = 0;

    protected depth_buffer = new Float32Array(MAX_RENDER_TARGET_SIZE);
    protected vertex_flags = new FlagsBuffer1D().init(CUBE_VERTEX_COUNT);
    protected face_flags = new FlagsBuffer1D().init(CUBE_FACE_VERTICES.length);
    protected readonly clip_space_vertex_positions = new VertexPositions4D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES);
    protected readonly clipped_vertex_positions = new VertexPositions4D();
    protected readonly clipped_vertex_normals = new VertexPositions3D();
    protected readonly clipped_vertex_uvs = new UVs2D();

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

        if (max_face_count > this.current_max_face_count) {
            this.current_max_face_count = max_face_count;
            this.face_flags.init(max_face_count*2);
        }

        if (max_vertex_count > this.current_max_vertex_count) {
            this.current_max_vertex_count = max_vertex_count;
            this.vertex_flags.init(max_vertex_count);
            this.clip_space_vertex_positions.init(max_vertex_count);
            this.clipped_vertex_positions.init(max_face_count*6);
            this.clipped_vertex_normals.init(max_face_count*6 + 1);
            this.clipped_vertex_uvs.init(max_face_count*4 + 1);
        }
    }

    render(viewport: SoftwareRasterViewport): void {
        if (!this.scene.mesh_geometries.mesh_count)
            return;

        viewport.render_target.clear();

        this._updateClippingBuffers();

        let mesh: Mesh;
        let mesh_geometry: Geometry;

        const half_width  = viewport.size.width  >>> 1;
        const half_height = viewport.size.height >>> 1;
        const world_to_clip = viewport.world_to_clip;
        const model_to_clip = this.model_to_clip;
        const clip_positions = this.clip_space_vertex_positions;
        const clipped_vertices = this.clipped_vertex_positions.arrays;

        const n = viewport.view_frustum.near;
        const vf = this.vertex_flags.array;
        const ff = this.face_flags.array;

        let result, face_index, vertex_index, face_count, vertex_count: number;
        const pz = viewport.projection_matrix.translation.z;

        this.depth_buffer.fill(2);

        const inputs = {
            image_size: viewport.size,
            pixel_coords: { x: 0, y: 0},
            pixel_depth: 0,
            perspective_corrected_barycentric_coords: { A: 0, B: 0, C: 0},
            normal: this.clipped_vertex_normals.arrays[this.clipped_vertex_normals.arrays.length - 1],
            uv: this.clipped_vertex_uvs.arrays[this.clipped_vertex_uvs.arrays.length - 1]
        };
        const context = viewport.render_target.context;
        const wire_frame_color = `${rgba(1)}`;
        const wire_frame_clipped_color = `${rgba(1, 0,  0)}`;
        let v1, v2, v3: Float32Array;
        const normals: [Float32Array, Float32Array, Float32Array] = [null, null, null];
        const uvs: [Float32Array, Float32Array, Float32Array] = [null, null, null];
        let mesh_has_normals, mesh_has_uvs: boolean;

        for (const material of this.scene.materials) if (material instanceof SoftwareRasterMaterial) {
            for (mesh of material.mesh_geometries.meshes) {
                mesh_has_normals = mesh.options.normal >= NORMAL_SOURCING.LOAD_VERTEX__NO_FACE;
                mesh_has_uvs = mesh.options.include_uvs;

                const attributes: IAttributeBuffers[] = mesh_has_normals || mesh_has_uvs ? [] : null;
                if (mesh_has_normals)
                    attributes.push([
                        mesh.vertices.normals.arrays,
                        mesh.face_vertices.arrays as Uint32Array[],
                        this.clipped_vertex_normals.arrays,
                        true
                    ]);
                if (mesh_has_uvs)
                    attributes.push([
                        mesh.vertices.uvs.arrays,
                        mesh.face_vertices.arrays as Uint32Array[],
                        this.clipped_vertex_uvs.arrays,
                        false
                    ]);
                for (mesh_geometry of material.mesh_geometries.getGeometries(mesh)) if (mesh_geometry.is_renderable) {
                    // Prepare a matrix for converting from model space to clip space:
                    mesh_geometry.model_to_world.mul(world_to_clip, model_to_clip);

                    // Bind the inputs and outputs for the mesh shader, and execute it.
                    // Skip this geometry if it returns a CULL flag (0):
                    if (material.mesh_shader(mesh, model_to_clip, clip_positions)) {
                        // The mesh shader did not cull this geometry.
                        // Cull the vertices against the view frustum:
                        face_count = mesh.face_count;
                        vertex_count = mesh.vertex_count;
                        if (cullVertices(clip_positions.arrays, vf, vertex_count)) {
                            // The mesh could not be determined to be outside the view frustum based on vertex culling alone.
                            // Check it's faces as well and check for clipping cases:
                            result = cullFaces(clip_positions.arrays, mesh.face_vertices.arrays, ff, vf, true, viewport.cull_back_faces, pz);
                            if (result === CULL) continue;
                            if (result === CLIP) {
                                face_count += clipFaces(clip_positions.arrays, mesh.face_vertices.arrays, vf, ff, n, clipped_vertices, attributes);
                                projectFaceVertexPositions(clipped_vertices, face_count, ff, mesh.face_count, half_width, half_height);
                            } else { // result === INSIDE :
                                projectSomeVertexPositions(clip_positions.arrays, vertex_count, vf, half_width, half_height);
                                vertex_index = 0;
                                for (const current_face_vertex_indices of mesh.face_vertices.arrays)
                                    for (const index of current_face_vertex_indices)
                                        clipped_vertices[vertex_index++].set(clip_positions.arrays[index]);

                                if (attributes) {
                                    for (const [attrs, indices, clipped_attrs] of attributes) {
                                        vertex_index = 0;
                                        for (const current_face_vertex_indices of indices)
                                            for (const index of current_face_vertex_indices)
                                                clipped_attrs[vertex_index++].set(attrs[index]);
                                    }
                                }
                            }

                            vertex_index = 0;
                            for (face_index = 0; face_index < face_count; face_index++, vertex_index += 3) {
                                if (ff[face_index]) {
                                    v1 = clipped_vertices[vertex_index];
                                    v2 = clipped_vertices[vertex_index+1];
                                    v3 = clipped_vertices[vertex_index+2];

                                    if (viewport.show_wire_frame) {
                                        context.beginPath();
                                        context.moveTo(v1[0], v1[1]);
                                        context.lineTo(v2[0], v2[1]);
                                        context.lineTo(v3[0], v3[1]);
                                        context.lineTo(v1[0], v1[1]);
                                        context.closePath();
                                        context.strokeStyle = face_index < mesh.face_count ? wire_frame_color : wire_frame_clipped_color;
                                        context.stroke();
                                    } else {
                                        if (mesh_has_normals) {
                                            normals[0] = this.clipped_vertex_normals.arrays[vertex_index];
                                            normals[1] = this.clipped_vertex_normals.arrays[vertex_index+1];
                                            normals[2] = this.clipped_vertex_normals.arrays[vertex_index+2];
                                        }
                                        if (mesh_has_uvs) {
                                            uvs[0] = this.clipped_vertex_uvs.arrays[vertex_index];
                                            uvs[1] = this.clipped_vertex_uvs.arrays[vertex_index+1];
                                            uvs[2] = this.clipped_vertex_uvs.arrays[vertex_index+2];
                                        }
                                        shadeFace(
                                            material.pixel_shader,
                                            inputs, this.depth_buffer,
                                            viewport.render_target.array,
                                            v1, v2, v3,
                                            mesh_has_normals ? normals : undefined,
                                            mesh_has_uvs ? uvs : undefined,);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!viewport.show_wire_frame)
            viewport.render_target.draw();
    }
}