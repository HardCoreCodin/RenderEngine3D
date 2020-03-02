import Buffer from "../memory/buffers.js";
import {InputPositions} from "./inputs.js";
import {
    FACE_VERTICES_ALLOCATOR_INT16,
    FACE_VERTICES_ALLOCATOR_INT32,
    FACE_VERTICES_ALLOCATOR_INT8,
    FROM_TO_INDICES_ALLOCATOR_INT16,
    FROM_TO_INDICES_ALLOCATOR_INT32,
    FROM_TO_INDICES_ALLOCATOR_INT8,
    VERTEX_FACES_ALLOCATOR_INT16,
    VERTEX_FACES_ALLOCATOR_INT32,
    VERTEX_FACES_ALLOCATOR_INT8
} from "../memory/allocators.js";
import {IFaceVertices, IFromToIndices, IVertexFaces} from "../_interfaces/buffers.js";
import {zip} from "../../utils.js";


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

        for (const [face_id, vertex_ids] of face_vertices.arrays.entries()) {
            vertex_face_indices[vertex_ids[0]].push(face_id);
            vertex_face_indices[vertex_ids[1]].push(face_id);
            vertex_face_indices[vertex_ids[2]].push(face_id);
        }

        this.init(face_vertices.arrays.length * 3);

        let offset = 0;
        for (const [vertex_index, face_indices] of vertex_face_indices.entries()) {
            this.indices[vertex_index] = this.array.subarray(offset, offset+face_indices.length) as ArrayType;
            this.indices[vertex_index].set(face_indices);
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
        if (this._length !== inputs.faces_vertices.length)
            this.init(inputs.face_count);

        for (const [input, array] of zip(inputs.faces_vertices, this.arrays))
            array.set(input);

        return this;
    }
}

export class FaceVerticesInt8 extends FaceVertices<Uint8Array> {
    protected  _getAllocator() {return FACE_VERTICES_ALLOCATOR_INT8}
}
export class FaceVerticesInt16 extends FaceVertices<Uint16Array> {
    protected  _getAllocator() {return FACE_VERTICES_ALLOCATOR_INT16}
}
export class FaceVerticesInt32 extends FaceVertices<Uint32Array> {
    protected  _getAllocator() {return FACE_VERTICES_ALLOCATOR_INT32}
}

export class VertexFacesInt8 extends VertexFaces<Uint8Array> {
    protected  _getAllocator() {return VERTEX_FACES_ALLOCATOR_INT8}
}
export class VertexFacesInt16 extends VertexFaces<Uint16Array> {
    protected  _getAllocator() {return VERTEX_FACES_ALLOCATOR_INT16}
}
export class VertexFacesInt32 extends VertexFaces<Uint32Array> {
    protected  _getAllocator() {return VERTEX_FACES_ALLOCATOR_INT32}
}

export class FromToIndicesInt8
    extends Buffer<Uint8Array>
    implements IFromToIndices<Uint8Array>
{
    protected  _getAllocator() {return FROM_TO_INDICES_ALLOCATOR_INT8}
}
export class FromToIndicesInt16
    extends Buffer<Uint16Array>
    implements IFromToIndices<Uint16Array>
{
    protected  _getAllocator() {return FROM_TO_INDICES_ALLOCATOR_INT16}
}
export class FromToIndicesInt32
    extends Buffer<Uint32Array>
    implements IFromToIndices<Uint32Array>
{
    protected  _getAllocator() {return FROM_TO_INDICES_ALLOCATOR_INT32}
}