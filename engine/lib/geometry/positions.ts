import {ATTRIBUTE} from "../../constants.js";
import {InputPositions} from "./inputs.js";
import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {Position3D, Position4D} from "../accessors/position.js";
import {Direction3D, Direction4D, dir3, dir4} from "../accessors/direction.js";
import {Triangle, FaceAttribute, LoadableVertexAttribute} from "./attributes.js";
import {positionAttribute3DFunctions} from "../math/vec3.js";
import {transformableAttribute4DFunctions} from "../math/vec4.js";
import {
    Float32Allocator3D,
    Float32Allocator4D,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../memory/allocators.js";
import {IFacePositions, IVertexPositions3D, IVertexPositions4D} from "../_interfaces/attributes.js";
import {IAccessorConstructor} from "../_interfaces/accessors.js";
import {AnyConstructor} from "../../types.js";

const d1_3D = dir3();
const d2_3D = dir3();
const d1_4D = dir4();
const d2_4D = dir4();

export class PositionTriangle3D extends Triangle<Position3D> {
    computeNormal(normal: Direction3D): void {
        this.vertices[0].to(this.vertices[1], d1_3D);
        this.vertices[0].to(this.vertices[2], d2_3D);
        d1_3D.cross(d2_3D).normalize(normal);
    }
}

let p1, p2, p3: Position4D;
export class PositionTriangle4D extends Triangle<Position4D>
{
    computeNormal(normal: Direction4D): void {
        [p1, p2, p3] = this.vertices;
        p1.to(p2, d1_4D).cross(p1.to(p3, d2_4D)).normalized(normal);
    }
}

export class VertexPositions3D
    extends LoadableVertexAttribute<Position3D, PositionTriangle3D, InputPositions>
    implements IVertexPositions3D<Matrix3x3, Position3D>
{
    readonly _ = positionAttribute3DFunctions;
    readonly attribute = ATTRIBUTE.position;
    protected _getTriangleConstructor(): AnyConstructor<PositionTriangle3D> {return PositionTriangle3D}
    protected _getVectorConstructor(): IAccessorConstructor<Position3D> {return Position3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

    load(input_attribute: InputPositions): this {
        this._is_shared = true;
        this.arrays[0].set(input_attribute.vertices[0]);
        this.arrays[1].set(input_attribute.vertices[1]);
        this.arrays[2].set(input_attribute.vertices[2]);

        return this;
    }

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }

    mat4mul(matrix: Matrix4x4, out: VertexPositions4D, flags?: Uint8Array): VertexPositions4D {
        if (flags)
            this._.matrix_multiply_some_positions_by_mat4(
                this.arrays, matrix.id,
                matrix.arrays,
                flags,
                out.arrays
            );
        else
            this._.matrix_multiply_all_positions_by_mat4(
                this.arrays, matrix.id,
                matrix.arrays,
                out.arrays
            );

        return out;
    }
}

export class VertexPositions4D
    extends LoadableVertexAttribute<Position4D, PositionTriangle4D, InputPositions>
    implements IVertexPositions4D<Matrix4x4, Position4D>
{
    readonly _ = transformableAttribute4DFunctions;
    readonly attribute = ATTRIBUTE.position;
    protected _getTriangleConstructor(): AnyConstructor<PositionTriangle4D> {return PositionTriangle4D}
    protected _getVectorConstructor(): IAccessorConstructor<Position4D> {return Position4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

    load(input_attribute: InputPositions): this {
        this.arrays[0].set(input_attribute.vertices[0]);
        this.arrays[1].set(input_attribute.vertices[1]);
        this.arrays[2].set(input_attribute.vertices[2]);
        this.arrays[3].fill(1);

        return this;
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

export class FacePositions3D extends FaceAttribute<Position3D, VertexPositions3D>
    implements IFacePositions<Matrix3x3, Position3D, VertexPositions3D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = positionAttribute3DFunctions;
    protected _getVectorConstructor(): IAccessorConstructor<Position3D> {return Position3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }

    mat4mul(matrix: Matrix4x4, out: FacePositions4D): FacePositions4D {
        this._.matrix_multiply_all_positions_by_mat4(
            this.arrays, matrix.id,
            matrix.arrays,
            out.arrays
        );

        return out;
    }
}

export class FacePositions4D extends FaceAttribute<Position4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = transformableAttribute4DFunctions;
    protected _getVectorConstructor(): IAccessorConstructor<Position4D> {return Position4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

    pull(input: VertexPositions4D): void {
        super.pull(input);

        this.arrays[3].fill(1);
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