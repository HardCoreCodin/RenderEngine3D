// import Color3D from "../3D/color.js";
// import {Buffer, VectorBufferLength} from "./arithmatic/constants.js";
// import {lerp} from "../3D/arithmatic/vector.js";
// import {add, sub, minus, plus, mul, times, div, over, equals} from "./arithmatic/vector.js";
//
// export default class Color4D  {
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
//     set r(r) {this.buffer[0] = r}
//     set g(g) {this.buffer[1] = g}
//     set b(b) {this.buffer[2] = b}
//     set a(a) {this.buffer[3] = a}
//
//     get r() : number {return this.buffer[0]}
//     get g() : number {return this.buffer[1]}
//     get b() : number {return this.buffer[2]}
//     get a() : number {return this.buffer[3]}
//
//     copy(
//         new_color: Color4D = new Color4D()
//     ) : Color4D {
//         new_color.buffer.set(Buffer.from(this.buffer));
//         return new_color;
//     }
//
//     equals(
//         other: Color4D,
//         precision_digits: number = 3
//     ) : boolean {
//         if (Object.is(other, this))
//             return true;
//
//         if (!(other instanceof Color4D))
//             return false;
//
//         return equals(this.buffer, other.buffer, precision_digits);
//     }
//
//     lerp(
//         to: Color4D,
//         by: number,
//         new_color: Color4D = new Color4D()
//     ) : Color4D {
//         lerp(this.buffer, to.buffer, by, new_color.buffer);
//         return new_color;
//     }
//
//     add(color: Color4D) : Color4D {
//         add(this.buffer, color.buffer);
//         return this;
//     }
//
//     sub(color: Color4D) : Color4D {
//         sub(this.buffer, color.buffer);
//         return this;
//     }
//
//     mul(scalar: number) : Color4D {
//         mul(this.buffer, scalar);
//         return this;
//     }
//
//     div(scalar: number) : Color4D {
//         div(this.buffer, scalar);
//         return this;
//     }
//
//     plus(
//         color: Color4D,
//         new_color: Color4D = new Color4D()
//     ) : Color4D {
//         plus(this.buffer, color.buffer, new_color.buffer);
//         return new_color;
//     }
//
//     minus(
//         color: Color4D,
//         new_color: Color4D = new Color4D()
//     ) : Color4D {
//         minus(this.buffer, color.buffer, new_color.buffer);
//         return new_color;
//     }
//
//     over(
//         scalar: number,
//         new_color: Color4D = new Color4D()
//     ) : Color4D {
//         over(this.buffer, scalar, new_color.buffer);
//         return new_color;
//     }
//
//     times(
//         scalar: number,
//         new_color: Color4D = new Color4D()
//     ) : Color4D {
//         times(this.buffer, scalar, new_color.buffer);
//         return new_color;
//     }
//
//     setGreyScale(color: number) : Color4D {
//         this.r = this.b = this.g = color;
//         return this;
//     }
//
//     setTo(
//         r: number | Buffer | Color4D | Color3D,
//         g?: number,
//         b?: number,
//         a?: number
//     ) : Color4D {
//         if (r instanceof Color4D) {
//             this.buffer.set(r.buffer);
//
//             return this;
//         } else if (r instanceof Color3D) {
//             this.buffer.set(r.buffer.subarray(0, 3));
//
//             return this;
//         } else if (r instanceof Buffer && r.length === VectorBufferLength) {
//             this.buffer.set(r);
//
//             return this;
//         } else if (typeof r === 'number') {
//             this.buffer[0] = r;
//
//             if (typeof g === 'number') this.buffer[1] = g;
//             if (typeof b === 'number') this.buffer[2] = b;
//             if (typeof a === 'number') this.buffer[3] = a;
//
//             return this;
//         }
//
//         throw `Invalid input (number/color/buffer): ${r}`;
//     }
//
//     toString() : string {
//         return `rgba(${
//             this.buffer[0] * 255
//         }, ${
//             this.buffer[1] * 255
//         }, ${
//             this.buffer[2] * 255
//         }, ${
//             this.buffer[3] * 255
//         })`
//     }
// }
//
// export const rgba = (
//     r?: number | Buffer | Color4D | Color3D,
//     g: number = 0,
//     b: number = 0,
//     a: number = 0
// ) : Color4D => r === undefined ?
//     new Color4D() :
//     new Color4D().setTo(r, g, b, a);
//# sourceMappingURL=color.js.map