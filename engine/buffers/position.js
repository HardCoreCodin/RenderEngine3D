// import {Float32Buffer} from "./base.js";
// import Position3D from "../linalng/3D/position.js";
// import Position4D from "../linalng/4D/position.js";
//
// export class Positions3D {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number = 3,
//         public readonly buffer = new Float32Buffer(count, stride),
//         public readonly current = new Position3D(buffer.sub_arrays[0])
//     ) {}
//
//     at(index: number, current: Position3D = this.current) : Position3D {
//         current.buffer = this.buffer.sub_arrays[index];
//         return current;
//     }
// }
//
// export class Positions4D {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number = 4,
//         public readonly buffer = new Float32Buffer(count, stride),
//         public readonly current = new Position4D(buffer.sub_arrays[0])
//     ) {}
//
//     at(index: number, current: Position4D = this.current) : Position4D {
//         current.buffer = this.buffer.sub_arrays[index];
//         return current;
//     }
// }
//# sourceMappingURL=position.js.map