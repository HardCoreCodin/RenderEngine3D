import {
    // TypedArray,
    // TypedArrayConstructor,

    ArrayType,
    // ArrayTypeConstructor,
    //
    // ItemTypeConstructor,

    lr_b,
    ln_v,
    lr_v,
    l_v,
    nbo_v,
    lr_n,
    lrno_v,
    lno_v,
    lro_v,
    l_b,
    l_n,
    lo_v
} from "../types.js";
import {PRECISION_DIGITS} from "../constants";
//
// export class Buffer<A extends TypedArrayConstructor, I extends ItemTypeConstructor> {
//     constructor(
//         public readonly count: number,
//         public readonly typed_array: A,
//         public readonly item_type_constructor: I,
//         public readonly current: I = new item_type_constructor(typed_array, 0)
//     ) {}
//
//     at(index: number, current: ItemType = this.current) : ItemType {
//         current.typed_array = this.typed_array;
//
//         return current;
//     }
// }
//
// export type BufferType = {
//     new (count: number, stride: number) : Buffer
// }
//
// export class Float32Buffer extends Buffer {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number,
//         public readonly array: ArrayType = new Float32Array(count * stride)
//     ) {
//         super(count, stride, array);
//     }
//
//     setTo = (values: number[]) => this.array.set(values);
// }
//
// export class Uint32Buffer extends BaseBuffer {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number,
//         public readonly array: Uint32Array = new Uint32Array(count * stride)
//     ) {
//         super(count, stride, array);
//     }
// }
//
// export class Uint8Buffer extends BaseBuffer {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number,
//         public readonly array: Uint8Array = new Uint8Array(count * stride)
//     ) {
//         super(count, stride, array);
//     }
// }

export default class Base {
    protected _: ArrayType[];

    constructor(
        public i: number,
        ...typed_arrays : ArrayType[]
    ) {
        this._ = typed_arrays;
    }

    copyTo(out: this) : this {
        for (const [array_index, array] of this._.entries())
            out._[array_index][out.i] = array[this.i];

        return out;
    }

    equals(other: this) : boolean {
        if (Object.is(other, this))
            return true;

        if (this.constructor !== other.constructor)
            return false;

        for (const [array_index, array] of this._.entries())
            if (array[this.i].toFixed(PRECISION_DIGITS) !==
                other._[array_index][other.i].toFixed(PRECISION_DIGITS))
                return false;

        return true;
    }

    setFromOther(other: this) : this {
        for (const [array_index, array] of other._.entries())
            this._[array_index][this.i] = array[other.i];

        return this;
    }

    setTo(...values: number[]) : this {
        for (let [i, v] of values.entries())
            this._[i][this.i] = v;

        return this;
    }
}

export class Vector extends Base {
    protected _linearly_interpolate: lrno_v;

    protected _add: lro_v;
    protected _add_in_place: lr_v;

    protected _subtract: lro_v;
    protected _subtract_in_place: lr_v;

    protected _scale: lno_v;
    protected _scale_in_place: ln_v;

    protected _divide: lno_v;
    protected _divide_in_place: ln_v;

    protected _multiply: lro_v;
    protected _multiply_in_place: lr_v;

    lerp(to: this, by: number, out: this): this {
        this._linearly_interpolate(
            this._[0],
            this._[0],
            this._[0],
            this.i,

            to._[0],
            to._[0],
            to._[0],
            to.i,

            t: number,

            X: ArrayType,
            Y: ArrayType,
            Z: ArrayType,
            o: number
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
    protected _dot: lr_n;
    protected _length: l_n;

    protected _normalize : lo_v;
    protected _normalize_in_place : l_v;

    protected _cross : lro_v;
    protected _cross_in_place : lr_v;

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
    protected _is_identity: l_b;
    protected _set_to_identity: l_v;
    protected _set_rotation_around_x: nbo_v;
    protected _set_rotation_around_y: nbo_v;
    protected _set_rotation_around_z: nbo_v;

    protected _transpose: lo_v;
    protected _transpose_in_place: l_v;

    protected _multiply : lro_v;
    protected _multiply_in_place : lr_v;

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