import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import { VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR } from "../core/memory/allocators.js";
export class UV2D extends Vector2D {
    _getAllocator() { return VECTOR_2D_ALLOCATOR; }
    setTo(u, v) { return super.setTo(u, v); }
    copy(out = new UV2D()) { return out.setFrom(this); }
    set u(u) { this.array[0] = u; }
    set v(v) { this.array[1] = v; }
    get u() { return this.array[0]; }
    get v() { return this.array[1]; }
}
export class UV3D extends Vector3D {
    _getAllocator() { return VECTOR_3D_ALLOCATOR; }
    setTo(u, v, w) { return super.setTo(u, v, w); }
    copy(out = new UV3D()) { return out.setFrom(this); }
    set u(u) { this.array[0] = u; }
    set v(v) { this.array[1] = v; }
    set w(w) { this.array[2] = w; }
    get u() { return this.array[0]; }
    get v() { return this.array[1]; }
    get w() { return this.array[2]; }
    get uv() { return new UV2D(this.array.subarray(0, 2)); }
    get vw() { return new UV2D(this.array.subarray(1, 3)); }
    set uv(other) { this.array.set(other.array); }
    set vw(other) { this.array.set(other.array, 1); }
}
export const uv = (u = 0, v = u) => new UV2D().setTo(u, v);
export const uvw = (u = 0, v = u, w = u) => new UV3D().setTo(u, v, w);
//# sourceMappingURL=uv.js.map