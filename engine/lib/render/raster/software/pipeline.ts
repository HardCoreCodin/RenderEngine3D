import Geometry from "../../../nodes/geometry.js";
import Matrix4x4 from "../../../accessors/matrix4x4.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/_base.js";
import BaseRenderPipeline from "../../_base/pipelines.js";
import {VertexPositions4D} from "../../../buffers/attributes/positions.js";
import {CUBE_FACE_VERTICES, CUBE_VERTEX_COUNT} from "../../../geometry/cube.js";
import {IRasterRenderPipeline} from "../../../_interfaces/render.js";
import Mesh from "../../../geometry/mesh.js";
import {FlagsBuffer1D, InterpolationVertexIndicesBuffer} from "../../../buffers/flags.js";
import {cullFaces, cullVertices} from "./_core/cull.js";
import {CLIP, CULL, INSIDE, MAX_RENDER_TARGET_SIZE, NDC} from "../../../../constants.js";
import {shadePixelDepth} from "./materials/shaders/pixel.js";
import {
    projectAllVertexPositions,
    projectSomeVertexPositions,
    projectFaceVertexPositions,
    shadeFace
} from "./_core/half_space.js";
import {UVs2D} from "../../../buffers/vectors.js";
import {clipFaces} from "./_core/clip.js";
import {rgba} from "../../../accessors/color.js";


export default class Rasterizer
    extends BaseRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport>
    implements IRasterRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport>
{
    readonly model_to_clip: Matrix4x4 = new Matrix4x4();

    cull_back_faces: boolean = false;
    show_wire_frame: boolean = true;
    protected current_max_face_count: number = 0;
    protected current_max_vertex_count: number = 0;

    protected interpolations = new UVs2D();
    protected src_trg_indices = new InterpolationVertexIndicesBuffer();
    protected src_trg_numbers = new FlagsBuffer1D();

    protected depth_buffer = new Float32Array(MAX_RENDER_TARGET_SIZE);
    protected vertex_flags = new FlagsBuffer1D().init(CUBE_VERTEX_COUNT);
    protected face_flags = new FlagsBuffer1D().init(CUBE_FACE_VERTICES.length);
    protected readonly clip_space_vertex_positions = new VertexPositions4D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES);
    protected readonly clipped_vertex_positions = new VertexPositions4D();

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
            this.src_trg_numbers.init(max_face_count);
            this.interpolations.init(max_face_count);
            this.src_trg_indices.init(max_face_count);
        }

        if (max_vertex_count > this.current_max_vertex_count) {
            this.current_max_vertex_count = max_vertex_count;
            this.vertex_flags.init(max_vertex_count);
            this.clip_space_vertex_positions.init(max_vertex_count);
            this.clipped_vertex_positions.init(max_face_count*6);
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
        const cbf = this.cull_back_faces;
        const cc = true; // Always do clipping checks

        const stn = this.src_trg_numbers.array;
        const sti = this.src_trg_indices.arrays;
        const ipl = this.interpolations.arrays;

        let result, face_index, vertex_index, face_count, vertex_count: number;
        const pz = viewport.projection_matrix.translation.z;

        this.depth_buffer.fill(2);

        const inputs = {
            image_size: viewport.size,
            pixel_coords: { x: 0, y: 0},
            pixel_depth: 0
        };
        const context = viewport.context;
        const wire_frame_color = `${rgba(1)}`;
        const wire_frame_clipped_color = `${rgba(1, 0,  0)}`;

        for (const material of this.scene.materials) if (material instanceof SoftwareRasterMaterial) {
            for (mesh of material.mesh_geometries.meshes) {
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
                            result = cullFaces(clip_positions.arrays, mesh.face_vertices.arrays, ff, vf, true, true, pz);
                            if (result === CULL) continue;
                            if (result === CLIP) {
                                face_count += clipFaces(clip_positions.arrays, mesh.face_vertices.arrays, sti, stn, ipl, vf, ff, n, clipped_vertices);
                                projectFaceVertexPositions(clipped_vertices, face_count, ff, mesh.face_count, half_width, half_height);
                                // for (vertex_attribute of material.vertex_attributes) {
                                //     if (vertex_attribute.is_shared)
                                //         clipSharedAttribute(
                                //             vertex_attribute.array,
                                //
                                //             this.src_trg_indices,
                                //             this.src_trg_numbers,
                                //             this.interpolations,
                                //             this.face_flags,
                                //
                                //             clipped_vertex_attribute.array
                                //         );
                                //     else
                                //         clipUnsharedAttribute(
                                //             vertex_attribute.array,
                                //
                                //             this.src_trg_numbers,
                                //             this.interpolations,
                                //             this.face_flags,
                                //
                                //             clipped_vertex_attribute.array
                                //         );
                                // }

                                // Note:
                                // Additional vertex attributes might need to be 'clipped' as well if the mesh has any:
                                // if (this.result_flags === CLIP) {
                                //     this.clipper.clipAttr(this.in_vertex_attribute_1, out_vertex_attribute_1);
                                //     this.clipper.clipAttr(this.in_vertex_attribute_2, out_vertex_attribute_2);
                                //     ...
                                //     this.clipper.clipAttr(this.in_vertex_attribute_n, out_vertex_attribute_n);
                                // }
                                // }
                            } else { // result === INSIDE :
                                projectSomeVertexPositions(clip_positions.arrays, vertex_count, vf, half_width, half_height);
                                vertex_index = 0;
                                face_index = 0;
                                for (const current_face_vertex_indices of mesh.face_vertices.arrays) {
                                    for (const index of current_face_vertex_indices)
                                        clipped_vertices[vertex_index++].set(clip_positions.arrays[index]);
                                }
                            }

                            vertex_index = 0;
                            for (face_index = 0; face_index < face_count; face_index++) {
                                if (ff[face_index]) {
                                    const v1 = clipped_vertices[vertex_index++];
                                    const v2 = clipped_vertices[vertex_index++];
                                    const v3 = clipped_vertices[vertex_index++];

                                    if (this.show_wire_frame) {
                                        context.beginPath();
                                        context.moveTo(v1[0], v1[1]);
                                        context.lineTo(v2[0], v2[1]);
                                        context.lineTo(v3[0], v3[1]);
                                        context.lineTo(v1[0], v1[1]);
                                        context.closePath();
                                        context.strokeStyle = face_index < mesh.face_count ? wire_frame_color : wire_frame_clipped_color;
                                        context.stroke();
                                    }
                                } else
                                    vertex_index += 3;
                            }

                                // if (!(i < mesh.face_count && ff[i] === 0))
                                //     shadeFace(shadePixelDepth, inputs, this.depth_buffer, viewport.render_target.array,
                                //         clip_positions.arrays[mesh.face_vertices.arrays[i][0]],
                                //         clip_positions.arrays[mesh.face_vertices.arrays[i][1]],
                                //         clip_positions.arrays[mesh.face_vertices.arrays[i][2]]
                                //     );
                        }
                    }
                }
            }
        }

        // viewport.render_target.draw();
    }
}

