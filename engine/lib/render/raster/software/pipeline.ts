import Geometry from "../../../nodes/geometry.js";
import Matrix4x4 from "../../../accessors/matrix4x4.js";
import RasterViewport from "../_base/viewport.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/_base.js";
import RenderTarget from "../../_base/render_target.js";
import BaseRenderPipeline from "../../_base/pipelines.js";
import {VertexPositions4D} from "../../../buffers/attributes/positions.js";
import {cube_face_vertices} from "../../../geometry/cube.js";
import {VECTOR_4D_ALLOCATOR} from "../../../memory/allocators.js";
import {T3, T4} from "../../../../types.js";
import {IRasterRenderPipeline} from "../../../_interfaces/render.js";
import {IGeometry, IMesh} from "../../../_interfaces/geometry.js";
import {rgb} from "../../../accessors/color.js";


export default class Rasterizer
    extends BaseRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport>
    implements IRasterRenderPipeline<CanvasRenderingContext2D, SoftwareRasterViewport> {
    readonly model_to_clip: Matrix4x4 = new Matrix4x4();

    cull_back_faces: boolean = false;
    protected current_max_face_count: number = 0;
    protected current_max_vertex_count: number = 0;

    protected interpolations: Float32Array;
    protected src_trg_indices: Uint32Array;
    protected src_trg_numbers: Uint8Array;
    protected vertex_flags: Uint8Array;
    protected face_flags: Uint8Array;

    protected readonly clip_space_vertex_positions = new VertexPositions4D().autoInit(8, cube_face_vertices);


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

            this.face_flags = new Uint8Array(max_face_count);
            this.clip_space_vertex_positions.arrays = VECTOR_4D_ALLOCATOR.allocateBuffer(max_face_count) as T4<Float32Array>;

            this.src_trg_numbers = new Uint8Array(max_face_count);

            max_face_count += max_face_count;
            this.interpolations = new Float32Array(max_face_count);

            max_face_count += max_face_count;
            this.src_trg_indices = new Uint32Array(max_face_count);
        }

        if (max_vertex_count > this.current_max_vertex_count) {
            this.current_max_vertex_count = max_vertex_count;
            this.face_flags = new Uint8Array(max_vertex_count);
        }
    }

    render(viewport: SoftwareRasterViewport): void {
        // if (!this.scene.mesh_geometries.mesh_count)
        //     return;

        render_target = viewport.render_target;
        render_target.clear();
        //
        // width = viewport.width;
        // height = viewport.height;
        //
        // y_start = viewport.y;
        // x_start = viewport.x;
        //
        // y_end = y_start + height;
        // x_end = x_start + width;
        //
        // pixel_index = y_start * width + x_start;
        // for (y = y_start; y < y_end; y++) {
        //     for (x = x_start; x < x_end; x++) {
        //         if (
        //             (x > (x_start + ((x_end - x_start) / 3))) && (x > (x_start + (((x_end - x_start) / 3)*2))) &&
        //             (y > (y_start + ((y_end - y_start) / 3))) && (y > (y_start + (((y_end - y_start) / 3)*2)))
        //             )
        //             render_target.putPixel(pixel_index, 1, 0, 0);
        //
        //         pixel_index++;
        //     }
        // }
        //
        // render_target.draw();

        // render_target.drawTriangle(
        //     {x: 20, y: 20},
        //     {x: 20, y: 120},
        //     {x: 120, y: 120},
        //     rgb(1, 0, 0)
        //     );

        //
        // this._updateClippingBuffers();
        //
        // let mesh: IMesh;
        // // let mesh_shader: MeshShader;
        // let mesh_geometry: IGeometry;
        // let mesh_geometries: Set<Geometry>;
        //
        // const camera = viewport.controller.camera;
        // const n = camera.view_frustum.near;
        // const world_to_clip = viewport.world_to_clip;
        // const model_to_clip = this.model_to_clip;
        // const clip_positions = this.clip_space_vertex_positions;
        // const cp = clip_positions.arrays;
        //
        // const vf = this.vertex_flags;
        // const ff = this.face_flags;
        // const cbf = this.cull_back_faces;
        // const cc = true; // Always do clipping checks
        //
        // const stn = this.src_trg_numbers;
        // const sti = this.src_trg_indices;
        // const ipl = this.interpolations;
        //
        // let fv: T3<Uint8Array | Uint16Array | Uint32Array>;
        // let v1, v2, v3: Uint8Array | Uint16Array | Uint32Array;
        // let vc, fc, result: number;
        // const pz = camera.projection_matrix.translation.z;
        //
        // for (const material of this.scene.materials) if (material instanceof SoftwareRasterMaterial) {
        //     // mesh_shader = material.mesh_shader;
        //
        //     for (mesh of material.mesh_geometries.meshes) {
        //         // fv = mesh.face_vertices.arrays;
        //         vc = mesh.vertex_count;
        //         fc = mesh.face_count;
        //
        //         // mesh_shader.bindMesh(mesh);
        //
        //         for (mesh_geometry of material.mesh_geometries.getGeometries(mesh)) if (mesh_geometry.is_renderable) {
        //             // Prepare a matrix for converting from model space to clip space:
        //             mesh_geometry.model_to_world.mul(world_to_clip, model_to_clip);
        //
        //             // Bind the inputs and outputs for the mesh shader, and execute it.
        //             // Skip this geometry if it returns a CULL flag (0):
        //             // if (mesh_shader.bindInputs(model_to_clip).bindOutputs(clip_positions).shade()) {
        //             //     // The mesh shader did not cull this geometry.
        //             //     // Cull the vertices against the view frustum:
        //             //     if (cullVertices(cp, vf, vc)) {
        //             //         // The mesh could not be determined to be outside the view frustum based on vertex culling alone.
        //             //         // Check it's faces as well and check for clipping cases:
        //             //         result = cullFaces(cp, fv, fc, ff, vf, cc, cbf, pz);
        //             //         if (result) {
        //             //             if (result === CLIP) {
        //             //
        //             //             }
        //             //         }
        //             //     }
        //             //
        //             // for (vertex_attribute of this.material.vertex_attributes) {
        //             //     if (vertex_attribute.is_shared)
        //             //         clipSharedAttribute(
        //             //             vertex_attribute.arrays,
        //             //
        //             //             this.src_trg_indices,
        //             //             this.src_trg_numbers,
        //             //             this.interpolations,
        //             //             this.face_flags,
        //             //
        //             //             clipped_vertex_attribute.arrays
        //             //         );
        //             //     else
        //             //         clipUnsharedAttribute(
        //             //             vertex_attribute.arrays,
        //             //
        //             //             this.src_trg_numbers,
        //             //             this.interpolations,
        //             //             this.face_flags,
        //             //
        //             //             clipped_vertex_attribute.arrays
        //             //         );
        //             // }
        //
        //             // Note:
        //             // Additional vertex attributes might need to be 'clipped' as well if the mesh has any:
        //             // if (this.result_flags === CLIP) {
        //             //     this.clipper.clipAttr(this.in_vertex_attribute_1, out_vertex_attribute_1);
        //             //     this.clipper.clipAttr(this.in_vertex_attribute_2, out_vertex_attribute_2);
        //             //     ...
        //             //     this.clipper.clipAttr(this.in_vertex_attribute_n, out_vertex_attribute_n);
        //             // }
        //             // }
        //         }
        //     }
        // }

        // render_target.draw();
    }
}

let width, height,
    x, x_start, x_end,
    y, y_start, y_end,

    pixel_index: number;

let render_target: RenderTarget;

// import {Matrix4x4} from "../accessors/matrix.js";
// import {VertexPositions3D, VertexPositions4D} from "../geometry/positions.js";
// import {IFaceVertices} from "../_interfaces/buffers.js";
// import {cube_face_vertices} from "../geometry/cube.js";
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
//         readonly clip_bbox_positions = new VertexPositions4D(cube_face_vertices),
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
//             this.clip_space_positions.arrays,
//             this.ndc_space_positions.arrays,
//             this.new_faces_positions.arrays,
//             this.face_vertices.arrays,
//             this.vertex_flags,
//             this.face_flags,
//             this.face_areas,
//             this.new_face_areas,
//         );
//         if (this.result_flags === CULL)
//             return CULL;
//     }
// }