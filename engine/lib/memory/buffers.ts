import {DIM} from "../../constants.js";
import {Tuple, TypedArray} from "../../types.js";
import {IBuffer} from "../_interfaces/buffers.js";
import {IAllocator} from "../_interfaces/allocators.js";

export abstract class Buffer<
    ArrayType extends TypedArray,
    Dim extends DIM>
    implements IBuffer<Dim, ArrayType>
{
    abstract readonly dim: Dim;
    abstract readonly allocator: IAllocator<Dim, ArrayType>;
    protected _values: Tuple<number, Dim>;
    length: number;
    arrays: Tuple<ArrayType, Dim>;

    constructor(length?: number, arrays?: Tuple<ArrayType, Dim>) {
        if (length !== undefined)
            this.init(length, arrays);
    }

    init(length: number, arrays?: Tuple<ArrayType, Dim>): this {
        this.length = length;
        this.arrays = arrays || this.allocator.allocate(length) as Tuple<ArrayType, Dim>;
        this._values = Array<number>(this.dim) as Tuple<number, Dim>;

        return this;
    }

    * values(): Generator<Tuple<number, Dim>> {
        for (const [i, array] of this.arrays.entries())
            this._values[i] = array[i];

        yield this._values;
    }
}

export abstract class FloatBuffer<Dim extends DIM>
    extends Buffer<Float32Array, Dim>
    implements IBuffer<Dim>
{
    abstract readonly allocator: IAllocator<Dim, Float32Array>;
}

