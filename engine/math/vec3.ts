import {PRECISION_DIGITS} from "../constants.js";
import {Vector3DValues} from "../types.js";
import {AbstractVector, ColorMixin} from "./vec.js";
import {BaseMatrix} from "./base.js";

let tn: number;
const _temp_buffer = new Float32Array(15);
const t1 = _temp_buffer.slice(0, 3);
const t2 = _temp_buffer.slice(3, 6);
const tm = _temp_buffer.slice(6);

let ox: Float32Array;
let oy: Float32Array;
let oz: Float32Array;

let ax: Float32Array;
let ay: Float32Array;
let az: Float32Array;

let bx: Float32Array;
let by: Float32Array;
let bz: Float32Array;

let m11: Float32Array;
let m12: Float32Array;
let m13: Float32Array;

let m21: Float32Array;
let m22: Float32Array;
let m23: Float32Array;

let m31: Float32Array;
let m32: Float32Array;
let m33: Float32Array;

export const invert = (ai: number) : void => {
    ax[ai] = -ax[ai];
    ay[ai] = -ay[ai];
    az[ai] = -az[ai];
};

export const length = (ai: number) : number => Math.hypot(
    ax[ai],
    ay[ai],
    az[ai]
);

export const distance = (ai: number, bi: number) : number => Math.hypot(
    (bx[bi] - ax[ai]),
    (by[bi] - ay[ai]),
    (bz[bi] - az[ai])
);

export const length_squared = (ai: number) : number =>
    ax[ai] ** 2 +
    ay[ai] ** 2 +
    az[ai] ** 2;

export const distance_squared = (ai: number, bi: number) : number => (
    (bx[bi] - ax[ai]) ** 2 +
    (by[bi] - ay[ai]) ** 2 +
    (bz[bi] - az[ai]) ** 2
);

export const equals = (ai: number, bi: number) : boolean =>
    ax[ai].toFixed(PRECISION_DIGITS) ===
    bx[bi].toFixed(PRECISION_DIGITS) &&
    ay[ai].toFixed(PRECISION_DIGITS) ===
    by[bi].toFixed(PRECISION_DIGITS) &&
    az[ai].toFixed(PRECISION_DIGITS) ===
    bz[bi].toFixed(PRECISION_DIGITS);

export const linearly_interpolate = (ai: number, bi: number, oi: number, t: number) : void => {
    ox[oi] = (1-t)*ax[ai] + t*(bx[bi]);
    oy[oi] = (1-t)*ay[ai] + t*(by[bi]);
    oz[oi] = (1-t)*az[ai] + t*(bz[bi]);
};

export const add = (ai: number, bi: number, oi: number) : void => {
    ox[oi] = ax[ai] + bx[bi];
    oy[oi] = ay[ai] + by[bi];
    oz[oi] = az[ai] + bz[bi];
};

export const add_in_place = (ai: number, bi: number) : void => {
    ax[ai] += bx[bi];
    ay[ai] += by[bi];
    az[ai] += bz[bi];
};

export const subtract = (ai: number, bi: number, oi: number) : void => {
    ox[oi] = ax[ai] - bx[bi];
    oy[oi] = ay[ai] - by[bi];
    oz[oi] = az[ai] - bz[bi];
};

export const subtract_in_place = (ai: number, bi: number) : void => {
    ax[ai] -= bx[bi];
    ay[ai] -= by[bi];
    az[ai] -= bz[bi];
};

export const divide = (ai: number, oi: number, n: number) : void => {
    ox[oi] = ax[ai] / n;
    oy[oi] = ay[ai] / n;
    oz[oi] = az[ai] / n;
};

export const divide_in_place = (ai: number, n: number) : void => {
    ax[ai] /= n;
    ay[ai] /= n;
    az[ai] /= n;
};

export const scale = (ai: number, oi: number, n: number) : void => {
    ox[oi] = ax[ai] * n;
    oy[oi] = ay[ai] * n;
    oz[oi] = az[ai] * n;
};

export const scale_in_place = (ai: number, n: number) : void => {
    ax[ai] *= n;
    ay[ai] *= n;
    az[ai] *= n;
};

export const normalize = (ai: number, oi: number) : void => {
    tn = Math.hypot(
        ax[ai],
        ay[ai],
        az[ai]
    );

    ox[oi] = ax[ai] / tn;
    oy[oi] = ay[ai] / tn;
    oz[oi] = az[ai] / tn;
};

export const normalize_in_place = (ai: number) : void => {
    tn = Math.hypot(
        ax[ai],
        ay[ai],
        az[ai]
    );

    ax[ai] /= tn;
    ay[ai] /= tn;
    az[ai] /= tn;
};

export const dot = (ai: number, bi: number) : number =>
    ax[ai] * bx[bi] +
    ay[ai] * by[bi] +
    az[ai] * bz[bi];

