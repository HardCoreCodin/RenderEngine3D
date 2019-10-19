import {
    floatData,
    ff_b,
    fn_v,
    f_v,
    ff_n,
    ffnf_v,
    fnf_v,
    fff_v,
    f_n,
    ff_v,
    fm_v,
    fmf_v, mnb_v, m_v, m_b, mm_v, mmm_v
} from "../types.js";
import {PRECISION_DIGITS} from "../constants.js";

export default class Base {
    protected _dim: number;
    protected _equals: ff_b;

    constructor(
        public id: number,
        public data: floatData
    ) {
        if (id < 0) throw `ID must be positive integer, got ${id}`;
        if (data.length !== this._dim) throw `Data must be an array of length ${this._dim}! Got ${data.length}`;
    }

    copyTo(out: this) : this {
        for (const [dim, array] of this.data.entries())
            out.data[dim][out.id] = array[this.id];

        return out;
    }

    equals(other: this) : boolean {
        if (Object.is(other, this))
            return true;

        if (!Object.is(this.constructor, other.constructor))
            return false;

        return this._equals(
            this.data, this.id,
            other.data, other.id
        );
    }

    setFromOther(other: this) : this {
        for (const [dim, array] of other.data.entries())
            this.data[dim][this.id] = array[other.id];

        return this;
    }

    setTo(...values: number[]) : this {
        for (let [dim, value] of values.entries())
            this.data[dim][this.id] = value;

        return this;
    }
}

export class Vector extends Base {
    protected _linearly_interpolate: ffnf_v;

    protected _add: fff_v;
    protected _add_in_place: ff_v;

    protected _subtract: fff_v;
    protected _subtract_in_place: ff_v;

    protected _scale: fnf_v;
    protected _scale_in_place: fn_v;

    protected _divide: fnf_v;
    protected _divide_in_place: fn_v;

    protected _multiply: fmf_v;
    protected _multiply_in_place: fm_v;

    lerp(to: this, by: number, out: this): this {
        this._linearly_interpolate(
            this.data, this.id,
            to.data, to.id, by,
            out.data, out.id
        );

        return out;
    }

    add(other: this): this {
        this._add_in_place(
            this.data, this.id,
            other.data, other.id
        );

        return this;
    }

    sub(other: this): this {
        this._subtract_in_place(
            this.data, this.id,
            other.data, other.id
        );

        return this;
    }

    div(denominator: number): this {
        this._divide_in_place(this.data, this.id, denominator);

        return this;
    }

    mul(factor_or_matrix: number | Matrix): this {
        if (typeof factor_or_matrix === 'number')
            this._scale_in_place(this.data, this.id, factor_or_matrix);
        else
            this._multiply_in_place(this.data, this.id, factor_or_matrix.data);

        return this;
    }

    plus(other: this, out: this): this {
        this._add(
            this.data, this.id,
            other.data, other.id,
            out.data, out.id
        );

        return out;
    }

    minus(other: this, out: this): this {
        this._subtract(
            this.data, this.id,
            other.data, other.id,
            out.data, out.id
        );

        return out;
    }

    over(denominator: number, out: this): this {
        this._divide(
            this.data, this.id, denominator,
            out.data, out.id
        );

        return out;
    }

    times(factor_or_matrix: number | Matrix, out: this): this {
        if (typeof factor_or_matrix === 'number')
            this._scale(
                this.data, this.id, factor_or_matrix,
                out.data, out.id
            );
        else
            this._multiply(
                this.data, this.id, factor_or_matrix.data,
                out.data, out.id
            );

        return out;
    }
}

type Constructor = new(id: number, data: floatData) => Vector;

export function ColorMixin(BaseClass: Constructor) {
    return class extends BaseClass {
        setGreyScale(color: number) : this {
            for (const array of this.data)
                array[this.id] = color;

            return this;
        }
    }
}

export function DirectionMixin(BaseClass: Constructor) {
    return class extends BaseClass {
        protected _dot: ff_n;
        protected _length: f_n;

        protected _normalize : ff_v;
        protected _normalize_in_place : f_v;

        protected _cross : fff_v;
        protected _cross_in_place : ff_v;

        get length() : number {
            return this._length(this.data, this.id);
        }

        dot(other: this) : number {
            return this._dot(
                this.data, this.id,
                other.data, other.id
            );
        }

        normalize() : this {
            this._normalize_in_place(this.data, this.id);

            return this;
        }

        normalized(out: this) : this {
            this._normalize(
                this.data, this.id,
                out.data, out.id
            );

            return out;
        }

        cross(other: this) : this {
            this._cross_in_place(
                this.data, this.id,
                other.data, other.id
            );

            return this;
        }

        crossedWith(other: this, out: this) : this {
            this._cross(
                this.data, this.id,
                other.data, other.id,
                out.data, out.id
            );

            return out;
        }
    }
}

