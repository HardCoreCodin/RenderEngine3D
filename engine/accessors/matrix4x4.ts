import {Position3D} from "./position.js";
import {Direction3D} from "./direction.js";
import {RotationMatrix} from "./matrix.js";
import {MATRIX_4X4_ALLOCATOR} from "../core/memory/allocators.js";
import {
    add_a_4x4_matrix_to_another_4x4_matrix_in_place,
    add_a_4x4_matrix_to_another_4x4_matrix_to_out,
    add_a_number_to_a_4x4_matrix_in_place,
    add_a_number_to_a_4x4_matrix_to_out,
    check_if_a_4x4_matrix_is_the_identity_matrix,
    check_if_two_4x4_matrices_are_equal,
    divide_a_4x4_matrix_by_a_number_in_place,
    divide_a_4x4_matrix_by_a_number_to_out,
    invert_a_4x4_matrix_in_place,
    invert_a_4x4_matrix_to_out, multiply_a_4x4_matrix_by_a_3x3_matrix_in_place,
    multiply_a_4x4_matrix_by_a_number_in_place,
    multiply_a_4x4_matrix_by_a_number_to_out,
    multiply_a_4x4_matrix_by_another_4x4_matrix_in_place,
    multiply_a_4x4_matrix_by_another_4x4_matrix_to_out,
    rotate_a_3x3_portion_of_a_4x4_matrix_around_x_in_place,
    rotate_a_3x3_portion_of_a_4x4_matrix_around_x_to_out,
    rotate_a_3x3_portion_of_a_4x4_matrix_around_y_in_place,
    rotate_a_3x3_portion_of_a_4x4_matrix_around_y_to_out,
    rotate_a_3x3_portion_of_a_4x4_matrix_around_z_in_place,
    rotate_a_3x3_portion_of_a_4x4_matrix_around_z_to_out,
    rotate_a_4x4_matrix_around_x_in_place,
    rotate_a_4x4_matrix_around_x_to_out,
    rotate_a_4x4_matrix_around_y_in_place,
    rotate_a_4x4_matrix_around_y_to_out,
    rotate_a_4x4_matrix_around_z_in_place,
    rotate_a_4x4_matrix_around_z_to_out,
    set_a_4x4_matrix_to_a_rotation_around_x_in_place,
    set_a_4x4_matrix_to_a_rotation_around_y_in_place,
    set_a_4x4_matrix_to_a_rotation_around_z_in_place,
    set_a_4x4_matrix_to_the_identity_matrix,
    subtract_a_4x4_matrix_from_another_4x4_matrix_in_place,
    subtract_a_4x4_matrix_from_another_4x4_matrix_to_out,
    subtract_a_number_from_a_4x4_matrix_in_place,
    subtract_a_number_from_a_4x4_matrix_to_out,
    transpose_a_4x4_matrix_in_place,
    transpose_a_4x4_matrix_to_out
} from "../core/math/mat4.js";
import {IMatrix4x4} from "../core/interfaces/matrix.js";
import Matrix3x3 from "./matrix3x3.js";

export default class Matrix4x4 extends RotationMatrix implements IMatrix4x4 {
    readonly translation: Position3D;

    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    protected _getAllocator() {return MATRIX_4X4_ALLOCATOR}

    constructor(array?: Float32Array) {
        super(array);

        this.x_axis = new Direction3D(this.array.subarray(0, 3));
        this.y_axis = new Direction3D(this.array.subarray(4, 7));
        this.z_axis = new Direction3D(this.array.subarray(8, 11));

        this.translation = new Position3D(this.array.subarray(12, 15));
    }

    set m11(m11: number) {this.array[0] = m11}
    set m12(m12: number) {this.array[1] = m12}
    set m13(m13: number) {this.array[2] = m13}
    set m14(m14: number) {this.array[3] = m14}

    set m21(m21: number) {this.array[4] = m21}
    set m22(m22: number) {this.array[5] = m22}
    set m23(m23: number) {this.array[6] = m23}
    set m24(m24: number) {this.array[7] = m24}

    set m31(m31: number) {this.array[8] = m31}
    set m32(m32: number) {this.array[9] = m32}
    set m33(m33: number) {this.array[10] = m33}
    set m34(m34: number) {this.array[11] = m34}

    set m41(m41: number) {this.array[12] = m41}
    set m42(m42: number) {this.array[13] = m42}
    set m43(m43: number) {this.array[14] = m43}
    set m44(m44: number) {this.array[15] = m44}

    get m11(): number {return this.array[0]}
    get m12(): number {return this.array[1]}
    get m13(): number {return this.array[2]}
    get m14(): number {return this.array[3]}

    get m21(): number {return this.array[4]}
    get m22(): number {return this.array[5]}
    get m23(): number {return this.array[6]}
    get m24(): number {return this.array[7]}

    get m31(): number {return this.array[8]}
    get m32(): number {return this.array[9]}
    get m33(): number {return this.array[10]}
    get m34(): number {return this.array[11]}

