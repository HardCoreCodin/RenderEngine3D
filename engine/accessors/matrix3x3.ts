import {RotationMatrix} from "./matrix.js";
import {Direction3D} from "./direction.js";
import {Position3D} from "./position.js";
import {MATRIX_3X3_ALLOCATOR} from "../core/memory/allocators.js";
import {
    add_a_3x3_matrix_to_another_3x3_matrix_in_place,
    add_a_3x3_matrix_to_another_3x3_matrix_to_out,
    add_a_number_to_a_3x3_matrix_in_place,
    add_a_number_to_a_3x3_matrix_to_out,
    check_if_a_3x3_matrix_is_the_identity_matrix,
    check_if_two_3x3_matrices_are_equal,
    divide_a_3x3_matrix_by_a_number_in_place,
    divide_a_3x3_matrix_by_a_number_to_out,
    invert_a_3x3_matrix_in_place,
    invert_a_3x3_matrix_to_out,
    multiply_a_3x3_matrix_by_a_number_in_place,
    multiply_a_3x3_matrix_by_a_number_to_out,
    multiply_a_3x3_matrix_by_another_3x3_matrix_in_place,
    multiply_a_3x3_matrix_by_another_3x3_matrix_to_out,
    rotate_a_2x2_portion_of_a_3x3_matrix_around_x_in_place,
    rotate_a_2x2_portion_of_a_3x3_matrix_around_x_to_out,
    rotate_a_2x2_portion_of_a_3x3_matrix_around_y_in_place,
    rotate_a_2x2_portion_of_a_3x3_matrix_around_y_to_out,
    rotate_a_2x2_portion_of_a_3x3_matrix_around_z_in_place,
    rotate_a_2x2_portion_of_a_3x3_matrix_around_z_to_out,
    rotate_a_3x3_matrix_around_x_in_place,
    rotate_a_3x3_matrix_around_x_to_out,
    rotate_a_3x3_matrix_around_y_in_place,
    rotate_a_3x3_matrix_around_y_to_out,
    rotate_a_3x3_matrix_around_z_in_place,
    rotate_a_3x3_matrix_around_z_to_out,
    set_a_3x3_matrix_to_a_cross_product_matrix_for_a_3D_direction_in_place,
    set_a_3x3_matrix_to_a_rotation_around_x_in_place,
    set_a_3x3_matrix_to_a_rotation_around_y_in_place,
    set_a_3x3_matrix_to_a_rotation_around_z_in_place,
    set_a_3x3_matrix_to_an_outer_product_matrix_for_two_3D_directions_in_place,
    set_a_3x3_matrix_to_the_identity_matrix,
    subtract_a_3x3_matrix_from_another_3x3_matrix_in_place,
    subtract_a_3x3_matrix_from_another_3x3_matrix_to_out,
    subtract_a_number_from_a_3x3_matrix_in_place,
    subtract_a_number_from_a_3x3_matrix_to_out,
    transpose_a_3x3_matrix_in_place,
    transpose_a_3x3_matrix_to_out
} from "../core/math/mat3.js";
import {IMatrix3x3} from "../core/interfaces/matrix.js";

export default class Matrix3x3 extends RotationMatrix implements IMatrix3x3 {
    readonly translation: Direction3D;
    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    protected _getAllocator() {return MATRIX_3X3_ALLOCATOR}

    constructor(array?: Float32Array) {
        super(array);
        this.x_axis = new Direction3D(this.array.subarray(0, 3));
        this.y_axis = new Direction3D(this.array.subarray(3, 6));
        this.z_axis = new Direction3D(this.array.subarray(6, 9));
        this.translation = new Direction3D(this.z_axis.array);
    }

    get m11(): number {return this.array[0]}
    get m12(): number {return this.array[1]}
    get m13(): number {return this.array[2]}

    get m21(): number {return this.array[3]}
    get m22(): number {return this.array[4]}
    get m23(): number {return this.array[5]}

    get m31(): number {return this.array[6]}
    get m32(): number {return this.array[7]}
    get m33(): number {return this.array[8]}


    set m11(m11: number) {this.array[0] = m11}
    set m12(m12: number) {this.array[1] = m12}
    set m13(m13: number) {this.array[2] = m13}

    set m21(m21: number) {this.array[3] = m21}
    set m22(m22: number) {this.array[4] = m22}
    set m23(m23: number) {this.array[5] = m23}

