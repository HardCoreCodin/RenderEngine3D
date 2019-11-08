import { PRECISION_DIGITS } from "../constants.js";
import { Vector3DAllocator } from "../allocators.js";
let t_x, t_y, t_z, t_n, out_id, other_id, this_id;
let a_x, a_y, a_z, m11, m12, m13, b_x, b_y, b_z, m21, m22, m23, o_x, o_y, o_z, m31, m32, m33;
const equals = (a, b) => a_x[a].toFixed(PRECISION_DIGITS) ===
    b_x[b].toFixed(PRECISION_DIGITS) &&
    a_y[a].toFixed(PRECISION_DIGITS) ===
        b_y[b].toFixed(PRECISION_DIGITS) &&
    a_z[a].toFixed(PRECISION_DIGITS) ===
        b_z[b].toFixed(PRECISION_DIGITS);
const same = (a, b) => a === b &&
    (Object.is(a_x, b_x) || (Object.is(a_x.buffer, b_x.buffer) && a_x.offset == b_x.offset)) &&
    (Object.is(a_y, b_y) || (Object.is(a_y.buffer, b_y.buffer) && a_y.offset == b_y.offset)) &&
    (Object.is(a_z, b_z) || (Object.is(a_z.buffer, b_z.buffer) && a_z.offset == b_z.offset));
const invert = (a) => {
    a_x[a] = -a_x[a];
    a_y[a] = -a_y[a];
    a_z[a] = -a_z[a];
};
const length = (a) => Math.hypot(a_x[a], a_y[a], a_z[a]);
const distance = (a, b) => Math.hypot((b_x[b] - a_x[a]), (b_y[b] - a_y[a]), (b_z[b] - a_z[a]));
const length_squared = (a) => Math.pow(a_x[a], 2) +
    Math.pow(a_y[a], 2) +
    Math.pow(a_z[a], 2);
const distance_squared = (a, b) => (Math.pow((b_x[b] - a_x[a]), 2) +
    Math.pow((b_y[b] - a_y[a]), 2) +
    Math.pow((b_z[b] - a_z[a]), 2));
const linearly_interpolate = (a, b, o, t) => {
    o_x[o] = (1 - t) * a_x[a] + t * (b_x[b]);
    o_y[o] = (1 - t) * a_y[a] + t * (b_y[b]);
    o_z[o] = (1 - t) * a_z[a] + t * (b_z[b]);
};
const add = (a, b, o) => {
    o_x[o] = a_x[a] + b_x[b];
    o_y[o] = a_y[a] + b_y[b];
    o_z[o] = a_z[a] + b_z[b];
};
const add_in_place = (a, b) => {
    a_x[a] += b_x[b];
    a_y[a] += b_y[b];
    a_z[a] += b_z[b];
};
const subtract = (a, b, o) => {
    o_x[o] = a_x[a] - b_x[b];
    o_y[o] = a_y[a] - b_y[b];
    o_z[o] = a_z[a] - b_z[b];
};
const subtract_in_place = (a, b) => {
    a_x[a] -= b_x[b];
    a_y[a] -= b_y[b];
    a_z[a] -= b_z[b];
};
const divide = (a, o, n) => {
    o_x[o] = a_x[a] / n;
    o_y[o] = a_y[a] / n;
    o_z[o] = a_z[a] / n;
};
const divide_in_place = (a, n) => {
    a_x[a] /= n;
    a_y[a] /= n;
    a_z[a] /= n;
};
const scale = (a, o, n) => {
    o_x[o] = a_x[a] * n;
    o_y[o] = a_y[a] * n;
    o_z[o] = a_z[a] * n;
};
const scale_in_place = (a, n) => {
    a_x[a] *= n;
    a_y[a] *= n;
    a_z[a] *= n;
};
const normalize = (a, o) => {
    t_n = Math.hypot(a_x[a], a_y[a], a_z[a]);
    o_x[o] = a_x[a] / t_n;
    o_y[o] = a_y[a] / t_n;
    o_z[o] = a_z[a] / t_n;
};
const normalize_in_place = (a) => {
    t_n = Math.hypot(a_x[a], a_y[a], a_z[a]);
    a_x[a] /= t_n;
    a_y[a] /= t_n;
    a_z[a] /= t_n;
};
const dot = (a, b) => a_x[a] * b_x[b] +
    a_y[a] * b_y[b] +
    a_z[a] * b_z[b];
