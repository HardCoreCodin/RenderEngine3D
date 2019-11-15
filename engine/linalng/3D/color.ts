// import Color4D from "../4D/color.js";
// import {Buffer, VectorBufferLength} from "./arithmatic/constants.js";
// import {add, sub, minus, plus, mul, times, div, over, lerp, isEqualTo} from "./arithmatic/vector.js";
//
// export default class Color3D  {
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
//
//     get r() : number {return this.buffer[0]}
//     get g() : number {return this.buffer[1]}
//     get b() : number {return this.buffer[2]}
//
//     copy(
//         new_color: Color3D = new Color3D()
//     ) : Color3D {
//         new_color.buffer.set(Buffer.from(this.buffer));
//         return new_color;
//     }
//
//     isEqualTo(
//         other: Color3D,
//         precision_digits: number = 3
//     ) : boolean {
//         if (Object.is(other, this))
//             return true;
//
//         if (!(other instanceof Color3D))
//             return false;
//
//         return isEqualTo(this.buffer, other.buffer, precision_digits);
//     }
//
//     lerp(
//         to: Color3D | Color4D,
//         by: number,
//         new_color: Color3D = new Color3D()
//     ) : Color3D {
//         lerp(this.buffer, to.buffer, by, new_color.buffer);
//         return new_color;
//     }
//
//     add(color: Color3D) : Color3D {
//         add(this.buffer, color.buffer);
//         return this;
//     }
//
//     sub(color: Color3D) : Color3D {
//         sub(this.buffer, color.buffer);
//         return this;
//     }
//
//     mul(scalar: number) : Color3D {
//         mul(this.buffer, scalar);
//         return this;
//     }
//
//     div(scalar: number) : Color3D {
//         div(this.buffer, scalar);
//         return this;
//     }
//
//     plus(
//         color: Color3D,
//         new_color: Color3D = new Color3D()
//     ) : Color3D {
//         plus(this.buffer, color.buffer, new_color.buffer);
//         return new_color;
//     }
//
//     minus(
//         color: Color3D,
//         new_color: Color3D = new Color3D()
//     ) : Color3D {
//         minus(this.buffer, color.buffer, new_color.buffer);
//         return new_color;
//     }
//
//     over(
//         scalar: number,
//         new_color: Color3D = new Color3D()
//     ) : Color3D {
//         over(this.buffer, scalar, new_color.buffer);
//         return new_color;
//     }
//
//     times(
//         scalar: number,
//         new_color: Color3D = new Color3D()
//     ) : Color3D {
//         times(this.buffer, scalar, new_color.buffer);
//         return new_color;
//     }
//
//     setGreyScale(color: number) : Color3D {
//         this.buffer.fill(color);
//         return this;
//     }
//
//     setTo(
//         r: number | Buffer | Color3D | Color4D,
//         g?: number,
//         b?: number,
//     ) : Color3D {
//         if (r instanceof Color3D) {
//             this.buffer.set(r.buffer);
//
//             return this;
//         } else if (r instanceof Color4D) {
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
//
//             return this;
//         }
//
//         throw `Invalid input (number/color/buffer): ${r}`;
//     }
//
//     toString() : string {
//         return `rgb(${
//             this.buffer[0] * 255
//         }, ${
//             this.buffer[1] * 255
//         }, ${
//             this.buffer[2] * 255
//         })`
//     }
// }
//
// export const rgb = (
//     r?: number | Buffer | Color3D | Color4D,
//     g: number = 0,
//     b: number = 0,
// ) : Color3D => r === undefined ?
//     new Color3D() :
//     new Color3D().setTo(r, g, b);