import {PRECISION_DIGITS} from "../constants.js";
import {Matrix2x2} from "./mat2x2.js";

let t_x, t_y, t_n, out_id, other_id, this_id: number;
let a_x, a_y, m11, m12,
    b_x, b_y, m21, m22,
    o_x, o_y: Float32Array;

const equals = (a: number, b: number) : boolean =>
    a_x[a].toFixed(PRECISION_DIGITS) ===
    b_x[b].toFixed(PRECISION_DIGITS) &&

    a_y[a].toFixed(PRECISION_DIGITS) ===
    b_y[b].toFixed(PRECISION_DIGITS);

const same = (a: number, b: number) : boolean => a === b &&
    (Object.is(a_x, b_x) || (Object.is(a_x.buffer, b_x.buffer) && a_x.offset == b_x.offset)) &&
    (Object.is(a_y, b_y) || (Object.is(a_y.buffer, b_y.buffer) && a_y.offset == b_y.offset));

const invert = (a: number) : void => {
    a_x[a] = -a_x[a];
    a_y[a] = -a_y[a];
};

const length = (a: number) : number => Math.hypot(
    a_x[a],
    a_y[a]
);

const distance = (a: number, b: number) : number => Math.hypot(
    (b_x[b] - a_x[a]),
    (b_y[b] - a_y[a])
);

const length_squared = (a: number) : number =>
    a_x[a] ** 2 +
    a_y[a] ** 2;

const distance_squared = (a: number, b: number) : number => (
    (b_x[b] - a_x[a]) ** 2 +
    (b_y[b] - a_y[a]) ** 2
);

const linearly_interpolate = (a: number, b: number, o: number, t: number) : void => {
    o_x[o] = (1-t)*a_x[a] + t*(b_x[b]);
    o_y[o] = (1-t)*a_y[a] + t*(b_y[b]);
};

const add = (a: number, b: number, o: number) : void => {
    o_x[o] = a_x[a] + b_x[b];
    o_y[o] = a_y[a] + b_y[b];
};

const add_in_place = (a: number, b: number) : void => {
    a_x[a] += b_x[b];
    a_y[a] += b_y[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    o_x[o] = a_x[a] - b_x[b];
    o_y[o] = a_y[a] - b_y[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    a_x[a] -= b_x[b];
    a_y[a] -= b_y[b];
};

const divide = (a: number, o: number, n: number) : void => {
    o_x[o] = a_x[a] / n;
    o_y[o] = a_y[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    a_x[a] /= n;
    a_y[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    o_x[o] = a_x[a] * n;
    o_y[o] = a_y[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    a_x[a] *= n;
    a_y[a] *= n;
};

const normalize = (a: number, o: number) : void => {
    t_n = Math.hypot(
        a_x[a],
        a_y[a]
    );

    o_x[o] = a_x[a] / t_n;
    o_y[o] = a_y[a] / t_n;
};

const normalize_in_place = (a: number) : void => {
    t_n = Math.hypot(
        a_x[a],
        a_y[a]
    );

    a_x[a] /= t_n;
    a_y[a] /= t_n;
};

const dot = (a: number, b: number) : number =>
    a_x[a] * b_x[b] +
    a_y[a] * b_y[b];

const multiply = (a: number, b: number, o: number) : void => {
    o_x[o] = a_x[a]*m11[b] + a_y[a]*m21[b];
    o_y[o] = a_x[a]*m12[b] + a_y[a]*m22[b];
};

const multiply_in_place = (a: number, b: number) : void => {
    t_x = a_x[a];
    t_y = a_y[a];

    a_x[a] = t_x*m11[b] + t_y*m21[b];
    a_y[a] = t_x*m12[b] + t_y*m22[b];
};

export class Vector2D {
    constructor(
        readonly _x: Float32Array,
        readonly _y: Float32Array,

        public id: number = 0,
        // public readonly arrays: readonly [
        //     Float32Array,
        //     Float32Array,
        // ] = [_x, _y],
    ) {
        if (id < 0) throw `ID must be positive integer, got ${id}`;
    }

    readonly copyTo = (out: this) : this => {
        this_id = this.id;
        out_id = out.id;

        out._x[out_id] = this._x[this_id];
        out._y[out_id] = this._y[this_id];

        return out;
    };

    readonly setFromOther = (other: this) : this => {
        this_id = this.id;
        other_id = other.id;

        this._x[this_id] = other._x[other_id];
        this._y[this_id] = other._y[other_id];

        return this;
    };

    readonly setTo = (x: number, y: number) : this => {
        this_id = this.id;
        
        this._x[this_id] = x;
        this._y[this_id] = y;

        return this;
    };

    readonly isSameAs = (other: this) : boolean => {
        set_a(this);
        set_b(other);

        return same(this.id, other.id);
    };

    readonly equals = (other: this) : boolean => {
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

    readonly add = (other: this) : this => {
        set_a(this);
        set_b(other);

        add_in_place(this.id, other.id);

        return this;
    };

    readonly sub = (other: this) : this => {
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

    readonly mul = (factor_or_matrix: number | Matrix2x2) : this => {
        set_a(this);

        if (typeof factor_or_matrix === 'number')
            scale_in_place(this.id, factor_or_matrix);
        else {
            set_m(factor_or_matrix);

            multiply_in_place(this.id, factor_or_matrix.id);
        }

        return this;
    };

    readonly plus = (other: this, out: this) : this => {
        if (this.isSameAs(out))
            return out.add(other);

        set_a(this);
        set_b(other);
        set_o(out);

        add(this.id, other.id, out.id);

        return out;
    };

    readonly minus = (other: this, out: this) : this => {
        if (this.isSameAs(other) || this.equals(other)) {
            out_id = out.id;

            out._x[out_id] = out._y[out_id] = 0;

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

    readonly times = (factor_or_matrix: number | Matrix2x2, out: this) : this => {
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

export class Position2D extends Vector2D {
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

    readonly to = (other: this, out: Direction2D) : Direction2D => {
        set_a(other);
        set_b(this);
        set_o(out);

        subtract(other.id, this.id, out.id);

        return out;
    };

    set x(x: number) {this._x[this.id] = x}
    set y(y: number) {this._y[this.id] = y}

    get x(): number {return this._x[this.id]}
    get y(): number {return this._y[this.id]}
}

export class Direction2D extends Vector2D {
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
        if (this.length_squared === 1)
            return this;

        set_a(this);

        normalize_in_place(this.id);

        return this;
    };

    readonly normalized = (out: this) : this => {
        if (this.isSameAs(out))
            return out.normalize();

        if (this.length_squared === 1)
            return out.setFromOther(this);
        
        set_a(this);
        set_o(out);

        normalize(this.id, out.id);

        return out;
    };

    set x(x: number) {this._x[this.id] = x}
    set y(y: number) {this._y[this.id] = y}

    get x(): number {return this._x[this.id]}
    get y(): number {return this._y[this.id]}
}

export class UV2D extends Vector2D {
    set u(u: number) {this._x[this.id] = u}
    set v(v: number) {this._y[this.id] = v}

    get u(): number {return this._x[this.id]}
    get v(): number {return this._y[this.id]}
}

const set_a = (a: Vector2D) : void => {
    a_x = a._x;
    a_y = a._y;
};

const set_b = (b: Vector2D) : void => {
    b_x = b._x;
    b_y = b._y;
};

const set_o = (o: Vector2D) : void => {
    o_x = o._x;
    o_y = o._y;
};

const set_m = (m: Matrix2x2) : void => {
    m11 = m._11;  m21 = m._21;
    m12 = m._12;  m22 = m._22;
};