import {DIM} from "../../constants.js";
import {IAllocator} from "./allocators.js";
import {Tuple, TypedArray} from "../../types.js";

export interface IBuffer<
    Dim extends DIM,
    ArrayType extends TypedArray = Float32Array>
{
    dim: number;
    allocator: IAllocator<Dim, ArrayType>;
    length: number;
    arrays: Tuple<ArrayType, Dim>;

    init(length: number): void;

    values(): Generator<Tuple<number, Dim>>;
}

export interface IFaceVertices<ArrayType extends TypedArray = Uint8Array|Uint16Array|Uint32Array>
    extends IBuffer<DIM._3D, ArrayType>
{
    allocator: IAllocator<DIM._3D, ArrayType>;
}

export interface IVertexFaces<ArrayType extends TypedArray = Uint8Array|Uint16Array|Uint32Array>
    extends IBuffer<DIM._1D, ArrayType>
{
    allocator: IAllocator<DIM._1D, ArrayType>;
    indices: Array<ArrayType>;
}