import {Vector} from "./accessor.js";
import {Float32Allocator3D, VECTOR_3D_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_3D_vector_to_another_3D_vector_in_place,
    add_a_3D_vector_to_another_3D_vector_to_out,
    add_a_number_to_a_3D_vector_in_place,
    add_a_number_to_a_3D_vector_to_out,
    check_if_two_3D_vectrs_are_equal,
    divide_a_3D_vector_by_a_number_in_place,
    divide_a_3D_vector_by_a_number_to_out,
    linearly_interpolate_from_a_3D_vectors_to_another_3D_vector_to_out,
    multiply_a_3D_vector_by_a_3x3_matrix_in_place,
    multiply_a_3D_vector_by_a_3x3_matrix_to_out,
    multiply_a_3D_vector_by_a_number_in_place,
    multiply_a_3D_vector_by_a_number_to_out,
    multiply_a_3D_vector_by_another_3D_vector_in_place,
    multiply_a_3D_vector_by_another_3D_vector_to_out,
    set_a_3D_vector_from_another_3D_vector,
    set_all_components_of_a_3D_vector_to_a_number,
    set_the_components_of_a_3D_vector,
    subtract_a_3D_vector_from_another_3D_vector_in_place,
    subtract_a_3D_vector_from_another_3D_vector_to_out,
    subtract_a_number_from_a_3D_vector_in_place,
    subtract_a_number_from_a_3D_vector_to_out
} from "../math/vec3.js";
import {IMatrix3x3} from "../_interfaces/matrix.js";
import {ITransformableVector, IVector3D} from "../_interfaces/vectors.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export default abstract class Vector3D extends Vector implements IVector3D {
    protected _getAllocator(): Float32Allocator3D {
        return VECTOR_3D_ALLOCATOR;
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

    get x(): number {
        return this.arrays[0][this.id]
    }

    get y(): number {
        return this.arrays[1][this.id]
    }

    get z(): number {
        return this.arrays[2][this.id]
    }

    setTo(x: number, y: number, z: number): this {
        this_arrays = this.arrays;

        set_the_components_of_a_3D_vector(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            x, y, z
        );

        return this;
    }

    setAllTo(value: number): this {
        this_arrays = this.arrays;

        set_all_components_of_a_3D_vector_to_a_number(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            value
        );

        return this;
    }

    setFrom(other: IVector3D): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        set_a_3D_vector_from_another_3D_vector(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
        );

        return this;
    }

    equals(other: IVector3D): boolean {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return check_if_two_3D_vectrs_are_equal(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
        );
    }

    protected _add_number_in_place(num: number): void {
        this_arrays = this.arrays;

        add_a_number_to_a_3D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num
        );
    }

    protected _add_other_in_place(other: IVector3D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        add_a_3D_vector_to_another_3D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
        );
    }

    protected _add_number_to_out(num: number, out: IVector3D): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        add_a_number_to_a_3D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );
    }

    protected _add_other_to_out(other: IVector3D, out: IVector3D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        add_a_3D_vector_to_another_3D_vector_to_out(
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
    }

    protected _sub_number_in_place(num: number): void {
        this_arrays = this.arrays;

        subtract_a_number_from_a_3D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num
        );
    }

    protected _sub_other_in_place(other: IVector3D): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        subtract_a_3D_vector_from_another_3D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
        );
    }

    protected _sub_number_to_out(num: number, out: IVector3D): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        subtract_a_number_from_a_3D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );
    }

    protected _sub_other_to_out(other: IVector3D, out: IVector3D): void {
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
    }

    protected _mul_number_in_place(num: number): void {
        this_arrays = this.arrays;

        multiply_a_3D_vector_by_a_number_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num
        );
    }

    protected _mul_other_in_place(other: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        multiply_a_3D_vector_by_another_3D_vector_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
        );
    }

    protected _mul_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        multiply_a_3D_vector_by_a_number_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );
    }

    protected _mul_other_to_out(other: this, out: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        multiply_a_3D_vector_by_another_3D_vector_to_out(
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
    }

    protected _div_number_in_place(num: number): void {
        this_arrays = this.arrays;

        divide_a_3D_vector_by_a_number_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num
        );
    }

    protected _div_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        divide_a_3D_vector_by_a_number_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            num,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );
    }

    lerp(to: this, by: number, out: this): this {
        this_arrays = this.arrays;
        out_arrays = out.arrays;
        other_arrays = to.arrays;

        linearly_interpolate_from_a_3D_vectors_to_another_3D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            to.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],

            by,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );

        return out;
    }
}

export abstract class TransformableVector3D extends Vector3D implements ITransformableVector<IMatrix3x3> {
    mul(num: number, out?: this): this;
    mul(other: this, out?: this): this;
    mul(matrix: IMatrix3x3, out?: this): this;
    mul(matrix_or_other_or_num: IMatrix3x3|this|number, out?: this): this {
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

                multiply_a_3D_vector_by_a_3x3_matrix_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    matrix_or_other_or_num.id,
                    other_arrays[0], other_arrays[1], other_arrays[2],
                    other_arrays[3], other_arrays[4], other_arrays[5],
                    other_arrays[6], other_arrays[6], other_arrays[8],

                    out.id,
                    out_arrays[0],
                    out_arrays[1],
                    out_arrays[2]
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

            multiply_a_3D_vector_by_a_3x3_matrix_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                matrix_or_other_or_num.id,
                other_arrays[0], other_arrays[1], other_arrays[2],
                other_arrays[3], other_arrays[4], other_arrays[5],
                other_arrays[6], other_arrays[6], other_arrays[8]
            );
        }

        return this;
    }
}