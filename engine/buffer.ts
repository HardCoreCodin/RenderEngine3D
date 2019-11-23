import {CACHE_LINE_BYTES} from "./constants.js";
import {AnyConstructor} from "./types.js";

abstract class TypedBuffer<ArrayType extends Float32Array|Uint32Array>
{
    protected _cursor: number;
    protected _temp_cursor: number = 0;

    public array: ArrayType;

    protected readonly _constructor: AnyConstructor<ArrayType>;
    protected readonly _bytes_per_element: number = 4;

    protected readonly _temp_length: number;
    protected readonly _cache_line_length: number;
    protected readonly _entry: [number, number] = [0, 0];

    constructor(
        protected _onBuffersChanged: (array: ArrayType) => void,
        protected readonly _temp_cache_lines: number = 16
    ) {
        this._cache_line_length = CACHE_LINE_BYTES / this._bytes_per_element;
        this._temp_length = this._cache_line_length * this._temp_cache_lines;
        this._cursor = this._temp_length;
        this.array = new this._constructor(this._temp_length);
    }

    allocateTemp(): number {
        return this._temp_cursor++ % this._temp_length;
    }

    get length(): number {
        return this.array.length - this._temp_length;
    }

    set length(length: number) {
        length += this._temp_length;
        const new_array = new this._constructor(length);
        new_array.set(this.array);
        this.array = new_array;
    }

    *entries(begin: number = 0, end: number): Generator<[number, number]> {
        for (this._entry[0] = begin; this._entry[0] < end; this._entry[0]++) {
            this._entry[1] = this.array[this._entry[0]];
            yield this._entry;
        }
    }

    allocate(length: number): number {
        const index = this._cursor;

        this._cursor += length;
        if (this._cursor > this.length) {
            this.length = this._cache_line_length * Math.ceil(this._cursor / this._cache_line_length);
            this._onBuffersChanged(this.array);
        }

        return index;
    }

    deallocate(start: number, end: number) {
        // TODO: Implement
    }
}

export class FloatBuffer extends TypedBuffer<Float32Array> {
    protected readonly _constructor = Float32Array;
    protected readonly _bytes_per_element = Float32Array.BYTES_PER_ELEMENT;
}

export class IntBuffer extends TypedBuffer<Uint32Array> {
    protected readonly _constructor = Uint32Array;
    protected readonly _bytes_per_element = Uint32Array.BYTES_PER_ELEMENT;
}