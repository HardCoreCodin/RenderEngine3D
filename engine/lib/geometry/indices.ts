import Buffer from "../memory/buffers.js";
import {IFaceVertices, IFromToIndices, IVertexFaces} from "../_interfaces/buffers.js";
import {InputPositions} from "./inputs.js";
import {
    FACE_VERTICES_ALLOCATOR_INT16,
    FACE_VERTICES_ALLOCATOR_INT32,
    FACE_VERTICES_ALLOCATOR_INT8,
    FROM_TO_INDICES_ALLOCATOR_INT16,
    FROM_TO_INDICES_ALLOCATOR_INT32,
    FROM_TO_INDICES_ALLOCATOR_INT8,
    Int16Allocator1D,
    Int16Allocator2D,
    Int16Allocator3D,
    Int32Allocator1D,
    Int32Allocator2D,
    Int32Allocator3D,
    Int8Allocator1D,
    Int8Allocator2D,
    Int8Allocator3D,
    VERTEX_FACES_ALLOCATOR_INT16,
    VERTEX_FACES_ALLOCATOR_INT32,
    VERTEX_FACES_ALLOCATOR_INT8
} from "../memory/allocators.js";
import {IAllocator} from "../_interfaces/allocators.js";


abstract class VertexFaces<ArrayType extends Uint8Array | Uint16Array | Uint32Array>
    extends Buffer<ArrayType>
    implements IVertexFaces
{
    indices: ArrayType[] = [];

    load(face_vertices: IFaceVertices, vertex_count: number): this {
        this.indices.length = vertex_count;
        const vertex_face_indices: number[][] = Array<number[]>(vertex_count);
        for (let i = 0; i < vertex_count; i++)
            vertex_face_indices[i] = [];

        let length = 0;
        for (const face_vertex_ids of face_vertices.arrays) {
            for (let face_id = 0; face_id < face_vertex_ids.length; face_id++) {
                vertex_face_indices[face_vertex_ids[face_id]].push(face_id);
                length++
            }
        }

        this.init(length);

        let offset = 0;
        const array = this.arrays[0];
        for (const [vertex_index, face_indices] of vertex_face_indices.entries()) {
            this.indices[vertex_index] = array.subarray(offset, face_indices.length) as ArrayType;
            offset += face_indices.length;
        }

        return this;
    }
}

abstract class FaceVertices<ArrayType extends Uint8Array | Uint16Array | Uint32Array>
    extends Buffer<ArrayType>
    implements IFaceVertices
{
    load(inputs: InputPositions): this {
        if (this.length !== inputs.face_count)
            this.init(inputs.face_count);

        this.arrays[0].set(inputs.faces_vertices[0]);
        this.arrays[1].set(inputs.faces_vertices[1]);
        this.arrays[2].set(inputs.faces_vertices[2]);

        return this;
    }
}

export class FaceVerticesInt8 extends FaceVertices<Uint8Array> {
    constructor(
        length?: number,
        arrays?: Uint8Array[]
    ) {
        super(FACE_VERTICES_ALLOCATOR_INT8, length, arrays);
    }
}
export class FaceVerticesInt16 extends FaceVertices<Uint16Array> {
    constructor(
        length?: number,
        arrays?: Uint16Array[]
    ) {
        super(FACE_VERTICES_ALLOCATOR_INT16, length, arrays);
    }
}
export class FaceVerticesInt32 extends FaceVertices<Uint32Array> {
    constructor(
        length?: number,
        arrays?: Uint32Array[]
    ) {
        super(FACE_VERTICES_ALLOCATOR_INT32, length, arrays);
    }
}

export class VertexFacesInt8 extends VertexFaces<Uint8Array> {
    constructor(
        length?: number,
        arrays?: Uint8Array[]
    ) {
        super(VERTEX_FACES_ALLOCATOR_INT8, length, arrays);
    }
}
export class VertexFacesInt16 extends VertexFaces<Uint16Array> {
    constructor(
        length?: number,
        arrays?: Uint16Array[]
    ) {
        super(VERTEX_FACES_ALLOCATOR_INT16, length, arrays);
    }
}
export class VertexFacesInt32 extends VertexFaces<Uint32Array> {
    constructor(
        length?: number,
        arrays?: Uint32Array[]
    ) {
        super(VERTEX_FACES_ALLOCATOR_INT32, length, arrays);
    }
}

export class FromToIndicesInt8
    extends Buffer<Uint8Array>
    implements IFromToIndices<Uint8Array>
{
    constructor(
        length?: number,
        arrays?: Uint8Array[]
    ) {
        super(FROM_TO_INDICES_ALLOCATOR_INT8, length, arrays);
    }
}
export class FromToIndicesInt16
    extends Buffer<Uint16Array>
    implements IFromToIndices<Uint16Array>
{
    constructor(
        length?: number,
        arrays?: Uint16Array[]
    ) {
        super(FROM_TO_INDICES_ALLOCATOR_INT16, length, arrays);
    }
}
export class FromToIndicesInt32
    extends Buffer<Uint32Array>
    implements IFromToIndices<Uint32Array>
{
    constructor(
        length?: number,
        arrays?: Uint32Array[]
    ) {
        super(FROM_TO_INDICES_ALLOCATOR_INT32, length, arrays);
    }
}