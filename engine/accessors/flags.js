import { Flags } from "./accessor.js";
import { FLAGS_1D_ALLOCATOR } from "../core/memory/allocators.js";
import { FLAGS_2D_ALLOCATOR } from "../core/memory/allocators.js";
import { FLAGS_3D_ALLOCATOR } from "../core/memory/allocators.js";
export class Flags1D extends Flags {
    _getAllocator() { return FLAGS_1D_ALLOCATOR; }
    copy(out = new Flags1D()) { return out.setFrom(this); }
}
export class Flags2D extends Flags {
    _getAllocator() { return FLAGS_2D_ALLOCATOR; }
    copy(out = new Flags2D()) { return out.setFrom(this); }
}
export class Flags3D extends Flags {
    _getAllocator() { return FLAGS_3D_ALLOCATOR; }
    copy(out = new Flags3D()) { return out.setFrom(this); }
}
//# sourceMappingURL=flags.js.map