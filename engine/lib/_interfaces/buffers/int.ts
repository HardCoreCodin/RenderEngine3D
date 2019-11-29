import {IInt1Allocator, IInt3Allocator, IIntAllocator} from "../allocators.js";
import {IBuffer} from "./_base.js";
import {DIM} from "../../../constants.js";

export interface IIntBuffer<Dim extends DIM> extends IBuffer<Uint32Array, Dim>
{
    allocator: IIntAllocator<Dim>;
}

export interface IInt3Buffer extends IIntBuffer<DIM._3D> {

    allocator: IInt3Allocator;
}

export interface IInt1Buffer extends IIntBuffer<DIM._1D> {

    allocator: IInt1Allocator;
}