import {TypedArray} from "../../types.js";
import {IBuffer} from "../_interfaces/buffers.js";
import {IAllocator} from "../_interfaces/allocators.js";

export abstract class Buffer<ArrayType extends TypedArray> implements IBuffer<ArrayType>
{
    protected abstract _getAllocator(): IAllocator<ArrayType>;
    readonly allocator: IAllocator<ArrayType>;
    protected _values: number[];

    length: number;
    arrays: ArrayType[];

    constructor(
        length?: number,
        arrays?: ArrayType[]
    ) {
        this.allocator = this._getAllocator();
        if (length !== undefined)
            this.init(length, arrays);
    }

    init(length: number, arrays?: ArrayType[]): this {
        this.length = length;
        this.arrays = arrays || this.allocator.allocateBuffer(length);
        this._values = Array<number>(this.allocator.dim);

        return this;
    }

    * values(): Generator<number[]> {
        for (const [i, array] of this.arrays.entries())
            this._values[i] = array[i];

        yield this._values;
    }
}

export abstract class FloatBuffer extends Buffer<Float32Array> implements IBuffer {
    constructor(
        length?: number,
        arrays?: Float32Array[]
    ) {
        super(length, arrays);
    }
}