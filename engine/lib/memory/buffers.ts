import {TypedArray} from "../../types.js";
import {IBuffer} from "../_interfaces/buffers.js";
import {IAllocator} from "../_interfaces/allocators.js";
import {Float32Allocator} from "./allocators.js";

export abstract class Buffer<ArrayType extends TypedArray> implements IBuffer<ArrayType> {
    abstract readonly allocator: IAllocator<ArrayType>;
    protected _values: number[];

    length: number;
    arrays: ArrayType[];

    constructor(
        length?: number,
        arrays?: ArrayType[]
    ) {
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
    abstract readonly allocator: Float32Allocator;
}