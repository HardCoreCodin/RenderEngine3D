import {CACHE_LINE_BYTES, DIM} from "../../constants.js";
import {IAllocator, IArraysBlock, IArraysBlocksAllocator} from "../_interfaces/allocators.js";
import {AnyConstructor, TypedArray, TypedArrayConstructor} from "../../types.js";

export class ArraysBlock<ArrayType extends TypedArray>
    implements IArraysBlock<ArrayType>
{
    protected _holes: number[] = [];
    protected _cursor: number = 0;
    protected _is_full: boolean;

    constructor(
        readonly dim: DIM,
        readonly length: number,
        readonly buffer: ArrayType,
        readonly arrays: ArrayType[] = Array<ArrayType>(dim)
    ) {
        let start = 0;
        let end = length;
        for (let i = 0; i < this.dim; i++) {
            this.arrays[i] = this.buffer.subarray(start, end) as ArrayType;
            start += length;
            end += length;
        }
    }

    get is_full(): boolean {
        return this._is_full;
    }

    allocate(): number {
        if (this._is_full)
            throw `Blcok is full!`;

        if (this._cursor === this.length) {
            if (this._holes.length === 1)
                this._is_full = true;

            return this._holes.pop();
        } else if (this._cursor + 1 === this.length)
            this._is_full = true;

        return this._cursor++;
    }

    deallocate(index: number): void {
        this._holes.push(index);
    }
}

export class ArraysBlocksAllocator<ArrayType extends TypedArray = Float32Array>
    implements IArraysBlocksAllocator<ArrayType>
{
    protected readonly _block_length: number;
    protected readonly _cache_lines: number = 16;
    protected readonly _array_blocks: ArraysBlock<ArrayType>[] = [];

    constructor(
        readonly dim: DIM,
        readonly ArrayConstructor: TypedArrayConstructor<ArrayType>
    ) {
        this._block_length = this._cache_lines * CACHE_LINE_BYTES / this.ArrayConstructor.BYTES_PER_ELEMENT;
    }

    allocate(arrays?: ArrayType[]): number {
        for (const block of this._array_blocks) {
            if (!block.is_full) {
                if (arrays) {
                    for (const [i, array] of block.arrays.entries())
                        arrays[i] = array;
                }
                return block.allocate();
            }
        }

        const new_block = new ArraysBlock<ArrayType>(
            this.dim,
            this._block_length,
            new this.ArrayConstructor(this._block_length * this.dim)
        );
        this._array_blocks.unshift(new_block);

        if (arrays) {
            for (const [i, array] of new_block.arrays.entries())
                arrays[i] = array;
        }

        return new_block.allocate();
    }

    deallocate(array: ArrayType, index: number): void {
        for (const block of this._array_blocks) {
            if (block.arrays.indexOf(array) >= 0) {
                block.deallocate(index);
                return;
            }
        }

        throw `Could not find array in block!`;
    }
}

export abstract class Allocator<ArrayType extends TypedArray>
    implements IAllocator<ArrayType>
{
    readonly blocks: ArraysBlocksAllocator<ArrayType>;

    protected constructor(
        readonly dim: DIM,
        readonly ArrayConstructor: AnyConstructor<ArrayType>
    ) {
        this.blocks = new ArraysBlocksAllocator<ArrayType>(
            dim,
            ArrayConstructor as TypedArrayConstructor<ArrayType>
        );
    }

    allocate(arrays?: ArrayType[]): number {
        return this.blocks.allocate(arrays);
    }

    allocateBuffer(length: number): ArrayType[] {
        const arrays = Array<ArrayType>(this.dim) as ArrayType[];
        const buffer = new this.ArrayConstructor(length * this.dim);

        let start = 0;
        let end = length;
        for (let i = 0; i < this.dim; i++) {
            arrays[i] = buffer.subarray(start, end) as ArrayType;
            start += length;
            end += length;
        }

        return arrays;
    }
}

export abstract class Float32Allocator extends Allocator<Float32Array>
{
    protected constructor(
        readonly dim: DIM
    ) {
        super(dim, Float32Array);
    }
}
export class Float32Allocator2D extends Float32Allocator {constructor() {super(DIM._2D)}}
export class Float32Allocator3D extends Float32Allocator {constructor() {super(DIM._3D)}}
export class Float32Allocator4D extends Float32Allocator {constructor() {super(DIM._4D)}}
export class Float32Allocator9D extends Float32Allocator {constructor() {super(DIM._9D)}}
export class Float32Allocator16D extends Float32Allocator {constructor() {super(DIM._16D)}}

export abstract class Int8Allocator extends Allocator<Uint8Array>
{
    protected constructor(
        readonly dim: DIM
    ) {
        super(dim, Uint8Array);
    }
}
export class Int8Allocator1D extends Int8Allocator {constructor() {super(DIM._1D)}}
export class Int8Allocator2D extends Int8Allocator {constructor() {super(DIM._2D)}}
export class Int8Allocator3D extends Int8Allocator {constructor() {super(DIM._3D)}}

export abstract class Int16Allocator extends Allocator<Uint16Array>
{
    protected constructor(
        readonly dim: DIM
    ) {
        super(dim, Uint16Array);
    }
}
export class Int16Allocator1D extends Int16Allocator {constructor() {super(DIM._1D)}}
export class Int16Allocator2D extends Int16Allocator {constructor() {super(DIM._2D)}}
export class Int16Allocator3D extends Int16Allocator {constructor() {super(DIM._3D)}}

export abstract class Int32Allocator extends Allocator<Uint32Array>
{
    protected constructor(
        readonly dim: DIM
    ) {
        super(dim, Uint32Array);
    }
}
export class Int32Allocator1D extends Int32Allocator {constructor() {super(DIM._1D)}}
export class Int32Allocator2D extends Int32Allocator {constructor() {super(DIM._2D)}}
export class Int32Allocator3D extends Int32Allocator {constructor() {super(DIM._3D)}}

export const VECTOR_2D_ALLOCATOR = new Float32Allocator2D();
export const VECTOR_3D_ALLOCATOR = new Float32Allocator3D();
export const VECTOR_4D_ALLOCATOR = new Float32Allocator4D();
export const FACE_AREAS_ALLOCATOR = new Float32Allocator3D();
export const MATRIX_2X2_ALLOCATOR = new Float32Allocator4D();
export const MATRIX_3X3_ALLOCATOR = new Float32Allocator9D();
export const MATRIX_4X4_ALLOCATOR = new Float32Allocator16D();

export const FACE_VERTICES_ALLOCATOR_INT8 = new Int8Allocator3D();
export const FACE_VERTICES_ALLOCATOR_INT16 = new Int16Allocator3D();
export const FACE_VERTICES_ALLOCATOR_INT32 = new Int32Allocator3D();
export const VERTEX_FACES_ALLOCATOR_INT8 = new Int8Allocator1D();
export const VERTEX_FACES_ALLOCATOR_INT16 = new Int16Allocator1D();
export const VERTEX_FACES_ALLOCATOR_INT32 = new Int32Allocator1D();
export const FROM_TO_INDICES_ALLOCATOR_INT8 = new Int8Allocator2D();
export const FROM_TO_INDICES_ALLOCATOR_INT16 = new Int16Allocator2D();
export const FROM_TO_INDICES_ALLOCATOR_INT32 = new Int32Allocator2D();
export const RENDER_TARGET_ALLOCATOR = new Int32Allocator1D();