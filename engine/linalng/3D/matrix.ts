// import Position3D from "./position.js";
// import Direction3D from "./direction.js";
// import {
//     equals,
//     isIdentity,
//     identity,
//     transpose,
//     matMatMul,
//     rotationAroundX,
//     rotationAroundY,
//     rotationAroundZ,
// } from "./arithmatic/matrix.js";
// import {
//     Buffer,
//     VectorBufferLength,
// } from "./arithmatic/constants.js";
//
// export default class Matrix3x3 {
//     constructor(
//         public m0: Buffer = new Buffer(VectorBufferLength),
//         public m1: Buffer = new Buffer(VectorBufferLength),
//         public m2: Buffer = new Buffer(VectorBufferLength),
//
//         public i: Direction3D = new Direction3D(m0),
//         public j: Direction3D = new Direction3D(m1),
//         public k: Direction3D = new Direction3D(m2)
//     ){}
//
//     get isIdentity() : boolean {
//         return isIdentity(this.m0, this.m1, this.m2);
//     }
//
//     get transposed() : Matrix3x3 {
//         return new Matrix3x3(...transpose(this.m0, this.m1, this.m2));
//     }
//
//     transpose() : Matrix3x3 {
//         transpose(this.m0, this.m1, this.m2);
//         return this;
//     }
//
//     copy(
//         new_matrix: Matrix3x3 = new Matrix3x3()
//     ) : Matrix3x3 {
//         new_matrix.m0.set(this.m0);
//         new_matrix.m1.set(this.m1);
//         new_matrix.m2.set(this.m2);
//
//         return new_matrix;
//     }
//
//     equals(
//         other: Matrix3x3,
//         precision_digits: number = 3
//     ) : boolean {
//         if (Object.is(other, this))
//             return true;
//
//         if (!(other instanceof Matrix3x3))
//             return false;
//
//         return equals(
//             this.m0,
//             this.m1,
//             this.m2,
//
//             other.m0,
//             other.m1,
//             other.m2,
//
//             precision_digits);
//     }
//
//     times(
//         rhs: Matrix3x3,
//         new_matrix: Matrix3x3 = new Matrix3x3()
//     ) : Matrix3x3 {
//         matMatMul(
//             this.m0,
//             this.m1,
//             this.m2,
//
//             rhs.m0,
//             rhs.m1,
//             rhs.m2,
//
//             new_matrix.m0,
//             new_matrix.m1,
//             new_matrix.m2
//         );
//
//         return new_matrix;
//     }
//
//     mul(rhs: Matrix3x3) : Matrix3x3 {
//         matMatMul(
//             this.m0,
//             this.m1,
//             this.m2,
//
//             rhs.m0,
//             rhs.m1,
//             rhs.m2,
//
//             this.m0,
//             this.m1,
//             this.m2
//         );
//
//         return this;
//     }
//
//     setToIdentity() : Matrix3x3 {
//         identity(this.m0, this.m1, this.m2);
//         return this
//     }
//
//     setRotationAroundX(angle=0, reset=true) : Matrix3x3 {
//         rotationAroundX(angle, reset, this.m0, this.m1, this.m2);
//         return this;
//     }
//
//     setRotationAroundY(angle: number, reset=false) : Matrix3x3 {
//         rotationAroundY(angle, reset, this.m0, this.m1, this.m2);
//         return this;
//     }
//
//     setRotationAroundZ(angle: number, reset=false) : Matrix3x3 {
//         rotationAroundZ(angle, reset, this.m0, this.m1, this.m2);
//         return this;
//     }
//
//     static Identity() : Matrix3x3 {
//         return new Matrix3x3(...identity());
//     }
//
//     static RotationX(angle=0) : Matrix3x3 {
//         return new Matrix3x3(...rotationAroundX(angle));
//     }
//
//     static RotationY(angle=0) : Matrix3x3 {
//         return new Matrix3x3(...rotationAroundY(angle));
//     }
//
//     static RotationZ(angle=0) : Matrix3x3 {
//         return new Matrix3x3(...rotationAroundZ(angle));
//     }
//
//     setTo(
//         x0: Number | Buffer | Position3D | Direction3D | Matrix3x3,
//         y0?: Number | Buffer | Position3D | Direction3D,
//         z0?: Number | Buffer | Position3D | Direction3D,
//         x1?: Number, y1?: Number, z1?: Number,
//         x2?: Number, y2?: Number, z2?: Number
//     ) : Matrix3x3 {
//         if (x0 instanceof Matrix3x3) {
//             this.m0.set(x0.m0);
//             this.m1.set(x0.m1);
//             this.m2.set(x0.m2);
//
//             return this;
//         }
//
//         if (x0 instanceof Buffer) {
//             if (x0.length === VectorBufferLength) {
//                 this.m0.set(x0);
//
//                 if (y0 instanceof Buffer && y0.length === VectorBufferLength)
//                     this.m1.set(y0);
//
//                 if (z0 instanceof Buffer && z0.length === VectorBufferLength)
//                     this.m2.set(z0);
//
//                 return this;
//             }
//         }
//
//         if (x0 instanceof Position3D || x0 instanceof Direction3D) {
//             this.m0.set(x0.buffer);
//             if (y0 instanceof Position3D || y0 instanceof Direction3D) this.m1.set(y0.buffer);
//             if (z0 instanceof Position3D || z0 instanceof Direction3D) this.m2.set(z0.buffer);
//
//             return this;
//         }
//
//         if (typeof x0 === 'number') {
//             this.m0[0] = x0;
//
//             if (typeof y0 === 'number') this.m0[1] = y0;
//             if (typeof z0 === 'number') this.m0[2] = z0;
//
//             if (typeof x1 === 'number') this.m1[4] = x1;
//             if (typeof y1 === 'number') this.m1[5] = y1;
//             if (typeof z1 === 'number') this.m1[6] = z1;
//
//             if (typeof x2 === 'number') this.m2[8] = x2;
//             if (typeof y2 === 'number') this.m2[9] = y2;
//             if (typeof z2 === 'number') this.m2[10] = z2;
//
//             return this;
//         }
//
//         throw `Invalid arguments:
// ${x0}, ${y0}, ${z0}
// ${x1}, ${y1}, ${z1}
// ${x2}, ${y2}, ${z2}`;
//     }
// }
//
// export const mat4 = (
//     x0: Number | Buffer | Position3D | Direction3D | Matrix3x3 = 1,
//     y0?: Number | Buffer | Position3D | Direction3D,
//     z0?: Number | Buffer | Position3D | Direction3D,
//     x1?: Number, y1: Number = 1, z1?: Number,
//     x2?: Number, y2?: Number, z2: Number = 1,
// ) : Matrix3x3 => new Matrix3x3().setTo(
//     x0, y0, z0,
//     x1, y1, z1,
//     x2, y2, z2
// );