import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import Matrix2x2 from "./matrix2x2.js";
import Matrix3x3 from "./matrix2x2.js";
import Matrix4x4 from "./matrix4x4.js";
import {Direction2D, Direction3D, Direction4D} from "./direction.js";
import {
    compute_the_distance_from_a_2D_position_to_another_2D_position, dot_a_2D_direction_with_another_2D_direction,
    multiply_a_2D_vector_by_a_2x2_matrix_in_place,
    multiply_a_2D_vector_by_a_2x2_matrix_to_out,
    square_the_distance_from_a_2D_positions_to_another_2D_position,
    subtract_a_2D_vector_from_another_2D_vector_to_out
} from "../math/vec2.js";
import {
    compute_the_distance_from_a_3D_position_to_another_3D_position,
    multiply_a_3D_position_by_a_4x4_matrix_in_place,
    multiply_a_3D_position_by_a_4x4_matrix_to_out3,
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

export class Position2D extends Vector2D<Direction2D> implements IPosition2D
{
    copy(out: Position2D = new Position2D()): Position2D {return out.setFrom(this)}

    distanceTo(other: this): number {
        return compute_the_distance_from_a_2D_position_to_another_2D_position(this.array, other.array);
    }

    distanceSquaredTo(other: this): number {
        return square_the_distance_from_a_2D_positions_to_another_2D_position(this.array, other.array);
    }

    to(other: this, out: Direction2D): typeof out {
        subtract_a_2D_vector_from_another_2D_vector_to_out(other.array, this.array, out.array);
        return out;
    }

    imatmul(matrix: Matrix2x2): this {
        multiply_a_2D_vector_by_a_2x2_matrix_in_place(this.array, matrix.array);
        return this;
    }

    matmul(matrix: Matrix2x2, out: this): this {
        multiply_a_2D_vector_by_a_2x2_matrix_to_out(this.array, matrix.array, out.array);
        return out;
    }
}

export class Position3D extends Vector3D<Direction3D> implements IPosition3D
{
    copy(out: Position3D = new Position3D()): Position3D {return out.setFrom(this)}

    distanceTo(other: this): number {
        return compute_the_distance_from_a_3D_position_to_another_3D_position(this.array, other.array);
    }

    distanceSquaredTo(other: this): number {
        return square_the_distance_from_a_3D_positions_to_another_3D_position(this.array, other.array);
    }

    to(other: this, out: Direction3D): typeof out {
        subtract_a_3D_vector_from_another_3D_vector_to_out(other.array, this.array, out.array);
        return out;
    }

    imatmul(matrix: Matrix4x4): this;
    imatmul(matrix: Matrix3x3): this;
    imatmul(matrix: Matrix3x3|Matrix4x4): this {
        if (matrix instanceof Matrix3x3)
            multiply_a_3D_vector_by_a_3x3_matrix_in_place(this.array, matrix.array);
        else
            multiply_a_3D_position_by_a_4x4_matrix_in_place(this.array, matrix.array);

        return this;
    }

    matmul(matrix: Matrix3x3, out: Position3D): Position3D
    matmul(matrix: Matrix4x4, out: Position3D): Position3D
    matmul(matrix: Matrix4x4, out: Position4D): Position4D
    matmul(matrix: Matrix3x3|Matrix4x4, out: Position3D|Position4D): Position3D|Position4D {
        if (out instanceof Position3D) {
            if (matrix instanceof Matrix3x3)
                multiply_a_3D_vector_by_a_3x3_matrix_to_out(this.array, matrix.array, out.array);
            else
                multiply_a_3D_position_by_a_4x4_matrix_to_out3(this.array, matrix.array, out.array);
        } else
            multiply_a_3D_position_by_a_4x4_matrix_to_out4(this.array, matrix.array, out.array);

        return out;
    }

    get xy(): Position2D {return new Position2D(this.array.subarray(0, 2))}
    get yz(): Position2D {return new Position2D(this.array.subarray(1, 3))}

    set xy(other: Position2D) {this.array.set(other.array)}
    set yz(other: Position2D) {this.array.set(other.array, 1)}}

export class Position4D extends Vector4D<Direction4D> implements IPosition4D
{
    copy(out: Position4D = new Position4D()): Position4D {return out.setFrom(this)}

    distanceTo(other: this): number {
        return compute_the_distance_from_a_4D_position_to_another_4D_position(this.array, other.array);
    }

    distanceSquaredTo(other: this): number {
        return square_the_distance_from_a_4D_positions_to_another_4D_position(this.array, other.array);
    }

    to(other: this, out: Direction4D): Direction4D {
        subtract_a_4D_vector_from_another_4D_vector_to_out(other.array, this.array, out.array);
        return out;
    }

    imatmul(matrix: Matrix4x4): this {
        multiply_a_4D_vector_by_a_4x4_matrix_in_place(this.array, matrix.array);
        return this;
    }

    matmul(matrix: Matrix4x4, out: this): this {
        multiply_a_4D_vector_by_a_4x4_matrix_to_out(this.array, matrix.array, out.array);
        return out;
    }

    get xy(): Position2D {return new Position2D(this.array.subarray(0, 2))}
    get yz(): Position2D {return new Position2D(this.array.subarray(1, 3))}
    get zw(): Position2D {return new Position2D(this.array.subarray(2, 4))}

    set xy(other: Position2D) {this.array.set(other.array)}
    set yz(other: Position2D) {this.array.set(other.array, 1)}
    set zw(other: Position2D) {this.array.set(other.array, 2)}

    get xyz(): Position3D {return new Position3D(this.array.subarray(0, 3))}
    get yzw(): Position3D {return new Position3D(this.array.subarray(1, 4))}

    set xyz(other: Position3D) {this.array.set(other.array)}
    set yzw(other: Position3D) {this.array.set(other.array, 1)}}

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

