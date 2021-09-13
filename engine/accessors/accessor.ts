import {Allocator} from "../core/memory/allocators.js";
import {IAccessor} from "../core/interfaces/accessors.js";
import {IVector} from "../core/interfaces/vectors.js";
import {IFlags} from "../core/interfaces/flags.js";
import {TypedArray} from "../core/types.js";
import {approach} from "../core/utils.js";

export abstract class Accessor<ArrayType extends TypedArray = Float32Array>
    implements IAccessor<ArrayType>
{
    array: ArrayType;

    protected abstract _getAllocator(): Allocator<ArrayType>;
    readonly allocator: Allocator<ArrayType>;

    constructor(array?: ArrayType) {
        this.allocator = this._getAllocator();
        this.array = array || this.allocator.allocate();
    }

    abstract setTo(...values: number[]): this;
    abstract setAllTo(value: number): this;
    abstract setFrom(other: IAccessor<ArrayType>): IAccessor<ArrayType>;
    abstract equals(other: IAccessor<ArrayType>): boolean;
    abstract copy(out?: IAccessor<ArrayType>): IAccessor<ArrayType>;

    is(other: IAccessor<ArrayType>): boolean {
        return Object.is(this, other) || (Object.is(this.array, other.array));
    }

    isNonZero(): boolean {
        for (let i = 0; i < this.array.length; i++)
            if (this.array[i])
                return true;

        return false;
    }
}

export abstract class Vector<
    ArrayType extends TypedArray = Float32Array,
    Other extends Accessor<ArrayType> = Accessor<ArrayType>>
    extends Accessor<ArrayType> implements IVector<Other, ArrayType>
{
    on_change: (self: this) => void = null;

    abstract iadd(other_or_num: Other|number): this
    abstract add(other_or_num: Other|number, out: this): this;

    abstract isub(other_or_num: Other|number): this;
    abstract sub(other_or_num: Other|number, out: this): this;

    abstract imul(other_or_num: this|number): this;
    abstract mul(other_or_num: this|number, out: this): this;

    abstract idiv(denominator: number): this;
    abstract div(denominator: number, out: this): this;

    abstract lerp(other: this, by: number, out: this): this;

    approach(other: this, by: number): this {
        if (by) {
            for (let i = 0; i < this.array.length; i++)
                this.array[i] = approach(this.array[i], other.array[i], by);

            if (this.on_change)
                this.on_change(this);
        }

        return this;
    }
}

export abstract class Flags<Other extends Accessor<Uint8Array> = Accessor<Uint8Array>> extends Accessor<Uint8Array> implements IFlags {
    anySet(test_flag: number): boolean {
        for (const flag of this.array)
            if (flag & test_flag)
                return true;

        return false;
    }

    allSet(test_flag: number): boolean {
        for (const flag of this.array)
            if (!(flag & test_flag))
                return false;

        return true;
    }

    setTo(...values: number[]): this {
        let index = 0;
        for (const value of values) this.array[index++] = value;
        return this;
    }

    setAllTo(value: number): this {
        this.array.fill(value);
        return this;
    }

    setFrom(other: Other): this {
        this.array.set(other.array);
        return this;
    }

    equals(other: Other): boolean {
        for (let i = 0; i < this.allocator.dim; i++)
            if (this.array[i] !== other.array[i])
                return false;

        return true;
    }
}