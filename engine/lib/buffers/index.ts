import {VertexFacesIndices} from "../../types.js";
import {Int1Allocator, Int3Allocator} from "../allocators/int.js";
import {Int1Buffer, Int3Buffer} from "./int.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers/index.js";

export const FACE_VERTICES_ALLOCATOR = new Int3Allocator();
export const VERTEX_FACES_ALLOCATOR = new Int1Allocator();

export class FaceVertices extends Int3Buffer implements IFaceVertices
{
    allocator = FACE_VERTICES_ALLOCATOR;

    load(face_vertices: [number[], number[], number[]]): void {
        this.arrays[0].set(face_vertices[0]);
        this.arrays[1].set(face_vertices[1]);
        this.arrays[2].set(face_vertices[2]);
    }
}

export class VertexFaces extends Int1Buffer implements IVertexFaces {
    allocator = VERTEX_FACES_ALLOCATOR;
    indices: VertexFacesIndices = [];

    load(input_indices: number[][]) {
        const array = this.arrays[0];

        this.indices.length = input_indices.length;

        let offset = 0;
        let num_indices: number;
        for (const [i, indices] of input_indices.entries()) {
            num_indices = indices.length;
            this.indices[i] = array.subarray(offset, num_indices);
            offset += num_indices;
        }
    }
}