    get m41(): number {return this.array[12]}
    get m42(): number {return this.array[13]}
    get m43(): number {return this.array[14]}
    get m44(): number {return this.array[15]}

    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number
    ): this {
        this.array.set([
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ]);
        return this;
    }

    get is_identity(): boolean {
        return check_if_a_4x4_matrix_is_the_identity_matrix(this.array);
    }

    copy(out: Matrix4x4 = new Matrix4x4()): Matrix4x4 {
        return out.setFrom(this);
    }

    setToIdentity(): this {
        set_a_4x4_matrix_to_the_identity_matrix(this.array);
        return this;
    }

    setAllTo(value: number): this {
        this.array.fill(value);
        return this;
    }

    setFrom(other: Matrix4x4): Matrix4x4 {
        this.array.set(other.array);
        return this;
    }

    equals(other: Matrix4x4): boolean {
        return check_if_two_4x4_matrices_are_equal(this.array, other.array);
    }

    protected _add_number_in_place(num: number): void {
        add_a_number_to_a_4x4_matrix_in_place(this.array, num);
    }

    protected _add_other_in_place(other: Matrix4x4): void {
        add_a_4x4_matrix_to_another_4x4_matrix_in_place(this.array, other.array);
    }

    protected _add_number_to_out(num: number, out: Matrix4x4): void {
        add_a_number_to_a_4x4_matrix_to_out(this.array, num, out.array);
    }

    protected _add_other_to_out(other: Matrix4x4, out: Matrix4x4): void {
        add_a_4x4_matrix_to_another_4x4_matrix_to_out(this.array, other.array, out.array);
    }

    protected _sub_number_in_place(num: number): void {
        subtract_a_number_from_a_4x4_matrix_in_place(this.array, num);
    }

    protected _sub_other_in_place(other: Matrix4x4): void {
        subtract_a_4x4_matrix_from_another_4x4_matrix_in_place(this.array, other.array);
    }

    protected _sub_number_to_out(num: number, out: Matrix4x4): void {
        subtract_a_number_from_a_4x4_matrix_to_out(this.array, num, out.array);
    }

    protected _sub_other_to_out(other: Matrix4x4, out: Matrix4x4): void {
        subtract_a_4x4_matrix_from_another_4x4_matrix_to_out(this.array, other.array, out.array);
    }

    protected _mul_number_in_place(num: number): void {
        multiply_a_4x4_matrix_by_a_number_in_place(this.array, num);
    }

    protected _mul_other_in_place(other: Matrix3x3|Matrix4x4): void {
        if (other instanceof Matrix4x4)
            multiply_a_4x4_matrix_by_another_4x4_matrix_in_place(this.array, other.array);
        else
            multiply_a_4x4_matrix_by_a_3x3_matrix_in_place(this.array, other.array);
    }

    protected _mul_number_to_out(num: number, out: this): void {
        multiply_a_4x4_matrix_by_a_number_to_out(this.array, num, out.array);
    }

    protected _mul_other_to_out(other: this, out: this): void {
        multiply_a_4x4_matrix_by_another_4x4_matrix_to_out(this.array, other.array, out.array);
    }

    protected _div_number_in_place(num: number): void {
        divide_a_4x4_matrix_by_a_number_in_place(this.array, num);
    }

    protected _div_number_to_out(num: number, out: this): void {
        divide_a_4x4_matrix_by_a_number_to_out(this.array, num, out.array);
    }


    protected _transpose_to_out(out: this): void {
        transpose_a_4x4_matrix_to_out(this.array, out.array);
    }

    protected _transpose_in_place(): void {
        transpose_a_4x4_matrix_in_place(this.array);
    }

    protected _invert_to_out(out: this): void {
        invert_a_4x4_matrix_to_out(this.array, out.array);
    }

    protected _invert_in_place(): void {
        invert_a_4x4_matrix_in_place(this.array);
    }

    protected _set_rotation_around_x(sin: number, cos: number): void {
        set_a_4x4_matrix_to_a_rotation_around_x_in_place(this.array, sin, cos);
    }

    protected _set_rotation_around_y(sin: number, cos: number): void {
        set_a_4x4_matrix_to_a_rotation_around_y_in_place(this.array, sin, cos);
    }

    protected _set_rotation_around_z(sin: number, cos: number): void {
        set_a_4x4_matrix_to_a_rotation_around_z_in_place(this.array, sin, cos);
    }

    protected _rotate_around_x_in_place(sin: number, cos: number): void {
        rotate_a_4x4_matrix_around_x_in_place(this.array, sin, cos);
    }

    protected _rotate_around_y_in_place(sin: number, cos: number): void {
        rotate_a_4x4_matrix_around_y_in_place(this.array, sin, cos);
    }

    protected _rotate_around_z_in_place(sin: number, cos: number): void {
        rotate_a_4x4_matrix_around_z_in_place(this.array, sin, cos);
    }

    protected _rotate_around_x_to_out(sin: number, cos: number, out: this): void {
        rotate_a_4x4_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }

    protected _rotate_around_y_to_out(sin: number, cos: number, out: this): void {
        rotate_a_4x4_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }

    protected _rotate_around_z_to_out(sin: number, cos: number, out: this): void {
        rotate_a_4x4_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }

    protected _inner_rotate_around_x_in_place(sin: number, cos: number): void {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_x_in_place(this.array, sin, cos);
    }

    protected _inner_rotate_around_y_in_place(sin: number, cos: number): void {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_y_in_place(this.array, sin, cos);
    }

    protected _inner_rotate_around_z_in_place(sin: number, cos: number): void {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_z_in_place(this.array, sin, cos);
    }

    protected _inner_rotate_around_x_to_out(sin: number, cos: number, out: this): void {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }

    protected _inner_rotate_around_y_to_out(sin: number, cos: number, out: this): void {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }

    protected _inner_rotate_around_z_to_out(sin: number, cos: number, out: this): void {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }

    toString(): string {
        const a = this.array;
        return `
${a[0]} ${a[1]} ${a[2]} ${a[3]}
${a[4]} ${a[5]} ${a[6]} ${a[7]}
${a[8]} ${a[9]} ${a[10]} ${a[11]}
${a[12]} ${a[13]} ${a[14]} ${a[15]}`;
    }
}

export const mat4 = (
    m11: number = 0, m12: number = m11, m13: number = m11, m14: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11, m24: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11, m34: number = m11,
    m41: number = m11, m42: number = m11, m43: number = m11, m44: number = m11
): Matrix4x4 => new Matrix4x4().setTo(
    m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44
);