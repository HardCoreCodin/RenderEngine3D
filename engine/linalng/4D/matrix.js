// import Position4D from "./position.js";
// import Direction4D from "./direction.js";
// import {
//     isEqualTo,
//     isIdentity,
//     identity,
//     inverse,
//     transpose,
//     matMatMul,
//     translation,
//     rotationAroundX,
//     rotationAroundY,
//     rotationAroundZ,
// } from "./arithmatic/matrix.js";
// import {
//     Buffer,
//
//     VectorBufferLength,
//     MatrixBufferLength,
//
//     M0_Start,
//     M1_Start,
//     M2_Start,
//     M3_Start,
//
//     M0_End,
//     M1_End,
//     M2_End,
//     M3_End,
// } from "./arithmatic/constants.js";
//
// export default class Matrix4x4 {
//     public buffer: Buffer;
//
//     public m0: Buffer;
//     public m1: Buffer;
//     public m2: Buffer;
//     public m3: Buffer;
//
//     public i: Direction4D;
//     public j: Direction4D;
//     public k: Direction4D;
//     public t: Position4D;
//
//     constructor(buffer?: Buffer) {
//         if (buffer instanceof Buffer) {
//             if (buffer.length === MatrixBufferLength)
//                 this.buffer = buffer;
//             else
//                 throw `Invalid buffer length ${buffer.length}`;
//         } else if (buffer === undefined || buffer === null)
//             this.buffer = new Buffer(MatrixBufferLength);
//         else
//             throw `Invalid buffer ${buffer}`;
//
//         this.m0 = this.buffer.subarray(M0_Start, M0_End);
//         this.m1 = this.buffer.subarray(M1_Start, M1_End);
//         this.m2 = this.buffer.subarray(M2_Start, M2_End);
//         this.m3 = this.buffer.subarray(M3_Start, M3_End);
//
//         this.i = new Direction4D(this.m0);
//         this.j = new Direction4D(this.m1);
//         this.k = new Direction4D(this.m2);
//         this.t = new Position4D(this.m3);
//     }
//
//     copy() : Matrix4x4 {
//         return new Matrix4x4(Buffer.from(this.buffer));
//     }
//
//     isEqualTo(matrix: Matrix4x4, precision_digits: number = 3) : boolean {
//         if (Object.is(matrix, this)) return true;
//         if (!(matrix instanceof Matrix4x4)) return false;
//         return isEqualTo(this.buffer, matrix.buffer, precision_digits);
//     }
//
//     get isIdentity() : boolean {return isIdentity(this.buffer)}
//
//     get inverted() : Matrix4x4 {
//         return new Matrix4x4(inverse(this.buffer));
//     }
//
//     inverse(
//         inverted: Matrix4x4 = Matrix4x4.Identity()
//     ) : Matrix4x4 {
//         inverse(this.buffer, inverted.buffer);
//         return inverted;
//     }
//
//     invert() : Matrix4x4 {
//         inverse(Buffer.from(this.buffer), this.buffer);
//         return this;
//     }
//
//     get transposed() : Matrix4x4 {
//         return new Matrix4x4(transpose(this.buffer));
//     }
//
//     transpose() : Matrix4x4 {
//         transpose(this.buffer, this.buffer);
//         return this;
//     }
//
//     times(
//         rhs: Matrix4x4,
//         new_matrix: Matrix4x4 = new Matrix4x4()
//     ) : Matrix4x4 {
//         matMatMul(this.buffer, rhs.buffer, new_matrix.buffer);
//         return new_matrix;
//     }
//
//     mul(rhs: Matrix4x4) : Matrix4x4 {
//         matMatMul(this.buffer, rhs.buffer, this.buffer);
//         return this;
//     }
//
//     setToIdentity() : Matrix4x4 {
//         identity(this.buffer);
//         return this
//     }
//
//     setRotationAroundX(angle=0, reset=true) : Matrix4x4 {
//         rotationAroundX(angle, reset, this.buffer);
//         return this;
//     }
//
//     setRotationAroundY(angle: number, reset=false) : Matrix4x4 {
//         rotationAroundY(angle, reset, this.buffer);
//         return this;
//     }
//
//     setRotationAroundZ(angle: number, reset=false) : Matrix4x4 {
//         rotationAroundZ(angle, reset, this.buffer);
//         return this;
//     }
//
//     setTranslation(
//         x: number | Buffer | Position4D | Direction4D = 0,
//         y: number = 0,
//         z: number = 0,
//         reset=false
//     ) : Matrix4x4 {
//         if (x instanceof Position4D || x instanceof Direction4D)
//             translation(x.buffer, y, z, reset, this.buffer);
//         else
//             translation(x, y, z, reset, this.buffer);
//
//         return this;
//     }
//
//     static Identity() : Matrix4x4 {
//         return new Matrix4x4(identity());
//     }
//
//     static RotationX(angle=0) : Matrix4x4 {
//         return new Matrix4x4(rotationAroundX(angle));
//     }
//
//     static RotationY(angle=0) : Matrix4x4 {
//         return new Matrix4x4(rotationAroundY(angle));
//     }
//
//     static RotationZ(angle=0) : Matrix4x4 {
//         return new Matrix4x4(rotationAroundZ(angle));
//     }
//
//     static Translation(
//         x: number | Buffer | Position4D | Direction4D = 0,
//         y: number = 0,
//         z: number = 0
//     ) : Matrix4x4 {
//         if (x instanceof Position4D || x instanceof Direction4D)
//             return new Matrix4x4(translation(x.buffer));
//
//         return new Matrix4x4(translation(x, y, z,true));
//     }
//
//     setTo(
//         x0: Number | Buffer | Position4D | Direction4D | Matrix4x4,
//         y0?: Number | Buffer | Position4D | Direction4D,
//         z0?: Number | Buffer | Position4D | Direction4D,
//         w0?: Number | Buffer | Position4D | Direction4D,
//         x1?: Number, y1?: Number, z1?: Number, w1?: Number,
//         x2?: Number, y2?: Number, z2?: Number, w2?: Number,
//         x3?: Number, y3?: Number, z3?: Number, w3?: Number,
//     ) : Matrix4x4 {
//         if (x0 instanceof Matrix4x4) {
//             this.buffer.set(x0.buffer);
//             return this;
//         }
//
//         if (x0 instanceof Buffer) {
//             if (x0.length === MatrixBufferLength) {
//                 this.buffer.set(x0);
//                 return this;
//             }
//
//             if (x0.length === VectorBufferLength) {
//                 this.m0.set(x0);
//
//                 if (y0 instanceof Buffer && y0.length === VectorBufferLength)
//                     this.m1.set(y0);
//
//                 if (z0 instanceof Buffer && z0.length === VectorBufferLength)
//                     this.m2.set(z0);
//
//                 if (w0 instanceof Buffer && w0.length === VectorBufferLength)
//                     this.m3.set(w0);
//
//                 return this;
//             }
//         }
//
//         if (x0 instanceof Position4D || x0 instanceof Direction4D) {
//             this.m0.set(x0.buffer);
//             if (y0 instanceof Position4D || y0 instanceof Direction4D) this.m1.set(y0.buffer);
//             if (z0 instanceof Position4D || z0 instanceof Direction4D) this.m2.set(z0.buffer);
//             if (w0 instanceof Position4D || w0 instanceof Direction4D) this.m3.set(w0.buffer);
//
//             return this;
//         }
//
//         if (typeof x0 === 'number') {
//             this.buffer[0] = x0;
//
//             if (typeof y0 === 'number') this.buffer[1] = y0;
//             if (typeof z0 === 'number') this.buffer[2] = z0;
//             if (typeof w0 === 'number') this.buffer[3] = w0;
//
//             if (typeof x1 === 'number') this.buffer[4] = x1;
//             if (typeof y1 === 'number') this.buffer[5] = y1;
//             if (typeof z1 === 'number') this.buffer[6] = z1;
//             if (typeof w1 === 'number') this.buffer[7] = w1;
//
//             if (typeof x2 === 'number') this.buffer[8] = x2;
//             if (typeof y2 === 'number') this.buffer[9] = y2;
//             if (typeof z2 === 'number') this.buffer[10] = z2;
//             if (typeof w2 === 'number') this.buffer[11] = w2;
//
//             if (typeof x3 === 'number') this.buffer[12] = x3;
//             if (typeof y3 === 'number') this.buffer[13] = y3;
//             if (typeof z3 === 'number') this.buffer[14] = z3;
//             if (typeof w3 === 'number') this.buffer[15] = w3;
//
//             return this;
//         }
//
//         throw `Invalid arguments:
// ${x0}, ${y0}, ${z0}, ${w0}
// ${x1}, ${y1}, ${z1}, ${w1}
// ${x2}, ${y2}, ${z2}, ${w2}
// ${x3}, ${y3}, ${z3}, ${w3}`;
//     }
// }
//
// export const mat4 = (
//     x0: Number | Buffer | Position4D | Direction4D | Matrix4x4 = 1,
//     y0?: Number | Buffer | Position4D | Direction4D,
//     z0?: Number | Buffer | Position4D | Direction4D,
//     w0?: Number | Buffer | Position4D | Direction4D,
//     x1?: Number, y1: Number = 1, z1?: Number, w1?: Number,
//     x2?: Number, y2?: Number, z2: Number = 1, w2?: Number,
//     x3?: Number, y3?: Number, z3?: Number, w3: Number = 1,
// ) : Matrix4x4 => new Matrix4x4().setTo(
//     x0, y0, z0, w0,
//     x1, y1, z1, w1,
//     x2, y2, z2, w2,
//     x3, y3, z3, w3
// );
//# sourceMappingURL=matrix.js.map