export const cross = (ai: number, bi: number, oi: number) : void => {
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

export const cross_in_place = (ai: number, bi: number) : void => {
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

export const multiply = (ai: number, bi: number, oi: number) : void => {
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

export const multiply_in_place = (ai: number, bi: number) : void => {
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
    public arrays: Vector3DValues;
    protected _dim: number = 3;

    is_same = (other: this) : boolean =>
        Object.is(this, other) || ((this.id === other.id) && (
        Object.is(this.arrays, other.arrays) ||
        Object.is(this.arrays[0], other.arrays[0]) ||
        Object.is(this.arrays[1], other.arrays[1]) ||
        Object.is(this.arrays[2], other.arrays[2]) ||
        Object.is(this.arrays[0].buffer, other.arrays[0].buffer) ||
        Object.is(this.arrays[1].buffer, other.arrays[1].buffer) ||
        Object.is(this.arrays[2].buffer, other.arrays[2].buffer) ));

    lerp(to: this, _by: number, out: this) : this {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = to.arrays;
        [ox, oy, oz] = out.arrays;

        linearly_interpolate(this.id, to.id, out.id, _by);

        return out;
    }

    add(other: this) : this {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;

        add_in_place(this.id, other.id);

        return this;
    }

    sub(other: this) : this {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;

        subtract_in_place(this.id, other.id);

        return this;
    }

    div(by: number) : this {
        [ax, ay, az] = this.arrays;

        divide_in_place(this.id, by);

        return this;
    }

    mul(factor_or_matrix: number | BaseMatrix) : this {
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

    plus(other: this, out: this) : this {
        if (this.is_same(out))
            return out.add(other);

        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;
        [ox, oy, oz] = out.arrays;

        add(this.id, other.id, out.id);

        return out;
    }

    minus(other: this, out: this) : this {
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

    over(by: number, out: this) : this {
        if (this.is_same(out))
            return out.div(by);

        [ax, ay, az] = this.arrays;
        [ox, oy, oz] = out.arrays;

        divide(this.id, out.id, by);

        return out;
    }

    times(factor_or_matrix: number | BaseMatrix, out: this) : this {
        if (this.is_same(out))
            return out.mul(factor_or_matrix);

        [ax, ay, az] = this.arrays;
        [ox, oy, oz] = out.arrays;

        if (typeof factor_or_matrix === 'number')
            scale(this.id, out.id, factor_or_matrix);
        else{
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
    squaredDistanceTo(other: this) : number {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;

        return distance_squared(this.id, other.id);
    }

    distanceTo(other: this) : number {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;

        return distance(this.id, other.id);
    }

    to(other: this, out: Direction3D) : Direction3D {
        [ax, ay, az] = other.arrays;
        [bx, by, bz] = this.arrays;
        [ox, oy, oz] = out.arrays;

        subtract(this.id, other.id, out.id);

        return out;
    }

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}
}

export class Direction3D extends Vector3D {
    get length() : number {
        [ax, ay, az] = this.arrays;

        return length(this.id);
    }

    get length_squared() : number {
        [ax, ay, az] = this.arrays;

        return length_squared(this.id);
    }

    dot(other: this) : number {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;

        return dot(this.id, other.id);
    }

    invert() : this {
        [ax, ay, az] = this.arrays;
        invert(this.id);
        return this;
    }

    normalize() : this {
        if (this.length_squared === 1)
            return this;

        [ax, ay, az] = this.arrays;
        normalize_in_place(this.id);

        return this;
    }

    normalized(out: this) : this {
        if (this.is_same(out))
            return out.normalize();

        if (this.length_squared === 1)
            return out.setFromOther(this);

        [ax, ay, az] = this.arrays;
        [ox, oy, oz] = out.arrays;

        normalize(this.id, out.id);

        return out;
    }

    cross(other: this) : this {
        [ax, ay, az] = this.arrays;
        [bx, by, bz] = other.arrays;

        cross_in_place(this.id, other.id);

        return this;
    }

    crossedWith(other: this, out: this) : this {
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

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}
}

export class UV3D extends Vector3D {
    set u(u: number) {this.arrays[0][this.id] = u}
    set v(v: number) {this.arrays[1][this.id] = v}
    set w(w: number) {this.arrays[2][this.id] = w}

    get u(): number {return this.arrays[0][this.id]}
    get v(): number {return this.arrays[1][this.id]}
    get w(): number {return this.arrays[2][this.id]}
}

export class Color3D extends ColorMixin(Vector3D) {
    set r(r: number) {this.arrays[0][this.id] = r}
    set g(g: number) {this.arrays[1][this.id] = g}
    set b(b: number) {this.arrays[2][this.id] = b}

    get r(): number {return this.arrays[0][this.id]}
    get g(): number {return this.arrays[1][this.id]}
    get b(): number {return this.arrays[2][this.id]}
}