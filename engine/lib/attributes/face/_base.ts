import {Vector} from "../../accessors/accessor.js";
import {Vector4D} from "../../accessors/vector4D.js";
import {Matrix2x2} from "../../accessors/matrix2x2.js";
import {Matrix3x3} from "../../accessors/matrix3x3.js";
import {Matrix4x4} from "../../accessors/matrix4x4.js";
import {
    Float32Allocator2D,
    Float32Allocator3D,
    Float32Allocator4D,
    VECTOR_2D_ALLOCATOR,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../../memory/allocators.js";
import {IFaceVertices} from "../../_interfaces/buffers.js";
import {_pullSharedFace, _pullUnsharedFace} from "./_core.js";
import {
    _mulAllPos3Mat4,
    _mulSomePos3Mat4, _mulVec2Mat2, _mulVec2Mat2IP,
    _mulVec3Mat3,
    _mulVec3Mat3IP,
    _mulVec4Mat4,
    _mulVec4Mat4IP
} from "../_core.js";
import {AttributeBuffer} from "../_base.js";


export abstract class FaceAttributeBuffer<VectorType extends Vector>
    extends AttributeBuffer<VectorType> {
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

export abstract class FaceAttributeBuffer2D<VectorType extends Vector>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator2D {
        return VECTOR_2D_ALLOCATOR;
    }
}

export abstract class FaceAttributeBuffer3D<VectorType extends Vector>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator3D {
        return VECTOR_3D_ALLOCATOR;
    }
}

export abstract class FaceAttributeBuffer4D<VectorType extends Vector>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator4D {
        return VECTOR_4D_ALLOCATOR;
    }
}

export abstract class TransformableFaceAttributeBuffer2D<VectorType extends Vector>
    extends FaceAttributeBuffer2D<VectorType>
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

export abstract class TransformableFaceAttributeBuffer3D<
    VectorType extends Vector,
    Vector4DType extends Vector4D,
    FaceAttribute4DType extends TransformableFaceAttributeBuffer4D<Vector4DType>>
    extends FaceAttributeBuffer3D<VectorType>
{
    mul(matrix: Matrix3x3): this;
    mul(matrix: Matrix3x3, out: this): this;
    mul(matrix: Matrix4x4, out: FaceAttribute4DType): FaceAttribute4DType;
    mul(matrix: Matrix4x4, out: FaceAttribute4DType, include: Uint8Array[]): FaceAttribute4DType;
    mul(matrix: Matrix3x3 | Matrix4x4, out?: this | FaceAttribute4DType, include?: Uint8Array[]): this | FaceAttribute4DType {
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
    extends FaceAttributeBuffer4D<VectorType>
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

