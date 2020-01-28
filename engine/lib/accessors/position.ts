import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import Matrix2x2 from "./matrix2x2.js";
import Matrix3x3 from "./matrix2x2.js";
import Matrix4x4 from "./matrix4x4.js";
import {Direction2D, Direction3D, Direction4D} from "./direction.js";
import {
    compute_the_distance_from_a_2D_position_to_another_2D_position,
    multiply_a_2D_vector_by_a_2x2_matrix_in_place,
    multiply_a_2D_vector_by_a_2x2_matrix_to_out,
    square_the_distance_from_a_2D_positions_to_another_2D_position,
    subtract_a_2D_vector_from_another_2D_vector_to_out
} from "../math/vec2.js";
import {
    compute_the_distance_from_a_3D_position_to_another_3D_position,
    multiply_a_3D_position_by_a_3x4_matrix_in_place,
    multiply_a_3D_position_by_a_3x4_matrix_to_out3,
    multiply_a_3D_position_by_a_4x4_matrix_to_out4,
    multiply_a_3D_vector_by_a_3x3_matrix_in_place,
    multiply_a_3D_vector_by_a_3x3_matrix_to_out,
    square_the_distance_from_a_3D_positions_to_another_3D_position,
    subtract_a_3D_vector_from_another_3D_vector_to_out
} from "../math/vec3.js";
import {
    compute_the_distance_from_a_4D_position_to_another_4D_position,
    multiply_a_4D_vector_by_a_4x4_matrix_in_place,
    multiply_a_4D_vector_by_a_4x4_matrix_to_out,
    square_the_distance_from_a_4D_positions_to_another_4D_position,
    subtract_a_4D_vector_from_another_4D_vector_to_out
} from "../math/vec4.js";
import {IPosition2D, IPosition3D, IPosition4D} from "../_interfaces/vectors.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export class Position2D extends Vector2D<Direction2D> implements IPosition2D
{
    copy(out: Position2D = new Position2D()): Position2D {return out.setFrom(this)}

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}

    distanceTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return compute_the_distance_from_a_2D_position_to_another_2D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        );
    }

    distanceSquaredTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return square_the_distance_from_a_2D_positions_to_another_2D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        );
    }

    to(other: this, out: Direction2D): typeof out {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_2D_vector_from_another_2D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1],

            out.id,
            out_arrays[0],
            out_arrays[1]
        );

        return out;
    }

    imatmul(matrix: Matrix2x2): this {
        other_arrays = matrix.arrays;

        multiply_a_2D_vector_by_a_2x2_matrix_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            matrix.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3]
        );

        return this;
    }

    matmul(matrix: Matrix2x2, out: this): this {
        other_arrays = matrix.arrays;

        multiply_a_2D_vector_by_a_2x2_matrix_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            matrix.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3],

            out.id,
            out_arrays[0],
            out_arrays[1]
        );

        return out;
    }
}

export class Position3D extends Vector3D<Direction3D> implements IPosition3D
{
    copy(out: Position3D = new Position3D()): Position3D {return out.setFrom(this)}

    distanceTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return compute_the_distance_from_a_3D_position_to_another_3D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );
    }

    distanceSquaredTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return square_the_distance_from_a_3D_positions_to_another_3D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );
    }

    to(other: this, out: Direction3D): typeof out {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_3D_vector_from_another_3D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );

        return out;
    }

    imatmul(matrix: Matrix4x4): this;
    imatmul(matrix: Matrix3x3): this;
    imatmul(matrix: Matrix3x3|Matrix4x4): this {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;

        if (matrix instanceof Matrix3x3)
            multiply_a_3D_vector_by_a_3x3_matrix_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2],
                other_arrays[3], other_arrays[4], other_arrays[5],
                other_arrays[6], other_arrays[7], other_arrays[8]
            );
        else
            multiply_a_3D_position_by_a_3x4_matrix_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2],
                other_arrays[4], other_arrays[5], other_arrays[6],
                other_arrays[8], other_arrays[9], other_arrays[10],
                other_arrays[12], other_arrays[13], other_arrays[14]
            );

        return this;
    }

    matmul(matrix: Matrix3x3, out: Position3D): Position3D
    matmul(matrix: Matrix4x4, out: Position3D): Position3D
    matmul(matrix: Matrix4x4, out: Position4D): Position4D
    matmul(matrix: Matrix3x3|Matrix4x4, out: Position3D|Position4D): Position3D|Position4D {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;
        out_arrays = out.arrays;

        if (out instanceof Position3D) {
            if (matrix instanceof Matrix3x3) {
                multiply_a_3D_vector_by_a_3x3_matrix_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    matrix.id,
                    other_arrays[0], other_arrays[1], other_arrays[2],
                    other_arrays[3], other_arrays[4], other_arrays[5],
                    other_arrays[6], other_arrays[7], other_arrays[8],

                    out.id,
                    out_arrays[0],
                    out_arrays[1],
                    out_arrays[2]
                );
            } else {
                multiply_a_3D_position_by_a_3x4_matrix_to_out3(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    matrix.id,
                    other_arrays[0], other_arrays[1], other_arrays[2],
                    other_arrays[4], other_arrays[5], other_arrays[6],
                    other_arrays[8], other_arrays[9], other_arrays[10],
                    other_arrays[12], other_arrays[13], other_arrays[14],

                    out.id,
                    out_arrays[0],
                    out_arrays[1],
                    out_arrays[2]
                );
            }
        } else
            multiply_a_3D_position_by_a_4x4_matrix_to_out4(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
                other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[6],
                other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
                other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );

        return out;
    }

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export class Position4D extends Vector4D<Direction4D> implements IPosition4D
{
    copy(out: Position4D = new Position4D()): Position4D {return out.setFrom(this)}

    distanceTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return compute_the_distance_from_a_4D_position_to_another_4D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3]
        );
    }

    distanceSquaredTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return square_the_distance_from_a_4D_positions_to_another_4D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3]
        );
    }

    to(other: this, out: Direction4D): Direction4D {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_4D_vector_from_another_4D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }

    imatmul(matrix: Matrix4x4): this {
        other_arrays = matrix.arrays;

        multiply_a_4D_vector_by_a_4x4_matrix_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[6],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15]
        );

        return this;
    }

    matmul(matrix: Matrix4x4, out: this): this {
        other_arrays = matrix.arrays;

        multiply_a_4D_vector_by_a_4x4_matrix_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[6],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export const pos2 = (
    x: number = 0,
    y: number = x
): Position2D => new Position2D().setTo(x, y);

export const pos3 = (
    x: number = 0,
    y: number = x,
    z: number = x
): Position3D => new Position3D().setTo(x, y, z);

export const pos4 = (
    x: number = 0,
    y: number = x,
    z: number = x,
    w: number = x
): Position4D => new Position4D().setTo(x, y, z, w);

