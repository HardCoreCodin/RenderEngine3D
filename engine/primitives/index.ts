import {VertexFacesIndices, TriangleInputs} from "../types.js";
import {Data, zip} from "./attribute.js";
import {IntBuffer} from "../buffer.js";


let INDEX_ARRAY_1, INDEX_ARRAY_2, INDEX_ARRAY_3: Uint32Array;
const INDEX_ARRAYS: [Uint32Array, Uint32Array, Uint32Array] = [null, null, null];

const updateIndexArray1 = (index_Array_1) => INDEX_ARRAY_1 = INDEX_ARRAYS[0] = index_Array_1;
const updateIndexArray2 = (index_Array_2) => INDEX_ARRAY_2 = INDEX_ARRAYS[1] = index_Array_2;
const updateIndexArray3 = (index_Array_3) => INDEX_ARRAY_3 = INDEX_ARRAYS[2] = index_Array_3;

const INDEX_BUFFER_1 = new IntBuffer(updateIndexArray1, 0);
const INDEX_BUFFER_2 = new IntBuffer(updateIndexArray2, 0);
const INDEX_BUFFER_3 = new IntBuffer(updateIndexArray3, 0);

let _index: number;
const _allocateFaceVertices = (length: number): number => {
    _index = INDEX_BUFFER_1.allocate(length);
    INDEX_BUFFER_2.allocate(length);
    INDEX_BUFFER_3.allocate(length);

    return _index;
};

export class FaceVertices extends Data<Uint32Array>
{
    load(
        index_Array_1: number[],
        index_array_2: number[],
        index_Array_3: number[]
    ): void {
        INDEX_ARRAY_1.set(index_Array_1, this.begin);
        INDEX_ARRAY_2.set(index_array_2, this.begin);
        INDEX_ARRAY_3.set(index_Array_3, this.begin);
    }
}

export const createFaceVertices = (): FaceVertices => new FaceVertices(INDEX_ARRAYS, _allocateFaceVertices);

let VERTEX_FACES: Uint32Array;
const VERTEX_FACES_ARRAYS: [Uint32Array] = [null];

const updateVertexFaces = (vertex_faces) => VERTEX_FACES = VERTEX_FACES_ARRAYS[0] = vertex_faces;
const VERTEX_FACES_BUFFER = new IntBuffer(updateVertexFaces, 0);

export class VertexFaces extends Data<Uint32Array>
{
    arrays = VERTEX_FACES_ARRAYS;

    public readonly begins: number[] = [0];
    public readonly ends: number[] = [0];

    protected readonly _sub_arrays: Array<Uint32Array> = [];

    // protected* _iterArrayValues(): Generator<[number, Generator<number>]> {
    //     for (const [begin, end, vertex_index] of zip(this.begins, this.ends))
    //         yield [vertex_index, iterTypedArray(VERTEX_FACES, begin, end)];
    // }

    // get iter_indices(): Generator<[number, Generator<number>]> {
    //     return this._iterArrayValues();
    // }

    get indices(): VertexFacesIndices {
        this._sub_arrays.length = this.begins.length;

        for (const [begin, end, i] of zip(this.begins, this.ends))
            this._sub_arrays[i] = VERTEX_FACES.subarray(begin, end);

        return this._sub_arrays;
    }

    load(input_indices: number[][]) {
        this.begins.length = this.ends.length = input_indices.length;

        let offset = this.begin;
        for (const [i, array] of input_indices.entries()) {
            VERTEX_FACES.set(array, offset);
            this.begins[i] = offset;
            offset += array.length;
            this.ends[i] = offset;
        }
    }

    protected _allocate(length: number): number {
        return VERTEX_FACES_BUFFER.allocate(length);
    }
}