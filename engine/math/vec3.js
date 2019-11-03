import { PRECISION_DIGITS } from "../constants.js";
import { AbstractVector, ColorMixin } from "./vec.js";
let tn;
const _temp_buffer = new Float32Array(15);
const t1 = _temp_buffer.slice(0, 3);
const t2 = _temp_buffer.slice(3, 6);
const tm = _temp_buffer.slice(6);
let ox;
let oy;
let oz;
let ax;
let ay;
let az;
let bx;
let by;
let bz;
let m11;
let m12;
let m13;
let m21;
let m22;
let m23;
let m31;
let m32;
let m33;
export const invert = (ai) => {
    ax[ai] = -ax[ai];
    ay[ai] = -ay[ai];
    az[ai] = -az[ai];
};
export const length = (ai) => Math.hypot(ax[ai], ay[ai], az[ai]);
export const distance = (ai, bi) => Math.hypot((bx[bi] - ax[ai]), (by[bi] - ay[ai]), (bz[bi] - az[ai]));
export const length_squared = (ai) => Math.pow(ax[ai], 2) +
    Math.pow(ay[ai], 2) +
    Math.pow(az[ai], 2);
export const distance_squared = (ai, bi) => (Math.pow((bx[bi] - ax[ai]), 2) +
    Math.pow((by[bi] - ay[ai]), 2) +
    Math.pow((bz[bi] - az[ai]), 2));
export const equals = (ai, bi) => ax[ai].toFixed(PRECISION_DIGITS) ===
    bx[bi].toFixed(PRECISION_DIGITS) &&
    ay[ai].toFixed(PRECISION_DIGITS) ===
        by[bi].toFixed(PRECISION_DIGITS) &&
    az[ai].toFixed(PRECISION_DIGITS) ===
        bz[bi].toFixed(PRECISION_DIGITS);
export const linearly_interpolate = (ai, bi, oi, t) => {
    ox[oi] = (1 - t) * ax[ai] + t * (bx[bi]);
    oy[oi] = (1 - t) * ay[ai] + t * (by[bi]);
    oz[oi] = (1 - t) * az[ai] + t * (bz[bi]);
};
export const add = (ai, bi, oi) => {
    ox[oi] = ax[ai] + bx[bi];
    oy[oi] = ay[ai] + by[bi];
    oz[oi] = az[ai] + bz[bi];
};
export const add_in_place = (ai, bi) => {
    ax[ai] += bx[bi];
    ay[ai] += by[bi];
    az[ai] += bz[bi];
};
export const subtract = (ai, bi, oi) => {
    ox[oi] = ax[ai] - bx[bi];
    oy[oi] = ay[ai] - by[bi];
    oz[oi] = az[ai] - bz[bi];
};
export const subtract_in_place = (ai, bi) => {
    ax[ai] -= bx[bi];
    ay[ai] -= by[bi];
    az[ai] -= bz[bi];
};
export const divide = (ai, oi, n) => {
    ox[oi] = ax[ai] / n;
    oy[oi] = ay[ai] / n;
    oz[oi] = az[ai] / n;
};
export const divide_in_place = (ai, n) => {
    ax[ai] /= n;
    ay[ai] /= n;
    az[ai] /= n;
};
export const scale = (ai, oi, n) => {
    ox[oi] = ax[ai] * n;
    oy[oi] = ay[ai] * n;
    oz[oi] = az[ai] * n;
};
export const scale_in_place = (ai, n) => {
    ax[ai] *= n;
    ay[ai] *= n;
    az[ai] *= n;
};
export const normalize = (ai, oi) => {
    tn = Math.hypot(ax[ai], ay[ai], az[ai]);
    ox[oi] = ax[ai] / tn;
    oy[oi] = ay[ai] / tn;
    oz[oi] = az[ai] / tn;
};
export const normalize_in_place = (ai) => {
    tn = Math.hypot(ax[ai], ay[ai], az[ai]);
    ax[ai] /= tn;
    ay[ai] /= tn;
    az[ai] /= tn;
};
export const dot = (ai, bi) => ax[ai] * bx[bi] +
    ay[ai] * by[bi] +
    az[ai] * bz[bi];