    set m31(m31: number) {this.array[6] = m31}
    set m32(m32: number) {this.array[7] = m32}
    set m33(m33: number) {this.array[8] = m33}

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number
    ): this {
        this.array.set([
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ]);
        return this;
    }

    get is_identity(): boolean {
        return check_if_a_3x3_matrix_is_the_identity_matrix(this.array);
    }

    copy(out: Matrix3x3 = new Matrix3x3()): Matrix3x3 {
        return out.setFrom(this);
    }

    setToIdentity(): this {
        set_a_3x3_matrix_to_the_identity_matrix(this.array);
        return this;
    }

    setAllTo(value: number): this {
        this.array.fill(value);
        return this;
    }

    setFrom(other: Matrix3x3): Matrix3x3 {
        this.array.set(other.array);
        return this;
    }

    equals(other: Matrix3x3): boolean {
        return check_if_two_3x3_matrices_are_equal(this.array, other.array);
    }

    setToCrossProductOf(direction: Direction3D): this {
        set_a_3x3_matrix_to_a_cross_product_matrix_for_a_3D_direction_in_place(this.array, direction.array);
        return this;
    }

    setToOuterProductOf(direction_a: Direction3D, direction_b: Direction3D): this {
        set_a_3x3_matrix_to_an_outer_product_matrix_for_two_3D_directions_in_place(this.array, direction_a.array, direction_b.array);
        return this;
    }

    translate2DBy(x: number, y: number = 0, out?: this): this {
        if (out && !out.is(this)) {
            if (x) out.translation.array[0] = x + this.translation.array[0];
            if (y) out.translation.array[1] = y + this.translation.array[1];

            return out;
        }

        if (x) this.translation.array[0] += x;
        if (y) this.translation.array[1] += y;

        return this;
    }

    protected _add_number_in_place(num: number): void {
        add_a_number_to_a_3x3_matrix_in_place(this.array, num);
    }

    protected _add_other_in_place(other: Matrix3x3): void {
        add_a_3x3_matrix_to_another_3x3_matrix_in_place(this.array, other.array);
    }

    protected _add_number_to_out(num: number, out: Matrix3x3): void {
        add_a_number_to_a_3x3_matrix_to_out(this.array, num, out.array);
    }

    protected _add_other_to_out(other: Matrix3x3, out: Matrix3x3): void {
        add_a_3x3_matrix_to_another_3x3_matrix_to_out(this.array, other.array, out.array);
    }

    protected _sub_number_in_place(num: number): void {
        subtract_a_number_from_a_3x3_matrix_in_place(this.array, num);
    }

    protected _sub_other_in_place(other: Matrix3x3): void {
        subtract_a_3x3_matrix_from_another_3x3_matrix_in_place(this.array, other.array);
    }

    protected _sub_number_to_out(num: number, out: Matrix3x3): void {
        subtract_a_number_from_a_3x3_matrix_to_out(this.array, num, out.array);
    }

    protected _sub_other_to_out(other: Matrix3x3, out: Matrix3x3): void {
        subtract_a_3x3_matrix_from_another_3x3_matrix_to_out(this.array, other.array, out.array);
    }

    protected _mul_number_in_place(num: number): void {
        multiply_a_3x3_matrix_by_a_number_in_place(this.array, num);
    }

    protected _mul_other_in_place(other: this): void {
        multiply_a_3x3_matrix_by_another_3x3_matrix_in_place(this.array, other.array);
    }

    protected _mul_number_to_out(num: number, out: this): void {
        multiply_a_3x3_matrix_by_a_number_to_out(this.array, num, out.array);
    }

    protected _mul_other_to_out(other: this, out: this): void {
        multiply_a_3x3_matrix_by_another_3x3_matrix_to_out(this.array, other.array, out.array);
    }

    protected _div_number_in_place(num: number): void {
        divide_a_3x3_matrix_by_a_number_in_place(this.array, num);
    }

    protected _div_number_to_out(num: number, out: this): void {
        divide_a_3x3_matrix_by_a_number_to_out(this.array, num, out.array);
    }

    protected _transpose_to_out(out: this): void {
        transpose_a_3x3_matrix_to_out(this.array, out.array);
    }

    protected _transpose_in_place(): void {
        transpose_a_3x3_matrix_in_place(this.array);
    }

    protected _invert_to_out(out: this): void {
        invert_a_3x3_matrix_to_out(this.array, out.array);
    }

    protected _invert_in_place(): void {
        invert_a_3x3_matrix_in_place(this.array,);
    }

    protected _set_rotation_around_x(sin: number, cos: number): void {
        set_a_3x3_matrix_to_a_rotation_around_x_in_place(this.array, sin, cos);
    }

    protected _set_rotation_around_y(sin: number, cos: number): void {
        set_a_3x3_matrix_to_a_rotation_around_y_in_place(this.array, sin, cos);
    }

    protected _set_rotation_around_z(sin: number, cos: number): void {
        set_a_3x3_matrix_to_a_rotation_around_z_in_place(this.array, sin, cos);
    }

    protected _rotate_around_x_in_place(sin: number, cos: number): void {
        rotate_a_3x3_matrix_around_x_in_place(this.array, sin, cos);
    }

    protected _rotate_around_y_in_place(sin: number, cos: number): void {
        rotate_a_3x3_matrix_around_y_in_place(this.array, sin, cos);
    }

    protected _rotate_around_z_in_place(sin: number, cos: number): void {
        rotate_a_3x3_matrix_around_z_in_place(this.array, sin, cos);
    }

    protected _rotate_around_x_to_out(sin: number, cos: number, out: this): void {
        rotate_a_3x3_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }

    protected _rotate_around_y_to_out(sin: number, cos: number, out: this): void {
        rotate_a_3x3_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }

    protected _rotate_around_z_to_out(sin: number, cos: number, out: this): void {
        rotate_a_3x3_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }

    protected _inner_rotate_around_x_in_place(sin: number, cos: number): void {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_x_in_place(this.array, sin, cos);
    }

    protected _inner_rotate_around_y_in_place(sin: number, cos: number): void {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_y_in_place(this.array, sin, cos);
    }

    protected _inner_rotate_around_z_in_place(sin: number, cos: number): void {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_z_in_place(this.array, sin, cos);
    }

    protected _inner_rotate_around_x_to_out(sin: number, cos: number, out: this): void {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }

    protected _inner_rotate_around_y_to_out(sin: number, cos: number, out: this): void {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }

    protected _inner_rotate_around_z_to_out(sin: number, cos: number, out: this): void {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }
}

export const mat3 = (
    m11: number = 0, m12: number = m11, m13: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11,
): Matrix3x3 => new Matrix3x3().setTo(
    m11, m12, m13,
    m21, m22, m23,
    m31, m32, m33
);