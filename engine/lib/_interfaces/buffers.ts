import {IAllocator} from "./allocators.js";
import {TypedArray} from "../../types.js";

export interface IBuffer<ArrayType extends TypedArray = Float32Array>
{
    allocator: IAllocator<ArrayType>;
    length: number;
    arrays: ArrayType[];

    init(length: number): void;
    values(): Generator<number[]>;
}

export interface IFaceVertices<ArrayType extends TypedArray = Uint8Array|Uint16Array|Uint32Array>
    extends IBuffer<ArrayType>
{
    allocator: IAllocator<ArrayType>;
}

export interface IVertexFaces<ArrayType extends TypedArray = Uint8Array|Uint16Array|Uint32Array>
    extends IBuffer<ArrayType>
{
    allocator: IAllocator<ArrayType>;
    indices: Array<ArrayType>;
}

export interface IFromToIndices<ArrayType extends Uint8Array | Uint16Array | Uint32Array>
    extends IBuffer<ArrayType>
{
    allocator: IAllocator<ArrayType>;
}