// let width, height,
//     x, x_start, x_end,
//     y, y_start, y_end,
//
//     pixel_index: number;
//
// let render_target: RenderTarget;

// import {Matrix4x4} from "../accessors/matrix.js";
// import {VertexPositions3D, VertexPositions4D} from "../geometry/positions.js";
// import {IFaceVertices} from "../_interfaces/buffers.js";
// import {CUBE_FACE_VERTICES} from "../geometry/cube.js";
// import {cullVertices} from "../math/rendering/culling.js";
//
// export default class Rasterizer
// {
//     // readonly view_positions: VertexPositions3D;
//     readonly clip_space_positions: VertexPositions4D;
//     readonly ndc_space_positions: VertexPositions4D;
//     readonly new_faces_positions: VertexPositions4D;
//     protected result_flags: number;
//
//     // readonly screen_positions: VertexPositions3D;
//
//     constructor(
//         readonly face_vertices: IFaceVertices,
//         readonly local_to_world: Matrix4x4,
//         readonly local_to_clip = new Matrix4x4(),
//
//         readonly clip_bbox_positions = new VertexPositions4D(CUBE_FACE_VERTICES),
//     ) {
//         this.clip_space_positions = new VertexPositions4D(face_vertices);
//         this.ndc_space_positions = new VertexPositions4D(face_vertices);
//         this.new_faces_positions = new VertexPositions4D(face_vertices);
//     }
//
//     cullAndClip() {
//         // The bounding box is visible in the view frustum.
//         // Do the frustum check again, this time with the full mesh:
//         this.local_positions.mat4mul(this.local_to_clip, this.clip_space_positions);
//         this.result_flags = cullAndClip(
//             this.clip_space_positions.array,
//             this.ndc_space_positions.array,
//             this.new_faces_positions.array,
//             this.face_vertices.array,
//             this.vertex_flags,
//             this.face_flags,
//             this.face_areas,
//             this.new_face_areas,
//         );
//         if (this.result_flags === CULL)
//             return CULL;
//     }
// }