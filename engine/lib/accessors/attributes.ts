import {zip} from "../../utils.js";
import {Vector} from "./accessor.js";
import {Vector4D} from "./vector4D.js";
import {Matrix2x2} from "./matrix2x2.js";
import {Matrix3x3} from "./matrix3x3.js";
import {Matrix4x4} from "./matrix4x4.js";
import {FloatBuffer} from "../memory/buffers.js";
import {ATTRIBUTE} from "../../constants.js";
import {
    Float32Allocator2D,
    Float32Allocator3D,
    Float32Allocator4D,
    VECTOR_2D_ALLOCATOR,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../memory/allocators.js";
import {
    multiply_all_3D_directions_by_a_4x4_matrix_to_out,
    multiply_all_3D_positions_by_a_4x4_matrix_to_out,
    multiply_all_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_all_3D_vectors_by_a_3x3_matrix_to_out,
    multiply_some_3D_directions_by_a_4x4_matrix_to_out,
    multiply_some_3D_positions_by_a_4x4_matrix_to_out,
    normalize_all_3D_directions_in_place,
    normalize_some_3D_directions_in_place,
} from "../math/vec3.js";
import {
    multiply_all_2D_vectors_by_a_2x2_matrix_in_place,
    multiply_all_2D_vectors_by_a_2x2_matrix_to_out,
    normalize_all_2D_directions_in_place,
    normalize_some_2D_directions_in_place
} from "../math/vec2.js";
import {
    multiply_all_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_all_4D_vectors_by_a_4x4_matrix_to_out,
    normalize_all_4D_directions_in_place,
    normalize_some_4D_directions_in_place,
} from "../math/vec4.js";
import {AnyConstructor} from "../../types.js";
import {VectorConstructor} from "../_interfaces/vectors.js";
import {IFaceVertices} from "../_interfaces/buffers.js";


abstract class AttributeBuffer<VectorType extends Vector> extends FloatBuffer
{
    readonly abstract attribute: ATTRIBUTE;
    protected abstract _getVectorConstructor(): VectorConstructor<VectorType>;
    readonly Vector: VectorConstructor<VectorType>;
    readonly current: VectorType;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length,
        length?: number,
        arrays?: Float32Array[]
    ) {
        super(length, arrays);
        this.Vector = this._getVectorConstructor();
        this.current = new this.Vector(0, this.arrays);
    }

    *[Symbol.iterator](): Generator<VectorType> {
        for (let id = 0; id < this.length; id++) {
            this.current.id = id;
            yield this.current;
        }
    }

    setFrom(other: AttributeBuffer<VectorType>): this {
        for (const [this_array, other_array] of zip(this.arrays, other.arrays))
            this_array.set(other_array);

        return this;
    }

    protected _normalize(include?: Uint8Array[]): this {
        if (include)
            _normalize_some(this.arrays, include);
        else
            _normalize_all(this.arrays);

        return this;
    }
}


// Face Attribute Buffers:
// =========================

export abstract class FaceAttributeBuffer<VectorType extends Vector>
    extends AttributeBuffer<VectorType>
{
    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length,
        arrays?: Float32Array[]
    ) {
        super(face_vertices, face_count, face_count, arrays);
    }

    protected _pull(input_arrays: Float32Array[], input_is_shared: boolean): void {
        if (input_is_shared) {
            const idx = this.face_vertices.arrays;
            _pullSharedFace(this.arrays, input_arrays, idx[0], idx[1], idx[2], this.face_count);
        } else
            _pullUnsharedFace(this.arrays, input_arrays, this.face_count);
    }
}

export abstract class TransformableFaceAttributeBuffer2D<VectorType extends Vector>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator2D {
        return VECTOR_2D_ALLOCATOR;
    }

    mul(matrix: Matrix2x2, out?: this): this {
        if (out) {
            _mulVec2Mat2(this.arrays, matrix.arrays, matrix.id, out.arrays);
            return out;
        }

        _mulVec2Mat2IP(this.arrays, matrix.arrays, matrix.id);
        return this;
    }
}

