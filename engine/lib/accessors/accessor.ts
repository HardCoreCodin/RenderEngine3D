import {Arrays, IMathFunctionSet, IAccessorFunctionSet} from "../_interfaces/functions.js";
import {IAccessor, IAccessorConstructor, IMathAccessor} from "../_interfaces/accessors.js";


export abstract class Accessor implements IAccessor
{
    public id: number;
    public arrays: Arrays;

    readonly _: IAccessorFunctionSet;
    protected abstract _getFunctionSet(): IAccessorFunctionSet;

    constructor(
        id?: number,
        arrays?: Arrays
    ) {
        this._ = this._getFunctionSet();
        if (arrays) {
            this.arrays = arrays;
            this.id = id;
        } else {
            this.arrays = Array<Float32Array>(this._.allocator.dim) as Arrays;
            this.id = this._.allocator.allocate(this.arrays);
        }
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

    _new(): this {
        return new (this.constructor as IAccessorConstructor<this>)();
    }

    toArray(array: Float32Array = new Float32Array(this._.allocator.dim)): Float32Array {
        const id = this.id;
        for (const [i, a] of this.arrays.entries())
            array[i] = a[id];

        return array;
    }
}

export abstract class MathAccessor extends Accessor implements IMathAccessor
{
    readonly _: IMathFunctionSet;
    protected abstract _getFunctionSet(): IMathFunctionSet;

    add(other: number, out?: IMathAccessor): this|typeof out;
    add(other: IMathAccessor, out?: IMathAccessor): this|typeof out;
    add(other: IMathAccessor|number, out?: IMathAccessor): this|typeof out {
        if (out && !out.is(this)) {
            if (typeof other === "number")
                this._.broadcast_add(
                    this.id, this.arrays,
                    other,
                    out.id, out.arrays
                );
            else
                this._.add(
                    this.id, this.arrays,
                    other.id, other.arrays,
                    out.id, out.arrays
                );

            return out;
        }

        if (typeof other === "number")
            this._.broadcast_add_in_place(
                this.id, this.arrays,
                other,
            );
        else
            this._.add_in_place(
                this.id, this.arrays,
                other.id, other.arrays
            );

        return this;
    }

    sub(other: number, out?: IMathAccessor): this|typeof out;
    sub(other: IMathAccessor, out?: IMathAccessor): this|typeof out;
    sub(other: IMathAccessor|number, out?: IMathAccessor): this|typeof out {
        if (out) {
            if (out.is(this) || out.equals(this))
                this._.set_all_to(
                    this.id, this.arrays,
                    0
                );
            else if (typeof other === "number")
                this._.broadcast_subtract(
                    this.id, this.arrays,
                    other,
                    out.id, out.arrays
                );
            else
                this._.subtract(
                    this.id, this.arrays,
                    other.id, other.arrays,
                    out.id, out.arrays
                );

            return out;
        }

        if (typeof other === "number")
            this._.broadcast_subtract_in_place(
                this.id, this.arrays,
                other,
            );
        else
            this._.subtract_in_place(
                this.id, this.arrays,
                other.id, other.arrays
            );

        return this;
    }

    mul(other: number, out?: this): this;
    mul(other: this, out?: this): this;
    mul(other: this|number, out?: this): this {
        if (out && !out.is(this)) {
            if (typeof other === "number")
                this._.scale(
                    this.id, this.arrays,
                    other,
                    out.id, out.arrays,
                );
            else
                this._.multiply(
                    this.id, this.arrays,
                    other.id, other.arrays,
                    out.id, out.arrays
                );

            return out;
        }

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

    div(denominator: number, out?: this): this {
        if (denominator === 0)
            throw `Division by zero!`;

        if (out && !out.is(this)) {
            if (denominator !== 1)
                this._.divide(
                    this.id, this.arrays,
                    denominator,
                    out.id, out.arrays
                );

            return out;
        }

        if (denominator !== 1)
            this._.divide_in_place(
                this.id, this.arrays,
                denominator
            );

        return this;
    }

    invert(out?: this): this {
        if (out && !out.is(this)) {
            this._.invert(
                this.id, this.arrays,
                out.id, this.arrays
            );

            return out;
        }

        this._.invert_in_place(
            this.id, this.arrays
        );

        return this;
    }
}