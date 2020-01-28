import {Vector} from "../../accessors/accessor.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";


export class Triangle<VectorType extends Vector> {
    public readonly a: VectorType;
    public readonly b: VectorType;
    public readonly c: VectorType;

    constructor(
        protected readonly Vector: VectorConstructor<VectorType>,
        arrays: Float32Array[]
    ) {
        this.a = new this.Vector(0, arrays);
        this.b = new this.Vector(0, arrays);
        this.c = new this.Vector(0, arrays);
    }
}

function* _iterSharedTriangles<VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
(
    triangle: TriangleType,
    vector_of_vertex_1: VectorType,
    vector_of_vertex_2: VectorType,
    vector_of_vertex_3: VectorType,
    indices_v1: Indices,
    indices_v2: Indices,
    indices_v3: Indices,
    face_count: number
): Generator<TriangleType> {

    for (face_index = 0; face_index < face_count; face_index++) {
        vector_of_vertex_1.id = indices_v1[face_index];
        vector_of_vertex_2.id = indices_v2[face_index];
        vector_of_vertex_3.id = indices_v3[face_index];
        yield triangle;
    }
}

function* _iterUnsharedTriangles<VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
(
    triangle: TriangleType,
    vector_of_vertex_1: VectorType,
    vector_of_vertex_2: VectorType,
    vector_of_vertex_3: VectorType,
    face_count: number
): Generator<TriangleType> {
    offset = 0;
    for (face_index = 0; face_index < face_count; face_index++) {
        vector_of_vertex_1.id = offset++;
        vector_of_vertex_2.id = offset++;
        vector_of_vertex_3.id = offset++;

        yield triangle;
    }
}

export const iterTriangles = <
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
(
    triangle: TriangleType,
    indices: Indices[],
    face_count: number,
    shared: boolean
): Generator<TriangleType> => shared ?
    _iterSharedTriangles(
        triangle,
        triangle.a,
        triangle.b,
        triangle.c,

        indices[0],
        indices[1],
        indices[2],

        face_count
    ) :
    _iterUnsharedTriangles(
        triangle,
        triangle.a,
        triangle.b,
        triangle.c,

        face_count
    );


let face_index, offset: number;
type Indices = Uint8Array | Uint16Array | Uint32Array;
