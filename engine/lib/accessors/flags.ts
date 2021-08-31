import {IFlags} from "../_interfaces/flags.js";
import {Accessor, Flags} from "./accessor.js";
import {FLAGS_1D_ALLOCATOR} from "../memory/allocators.js";
import {FLAGS_2D_ALLOCATOR} from "../memory/allocators.js";
import {FLAGS_3D_ALLOCATOR} from "../memory/allocators.js";

export class Flags1D<Other extends Accessor<Uint8Array> = Accessor<Uint8Array>> extends Flags<Other> implements IFlags
{
    protected _getAllocator() {return FLAGS_1D_ALLOCATOR}
    copy(out: Flags1D = new Flags1D()): Flags1D {return out.setFrom(this)}
}

export class Flags2D<Other extends Accessor<Uint8Array> = Accessor<Uint8Array>> extends Flags<Other> implements IFlags
{
    protected _getAllocator() {return FLAGS_2D_ALLOCATOR}
    copy(out: Flags2D = new Flags2D()): Flags2D {return out.setFrom(this)}
}

export class Flags3D<Other extends Accessor<Uint8Array> = Accessor<Uint8Array>> extends Flags<Other> implements IFlags
{
    protected _getAllocator() {return FLAGS_3D_ALLOCATOR}
    copy(out: Flags3D = new Flags3D()): Flags3D {return out.setFrom(this)}
}
