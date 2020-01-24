import {Vector} from "../../accessors/accessor.js";
import Vector2D from "../../accessors/vector2D.js";
import Vector3D from "../../accessors/vector3D.js";
import Vector4D from "../../accessors/vector4D.js";
import Matrix2x2 from "../../accessors/matrix2x2.js";
import Matrix3x3 from "../../accessors/matrix3x3.js";
import Matrix4x4 from "../../accessors/matrix4x4.js";
import {AttributeBuffer} from "../_base.js";
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
    _mulVec2Mat2,
    _mulVec2Mat2IP,
    _mulVec3Mat3,
    _mulVec3Mat3IP,
    _mulVec4Mat4,
    _mulVec4Mat4IP
} from "../_core.js";


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

export abstract class FaceAttributeBuffer2D<VectorType extends Vector2D>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator2D {
        return VECTOR_2D_ALLOCATOR;
    }
}

export abstract class FaceAttributeBuffer3D<VectorType extends Vector3D>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator3D {
        return VECTOR_3D_ALLOCATOR;
    }
}

export abstract class FaceAttributeBuffer4D<VectorType extends Vector4D>
    extends FaceAttributeBuffer<VectorType>
{
    protected _getAllocator(): Float32Allocator4D {
        return VECTOR_4D_ALLOCATOR;
    }
}

export abstract class TransformableFaceAttributeBuffer2D<VectorType extends Vector2D>
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

export abstract class TransformableFaceAttributeBuffer3D<VectorType extends Vector3D>
    extends FaceAttributeBuffer3D<VectorType>
{
    mul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            _mulVec3Mat3(this.arrays, matrix.arrays, matrix.id, out.arrays);
            return out;
        }

        _mulVec3Mat3IP(this.arrays, matrix.arrays, matrix.id);
        return this;
    }
}

export abstract class TransformableFaceAttributeBuffer4D<VectorType extends Vector4D>
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