export const cross = (ai, bi, oi) => {
    ox[oi] =
        ay[ai] * bz[bi] -
            az[ai] * by[bi];
    oy[oi] =
        az[ai] * bx[bi] -
            ax[ai] * bz[bi];
    oz[oi] =
        ax[ai] * by[bi] -
            ay[ai] * bx[bi];
};
export const cross_in_place = (ai, bi) => {
    t1[0] = ax[ai];
    t1[1] = ay[ai];
    t1[2] = az[ai];
    t2[0] = bx[bi];
    t2[1] = by[bi];
    t2[2] = bz[bi];
    ax[ai] =
        t1[1] * t2[2] -
            t1[2] * t2[1];
    ay[ai] =
        t1[2] * t2[0] -
            t1[0] * t2[2];
    az[ai] =
        t1[0] * t2[1] -
            t1[1] * t2[0];
};
export const multiply = (ai, bi, oi) => {
    ox[oi] =
        ax[ai] * m11[bi] +
            ay[ai] * m21[bi] +
            az[ai] * m31[bi];
    oy[oi] =
        ax[ai] * m12[bi] +
            ay[ai] * m22[bi] +
            az[ai] * m32[bi];
    oz[oi] =
        ax[ai] * m13[bi] +
            ay[ai] * m23[bi] +
            az[ai] * m33[bi];
};
export const multiply_in_place = (ai, bi) => {
    t1[0] = ax[ai];
    t1[1] = ay[ai];
    t1[2] = az[ai];
    tm[0] = m11[bi];
    tm[1] = m12[bi];
    tm[2] = m13[bi];
    tm[3] = m21[bi];
    tm[4] = m22[bi];
    tm[5] = m23[bi];
    tm[6] = m31[bi];
    tm[7] = m32[bi];
    tm[8] = m33[bi];
    ax[ai] =
        t1[0] * tm[0] +
            t1[1] * tm[3] +
            t1[2] * tm[6];
    ay[ai] =
        t1[0] * tm[1] +
            t1[1] * tm[4] +
            t1[2] * tm[7];
    az[ai] =
        t1[0] * tm[2] +
            t1[1] * tm[5] +
            t1[2] * tm[8];
};
export class Vector3D extends AbstractVector {
    constructor() {
        super(...arguments);
        this._dim = 3;
        this.is_same = (other) => Object.is(this, other) || ((this.id === other.id) && (Object.is(this.arrays, other.arrays) ||
            Object.is(this.arrays[0], other.arrays[0]) ||
            Object.is(this.arrays[1], other.arrays[1]) ||
            Object.is(this.arrays[2], other.arrays[2]) ||
            Object.is(this.arrays[0].buffer, other.arrays[0].buffer) ||
            Object.is(this.arrays[1].buffer, other.arrays[1].buffer) ||
            Object.is(this.arrays[2].buffer, other.arrays[2].buffer)));
    }
    lerp(to, _by, out) {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = to.arrays;
        [ox, oy, oz] = out.arrays;
        linearly_interpolate(this.id, to.id, out.id, _by);
        return out;
    }
    add(other) {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        add_in_place(this.id, other.id);
        return this;
    }
    sub(other) {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        subtract_in_place(this.id, other.id);
        return this;
    }
    div(by) {
        [ax, ay, az] = this.arrays;
        divide_in_place(this.id, by);
        return this;
    }
    mul(factor_or_matrix) {
        [ax, ay, az] = this.arrays;
        if (typeof factor_or_matrix === 'number')
            scale_in_place(this.id, factor_or_matrix);
        else {
            [
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33,
            ] = factor_or_matrix.arrays;
            multiply_in_place(this.id, factor_or_matrix.id);
        }
        return this;
    }
    plus(other, out) {
        if (this.is_same(out))
            return out.add(other);
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        [ox, oy, oz] = out.arrays;
        add(this.id, other.id, out.id);
        return out;
    }
    minus(other, out) {
        if (this.is_same(other)) {
            out.arrays[0][out.id] =
                out.arrays[1][out.id] =
                    out.arrays[2][out.id] = 0;
            return out;
        }
        if (this.is_same(out))
            return out.sub(other);
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        [ox, oy, oz] = out.arrays;
        subtract(this.id, other.id, out.id);
        return out;
    }
    over(by, out) {
        if (this.is_same(out))
            return out.div(by);
        [ax, ay, az] = this.arrays;
        [ox, oy, oz] = out.arrays;
        divide(this.id, out.id, by);
        return out;
    }
    times(factor_or_matrix, out) {
        if (this.is_same(out))
            return out.mul(factor_or_matrix);
        [ax, ay, az] = this.arrays;
        [ox, oy, oz] = out.arrays;
        if (typeof factor_or_matrix === 'number')
            scale(this.id, out.id, factor_or_matrix);
        else {
            [
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33,
            ] = factor_or_matrix.arrays;
            multiply(this.id, factor_or_matrix.id, out.id);
        }
        return out;
    }
}
export class Position3D extends Vector3D {
    squaredDistanceTo(other) {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        return distance_squared(this.id, other.id);
    }
    distanceTo(other) {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        return distance(this.id, other.id);
    }
    to(other, out) {
        [ax, ay, az] = other.arrays;
        [bx, by, bz] = this.arrays;
        [ox, oy, oz] = out.arrays;
        subtract(this.id, other.id, out.id);
        return out;
    }
    set x(x) { this.arrays[0][this.id] = x; }
    set y(y) { this.arrays[1][this.id] = y; }
    set z(z) { this.arrays[2][this.id] = z; }
    get x() { return this.arrays[0][this.id]; }
    get y() { return this.arrays[1][this.id]; }
    get z() { return this.arrays[2][this.id]; }
}
export class Direction3D extends Vector3D {
    get length() {
        [ax, ay, az] = this.arrays;
        return length(this.id);
    }
    get length_squared() {
        [ax, ay, az] = this.arrays;
        return length_squared(this.id);
    }
    dot(other) {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        return dot(this.id, other.id);
    }
    invert() {
        [ax, ay, az] = this.arrays;
        invert(this.id);
        return this;
    }
    normalize() {
        if (this.length_squared === 1)
            return this;
        [ax, ay, az] = this.arrays;
        normalize_in_place(this.id);
        return this;
    }
    normalized(out) {
        if (this.is_same(out))
            return out.normalize();
        if (this.length_squared === 1)
            return out.setFromOther(this);
        [ax, ay, az] = this.arrays;
        [ox, oy, oz] = out.arrays;
        normalize(this.id, out.id);
        return out;
    }
    cross(other) {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        cross_in_place(this.id, other.id);
        return this;
    }
    crossedWith(other, out) {
        if (out.is_same(this))
            return out.cross(other);
        if (out.is_same(other)) {
            out.cross(this);
            return out.invert();
        }
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        [ox, oy, oz] = out.arrays;
        cross(this.id, other.id, out.id);
        return out;
    }
    set x(x) { this.arrays[0][this.id] = x; }
    set y(y) { this.arrays[1][this.id] = y; }
    set z(z) { this.arrays[2][this.id] = z; }
    get x() { return this.arrays[0][this.id]; }
    get y() { return this.arrays[1][this.id]; }
    get z() { return this.arrays[2][this.id]; }
}
export class UV3D extends Vector3D {
    set u(u) { this.arrays[0][this.id] = u; }
    set v(v) { this.arrays[1][this.id] = v; }
    set w(w) { this.arrays[2][this.id] = w; }
    get u() { return this.arrays[0][this.id]; }
    get v() { return this.arrays[1][this.id]; }
    get w() { return this.arrays[2][this.id]; }
}
export class Color3D extends ColorMixin(Vector3D) {
    set r(r) { this.arrays[0][this.id] = r; }
    set g(g) { this.arrays[1][this.id] = g; }
    set b(b) { this.arrays[2][this.id] = b; }
    get r() { return this.arrays[0][this.id]; }
    get g() { return this.arrays[1][this.id]; }
    get b() { return this.arrays[2][this.id]; }
}
//# sourceMappingURL=vec3.js.map