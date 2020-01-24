import Matrix from "./matrix.js";
import {Direction2D} from "./direction.js";
import {Float32Allocator4D, MATRIX_2X2_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_2x2_matrix_to_another_2x2_matrix_in_place,
    add_a_2x2_matrix_to_another_2x2_matrix_to_out,
    add_a_number_to_a_2x2_matrix_in_place,
    add_a_number_to_a_2x2_matrix_to_out,
    check_if_a_2x2_matrix_is_the_identity_matrix,
    check_if_two_2x2_matrices_are_equal,
    divide_a_2x2_matrix_by_a_number_in_place,
    divide_a_2x2_matrix_by_a_number_to_out,
    invert_a_2x2_matrix_in_place,
    invert_a_2x2_matrix_to_out,
    multiply_a_2x2_matrix_by_a_number_in_place,
    multiply_a_2x2_matrix_by_a_number_to_out,
    multiply_a_2x2_matrix_by_another_2x2_matrix_in_place,
    multiply_a_2x2_matrix_by_another_2x2_matrix_to_out,
    rotate_a_2x2_matrix_in_place,
    rotate_a_2x2_matrix_to_out,
    set_a_2x2_matrix_from_another_2x2_matrix,
    set_a_2x2_matrix_to_a_rotation_matrix,
    set_a_2x2_matrix_to_the_identity_matrix,
    set_all_components_of_a_2x2_matrix_to_a_number,
    set_the_components_of_a_2x2_matrix,
    subtract_a_2x2_matrix_from_another_2x2_matrix_in_place,
    subtract_a_2x2_matrix_from_another_2x2_matrix_to_out,
    subtract_a_number_from_a_2x2_matrix_in_place,
    subtract_a_number_from_a_2x2_matrix_to_out,
    transpose_a_2x2_matrix_in_place,
    transpose_a_2x2_matrix_to_out
} from "../math/mat2.js";
import {IMatrix2x2} from "../_interfaces/matrix.js";
import {Float4} from "../../types.js";

