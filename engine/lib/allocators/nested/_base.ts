import {DIM} from "../../../constants.js";
import {TypedArray} from "../../../types.js";
import {INestedAllocator} from "../../_interfaces/allocators.js";
import {BaseAllocator} from "../_base.js";

export abstract class AbstractNestedTypedArraysAllocator<ArrayType extends TypedArray, Dim extends DIM>
    extends BaseAllocator<ArrayType, Dim>
    implements INestedAllocator<ArrayType, Dim>
{
    abstract outer_dim: DIM;

    protected _temp_arrays: ArrayType[][];

    constructor() {
        super();
        this._temp_arrays = this.allocate(this._temp_length);
    }

    allocate(length: number): ArrayType[][] {
        const arrays = Array(this.outer_dim);
        const buffer = new ArrayBuffer(length * this._vector_bytees);

        let offset = 0;
        for (let outer = 0; outer < this.outer_dim; outer++) {
            arrays[outer] = Array<ArrayType>(this.dim) as ArrayType[];

            for (let inner = 0; inner < this.dim; inner++) {
                arrays[outer][inner] = new this._constructor(buffer, offset, length);
                offset += length
            }
        }

        return arrays;
    }

    protected _growTempArrays() {
        this._temp_length += this._cache_line_length;
        const new_arrays = this.allocate(this._temp_length);

        for (let outer = 0; outer < this.outer_dim; outer++)
            for (let inner = 0; inner < this.dim; inner++)
                new_arrays[outer][inner].set(this._temp_arrays[outer][inner]);

        this._temp_arrays = new_arrays;
    }
}

export abstract class AbstractNestedFloatArrayAllocator<Dim extends DIM>
    extends AbstractNestedTypedArraysAllocator<Float32Array, Dim>
    implements INestedAllocator<Float32Array, Dim>
{
    protected readonly _constructor = Float32Array;
    public abstract outer_dim: DIM;
}