import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {ATTRIBUTE} from "../../constants.js";
import {InputPositions} from "./inputs.js";
import {Position3D, Position4D} from "../accessors/position.js";
import {Direction3D, Direction4D, dir3, dir4} from "../accessors/direction.js";
import {Triangle, FaceAttribute, LoadableVertexAttribute} from "./attributes.js";
import {
    Float32Allocator3D,
    Float32Allocator4D,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../memory/allocators.js";
import {IAccessorConstructor} from "../_interfaces/accessors.js";
import {AnyConstructor} from "../../types.js";
import {
    multiply_all_3D_directions_by_a_4x4_matrix_to_out,
    multiply_all_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_all_3D_vectors_by_a_3x3_matrix_to_out
} from "../math/vec3.js";
import {
    multiply_all_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_all_4D_vectors_by_a_4x4_matrix_to_out
} from "../math/vec4.js";

const d1_3D = dir3();
const d2_3D = dir3();
const d1_4D = dir4();
const d2_4D = dir4();

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

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
{
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
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;

        if (out) {
            out_arrays = out.arrays;

            multiply_all_3D_vectors_by_a_3x3_matrix_to_out(
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2],
                other_arrays[3], other_arrays[4], other_arrays[5],
                other_arrays[6], other_arrays[7], other_arrays[8],

                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );

            return out;
        }

        multiply_all_3D_vectors_by_a_3x3_matrix_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8],
        );

        return this;
    }

    mat4mul(matrix: Matrix4x4, out: VertexPositions4D): VertexPositions4D {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;
        out_arrays = out.arrays;

        multiply_all_3D_directions_by_a_4x4_matrix_to_out(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }
}

export class VertexPositions4D
    extends LoadableVertexAttribute<Position4D, PositionTriangle4D, InputPositions>
{
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
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;

        if (out) {
            out_arrays = out.arrays;

            multiply_all_4D_vectors_by_a_4x4_matrix_to_out(
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],
                this_arrays[3],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
                other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
                other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
                other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );

            return out;
        }

        multiply_all_4D_vectors_by_a_4x4_matrix_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],
        );

        return this;
    }
}

export class FacePositions3D extends FaceAttribute<Position3D, Position3D, VertexPositions3D>
{
    readonly attribute = ATTRIBUTE.position;
    protected _getVectorConstructor(): IAccessorConstructor<Position3D> {return Position3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

    matmul(matrix: Matrix3x3, out?: this): this {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;

        if (out) {
            out_arrays = out.arrays;

            multiply_all_3D_vectors_by_a_3x3_matrix_to_out(
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2],
                other_arrays[3], other_arrays[4], other_arrays[5],
                other_arrays[6], other_arrays[7], other_arrays[8],

                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );

            return out;
        }

        multiply_all_3D_vectors_by_a_3x3_matrix_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8],
        );

        return this;
    }

    mat4mul(matrix: Matrix4x4, out: FacePositions4D): FacePositions4D {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;
        out_arrays = out.arrays;

        multiply_all_3D_directions_by_a_4x4_matrix_to_out(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }
}

export class FacePositions4D extends FaceAttribute<Position4D, Position4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.position;
    protected _getVectorConstructor(): IAccessorConstructor<Position4D> {return Position4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

    pull(input: VertexPositions4D): void {
        super.pull(input);

        this.arrays[3].fill(1);
    }

    matmul(matrix: Matrix4x4, out?: this): this {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;

        if (out) {
            out_arrays = out.arrays;

            multiply_all_4D_vectors_by_a_4x4_matrix_to_out(
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],
                this_arrays[3],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
                other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
                other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
                other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );

            return out;
        }

        multiply_all_4D_vectors_by_a_4x4_matrix_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],
        );

        return this;
    }
}