import Matrix from "./matrix.js";
import { Direction2D } from "./direction.js";
import { MATRIX_2X2_ALLOCATOR } from "../memory/allocators.js";
import { add_a_2x2_matrix_to_another_2x2_matrix_in_place, add_a_2x2_matrix_to_another_2x2_matrix_to_out, add_a_number_to_a_2x2_matrix_in_place, add_a_number_to_a_2x2_matrix_to_out, check_if_a_2x2_matrix_is_the_identity_matrix, check_if_two_2x2_matrices_are_equal, divide_a_2x2_matrix_by_a_number_in_place, divide_a_2x2_matrix_by_a_number_to_out, invert_a_2x2_matrix_in_place, invert_a_2x2_matrix_to_out, multiply_a_2x2_matrix_by_a_number_in_place, multiply_a_2x2_matrix_by_a_number_to_out, multiply_a_2x2_matrix_by_another_2x2_matrix_in_place, multiply_a_2x2_matrix_by_another_2x2_matrix_to_out, rotate_a_2x2_matrix_in_place, rotate_a_2x2_matrix_to_out, set_a_2x2_matrix_to_a_rotation_matrix, set_a_2x2_matrix_to_the_identity_matrix, subtract_a_2x2_matrix_from_another_2x2_matrix_in_place, subtract_a_2x2_matrix_from_another_2x2_matrix_to_out, subtract_a_number_from_a_2x2_matrix_in_place, subtract_a_number_from_a_2x2_matrix_to_out, transpose_a_2x2_matrix_in_place, transpose_a_2x2_matrix_to_out } from "../math/mat2.js";
export default class Matrix2x2 extends Matrix {
    constructor(array) {
        super(array);
        this.x_axis = new Direction2D(this.array.subarray(0, 2));
        this.y_axis = new Direction2D(this.array.subarray(2, 4));
    }
    _getAllocator() { return MATRIX_2X2_ALLOCATOR; }
    set m11(m11) { this.array[0] = m11; }
    set m12(m12) { this.array[1] = m12; }
    set m21(m21) { this.array[2] = m21; }
    set m22(m22) { this.array[3] = m22; }
    get m11() { return this.array[0]; }
    get m12() { return this.array[1]; }
    get m21() { return this.array[2]; }
    get m22() { return this.array[3]; }
    get is_identity() {
        return check_if_a_2x2_matrix_is_the_identity_matrix(this.array);
    }
    setTo(m11, m12, m21, m22) {
        this.array.set([m11, m12, m21, m22]);
        return this;
    }
    copy(out = new Matrix2x2()) {
        return out.setFrom(this);
    }
    setToIdentity() {
        set_a_2x2_matrix_to_the_identity_matrix(this.array);
        return this;
    }
    setRotation(angle, reset = true) {
        if (reset)
            this.setToIdentity();
        set_a_2x2_matrix_to_a_rotation_matrix(this.array, Math.sin(angle), Math.cos(angle));
        return this;
    }
    rotateBy(angle, out) {
        if (out && !out.is(this)) {
            rotate_a_2x2_matrix_to_out(this.array, Math.sin(angle), Math.cos(angle), out.array);
            return out;
        }
        rotate_a_2x2_matrix_in_place(this.array, Math.sin(angle), Math.cos(angle));
        return this;
    }
    scaleBy(x, y = x, out) {
        if (out && !out.is(this)) {
            if (x !== 1)
                this.x_axis.mul(x, out.x_axis);
            if (y !== 1)
                this.y_axis.mul(y, out.y_axis);
            return out;
        }
        if (x !== 1)
            this.x_axis.imul(x);
        if (y !== 1)
            this.y_axis.imul(y);
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
        return check_if_two_2x2_matrices_are_equal(this.array, other.array);
    }
    _add_number_in_place(num) {
        add_a_number_to_a_2x2_matrix_in_place(this.array, num);
    }
    _add_other_in_place(other) {
        add_a_2x2_matrix_to_another_2x2_matrix_in_place(this.array, other.array);
    }
    _add_number_to_out(num, out) {
        add_a_number_to_a_2x2_matrix_to_out(this.array, num, out.array);
    }
    _add_other_to_out(other, out) {
        add_a_2x2_matrix_to_another_2x2_matrix_to_out(this.array, other.array, out.array);
    }
    _sub_number_in_place(num) {
        subtract_a_number_from_a_2x2_matrix_in_place(this.array, num);
    }
    _sub_other_in_place(other) {
        subtract_a_2x2_matrix_from_another_2x2_matrix_in_place(this.array, other.array);
    }
    _sub_number_to_out(num, out) {
        subtract_a_number_from_a_2x2_matrix_to_out(this.array, num, out.array);
    }
    _sub_other_to_out(other, out) {
        subtract_a_2x2_matrix_from_another_2x2_matrix_to_out(this.array, other.array, out.array);
    }
    _mul_number_in_place(num) {
        multiply_a_2x2_matrix_by_a_number_in_place(this.array, num);
    }
    _mul_other_in_place(other) {
        multiply_a_2x2_matrix_by_another_2x2_matrix_in_place(this.array, other.array);
    }
    _mul_number_to_out(num, out) {
        multiply_a_2x2_matrix_by_a_number_to_out(this.array, num, out.array);
    }
    _mul_other_to_out(other, out) {
        multiply_a_2x2_matrix_by_another_2x2_matrix_to_out(this.array, other.array, out.array);
    }
    _div_number_in_place(num) {
        divide_a_2x2_matrix_by_a_number_in_place(this.array, num);
    }
    _div_number_to_out(num, out) {
        divide_a_2x2_matrix_by_a_number_to_out(this.array, num, out.array);
    }
    _transpose_to_out(out) {
        transpose_a_2x2_matrix_to_out(this.array, out.array);
    }
    _transpose_in_place() {
        transpose_a_2x2_matrix_in_place(this.array);
    }
    _invert_to_out(out) {
        invert_a_2x2_matrix_to_out(this.array, out.array);
    }
    _invert_in_place() {
        invert_a_2x2_matrix_in_place(this.array);
    }
}
export const mat2 = (m11 = 0, m12 = m11, m21 = m11, m22 = m11) => new Matrix2x2().setTo(m11, m12, m21, m22);
//# sourceMappingURL=matrix2x2.js.map