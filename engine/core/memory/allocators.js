const MEMORY_SIZE = 2 ** 30;
const __memory = new ArrayBuffer(MEMORY_SIZE);
let __offset = 0;
const __allocate = (size) => {
    let offset = __offset - (__offset % 4) + 4;
    __offset += size + 4 - (__offset % 4);
    if (__offset > MEMORY_SIZE)
        throw 'Buffer overflow!';
    return offset;
};
export class Allocator {
    constructor(dim) {
        this.dim = dim;
        this.ArrayConstructor = this._getArrayConstructor();
    }
    allocate() {
        const size = this.dim * this.ArrayConstructor.BYTES_PER_ELEMENT;
        const offset = __allocate(size);
        return new this.ArrayConstructor(__memory, offset, this.dim);
    }
    allocateBuffer(length) {
        const count = length * this.dim;
        const size = count * this.ArrayConstructor.BYTES_PER_ELEMENT;
        const offset = __allocate(size);
        const buffer = new this.ArrayConstructor(__memory, offset, count);
        if (this.dim === 1)
            return [buffer, [buffer]];
        const arrays = Array(length);
        let start = 0;
        let end = this.dim;
        for (let i = 0; i < length; i++) {
            arrays[i] = buffer.subarray(start, end);
            start += this.dim;
            end += this.dim;
        }
        return [buffer, arrays];
    }
}
export class Float32Allocator extends Allocator {
    _getArrayConstructor() { return Float32Array; }
}
export class Float32Allocator1D extends Float32Allocator {
    constructor() { super(1 /* _1D */); }
}
export class Float32Allocator2D extends Float32Allocator {
    constructor() { super(2 /* _2D */); }
}
export class Float32Allocator3D extends Float32Allocator {
    constructor() { super(3 /* _3D */); }
}
export class Float32Allocator4D extends Float32Allocator {
    constructor() { super(4 /* _4D */); }
}
export class Float32Allocator9D extends Float32Allocator {
    constructor() { super(9 /* _9D */); }
}
export class Float32Allocator16D extends Float32Allocator {
    constructor() { super(16 /* _16D */); }
}
export class Int8Allocator extends Allocator {
    _getArrayConstructor() { return Uint8Array; }
}
export class Int8Allocator1D extends Int8Allocator {
    constructor() { super(1 /* _1D */); }
}
export class Int8Allocator2D extends Int8Allocator {
    constructor() { super(2 /* _2D */); }
}
export class Int8Allocator3D extends Int8Allocator {
    constructor() { super(3 /* _3D */); }
}
export class Int16Allocator extends Allocator {
    _getArrayConstructor() { return Uint16Array; }
}
export class Int16Allocator1D extends Int16Allocator {
    constructor() { super(1 /* _1D */); }
}
export class Int16Allocator2D extends Int16Allocator {
    constructor() { super(2 /* _2D */); }
}
export class Int16Allocator3D extends Int16Allocator {
    constructor() { super(3 /* _3D */); }
}
export class Int32Allocator extends Allocator {
    _getArrayConstructor() { return Uint32Array; }
}
export class Int32Allocator1D extends Int32Allocator {
    constructor() { super(1 /* _1D */); }
}
export class Int32Allocator2D extends Int32Allocator {
    constructor() { super(2 /* _2D */); }
}
export class Int32Allocator3D extends Int32Allocator {
    constructor() { super(3 /* _3D */); }
}
export class Int32Allocator4D extends Int32Allocator {
    constructor() { super(4 /* _4D */); }
}
export class Uint8ClampedAllocator extends Allocator {
    _getArrayConstructor() { return Uint8ClampedArray; }
}
export class Uint8ClampedAllocator1D extends Uint8ClampedAllocator {
    constructor() { super(1 /* _1D */); }
}
export const FLAGS_1D_ALLOCATOR = new Int8Allocator1D();
export const FLAGS_2D_ALLOCATOR = new Int8Allocator2D();
export const FLAGS_3D_ALLOCATOR = new Int8Allocator3D();
export const U32_4D_ALLOCATOR = new Int32Allocator4D();
export const VECTOR_2D_ALLOCATOR = new Float32Allocator2D();
export const VECTOR_3D_ALLOCATOR = new Float32Allocator3D();
export const VECTOR_4D_ALLOCATOR = new Float32Allocator4D();
export const FACE_AREAS_ALLOCATOR = new Float32Allocator3D();
export const MATRIX_2X2_ALLOCATOR = new Float32Allocator4D();
export const MATRIX_3X3_ALLOCATOR = new Float32Allocator9D();
export const MATRIX_4X4_ALLOCATOR = new Float32Allocator16D();
export const FACE_VERTICES_ALLOCATOR_INT8 = new Int8Allocator3D();
export const FACE_VERTICES_ALLOCATOR_INT16 = new Int16Allocator3D();
export const FACE_VERTICES_ALLOCATOR_INT32 = new Int32Allocator3D();
export const VERTEX_FACES_ALLOCATOR_INT8 = new Int8Allocator1D();
export const VERTEX_FACES_ALLOCATOR_INT16 = new Int16Allocator1D();
export const VERTEX_FACES_ALLOCATOR_INT32 = new Int32Allocator1D();
export const FROM_TO_INDICES_ALLOCATOR_INT8 = new Int8Allocator2D();
export const FROM_TO_INDICES_ALLOCATOR_INT16 = new Int16Allocator2D();
export const FROM_TO_INDICES_ALLOCATOR_INT32 = new Int32Allocator2D();
export const RENDER_TARGET_ALLOCATOR = new Uint8ClampedAllocator1D();
export const UINT32_ALLOCATOR = new Int32Allocator1D();
export const FLOAT32_ALLOCATOR = new Float32Allocator1D();
//# sourceMappingURL=allocators.js.map