export abstract class TransformableFaceAttributeBuffer3D<
    VectorType extends Vector,
    Vector4DType extends Vector4D,
    FaceAttribute4DType extends TransformableFaceAttributeBuffer4D<Vector4DType>>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator3D {
        return VECTOR_3D_ALLOCATOR;
    }

    mul(matrix: Matrix3x3): this;
    mul(matrix: Matrix3x3, out: this): this;
    mul(matrix: Matrix4x4, out: FaceAttribute4DType): FaceAttribute4DType;
    mul(matrix: Matrix4x4, out: FaceAttribute4DType, include: Uint8Array[]): FaceAttribute4DType;
    mul(matrix: Matrix3x3|Matrix4x4, out?: this|FaceAttribute4DType, include?: Uint8Array[]): this|FaceAttribute4DType  {
        if (matrix instanceof Matrix3x3) {
            if (out) {
                if (out instanceof this.constructor) {
                    _mulVec3Mat3(this.arrays, matrix.arrays, matrix.id, out.arrays);
                    return out;
                } else
                    throw `Invalid out type: ${out}`;
            }

            _mulVec3Mat3IP(this.arrays, matrix.arrays, matrix.id);
            return this;
        } else if (matrix instanceof Matrix4x4) {
            if (out instanceof this.constructor)
                throw `Invalid out type: ${out}`;

            if (include)
                _mulSomePos3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
            else
                _mulAllPos3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

            return out;
        }
    }
}

export abstract class TransformableFaceAttributeBuffer4D<VectorType extends Vector>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator4D {
        return VECTOR_4D_ALLOCATOR;
    }

    mul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            _mulVec4Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);
            return out;
        }

        _mulVec4Mat4IP(this.arrays, matrix.arrays, matrix.id);
        return this;
    }
}

// Vertex Attribute Buffers:
// =========================

export class Triangle<VectorType extends Vector> {
    constructor(public readonly vertices: [VectorType, VectorType, VectorType]) {}
}

export abstract class VertexAttributeBuffer<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends AttributeBuffer<VectorType>
{
    protected abstract _getTriangleConstructor(): AnyConstructor<TriangleType>;
    readonly Triangle: AnyConstructor<TriangleType>;

    protected _is_shared: boolean;
    protected _current_face_vertex_vectors: [VectorType, VectorType, VectorType];
    current_triangle: TriangleType;

    constructor(
        vertex_count: number,
        face_vertices: IFaceVertices,

        is_shared: number | boolean = true,
        face_count: number = face_vertices.length,
        arrays?: Float32Array[]
    ) {
        super(face_vertices, face_count, is_shared ? vertex_count : face_count * 3, arrays);
        this._is_shared = !!is_shared;
        this.Triangle = this._getTriangleConstructor();
        this._current_face_vertex_vectors = [
            new this.Vector(0, this.arrays),
            new this.Vector(0, this.arrays),
            new this.Vector(0, this.arrays)
        ];
        this.current_triangle = new this.Triangle(this._current_face_vertex_vectors);
    }

    get is_shared(): boolean {
        return this._is_shared;
    }

    protected *_iterSharedTriangles() : Generator<TriangleType> {
        for (const [index_1, index_2, index_3] of this.face_vertices.values()) {
            this._current_face_vertex_vectors[0].id = index_1;
            this._current_face_vertex_vectors[1].id = index_2;
            this._current_face_vertex_vectors[2].id = index_3;

            yield this.current_triangle;
        }
    }

    protected *_iterUnsharedTriangles() : Generator<TriangleType> {
        let offset = 0;
        for (let face_index = 0; face_index < this.face_count; face_index++) {
            this._current_face_vertex_vectors[0].id = offset;
            this._current_face_vertex_vectors[1].id = offset + 1;
            this._current_face_vertex_vectors[2].id = offset + 2;
            offset += 3;

            yield this.current_triangle;
        }
    }

    get triangles(): Generator<TriangleType> {
        return this._is_shared ?
            this._iterSharedTriangles() :
            this._iterUnsharedTriangles();
    }

    protected _pull(input_arrays: Float32Array[]): this {
        if (this._is_shared)
            _pullShared(this.arrays, input_arrays, this.face_count, this.face_vertices.arrays);
        else
            _pullUnshared(this.arrays, input_arrays, this.face_count);

        return this;
    }

    protected _load(in_vtx: number[][], simple: boolean = false, in_idx?: [number[], number[], number[]]): this {
        if (simple)
            _loadSaredSimple(this.arrays, in_vtx);
        else if (this._is_shared) {
            const idx = this.face_vertices.arrays;
            _loadShared(this.arrays, in_vtx, in_idx[0], in_idx[1], in_idx[2], idx[0], idx[1], idx[2]);
        } else
            _loadUnshared(this.arrays, in_vtx, in_idx[0], in_idx[1], in_idx[2], this.face_count);

        return this;
    }
}

