import {Buffer} from "../allocators.js";
import {Num3, Int3, IntArray, VertexFacesIndices, TriangleInputs} from "../types.js";
import {iterTypedArray} from "../utils.js";
import {IntData, zip} from "./attribute.js";
import {DIM} from "../constants.js";

const __face_vertices_buffer_entry: Num3 = [0, 0, 0];
const __face_vertices_buffer_slice: Int3 = [null, null, null];
const FACE_VERTICES_ARRAYS: Int3 = [null, null, null];

class FaceVerticesBuffer extends Buffer<DIM._3D, IntArray> {
    protected readonly _entry = __face_vertices_buffer_entry;
    protected readonly _slice = __face_vertices_buffer_slice;
}
export const faceVerticesBuffer = new FaceVerticesBuffer(FACE_VERTICES_ARRAYS);

export class FaceVertices extends IntData<DIM._3D>
{
    protected readonly _buffer = faceVerticesBuffer;

    load(input_indices: TriangleInputs): void {
        this._buffer.arrays[0].set(input_indices[0], this.begin);
        this._buffer.arrays[1].set(input_indices[1], this.begin);
        this._buffer.arrays[2].set(input_indices[2], this.begin);
    }
}

const __vertex_faces_buffer_entry: [number] = [0];
const __vertex_faces_buffer_slice: [IntArray] = [null];
const VERTEX_FACES_ARRAYS: [IntArray] = [null];

class VertexFacesBuffer extends Buffer<DIM._1D, IntArray> {
    protected readonly _entry = __vertex_faces_buffer_entry;
    protected readonly _slice = __vertex_faces_buffer_slice;
}
export const vertexFacesBuffer = new VertexFacesBuffer(VERTEX_FACES_ARRAYS);

export class VertexFaces extends IntData<DIM._1D> {
    protected readonly _buffer = vertexFacesBuffer;

    public readonly begins: number[] = [0];
    public readonly ends: number[] = [0];

    protected readonly _array: IntArray;
    protected readonly _sub_arrays: Array<IntArray> = [];

    constructor() {
        super();
        this._array = this._buffer.arrays[0] as IntArray;
    }

    protected* _iterArrayValues(): Generator<[number, Generator<number>]> {
        for (const [begin, end, vertex_index] of zip(this.begins, this.ends))
            yield [vertex_index, iterTypedArray(this._array, begin, end)];
    }

    get iter_indices(): Generator<[number, Generator<number>]> {
        return this._iterArrayValues();
    }

    get indices(): VertexFacesIndices {
        this._sub_arrays.length = this.begins.length;

        for (const [begin, end, i] of zip(this.begins, this.ends))
            this._sub_arrays[i] = this._array.subarray(begin, end);

        return this._sub_arrays;
    }

    load(input_indices: number[][]) {
        this.begins.length = this.ends.length = input_indices.length;

        let offset = this.begin;
        for (const [i, array] of input_indices.entries()) {
            this._array.set(array, offset);
            this.begins[i] = offset;
            offset += array.length;
            this.ends[i] = offset;
        }
    }
}