import { Direction3D } from "./direction.js";
import { RotationMatrix } from "./matrix.js";
import { MATRIX_4X4_ALLOCATOR } from "../core/memory/allocators.js";
import { add_a_4x4_matrix_to_another_4x4_matrix_in_place, add_a_4x4_matrix_to_another_4x4_matrix_to_out, add_a_number_to_a_4x4_matrix_in_place, add_a_number_to_a_4x4_matrix_to_out, check_if_a_4x4_matrix_is_the_identity_matrix, check_if_two_4x4_matrices_are_equal, divide_a_4x4_matrix_by_a_number_in_place, divide_a_4x4_matrix_by_a_number_to_out, invert_a_4x4_matrix_in_place, invert_a_4x4_matrix_to_out, multiply_a_4x4_matrix_by_a_3x3_matrix_in_place, multiply_a_4x4_matrix_by_a_number_in_place, multiply_a_4x4_matrix_by_a_number_to_out, multiply_a_4x4_matrix_by_another_4x4_matrix_in_place, multiply_a_4x4_matrix_by_another_4x4_matrix_to_out, rotate_a_3x3_portion_of_a_4x4_matrix_around_x_in_place, rotate_a_3x3_portion_of_a_4x4_matrix_around_x_to_out, rotate_a_3x3_portion_of_a_4x4_matrix_around_y_in_place, rotate_a_3x3_portion_of_a_4x4_matrix_around_y_to_out, rotate_a_3x3_portion_of_a_4x4_matrix_around_z_in_place, rotate_a_3x3_portion_of_a_4x4_matrix_around_z_to_out, rotate_a_4x4_matrix_around_x_in_place, rotate_a_4x4_matrix_around_x_to_out, rotate_a_4x4_matrix_around_y_in_place, rotate_a_4x4_matrix_around_y_to_out, rotate_a_4x4_matrix_around_z_in_place, rotate_a_4x4_matrix_around_z_to_out, set_a_4x4_matrix_to_a_rotation_around_x_in_place, set_a_4x4_matrix_to_a_rotation_around_y_in_place, set_a_4x4_matrix_to_a_rotation_around_z_in_place, set_a_4x4_matrix_to_the_identity_matrix, subtract_a_4x4_matrix_from_another_4x4_matrix_in_place, subtract_a_4x4_matrix_from_another_4x4_matrix_to_out, subtract_a_number_from_a_4x4_matrix_in_place, subtract_a_number_from_a_4x4_matrix_to_out, transpose_a_4x4_matrix_in_place, transpose_a_4x4_matrix_to_out } from "../core/math/mat4.js";
export default class Matrix4x4 extends RotationMatrix {
    constructor(array) {
        super(array);
        this.x_axis = new Direction3D(this.array.subarray(0, 3));
        this.y_axis = new Direction3D(this.array.subarray(4, 7));
        this.z_axis = new Direction3D(this.array.subarray(8, 11));
        this.translation = new Direction3D(this.array.subarray(12, 15));
    }
    _getAllocator() { return MATRIX_4X4_ALLOCATOR; }
    set m11(m11) { this.array[0] = m11; }
    set m12(m12) { this.array[1] = m12; }
    set m13(m13) { this.array[2] = m13; }
    set m14(m14) { this.array[3] = m14; }
    set m21(m21) { this.array[4] = m21; }
    set m22(m22) { this.array[5] = m22; }
    set m23(m23) { this.array[6] = m23; }
    set m24(m24) { this.array[7] = m24; }
    set m31(m31) { this.array[8] = m31; }
    set m32(m32) { this.array[9] = m32; }
    set m33(m33) { this.array[10] = m33; }
    set m34(m34) { this.array[11] = m34; }
    set m41(m41) { this.array[12] = m41; }
    set m42(m42) { this.array[13] = m42; }
    set m43(m43) { this.array[14] = m43; }
    set m44(m44) { this.array[15] = m44; }
    get m11() { return this.array[0]; }
    get m12() { return this.array[1]; }
    get m13() { return this.array[2]; }
    get m14() { return this.array[3]; }
    get m21() { return this.array[4]; }
    get m22() { return this.array[5]; }
    get m23() { return this.array[6]; }
    get m24() { return this.array[7]; }
    get m31() { return this.array[8]; }
    get m32() { return this.array[9]; }
    get m33() { return this.array[10]; }
    get m34() { return this.array[11]; }
    get m41() { return this.array[12]; }
    get m42() { return this.array[13]; }
    get m43() { return this.array[14]; }
    get m44() { return this.array[15]; }
    setTo(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.array.set([
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ]);
        return this;
    }
    get is_identity() {
        return check_if_a_4x4_matrix_is_the_identity_matrix(this.array);
    }
    copy(out = new Matrix4x4()) {
        return out.setFrom(this);
    }
    setToIdentity() {
        set_a_4x4_matrix_to_the_identity_matrix(this.array);
        return this;
    }
    setAllTo(value) {
        this.array.fill(value);
        return this;
    }
    setFrom(other) {
        this.array.set(other.array);
        return this;
    }
    equals(other) {
        return check_if_two_4x4_matrices_are_equal(this.array, other.array);
    }
    _add_number_in_place(num) {
        add_a_number_to_a_4x4_matrix_in_place(this.array, num);
    }
    _add_other_in_place(other) {
        add_a_4x4_matrix_to_another_4x4_matrix_in_place(this.array, other.array);
    }
    _add_number_to_out(num, out) {
        add_a_number_to_a_4x4_matrix_to_out(this.array, num, out.array);
    }
    _add_other_to_out(other, out) {
        add_a_4x4_matrix_to_another_4x4_matrix_to_out(this.array, other.array, out.array);
    }
    _sub_number_in_place(num) {
        subtract_a_number_from_a_4x4_matrix_in_place(this.array, num);
    }
    _sub_other_in_place(other) {
        subtract_a_4x4_matrix_from_another_4x4_matrix_in_place(this.array, other.array);
    }
    _sub_number_to_out(num, out) {
        subtract_a_number_from_a_4x4_matrix_to_out(this.array, num, out.array);
    }
    _sub_other_to_out(other, out) {
        subtract_a_4x4_matrix_from_another_4x4_matrix_to_out(this.array, other.array, out.array);
    }
    _mul_number_in_place(num) {
        multiply_a_4x4_matrix_by_a_number_in_place(this.array, num);
    }
    _mul_other_in_place(other) {
        if (other instanceof Matrix4x4)
            multiply_a_4x4_matrix_by_another_4x4_matrix_in_place(this.array, other.array);
        else
            multiply_a_4x4_matrix_by_a_3x3_matrix_in_place(this.array, other.array);
    }
    _mul_number_to_out(num, out) {
        multiply_a_4x4_matrix_by_a_number_to_out(this.array, num, out.array);
    }
    _mul_other_to_out(other, out) {
        multiply_a_4x4_matrix_by_another_4x4_matrix_to_out(this.array, other.array, out.array);
    }
    _div_number_in_place(num) {
        divide_a_4x4_matrix_by_a_number_in_place(this.array, num);
    }
    _div_number_to_out(num, out) {
        divide_a_4x4_matrix_by_a_number_to_out(this.array, num, out.array);
    }
    _transpose_to_out(out) {
        transpose_a_4x4_matrix_to_out(this.array, out.array);
    }
    _transpose_in_place() {
        transpose_a_4x4_matrix_in_place(this.array);
    }
    _invert_to_out(out) {
        invert_a_4x4_matrix_to_out(this.array, out.array);
    }
    _invert_in_place() {
        invert_a_4x4_matrix_in_place(this.array);
    }
    _set_rotation_around_x(sin, cos) {
        set_a_4x4_matrix_to_a_rotation_around_x_in_place(this.array, sin, cos);
    }
    _set_rotation_around_y(sin, cos) {
        set_a_4x4_matrix_to_a_rotation_around_y_in_place(this.array, sin, cos);
    }
    _set_rotation_around_z(sin, cos) {
        set_a_4x4_matrix_to_a_rotation_around_z_in_place(this.array, sin, cos);
    }
    _rotate_around_x_in_place(sin, cos) {
        rotate_a_4x4_matrix_around_x_in_place(this.array, sin, cos);
    }
    _rotate_around_y_in_place(sin, cos) {
        rotate_a_4x4_matrix_around_y_in_place(this.array, sin, cos);
    }
    _rotate_around_z_in_place(sin, cos) {
        rotate_a_4x4_matrix_around_z_in_place(this.array, sin, cos);
    }
    _rotate_around_x_to_out(sin, cos, out) {
        rotate_a_4x4_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }
    _rotate_around_y_to_out(sin, cos, out) {
        rotate_a_4x4_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }
    _rotate_around_z_to_out(sin, cos, out) {
        rotate_a_4x4_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }
    _inner_rotate_around_x_in_place(sin, cos) {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_x_in_place(this.array, sin, cos);
    }
    _inner_rotate_around_y_in_place(sin, cos) {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_y_in_place(this.array, sin, cos);
    }
    _inner_rotate_around_z_in_place(sin, cos) {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_z_in_place(this.array, sin, cos);
    }
    _inner_rotate_around_x_to_out(sin, cos, out) {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }
    _inner_rotate_around_y_to_out(sin, cos, out) {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }
    _inner_rotate_around_z_to_out(sin, cos, out) {
        rotate_a_3x3_portion_of_a_4x4_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }
    toString() {
        const a = this.array;
        return `
${a[0]} ${a[1]} ${a[2]} ${a[3]}
${a[4]} ${a[5]} ${a[6]} ${a[7]}
${a[8]} ${a[9]} ${a[10]} ${a[11]}
${a[12]} ${a[13]} ${a[14]} ${a[15]}`;
    }
}
export const mat4 = (m11 = 0, m12 = m11, m13 = m11, m14 = m11, m21 = m11, m22 = m11, m23 = m11, m24 = m11, m31 = m11, m32 = m11, m33 = m11, m34 = m11, m41 = m11, m42 = m11, m43 = m11, m44 = m11) => new Matrix4x4().setTo(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
//# sourceMappingURL=matrix4x4.js.map