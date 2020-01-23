import {IAccessor} from "../_interfaces/accessors.js";
import {IMathAccessor, IVector} from "../_interfaces/vectors.js";
import {Allocator, Float32Allocator} from "../memory/allocators.js";
import {IAllocator} from "../_interfaces/allocators.js";

export abstract class Accessor implements IAccessor
{
    static Allocator: Float32Allocator;

    id: number;
    readonly arrays: Float32Array[];
    readonly allocator: IAllocator<Float32Array>;
    protected abstract _getAllocator(): Allocator<Float32Array>;

    constructor(
        id?: number,
        arrays?: Float32Array[]
    ) {
        this.allocator = this._getAllocator();
        if (arrays) {
            this.arrays = arrays;
            this.id = id;
        } else {
            this.arrays = Array<Float32Array>(this.allocator.dim);
            this.id = this.allocator.allocate(this.arrays);
        }
    }

    abstract setTo(...values: number[]): this;
    abstract setAllTo(value: number): this;
    abstract setFrom(other: IAccessor): IAccessor;
    abstract equals(other: IAccessor): boolean;
    abstract copy(out?: IAccessor): IAccessor;

    is(other: IAccessor): boolean {
        return Object.is(this, other) || (
            this.id === other.id && (
                Object.is(this.arrays, other.arrays) ||
                this.arrays.every(
                    (array, index) => Object.is(array, other.arrays[index])
                )
            )
        );
    }

    toArray(array: Float32Array = new Float32Array(this.allocator.dim)): Float32Array {
        const id = this.id;
        for (const [i, a] of this.arrays.entries())
            array[i] = a[id];

        return array;
    }
}

export abstract class MathAccessor extends Accessor implements IMathAccessor {
    protected abstract _add_number_in_place(num: number): void;
    protected abstract _add_other_in_place(other: IMathAccessor): void;
    protected abstract _add_number_to_out(v: number, out: IMathAccessor): void;
    protected abstract _add_other_to_out(other: IMathAccessor, out: IMathAccessor): void;

    protected abstract _sub_number_in_place(num: number): void;
    protected abstract _sub_other_in_place(other: IMathAccessor): void;
    protected abstract _sub_number_to_out(num: number, out: IMathAccessor): void;
    protected abstract _sub_other_to_out(other: IMathAccessor, out: IMathAccessor): void;

    protected abstract _mul_number_in_place(num: number): void;
    protected abstract _mul_other_in_place(other: this): void;
    protected abstract _mul_number_to_out(num: number, out: this): void;
    protected abstract _mul_other_to_out(other: this, out: this): void;

    protected abstract _div_number_in_place(num: number): void;
    protected abstract _div_number_to_out(num: number, out: this): void;

    add(num: number, out?: IMathAccessor): this|typeof out;
    add(other: IMathAccessor, out?: IMathAccessor): this|typeof out;
    add(other_or_num: IMathAccessor|number, out?: IMathAccessor): this|typeof out {
        if (out && !out.is(this)) {
            if (typeof other_or_num === "number") {
                if (other_or_num !== 0)
                    this._add_number_to_out(other_or_num, out);
            } else
                this._add_other_to_out(other_or_num, out);

            return out;
        }

        if (typeof other_or_num === "number")
            this._add_number_in_place(other_or_num);
        else
            this._add_other_in_place(other_or_num);

        return this;
    }

    sub(num: number, out?: IMathAccessor): this|typeof out;
    sub(other: IMathAccessor, out?: IMathAccessor): this|typeof out;
    sub(other_or_num: IMathAccessor|number, out?: IMathAccessor): this|typeof out {
        if (out && !out.is(this)) {
            if (typeof other_or_num === "number") {
                if (other_or_num !== 0)
                    this._sub_number_to_out(other_or_num, out);
            } else {
                if (other_or_num.is(this) || other_or_num.equals(this))
                    out.setAllTo(0);
                else
                    this._sub_other_to_out(other_or_num, out);
            }

            return out;
        }

        if (typeof other_or_num === "number") {
            if (other_or_num !== 0)
                this._sub_number_in_place(other_or_num);
        } else {
            if (other_or_num.is(this) || other_or_num.equals(this))
                this.setAllTo(0);
            else
                this._sub_other_in_place(other_or_num);
        }

        return this;
    }

    mul(num: number, out?: this): this;
    mul(other: this, out?: this): this;
    mul(other_or_num: this|number, out?: this): this {
        if (out && !out.is(this)) {
            if (typeof other_or_num === "number") {
                if (other_or_num === 0)
                    this.setAllTo(0);
                else
                    this._mul_number_to_out(other_or_num, out);
            } else
                this._mul_other_to_out(other_or_num, out);

            return out;
        }

        if (typeof other_or_num === "number")
            this._mul_number_in_place(other_or_num);
        else
            this._mul_other_in_place(other_or_num);

        return this;
    }

    div(denominator: number, out?: this): this {
        if (denominator === 0)
            throw `Division by zero!`;

        if (out && !out.is(this)) {
            if (denominator === 1)
                return out;

            this._div_number_to_out(denominator, out);

            return out;
        }

        if (denominator !== 1)
            this._div_number_in_place(denominator);

        return this;
    }
}

export abstract class Vector extends MathAccessor implements IVector {
    abstract lerp(to: this, by: number, out: this): this;
}