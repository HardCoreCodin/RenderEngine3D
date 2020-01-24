import {TypedArray} from "../../types.js";
import {IBuffer} from "../_interfaces/buffers.js";
import {IAllocator} from "../_interfaces/allocators.js";

export default abstract class Buffer<ArrayType extends TypedArray> implements IBuffer<ArrayType>
{
    protected abstract _getAllocator(): IAllocator<ArrayType>;
    readonly allocator: IAllocator<ArrayType>;
    protected _values: number[];
    protected _length: number;

    get length(): number {return this._length}

    arrays: ArrayType[] = [];

    constructor(
        length?: number,
        arrays?: ArrayType[]
    ) {
        this.allocator = this._getAllocator();
        if (length)
            this.init(length, arrays);
    }

    init(length: number, arrays?: ArrayType[]): this {
        this._length = length;
        this.arrays = arrays || this.allocator.allocateBuffer(length);
        this._values = Array<number>(this.allocator.dim);

        return this;
    }

    * values(): Generator<number[]> {
        for (const [i, array] of this.arrays.entries())
            this._values[i] = array[i];

        yield this._values;
    }

    toArray(array?: ArrayType): ArrayType {
        const num_components = this.arrays.length;

        if (array === undefined)
            array = new this.allocator.ArrayConstructor(num_components * this._length);

        for (const [component, values] of this.arrays.entries()) {
            let index = component;
            for (const value of values) {
                array[index] = value;
                index += num_components;
            }
        }

        return array;
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