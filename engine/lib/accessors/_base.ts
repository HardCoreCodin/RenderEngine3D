import {IAccessor, IAccessorConstructor, IMathAccessor} from "../_interfaces/accessors/_base.js";
import {Arrays, IMathFunctionSet, IFunctionSet} from "../_interfaces/function_sets.js";


export class Accessor
    implements IAccessor
{
    readonly _: IFunctionSet;

    public id: number;
    public arrays: Arrays;

    constructor(id?: number, arrays?: Arrays) {
        if (id === undefined)
            this.id = this._.allocator.allocateTemp();
        else
            this.id = id;

        if (arrays === undefined)
            this.arrays = this._.allocator.temp_arrays;
        else
            this.arrays = arrays;
    }

    setTo(...values: number[]): this {
        this._.set_to(
            this.id, this.arrays,
            ...values
        );

        return this;
    }

    setAllTo(value: number): this {
        this._.set_all_to(
            this.id, this.arrays,
            value
        );

        return this;
    }

    setFrom(other: IAccessor): this {
        this._.set_from(
            this.id, this.arrays,
            other.id, other.arrays
        );

        return this;
    }

    readonly is = (other: IAccessor): boolean =>
        this.id === other.id && (
            Object.is(this.arrays, other.arrays) ||
            this.arrays.every(
                (array, index) => Object.is(array, other.arrays[index])
            )
        );

    readonly equals = (other: IAccessor): boolean =>
        other.is(this) ||
        this._.equals(
            other.id, other.arrays,
            this.id, this.arrays
        );

    copy(out: this = this._new()): this {

        this._.set_from(
            out.id, out.arrays,
            this.id, this.arrays
        );

        return out;
    }

    protected _new(): this {
        return new (this.constructor as IAccessorConstructor<this>)();
    }

}

export abstract class MathAccessor
    extends Accessor
    implements IMathAccessor
{
    readonly abstract _: IMathFunctionSet;
    abstract _newOut(): IMathAccessor;

    add(other: IMathAccessor) {
        this._.add_in_place(
            this.id, this.arrays,
            other.id, other.arrays
        );

        return this;
    }

    sub(other: IMathAccessor): this {
        this._.subtract_in_place(
            this.id, this.arrays,
            other.id, other.arrays
        );

        return this;
    }

    mul(other: IMathAccessor|number): this {
        if (typeof other === "number")
            this._.scale_in_place(
                this.id, this.arrays,
                other
            );
        else
            this._.multiply_in_place(
                this.id, this.arrays,
                other.id, other.arrays
            );

        return this;
    }

    div(denominator: number): this {
        this._.divide_in_place(
            this.id, this.arrays,
            denominator
        );

        return this;
    }

    plus(other: IMathAccessor, out: IMathAccessor = this._newOut()): IMathAccessor {
        if (out.is(this))
            this._.add_in_place(
                this.id, this.arrays,
                other.id, other.arrays
            );
        else
            this._.add(
                this.id, this.arrays,
                other.id, other.arrays,
                out.id, out.arrays
            );

        return out;
    }

    minus(other: IMathAccessor, out: IMathAccessor = this._newOut()): IMathAccessor {
        if (out.is(this) || out.equals(this))
            this._.set_all_to(
                this.id, this.arrays,
                0
            );
        else
            this._.subtract(
                this.id, this.arrays,
                other.id, other.arrays,
                out.id, out.arrays
            );

        return out;
    }

    times(other: IMathAccessor|number, out: this = this._new()): this {
        if (typeof other === "number") {
            if (out.is(this))
                this._.scale_in_place(
                    this.id, this.arrays,
                    other
                );
            else
                this._.scale(
                    this.id, this.arrays,
                    other,
                    out.id, out.arrays,
                );
        } else {
            if (out.is(this))
                this._.multiply_in_place(
                    this.id, this.arrays,
                    other.id, other.arrays
                );
            else
                this._.multiply(
                    this.id, this.arrays,
                    other.id, other.arrays,
                    out.id, out.arrays
                );
        }


        return out;
    }

    over(denominator: number, out: this = this._new()): this {
        if (out.is(this))
            this._.divide_in_place(
                this.id, this.arrays,
                denominator
            );
        else
            this._.divide(
                this.id, this.arrays,
                denominator,
                out.id, out.arrays
            );

        return out;
    }


    invert(): this {
        this._.invert_in_place(
            this.id, this.arrays
        );

        return this;
    }

    inverted(out: this = this._new()): this {
        this._.invert(
            this.id, this.arrays,
            out.id, this.arrays
        );

        return out;
    }
}