const cross = (a, b, o) => {
    o_x[o] = a_y[a] * b_z[b] - a_z[a] * b_y[b];
    o_y[o] = a_z[a] * b_x[b] - a_x[a] * b_z[b];
    o_z[o] = a_x[a] * b_y[b] - a_y[a] * b_x[b];
};
const cross_in_place = (a, b) => {
    t_x = a_x[a];
    t_y = a_y[a];
    t_z = a_z[a];
    a_x[a] = t_y * b_z[b] - t_z * b_y[b];
    a_y[a] = t_z * b_x[b] - t_x * b_z[b];
    a_z[a] = t_x * b_y[b] - t_y * b_x[b];
};
const multiply = (a, b, o) => {
    o_x[o] = a_x[a] * m11[b] + a_y[a] * m21[b] + a_z[a] * m31[b];
    o_y[o] = a_x[a] * m12[b] + a_y[a] * m22[b] + a_z[a] * m32[b];
    o_z[o] = a_x[a] * m13[b] + a_y[a] * m23[b] + a_z[a] * m33[b];
};
const multiply_in_place = (a, b) => {
    t_x = a_x[a];
    t_y = a_y[a];
    t_z = a_z[a];
    a_x[a] = t_x * m11[b] + t_y * m21[b] + t_z * m31[b];
    a_y[a] = t_x * m12[b] + t_y * m22[b] + t_z * m32[b];
    a_z[a] = t_x * m13[b] + t_y * m23[b] + t_z * m33[b];
};
export class Base3D {
    constructor(arrays, id = 0) {
        this.setTo = (x, y, z) => {
            this_id = this.id;
            this.xs[this_id] = x;
            this.ys[this_id] = y;
            this.zs[this_id] = z;
            return this;
        };
        if (id < 0)
            throw `ID must be positive integer, got ${id}`;
        this.id = id;
        [this.xs, this.ys, this.zs] = arrays;
    }
    set arrays(arrays) {
        this.xs = arrays[0];
        this.ys = arrays[1];
        this.zs = arrays[2];
    }
    set x(x) { this.xs[this.id] = x; }
    set y(y) { this.ys[this.id] = y; }
    set z(z) { this.zs[this.id] = z; }
    get x() { return this.xs[this.id]; }
    get y() { return this.ys[this.id]; }
    get z() { return this.zs[this.id]; }
}
class Vector3D extends Base3D {
    constructor() {
        super(...arguments);
        this.copyTo = (out) => {
            this_id = this.id;
            out_id = out.id;
            out.xs[out_id] = this.xs[this_id];
            out.ys[out_id] = this.ys[this_id];
            out.zs[out_id] = this.zs[this_id];
            return out;
        };
        this.setFromOther = (other) => {
            this_id = this.id;
            other_id = other.id;
            this.xs[this_id] = other.xs[other_id];
            this.ys[this_id] = other.ys[other_id];
            this.zs[this_id] = other.zs[other_id];
            return this;
        };
        this.isSameAs = (other) => {
            set_a(this);
            set_b(other);
            return same(this.id, other.id);
        };
        this.equals = (other) => {
            set_a(this);
            set_b(other);
            if (same(this.id, other.id))
                return true;
            return equals(this.id, other.id);
        };
        this.lerp = (to, by, out) => {
            set_a(this);
            set_b(to);
            set_o(out);
            linearly_interpolate(this.id, to.id, out.id, by);
            return out;
        };
        this.add = (other) => {
            set_a(this);
            set_b(other);
            add_in_place(this.id, other.id);
            return this;
        };
        this.sub = (other) => {
            set_a(this);
            set_b(other);
            subtract_in_place(this.id, other.id);
            return this;
        };
        this.div = (by) => {
            set_a(this);
            divide_in_place(this.id, by);
            return this;
        };
        this.mul = (factor_or_matrix) => {
            set_a(this);
            if (typeof factor_or_matrix === 'number')
                scale_in_place(this.id, factor_or_matrix);
            else {
                set_m(factor_or_matrix);
                multiply_in_place(this.id, factor_or_matrix.id);
            }
            return this;
        };
        this.plus = (other, out) => {
            // if (this.isSameAs(out))
            //     return out.add(other);
            set_a(this);
            set_b(other);
            set_o(out);
            add(this.id, other.id, out.id);
            return out;
        };
        this.minus = (other, out) => {
            // if (this.isSameAs(other) || this.equals(other)) {
            //     out_id = out.id;
            //
            //     out.xs[out_id] = out.ys[out_id] = out.zs[out_id] = 0;
            //
            //     return out;
            // }
            //
            // if (this.isSameAs(out))
            //     return out.sub(other);
            set_a(this);
            set_b(other);
            set_o(out);
            subtract(this.id, other.id, out.id);
            return out;
        };
        this.over = (by, out) => {
            if (this.isSameAs(out))
                return out.div(by);
            set_a(this);
            set_o(out);
            divide(this.id, out.id, by);
            return out;
        };
        this.times = (factor_or_matrix, out) => {
            if (this.isSameAs(out))
                return out.mul(factor_or_matrix);
            set_a(this);
            set_o(out);
            if (typeof factor_or_matrix === 'number')
                scale(this.id, out.id, factor_or_matrix);
            else {
                set_m(factor_or_matrix);
                multiply(this.id, factor_or_matrix.id, out.id);
            }
            return out;
        };
    }
}
export class Position3D extends Vector3D {
    constructor() {
        super(...arguments);
        this.squaredDistanceTo = (other) => {
            set_a(this);
            set_b(other);
            return distance_squared(this.id, other.id);
        };
        this.distanceTo = (other) => {
            set_a(this);
            set_b(other);
            return distance(this.id, other.id);
        };
        this.to = (other, out) => {
            set_a(other);
            set_b(this);
            set_o(out);
            subtract(other.id, this.id, out.id);
            return out;
        };
    }
    set x(x) { this.xs[this.id] = x; }
    set y(y) { this.ys[this.id] = y; }
    set z(z) { this.zs[this.id] = z; }
    get x() { return this.xs[this.id]; }
    get y() { return this.ys[this.id]; }
    get z() { return this.zs[this.id]; }
}
export class Direction3D extends Vector3D {
    constructor() {
        super(...arguments);
        this.dot = (other) => {
            set_a(this);
            set_b(other);
            return dot(this.id, other.id);
        };
        this.invert = () => {
            set_a(this);
            invert(this.id);
            return this;
        };
        this.normalize = () => {
            if (this.length_squared.toFixed(PRECISION_DIGITS) === '1.000')
                return this;
            set_a(this);
            normalize_in_place(this.id);
            return this;
        };
        this.normalized = (out) => {
            if (this.isSameAs(out))
                return out.normalize();
            if (this.length_squared.toFixed(PRECISION_DIGITS) === '1.000')
                return out.setFromOther(this);
            set_a(this);
            set_o(out);
            normalize(this.id, out.id);
            return out;
        };
        this.cross = (other) => {
            set_a(this);
            set_b(other);
            cross_in_place(this.id, other.id);
            return this;
        };
        this.crossedWith = (other, out) => {
            if (out.isSameAs(this))
                return out.cross(other);
            if (out.isSameAs(other)) {
                out.cross(this);
                return out.invert();
            }
            set_a(this);
            set_b(other);
            set_o(out);
            cross(this.id, other.id, out.id);
            return out;
        };
    }
    get length() {
        set_a(this);
        return length(this.id);
    }
    get length_squared() {
        set_a(this);
        return length_squared(this.id);
    }
    set x(x) { this.xs[this.id] = x; }
    set y(y) { this.ys[this.id] = y; }
    set z(z) { this.zs[this.id] = z; }
    get x() { return this.xs[this.id]; }
    get y() { return this.ys[this.id]; }
    get z() { return this.zs[this.id]; }
}
export class UVW extends Vector3D {
    set u(u) { this.xs[this.id] = u; }
    set v(v) { this.ys[this.id] = v; }
    set w(w) { this.zs[this.id] = w; }
    get u() { return this.xs[this.id]; }
    get v() { return this.ys[this.id]; }
    get w() { return this.zs[this.id]; }
}
export class RGB extends Vector3D {
    constructor() {
        super(...arguments);
        this.setGreyScale = (color) => {
            this_id = this.id;
            this.xs[this_id] = this.ys[this_id] = this.zs[this_id] = color;
            return this;
        };
    }
    set r(r) { this.xs[this.id] = r; }
    set g(g) { this.ys[this.id] = g; }
    set b(b) { this.zs[this.id] = b; }
    get r() { return this.xs[this.id]; }
    get g() { return this.ys[this.id]; }
    get b() { return this.zs[this.id]; }
}
const set_a = (a) => {
    a_x = a.xs;
    a_y = a.ys;
    a_z = a.zs;
};
const set_b = (b) => {
    b_x = b.xs;
    b_y = b.ys;
    b_z = b.zs;
};
const set_o = (o) => {
    o_x = o.xs;
    o_y = o.ys;
    o_z = o.zs;
};
const set_m = (m) => {
    m11 = m.m11;
    m21 = m.m21;
    m31 = m.m31;
    m12 = m.m12;
    m22 = m.m22;
    m32 = m.m32;
    m13 = m.m13;
    m23 = m.m23;
    m33 = m.m33;
};
export const defaultVector3DAllocator = new Vector3DAllocator(15);
export function pos3D(numberOrAllocator, y, z, allocator) {
    allocator = numberOrAllocator instanceof Vector3DAllocator ? numberOrAllocator : allocator || defaultVector3DAllocator;
    const result = new Position3D(allocator.allocate(), allocator.current);
    if (typeof numberOrAllocator === 'number')
        result.setTo(numberOrAllocator, y, z);
    return result;
}
export function dir3D(numberOrAllocator, y, z, allocator) {
    allocator = numberOrAllocator instanceof Vector3DAllocator ? numberOrAllocator : allocator || defaultVector3DAllocator;
    const result = new Direction3D(allocator.allocate(), allocator.current);
    if (typeof numberOrAllocator === 'number')
        result.setTo(numberOrAllocator, y, z);
    return result;
}
export function uvw(numberOrAllocator, v, w, allocator) {
    allocator = numberOrAllocator instanceof Vector3DAllocator ? numberOrAllocator : allocator || defaultVector3DAllocator;
    const result = new UVW(allocator.allocate(), allocator.current);
    if (typeof numberOrAllocator === 'number')
        result.setTo(numberOrAllocator, v, w);
    return result;
}
export function rgb(numberOrAllocator, g, b, allocator) {
    allocator = numberOrAllocator instanceof Vector3DAllocator ? numberOrAllocator : allocator || defaultVector3DAllocator;
    const result = new RGB(allocator.allocate(), allocator.current);
    if (typeof numberOrAllocator === 'number')
        result.setTo(numberOrAllocator, g, b);
    return result;
}
//# sourceMappingURL=vec3.js.map