import {IInt1Buffer, IInt3Buffer, IIntBuffer} from "../_interfaces/buffers/int.js";
import {IIntAllocator} from "../_interfaces/allocators.js";
import {Buffer} from "./_base.js";
import {DIM} from "../../constants.js";
import {Int1Allocator, Int3Allocator} from "../allocators/int.js";

export abstract class IntBuffer<Dim extends DIM> extends Buffer<Uint32Array, Dim>
    implements IIntBuffer<Dim>
{
    abstract readonly allocator: IIntAllocator<Dim>;
}

export abstract class Int1Buffer extends IntBuffer<DIM._1D>
    implements IInt1Buffer
{
    dim = DIM._1D as DIM._1D;
    abstract readonly allocator: Int1Allocator;
}

export abstract class Int3Buffer extends IntBuffer<DIM._3D>
    implements IInt3Buffer
{
    dim = DIM._3D as DIM._3D;
    abstract readonly allocator: Int3Allocator;
}