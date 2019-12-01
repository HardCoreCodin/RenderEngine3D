import {InputPositions} from "../inputs.js";
import {Int1Buffer} from "../../buffers/int.js";
import {Int1Allocator} from "../../allocators/int.js";
import {IVertexFaces} from "../../_interfaces/buffers/index.js";
import {VertexFacesIndices} from "../../../types.js";

export const VERTEX_FACES_ALLOCATOR = new Int1Allocator();

export class VertexFaces extends Int1Buffer implements IVertexFaces {
    allocator = VERTEX_FACES_ALLOCATOR;
    indices: VertexFacesIndices = [];

    constructor(inputs: InputPositions) {
        super();

        const vertex_count = this.indices.length = inputs.vertices[0].length;
        const vertex_face_indices: number[][] = Array<number[]>(vertex_count);
        for (let i = 0; i < vertex_count; i++)
            vertex_face_indices[i] = [];

        let length = 0;
        let vertex_id, face_id;
        for (const face_vertex_ids of inputs.faces_vertices) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                vertex_face_indices[vertex_id].push(face_id);
                length++
            }
        }

        this.init(length);

        let current_offset = 0;
        const buffer_int_array = this.arrays[0];
        for (const [vertex_index, face_indices] of vertex_face_indices.entries()) {
            this.indices[vertex_index] = buffer_int_array.subarray(current_offset, face_indices.length);
            current_offset += face_indices.length;
        }
    }
}