export abstract class TransformableVertexAttributeBuffer2D<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends VertexAttributeBuffer<VectorType, TriangleType>
{
    protected _getAllocator(): Float32Allocator2D {
        return VECTOR_2D_ALLOCATOR;
    }

    mul(matrix: Matrix2x2, out?: this): this {
        if (out) {
            _mulVec2Mat2(this.arrays, matrix.arrays, matrix.id, out.arrays);
            return out;
        }

        _mulVec2Mat2IP(this.arrays, matrix.arrays, matrix.id);
        return this;
    }
}

export abstract class TransformableVertexAttributeBuffer3D<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>,
    Vector4DType extends Vector4D,
    Triangle4DType extends Triangle<Vector4DType>,
    VertexAttribute4DType extends TransformableVertexAttributeBuffer4D<Vector4DType, Triangle4DType>>
    extends VertexAttributeBuffer<VectorType, TriangleType>
{
    protected _getAllocator(): Float32Allocator3D {
        return VECTOR_3D_ALLOCATOR;
    }

    mul(matrix: Matrix3x3): this;
    mul(matrix: Matrix3x3, out: this): this;
    mul(matrix: Matrix4x4, out: VertexAttribute4DType): VertexAttribute4DType;
    mul(matrix: Matrix4x4, out: VertexAttribute4DType, include: Uint8Array[]): VertexAttribute4DType;
    mul(matrix: Matrix3x3|Matrix4x4, out?: this|VertexAttribute4DType, include?: Uint8Array[]): this|VertexAttribute4DType {
        if (matrix instanceof Matrix3x3) {
            if (out) {
                if (out instanceof this.constructor) {
                    _mulVec3Mat3(this.arrays, matrix.arrays, matrix.id, out.arrays);
                    return out;
                } else
                    throw `Invalid out type: ${out}`;
            }

            _mulVec3Mat3IP(this.arrays, matrix.arrays, matrix.id);
            return this;
        } else if (matrix instanceof Matrix4x4) {
            if (out instanceof this.constructor)
                throw `Invalid out type: ${out}`;

            if (include)
                _mulSomePos3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
            else
                _mulAllPos3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

            return out;
        }
    }
}

export abstract class TransformableVertexAttributeBuffer4D<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends VertexAttributeBuffer<VectorType, TriangleType>
{
    protected _getAllocator(): Float32Allocator4D {
        return VECTOR_4D_ALLOCATOR;
    }

    mul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            _mulVec4Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);
            return out;
        }

        _mulVec4Mat4IP(this.arrays, matrix.arrays, matrix.id);
        return this;
    }
}

// Loaders:
let face_id, face_index, offset, accumulated, in_index, out_index: number;

const _loadSaredSimple = (
    this_arrays: Float32Array[],
    input_arrays: number[][]
): void => {
    for (const [array, input_array] of zip(this_arrays, input_arrays))
        array.set(input_array);

    if (this_arrays.length === 4 &&
        input_arrays.length === 3)
        this_arrays[3].fill(1);
};

const _loadShared = (
    this_arrays: Float32Array[],
    input_vertices: number[][],
    input_indices_v1: number[],
    input_indices_v2: number[],
    input_indices_v3: number[],
    indices_v1: Uint8Array|Uint16Array|Uint32Array,
    indices_v2: Uint8Array|Uint16Array|Uint32Array,
    indices_v3: Uint8Array|Uint16Array|Uint32Array,
): void => {
    for (const [in_component, out_component] of zip(input_vertices, this_arrays)) {
        for ([in_index, out_index] of zip(input_indices_v1, indices_v1)) out_component[out_index] = in_component[in_index];
        for ([in_index, out_index] of zip(input_indices_v2, indices_v2)) out_component[out_index] = in_component[in_index];
        for ([in_index, out_index] of zip(input_indices_v3, indices_v3)) out_component[out_index] = in_component[in_index];
    }
};

const _loadUnshared = (
    this_arrays: Float32Array[],
    input_vertices: number[][],
    input_indices_v1: number[],
    input_indices_v2: number[],
    input_indices_v3: number[],
    face_count: number
): void => {
    for (const [in_component, out_component] of zip(input_vertices, this_arrays)) {
        offset = 0;
        for (face_index = 0; face_index < face_count; face_index++) {
            out_component[offset  ] = in_component[input_indices_v1[face_index]];
            out_component[offset+1] = in_component[input_indices_v2[face_index]];
            out_component[offset+2] = in_component[input_indices_v3[face_index]];
            offset += 3;
        }
    }
};