const cos = Math.cos;
const sin = Math.sin;

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export default class Matrix2x2 extends Matrix implements IMatrix2x2 {
    protected _getAllocator(): Float32Allocator4D {
        return MATRIX_2X2_ALLOCATOR;
    }

    readonly x_axis: Direction2D;
    readonly y_axis: Direction2D;

    constructor(id?: number, arrays?: Float4) {
        super(id, arrays);

        this.x_axis = new Direction2D(this.id, [arrays[0], arrays[1]]);
        this.y_axis = new Direction2D(this.id, [arrays[2], arrays[3]]);
    }

    set m11(m11: number) {
        this.arrays[0][this.id] = m11
    }

    set m12(m12: number) {
        this.arrays[1][this.id] = m12
    }

    set m21(m21: number) {
        this.arrays[2][this.id] = m21
    }

    set m22(m22: number) {
        this.arrays[3][this.id] = m22
    }

    get m11(): number {
        return this.arrays[0][this.id]
    }

    get m12(): number {
        return this.arrays[1][this.id]
    }

    get m21(): number {
        return this.arrays[2][this.id]
    }

    get m22(): number {
        return this.arrays[3][this.id]
    }

    get is_identity(): boolean {
        this_arrays = this.arrays;

        return check_if_a_2x2_matrix_is_the_identity_matrix(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3]
        );
    }

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this {
        this_arrays = this.arrays;

        set_the_components_of_a_2x2_matrix(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            m11, m12,
            m21, m22
        );

        return this;
    }

    copy(out: Matrix2x2 = new Matrix2x2()): Matrix2x2 {
        return out.setFrom(this);
    }

    setToIdentity(): this {
        this_arrays = this.arrays;

        set_a_2x2_matrix_to_the_identity_matrix(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3]
        );

        return this;
    }

    setRotation(angle: number, reset: boolean = true): this {
        if (reset) this.setToIdentity();

        this_arrays = this.arrays;

        set_a_2x2_matrix_to_a_rotation_matrix(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            sin(angle),
            cos(angle)
        );

        return this;
    }

    rotateBy(angle: number, out?: this): this {
        this_arrays = this.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            rotate_a_2x2_matrix_to_out(
                this.id,
                this_arrays[0], this_arrays[1],
                this_arrays[2], this_arrays[3],

                sin(angle),
                cos(angle),

                out.id,
                out_arrays[0], out_arrays[1],
                out_arrays[2], out_arrays[3]
            );

            return out;
        }

        rotate_a_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            sin(angle),
            cos(angle)
        );

        return this;
    }

    scaleBy(x: number, y: number = x, out?: this): this {
        if (out && !out.is(this)) {
            if (x !== 1) this.x_axis.mul(x, out.x_axis);
            if (y !== 1) this.y_axis.mul(y, out.y_axis);

            return out;
        }

        if (x !== 1) this.x_axis.mul(x);
        if (y !== 1) this.y_axis.mul(y);
        return this;
    }

    setAllTo(value: number): this {
        this_arrays = this.arrays;

        set_all_components_of_a_2x2_matrix_to_a_number(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            value
        );

        return this;
    }

    setFrom(other: Matrix2x2): Matrix2x2 {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        set_a_2x2_matrix_from_another_2x2_matrix(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3],
        );

        return this;
    }

    equals(other: Matrix2x2): boolean {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return check_if_two_2x2_matrices_are_equal(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3],
        );
    }


    protected _add_number_in_place(num: number): void {
        this_arrays = this.arrays;

        add_a_number_to_a_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num
        );
    }

    protected _add_other_in_place(other: Matrix2x2): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        add_a_2x2_matrix_to_another_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3]
        );
    }

    protected _add_number_to_out(num: number, out: Matrix2x2): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        add_a_number_to_a_2x2_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num,

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3]
        );
    }

    protected _add_other_to_out(other: Matrix2x2, out: Matrix2x2): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        add_a_2x2_matrix_to_another_2x2_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3],

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3]
        );
    }

    protected _sub_number_in_place(num: number): void {
        this_arrays = this.arrays;

        subtract_a_number_from_a_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num
        );
    }

    protected _sub_other_in_place(other: Matrix2x2): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        subtract_a_2x2_matrix_from_another_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3],
        );
    }

    protected _sub_number_to_out(num: number, out: Matrix2x2): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        subtract_a_number_from_a_2x2_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num,

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3]
        );
    }

    protected _sub_other_to_out(other: Matrix2x2, out: Matrix2x2): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_2x2_matrix_from_another_2x2_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3],

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3]
        );
    }

    protected _mul_number_in_place(num: number): void {
        this_arrays = this.arrays;

        multiply_a_2x2_matrix_by_a_number_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num
        );
    }

    protected _mul_other_in_place(other: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        multiply_a_2x2_matrix_by_another_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3]
        );
    }

    protected _mul_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        multiply_a_2x2_matrix_by_a_number_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num,

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3]
        );
    }

    protected _mul_other_to_out(other: this, out: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        multiply_a_2x2_matrix_by_another_2x2_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            other.id,
            other_arrays[0], other_arrays[1],
            other_arrays[2], other_arrays[3],

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3]
        );
    }

    protected _div_number_in_place(num: number): void {
        this_arrays = this.arrays;

        divide_a_2x2_matrix_by_a_number_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num
        );
    }

    protected _div_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        divide_a_2x2_matrix_by_a_number_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            num,

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3]
        );
    }


    protected _transpose_to_out(out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        transpose_a_2x2_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3],
        );
    }

    protected _transpose_in_place(): void {
        this_arrays = this.arrays;

        transpose_a_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3]
        );
    }

    protected _invert_to_out(out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        invert_a_2x2_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3],

            out.id,
            out_arrays[0], out_arrays[1],
            out_arrays[2], out_arrays[3],
        );
    }

    protected _invert_in_place(): void {
        this_arrays = this.arrays;

        invert_a_2x2_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1],
            this_arrays[2], this_arrays[3]
        );
    }
}

export const mat3 = (
    m11: number = 0, m12: number = m11,
    m21: number = m11, m22: number = m11
): Matrix2x2 => new Matrix2x2().setTo(
    m11, m12,
    m21, m22
);