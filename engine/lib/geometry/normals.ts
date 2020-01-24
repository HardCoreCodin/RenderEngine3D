import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {ATTRIBUTE} from "../../constants.js";
import {InputNormals} from "./inputs.js";
import {Direction3D, Direction4D} from "../accessors/direction.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {FaceAttribute, PulledVertexAttribute, Triangle} from "./attributes.js";
import {zip} from "../../utils.js";

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
    multiply_all_3D_vectors_by_a_3x3_matrix_to_out,
    multiply_some_3D_directions_by_a_4x4_matrix_to_out,
    normalize_all_3D_directions_in_place
} from "../math/vec3.js";
import {
    multiply_all_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_all_4D_vectors_by_a_4x4_matrix_to_out,
    normalize_all_4D_directions_in_place
} from "../math/vec4.js";
import {Position3D, Position4D} from "../accessors/position.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

class NormalTriangle3D extends Triangle<Direction3D> {}
class NormalTriangle4D extends Triangle<Direction4D> {}

export class VertexNormals3D
    extends PulledVertexAttribute<Direction3D, NormalTriangle3D, InputNormals, FaceNormals3D>
{
    readonly attribute = ATTRIBUTE.normal;
    protected _getTriangleConstructor(): AnyConstructor<NormalTriangle3D> {return NormalTriangle3D}
    protected _getVectorConstructor(): IAccessorConstructor<Direction3D> {return Direction3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

    normalize(): this {
        this_arrays = this.arrays;

        normalize_all_3D_directions_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
        );

        return this;
    }

    load(input: InputNormals): this {
        super.load(input);
        this.normalize();
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

    mat4mul(matrix: Matrix4x4, out: VertexNormals4D): VertexNormals4D {
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

export class VertexNormals4D
    extends PulledVertexAttribute<Direction4D, NormalTriangle4D, InputNormals, FaceNormals4D>
{
    readonly attribute = ATTRIBUTE.normal;
    protected _getTriangleConstructor(): AnyConstructor<NormalTriangle4D> {return NormalTriangle4D}
    protected _getVectorConstructor(): IAccessorConstructor<Direction4D> {return Direction4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

    normalize(): this {
        this_arrays = this.arrays;

        normalize_all_4D_directions_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],
        );

        return this;
    }

    load(input: InputNormals): this {
        super.load(input);
        this.normalize();
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

export class FaceNormals3D extends FaceAttribute<Direction3D, Position3D, VertexPositions3D>
{
    readonly attribute = ATTRIBUTE.normal;
    protected _getVectorConstructor(): IAccessorConstructor<Direction3D> {return Direction3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

    normalize(): this {
        this_arrays = this.arrays;

        normalize_all_3D_directions_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
        );

        return this;
    }

    pull(vertex_positions: VertexPositions3D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
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

    mat4mul(matrix: Matrix4x4, out: FaceNormals4D, include?: Uint8Array[]): FaceNormals4D {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;
        out_arrays = out.arrays;

        if (include) {
            multiply_some_3D_directions_by_a_4x4_matrix_to_out(
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
                other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
                other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
                other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

                include,

                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );
        } else {
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
        }

        return out;
    }
}

export class FaceNormals4D
    extends FaceAttribute<Direction4D, Position4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.normal;
    protected _getVectorConstructor(): IAccessorConstructor<Direction4D> {return Direction4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

    normalize(): this {
        this_arrays = this.arrays;

        normalize_all_4D_directions_in_place(
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],
        );

        return this;
    }

    pull(vertex_positions: VertexPositions4D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
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
