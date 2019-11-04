import { PRECISION_DIGITS } from "../constants.js";
let t_x, t_y, t_z, t_w, t_n, out_id, other_id, this_id;
let a_x, a_y, a_z, a_w, b_x, b_y, b_z, b_w, o_x, o_y, o_z, o_w, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44;
const equals = (a, b) => a_x[a].toFixed(PRECISION_DIGITS) ===
    b_x[b].toFixed(PRECISION_DIGITS) &&
    a_y[a].toFixed(PRECISION_DIGITS) ===
        b_y[b].toFixed(PRECISION_DIGITS) &&
    a_z[a].toFixed(PRECISION_DIGITS) ===
        b_z[b].toFixed(PRECISION_DIGITS) &&
    a_w[a].toFixed(PRECISION_DIGITS) ===
        b_w[b].toFixed(PRECISION_DIGITS);
const same = (a, b) => a === b &&
    (Object.is(a_x, b_x) || (Object.is(a_x.buffer, b_x.buffer) && a_x.offset == b_x.offset)) &&
    (Object.is(a_y, b_y) || (Object.is(a_y.buffer, b_y.buffer) && a_y.offset == b_y.offset)) &&
    (Object.is(a_z, b_z) || (Object.is(a_z.buffer, b_z.buffer) && a_z.offset == b_z.offset)) &&
    (Object.is(a_w, b_w) || (Object.is(a_w.buffer, b_w.buffer) && a_w.offset == b_w.offset));
const invert = (a) => {
    a_x[a] = -a_x[a];
    a_y[a] = -a_y[a];
    a_z[a] = -a_z[a];
    a_w[a] = -a_w[a];
};
const length = (a) => Math.hypot(a_x[a], a_y[a], a_z[a], a_w[a]);
const distance = (a, b) => Math.hypot((b_x[b] - a_x[a]), (b_y[b] - a_y[a]), (b_z[b] - a_z[a]), (b_w[b] - a_w[a]));
const length_squared = (a) => Math.pow(a_x[a], 2) +
    Math.pow(a_y[a], 2) +
    Math.pow(a_z[a], 2) +
    Math.pow(a_w[a], 2);
const distance_squared = (a, b) => (Math.pow((b_x[b] - a_x[a]), 2) +
    Math.pow((b_y[b] - a_y[a]), 2) +
    Math.pow((b_z[b] - a_z[a]), 2) +
    Math.pow((b_w[b] - a_w[a]), 2));
const linearly_interpolate = (a, b, o, t) => {
    o_x[o] = (1 - t) * a_x[a] + t * (b_x[b]);
    o_y[o] = (1 - t) * a_y[a] + t * (b_y[b]);
    o_z[o] = (1 - t) * a_z[a] + t * (b_z[b]);
    o_w[o] = (1 - t) * a_w[a] + t * (b_w[b]);
};
const add = (a, b, o) => {
    o_x[o] = a_x[a] + b_x[b];
    o_y[o] = a_y[a] + b_y[b];
    o_z[o] = a_z[a] + b_z[b];
    o_w[o] = a_w[a] + b_w[b];
};
const add_in_place = (a, b) => {
    a_x[a] += b_x[b];
    a_y[a] += b_y[b];
    a_z[a] += b_z[b];
    a_w[a] += b_w[b];
};
const subtract = (a, b, o) => {
    o_x[o] = a_x[a] - b_x[b];
    o_y[o] = a_y[a] - b_y[b];
    o_z[o] = a_z[a] - b_z[b];
    o_w[o] = a_w[a] - b_w[b];
};
const subtract_in_place = (a, b) => {
    a_x[a] -= b_x[b];
    a_y[a] -= b_y[b];
    a_z[a] -= b_z[b];
    a_w[a] -= b_w[b];
};
const divide = (a, o, n) => {
    o_x[o] = a_x[a] / n;
    o_y[o] = a_y[a] / n;
    o_z[o] = a_z[a] / n;
    o_w[o] = a_w[a] / n;
};
const divide_in_place = (a, n) => {
    a_x[a] /= n;
    a_y[a] /= n;
    a_z[a] /= n;
    a_w[a] /= n;
};
const scale = (a, o, n) => {
    o_x[o] = a_x[a] * n;
    o_y[o] = a_y[a] * n;
    o_z[o] = a_z[a] * n;
    o_w[o] = a_w[a] * n;
};
const scale_in_place = (a, n) => {
    a_x[a] *= n;
    a_y[a] *= n;
    a_z[a] *= n;
    a_w[a] *= n;
};
const normalize = (a, o) => {
    t_n = Math.hypot(a_x[a], a_y[a], a_z[a], a_w[a]);
    o_x[o] = a_x[a] / t_n;
    o_y[o] = a_y[a] / t_n;
    o_z[o] = a_z[a] / t_n;
    o_w[o] = a_w[a] / t_n;
};
const normalize_in_place = (a) => {
    t_n = Math.hypot(a_x[a], a_y[a], a_z[a], a_w[a]);
    a_x[a] /= t_n;
    a_y[a] /= t_n;
    a_z[a] /= t_n;
    a_w[a] /= t_n;
};
const dot = (a, b) => a_x[a] * b_x[b] +
    a_y[a] * b_y[b] +
    a_z[a] * b_z[b] +
    a_w[a] * b_w[b];
const in_view = (x, y, z, w, n, f) => n <= z && z <= f &&
    -w <= y && y <= w &&
    -w <= x && x <= w;
const out_of_view = (x, y, z, w, n, f) => n > z || z > f ||
    -w > y || y > w ||
    -w > x || x > w;
