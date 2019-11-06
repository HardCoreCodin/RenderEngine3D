// import {Float32Buffer} from "./base.js";
// import Direction3D from "../linalng/3D/direction.js";
// import Direction4D from "../linalng/4D/direction.js";
//
// export class Directions3D {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number = 3,
//         public readonly buffer = new Float32Buffer(count, stride),
//         public readonly current = new Direction3D(buffer.sub_arrays[0])
//     ) {}
//
//     at(index: number, current: Direction3D = this.current) : Direction3D {
//         current.buffer = this.buffer.sub_arrays[index];
//         return current;
//     }
// }
//
// export class Directions4D {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number = 4,
//         public readonly buffer = new Float32Buffer(count, stride),
//         public readonly current = new Direction4D(buffer.sub_arrays[0])
//     ) {}
//
//     at(index: number, current: Direction4D = this.current) : Direction4D {
//         current.buffer = this.buffer.sub_arrays[index];
//         return current;
//     }
// }
//# sourceMappingURL=direction.js.map