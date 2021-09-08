import Buffer from "../core/memory/buffers.js";
import { FACE_VERTICES_ALLOCATOR_INT16, FACE_VERTICES_ALLOCATOR_INT32, FACE_VERTICES_ALLOCATOR_INT8, FROM_TO_INDICES_ALLOCATOR_INT16, FROM_TO_INDICES_ALLOCATOR_INT32, FROM_TO_INDICES_ALLOCATOR_INT8, VERTEX_FACES_ALLOCATOR_INT16, VERTEX_FACES_ALLOCATOR_INT32, VERTEX_FACES_ALLOCATOR_INT8 } from "../core/memory/allocators.js";
import { zip } from "../core/utils.js";
class VertexFaces extends Buffer {
    load(face_vertices, vertex_count) {
        this.arrays.length = vertex_count;
        const vertex_face_indices = Array(vertex_count);
        for (let i = 0; i < vertex_count; i++)
            vertex_face_indices[i] = [];
        let face_id = 0;
        for (const vertex_ids of face_vertices.arrays) {
            vertex_face_indices[vertex_ids[0]].push(face_id);
            vertex_face_indices[vertex_ids[1]].push(face_id);
            vertex_face_indices[vertex_ids[2]].push(face_id);
            face_id++;
        }
        this.init(face_vertices.arrays.length * 3);
        let offset = 0;
        let vertex_index = 0;
        for (const face_indices of vertex_face_indices) {
            this.arrays[vertex_index] = this.array.subarray(offset, offset + face_indices.length);
            this.arrays[vertex_index].set(face_indices);
            offset += face_indices.length;
            vertex_index++;
        }
        return this;
    }
}
class FaceVertices extends Buffer {
    load(inputs) {
        if (this._length !== inputs.faces_vertices.length)
            this.init(inputs.face_count);
        for (const [input, array] of zip(inputs.faces_vertices, this.arrays))
            array.set(input);
        return this;
    }
}
export class FaceVerticesInt8 extends FaceVertices {
    _getAllocator() { return FACE_VERTICES_ALLOCATOR_INT8; }
}
export class FaceVerticesInt16 extends FaceVertices {
    _getAllocator() { return FACE_VERTICES_ALLOCATOR_INT16; }
}
export class FaceVerticesInt32 extends FaceVertices {
    _getAllocator() { return FACE_VERTICES_ALLOCATOR_INT32; }
}
export class VertexFacesInt8 extends VertexFaces {
    _getAllocator() { return VERTEX_FACES_ALLOCATOR_INT8; }
}
export class VertexFacesInt16 extends VertexFaces {
    _getAllocator() { return VERTEX_FACES_ALLOCATOR_INT16; }
}
export class VertexFacesInt32 extends VertexFaces {
    _getAllocator() { return VERTEX_FACES_ALLOCATOR_INT32; }
}
export class FromToIndicesInt8 extends Buffer {
    _getAllocator() { return FROM_TO_INDICES_ALLOCATOR_INT8; }
}
export class FromToIndicesInt16 extends Buffer {
    _getAllocator() { return FROM_TO_INDICES_ALLOCATOR_INT16; }
}
export class FromToIndicesInt32 extends Buffer {
    _getAllocator() { return FROM_TO_INDICES_ALLOCATOR_INT32; }
}
//# sourceMappingURL=indices.js.map