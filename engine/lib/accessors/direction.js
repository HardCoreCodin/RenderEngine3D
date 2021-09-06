import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import Matrix3x3 from "./matrix2x2.js";
import { compute_the_length_of_a_2D_direction, dot_a_2D_direction_with_another_2D_direction, multiply_a_2D_vector_by_a_2x2_matrix_in_place, multiply_a_2D_vector_by_a_2x2_matrix_to_out, negate_a_2D_direction_in_place, negate_a_2D_direction_to_out, normalize_a_2D_direction_in_place, normalize_a_2D_direction_to_out, reflect_a_2D_vector_around_a_2D_direction_in_place, reflect_a_2D_vector_around_a_2D_direction_to_out, square_the_length_of_a_2D_direction } from "../math/vec2.js";
import { compute_the_length_of_a_3D_direction, cross_a_3D_direction_with_another_3D_direction_in_place, cross_a_3D_direction_with_another_3D_direction_to_out, dot_a_3D_direction_with_another_3D_direction, multiply_a_3D_direction_by_a_4x4_matrix_in_place, multiply_a_3D_direction_by_a_4x4_matrix_to_out3, multiply_a_3D_vector_by_a_3x3_matrix_in_place, multiply_a_3D_vector_by_a_3x3_matrix_to_out, multiply_a_3D_direction_by_a_4x4_matrix_to_out4, negate_a_3D_direction_in_place, negate_a_3D_direction_to_out, normalize_a_3D_direction_in_place, normalize_a_3D_direction_to_out, reflect_a_3D_vector_around_a_3D_direction_in_place, reflect_a_3D_vector_around_a_3D_direction_to_out, square_the_length_of_a_3D_direction } from "../math/vec3.js";
import { compute_the_length_of_a_4D_direction, dot_a_4D_direction_with_another_4D_direction, multiply_a_4D_vector_by_a_4x4_matrix_in_place, multiply_a_4D_vector_by_a_4x4_matrix_to_out, negate_a_4D_direction_in_place, negate_a_4D_direction_to_out, normalize_a_4D_direction_in_place, normalize_a_4D_direction_to_out, reflect_a_4D_vector_around_a_4D_direction_in_place, reflect_a_4D_vector_around_a_4D_direction_to_out, square_the_length_of_a_4D_direction } from "../math/vec4.js";
export class Direction2D extends Vector2D {
    copy(out = new Direction2D()) { return out.setFrom(this); }
    get is_normalized() {
        return this.length_squared === 1;
    }
    dot(other) {
        return dot_a_2D_direction_with_another_2D_direction(this.array, other.array);
    }
    get length() {
        return compute_the_length_of_a_2D_direction(this.array);
    }
    get length_squared() {
        return square_the_length_of_a_2D_direction(this.array);
    }
    inormalize() {
        normalize_a_2D_direction_in_place(this.array);
        return this;
    }
    normalize(out) {
        if (out.is(this))
            return this.inormalize();
        normalize_a_2D_direction_to_out(this.array, out.array);
        return out;
    }
    ireflect(other) {
        reflect_a_2D_vector_around_a_2D_direction_in_place(this.array, other.array);
        return this;
    }
    reflect(other, out) {
        if (out.is(this))
            return this.ireflect(other);
        reflect_a_2D_vector_around_a_2D_direction_to_out(this.array, other.array, out.array);
        return out;
    }
    inegate() {
        negate_a_2D_direction_in_place(this.array);
        return this;
    }
    negate(out) {
        if (out.is(this))
            return this.inegate();
        negate_a_2D_direction_to_out(this.array, out.array);
        return out;
    }
    imatmul(matrix) {
        multiply_a_2D_vector_by_a_2x2_matrix_in_place(this.array, matrix.array);
        return this;
    }
    matmul(matrix, out) {
        multiply_a_2D_vector_by_a_2x2_matrix_to_out(this.array, matrix.array, out.array);
        return out;
    }
}
export class Direction3D extends Vector3D {
    copy(out = new Direction3D()) { return out.setFrom(this); }
    get is_normalized() {
        return this.length_squared === 1;
    }
    dot(other) {
        return dot_a_3D_direction_with_another_3D_direction(this.array, other.array);
    }
    get length() {
        return compute_the_length_of_a_3D_direction(this.array);
    }
    get length_squared() {
        return square_the_length_of_a_3D_direction(this.array);
    }
    inormalize() {
        normalize_a_3D_direction_in_place(this.array);
        return this;
    }
    normalize(out) {
        if (out.is(this))
            return this.inormalize();
        normalize_a_3D_direction_to_out(this.array, out.array);
        return out;
    }
    ireflect(other) {
        reflect_a_3D_vector_around_a_3D_direction_in_place(this.array, other.array);
        return this;
    }
    reflect(other, out) {
        if (out.is(this))
            return this.ireflect(other);
        reflect_a_3D_vector_around_a_3D_direction_to_out(this.array, other.array, out.array);
        return out;
    }
    inegate() {
        negate_a_3D_direction_in_place(this.array);
        return this;
    }
    negate(out) {
        if (out.is(this))
            return this.inegate();
        negate_a_3D_direction_to_out(this.array, out.array);
        return out;
    }
    icross(other) {
        cross_a_3D_direction_with_another_3D_direction_in_place(this.array, other.array);
        return this;
    }
    ;
    cross(other, out) {
        if (out.is(this))
            return this.icross(other);
        cross_a_3D_direction_with_another_3D_direction_to_out(this.array, other.array, out.array);
        return out;
    }
    imatmul(matrix) {
        if (matrix instanceof Matrix3x3)
            multiply_a_3D_vector_by_a_3x3_matrix_in_place(this.array, matrix.array);
        else
            multiply_a_3D_direction_by_a_4x4_matrix_in_place(this.array, matrix.array);
        return this;
    }
    matmul(matrix, out) {
        if (out instanceof Direction3D) {
            if (matrix instanceof Matrix3x3) {
                multiply_a_3D_vector_by_a_3x3_matrix_to_out(this.array, matrix.array, out.array);
            }
            else {
                multiply_a_3D_direction_by_a_4x4_matrix_to_out3(this.array, matrix.array, out.array);
            }
        }
        else
            multiply_a_3D_direction_by_a_4x4_matrix_to_out4(this.array, matrix.array, out.array);
        return out;
    }
    get xy() { return new Direction2D(this.array.subarray(0, 2)); }
    get yz() { return new Direction2D(this.array.subarray(1, 3)); }
    set xy(other) { this.array.set(other.array); }
    set yz(other) { this.array.set(other.array, 1); }
}
export class Direction4D extends Vector4D {
    copy(out = new Direction4D()) { return out.setFrom(this); }
    get is_normalized() {
        return this.length_squared === 1;
    }
    dot(other) {
        return dot_a_4D_direction_with_another_4D_direction(this.array, other.array);
    }
    get length() {
        return compute_the_length_of_a_4D_direction(this.array);
    }
    get length_squared() {
        return square_the_length_of_a_4D_direction(this.array);
    }
    inormalize() {
        normalize_a_4D_direction_in_place(this.array);
        return this;
    }
    normalize(out) {
        if (out.is(this))
            return this.inormalize();
        normalize_a_4D_direction_to_out(this.array, out.array);
        return out;
    }
    ireflect(other) {
        reflect_a_4D_vector_around_a_4D_direction_in_place(this.array, other.array);
        return this;
    }
    reflect(other, out) {
        if (out.is(this))
            return this.ireflect(other);
        reflect_a_4D_vector_around_a_4D_direction_to_out(this.array, other.array, out.array);
        return out;
    }
    inegate() {
        negate_a_4D_direction_in_place(this.array);
        return this;
    }
    negate(out) {
        if (out.is(this))
            return this.inegate();
        negate_a_4D_direction_to_out(this.array, out.array);
        return out;
    }
    icross(other) {
        cross_a_3D_direction_with_another_3D_direction_in_place(this.array, other.array);
        return this;
    }
    cross(other, out) {
        if (out.is(this))
            return this.icross(other);
        cross_a_3D_direction_with_another_3D_direction_to_out(this.array, other.array, out.array);
        return out;
    }
    imatmul(matrix) {
        multiply_a_4D_vector_by_a_4x4_matrix_in_place(this.array, matrix.array);
        return this;
    }
    matmul(matrix, out) {
        multiply_a_4D_vector_by_a_4x4_matrix_to_out(this.array, matrix.array, out.array);
        return out;
    }
    get xy() { return new Direction2D(this.array.subarray(0, 2)); }
    get yz() { return new Direction2D(this.array.subarray(1, 3)); }
    get zw() { return new Direction2D(this.array.subarray(2, 4)); }
    set xy(other) { this.array.set(other.array); }
    set yz(other) { this.array.set(other.array, 1); }
    set zw(other) { this.array.set(other.array, 2); }
    get xyz() { return new Direction3D(this.array.subarray(0, 3)); }
    get yzw() { return new Direction3D(this.array.subarray(1, 4)); }
    set xyz(other) { this.array.set(other.array); }
    set yzw(other) { this.array.set(other.array, 1); }
}
export const dir2 = (x = 0, y = x) => new Direction2D().setTo(x, y);
export const dir3 = (x = 0, y = x, z = x) => new Direction3D().setTo(x, y, z);
export const dir4 = (x = 0, y = x, z = x, w = x) => new Direction4D().setTo(x, y, z, w);
//# sourceMappingURL=direction.js.map