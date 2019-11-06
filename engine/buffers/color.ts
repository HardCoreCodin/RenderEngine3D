// import {Float32Buffer} from "./base.js";
// import Color3D from "../linalng/3D/color.js";
// import Color4D from "../linalng/4D/color.js";
// //
// // export type ColorComponentBuffer = Uint8Array;
// // export const ColorComponentBuffer = Uint8Array;
// //
// // export type ColorsBuffer = Uint8Buffer;
// // export const ColorsBuffer = Uint8Buffer;
//
// export class Colors3D {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number = 3,
//         public readonly buffer = new Float32Buffer(count, stride),
//         public readonly current = new Color3D(buffer.sub_arrays[0])
//     ) {}
//
//     at(index: number, current: Color3D = this.current) : Color3D {
//         current.buffer = this.buffer.sub_arrays[index];
//         return current;
//     }
// }
//
// export class Colors4D {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number = 4,
//         public readonly buffer = new Float32Buffer(count, stride),
//         public readonly current = new Color4D(buffer.sub_arrays[0])
//     ) {}
//
//     at(index: number, current: Color4D = this.current) : Color4D {
//         current.buffer = this.buffer.sub_arrays[index];
//         return current;
//     }
// }