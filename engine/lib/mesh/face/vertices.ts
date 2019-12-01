import {Int3Allocator} from "../../allocators/int.js";
import {Int3Buffer} from "../../buffers/int.js";
import {IFaceVertices} from "../../_interfaces/buffers/index.js";
import {InputPositions} from "../inputs.js";

export const FACE_VERTICES_ALLOCATOR = new Int3Allocator();

export class FaceVertices extends Int3Buffer implements IFaceVertices {
    allocator = FACE_VERTICES_ALLOCATOR;

    constructor(inputs: InputPositions) {
        super();

        this.init(inputs.faces_vertices[0].length);

        this.arrays[0].set(inputs.faces_vertices[0]);
        this.arrays[1].set(inputs.faces_vertices[1]);
        this.arrays[2].set(inputs.faces_vertices[2]);
    }
}