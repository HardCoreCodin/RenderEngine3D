// import {Matrix4x4} from "../../../accessors/matrix.js";
// import {VertexPositions3D, VertexPositions4D} from "../../../geometry/positions.js";
// import Mesh from "../../../geometry/mesh.js";
// import {INSIDE} from "../../../../constants.js";
// import {Arrays} from "../../../_interfaces/functions.js";
// import {IAccessor} from "../../../_interfaces/accessors.js";
// import {VECTOR_4D_ALLOCATOR} from "../../../memory/allocators.js";
// import {IBuffer} from "../../../_interfaces/buffers.js";
// import {FloatBuffer} from "../../../memory/buffers.js";
//
// export interface IMeshShaderInputs {
//     model_to_clip: Matrix4x4;
//     vertex_positions: VertexPositions3D;
// }
//
// export type IMeshShaderOutputs = Map<string, FloatBuffer>
//
// export abstract class MeshShader<
//     Inputs extends IMeshShaderInputs,
//     Outputs extends IMeshShaderOutputs>
// {
//     constructor(
//         public mesh: Mesh,
//         readonly max_face_count: number,
//         readonly outputs: Outputs
//     ) {
//         for (const attribute in Object.keys(this.outputs)) {
//
//         }
//     }
//     //
//     // bindMesh(mesh: Mesh): this {
//     //     this.mesh = mesh;
//     //     this.model_space_vertex_positions = mesh.data.vertices.positions;
//     //     return this;
//     // }
//     //
//     // bindInputs(inputs: IMeshShaderInputs): this {
//     //     this.model_to_clip = inputs.model_to_clip;
//     //     return this;
//     // }
//     //
//     // bindOutputs(outputs: IMeshShaderOutputs): this {
//     //     this.clip_space_vertex_position = outputs.clip_space_vertex_positions;
//     //     return this;
//     // }
//
//     shade(inputs: Inputs): number {
//         // Transform the mesh's vertex positions into clip space:
//         this.model_space_vertex_positions.mat4mul(this.model_to_clip, this.clip_space_vertex_position);
//
//         return INSIDE;
//     }
// }