const _pullShared = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    face_count: number,
    indices: (Uint8Array|Uint16Array|Uint32Array)[]
): void => {
    // Average vertex-attribute values from their related face's attribute values:
    for (const [vertex_component, face_component] of zip(this_arrays, input_arrays))
        for (const [vertex_id, face_ids] of indices.entries()) {
            // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
            accumulated = 0;
            for (face_id of face_ids)
                accumulated += face_component[face_id];

            vertex_component[vertex_id] = accumulated / face_count;
        }
};

const _pullUnshared = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    face_count: number
): void => {
    // Copy over face-attribute values to their respective vertex-attribute values:
    for (const [vertex_component, face_ccomponent] of zip(this_arrays, input_arrays)) {
        vertex_component.set(face_ccomponent, 0);
        vertex_component.set(face_ccomponent, face_count);
        vertex_component.set(face_ccomponent, face_count+face_count);
    }
};

const _pullSharedFace = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    indices_1: Uint8Array|Uint16Array|Uint32Array,
    indices_2: Uint8Array|Uint16Array|Uint32Array,
    indices_3: Uint8Array|Uint16Array|Uint32Array,
    face_count: number
): void => {
    for (const [face_component, vertex_component] of zip(this_arrays, input_arrays))
        for (face_index = 0; face_index < face_count; face_index++)
            face_component[face_index] = (
                vertex_component[indices_1[face_index]] +
                vertex_component[indices_2[face_index]] +
                vertex_component[indices_3[face_index]]
            ) / 3;

    if (this_arrays.length === 4 &&
        input_arrays.length === 3)
        this_arrays[3].fill(1);
};

const _pullUnsharedFace = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    face_count: number
): void => {
    for (const [face_component, vertex_component] of zip(this_arrays, input_arrays))
        for (face_index = 0; face_index < face_count; face_index++)
            face_component[face_index] = (
                vertex_component[face_index] +
                vertex_component[face_index] +
                vertex_component[face_index]
            ) / 3;

    if (this_arrays.length === 4 &&
        input_arrays.length === 3)
        this_arrays[3].fill(1);
};

// Expanders for performance:

const _normalize_all = (
    arrays: Float32Array[]
): void => {
    switch (arrays.length) {
        case 2: return normalize_all_2D_directions_in_place(arrays[0], arrays[1]);
        case 3: return normalize_all_3D_directions_in_place(arrays[0], arrays[1], arrays[2]);
        case 4: return normalize_all_4D_directions_in_place(arrays[0], arrays[1], arrays[2], arrays[3]);
    }
    throw `Cannot normalize attribute buffer! Invalid array length: ${arrays.length}`;
};

const _normalize_some = (
    arrays: Float32Array[],
    include: Uint8Array[]
): void => {
    switch (arrays.length) {
        case 2: return normalize_some_2D_directions_in_place(arrays[0], arrays[1], include);
        case 3: return normalize_some_3D_directions_in_place(arrays[0], arrays[1], arrays[2], include);
        case 4: return normalize_some_4D_directions_in_place(arrays[0], arrays[1], arrays[2], arrays[3], include);
    }
    throw `Cannot normalize attribute buffer! Invalid array length: ${arrays.length}`;
};

const _mulVec2Mat2IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_2D_vectors_by_a_2x2_matrix_in_place(
    this_arrays[0],
    this_arrays[1],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1],
    matrix_arrays[2], matrix_arrays[3]
);

const _mulVec2Mat2 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_2D_vectors_by_a_2x2_matrix_to_out(
    this_arrays[0],
    this_arrays[1],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1],
    matrix_arrays[2], matrix_arrays[3],

    out_arrays[0],
    out_arrays[1]
);

const _mulVec3Mat3IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_3D_vectors_by_a_3x3_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[3], matrix_arrays[4], matrix_arrays[5],
    matrix_arrays[6], matrix_arrays[7], matrix_arrays[8]
);

const _mulVec3Mat3 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_vectors_by_a_3x3_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[3], matrix_arrays[4], matrix_arrays[5],
    matrix_arrays[6], matrix_arrays[7], matrix_arrays[8],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2]
);

const _mulVec4Mat4IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_4D_vectors_by_a_4x4_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],
    this_arrays[3],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15]
);

const _mulVec4Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_4D_vectors_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],
    this_arrays[3],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

const _mulAllDir3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_directions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

const _mulSomeDir3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void =>multiply_some_3D_directions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

const _mulSomePos3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_3D_positions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

const _mulAllPos3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_positions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);