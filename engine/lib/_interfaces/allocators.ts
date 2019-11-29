import {DIM} from "../../constants.js";
import {TypedArray} from "../../types.js";

export interface IBaseAllocator<Dim extends DIM> {
    allocateTemp(): number;

    deallocateTemp(index: number): void;

    dim: Dim;
}

export interface IAllocator<
    ArrayType extends TypedArray,
    Dim extends DIM>
    extends IBaseAllocator<Dim>
{
    allocate(length: number): ArrayType[];
}

export interface IFloatAllocator<Dim extends DIM>
    extends IAllocator<Float32Array, Dim>
{}

export interface IIntAllocator<Dim extends DIM>
    extends IAllocator<Uint32Array, Dim>
{}

export interface IInt1Allocator extends IIntAllocator<DIM._1D>
{}

export interface IInt3Allocator extends IIntAllocator<DIM._3D>
{}

export interface INestedAllocator<
    ArrayType extends TypedArray,
    Dim extends DIM>
    extends IBaseAllocator<Dim>
{
    outer_dim: DIM;

    allocate(length: number): ArrayType[][]
}