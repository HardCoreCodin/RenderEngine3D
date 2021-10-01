import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import {IColor3D, IColor4D, IPixel} from "../core/interfaces/vectors.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR, VECTOR_5D_ALLOCATOR} from "../core/memory/allocators.js";
import {toneMap} from "../core/utils.js";

export class Color3D extends Vector3D<Float32Array, Color3D> implements IColor3D
{
    protected _getAllocator() {return VECTOR_3D_ALLOCATOR}

    copy(out: Color3D = new Color3D()): Color3D {return out.setFrom(this)}
    setTo(r: number, g: number, b: number): this {return super.setTo(r, g, b)}
    toString(): string {return `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})`}

    get r(): number {return this.array[0]}
    get g(): number {return this.array[1]}
    get b(): number {return this.array[2]}

    set r(r: number) {this.array[0] = r}
    set g(g: number) {this.array[1] = g}
    set b(b: number) {this.array[2] = b}

    toneMap() {
        this.array[0] = toneMap(this.array[0]);
        this.array[1] = toneMap(this.array[1]);
        this.array[2] = toneMap(this.array[2]);
    }
}

export class Color4D extends Vector4D<Float32Array, Color4D> implements IColor4D
{
    readonly rgb: Color3D;
    protected _getAllocator() {return VECTOR_4D_ALLOCATOR}

    constructor(array?: Float32Array) {
        super(array);
        this.rgb = new Color3D(this.array);
    }

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
}

export class Pixel extends Vector4D<Float32Array, Color4D> implements IPixel
{
    protected _getAllocator() {return VECTOR_5D_ALLOCATOR}

    readonly color: Color3D;
    readonly rgba: Color4D;

    constructor(array?: Float32Array) {
        super(array);
        this.color = new Color3D(this.array);
        this.rgba = new Color4D(this.array);
    }

    copy(out: Pixel = new Pixel()): Pixel {return out.setFrom(this)}

    setTo(red: number, green: number, blue: number, opacity: number): this {
        super.setTo(red, green, blue, opacity);
        this.array[4] = Infinity;
        return this;
    }

    toString(): string {return `rgba(${this.array[0] * 255}, ${this.array[1] * 255}, ${this.array[2] * 255}, ${this.array[3] * 255})`}

    get r(): number {return this.array[0]}
    get g(): number {return this.array[1]}
    get b(): number {return this.array[2]}
    get a(): number {return this.array[3]}
    get opacity(): number {return this.array[3]}
    get depth(): number {return this.array[4]}
    get z(): number {return this.array[4]}

    set r(r: number) {this.array[0] = r}
    set g(g: number) {this.array[1] = g}
    set b(b: number) {this.array[2] = b}
    set a(a: number) {this.array[3] = a}
    set opacity(opacity: number) {this.array[3] = opacity}
    set depth(depth: number) {this.array[4] = depth}
    set z(z: number) {this.array[4] = z}
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