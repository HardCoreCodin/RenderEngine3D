import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import Vector4D from "./vector4D.js";
import Matrix3x3 from "./matrix2x2.js";
import { compute_the_distance_from_a_2D_position_to_another_2D_position, multiply_a_2D_vector_by_a_2x2_matrix_in_place, multiply_a_2D_vector_by_a_2x2_matrix_to_out, square_the_distance_from_a_2D_positions_to_another_2D_position, subtract_a_2D_vector_from_another_2D_vector_to_out } from "../core/math/vec2.js";
import { compute_the_distance_from_a_3D_position_to_another_3D_position, multiply_a_3D_position_by_a_4x4_matrix_in_place, multiply_a_3D_position_by_a_4x4_matrix_to_out3, multiply_a_3D_position_by_a_4x4_matrix_to_out4, multiply_a_3D_vector_by_a_3x3_matrix_in_place, multiply_a_3D_vector_by_a_3x3_matrix_to_out, square_the_distance_from_a_3D_positions_to_another_3D_position, subtract_a_3D_vector_from_another_3D_vector_to_out } from "../core/math/vec3.js";
import { compute_the_distance_from_a_4D_position_to_another_4D_position, multiply_a_4D_vector_by_a_4x4_matrix_in_place, multiply_a_4D_vector_by_a_4x4_matrix_to_out, square_the_distance_from_a_4D_positions_to_another_4D_position, subtract_a_4D_vector_from_another_4D_vector_to_out } from "../core/math/vec4.js";
import { I32_2D_ALLOCATOR, VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR } from "../core/memory/allocators.js";
export class Position2Di extends Vector2D {
    _getAllocator() { return I32_2D_ALLOCATOR; }
    copy(out = new Position2Di()) { return out.setFrom(this); }
}
export class Position2D extends Vector2D {
    _getAllocator() { return VECTOR_2D_ALLOCATOR; }
    copy(out = new Position2D()) { return out.setFrom(this); }
    distanceTo(other) {
        return compute_the_distance_from_a_2D_position_to_another_2D_position(this.array, other.array);
    }
    distanceSquaredTo(other) {
        return square_the_distance_from_a_2D_positions_to_another_2D_position(this.array, other.array);
    }
    to(other, out) {
        subtract_a_2D_vector_from_another_2D_vector_to_out(other.array, this.array, out.array);
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
export class Position3D extends Vector3D {
    _getAllocator() { return VECTOR_3D_ALLOCATOR; }
    copy(out = new Position3D()) { return out.setFrom(this); }
    distanceTo(other) {
        return compute_the_distance_from_a_3D_position_to_another_3D_position(this.array, other.array);
    }
    distanceSquaredTo(other) {
        return square_the_distance_from_a_3D_positions_to_another_3D_position(this.array, other.array);
    }
    to(other, out) {
        subtract_a_3D_vector_from_another_3D_vector_to_out(other.array, this.array, out.array);
        return out;
    }
    imatmul(matrix) {
        if (matrix instanceof Matrix3x3)
            multiply_a_3D_vector_by_a_3x3_matrix_in_place(this.array, matrix.array);
        else
            multiply_a_3D_position_by_a_4x4_matrix_in_place(this.array, matrix.array);
        return this;
    }
    matmul(matrix, out) {
        if (out instanceof Position3D) {
            if (matrix instanceof Matrix3x3)
                multiply_a_3D_vector_by_a_3x3_matrix_to_out(this.array, matrix.array, out.array);
            else
                multiply_a_3D_position_by_a_4x4_matrix_to_out3(this.array, matrix.array, out.array);
        }
        else
            multiply_a_3D_position_by_a_4x4_matrix_to_out4(this.array, matrix.array, out.array);
        return out;
    }
    get xy() { return new Position2D(this.array.subarray(0, 2)); }
    get yz() { return new Position2D(this.array.subarray(1, 3)); }
    set xy(other) { this.array.set(other.array); }
    set yz(other) { this.array.set(other.array, 1); }
}
export class Position4D extends Vector4D {
    _getAllocator() { return VECTOR_4D_ALLOCATOR; }
    copy(out = new Position4D()) { return out.setFrom(this); }
    distanceTo(other) {
        return compute_the_distance_from_a_4D_position_to_another_4D_position(this.array, other.array);
    }
    distanceSquaredTo(other) {
        return square_the_distance_from_a_4D_positions_to_another_4D_position(this.array, other.array);
    }
    to(other, out) {
        subtract_a_4D_vector_from_another_4D_vector_to_out(other.array, this.array, out.array);
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
    get xy() { return new Position2D(this.array.subarray(0, 2)); }
    get yz() { return new Position2D(this.array.subarray(1, 3)); }
    get zw() { return new Position2D(this.array.subarray(2, 4)); }
    set xy(other) { this.array.set(other.array); }
    set yz(other) { this.array.set(other.array, 1); }
    set zw(other) { this.array.set(other.array, 2); }
    get xyz() { return new Position3D(this.array.subarray(0, 3)); }
    get yzw() { return new Position3D(this.array.subarray(1, 4)); }
    set xyz(other) { this.array.set(other.array); }
    set yzw(other) { this.array.set(other.array, 1); }
}
export const pos2i = (x = 0, y = x) => new Position2Di().setTo(x, y);
export const pos2 = (x = 0, y = x) => new Position2D().setTo(x, y);
export const pos3 = (x = 0, y = x, z = x) => new Position3D().setTo(x, y, z);
export const pos4 = (x = 0, y = x, z = x, w = x) => new Position4D().setTo(x, y, z, w);
//# sourceMappingURL=position.js.map