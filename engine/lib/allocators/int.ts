import {AbstractIntArrayAllocator} from "./_base.js";
import {IInt1Allocator, IInt3Allocator} from "../_interfaces/allocators.js";
import {DIM} from "../../constants.js";

export class Int1Allocator
    extends AbstractIntArrayAllocator<DIM._1D>
    implements IInt1Allocator
{
    public dim = DIM._1D as DIM._1D;
}

export class Int3Allocator
    extends AbstractIntArrayAllocator<DIM._3D>
    implements IInt3Allocator
{
    public dim = DIM._3D as DIM._3D;
}