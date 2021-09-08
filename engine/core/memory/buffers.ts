import {TypedArray} from "../types.js";
import {IBuffer} from "../interfaces/buffers.js";
import {IAllocator} from "../interfaces/allocators.js";

export default abstract class Buffer<ArrayType extends TypedArray> implements IBuffer<ArrayType> {
    protected _length: number;

    get length(): number {
        return this._length
    }

    arrays: ArrayType[] = [];
    array: ArrayType;
    readonly allocator: IAllocator<ArrayType>;

    protected abstract _getAllocator(): IAllocator<ArrayType>;

    constructor() {
        this.allocator = this._getAllocator()
    }

    init(length: number, array?: ArrayType, arrays?: ArrayType[]): this {
        this._length = length;

        if (array && arrays) {
            this.array = array;
            this.arrays = arrays;
        } else [
            this.array,
            this.arrays
        ] = this.allocator.allocateBuffer(length);

        return this;
    }
}