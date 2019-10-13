import {
    ArrayType,
    bool_op,
    in_place_number_op,
    in_place_op,
    in_place_unary_op,
    number_bool_op,
    number_op,
    out_by_op,
    out_number_op,
    out_op,
    unary_bool_op,
    unary_number_op,
    unary_op
} from "../types.js";
import {Direction3D} from "./vec3";


export default class Base {
    protected typed_array_length: number;

    protected _equals: bool_op;

    constructor(
        public typed_array: ArrayType,
        public typed_array_offset: number = 0
    ) {}

    copyTo(out: this) : this {
        out.typed_array.set(
            this.typed_array.subarray(
                this.typed_array_offset,
                this.typed_array_offset+this.typed_array_length
            ), this.typed_array_offset
        );

        return out;
    }

    equals(other: this) : boolean {
        if (Object.is(other, this))
            return true;

        if (this.constructor !== other.constructor)
            return false;

        return this._equals(
            this.typed_array,
            other.typed_array,

            this.typed_array_offset,
            other.typed_array_offset
        );
    }

    setFromOther(other: this) : this {
        this.typed_array.set(
            other.typed_array.subarray(
                other.typed_array_offset,
                other.typed_array_offset+other.typed_array_length
            ),
            this.typed_array_offset
        );

        return this;
    }

    setFromTypedArray(typed_array: ArrayType, offset: number) : this {
        this.typed_array.set(
            typed_array.subarray(
                offset,
                offset+this.typed_array_length
            ),
            this.typed_array_offset
        );

        return this;
    }

    setTo(...values: number[]) : this {
        for (let [i, v] of values.entries())
            this.typed_array[this.typed_array_offset+i] = v;

        return this;
    }
}

export class Vector extends Base {
    protected _linearly_interpolate: out_by_op;

    protected _add: out_op;
    protected _add_in_place: in_place_op;

    protected _subtract: out_op;
    protected _subtract_in_place: in_place_op;

    protected _scale: out_number_op;
    protected _scale_in_place: in_place_number_op;

    protected _divide: out_number_op;
    protected _divide_in_place: in_place_number_op;

    protected _multiply: out_op;
    protected _multiply_in_place: in_place_op;

    lerp(to: this, by: number, out: this): this {
        this._linearly_interpolate(
            out.typed_array,
            this.typed_array,
            to.typed_array,
            by,

            out.typed_array_offset,
            this.typed_array_offset,
            to.typed_array_offset,
        );

        return out;
    }

    add(other: this): this {
        this._add_in_place(
            this.typed_array,
            other.typed_array,

            this.typed_array_offset,
            other.typed_array_offset
        );

        return this;
    }

    sub(other: this): this {
        this._subtract_in_place(
            this.typed_array,
            other.typed_array,

            this.typed_array_offset,
            other.typed_array_offset
        );

        return this;
    }

    div(denominator: number): this {
        this._divide_in_place(
            this.typed_array,
            denominator,

            this.typed_array_offset
        );

        return this;
    }

    plus(other: this, out: this): this {
        this._add(
            out.typed_array,
            this.typed_array,
            other.typed_array,

            out.typed_array_offset,
            this.typed_array_offset,
            other.typed_array_offset
        );

        return out;
    }

    minus(other: this, out: this): this {
        this._subtract(
            out.typed_array,
            this.typed_array,
            other.typed_array,

            out.typed_array_offset,
            this.typed_array_offset,
            other.typed_array_offset
        );

        return out;
    }

    over(denominator: number, out: this): this {
        this._divide(
            out.typed_array,
            this.typed_array,
            denominator,

            out.typed_array_offset,
            this.typed_array_offset
        );

        return out;
    }

    times(factor_or_matrix: number | Matrix, out: this): this {
        if (typeof factor_or_matrix === 'number')
            this._scale(
                out.typed_array,
                this.typed_array,
                factor_or_matrix,

                out.typed_array_offset,
                this.typed_array_offset
            );
        else
            this._multiply(
                out.typed_array,
                this.typed_array,
                factor_or_matrix.typed_array,

                out.typed_array_offset,
                this.typed_array_offset,
                factor_or_matrix.typed_array_offset
            );

        return out;
    }

