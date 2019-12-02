import {IFaceVertices, IVertexFaces} from "../../_interfaces/buffers.js";
import {Buffer} from "../../buffers.js";
import {DIM} from "../../../constants.js";
import {IAllocator} from "../../_interfaces/allocators.js";
import {
    VERTEX_FACES_ALLOCATOR_INT16,
    VERTEX_FACES_ALLOCATOR_INT32,
    VERTEX_FACES_ALLOCATOR_INT8
} from "../../allocators.js";

export abstract class AbstractVertexFaces<ArrayType extends Uint8Array|Uint16Array|Uint32Array>
    extends Buffer<ArrayType, DIM._1D>
    implements IVertexFaces
{
    dim = DIM._1D as DIM._1D;
    abstract readonly allocator: IAllocator<DIM._1D>;

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

export class VertexFacesInt32
    extends AbstractVertexFaces<Uint32Array>
{
    allocator = VERTEX_FACES_ALLOCATOR_INT32;
}

export class VertexFacesInt16
    extends AbstractVertexFaces<Uint16Array>
{
    allocator = VERTEX_FACES_ALLOCATOR_INT16;
}

export class VertexFacesInt8
    extends AbstractVertexFaces<Uint8Array>
{
    allocator = VERTEX_FACES_ALLOCATOR_INT8;
}