const multiply = (a, b, o) => {
    o_x[o] = a_x[a] * m11[b] + a_y[a] * m21[b] + a_z[a] * m31[b] + a_w[a] * m41[b];
    o_y[o] = a_x[a] * m12[b] + a_y[a] * m22[b] + a_z[a] * m32[b] + a_w[a] * m42[b];
    o_z[o] = a_x[a] * m13[b] + a_y[a] * m23[b] + a_z[a] * m33[b] + a_w[a] * m43[b];
    o_w[o] = a_x[a] * m14[b] + a_y[a] * m24[b] + a_z[a] * m34[b] + a_w[a] * m44[b];
};
const multiply_in_place = (a, b) => {
    t_x = a_x[a];
    t_y = a_y[a];
    t_z = a_z[a];
    t_w = a_w[a];
    a_x[a] = t_x * m11[b] + t_y * m21[b] + t_z * m31[b] + t_w * m41[b];
    a_y[a] = t_x * m12[b] + t_y * m22[b] + t_z * m32[b] + t_w * m42[b];
    a_z[a] = t_x * m13[b] + t_y * m23[b] + t_z * m33[b] + t_w * m43[b];
    a_w[a] = t_x * m14[b] + t_y * m24[b] + t_z * m34[b] + t_w * m44[b];
};
class Base4D {
    constructor(_x, _y, _z, _w, id = 0) {
        this._x = _x;
        this._y = _y;
        this._z = _z;
        this._w = _w;
        this.id = id;
        if (id < 0)
            throw `ID must be positive integer, got ${id}`;
    }
}
class Vector4D extends Base4D {
    constructor() {
        super(...arguments);
        this.copyTo = (out) => {
            this_id = this.id;
            out_id = out.id;
            out._x[out_id] = this._x[this_id];
            out._y[out_id] = this._y[this_id];
            out._z[out_id] = this._z[this_id];
            out._w[out_id] = this._w[this_id];
            return out;
        };
        this.setFromOther = (other) => {
            this_id = this.id;
            other_id = other.id;
            this._x[this_id] = other._x[other_id];
            this._y[this_id] = other._y[other_id];
            this._z[this_id] = other._z[other_id];
            this._w[this_id] = other._w[other_id];
            return this;
        };
        this.setTo = (x, y, z, w) => {
            this_id = this.id;
            this._x[this_id] = x;
            this._y[this_id] = y;
            this._z[this_id] = z;
            this._w[this_id] = w;
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
            if (this.isSameAs(out))
                return out.add(other);
            set_a(this);
            set_b(other);
            set_o(out);
            add(this.id, other.id, out.id);
            return out;
        };
        this.minus = (other, out) => {
            if (this.isSameAs(other) || this.equals(other)) {
                out_id = out.id;
                out._x[out_id] = out._y[out_id] = out._z[out_id] = out._w[out_id] = 0;
                return out;
            }
            if (this.isSameAs(out))
                return out.sub(other);
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
        this.toNDC = () => this.div(this._w[this.id]);
    }
}
export class Position4D extends Vector4D {
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
        this.isInView = (near = 0, far = 1) => in_view(this._x[this.id], this._y[this.id], this._z[this.id], this._w[this.id], near, far);
        this.isOutOfView = (near = 0, far = 1) => out_of_view(this._x[this.id], this._y[this.id], this._z[this.id], this._w[this.id], near, far);
    }
    set x(x) { this._x[this.id] = x; }
    set y(y) { this._y[this.id] = y; }
    set z(z) { this._z[this.id] = z; }
    set w(w) { this._w[this.id] = w; }
    get x() { return this._x[this.id]; }
    get y() { return this._y[this.id]; }
    get z() { return this._z[this.id]; }
    get w() { return this._w[this.id]; }
}
export class Direction4D extends Vector4D {
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
    }
    get length() {
        set_a(this);
        return length(this.id);
    }
    get length_squared() {
        set_a(this);
        return length_squared(this.id);
    }
    set x(x) { this._x[this.id] = x; }
    set y(y) { this._y[this.id] = y; }
    set z(z) { this._z[this.id] = z; }
    set w(w) { this._w[this.id] = w; }
    get x() { return this._x[this.id]; }
    get y() { return this._y[this.id]; }
    get z() { return this._z[this.id]; }
    get w() { return this._w[this.id]; }
}
export class Color4D extends Vector4D {
    constructor() {
        super(...arguments);
        this.setGreyScale = (color) => {
            this_id = this.id;
            this._x[this_id] = this._y[this_id] = this._z[this_id] = this._w[this_id] = color;
            return this;
        };
    }
    set r(r) { this._x[this.id] = r; }
    set g(g) { this._y[this.id] = g; }
    set b(b) { this._z[this.id] = b; }
    set a(a) { this._w[this.id] = a; }
    get r() { return this._x[this.id]; }
    get g() { return this._y[this.id]; }
    get b() { return this._z[this.id]; }
    get a() { return this._w[this.id]; }
}
const set_a = (a) => {
    a_x = a._x;
    a_y = a._y;
    a_z = a._z;
    a_w = a._w;
};
const set_b = (b) => {
    b_x = b._x;
    b_y = b._y;
    b_z = b._z;
    b_w = b._w;
};
const set_o = (o) => {
    o_x = o._x;
    o_y = o._y;
    o_z = o._z;
    o_w = o._w;
};
const set_m = (m) => {
    m11 = m._11;
    m21 = m._21;
    m31 = m._31;
    m41 = m._41;
    m12 = m._12;
    m22 = m._22;
    m32 = m._32;
    m42 = m._42;
    m13 = m._13;
    m23 = m._23;
    m33 = m._33;
    m43 = m._43;
    m14 = m._14;
    m24 = m._24;
    m34 = m._34;
    m44 = m._44;
};
//# sourceMappingURL=vec4.js.map