    mul(factor_or_matrix: number | Matrix): this {
        if (typeof factor_or_matrix === 'number')
            this._scale_in_place(
                this.typed_array,
                factor_or_matrix,

                this.typed_array_offset
            );
        else
            this._multiply_in_place(
                this.typed_array,
                factor_or_matrix.typed_array,

                this.typed_array_offset,
                factor_or_matrix.typed_array_offset
            );

        return this;
    }
}

export class Position extends Vector {
    to(other: this, out: Direction) : Direction {
        this._subtract(
            out.typed_array,
            other.typed_array,
            this.typed_array,

            out.typed_array_offset,
            other.typed_array_offset,
            this.typed_array_offset
        );

        return out;
    }
}

export class Direction extends Vector {
    protected _dot: number_op;
    protected _length: unary_number_op;

    protected _normalize : unary_op;
    protected _normalize_in_place : in_place_unary_op;

    protected _cross : out_op;
    protected _cross_in_place : in_place_op;

    get length() : number {
        return this._length(
            this.typed_array,
            this.typed_array_offset
        );
    }

    dot(other: this) : number {
        return this._dot(
            this.typed_array,
            other.typed_array,

            this.typed_array_offset,
            other.typed_array_offset
        );
    }

    normalize() : this {
        this._normalize_in_place(
            this.typed_array,
            this.typed_array_offset
        );

        return this;
    }

    normalized(out: this) : this {
        this._normalize(
            out.typed_array,
            this.typed_array,

            out.typed_array_offset,
            this.typed_array_offset
        );

        return out;
    }

    cross(other: this) : this {
        this._cross_in_place(
            this.typed_array,
            other.typed_array,

            this.typed_array_offset,
            other.typed_array_offset
        );

        return this;
    }

    crossedWith(other: this, out: this) : this {
        this._cross(
            out.typed_array,
            this.typed_array,
            other.typed_array,

            out.typed_array_offset,
            this.typed_array_offset,
            other.typed_array_offset
        );

        return out;
    }
}

export class Matrix extends Base {
    protected _is_identity: unary_bool_op;
    protected _set_to_identity: in_place_unary_op;
    protected _set_rotation_around_x: number_bool_op;
    protected _set_rotation_around_y: number_bool_op;
    protected _set_rotation_around_z: number_bool_op;

    protected _transpose: unary_op;
    protected _transpose_in_place: in_place_unary_op;

    protected _multiply : out_op;
    protected _multiply_in_place : in_place_op;

    get is_identity() : boolean {
        return this._is_identity(
            this.typed_array,
            this.typed_array_offset
        );
    }

    transposed(out: this) : this {
        this._transpose(
            out.typed_array,
            this.typed_array,

            out.typed_array_offset,
            this.typed_array_offset,
        );

        return out;
    }

    transpose() : this {
        this._transpose_in_place(
            this.typed_array,
            this.typed_array_offset,
        );

        return this;
    }

    mul(other: this) : this {
        this._multiply_in_place(
            this.typed_array,
            other.typed_array,

            this.typed_array_offset,
            other.typed_array_offset
        );

        return this;
    }

    times(other: this, out: this) : this {
        this._multiply(
            out.typed_array,
            this.typed_array,
            other.typed_array,

            out.typed_array_offset,
            this.typed_array_offset,
            other.typed_array_offset
        );

        return out;
    }

    setToIdentity() : this {
        this._set_to_identity(
            this.typed_array,
            this.typed_array_offset
        );

        return this;
    }

    setRotationAroundX(angle=0, reset=true) : this {
        this._set_rotation_around_x(
            this.typed_array,
            angle,
            reset,

            this.typed_array_offset
        );

        return this;
    }

    setRotationAroundY(angle: number, reset=false) : this {
        this._set_rotation_around_y(
            this.typed_array,
            angle,
            reset,

            this.typed_array_offset
        );

        return this;
    }

    setRotationAroundZ(angle: number, reset=false) : this {
        this._set_rotation_around_z(
            this.typed_array,
            angle,
            reset,

            this.typed_array_offset
        );

        return this;
    }
}