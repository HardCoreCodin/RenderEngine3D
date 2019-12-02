import {DIM} from "../../constants.js";
import {IAllocator} from "./allocators.js";
import {Tuple, TypedArray} from "../../types.js";

export interface IBuffer<Dim extends DIM> {
    dim: number;
    allocator: IAllocator<Dim>;
    length: number;
    arrays: Tuple<TypedArray, Dim>;

    init(length: number): void;

    values(): Generator<Tuple<number, Dim>>;
}

export interface IFaceVertices extends IBuffer<DIM._3D> {
    allocator: IAllocator<DIM._3D>;
}

export interface IVertexFaces extends IBuffer<DIM._1D> {
    allocator: IAllocator<DIM._1D>;
    indices: Array<Uint8Array|Uint16Array|Uint32Array>;
}