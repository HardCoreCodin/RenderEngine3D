import {PRECISION_DIGITS} from "../constants.js";
import {Matrix3x3} from "./mat3x3.js";

let t_x, t_y, t_z, t_n, out_id, other_id, this_id: number;
let a_x, a_y, a_z, m11, m12, m13,
    b_x, b_y, b_z, m21, m22, m23,
    o_x, o_y, o_z, m31, m32, m33 : Float32Array;

const equals = (a: number, b: number) : boolean =>
    a_x[a].toFixed(PRECISION_DIGITS) ===
    b_x[b].toFixed(PRECISION_DIGITS) &&

    a_y[a].toFixed(PRECISION_DIGITS) ===
    b_y[b].toFixed(PRECISION_DIGITS) &&

    a_z[a].toFixed(PRECISION_DIGITS) ===
    b_z[b].toFixed(PRECISION_DIGITS);

const same = (a: number, b: number) : boolean => a === b &&
    (Object.is(a_x, b_x) || (Object.is(a_x.buffer, b_x.buffer) && a_x.offset == b_x.offset)) &&
    (Object.is(a_y, b_y) || (Object.is(a_y.buffer, b_y.buffer) && a_y.offset == b_y.offset)) &&
    (Object.is(a_z, b_z) || (Object.is(a_z.buffer, b_z.buffer) && a_z.offset == b_z.offset));

const invert = (a: number) : void => {
    a_x[a] = -a_x[a];
    a_y[a] = -a_y[a];
    a_z[a] = -a_z[a];
};

const length = (a: number) : number => Math.hypot(
    a_x[a],
    a_y[a],
    a_z[a]
);

const distance = (a: number, b: number) : number => Math.hypot(
    (b_x[b] - a_x[a]),
    (b_y[b] - a_y[a]),
    (b_z[b] - a_z[a])
);

const length_squared = (a: number) : number =>
    a_x[a] ** 2 +
    a_y[a] ** 2 +
    a_z[a] ** 2;

const distance_squared = (a: number, b: number) : number => (
    (b_x[b] - a_x[a]) ** 2 +
    (b_y[b] - a_y[a]) ** 2 +
    (b_z[b] - a_z[a]) ** 2
);

const linearly_interpolate = (a: number, b: number, o: number, t: number) : void => {
    o_x[o] = (1-t)*a_x[a] + t*(b_x[b]);
    o_y[o] = (1-t)*a_y[a] + t*(b_y[b]);
    o_z[o] = (1-t)*a_z[a] + t*(b_z[b]);
};

const add = (a: number, b: number, o: number) : void => {
    o_x[o] = a_x[a] + b_x[b];
    o_y[o] = a_y[a] + b_y[b];
    o_z[o] = a_z[a] + b_z[b];
};

