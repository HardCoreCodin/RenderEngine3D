import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import Matrix3x3 from "./matrix2x2.js";
import Matrix2x2 from "./matrix2x2.js";
import Matrix4x4 from "./matrix4x4.js";
import {
    compute_the_length_of_a_2D_direction,
    dot_a_2D_direction_with_another_2D_direction,
    multiply_a_2D_vector_by_a_2x2_matrix_in_place,
    multiply_a_2D_vector_by_a_2x2_matrix_to_out,
    negate_a_2D_direction_in_place,
    negate_a_2D_direction_to_out,
    normalize_a_2D_direction_in_place,
    normalize_a_2D_direction_to_out,
    reflect_a_2D_vector_around_a_2D_direction_in_place,
    reflect_a_2D_vector_around_a_2D_direction_to_out,
    square_the_length_of_a_2D_direction
} from "../math/vec2.js";
import {
    compute_the_length_of_a_3D_direction,
    cross_a_3D_direction_with_another_3D_direction_in_place,
    cross_a_3D_direction_with_another_3D_direction_to_out,
    dot_a_3D_direction_with_another_3D_direction,
    multiply_a_3D_direction_by_a_4x4_matrix_in_place, multiply_a_3D_direction_by_a_4x4_matrix_to_out3,
    multiply_a_3D_vector_by_a_3x3_matrix_in_place,
    multiply_a_3D_vector_by_a_3x3_matrix_to_out,
    multiply_a_3D_direction_by_a_4x4_matrix_to_out4,
    negate_a_3D_direction_in_place,
    negate_a_3D_direction_to_out,
    normalize_a_3D_direction_in_place,
    normalize_a_3D_direction_to_out,
    reflect_a_3D_vector_around_a_3D_direction_in_place,
    reflect_a_3D_vector_around_a_3D_direction_to_out,
    square_the_length_of_a_3D_direction
} from "../math/vec3.js";
import {
    compute_the_length_of_a_4D_direction,
    dot_a_4D_direction_with_another_4D_direction,
    multiply_a_4D_vector_by_a_4x4_matrix_in_place,
    multiply_a_4D_vector_by_a_4x4_matrix_to_out,
    negate_a_4D_direction_in_place,
    negate_a_4D_direction_to_out,
    normalize_a_4D_direction_in_place,
    normalize_a_4D_direction_to_out,
    reflect_a_4D_vector_around_a_4D_direction_in_place,
    reflect_a_4D_vector_around_a_4D_direction_to_out,
    square_the_length_of_a_4D_direction
} from "../math/vec4.js";
import {IDirection2D, IDirection3D, IDirection4D} from "../_interfaces/vectors.js";


export class Direction2D extends Vector2D<Direction2D> implements IDirection2D
{
    copy(out: Direction2D = new Direction2D()): Direction2D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        return dot_a_2D_direction_with_another_2D_direction(this.array, other.array);
    }

    get length(): number {
        return compute_the_length_of_a_2D_direction(this.array);
    }

    get length_squared(): number {
        return square_the_length_of_a_2D_direction(this.array);
    }

    inormalize(): this {
        normalize_a_2D_direction_in_place(this.array);
        return this;
    }

    normalize(out: this): this {
        if (out.is(this))
            return this.inormalize();

        normalize_a_2D_direction_to_out(this.array, out.array);
        return out;
    }

    ireflect(other: this): this {
        reflect_a_2D_vector_around_a_2D_direction_in_place(this.array, other.array);
        return this;
    }

    reflect(other: this, out: this): this {
        if (out.is(this))
            return this.ireflect(other);

        reflect_a_2D_vector_around_a_2D_direction_to_out(this.array, other.array, out.array);
        return out;
    }

    inegate(): this {
        negate_a_2D_direction_in_place(this.array);
        return this;
    }

    negate(out: this): this {
        if (out.is(this))
            return this.inegate();

        negate_a_2D_direction_to_out(this.array, out.array);
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

export class Direction3D extends Vector3D<Direction3D> implements IDirection3D
{
    copy(out: Direction3D = new Direction3D()): Direction3D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        return dot_a_3D_direction_with_another_3D_direction(this.array, other.array);
    }

    get length(): number {
        return compute_the_length_of_a_3D_direction(this.array);
    }

    get length_squared(): number {
        return square_the_length_of_a_3D_direction(this.array);
    }

    inormalize(): this {
        normalize_a_3D_direction_in_place(this.array);
        return this;
    }

    normalize(out: this): this {
        if (out.is(this))
            return this.inormalize();
        normalize_a_3D_direction_to_out(this.array, out.array);

        return out;
    }

    ireflect(other: this): this {
        reflect_a_3D_vector_around_a_3D_direction_in_place(this.array, other.array);
        return this;
    }

    reflect(other: this, out: this): this {
        if (out.is(this))
            return this.ireflect(other);

        reflect_a_3D_vector_around_a_3D_direction_to_out(this.array, other.array, out.array);
        return out;
    }

    inegate(): this {
        negate_a_3D_direction_in_place(this.array);
        return this;
    }

    negate(out: this): this {
        if (out.is(this))
            return this.inegate();

        negate_a_3D_direction_to_out(this.array, out.array);
        return out;
    }

    icross(other: Direction3D): this {
        cross_a_3D_direction_with_another_3D_direction_in_place(this.array, other.array);
        return this;
    };

    cross(other: Direction3D, out: this): this {
        if (out.is(this))
            return this.icross(other);

        cross_a_3D_direction_with_another_3D_direction_to_out(this.array, other.array, out.array);
        return out;
    }

    imatmul(matrix: Matrix4x4): this;
    imatmul(matrix: Matrix3x3): this;
    imatmul(matrix: Matrix3x3|Matrix4x4): this {
        if (matrix instanceof Matrix3x3)
            multiply_a_3D_vector_by_a_3x3_matrix_in_place(this.array, matrix.array);
        else
            multiply_a_3D_direction_by_a_4x4_matrix_in_place(this.array, matrix.array);

        return this;
    }

    matmul(matrix: Matrix3x3, out: Direction3D): Direction3D
    matmul(matrix: Matrix4x4, out: Direction3D): Direction3D
    matmul(matrix: Matrix4x4, out: Direction4D): Direction4D
    matmul(matrix: Matrix3x3|Matrix4x4, out: Direction3D|Direction4D): Direction3D|Direction4D {
        if (out instanceof Direction3D) {
            if (matrix instanceof Matrix3x3) {
                multiply_a_3D_vector_by_a_3x3_matrix_to_out(this.array, matrix.array, out.array);
            } else {
                multiply_a_3D_direction_by_a_4x4_matrix_to_out3(this.array, matrix.array, out.array);
            }
        } else
            multiply_a_3D_direction_by_a_4x4_matrix_to_out4(this.array, matrix.array, out.array);

        return out;
    }

    get xy(): Direction2D {return new Direction2D(this.array.subarray(0, 2))}
    get yz(): Direction2D {return new Direction2D(this.array.subarray(1, 3))}

    set xy(other: Direction2D) {this.array.set(other.array)}
    set yz(other: Direction2D) {this.array.set(other.array, 1)}
}

