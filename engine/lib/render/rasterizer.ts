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