import {VectorBuffer} from "../_base.js";
import {Vector2D} from "../../accessors/vector2D.js";
import {Vector3D} from "../../accessors/vector3D.js";
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
import {
    _mulVec2Mat2,
    _mulVec2Mat2IP,
    _mulVec3Mat3,
    _mulVec3Mat3IP,
    _mulVec4Mat4,
    _mulVec4Mat4IP
} from "../_core.js";

export abstract class VectorBuffer2D<VectorType extends Vector2D>
    extends VectorBuffer<VectorType> {
    protected _getAllocator(): Float32Allocator2D {
        return VECTOR_2D_ALLOCATOR;
    }
}

export abstract class VectorBuffer3D<VectorType extends Vector3D>
    extends VectorBuffer<VectorType> {
    protected _getAllocator(): Float32Allocator3D {
        return VECTOR_3D_ALLOCATOR;
    }
}

export abstract class VectorBuffer4D<VectorType extends Vector4D>
    extends VectorBuffer<VectorType> {
    protected _getAllocator(): Float32Allocator4D {
        return VECTOR_4D_ALLOCATOR;
    }
}

export abstract class TransformableVectorBuffer2D<VectorType extends Vector2D>
    extends VectorBuffer2D<VectorType>
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

export abstract class TransformableVectorBuffer3D<VectorType extends Vector3D>
    extends VectorBuffer3D<VectorType>
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

export abstract class TransformableVectorBuffer4D<VectorType extends Vector4D>
    extends VectorBuffer4D<VectorType>
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