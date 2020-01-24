import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import {IColor3D, IColor4D} from "../_interfaces/vectors.js";


export class Color3D extends Vector3D implements IColor3D
{
    copy(out: Color3D = new Color3D()): Color3D {return out.setFrom(this)}
    setTo(r: number, g: number, b: number): this {return super.setTo(r, g, b)}
    toString(): string {return `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})`}

    get r(): number {return this.arrays[0][this.id]}
    get g(): number {return this.arrays[1][this.id]}
    get b(): number {return this.arrays[2][this.id]}

    set r(r: number) {this.arrays[0][this.id] = r}
    set g(g: number) {this.arrays[1][this.id] = g}
    set b(b: number) {this.arrays[2][this.id] = b}

    get rrr(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get rrg(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get rrb(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get rgr(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get rgg(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get rgb(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get rbr(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get rbg(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get rbb(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get grr(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get grg(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get grb(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get ggr(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get ggg(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get ggb(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get gbr(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get gbg(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get gbb(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get brr(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get brg(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get brb(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get bgr(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get bgg(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get bgb(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get bbr(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get bbg(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get bbb(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set rgb(other: Color3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set rbg(other: Color3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set grb(other: Color3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set gbr(other: Color3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set brg(other: Color3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set bgr(other: Color3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export class Color4D extends Vector4D implements IColor4D
{
    copy(out: Color4D = new Color4D()): Color4D {return out.setFrom(this)}
    setTo(r: number, g: number, b: number, a: number): this {return super.setTo(r, g, b, a)}
    toString(): string {return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a * 255})`}

    get r(): number {return this.arrays[0][this.id]}
    get g(): number {return this.arrays[1][this.id]}
    get b(): number {return this.arrays[2][this.id]}
    get a(): number {return this.arrays[3][this.id]}

    set r(r: number) {this.arrays[0][this.id] = r}
    set g(g: number) {this.arrays[1][this.id] = g}
    set b(b: number) {this.arrays[2][this.id] = b}
    set a(a: number) {this.arrays[3][this.id] = a}

    get rrr(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get rrg(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get rrb(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get rgr(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get rgg(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get rgb(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get rbr(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get rbg(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get rbb(): Color3D {return new Color3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get grr(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get grg(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get grb(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get ggr(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get ggg(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get ggb(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get gbr(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get gbg(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get gbb(): Color3D {return new Color3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get brr(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get brg(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get brb(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get bgr(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get bgg(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get bgb(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get bbr(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get bbg(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get bbb(): Color3D {return new Color3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set rgb(other: Color3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set rbg(other: Color3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set grb(other: Color3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set gbr(other: Color3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set brg(other: Color3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set bgr(other: Color3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export const rgb = (
    r: number = 0,
    g: number = r,
    b: number = r
): Color3D => new Color3D().setTo(r, g, b);

export const rgba = (
    r: number = 0,
    g: number = r,
    b: number = r,
    a: number = r
): Color4D => new Color4D().setTo(r, g, b, a);