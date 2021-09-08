import Buffer from "../core/memory/buffers.js";
import { InterpolationVertexIndices } from "../accessors/accessor.js";
import { Flags1D, Flags2D, Flags3D } from "../accessors/flags.js";
import { FLAGS_1D_ALLOCATOR, FLAGS_2D_ALLOCATOR, FLAGS_3D_ALLOCATOR, U32_4D_ALLOCATOR } from "../core/memory/allocators.js";
export class FlagsBuffer extends Buffer {
    constructor(Flags) {
        super();
        this.Flags = Flags;
    }
    init(length, array, arrays) {
        super.init(length, array, arrays);
        this._post_init();
        return this;
    }
    _post_init() {
        this.current = new this.Flags(this.arrays[0]);
    }
    *[Symbol.iterator]() {
        for (const array of this.arrays) {
            this.current.array = array;
            yield this.current;
        }
    }
    setFrom(other) {
        this.array.set(other.array);
        return this;
    }
}
export class FlagsBuffer1D extends FlagsBuffer {
    _getAllocator() { return FLAGS_1D_ALLOCATOR; }
    constructor() { super(Flags1D); }
}
export class FlagsBuffer2D extends FlagsBuffer {
    _getAllocator() { return FLAGS_2D_ALLOCATOR; }
    constructor() { super(Flags2D); }
}
export class FlagsBuffer3D extends FlagsBuffer {
    _getAllocator() { return FLAGS_3D_ALLOCATOR; }
    constructor() { super(Flags3D); }
}
export class InterpolationVertexIndicesBuffer extends Buffer {
    _getAllocator() {
        return U32_4D_ALLOCATOR;
    }
    init(length, array, arrays) {
        super.init(length, array, arrays);
        this._post_init();
        return this;
    }
    _post_init() {
        this.current = new InterpolationVertexIndices(this.arrays[0]);
    }
    *[Symbol.iterator]() {
        for (const array of this.arrays) {
            this.current.array = array;
            yield this.current;
        }
    }
    setFrom(other) {
        this.array.set(other.array);
        return this;
    }
}
//# sourceMappingURL=flags.js.map