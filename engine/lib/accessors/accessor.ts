import {Allocator} from "../memory/allocators.js";
import {IAccessor} from "../_interfaces/accessors.js";
import {IVector} from "../_interfaces/vectors.js";

export abstract class Accessor implements IAccessor
{
    id: number;
    readonly arrays: Float32Array[];

    protected abstract _getAllocator(): Allocator<Float32Array>;
    readonly allocator: Allocator<Float32Array>;

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