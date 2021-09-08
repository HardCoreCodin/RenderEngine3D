import Matrix from "./matrix.js";
import {Direction2D} from "./direction.js";
import {MATRIX_2X2_ALLOCATOR} from "../core/memory/allocators.js";
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
    set_a_2x2_matrix_to_a_rotation_matrix,
    set_a_2x2_matrix_to_the_identity_matrix,
    subtract_a_2x2_matrix_from_another_2x2_matrix_in_place,
    subtract_a_2x2_matrix_from_another_2x2_matrix_to_out,
    subtract_a_number_from_a_2x2_matrix_in_place,
    subtract_a_number_from_a_2x2_matrix_to_out,
    transpose_a_2x2_matrix_in_place,
    transpose_a_2x2_matrix_to_out
} from "../core/math/mat2.js";
import {IMatrix2x2} from "../core/interfaces/matrix.js";

export default class Matrix2x2 extends Matrix implements IMatrix2x2 {
    readonly x_axis: Direction2D;
    readonly y_axis: Direction2D;

    protected _getAllocator() {return MATRIX_2X2_ALLOCATOR}

    constructor(array?: Float32Array) {
        super(array);

        this.x_axis = new Direction2D(this.array.subarray(0, 2));
        this.y_axis = new Direction2D(this.array.subarray(2, 4));
    }

    set m11(m11: number) {this.array[0] = m11}
    set m12(m12: number) {this.array[1] = m12}
    set m21(m21: number) {this.array[2] = m21}
    set m22(m22: number) {this.array[3] = m22}

    get m11(): number {return this.array[0]}
    get m12(): number {return this.array[1]}
    get m21(): number {return this.array[2]}
    get m22(): number {return this.array[3]}

    get is_identity(): boolean {
        return check_if_a_2x2_matrix_is_the_identity_matrix(this.array);
    }

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this {
        this.array.set([m11, m12, m21, m22]);
        return this;
    }

    copy(out: Matrix2x2 = new Matrix2x2()): Matrix2x2 {
        return out.setFrom(this);
    }

    setToIdentity(): this {
        set_a_2x2_matrix_to_the_identity_matrix(this.array);
        return this;
    }

    setRotation(angle: number, reset: boolean = true): this {
        if (reset)
            this.setToIdentity();

        set_a_2x2_matrix_to_a_rotation_matrix(this.array, Math.sin(angle), Math.cos(angle));
        return this;
    }

    rotateBy(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            rotate_a_2x2_matrix_to_out(this.array, Math.sin(angle), Math.cos(angle), out.array);
            return out;
        }

        rotate_a_2x2_matrix_in_place(this.array, Math.sin(angle), Math.cos(angle));
        return this;
    }

    scaleBy(x: number, y: number = x, out?: this): this {
        if (out && !out.is(this)) {
            if (x !== 1) this.x_axis.mul(x, out.x_axis);
            if (y !== 1) this.y_axis.mul(y, out.y_axis);

            return out;
        }

        if (x !== 1) this.x_axis.imul(x);
        if (y !== 1) this.y_axis.imul(y);
        return this;
    }

    setAllTo(value: number): this {
        this.array.fill(value);
        return this;
    }

    setFrom(other: Matrix2x2): Matrix2x2 {
        this.array.set(other.array);
        return this;
    }

    equals(other: Matrix2x2): boolean {
        return check_if_two_2x2_matrices_are_equal(this.array, other.array);
    }

    protected _add_number_in_place(num: number): void {
        add_a_number_to_a_2x2_matrix_in_place(this.array, num);
    }

    protected _add_other_in_place(other: Matrix2x2): void {
        add_a_2x2_matrix_to_another_2x2_matrix_in_place(this.array, other.array);
    }

    protected _add_number_to_out(num: number, out: Matrix2x2): void {
        add_a_number_to_a_2x2_matrix_to_out(this.array, num, out.array);
    }

    protected _add_other_to_out(other: Matrix2x2, out: Matrix2x2): void {
        add_a_2x2_matrix_to_another_2x2_matrix_to_out(this.array, other.array, out.array);
    }

    protected _sub_number_in_place(num: number): void {
        subtract_a_number_from_a_2x2_matrix_in_place(this.array, num);
    }

    protected _sub_other_in_place(other: Matrix2x2): void {
        subtract_a_2x2_matrix_from_another_2x2_matrix_in_place(this.array, other.array);
    }

    protected _sub_number_to_out(num: number, out: Matrix2x2): void {
        subtract_a_number_from_a_2x2_matrix_to_out(this.array, num, out.array);
    }

    protected _sub_other_to_out(other: Matrix2x2, out: Matrix2x2): void {
        subtract_a_2x2_matrix_from_another_2x2_matrix_to_out(this.array, other.array, out.array);
    }

    protected _mul_number_in_place(num: number): void {
        multiply_a_2x2_matrix_by_a_number_in_place(this.array, num);
    }

    protected _mul_other_in_place(other: this): void {
        multiply_a_2x2_matrix_by_another_2x2_matrix_in_place(this.array, other.array);
    }

    protected _mul_number_to_out(num: number, out: this): void {
        multiply_a_2x2_matrix_by_a_number_to_out(this.array, num, out.array);
    }

    protected _mul_other_to_out(other: this, out: this): void {
        multiply_a_2x2_matrix_by_another_2x2_matrix_to_out(this.array, other.array, out.array);
    }

    protected _div_number_in_place(num: number): void {
        divide_a_2x2_matrix_by_a_number_in_place(this.array, num);
    }

    protected _div_number_to_out(num: number, out: this): void {
        divide_a_2x2_matrix_by_a_number_to_out(this.array, num, out.array);
    }

    protected _transpose_to_out(out: this): void {
        transpose_a_2x2_matrix_to_out(this.array, out.array);
    }

    protected _transpose_in_place(): void {
        transpose_a_2x2_matrix_in_place(this.array);
    }

    protected _invert_to_out(out: this): void {
        invert_a_2x2_matrix_to_out(this.array, out.array);
    }

    protected _invert_in_place(): void {
        invert_a_2x2_matrix_in_place(this.array);
    }
}

export const mat2 = (
    m11: number = 0, m12: number = m11,
    m21: number = m11, m22: number = m11
): Matrix2x2 => new Matrix2x2().setTo(
    m11, m12,
    m21, m22
);