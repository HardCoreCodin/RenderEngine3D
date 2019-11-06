// import {Positions3D, Positions4D} from "./position.js";
// import {Directions4D} from "./direction.js";
// import {Colors3D} from "./color.js";
//
// export default class Vertices {
//     constructor(
//         public readonly count: number,
//
//         public readonly positions: Positions4D = new Positions4D(count),
//         public readonly normals: Directions4D = new Directions4D(count),
//         public readonly colors: Colors3D = new Colors3D(count),
//         public readonly uvs: Positions3D = new Positions3D(count)
//     ) {}
//
//     at(index: number, current: Vertex = new Vertex()) : Vertex {
//         current.position.buffer = this.positions.buffer.sub_arrays[index];
//         current.normal.buffer = this.normals.buffer.sub_arrays[index];
//         current.color.buffer = this.colors.buffer.sub_arrays[index];
//         current.uvs.buffer = this.uvs.buffer.sub_arrays[index];
//
//         return current;
//     }
// }