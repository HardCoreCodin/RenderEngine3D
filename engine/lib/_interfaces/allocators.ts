import {DIM} from "../../constants.js";
import {Tuple, TypedArray} from "../../types.js";

export interface IBaseAllocator<Dim extends DIM>
{
    dim: Dim;
    allocateTemp(): number;
    deallocateTemp(index: number): void;
}

export interface IAllocator<Dim extends DIM>
    extends IBaseAllocator<Dim>
{
    allocate(length: number): Tuple<TypedArray, Dim>;
}

export interface INestedAllocator<Dim extends DIM, OuterDim extends DIM>
    extends IBaseAllocator<Dim>
{
    outer_dim: OuterDim;
    allocate(length: number): Tuple<Tuple<TypedArray, Dim>, OuterDim>
}