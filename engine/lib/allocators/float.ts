import {DIM} from "../../constants.js";
import {IAllocator, IFloatAllocator} from "../_interfaces/allocators.js";
import {AbstractFloatArrayAllocator} from "./_base.js";

export class Float2Allocator
    extends AbstractFloatArrayAllocator<DIM._2D>
    implements IFloatAllocator<DIM._2D>
{
    public dim = DIM._2D as DIM._2D;
}

export class Float3Allocator
    extends AbstractFloatArrayAllocator<DIM._3D>
    implements IAllocator<Float32Array, DIM._3D>
{
    public dim = DIM._3D as DIM._3D;
}

export class Float4Allocator
    extends AbstractFloatArrayAllocator<DIM._4D>
    implements IAllocator<Float32Array, DIM._4D>
{
    public dim = DIM._4D as DIM._4D;
}

export class Float9Allocator
    extends AbstractFloatArrayAllocator<DIM._9D>
    implements IAllocator<Float32Array, DIM._9D>
{
    public dim = DIM._9D as DIM._9D;
}

export class Float16Allocator
    extends AbstractFloatArrayAllocator<DIM._16D>
    implements IAllocator<Float32Array, DIM._16D>
{
    public dim = DIM._16D as DIM._16D;
}

export type FloatNAllocator =
    Float2Allocator |
    Float3Allocator |
    Float4Allocator |
    Float9Allocator |
    Float16Allocator;

export const VECTOR_2D_ALLOCATOR = new Float2Allocator();
export const VECTOR_3D_ALLOCATOR = new Float3Allocator();
export const VECTOR_4D_ALLOCATOR = new Float4Allocator();
export const MATRIX_2X2_ALLOCATOR = new Float4Allocator();
export const MATRIX_3X3_ALLOCATOR = new Float9Allocator();
export const MATRIX_4X4_ALLOCATOR = new Float16Allocator();