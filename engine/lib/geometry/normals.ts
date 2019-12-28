import {zip} from "../../utils.js";
import {ATTRIBUTE} from "../../constants.js";
import {InputNormals} from "./inputs.js";
import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {Direction3D, Direction4D} from "../accessors/direction.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {FaceAttribute, PulledVertexAttribute, Triangle} from "./attributes.js";
import {IFaceNormals, IVertexNormals3D, IVertexNormals4D} from "../_interfaces/attributes.js";
import {directionAttribute4DFunctions} from "../math/vec4.js";
import {directionAttribute3DFunctions} from "../math/vec3.js";
import {
    Float32Allocator3D,
    Float32Allocator4D,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../memory/allocators.js";
import {IAccessorConstructor} from "../_interfaces/accessors.js";
import {AnyConstructor} from "../../types.js";

class NormalTriangle3D extends Triangle<Direction3D> {}
class NormalTriangle4D extends Triangle<Direction4D> {}

export class VertexNormals3D
    extends PulledVertexAttribute<Direction3D, NormalTriangle3D, InputNormals, FaceNormals3D>
    implements IVertexNormals3D<Matrix3x3, Direction3D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = directionAttribute3DFunctions;
    protected _getTriangleConstructor(): AnyConstructor<NormalTriangle3D> {return NormalTriangle3D}
    protected _getVectorConstructor(): IAccessorConstructor<Direction3D> {return Direction3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    load(input: InputNormals): void {
        super.load(input);
        this.normalize();
    }

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }

    mat4mul(matrix: Matrix4x4, out: VertexNormals4D): VertexNormals4D {
        this._.matrix_multiply_all_directions_by_mat4(
            this.arrays, matrix.id,
            matrix.arrays,
            out.arrays
        );

        return out;
    }
}

export class VertexNormals4D
    extends PulledVertexAttribute<Direction4D, NormalTriangle4D, InputNormals, FaceNormals4D>
    implements IVertexNormals4D<Matrix4x4, Direction4D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = directionAttribute4DFunctions;
    protected _getTriangleConstructor(): AnyConstructor<NormalTriangle4D> {return NormalTriangle4D}
    protected _getVectorConstructor(): IAccessorConstructor<Direction4D> {return Direction4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    load(input: InputNormals): void {
        super.load(input);
        this.normalize();
    }

    matmul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }
}

export class FaceNormals3D extends FaceAttribute<Direction3D, VertexPositions3D>
    implements IFaceNormals<Matrix3x3, Direction3D, VertexPositions3D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = directionAttribute3DFunctions;
    protected _getVectorConstructor(): IAccessorConstructor<Direction3D> {return Direction3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    pull(vertex_positions: VertexPositions3D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
    }

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }

    mat4mul(matrix: Matrix4x4, out: FaceNormals4D, flags?: Uint8Array): FaceNormals4D {
        if (flags)
            this._.matrix_multiply_some_directions_by_mat4(
                this.arrays, matrix.id,
                matrix.arrays,
                flags,
                out.arrays
            );
        else
            this._.matrix_multiply_all_directions_by_mat4(
                this.arrays, matrix.id,
                matrix.arrays,
                out.arrays
            );

        return out;
    }
}

export class FaceNormals4D
    extends FaceAttribute<Direction4D, VertexPositions4D>
    implements IFaceNormals<Matrix4x4, Direction4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = directionAttribute4DFunctions;
    protected _getVectorConstructor(): IAccessorConstructor<Direction4D> {return Direction4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    pull(vertex_positions: VertexPositions4D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
    }

    matmul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }
}
