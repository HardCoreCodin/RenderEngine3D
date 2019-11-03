import {
    f_n,
    f_v,
    ff_n,
    ff_v,
    fff_v,
    ffnf_v,
    fn_v,
    fnf_v,
    Vector4DValues,
    VectorValues
} from "../types.js";
import Base, {BaseConstructor, BaseMatrix} from "./base.js";

export abstract class AbstractVector extends Base {
    public arrays: VectorValues;

    protected _dot: ff_n;
    protected _linearly_interpolate: ffnf_v;

    protected _add: fff_v;
    protected _add_in_place: ff_v;

    protected _subtract: fff_v;
    protected _subtract_in_place: ff_v;

    protected _scale: fnf_v;
    protected _scale_in_place: fn_v;

    protected _divide: fnf_v;
    protected _divide_in_place: fn_v;

    protected _multiply: fff_v;
    protected _multiply_in_place: ff_v;

    protected _distance: ff_n;
    protected _distance_squared: ff_n;

    protected _length: f_n;
    protected _length_squared: f_n;

    protected _normalize: ff_v;
    protected _normalize_in_place?: f_v;
}
//
// export interface IPosition extends AbstractVector {
//     _distance: ff_n;
//     _distance_squared: ff_n;
// }
//
// export interface IDirection extends AbstractVector {
//     _dot: ff_n;
//     _length: f_n;
//     _length_squared: f_n;
//
//     _normalize: ff_v;
//     _normalize_in_place: f_v;
// }
//
// export interface ICrossedDirection extends IDirection {
//     _cross: fff_v;
//     _cross_in_place: ff_v;
// }

export type VectorConstructor = BaseConstructor<AbstractVector>;
export type PositionConstructor<T> = BaseConstructor<T extends AbstractVector>;
// export type DirectionConstructor = BaseConstructor<IDirection>;
// export type CrossedDirectionConstructor = BaseConstructor<ICrossedDirection>;

export const VectorMixin = (BaseClass: VectorConstructor) => class extends AbstractVector {
    lerp<T extends AbstractVector>(to: T, by: number, out: T): T {
        this._linearly_interpolate(
            this.arrays,
            this.id,

            to.arrays,
            to.id,

            by,

            out.arrays,
            out.id
        );

        return out;
    }

    add(other: this): this {
        this._add_in_place(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );

        return this;
    }

    sub(other: this): this {
        this._subtract_in_place(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );

        return this;
    }

    div(denominator: number): this {
        this._divide_in_place(
            this.arrays,
            this.id,

            denominator
        );

        return this;
    }

    mul(factor_or_matrix: number | BaseMatrix): this {
        if (typeof factor_or_matrix === 'number')
            this._scale_in_place(
                this.arrays,
                this.id,

                factor_or_matrix
            );
        else
            this._multiply_in_place(
                this.arrays,
                this.id,

                factor_or_matrix.arrays,
                factor_or_matrix.id
            );

        return this;
    }

    plus(other: this, out: this): this {
        this._add(
            this.arrays,
            this.id,

            other.arrays,
            other.id,

            out.arrays,
            out.id
        );

        return out;
    }

    minus(other: this, out: this): this {
        this._subtract(
            this.arrays,
            this.id,

            other.arrays,
            other.id,

            out.arrays,
            out.id
        );

        return out;
    }

    over(denominator: number, out: this): this {
        this._divide(
            this.arrays,
            this.id,

            denominator,

            out.arrays,
            out.id
        );

        return out;
    }

    times(factor_or_matrix: number | BaseMatrix, out: this): this {
        if (typeof factor_or_matrix === 'number')
            this._scale(
                this.arrays,
                this.id,

                factor_or_matrix,

                out.arrays,
                out.id
            );
        else
            this._multiply(
                this.arrays,
                this.id,

                factor_or_matrix.arrays,
                factor_or_matrix.id,

                out.arrays,
                out.id
            );

        return out;
    }
};

export const ColorMixin = (BaseClass: VectorConstructor) => class extends AbstractVector {
    setGreyScale(color: number): this {
        for (const array of this.arrays)
            array[this.id] = color;

        return this;
    }
};

export const PositionMixin = (BaseClass: VectorConstructor) => class extends AbstractVector {
    squaredDistanceTo(other: this): number {
        return this._distance_squared(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );
    }

    distanceTo(other: this): number {
        return this._distance(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );
    }

    to<T extends IPosition>(other: this, out: T): T {
        this._subtract(
            other.arrays,
            other.id,

            this.arrays,
            this.id,

            out.arrays,
            out.id
        );

        return out;
    }
};

export const DirectionMixin = (BaseClass: DirectionConstructor) => class extends IAbstractDirection {
    get length(): number {
        return this._length(
            this.arrays,
            this.id
        );
    }

    get length_squared(): number {
        return this._length_squared(
            this.arrays,
            this.id
        );
    }

    dot(other: this): number {
        return this._dot(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );
    }

    normalize(): this {
        this._normalize_in_place(
            this.arrays,
            this.id
        );

        return this;
    }

    normalized(out: this): this {
        this._normalize(
            this.arrays,
            this.id,

            out.arrays,
            out.id
        );

        return out;
    }
};

export class BasePosition4D {
    public arrays: Vector4DValues;

    toNDC(): void {
        const w = this.arrays[3][this.id];
        if (w !== 1)
            this._divide_in_place(this.arrays, this.id, w);
    }

    isInView(near: number = 0, far: number = 1): boolean {
        const a = this.arrays;
        const i = this.id;
        const x = a[0][i];
        const y = a[1][i];
        const z = a[2][i];
        const w = a[3][i];
        return (
            near <= z && z <= far &&
            -w <= y && y <= w &&
            -w <= x && x <= w
        );
    }

    isOutOfView(near: number = 0, far: number = 1): boolean {
        const a = this.arrays;
        const i = this.id;
        const x = a[0][i];
        const y = a[1][i];
        const z = a[2][i];
        const w = a[3][i];
        return (
            z < near ||
            z > far ||
            y > w ||
            y < -w ||
            x > w ||
            x < -w
        );
    }
}