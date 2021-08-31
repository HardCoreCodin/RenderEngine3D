import {Allocator} from "../memory/allocators.js";
import {IAccessor} from "../_interfaces/accessors.js";
import {IVector} from "../_interfaces/vectors.js";
import {IFlags} from "../_interfaces/flags.js";
import {TypedArray} from "../../types.js";

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
}

export abstract class Vector<Other extends Accessor = Accessor> extends Accessor implements IVector<Other> {
    abstract iadd(other_or_num: Other|number): this
    abstract add(other_or_num: Other|number, out: this): this;

    abstract isub(other_or_num: Other|number): this;
    abstract sub(other_or_num: Other|number, out: this): this;

    abstract imul(other_or_num: this|number): this;
    abstract mul(other_or_num: this|number, out: this): this;

    abstract idiv(denominator: number): this;
    abstract div(denominator: number, out: this): this;

    abstract lerp(other: this, by: number, out: this): this;
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
        for (const [value, index] of values.entries()) {
            this.array[index] = value;
        }

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