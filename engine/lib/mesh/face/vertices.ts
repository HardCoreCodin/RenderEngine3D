import {DIM} from "../../../constants.js";
import {InputPositions} from "../inputs.js";
import {IAllocator} from "../../_interfaces/allocators.js";
import {IFaceVertices} from "../../_interfaces/buffers.js";
import {Buffer} from "../../buffers.js";
import {
    FACE_VERTICES_ALLOCATOR_INT16,
    FACE_VERTICES_ALLOCATOR_INT32,
    FACE_VERTICES_ALLOCATOR_INT8
} from "../../allocators.js";

export abstract class FaceVertices<ArrayType extends Uint8Array|Uint16Array|Uint32Array>
    extends Buffer<ArrayType, DIM._3D>
    implements IFaceVertices
{
    dim = DIM._3D as DIM._3D;
    abstract readonly allocator: IAllocator<DIM._3D>;

    constructor(inputs: InputPositions) {
        super();

        this.init(inputs.faces_vertices[0].length);

        this.arrays[0].set(inputs.faces_vertices[0]);
        this.arrays[1].set(inputs.faces_vertices[1]);
        this.arrays[2].set(inputs.faces_vertices[2]);
    }
}

export class FaceVerticesInt8
    extends FaceVertices<Uint8Array>
{
    allocator = FACE_VERTICES_ALLOCATOR_INT8;
}

export class FaceVerticesInt16
    extends FaceVertices<Uint16Array>
{
    allocator = FACE_VERTICES_ALLOCATOR_INT16;
}

export class FaceVerticesInt32
    extends FaceVertices<Uint32Array>
{
    allocator = FACE_VERTICES_ALLOCATOR_INT32;
}