import {PRECISION_DIGITS} from "../constants.js";
import {Direction2D} from "./vec2.js";

let m11, m12,
    m21, m22,

    sin,
    cos,
    out_id,
    this_id,
    other_id: number;

let a11, a12,
    a21, a22,

    b11, b12,
    b21, b22,

    o11, o12,
    o21, o22: Float32Array;

const set_to_identity = (a: number) : void => {
    a11[a] = a22[a] = 1;
    a12[a] = a21[a] = 0;
};

const transpose = (a: number, o: number) : void => {
    o11[o] = a11[a];  o21[o] = a12[a];
    o12[o] = a21[a];  o22[o] = a22[a];
};

const transpose_in_place = (a: number) : void => {[
    a12[a], a21[a]] = [
    a21[a], a12[a]]
};

const equals = (a: number, b: number) : boolean =>
    a11[a].toFixed(PRECISION_DIGITS) ===
    b11[b].toFixed(PRECISION_DIGITS) &&

    a12[a].toFixed(PRECISION_DIGITS) ===
    b12[b].toFixed(PRECISION_DIGITS) &&


    a21[a].toFixed(PRECISION_DIGITS) ===
    b21[b].toFixed(PRECISION_DIGITS) &&

    a22[a].toFixed(PRECISION_DIGITS) ===
    b22[b].toFixed(PRECISION_DIGITS);

const same = (a: number, b: number) : boolean => a === b &&
    (Object.is(a11, b11) || (Object.is(a11.buffer, b11.buffer) && a11.offset == b11.offset)) &&
    (Object.is(a12, b12) || (Object.is(a12.buffer, b12.buffer) && a12.offset == b12.offset)) &&

    (Object.is(a21, b21) || (Object.is(a21.buffer, b21.buffer) && a21.offset == b21.offset)) &&
    (Object.is(a22, b22) || (Object.is(a22.buffer, b22.buffer) && a22.offset == b22.offset));

const is_identity = (a: number) : boolean =>
    a11[a] === 1  &&  a21[a] === 0 &&
    a12[a] === 0  &&  a22[a] === 1;

const add = (a: number, b: number, o: number) : void => {
    o11[o] = a11[a] + b11[b];  o21[o] = a21[a] + b21[b];
    o12[o] = a12[a] + b12[b];  o22[o] = a22[a] + b22[b];
};

const add_in_place = (a: number, b: number) : void => {
    a11[a] += b11[b];  a21[a] += b21[b];
    a12[a] += b12[b];  a22[a] += b22[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    o11[o] = a11[a] - b11[b];  o21[o] = a21[a] - b21[b];
    o12[o] = a12[a] - b12[b];  o22[o] = a22[a] - b22[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    a11[a] -= b11[b];  a21[a] -= b21[b];
    a12[a] -= b12[b];  a22[a] -= b22[b];
};

const divide = (a: number, o: number, n: number) : void => {
    o11[o] = a11[a] / n;  o21[o] = a21[a] / n;
    o12[o] = a12[a] / n;  o22[o] = a22[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    a11[a] /= n;  a21[a] /= n;
    a12[a] /= n;  a22[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    o11[o] = a11[a] * n;  o21[o] = a21[a] * n;
    o12[o] = a12[a] * n;  o22[o] = a22[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    a11[a] *= n;  a21[a] *= n;
    a12[a] *= n;  a22[a] *= n;
};

const multiply = (a: number, b: number, o: number) : void => {
    o11[o] = a11[a]*b11[b] + a12[a]*b21[b]; // Row 1 | Column 1
    o12[o] = a11[a]*b12[b] + a12[a]*b22[b]; // Row 1 | Column 2

    o21[o] = a21[a]*b11[b] + a22[a]*b21[b]; // Row 2 | Column 1
    o22[o] = a21[a]*b12[b] + a22[a]*b22[b]; // Row 2 | Column 2
};

const multiply_in_place = (a: number, b: number) : void => {
    m11 = a11[a];  m21 = a21[a];
    m12 = a12[a];  m22 = a22[a];

    a11[a] = m11*b11[b] + m12*b21[b]; // Row 1 | Column 1
    a12[a] = m11*b12[b] + m12*b22[b]; // Row 1 | Column 2

    a21[a] = m21*b11[b] + m22*b21[b]; // Row 2 | Column 1
    a22[a] = m21*b12[b] + m22*b22[b]; // Row 2 | Column 2
};

const set_rotation = (a: number, cos: number, sin: number) : void => {
    a11[a] = a22[a] = cos;
    a12[a] = sin;
    a21[a] = -sin;
};


export class Matrix2x2 {
    constructor(
        readonly _11: Float32Array,
        readonly _12: Float32Array,

        readonly _21: Float32Array,
        readonly _22: Float32Array,

        public id: number = 0,

        public i: Direction2D = new Direction2D(_11, _12, id),
        public j: Direction2D = new Direction2D(_21, _22, id),
    ) {
        if (id < 0) throw `ID must be positive integer, got ${id}`;
    }

    get is_identity() : boolean {
        set_a(this);
        return is_identity(this.id);
    }

    readonly setToIdentity = () : this => {
        set_a(this);
        set_to_identity(this.id);

        return this;
    };

    readonly transpose = () : this => {
        set_a(this);
        transpose_in_place(this.id);

        return this;
    };

    readonly transposed = (out: this) : this => {
        set_a(this);
        set_o(out);

        transpose(this.id, out.id);

        return out;
    };

    readonly copyTo = (out: this) : this => {
        this_id = this.id;
        out_id = out.id;

        out._11[out_id] = this._11[this_id];  out._21[out_id] = this._21[this_id];
        out._12[out_id] = this._12[this_id];  out._22[out_id] = this._22[this_id];

        return out;
    };

    readonly setFromOther = (other: this) : this => {
        this_id = this.id;
        other_id = other.id;

        other._11[other_id] = this._11[this_id];
        other._12[other_id] = this._12[this_id];

        other._21[other_id] = this._21[this_id];
        other._22[other_id] = this._22[this_id];

        return this;
    };

    readonly setTo = (
        m11: number, m12: number,
        m21: number, m22: number
    ) : this => {
        this_id = this.id;

        this._11[this_id] = m11;  this._21[this_id] = m21;
        this._12[this_id] = m12;  this._22[this_id] = m22;

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

    readonly mul = (factor_or_matrix: number | this) : this => {
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

            out._11[out_id] = out._21[out_id] =
            out._12[out_id] = out._22[out_id] = 0;

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

    readonly times = (factor_or_matrix: number | this, out: this) : this => {
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

    setRotation(angle, reset=true) : this {
        if (reset) {
            set_a(this);
            set_to_identity(this.id);
        }

        set_sin_cos(angle);

        set_rotation(this.id, cos, sin);

        return this;
    }
}

const set_a = (a: Matrix2x2) : void => {
    a11 = a._11;  a21 = a._21;
    a12 = a._12;  a22 = a._22;
};

const set_b = (b: Matrix2x2) : void => {
    b11 = b._11;  b21 = b._21;
    b12 = b._12;  b22 = b._22;
};

const set_o = (o: Matrix2x2) : void => {
    o11 = o._11;  o21 = o._21;
    o12 = o._12;  o22 = o._22;
};

const set_m = (m: Matrix2x2) : void => {
    m11 = m._11;  m21 = m._21;
    m12 = m._12;  m22 = m._22;
};

const set_sin_cos = (angle: number) => {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
};