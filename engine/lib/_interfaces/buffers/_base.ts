import {IAllocator} from "../allocators.js";
import {TypedArray} from "../../../types.js";
import {DIM} from "../../../constants.js";

export interface IBuffer<ArrayType extends TypedArray, Dim extends DIM> {
    dim: Dim;
    allocator: IAllocator<ArrayType, Dim>;
    length: number;
    arrays: ArrayType[];

    init(length: number): void;

    values(): Generator<number[]>;
}

