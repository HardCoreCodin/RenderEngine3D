import {DIM} from "../../constants.js";
import {ArraysBlocksAllocator} from "../memory/allocators.js";
import {AnyConstructor, TypedArray, TypedArrayConstructor} from "../../types.js";

export interface IArraysBlock<ArrayType extends TypedArray> {
    readonly dim: DIM;
    readonly length: number;
    readonly buffer: ArrayType;
    readonly arrays: ArrayType[];
    readonly is_full: boolean;

    allocate(): number;

    deallocate(index: number): void;
}

export interface IArraysBlocksAllocator<ArrayType extends TypedArray = Float32Array> {
    readonly dim: DIM;
    readonly ArrayConstructor: TypedArrayConstructor<ArrayType>;

    allocate(arrays?: ArrayType[]): number;
    deallocate(array: ArrayType, index: number): void;
}

export interface IAllocator<ArrayType extends TypedArray> {
    dim: DIM;
    ArrayConstructor: AnyConstructor<ArrayType>;
    blocks: ArraysBlocksAllocator<ArrayType>;

    allocate(arrays?: ArrayType[]): number;
    allocateBuffer(length: number): ArrayType[];
}