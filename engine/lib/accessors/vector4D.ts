import {Vector} from "./accessor.js";
import {Float32Allocator4D, VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_4D_vector_to_another_4D_vector_in_place,
    add_a_4D_vector_to_another_4D_vector_to_out,
    add_a_number_to_a_4D_vector_in_place,
    add_a_number_to_a_4D_vector_to_out,
    check_if_two_4D_vectros_are_equal,
    divide_a_4D_vector_by_a_number_in_place,
    divide_a_4D_vector_by_a_number_to_out,
    linearly_interpolate_from_a_4D_vector_to_another_4D_vector_to_out,
    multiply_a_4D_vector_by_a_4x4_matrix_in_place,
    multiply_a_4D_vector_by_a_4x4_matrix_to_out,
    multiply_a_4D_vector_by_a_number_in_place,
    multiply_a_4D_vector_by_a_number_to_out,
    multiply_a_4D_vector_by_another_4D_vector_in_place,
    multiply_a_4D_vector_by_another_4D_vector_to_out,
    set_a_4D_vector_from_another_4D_vector,
    set_all_components_of_a_4D_vector_to_a_number,
    set_the_components_of_a_4D_vector,
    subtract_a_4D_vector_from_another_4D_vector_in_place,
    subtract_a_4D_vector_from_another_4D_vector_to_out,
    subtract_a_number_from_a_4D_vector_in_place,
    subtract_a_number_from_a_4D_vector_to_out
} from "../math/vec4.js";
import {IMatrix4x4} from "../_interfaces/matrix.js";
import {ITransformableVector, IVector3D, IVector4D} from "../_interfaces/vectors.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export abstract class Vector4D extends Vector implements IVector4D {
    protected _getAllocator(): Float32Allocator4D {
        return VECTOR_4D_ALLOCATOR;
    }

    set x(x: number) {
        this.arrays[0][this.id] = x
    }

    set y(y: number) {
        this.arrays[1][this.id] = y
    }

    set z(z: number) {
        this.arrays[2][this.id] = z
    }

    set w(w: number) {
        this.arrays[3][this.id] = w
    }

    get x(): number {
        return this.arrays[0][this.id]
    }

    get y(): number {
        return this.arrays[1][this.id]
    }

    get z(): number {
        return this.arrays[2][this.id]
    }

    get w(): number {
        return this.arrays[3][this.id]
    }

    setTo(x: number, y: number, z: number, w: number): this {
        this_arrays = this.arrays;

        set_the_components_of_a_4D_vector(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            x, y, z, w
        );

        return this;
    }

    setAllTo(value: number): this {
        this_arrays = this.arrays;

        set_all_components_of_a_4D_vector_to_a_number(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            value
        );

        return this;
    }

    setFrom(other: IVector4D): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        set_a_4D_vector_from_another_4D_vector(
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
        );

        return this;
    }

    equals(other: IVector4D): boolean {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return check_if_two_4D_vectros_are_equal(
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
        );
    }


    protected _add_number_in_place(num: number): void {
        this_arrays = this.arrays;

        add_a_number_to_a_4D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num
        );
    }

    protected _add_other_in_place(other: IVector4D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        add_a_4D_vector_to_another_4D_vector_in_place(
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

    protected _add_number_to_out(num: number, out: IVector4D): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        add_a_number_to_a_4D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );
    }

    protected _add_other_to_out(other: IVector4D, out: IVector4D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        add_a_4D_vector_to_another_4D_vector_to_out(
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
    }

    protected _sub_number_in_place(num: number): void {
        this_arrays = this.arrays;

        subtract_a_number_from_a_4D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num
        );
    }

    protected _sub_other_in_place(other: IVector4D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        subtract_a_4D_vector_from_another_4D_vector_in_place(
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
        );
    }

    protected _sub_number_to_out(num: number, out: IVector3D): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        subtract_a_number_from_a_4D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );
    }

    protected _sub_other_to_out(other: IVector4D, out: IVector4D): void {
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
    }

    protected _mul_number_in_place(num: number): void {
        this_arrays = this.arrays;

        multiply_a_4D_vector_by_a_number_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num
        );
    }

    protected _mul_other_in_place(other: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        multiply_a_4D_vector_by_another_4D_vector_in_place(
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

    protected _mul_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        multiply_a_4D_vector_by_a_number_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );
    }

    protected _mul_other_to_out(other: this, out: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        multiply_a_4D_vector_by_another_4D_vector_to_out(
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
    }

    protected _div_number_in_place(num: number): void {
        this_arrays = this.arrays;

        divide_a_4D_vector_by_a_number_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num
        );
    }

    protected _div_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        divide_a_4D_vector_by_a_number_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );
    }

    lerp(to: this, by: number, out: this): this {
        this_arrays = this.arrays;
        out_arrays = out.arrays;
        other_arrays = to.arrays;

        linearly_interpolate_from_a_4D_vector_to_another_4D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            to.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3],

            by,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }
}

export abstract class TransformableVector4D extends Vector4D implements ITransformableVector<IMatrix4x4> {
    mul(num: number, out?: this): this;
    mul(other: this, out?: this): this;
    mul(matrix: IMatrix4x4, out?: this): this;
    mul(matrix_or_other_or_num: IMatrix4x4|this|number, out?: this): this {
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

                multiply_a_4D_vector_by_a_4x4_matrix_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],
                    this_arrays[3],

                    matrix_or_other_or_num.id,
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
            }

            return out;
        }

        if (typeof matrix_or_other_or_num === "number")
            this._mul_number_in_place(matrix_or_other_or_num);
        else if (matrix_or_other_or_num instanceof this.constructor)
            this._mul_other_in_place(matrix_or_other_or_num as this);
        else {
            other_arrays = matrix_or_other_or_num.arrays;

            multiply_a_4D_vector_by_a_4x4_matrix_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],
                this_arrays[3],

                matrix_or_other_or_num.id,
                other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
                other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[6],
                other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
                other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15]
            );
        }


        return this;
    }
}