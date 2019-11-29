import {CACHE_LINE_BYTES, DIM} from "../../constants.js";
import {IAllocator, IBaseAllocator, IFloatAllocator, IIntAllocator} from "../_interfaces/allocators.js";
import {AnyConstructor, TypedArray, TypedArrayConstructor} from "../../types.js";

export abstract class BaseAllocator<
    ArrayType extends TypedArray,
    Dim extends DIM>
    implements IBaseAllocator<Dim>
{
    protected readonly abstract _constructor: AnyConstructor<ArrayType>;
    public abstract dim: Dim;

    protected _temp_holes: number[] = [];
    protected _temp_cursor: number = 0;
    protected _temp_length: number;

    protected readonly _temp_cache_lines: number = 16;
    protected readonly _cache_line_length: number;
    protected readonly _component_bytes: number;
    protected readonly _vector_bytees: number;

    protected readonly _getVectorBytes = (): number => this._component_bytes * this.dim;
    protected readonly _getComponentBytes = (): number => (this._constructor as TypedArrayConstructor<ArrayType>).BYTES_PER_ELEMENT;

    protected constructor() {
        this._component_bytes = this._getComponentBytes();
        this._vector_bytees = this._getVectorBytes();
        this._cache_line_length = CACHE_LINE_BYTES / this._component_bytes;
        this._temp_length = this._cache_line_length * this._temp_cache_lines;
    }

    allocateTemp(): number {
        if (this._temp_cursor === this._temp_length) {
            if (this._temp_holes.length)
                return this._temp_holes.pop();
            else
                this._growTempArrays();
        }

        return this._temp_length++;
    }

    deallocateTemp(index: number): void {
        this._temp_holes.push(index);
    }

    protected abstract _growTempArrays(): void;
}

export abstract class AbstractTypedArraysAllocator<
    ArrayType extends TypedArray,
    Dim extends DIM>
    extends BaseAllocator<ArrayType, Dim>
    implements IAllocator<ArrayType, Dim>
{
    public temp_arrays: ArrayType[];

    constructor() {
        super();
        this.temp_arrays = this.allocate(this._temp_length);
    }

    allocate(length: number): ArrayType[] {
        const arrays = Array<ArrayType>(this.dim);
        const buffer = new ArrayBuffer(length * this._vector_bytees);

        for (let i = 0; i < this.dim; i++)
            arrays[i] = new this._constructor(buffer, i * length, length);

        return arrays;
    }

    protected _growTempArrays() {
        this._temp_length += this._cache_line_length;
        const new_arrays = this.allocate(this._temp_length);

        for (const [i, array] of this.temp_arrays.entries())
            new_arrays[i].set(array);

        this.temp_arrays = new_arrays;
    }
}

export abstract class AbstractFloatArrayAllocator<Dim extends DIM>
    extends AbstractTypedArraysAllocator<Float32Array, Dim>
    implements IFloatAllocator<Dim>
{
    protected readonly _constructor = Float32Array;
    public abstract dim: Dim;
}

export abstract class AbstractIntArrayAllocator<Dim extends DIM>
    extends AbstractTypedArraysAllocator<Uint32Array, Dim>
    implements IIntAllocator<Dim>
{
    protected readonly _constructor = Uint32Array;
    public abstract dim: Dim;
}

