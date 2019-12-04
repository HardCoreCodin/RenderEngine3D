import {Buffer} from "../memory/buffers.js";
import {DIM} from "../../constants.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";
import {IAllocator} from "../_interfaces/allocators.js";
import {InputPositions} from "./inputs.js";
import {
    FACE_VERTICES_ALLOCATOR_INT16,
    FACE_VERTICES_ALLOCATOR_INT32,
    FACE_VERTICES_ALLOCATOR_INT8,
    VERTEX_FACES_ALLOCATOR_INT16,
    VERTEX_FACES_ALLOCATOR_INT32,
    VERTEX_FACES_ALLOCATOR_INT8
} from "../memory/allocators.js";

abstract class VertexFaces<ArrayType extends Uint8Array | Uint16Array | Uint32Array>
    extends Buffer<ArrayType, DIM._1D>
    implements IVertexFaces {
    dim = DIM._1D as DIM._1D;
    abstract readonly allocator: IAllocator<DIM._1D, ArrayType>;

    indices: ArrayType[] = [];

    constructor(face_vertices: IFaceVertices, vertex_count: number) {
        super();

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
    }
}

abstract class FaceVertices<ArrayType extends Uint8Array | Uint16Array | Uint32Array>
    extends Buffer<ArrayType, DIM._3D>
    implements IFaceVertices {
    dim = DIM._3D as DIM._3D;
    abstract readonly allocator: IAllocator<DIM._3D, ArrayType>;

    constructor(inputs: InputPositions) {
        super();

        this.init(inputs.faces_vertices[0].length);

        this.arrays[0].set(inputs.faces_vertices[0]);
        this.arrays[1].set(inputs.faces_vertices[1]);
        this.arrays[2].set(inputs.faces_vertices[2]);
    }
}

export class FaceVerticesInt8
    extends FaceVertices<Uint8Array> {
    allocator = FACE_VERTICES_ALLOCATOR_INT8;
}

export class FaceVerticesInt16
    extends FaceVertices<Uint16Array> {
    allocator = FACE_VERTICES_ALLOCATOR_INT16;
}

export class FaceVerticesInt32
    extends FaceVertices<Uint32Array> {
    allocator = FACE_VERTICES_ALLOCATOR_INT32;
}

export class VertexFacesInt32
    extends VertexFaces<Uint32Array> {
    allocator = VERTEX_FACES_ALLOCATOR_INT32;
}

export class VertexFacesInt16
    extends VertexFaces<Uint16Array> {
    allocator = VERTEX_FACES_ALLOCATOR_INT16;
}

export class VertexFacesInt8
    extends VertexFaces<Uint8Array> {
    allocator = VERTEX_FACES_ALLOCATOR_INT8;
}