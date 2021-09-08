import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import {IColor3D, IColor4D} from "../core/interfaces/vectors.js";

export class Color3D extends Vector3D<Color3D> implements IColor3D
{
    copy(out: Color3D = new Color3D()): Color3D {return out.setFrom(this)}
    setTo(r: number, g: number, b: number): this {return super.setTo(r, g, b)}
    toString(): string {return `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})`}

    get r(): number {return this.array[0]}
    get g(): number {return this.array[1]}
    get b(): number {return this.array[2]}

    set r(r: number) {this.array[0] = r}
    set g(g: number) {this.array[1] = g}
    set b(b: number) {this.array[2] = b}
}

export class Color4D extends Vector4D<Color4D> implements IColor4D
{
    copy(out: Color4D = new Color4D()): Color4D {return out.setFrom(this)}
    setTo(r: number, g: number, b: number, a: number): this {return super.setTo(r, g, b, a)}
    toString(): string {return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a * 255})`}

    get r(): number {return this.array[0]}
    get g(): number {return this.array[1]}
    get b(): number {return this.array[2]}
    get a(): number {return this.array[3]}

    set r(r: number) {this.array[0] = r}
    set g(g: number) {this.array[1] = g}
    set b(b: number) {this.array[2] = b}
    set a(a: number) {this.array[3] = a}

    get rgb(): Color3D {return new Color3D(this.array.subarray(0, 3))}
    set rgb(other: Color3D) {this.array.set(other.array)}
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