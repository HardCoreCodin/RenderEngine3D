// import Matrix4x4 from "./matrix.js";
// import Position4D from "./position.js";
// import {add, sub, minus, plus, mul, times, div, over, vecMatMul, isEqualTo} from "./arithmatic/vector.js";
// import {dot, cross, lerp} from "../3D/arithmatic/vector.js";
// import {Buffer, VectorBufferLength} from "./arithmatic/constants.js";
//
// export default class Direction4D  {
//     public buffer: Buffer;
//
//     constructor(buffer?: Buffer) {
//         if (buffer instanceof Buffer) {
//             if (buffer.length === VectorBufferLength)
//                 this.buffer = buffer;
//             else
//                 throw `Invalid buffer length ${buffer.length}`;
//         } else if (buffer === undefined || buffer === null)
//             this.buffer = new Buffer(VectorBufferLength);
//         else
//             throw `Invalid buffer ${buffer}`;
//     }
//
//     set x(x) {this.buffer[0] = x}
//     set y(y) {this.buffer[1] = y}
//     set z(z) {this.buffer[2] = z}
//     set w(w) {this.buffer[3] = w}
//
//     get x() : number {return this.buffer[0]}
//     get y() : number {return this.buffer[1]}
//     get z() : number {return this.buffer[2]}
//     get w() : number {return this.buffer[3]}
//
//     get length() : number {
//         return Math.sqrt(dot(this.buffer, this.buffer));
//     }
//
//     get norm() : Direction4D {
//         return new Direction4D(over(this.buffer, this.length));
//     }
//
//     copy(
//         new_direction: Direction4D = new Direction4D()
//     ) : Direction4D {
//         new_direction.setTo(Buffer.from(this.buffer));
//         return new_direction;
//     }
//
//     isEqualTo(
//         other: Direction4D,
//         precision_digits: number = 3
//     ) : boolean {
//         if (Object.is(other, this))
//             return true;
//
//         if (!(other instanceof Direction4D))
//             return false;
//
//         return isEqualTo(this.buffer, other.buffer, precision_digits);
//     }
//
//     normalize() : Direction4D {
//         this.div(this.length);
//         return this;
//     }
//
//     normalizeTo(normalized: Direction4D = new Direction4D()) : Direction4D {
//         over(this.buffer, this.length, normalized.buffer);
//         return normalized;
//     }
//
//     dot(dir: Direction4D | Position4D) : number {
//         return dot(this.buffer, dir.buffer);
//     }
//
//     cross(
//         dir: Direction4D,
//         new_direction: Direction4D = new Direction4D()
//     ) : Direction4D {
//         cross(this.buffer, dir.buffer, new_direction.buffer);
//         return new_direction;
//     }
//
//     lerp(
//         to: Direction4D,
//         by: number,
//         new_direction: Direction4D = new Direction4D()
//     ) : Direction4D {
//         lerp(this.buffer, to.buffer, by, new_direction.buffer);
//         return new_direction;
//     }
//
//     add(position: Direction4D | Position4D) : Direction4D {
//         add(this.buffer, position.buffer);
//         return this;
//     }
//
//     sub(position: Direction4D) : Direction4D {
//         sub(this.buffer, position.buffer);
//         return this;
//     }
//
//     mul(scalar_or_matrix: number | Matrix4x4) : Direction4D {
//         scalar_or_matrix instanceof Matrix4x4 ?
//             vecMatMul(this.buffer, scalar_or_matrix.buffer, this.buffer) :
//             mul(this.buffer, scalar_or_matrix);
//
//         return this;
//     }
//
//     div(scalar: number) : Direction4D {
//         div(this.buffer, scalar);
//         return this;
//     }
//
//     plus(
//         position_or_direction: Position4D,
//         added: Direction4D | Position4D
//     ) : Position4D;
//
//     plus(
//         position_or_direction: Direction4D,
//         added: Direction4D | Position4D
//     ) : Direction4D;
//
//     plus(
//         position_or_direction: Direction4D | Position4D,
//         added: Direction4D | Position4D = null
//     ) : Direction4D | Position4D {
//         if (added === null)
//             added = position_or_direction instanceof Direction4D ?
//                 new Direction4D() :
//                 new Position4D();
//
//         plus(this.buffer, position_or_direction.buffer, added.buffer);
//
//         return added;
//     }
//
//     minus(
//         position_or_direction: Position4D,
//         subtracted: Direction4D | Position4D
//     ) : Position4D;
//
//     minus(
//         position_or_direction: Direction4D,
//         subtracted: Direction4D | Position4D
//     ) : Direction4D;
//
//     minus(
//         position_or_direction: Direction4D | Position4D,
//         subtracted: Direction4D | Position4D = null
//     ) : Direction4D | Position4D {
//         if (subtracted === null)
//             subtracted = position_or_direction instanceof Direction4D ?
//                 new Direction4D() :
//                 new Position4D();
//
//         minus(this.buffer, position_or_direction.buffer, subtracted.buffer);
//
//         return subtracted;
//     }
//
//     over(
//         scalar: number,
//         new_direction: Direction4D = new Direction4D()
//     ) : Direction4D {
//         over(this.buffer, scalar, new_direction.buffer);
//         return new_direction;
//     }
//
//     times(
//         scalar_or_matrix: number | Matrix4x4,
//         new_direction: Direction4D = new Direction4D()
//     ) : Direction4D {
//         scalar_or_matrix instanceof Matrix4x4 ?
//             vecMatMul(this.buffer, scalar_or_matrix.buffer, new_direction.buffer) :
//             times(this.buffer, scalar_or_matrix, new_direction.buffer);
//
//         return new_direction;
//     }
//
//     setTo(
//         x: number | Buffer | Position4D | Direction4D,
//         y?: number,
//         z?: number,
//         w?: number,
//     ) : Direction4D {
//         if (x instanceof Direction4D ||
//             x instanceof Position4D) {
//
//             this.buffer.set(x.buffer);
//
//             return this;
//         }
//
//         if (x instanceof Buffer &&
//             x.length === VectorBufferLength) {
//
//             this.buffer.set(x);
//
//             return this;
//         }
//
//         if (typeof x === 'number') {
//             this.buffer[0] = x;
//
//             if (typeof y === 'number') this.buffer[1] = y;
//             if (typeof z === 'number') this.buffer[2] = z;
//             if (typeof w === 'number') this.buffer[3] = w;
//
//             return this;
//         }
//
//         throw `Invalid arguments ${x}, ${y}, ${z}, ${w}`
//     }
//
//     toPosition(new_position: Position4D = new Position4D()) : Position4D {
//         new_position.setTo(Buffer.from(this.buffer));
//         return new_position;
//     }
//
//     asPosition(new_position: Position4D = new Position4D()) : Position4D {
//         new_position.buffer = this.buffer;
//         return new_position;
//     }
// }
//
// export const dir4 = (
//     x?: number | Buffer | Position4D | Direction4D,
//     y: number = 0,
//     z: number = 0,
//     w: number = 0,
// ) : Direction4D => x === undefined ?
//     new Direction4D() :
//     new Direction4D().setTo(x, y, z, w);
//# sourceMappingURL=direction.js.map