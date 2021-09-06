import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
export class Color3D extends Vector3D {
    copy(out = new Color3D()) { return out.setFrom(this); }
    setTo(r, g, b) { return super.setTo(r, g, b); }
    toString() { return `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})`; }
    get r() { return this.array[0]; }
    get g() { return this.array[1]; }
    get b() { return this.array[2]; }
    set r(r) { this.array[0] = r; }
    set g(g) { this.array[1] = g; }
    set b(b) { this.array[2] = b; }
}
export class Color4D extends Vector4D {
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
    get rgb() { return new Color3D(this.array.subarray(0, 3)); }
    set rgb(other) { this.array.set(other.array); }
}
export const rgb = (r = 0, g = r, b = r) => new Color3D().setTo(r, g, b);
export const rgba = (r = 0, g = r, b = r, a = r) => new Color4D().setTo(r, g, b, a);
//# sourceMappingURL=color.js.map