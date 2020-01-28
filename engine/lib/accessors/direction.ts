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
    dot_a_3D_direction_with_another_3D_direction, multiply_a_3D_vector_by_a_3x3_matrix_in_place,
    multiply_a_3D_vector_by_a_3x3_matrix_to_out,
    multiply_a_3D_vector_by_a_4x3_matrix_to_out4,
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

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];


export class Direction2D extends Vector2D<Direction2D> implements IDirection2D
{
    copy(out: Direction2D = new Direction2D()): Direction2D {return out.setFrom(this)}

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return dot_a_2D_direction_with_another_2D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        )
    }

    get length(): number {
        this_arrays = this.arrays;

        return compute_the_length_of_a_2D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1]
        )
    }

    get length_squared(): number {
        this_arrays = this.arrays;

        return square_the_length_of_a_2D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1]
        )
    }

    inormalize(): this {
        this_arrays = this.arrays;

        normalize_a_2D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1]
        );

        return this;
    }

    normalize(out: this): this {
        if (out.is(this))
            return this.inormalize();

        this_arrays = this.arrays;
        out_arrays = out.arrays;

        normalize_a_2D_direction_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            out.id,
            out_arrays[0],
            out_arrays[1]
        );

        return out;
    }

    ireflect(other: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        reflect_a_2D_vector_around_a_2D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        );

        return this;
    }

    reflect(other: this, out: this): this {
        if (out.is(this))
            return this.ireflect(other);

        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        reflect_a_2D_vector_around_a_2D_direction_to_out(
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

    inegate(): this {
        this_arrays = this.arrays;

        negate_a_2D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1]
        );

        return this;
    }

    negate(out: this): this {
        if (out.is(this))
            return this.inegate();

        this_arrays = this.arrays;
        out_arrays = out.arrays;

        negate_a_2D_direction_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

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

export class Direction3D extends Vector3D<Direction3D> implements IDirection3D
{
    copy(out: Direction3D = new Direction3D()): Direction3D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return dot_a_3D_direction_with_another_3D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        )
    }

    get length(): number {
        this_arrays = this.arrays;

        return compute_the_length_of_a_3D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        )
    }

    get length_squared(): number {
        this_arrays = this.arrays;

        return square_the_length_of_a_3D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        )
    }

    inormalize(): this {
        this_arrays = this.arrays;

        normalize_a_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        );

        return this;
    }

    normalize(out: this): this {
        if (out.is(this))
            return this.inormalize();

        this_arrays = this.arrays;
        out_arrays = out.arrays;

        normalize_a_3D_direction_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );

        return out;
    }

    ireflect(other: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        reflect_a_3D_vector_around_a_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );

        return this;
    }

    reflect(other: this, out: this): this {
        if (out.is(this))
            return this.ireflect(other);

        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        reflect_a_3D_vector_around_a_3D_direction_to_out(
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

    inegate(): this {
        this_arrays = this.arrays;

        negate_a_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        );

        return this;
    }

    negate(out: this): this {
        if (out.is(this))
            return this.inegate();

        this_arrays = this.arrays;
        out_arrays = out.arrays;

        negate_a_3D_direction_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );

        return out;
    }

    icross(other: Direction3D): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        cross_a_3D_direction_with_another_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );

        return this;
    };

    cross(other: Direction3D, out: this): this {
        if (out.is(this))
            return this.icross(other);

        this_arrays = this.arrays;
        other_arrays = other.arrays;

        out_arrays = out.arrays;

        cross_a_3D_direction_with_another_3D_direction_to_out(
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
            multiply_a_3D_vector_by_a_3x3_matrix_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2],
                other_arrays[4], other_arrays[5], other_arrays[6],
                other_arrays[8], other_arrays[9], other_arrays[10]
            );

        return this;
    }

    matmul(matrix: Matrix3x3, out: Direction3D): Direction3D
    matmul(matrix: Matrix4x4, out: Direction3D): Direction3D
    matmul(matrix: Matrix4x4, out: Direction4D): Direction4D
    matmul(matrix: Matrix3x3|Matrix4x4, out: Direction3D|Direction4D): Direction3D|Direction4D {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;
        out_arrays = out.arrays;

        if (out instanceof Direction3D) {
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
                multiply_a_3D_vector_by_a_3x3_matrix_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    matrix.id,
                    other_arrays[0], other_arrays[1], other_arrays[2],
                    other_arrays[4], other_arrays[5], other_arrays[6],
                    other_arrays[8], other_arrays[9], other_arrays[10],

                    out.id,
                    out_arrays[0],
                    out_arrays[1],
                    out_arrays[2]
                );
            }
        } else
            multiply_a_3D_vector_by_a_4x3_matrix_to_out4(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix.id,
                other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
                other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
                other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );

        return out;
    }

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export class Direction4D extends Vector4D<Direction4D> implements IDirection4D
{
    copy(out: Direction4D = new Direction4D()): Direction4D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return dot_a_4D_direction_with_another_4D_direction(
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
        )
    }

    get length(): number {
        this_arrays = this.arrays;

        return compute_the_length_of_a_4D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        )
    }

    get length_squared(): number {
        this_arrays = this.arrays;

        return square_the_length_of_a_4D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        )
    }

    inormalize(): this {
        this_arrays = this.arrays;

        normalize_a_4D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        );

        return this;
    }

    normalize(out: this): this {
        if (out.is(this))
            return this.inormalize();

        this_arrays = this.arrays;
        out_arrays = out.arrays;

        normalize_a_4D_direction_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }

    ireflect(other: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        reflect_a_4D_vector_around_a_4D_direction_in_place(
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

        return this;
    }

    reflect(other: this, out: this): this {
        if (out.is(this))
            return this.ireflect(other);

        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        reflect_a_4D_vector_around_a_4D_direction_to_out(
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

    inegate(): this {
        this_arrays = this.arrays;

        negate_a_4D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        );

        return this;
    }

    negate(out: this): this {
        if (out.is(this))
            return this.inegate();

        this_arrays = this.arrays;
        out_arrays = out.arrays;

        negate_a_4D_direction_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }

    icross(other: Direction4D): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        cross_a_3D_direction_with_another_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );

        return this;
    }

    cross(other: Direction4D, out: this): this {
        if (out.is(this))
            return this.icross(other);

        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        cross_a_3D_direction_with_another_3D_direction_to_out(
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

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
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