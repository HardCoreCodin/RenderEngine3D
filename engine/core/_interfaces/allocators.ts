import {DIM} from "../constants.js";
import {TypedArray, TypedArrayConstructor} from "../types.js";


export interface IAllocator<ArrayType extends TypedArray> {
    dim: DIM;
    ArrayConstructor: TypedArrayConstructor<ArrayType>;

    allocate(): ArrayType;
    allocateBuffer(length: number): [ArrayType, ArrayType[]];
}