export class Direction4D extends Vector4D<Direction4D> implements IDirection4D
{
    copy(out: Direction4D = new Direction4D()): Direction4D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        return dot_a_4D_direction_with_another_4D_direction(this.array, other.array);
    }

    get length(): number {
        return compute_the_length_of_a_4D_direction(this.array);
    }

    get length_squared(): number {
        return square_the_length_of_a_4D_direction(this.array);
    }

    inormalize(): this {
        normalize_a_4D_direction_in_place(this.array);
        return this;
    }

    normalize(out: this): this {
        if (out.is(this))
            return this.inormalize();

        normalize_a_4D_direction_to_out(this.array, out.array);
        return out;
    }

    ireflect(other: this): this {
        reflect_a_4D_vector_around_a_4D_direction_in_place(this.array, other.array);
        return this;
    }

    reflect(other: this, out: this): this {
        if (out.is(this))
            return this.ireflect(other);

        reflect_a_4D_vector_around_a_4D_direction_to_out(this.array, other.array, out.array);
        return out;
    }

    inegate(): this {
        negate_a_4D_direction_in_place(this.array);
        return this;
    }

    negate(out: this): this {
        if (out.is(this))
            return this.inegate();

        negate_a_4D_direction_to_out(this.array, out.array);
        return out;
    }

    icross(other: Direction4D): this {
        cross_a_3D_direction_with_another_3D_direction_in_place(this.array, other.array);
        return this;
    }

    cross(other: Direction4D, out: this): this {
        if (out.is(this))
            return this.icross(other);

        cross_a_3D_direction_with_another_3D_direction_to_out(this.array, other.array, out.array);
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

    get xy(): Direction2D {return new Direction2D(this.array.subarray(0, 2))}
    get yz(): Direction2D {return new Direction2D(this.array.subarray(1, 3))}
    get zw(): Direction2D {return new Direction2D(this.array.subarray(2, 4))}

    set xy(other: Direction2D) {this.array.set(other.array)}
    set yz(other: Direction2D) {this.array.set(other.array, 1)}
    set zw(other: Direction2D) {this.array.set(other.array, 2)}

    get xyz(): Direction3D {return new Direction3D(this.array.subarray(0, 3))}
    get yzw(): Direction3D {return new Direction3D(this.array.subarray(1, 4))}

    set xyz(other: Direction3D) {this.array.set(other.array)}
    set yzw(other: Direction3D) {this.array.set(other.array, 1)}
}

export const dir2 = (
    x: number = 0,
    y: number = x
): Direction2D => new Direction2D().setTo(x, y);

export const dir3 = (
    x: number = 0,
    y: number = x,
    z: number = x
): Direction3D => new Direction3D().setTo(x, y, z);

export const dir4 = (
    x: number = 0,
    y: number = x,
    z: number = x,
    w: number = x
): Direction4D => new Direction4D().setTo(x, y, z, w);