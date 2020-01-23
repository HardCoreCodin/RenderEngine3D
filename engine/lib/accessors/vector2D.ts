import {Vector} from "./accessor.js";
import {Float32Allocator2D, VECTOR_2D_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_2D_vector_to_another_2D_vector_in_place,
    add_a_2D_vector_to_another_2D_vector_to_out,
    add_a_number_to_a_2D_vector_in_place,
    add_a_number_to_a_2D_vector_to_out,
    check_if_two_2D_vectrs_are_equal,
    divide_a_2D_vector_by_a_number_in_place,
    divide_a_2D_vector_by_a_number_to_out,
    linearly_interpolate_from_a_2D_vectors_to_another_2D_vector_to_out,
    multiply_a_2D_vector_by_a_2x2_matrix_in_place,
    multiply_a_2D_vector_by_a_2x2_matrix_to_out,
    multiply_a_2D_vector_by_a_number_in_place,
    multiply_a_2D_vector_by_a_number_to_out,
    multiply_a_2D_vector_by_another_2D_vector_in_place,
    multiply_a_2D_vector_by_another_2D_vector_to_out,
    set_a_2D_vector_from_another_2D_vector,
    set_all_components_of_a_2D_vector_to_a_number,
    set_the_components_of_a_2D_vector,
    subtract_a_2D_vector_from_another_2D_vector_in_place,
    subtract_a_2D_vector_from_another_2D_vector_to_out,
    subtract_a_number_from_a_2D_vector_in_place,
    subtract_a_number_from_a_2D_vector_to_out
} from "../math/vec2.js";
import {IMatrix2x2} from "../_interfaces/matrix.js";
import {ITransformableVector, IVector2D} from "../_interfaces/vectors.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export abstract class Vector2D extends Vector implements IVector2D {
    protected _getAllocator(): Float32Allocator2D {
        return VECTOR_2D_ALLOCATOR;
    }

    set x(x: number) {
        this.arrays[0][this.id] = x
    }

    set y(y: number) {
        this.arrays[1][this.id] = y
    }

    get x(): number {
        return this.arrays[0][this.id]
    }

    get y(): number {
        return this.arrays[1][this.id]
    }

    setTo(x: number, y: number): this {
        this_arrays = this.arrays;

        set_the_components_of_a_2D_vector(
            this.id,
            this_arrays[0],
            this_arrays[1],

            x, y
        );

        return this;
    }

    setAllTo(value: number): this {
        this_arrays = this.arrays;

        set_all_components_of_a_2D_vector_to_a_number(
            this.id,
            this_arrays[0],
            this_arrays[1],

            value
        );

        return this;
    }

    setFrom(other: IVector2D): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        set_a_2D_vector_from_another_2D_vector(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1],
        );

        return this;
    }

    equals(other: IVector2D): boolean {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return check_if_two_2D_vectrs_are_equal(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1],
        );
    }

    protected _add_number_in_place(num: number): void {
        this_arrays = this.arrays;

        add_a_number_to_a_2D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num
        );
    }

    protected _add_other_in_place(other: IVector2D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        add_a_2D_vector_to_another_2D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1],
        );
    }

    protected _add_number_to_out(num: number, out: IVector2D): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        add_a_number_to_a_2D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1]
        );
    }

    protected _add_other_to_out(other: IVector2D, out: IVector2D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        add_a_2D_vector_to_another_2D_vector_to_out(
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
    }

    protected _sub_number_in_place(num: number): void {
        this_arrays = this.arrays;

        subtract_a_number_from_a_2D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num
        );
    }

    protected _sub_other_in_place(other: IVector2D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        subtract_a_2D_vector_from_another_2D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1],
        );
    }

    protected _sub_number_to_out(num: number, out: IVector2D): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        subtract_a_number_from_a_2D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1]
        );
    }

    protected _sub_other_to_out(other: IVector2D, out: IVector2D): void {
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
    }

    protected _mul_number_in_place(num: number): void {
        this_arrays = this.arrays;

        multiply_a_2D_vector_by_a_number_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num
        );
    }

    protected _mul_other_in_place(other: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        multiply_a_2D_vector_by_another_2D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1],
        );
    }

    protected _mul_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        multiply_a_2D_vector_by_a_number_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1]
        );
    }

    protected _mul_other_to_out(other: this, out: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        multiply_a_2D_vector_by_another_2D_vector_to_out(
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
    }

    protected _div_number_in_place(num: number): void {
        this_arrays = this.arrays;

        divide_a_2D_vector_by_a_number_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num
        );
    }

    protected _div_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        divide_a_2D_vector_by_a_number_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1]
        );
    }

    lerp(to: this, by: number, out: this): this {
        this_arrays = this.arrays;
        out_arrays = out.arrays;
        other_arrays = to.arrays;

        linearly_interpolate_from_a_2D_vectors_to_another_2D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            to.id,
            other_arrays[0],
            other_arrays[1],

            by,

            out.id,
            out_arrays[0],
            out_arrays[1]
        );

        return out;
    }
}

export abstract class TransformableVector2D extends Vector2D implements ITransformableVector<IMatrix2x2> {
    mul(num: number, out?: this): this;
    mul(other: this, out?: this): this;
    mul(matrix: IMatrix2x2, out?: this): this;
    mul(matrix_or_other_or_num: IMatrix2x2|this|number, out?: this): this {
        if (out && !out.is(this)) {
            if (typeof matrix_or_other_or_num === "number") {
                if (matrix_or_other_or_num === 0)
                    this.setAllTo(0);
                else
                    this._mul_number_to_out(matrix_or_other_or_num, out);
            } else if (matrix_or_other_or_num instanceof this.constructor)
                this._mul_other_to_out(matrix_or_other_or_num as this, out);
            else {
                other_arrays = matrix_or_other_or_num.arrays;

                multiply_a_2D_vector_by_a_2x2_matrix_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],

                    matrix_or_other_or_num.id,
                    other_arrays[0], other_arrays[1],
                    other_arrays[2], other_arrays[3],

                    out.id,
                    out_arrays[0],
                    out_arrays[1]
                );
            }

            return out;
        }

        if (typeof matrix_or_other_or_num === "number")
            this._mul_number_in_place(matrix_or_other_or_num);
        else if (matrix_or_other_or_num instanceof this.constructor)
            this._mul_other_in_place(matrix_or_other_or_num as this);
        else {
            other_arrays = matrix_or_other_or_num.arrays;

            multiply_a_2D_vector_by_a_2x2_matrix_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],

                matrix_or_other_or_num.id,
                other_arrays[0], other_arrays[1],
                other_arrays[2], other_arrays[3]
            );
        }

        return this;
    }
}