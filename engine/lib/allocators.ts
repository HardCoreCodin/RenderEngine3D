import {CACHE_LINE_BYTES, DIM} from "../constants.js";
import {IAllocator, IBaseAllocator, INestedAllocator} from "./_interfaces/allocators.js";
import {AnyConstructor, Tuple, TypedArray, TypedArrayConstructor} from "../types.js";

export abstract class BaseAllocator<ArrayType extends TypedArray,
    Dim extends DIM>
    implements IBaseAllocator<Dim> {
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

export abstract class AbstractTypedArraysAllocator<ArrayType extends TypedArray,
    Dim extends DIM>
    extends BaseAllocator<ArrayType, Dim>
    implements IAllocator<Dim> {
    public temp_arrays: Tuple<ArrayType, Dim>;

    constructor() {
        super();
        this.temp_arrays = this.allocate(this._temp_length);
    }

    allocate(length: number): Tuple<ArrayType, Dim> {
        const arrays = Array<ArrayType>(this.dim) as Tuple<ArrayType, Dim>;
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
    implements IAllocator<Dim> {
    protected readonly _constructor = Float32Array;
    public abstract dim: Dim;
}

export abstract class AbstractInt8ArrayAllocator<Dim extends DIM>
    extends AbstractTypedArraysAllocator<Uint8Array, Dim>
    implements IAllocator<Dim> {
    protected readonly _constructor = Uint8Array;
    public abstract dim: Dim;
}

export abstract class AbstractInt16ArrayAllocator<Dim extends DIM>
    extends AbstractTypedArraysAllocator<Uint16Array, Dim>
    implements IAllocator<Dim> {
    protected readonly _constructor = Uint16Array;
    public abstract dim: Dim;
}

export abstract class AbstractInt32ArrayAllocator<Dim extends DIM>
    extends AbstractTypedArraysAllocator<Uint32Array, Dim>
    implements IAllocator<Dim> {
    protected readonly _constructor = Uint32Array;
    public abstract dim: Dim;
}

class Float2Allocator
    extends AbstractFloatArrayAllocator<DIM._2D>
    implements IAllocator<DIM._2D>
{
    public dim = DIM._2D as DIM._2D;
}

class Float3Allocator
    extends AbstractFloatArrayAllocator<DIM._3D>
    implements IAllocator<DIM._3D>
{
    public dim = DIM._3D as DIM._3D;
}

class Float4Allocator
    extends AbstractFloatArrayAllocator<DIM._4D>
    implements IAllocator<DIM._4D>
{
    public dim = DIM._4D as DIM._4D;
}

class Float9Allocator
    extends AbstractFloatArrayAllocator<DIM._9D>
    implements IAllocator<DIM._9D>
{
    public dim = DIM._9D as DIM._9D;
}

class Float16Allocator
    extends AbstractFloatArrayAllocator<DIM._16D>
    implements IAllocator<DIM._16D>
{
    public dim = DIM._16D as DIM._16D;
}

export type FloatNAllocator =
    Float2Allocator |
    Float3Allocator |
    Float4Allocator |
    Float9Allocator |
    Float16Allocator;

export const VECTOR_2D_ALLOCATOR = new Float2Allocator();
export const VECTOR_3D_ALLOCATOR = new Float3Allocator();
export const VECTOR_4D_ALLOCATOR = new Float4Allocator();
export const MATRIX_2X2_ALLOCATOR = new Float4Allocator();
export const MATRIX_3X3_ALLOCATOR = new Float9Allocator();
export const MATRIX_4X4_ALLOCATOR = new Float16Allocator();

class Int8Allocator1D
    extends AbstractInt8ArrayAllocator<DIM._1D>
    implements IAllocator<DIM._1D> {
    public dim = DIM._1D as DIM._1D;
}

class Int8Allocator3D
    extends AbstractInt8ArrayAllocator<DIM._3D>
    implements IAllocator<DIM._3D> {
    public dim = DIM._3D as DIM._3D;
}

class Int16Allocator1D
    extends AbstractInt16ArrayAllocator<DIM._1D>
    implements IAllocator<DIM._1D> {
    public dim = DIM._1D as DIM._1D;
}

class Int16Allocator3D
    extends AbstractInt16ArrayAllocator<DIM._3D>
    implements IAllocator<DIM._3D> {
    public dim = DIM._3D as DIM._3D;
}

class Int32Allocator1D
    extends AbstractInt32ArrayAllocator<DIM._1D>
    implements IAllocator<DIM._1D> {
    public dim = DIM._1D as DIM._1D;
}

class Int32Allocator3D
    extends AbstractInt32ArrayAllocator<DIM._3D>
    implements IAllocator<DIM._3D> {
    public dim = DIM._3D as DIM._3D;
}

export const FACE_VERTICES_ALLOCATOR_INT8 = new Int8Allocator3D();
export const FACE_VERTICES_ALLOCATOR_INT16 = new Int16Allocator3D();
export const FACE_VERTICES_ALLOCATOR_INT32 = new Int32Allocator3D();
export const VERTEX_FACES_ALLOCATOR_INT8 = new Int8Allocator1D();
export const VERTEX_FACES_ALLOCATOR_INT16 = new Int16Allocator1D();
export const VERTEX_FACES_ALLOCATOR_INT32 = new Int32Allocator1D();


export abstract class AbstractNestedTypedArraysAllocator<ArrayType extends TypedArray,
    Dim extends DIM,
    OuterDim extends DIM>
    extends BaseAllocator<ArrayType, Dim>
    implements INestedAllocator<Dim, OuterDim> {
    abstract outer_dim: OuterDim;

    protected _temp_arrays: Tuple<Tuple<ArrayType, Dim>, OuterDim>;

    constructor() {
        super();
        this._temp_arrays = this.allocate(this._temp_length);
    }

    allocate(length: number): Tuple<Tuple<ArrayType, Dim>, OuterDim> {
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

        return arrays as Tuple<Tuple<ArrayType, Dim>, OuterDim>;
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

export abstract class AbstractNestedFloatArrayAllocator<Dim extends DIM, OuterDim extends DIM>
    extends AbstractNestedTypedArraysAllocator<Float32Array, Dim, OuterDim>
    implements INestedAllocator<Dim, OuterDim> {
    protected readonly _constructor = Float32Array;
    public abstract outer_dim: OuterDim;
}