const add_in_place = (a: number, b: number) : void => {
    a_x[a] += b_x[b];
    a_y[a] += b_y[b];
    a_z[a] += b_z[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    o_x[o] = a_x[a] - b_x[b];
    o_y[o] = a_y[a] - b_y[b];
    o_z[o] = a_z[a] - b_z[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    a_x[a] -= b_x[b];
    a_y[a] -= b_y[b];
    a_z[a] -= b_z[b];
};

const divide = (a: number, o: number, n: number) : void => {
    o_x[o] = a_x[a] / n;
    o_y[o] = a_y[a] / n;
    o_z[o] = a_z[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    a_x[a] /= n;
    a_y[a] /= n;
    a_z[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    o_x[o] = a_x[a] * n;
    o_y[o] = a_y[a] * n;
    o_z[o] = a_z[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    a_x[a] *= n;
    a_y[a] *= n;
    a_z[a] *= n;
};

const normalize = (a: number, o: number) : void => {
    t_n = Math.hypot(
        a_x[a],
        a_y[a],
        a_z[a]
    );

    o_x[o] = a_x[a] / t_n;
    o_y[o] = a_y[a] / t_n;
    o_z[o] = a_z[a] / t_n;
};

const normalize_in_place = (a: number) : void => {
    t_n = Math.hypot(
        a_x[a],
        a_y[a],
        a_z[a]
    );

    a_x[a] /= t_n;
    a_y[a] /= t_n;
    a_z[a] /= t_n;
};

const dot = (a: number, b: number) : number =>
    a_x[a] * b_x[b] +
    a_y[a] * b_y[b] +
    a_z[a] * b_z[b];

const cross = (a: number, b: number, o: number) : void => {
    o_x[o] = a_y[a]*b_z[b] - a_z[a]*b_y[b];
    o_y[o] = a_z[a]*b_x[b] - a_x[a]*b_z[b];
    o_z[o] = a_x[a]*b_y[b] - a_y[a]*b_x[b];
};

const cross_in_place = (a: number, b: number) : void => {
    t_x = a_x[a];
    t_y = a_y[a];
    t_z = a_z[a];

    a_x[a] = t_y*b_z[b] - t_z*b_y[b];
    a_y[a] = t_z*b_x[b] - t_x*b_z[b];
    a_z[a] = t_x*b_y[b] - t_y*b_x[b];
};

const multiply = (a: number, b: number, o: number) : void => {
    o_x[o] = a_x[a]*m11[b] + a_y[a]*m21[b] + a_z[a]*m31[b];
    o_y[o] = a_x[a]*m12[b] + a_y[a]*m22[b] + a_z[a]*m32[b];
    o_z[o] = a_x[a]*m13[b] + a_y[a]*m23[b] + a_z[a]*m33[b];
};

const multiply_in_place = (a: number, b: number) : void => {
    t_x = a_x[a];
    t_y = a_y[a];
    t_z = a_z[a];

    a_x[a] = t_x*m11[b] + t_y*m21[b] + t_z*m31[b];
    a_y[a] = t_x*m12[b] + t_y*m22[b] + t_z*m32[b];
    a_z[a] = t_x*m13[b] + t_y*m23[b] + t_z*m33[b];
};

interface IVector3D {
    _x: Float32Array,
    _y: Float32Array,
    _z: Float32Array,

    id: number
}

interface IAddSub<TOther extends IVector3D = Base3D> extends IVector3D {
    readonly add : (other: TOther) => this;
    readonly sub : (other: TOther) => this;
}

abstract class Base3D implements IVector3D {
    constructor(
        readonly _x: Float32Array,
        readonly _y: Float32Array,
        readonly _z: Float32Array,

        public id: number = 0,
    ) {
        if (id < 0) throw `ID must be positive integer, got ${id}`;
    }
}

abstract class Vector3D<TOut extends IAddSub = Direction3D, TOther extends IAddSub<TOther> = Direction3D> extends Base3D {
    readonly copyTo = (out: Base3D) : typeof out => {
        this_id = this.id;
        out_id = out.id;

        out._x[out_id] = this._x[this_id];
        out._y[out_id] = this._y[this_id];
        out._z[out_id] = this._z[this_id];

        return out;
    };

    readonly setFromOther = (other: Base3D) : this => {
        this_id = this.id;
        other_id = other.id;

        this._x[this_id] = other._x[other_id];
        this._y[this_id] = other._y[other_id];
        this._z[this_id] = other._z[other_id];

        return this;
    };

    readonly setTo = (x: number, y: number, z: number) : this => {
        this_id = this.id;

        this._x[this_id] = x;
        this._y[this_id] = y;
        this._z[this_id] = z;

        return this;
    };

    readonly isSameAs = (other: Base3D) : boolean => {
        set_a(this);
        set_b(other);

        return same(this.id, other.id);
    };

    readonly equals = (other: Base3D) : boolean => {
        set_a(this);
        set_b(other);

        if (same(this.id, other.id))
            return true;

        return equals(this.id, other.id);
    };

    readonly lerp = (to: this, by: number, out: this) : this => {
        set_a(this);
        set_b(to);
        set_o(out);

        linearly_interpolate(this.id, to.id, out.id, by);

        return out;
    };

    readonly add = (other: TOther) : this => {
        set_a(this);
        set_b(other);

        add_in_place(this.id, other.id);

        return this;
    };

    readonly sub = (other: TOther) : this => {
        set_a(this);
        set_b(other);

        subtract_in_place(this.id, other.id);

        return this;
    };

    readonly div = (by: number) : this => {
        set_a(this);

        divide_in_place(this.id, by);

        return this;
    };

    readonly mul = (factor_or_matrix: number | Matrix3x3) : this => {
        set_a(this);

        if (typeof factor_or_matrix === 'number')
            scale_in_place(this.id, factor_or_matrix);
        else {
            set_m(factor_or_matrix);

            multiply_in_place(this.id, factor_or_matrix.id);
        }

        return this;
    };

    readonly plus = (other: TOther, out: TOut) : TOut => {
        if (this.isSameAs(out))
            return out.add(other);

        set_a(this);
        set_b(other);
        set_o(out);

        add(this.id, other.id, out.id);

        return out;
    };

    readonly minus = (other: TOther, out: TOut) : TOut => {
        if (this.isSameAs(other) || this.equals(other)) {
            out_id = out.id;

            out._x[out_id] = out._y[out_id] = out._z[out_id] = 0;

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

    readonly over = (by: number, out: this) : this => {
        if (this.isSameAs(out))
            return out.div(by);

        set_a(this);
        set_o(out);

        divide(this.id, out.id, by);

        return out;
    };

    readonly times = (factor_or_matrix: number | Matrix3x3, out: this) : this => {
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

export class Position3D extends Vector3D<Position3D> {
    readonly squaredDistanceTo = (other: this) : number => {
        set_a(this);
        set_b(other);

        return distance_squared(this.id, other.id);
    };

    readonly distanceTo = (other: this) : number => {
        set_a(this);
        set_b(other);

        return distance(this.id, other.id);
    };

    readonly to = (other: this, out: Direction3D) : Direction3D => {
        set_a(other);
        set_b(this);
        set_o(out);

        subtract(other.id, this.id, out.id);

        return out;
    };

    set x(x: number) {this._x[this.id] = x}
    set y(y: number) {this._y[this.id] = y}
    set z(z: number) {this._z[this.id] = z}

    get x(): number {return this._x[this.id]}
    get y(): number {return this._y[this.id]}
    get z(): number {return this._z[this.id]}
}

export class Direction3D extends Vector3D {
    get length() : number {
        set_a(this);

        return length(this.id);
    }

    get length_squared() : number {
        set_a(this);

        return length_squared(this.id);
    }

    readonly dot = (other: this) : number => {
        set_a(this);
        set_b(other);

        return dot(this.id, other.id);
    };

    readonly invert = () : this => {
        set_a(this);

        invert(this.id);
        return this;
    };

    readonly normalize = () : this => {
        if (this.length_squared.toFixed(PRECISION_DIGITS) === '1.000')
            return this;

        set_a(this);

        normalize_in_place(this.id);

        return this;
    };

    readonly normalized = (out: this) : this => {
        if (this.isSameAs(out))
            return out.normalize();

        if (this.length_squared.toFixed(PRECISION_DIGITS) === '1.000')
            return out.setFromOther(this);

        set_a(this);
        set_o(out);

        normalize(this.id, out.id);

        return out;
    };

    readonly cross = (other: this) : this => {
        set_a(this);
        set_b(other);

        cross_in_place(this.id, other.id);

        return this;
    };

    readonly crossedWith = (other: this, out: this) : this => {
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

    set x(x: number) {this._x[this.id] = x}
    set y(y: number) {this._y[this.id] = y}
    set z(z: number) {this._z[this.id] = z}

    get x(): number {return this._x[this.id]}
    get y(): number {return this._y[this.id]}
    get z(): number {return this._z[this.id]}
}

export class UV3D extends Vector3D<UV3D, UV3D> {
    set u(u: number) {this._x[this.id] = u}
    set v(v: number) {this._y[this.id] = v}
    set w(w: number) {this._z[this.id] = w}

    get u(): number {return this._x[this.id]}
    get v(): number {return this._y[this.id]}
    get w(): number {return this._z[this.id]}
}

export class Color3D extends Vector3D<Color3D, Color3D> {
    readonly setGreyScale = (color: number) : this => {
        this_id = this.id;

        this._x[this_id] = this._y[this_id] = this._z[this_id] = color;

        return this;
    };

    set r(r: number) {this._x[this.id] = r}
    set g(g: number) {this._y[this.id] = g}
    set b(b: number) {this._z[this.id] = b}

    get r(): number {return this._x[this.id]}
    get g(): number {return this._y[this.id]}
    get b(): number {return this._z[this.id]}
}

const set_a = (a: Base3D) : void => {
    a_x = a._x;
    a_y = a._y;
    a_z = a._z;
};

const set_b = (b: Base3D) : void => {
    b_x = b._x;
    b_y = b._y;
    b_z = b._z;
};

const set_o = (o: Base3D) : void => {
    o_x = o._x;
    o_y = o._y;
    o_z = o._z;
};

const set_m = (m: Matrix3x3) : void => {
    m11 = m._11;  m21 = m._21;  m31 = m._31;
    m12 = m._12;  m22 = m._22;  m32 = m._32;
    m13 = m._13;  m23 = m._23;  m33 = m._33;
};