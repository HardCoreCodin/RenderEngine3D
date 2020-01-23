import {Vector} from "../../accessors/accessor.js";
import {AnyConstructor} from "../../../types.js";
import {IFaceVertices} from "../../_interfaces/buffers.js";
import {Vector4D} from "../../accessors/vector4D.js";
import {
    Float32Allocator2D,
    Float32Allocator3D,
    Float32Allocator4D,
    VECTOR_2D_ALLOCATOR,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../../memory/allocators.js";
import {Matrix3x3} from "../../accessors/matrix3x3.js";
import {Matrix4x4} from "../../accessors/matrix4x4.js";
import {Matrix2x2} from "../../accessors/matrix2x2.js";
import {_loadSaredSimple, _loadShared, _loadUnshared, _pullShared, _pullUnshared} from "./_core.js";
import {
    _mulAllPos3Mat4,
    _mulSomePos3Mat4, _mulVec2Mat2, _mulVec2Mat2IP,
    _mulVec3Mat3,
    _mulVec3Mat3IP,
    _mulVec4Mat4,
    _mulVec4Mat4IP
} from "../_core.js";
import {AttributeBuffer} from "../_base.js";

export class Triangle<VectorType extends Vector> {
    constructor(public readonly vertices: [VectorType, VectorType, VectorType]) {
    }
}

export abstract class VertexAttributeBuffer<VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends AttributeBuffer<VectorType> {
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

    protected* _iterSharedTriangles(): Generator<TriangleType> {
        for (const [index_1, index_2, index_3] of this.face_vertices.values()) {
            this._current_face_vertex_vectors[0].id = index_1;
            this._current_face_vertex_vectors[1].id = index_2;
            this._current_face_vertex_vectors[2].id = index_3;

            yield this.current_triangle;
        }
    }

    protected* _iterUnsharedTriangles(): Generator<TriangleType> {
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

export abstract class VertexAttributeBuffer2D<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends VertexAttributeBuffer<VectorType, TriangleType>
{
    protected _getAllocator(): Float32Allocator2D {
        return VECTOR_2D_ALLOCATOR;
    }
}

export abstract class VertexAttributeBuffer3D<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends VertexAttributeBuffer<VectorType, TriangleType>
{
    protected _getAllocator(): Float32Allocator3D {
        return VECTOR_3D_ALLOCATOR;
    }
}

export abstract class VertexAttributeBuffer4D<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends VertexAttributeBuffer<VectorType, TriangleType>
{
    protected _getAllocator(): Float32Allocator4D {
        return VECTOR_4D_ALLOCATOR;
    }
}

export abstract class TransformableVertexAttributeBuffer2D<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends VertexAttributeBuffer2D<VectorType, TriangleType>
{
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
    extends VertexAttributeBuffer3D<VectorType, TriangleType>
{
    mul(matrix: Matrix3x3): this;
    mul(matrix: Matrix3x3, out: this): this;
    mul(matrix: Matrix4x4, out: VertexAttribute4DType): VertexAttribute4DType;
    mul(matrix: Matrix4x4, out: VertexAttribute4DType, include: Uint8Array[]): VertexAttribute4DType;
    mul(matrix: Matrix3x3 | Matrix4x4, out?: this | VertexAttribute4DType, include?: Uint8Array[]): this | VertexAttribute4DType {
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
    extends VertexAttributeBuffer4D<VectorType, TriangleType>
{
    mul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            _mulVec4Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);
            return out;
        }

        _mulVec4Mat4IP(this.arrays, matrix.arrays, matrix.id);
        return this;
    }
}