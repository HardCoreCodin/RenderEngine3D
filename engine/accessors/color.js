import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import { VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR, VECTOR_5D_ALLOCATOR } from "../core/memory/allocators.js";
import { toneMap } from "../core/utils.js";
export class Color3D extends Vector3D {
    _getAllocator() { return VECTOR_3D_ALLOCATOR; }
    copy(out = new Color3D()) { return out.setFrom(this); }
    setTo(r, g, b) { return super.setTo(r, g, b); }
    toString() { return `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})`; }
    get r() { return this.array[0]; }
    get g() { return this.array[1]; }
    get b() { return this.array[2]; }
    set r(r) { this.array[0] = r; }
    set g(g) { this.array[1] = g; }
    set b(b) { this.array[2] = b; }
    toneMap() {
        this.array[0] = toneMap(this.array[0]);
        this.array[1] = toneMap(this.array[1]);
        this.array[2] = toneMap(this.array[2]);
    }
}
export class Color4D extends Vector4D {
    constructor(array) {
        super(array);
        this.rgb = new Color3D(this.array);
    }
    _getAllocator() { return VECTOR_4D_ALLOCATOR; }
    copy(out = new Color4D()) { return out.setFrom(this); }
    setTo(r, g, b, a) { return super.setTo(r, g, b, a); }
    toString() { return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a * 255})`; }
    get r() { return this.array[0]; }
    get g() { return this.array[1]; }
    get b() { return this.array[2]; }
    get a() { return this.array[3]; }
    set r(r) { this.array[0] = r; }
    set g(g) { this.array[1] = g; }
    set b(b) { this.array[2] = b; }
    set a(a) { this.array[3] = a; }
}
export class Pixel extends Vector4D {
    constructor(array) {
        super(array);
        this.color = new Color3D(this.array);
        this.rgba = new Color4D(this.array);
    }
    _getAllocator() { return VECTOR_5D_ALLOCATOR; }
    copy(out = new Pixel()) { return out.setFrom(this); }
    setTo(red, green, blue, opacity) {
        super.setTo(red, green, blue, opacity);
        this.array[4] = Infinity;
        return this;
    }
    toString() { return `rgba(${this.array[0] * 255}, ${this.array[1] * 255}, ${this.array[2] * 255}, ${this.array[3] * 255})`; }
    get r() { return this.array[0]; }
    get g() { return this.array[1]; }
    get b() { return this.array[2]; }
    get a() { return this.array[3]; }
    get opacity() { return this.array[3]; }
    get depth() { return this.array[4]; }
    get z() { return this.array[4]; }
    set r(r) { this.array[0] = r; }
    set g(g) { this.array[1] = g; }
    set b(b) { this.array[2] = b; }
    set a(a) { this.array[3] = a; }
    set opacity(opacity) { this.array[3] = opacity; }
    set depth(depth) { this.array[4] = depth; }
    set z(z) { this.array[4] = z; }
}
export const rgb = (r = 0, g = r, b = r) => new Color3D().setTo(r, g, b);
export const rgba = (r = 0, g = r, b = r, a = r) => new Color4D().setTo(r, g, b, a);
//# sourceMappingURL=color.js.map