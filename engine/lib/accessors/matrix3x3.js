import { RotationMatrix } from "./matrix.js";
import { Direction3D } from "./direction.js";
import { Position3D } from "./position.js";
import { MATRIX_3X3_ALLOCATOR } from "../memory/allocators.js";
import { add_a_3x3_matrix_to_another_3x3_matrix_in_place, add_a_3x3_matrix_to_another_3x3_matrix_to_out, add_a_number_to_a_3x3_matrix_in_place, add_a_number_to_a_3x3_matrix_to_out, check_if_a_3x3_matrix_is_the_identity_matrix, check_if_two_3x3_matrices_are_equal, divide_a_3x3_matrix_by_a_number_in_place, divide_a_3x3_matrix_by_a_number_to_out, invert_a_3x3_matrix_in_place, invert_a_3x3_matrix_to_out, multiply_a_3x3_matrix_by_a_number_in_place, multiply_a_3x3_matrix_by_a_number_to_out, multiply_a_3x3_matrix_by_another_3x3_matrix_in_place, multiply_a_3x3_matrix_by_another_3x3_matrix_to_out, rotate_a_2x2_portion_of_a_3x3_matrix_around_x_in_place, rotate_a_2x2_portion_of_a_3x3_matrix_around_x_to_out, rotate_a_2x2_portion_of_a_3x3_matrix_around_y_in_place, rotate_a_2x2_portion_of_a_3x3_matrix_around_y_to_out, rotate_a_2x2_portion_of_a_3x3_matrix_around_z_in_place, rotate_a_2x2_portion_of_a_3x3_matrix_around_z_to_out, rotate_a_3x3_matrix_around_x_in_place, rotate_a_3x3_matrix_around_x_to_out, rotate_a_3x3_matrix_around_y_in_place, rotate_a_3x3_matrix_around_y_to_out, rotate_a_3x3_matrix_around_z_in_place, rotate_a_3x3_matrix_around_z_to_out, set_a_3x3_matrix_to_a_cross_product_matrix_for_a_3D_direction_in_place, set_a_3x3_matrix_to_a_rotation_around_x_in_place, set_a_3x3_matrix_to_a_rotation_around_y_in_place, set_a_3x3_matrix_to_a_rotation_around_z_in_place, set_a_3x3_matrix_to_an_outer_product_matrix_for_two_3D_directions_in_place, set_a_3x3_matrix_to_the_identity_matrix, subtract_a_3x3_matrix_from_another_3x3_matrix_in_place, subtract_a_3x3_matrix_from_another_3x3_matrix_to_out, subtract_a_number_from_a_3x3_matrix_in_place, subtract_a_number_from_a_3x3_matrix_to_out, transpose_a_3x3_matrix_in_place, transpose_a_3x3_matrix_to_out } from "../math/mat3.js";
export default class Matrix3x3 extends RotationMatrix {
    constructor(array) {
        super(array);
        this.x_axis = new Direction3D(this.array.subarray(0, 3));
        this.y_axis = new Direction3D(this.array.subarray(3, 6));
        this.z_axis = new Direction3D(this.array.subarray(6, 9));
        this.translation = new Position3D(this.z_axis.array);
    }
    _getAllocator() { return MATRIX_3X3_ALLOCATOR; }
    get m11() { return this.array[0]; }
    get m12() { return this.array[1]; }
    get m13() { return this.array[2]; }
    get m21() { return this.array[3]; }
    get m22() { return this.array[4]; }
    get m23() { return this.array[5]; }
    get m31() { return this.array[6]; }
    get m32() { return this.array[7]; }
    get m33() { return this.array[8]; }
    set m11(m11) { this.array[0] = m11; }
    set m12(m12) { this.array[1] = m12; }
    set m13(m13) { this.array[2] = m13; }
    set m21(m21) { this.array[3] = m21; }
    set m22(m22) { this.array[4] = m22; }
    set m23(m23) { this.array[5] = m23; }
    set m31(m31) { this.array[6] = m31; }
    set m32(m32) { this.array[7] = m32; }
    set m33(m33) { this.array[8] = m33; }
    setTo(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.array.set([
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ]);
        return this;
    }
    get is_identity() {
        return check_if_a_3x3_matrix_is_the_identity_matrix(this.array);
    }
    copy(out = new Matrix3x3()) {
        return out.setFrom(this);
    }
    setToIdentity() {
        set_a_3x3_matrix_to_the_identity_matrix(this.array);
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
        return check_if_two_3x3_matrices_are_equal(this.array, other.array);
    }
    setToCrossProductOf(direction) {
        set_a_3x3_matrix_to_a_cross_product_matrix_for_a_3D_direction_in_place(this.array, direction.array);
        return this;
    }
    setToOuterProductOf(direction_a, direction_b) {
        set_a_3x3_matrix_to_an_outer_product_matrix_for_two_3D_directions_in_place(this.array, direction_a.array, direction_b.array);
        return this;
    }
    translate2DBy(x, y = 0, out) {
        if (out && !out.is(this)) {
            if (x)
                out.translation.array[0] = x + this.translation.array[0];
            if (y)
                out.translation.array[1] = y + this.translation.array[1];
            return out;
        }
        if (x)
            this.translation.array[0] += x;
        if (y)
            this.translation.array[1] += y;
        return this;
    }
    _add_number_in_place(num) {
        add_a_number_to_a_3x3_matrix_in_place(this.array, num);
    }
    _add_other_in_place(other) {
        add_a_3x3_matrix_to_another_3x3_matrix_in_place(this.array, other.array);
    }
    _add_number_to_out(num, out) {
        add_a_number_to_a_3x3_matrix_to_out(this.array, num, out.array);
    }
    _add_other_to_out(other, out) {
        add_a_3x3_matrix_to_another_3x3_matrix_to_out(this.array, other.array, out.array);
    }
    _sub_number_in_place(num) {
        subtract_a_number_from_a_3x3_matrix_in_place(this.array, num);
    }
    _sub_other_in_place(other) {
        subtract_a_3x3_matrix_from_another_3x3_matrix_in_place(this.array, other.array);
    }
    _sub_number_to_out(num, out) {
        subtract_a_number_from_a_3x3_matrix_to_out(this.array, num, out.array);
    }
    _sub_other_to_out(other, out) {
        subtract_a_3x3_matrix_from_another_3x3_matrix_to_out(this.array, other.array, out.array);
    }
    _mul_number_in_place(num) {
        multiply_a_3x3_matrix_by_a_number_in_place(this.array, num);
    }
    _mul_other_in_place(other) {
        multiply_a_3x3_matrix_by_another_3x3_matrix_in_place(this.array, other.array);
    }
    _mul_number_to_out(num, out) {
        multiply_a_3x3_matrix_by_a_number_to_out(this.array, num, out.array);
    }
    _mul_other_to_out(other, out) {
        multiply_a_3x3_matrix_by_another_3x3_matrix_to_out(this.array, other.array, out.array);
    }
    _div_number_in_place(num) {
        divide_a_3x3_matrix_by_a_number_in_place(this.array, num);
    }
    _div_number_to_out(num, out) {
        divide_a_3x3_matrix_by_a_number_to_out(this.array, num, out.array);
    }
    _transpose_to_out(out) {
        transpose_a_3x3_matrix_to_out(this.array, out.array);
    }
    _transpose_in_place() {
        transpose_a_3x3_matrix_in_place(this.array);
    }
    _invert_to_out(out) {
        invert_a_3x3_matrix_to_out(this.array, out.array);
    }
    _invert_in_place() {
        invert_a_3x3_matrix_in_place(this.array);
    }
    _set_rotation_around_x(sin, cos) {
        set_a_3x3_matrix_to_a_rotation_around_x_in_place(this.array, sin, cos);
    }
    _set_rotation_around_y(sin, cos) {
        set_a_3x3_matrix_to_a_rotation_around_y_in_place(this.array, sin, cos);
    }
    _set_rotation_around_z(sin, cos) {
        set_a_3x3_matrix_to_a_rotation_around_z_in_place(this.array, sin, cos);
    }
    _rotate_around_x_in_place(sin, cos) {
        rotate_a_3x3_matrix_around_x_in_place(this.array, sin, cos);
    }
    _rotate_around_y_in_place(sin, cos) {
        rotate_a_3x3_matrix_around_y_in_place(this.array, sin, cos);
    }
    _rotate_around_z_in_place(sin, cos) {
        rotate_a_3x3_matrix_around_z_in_place(this.array, sin, cos);
    }
    _rotate_around_x_to_out(sin, cos, out) {
        rotate_a_3x3_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }
    _rotate_around_y_to_out(sin, cos, out) {
        rotate_a_3x3_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }
    _rotate_around_z_to_out(sin, cos, out) {
        rotate_a_3x3_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }
    _inner_rotate_around_x_in_place(sin, cos) {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_x_in_place(this.array, sin, cos);
    }
    _inner_rotate_around_y_in_place(sin, cos) {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_y_in_place(this.array, sin, cos);
    }
    _inner_rotate_around_z_in_place(sin, cos) {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_z_in_place(this.array, sin, cos);
    }
    _inner_rotate_around_x_to_out(sin, cos, out) {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_x_to_out(this.array, sin, cos, out.array);
    }
    _inner_rotate_around_y_to_out(sin, cos, out) {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_y_to_out(this.array, sin, cos, out.array);
    }
    _inner_rotate_around_z_to_out(sin, cos, out) {
        rotate_a_2x2_portion_of_a_3x3_matrix_around_z_to_out(this.array, sin, cos, out.array);
    }
}
export const mat3 = (m11 = 0, m12 = m11, m13 = m11, m21 = m11, m22 = m11, m23 = m11, m31 = m11, m32 = m11, m33 = m11) => new Matrix3x3().setTo(m11, m12, m13, m21, m22, m23, m31, m32, m33);
//# sourceMappingURL=matrix3x3.js.map