class Direction extends DirectionMixin(Vector) {}

export function PositionMixin(BaseClass: Constructor) {
    return class extends BaseClass {
        to(other: this, out: Direction) : Direction {
            this._subtract(
                other.data, other.id,
                this.data, this.id,
                out.data, out.id
            );

            return out;
        }
    }
}

//
// export class Position extends Vector {
//     to(other: this, out: Direction) : Direction {
//         this._subtract(
//             other.data, other.id,
//             this.data, this.id,
//             out.data, out.id
//         );
//
//         return out;
//     }
// }

// export class Direction extends Vector {
//     protected _dot: ff_n;
//     protected _length: f_n;
//
//     protected _normalize : ff_v;
//     protected _normalize_in_place : f_v;
//
//     protected _cross : fff_v;
//     protected _cross_in_place : lr_v;
//
//     get length() : number {
//         return this._length(this.data, this.id);
//     }
//
//     dot(other: this) : number {
//         return this._dot(
//             this.data, this.id,
//             other.data, other.id
//         );
//     }
//
//     normalize() : this {
//         this._normalize_in_place(this.data, this.id);
//
//         return this;
//     }
//
//     normalized(out: this) : this {
//         this._normalize(
//             this.data, this.id,
//             out.data, out.id
//         );
//
//         return out;
//     }
//
//     cross(other: this) : this {
//         this._cross_in_place(
//             this.data, this.id,
//             other.data, other.id
//         );
//
//         return this;
//     }
//
//     crossedWith(other: this, out: this) : this {
//         this._cross(
//             this.data, this.id,
//             other.data, other.id,
//             out.data, out.id
//         );
//
//         return out;
//     }
// }

export class Matrix {
    protected _dim: number;

    constructor(
        public data: Float32Array
    ) {
        if (data.length !== this._dim) throw `Data must be an array of length ${this._dim}! Got ${data.length}`
    }

    copyTo(out: this) : this {
        out.data.set(this.data);
        return out;
    }

    equals(other: this) : boolean {
        if (Object.is(other, this) ||
            Object.is(other.data, this.data) ||
            Object.is(other.data.buffer, this.data.buffer))
            return true;

        if (!Object.is(this.constructor, other.constructor))
            return false;

        for (const [dim, value] of this.data.entries())
            if (value.toFixed(PRECISION_DIGITS) !==
                other.data[dim].toFixed(PRECISION_DIGITS))
                return false;

        return true;
    }

    setFromOther(other: this) : this {
        this.data.set(other.data);

        return this;
    }

    setTo(...values: number[]) : this {
        this.data.set(values);

        return this;
    }

    protected _is_identity: m_b;
    protected _set_to_identity: m_v;
    protected _set_rotation_around_x: mnb_v;
    protected _set_rotation_around_y: mnb_v;
    protected _set_rotation_around_z: mnb_v;

    protected _transpose: mm_v;
    protected _transpose_in_place: m_v;

    protected _multiply : mmm_v;
    protected _multiply_in_place : mm_v;

    get is_identity() : boolean {
        return this._is_identity(this.data);
    }

    transposed(out: this) : this {
        this._transpose(
            this.data,
            out.data
        );

        return out;
    }

    transpose() : this {
        this._transpose_in_place(this.data);

        return this;
    }

    mul(other: this) : this {
        this._multiply_in_place(
            this.data,
            other.data
        );

        return this;
    }

    times(other: this, out: this) : this {
        this._multiply(
            this.data,
            other.data,
            out.data
        );

        return out;
    }

    setToIdentity() : this {
        this._set_to_identity(this.data);

        return this;
    }

    setRotationAroundX(angle=0, reset=true) : this {
        this._set_rotation_around_x(this.data, angle, reset);

        return this;
    }

    setRotationAroundY(angle: number, reset=false) : this {
        this._set_rotation_around_y(this.data, angle, reset);

        return this;
    }

    setRotationAroundZ(angle: number, reset=false) : this {
        this._set_rotation_around_z(this.data, angle, reset);

        return this;
    }
}