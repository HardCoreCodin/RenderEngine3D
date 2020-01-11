// import {Bounds4D} from "../../../geometry/bounds.js";
// import {VertexPositions3D} from "../../../geometry/positions.js";
// import Mesh from "../../../geometry/mesh.js";
// import {cullFaces, cullVertices} from "../../../math/rendering/culling.js";
// import {CULL} from "../../../../constants.js";
// import {MeshShader} from "./base.js";
//
//
// export class BBoxCullingMeshShader extends MeshShader {
//     protected model_bbox_positions: VertexPositions3D;
//
//     bindMesh(mesh: Mesh): this {
//         this.model_bbox_positions = mesh.bbox.vertex_positions;
//
//         return super.bindMesh(mesh);
//     }
//
//     shade(): number {
//         // Transform the bounding box into clip space:
//         this.model_bbox_positions.mat4mul(this.model_to_clip, BBOX_POSISTIONS);
//
//         // Cull the bounding box against the view frustum:
//         if (
//             cullVertices(
//                 BBOX_POSISTIONS_ARRAYS,
//                 BBOX_VERTEX_FLAGS,
//                 BBOX_VERTEX_COUNT
//             ) &&
//             cullFaces(
//                 BBOX_POSISTIONS_ARRAYS,
//                 BBOX_FACE_VERTICES,
//                 BBOX_FACE_COUNT,
//                 BBOX_FACE_FLAGS,
//                 BBOX_VERTEX_FLAGS,
//             )
//         ) {
//             // The bounding box is visible in the viewport in some way.
//             return super.shade();
//         }
//
//         return CULL;
//     }
// }
//
//
//
// const BBOX_FACE_COUNT = 6;
// const BBOX_VERTEX_COUNT = 8;
// const BBOX_BOUNDS = new Bounds4D();
// const BBOX_POSISTIONS = BBOX_BOUNDS.vertex_positions;
// const BBOX_POSISTIONS_ARRAYS = BBOX_POSISTIONS.arrays;
// const BBOX_FACE_VERTICES = BBOX_POSISTIONS.face_vertices.arrays;
// const BBOX_FACE_FLAGS = new Uint8Array(BBOX_FACE_COUNT);
// const BBOX_VERTEX_FLAGS = new Uint8Array(BBOX_VERTEX_COUNT);