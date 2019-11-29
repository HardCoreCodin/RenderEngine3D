import {TypedArray} from "../../types.js";
import {IAllocator} from "../_interfaces/allocators.js";
import {IBuffer} from "../_interfaces/buffers/_base.js";
import {DIM} from "../../constants.js";

export abstract class Buffer<ArrayType extends TypedArray, Dim extends DIM>
    implements IBuffer<ArrayType, Dim>
{
    abstract readonly dim: Dim;
    abstract readonly allocator: IAllocator<ArrayType, Dim>;
    protected _values: number[];
    length: number;
    arrays: ArrayType[];

    init(length: number) {
        this.length = length;
        this.arrays = this.allocator.allocate(length);
        this._values = Array<number>(this.dim);
    }

    *values(): Generator<number[]> {
        for (const [i, array] of this.arrays.entries())
            this._values[i] = array[i];

        yield this._values;
    }
}