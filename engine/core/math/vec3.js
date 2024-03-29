const sqrt = Math.sqrt;
export const check_if_two_3D_vectors_are_equal = (a, b) => a[0].toFixed(3) === b[0].toFixed(3) &&
    a[1].toFixed(3) === b[1].toFixed(3) &&
    a[2].toFixed(3) === b[2].toFixed(3);
export const linearly_interpolate_from_a_3D_vector_to_another_3D_vector_to_out = (a, b, t, o) => {
    o[0] = (1 - t) * a[0] + t * (b[0]);
    o[1] = (1 - t) * a[1] + t * (b[1]);
    o[2] = (1 - t) * a[2] + t * (b[2]);
};
export const add_a_3D_vector_to_another_3D_vector_to_out = (a, b, o) => {
    o[0] = a[0] + b[0];
    o[1] = a[1] + b[1];
    o[2] = a[2] + b[2];
};
export const add_a_3D_vector_to_another_3D_vector_in_place = (a, b) => {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
};
export const add_a_number_to_a_3D_vector_to_out = (a, b, o) => {
    o[0] = a[0] + b;
    o[1] = a[1] + b;
    o[2] = a[2] + b;
};
export const add_a_number_to_a_3D_vector_in_place = (a, b) => {
    a[0] += b;
    a[1] += b;
    a[2] += b;
};
export const subtract_a_3D_vector_from_another_3D_vector_to_out = (a, b, o) => {
    o[0] = a[0] - b[0];
    o[1] = a[1] - b[1];
    o[2] = a[2] - b[2];
};
export const subtract_a_3D_vector_from_another_3D_vector_in_place = (a, b) => {
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
};
export const subtract_a_number_from_a_3D_vector_to_out = (a, b, o) => {
    o[0] = a[0] - b;
    o[1] = a[1] - b;
    o[2] = a[2] - b;
};
export const subtract_a_number_from_a_3D_vector_in_place = (a, b) => {
    a[0] -= b;
    a[1] -= b;
    a[2] -= b;
};
export const multiply_a_3D_vector_by_another_3D_vector_to_out = (a, b, o) => {
    o[0] = a[0] * b[0];
    o[1] = a[1] * b[1];
    o[2] = a[2] * b[2];
};
export const multiply_a_3D_vector_by_another_3D_vector_in_place = (a, b) => {
    a[0] *= b[0];
    a[1] *= b[1];
    a[2] *= b[2];
};
export const divide_a_3D_vector_by_a_number_to_out = (a, b, o) => {
    o[0] = a[0] / b;
    o[1] = a[1] / b;
    o[2] = a[2] / b;
};
export const divide_a_3D_vector_by_a_number_in_place = (a, b) => {
    a[0] /= b;
    a[1] /= b;
    a[2] /= b;
};
export const multiply_a_3D_vector_by_a_number_to_out = (a, b, o) => {
    o[0] = a[0] * b;
    o[1] = a[1] * b;
    o[2] = a[2] * b;
};
export const multiply_a_3D_vector_by_a_number_and_add_another_vector_to_out = (a, b, c, o) => {
    o[0] = a[0] * b + c[0];
    o[1] = a[1] * b + c[1];
    o[2] = a[2] * b + c[2];
};
export const multiply_a_3D_vector_by_a_number_in_place = (a, b) => {
    a[0] *= b;
    a[1] *= b;
    a[2] *= b;
};
export const reflect_a_3D_vector_around_a_3D_direction_to_out = (a, b, o) => {
    const t_n = (a[0] * b[0] +
        a[1] * b[1] +
        a[2] * b[2]) * 2;
    o[0] = b[0] * t_n - a[0];
    o[1] = b[1] * t_n - a[1];
    o[2] = b[2] * t_n - a[2];
};
export const reflect_a_3D_vector_around_a_3D_direction_in_place = (a, b) => {
    const t_n = (a[0] * b[0] +
        a[1] * b[1] +
        a[2] * b[2]) * 2;
    a[0] = b[0] * t_n - a[0];
    a[1] = b[1] * t_n - a[1];
    a[2] = b[2] * t_n - a[2];
};
export const reflect_a_3D_vector_around_a_3D_direction_with_dot_to_out = (a, b, dot, o) => {
    dot *= -2;
    o[0] = b[0] * dot + a[0];
    o[1] = b[1] * dot + a[1];
    o[2] = b[2] * dot + a[2];
};
export const reflect_a_3D_vector_around_a_3D_direction_with_dot_in_place = (a, b, dot) => {
    dot *= -2;
    a[0] += b[0] * dot;
    a[1] += b[1] * dot;
    a[2] += b[2] * dot;
};
export const multiply_a_3D_vector_by_a_3x3_matrix_in_place = (a, m) => {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    a[0] = x * m[0] + y * m[3] + z * m[6];
    a[1] = x * m[1] + y * m[4] + z * m[7];
    a[2] = x * m[2] + y * m[5] + z * m[8];
};
export const multiply_a_3D_vector_by_a_3x3_matrix_to_out = (a, m, o) => {
    o[0] = a[0] * m[0] + a[1] * m[3] + a[2] * m[6];
    o[1] = a[0] * m[1] + a[1] * m[4] + a[2] * m[7];
    o[2] = a[0] * m[2] + a[1] * m[5] + a[2] * m[8];
};
// DIR:
// ====
export const negate_a_3D_direction_to_out = (a, o) => {
    o[0] = -a[0];
    o[1] = -a[1];
    o[2] = -a[2];
};
export const negate_a_3D_direction_in_place = (a) => {
    a[0] = -a[0];
    a[1] = -a[1];
    a[2] = -a[2];
};
export const compute_the_length_of_a_3D_direction = (a) => sqrt((a[0] ** 2 +
    a[1] ** 2 +
    a[2] ** 2));
export const square_the_length_of_a_3D_direction = (a) => a[0] ** 2 +
    a[1] ** 2 +
    a[2] ** 2;
export const normalize_a_3D_direction_to_out = (a, o) => {
    let t_n = a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
    if (t_n === 1) {
        o[0] = a[0];
        o[1] = a[1];
        o[2] = a[2];
    }
    else {
        t_n = 1 / sqrt(t_n);
        o[0] = a[0] * t_n;
        o[1] = a[1] * t_n;
        o[2] = a[2] * t_n;
    }
};
export const normalize_a_3D_direction_in_place = (a) => {
    let t_n = a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
    if (t_n === 1)
        return;
    t_n = 1 / sqrt(t_n);
    a[0] *= t_n;
    a[1] *= t_n;
    a[2] *= t_n;
};
export const dot_a_3D_direction_with_another_3D_direction = (a, b) => a[0] * b[0] +
    a[1] * b[1] +
    a[2] * b[2];
export const dot_a_3D_direction_with_a_direction_between_two_positions = (v, a, b) => v[0] * (b[0] - a[0]) +
    v[1] * (b[1] - a[1]) +
    v[2] * (b[2] - a[2]);
export const cross_a_3D_direction_with_another_3D_direction_to_out = (a, b, o) => {
    o[0] = a[1] * b[2] - a[2] * b[1];
    o[1] = a[2] * b[0] - a[0] * b[2];
    o[2] = a[0] * b[1] - a[1] * b[0];
};
export const cross_a_3D_direction_with_another_3D_direction_in_place = (a, b) => {
    const t_x = a[0];
    const t_y = a[1];
    const t_z = a[2];
    a[0] = t_y * b[2] - t_z * b[1];
    a[1] = t_z * b[0] - t_x * b[2];
    a[2] = t_x * b[1] - t_y * b[0];
};
export const multiply_a_3D_direction_by_a_4x4_matrix_in_place = (a, m) => {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    a[0] = x * m[0] + y * m[4] + z * m[8];
    a[1] = x * m[1] + y * m[5] + z * m[9];
    a[2] = x * m[2] + y * m[6] + z * m[10];
};
export const multiply_a_3D_direction_by_a_4x4_matrix_to_out3 = (a, m, o) => {
    o[0] = a[0] * m[0] + a[1] * m[4] + a[2] * m[8];
    o[1] = a[0] * m[1] + a[1] * m[5] + a[2] * m[9];
    o[2] = a[0] * m[2] + a[1] * m[6] + a[2] * m[10];
};
export const multiply_a_3D_direction_by_a_4x4_matrix_to_out4 = (a, m, o) => {
    o[0] = a[0] * m[0] + a[1] * m[4] + a[2] * m[8];
    o[1] = a[0] * m[1] + a[1] * m[5] + a[2] * m[9];
    o[2] = a[0] * m[2] + a[1] * m[6] + a[2] * m[10];
    o[3] = a[0] * m[3] + a[1] * m[7] + a[2] * m[11];
};
// POS:
// ====
export const compute_the_distance_from_a_3D_position_to_another_3D_position = (a, b) => sqrt(((b[0] - a[0]) ** 2 +
    (b[1] - a[1]) ** 2 +
    (b[2] - a[2]) ** 2));
export const square_the_distance_from_a_3D_positions_to_another_3D_position = (a, b) => ((b[0] - a[0]) ** 2 +
    (b[1] - a[1]) ** 2 +
    (b[2] - a[2]) ** 2);
export const multiply_a_3D_position_by_a_4x4_matrix_in_place = (a, m) => {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    a[0] = x * m[0] + y * m[4] + z * m[8] + m[12];
    a[1] = x * m[1] + y * m[5] + z * m[9] + m[13];
    a[2] = x * m[2] + y * m[6] + z * m[10] + m[14];
};
export const multiply_a_3D_position_by_a_4x4_matrix_to_out3 = (a, m, o) => {
    o[0] = a[0] * m[0] + a[1] * m[4] + a[2] * m[8] + m[12];
    o[1] = a[0] * m[1] + a[1] * m[5] + a[2] * m[9] + m[13];
    o[2] = a[0] * m[2] + a[1] * m[6] + a[2] * m[10] + m[14];
};
export const multiply_a_3D_position_by_a_4x4_matrix_to_out4 = (a, m, o) => {
    o[0] = a[0] * m[0] + a[1] * m[4] + a[2] * m[8] + m[12];
    o[1] = a[0] * m[1] + a[1] * m[5] + a[2] * m[9] + m[13];
    o[2] = a[0] * m[2] + a[1] * m[6] + a[2] * m[10] + m[14];
    o[3] = a[0] * m[3] + a[1] * m[7] + a[2] * m[11] + m[15];
};
// ALL:
// ====
export const multiply_all_3D_vectors_by_a_3x3_matrix_in_place = (vectors, m, start = 0, end = vectors.length) => {
    let v;
    let x, y, z;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        x = v[0];
        y = v[1];
        z = v[2];
        v[0] = x * m[0] + y * m[3] + z * m[6];
        v[1] = x * m[1] + y * m[4] + z * m[7];
        v[2] = x * m[2] + y * m[5] + z * m[8];
    }
};
export const multiply_all_3D_vectors_by_a_3x3_matrix_to_out = (vectors, m, outs, start = 0, end = vectors.length) => {
    let o, v;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        o = outs[i];
        o[0] = v[0] * m[0] + v[1] * m[3] + v[2] * m[6];
        o[1] = v[0] * m[1] + v[1] * m[4] + v[2] * m[7];
        o[2] = v[0] * m[2] + v[1] * m[5] + v[2] * m[8];
    }
};
// SOME:
// =====
export const multiply_some_3D_vectors_by_a_3x3_matrix_in_place = (vectors, m, include, start = 0, end = vectors.length) => {
    let x, y, z;
    let v;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            x = v[0];
            y = v[1];
            z = v[2];
            v[0] = x * m[0] + y * m[3] + z * m[6];
            v[1] = x * m[1] + y * m[4] + z * m[7];
            v[2] = x * m[2] + y * m[5] + z * m[8];
        }
};
export const multiply_some_3D_vectors_by_a_3x3_matrix_to_out = (vectors, m, include, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++)
        if (include[i]) {
            o = outs[i];
            v = vectors[i];
            o[0] = v[0] * m[0] + v[1] * m[3] + v[2] * m[6];
            o[1] = v[0] * m[1] + v[1] * m[4] + v[2] * m[7];
            o[2] = v[0] * m[2] + v[1] * m[5] + v[2] * m[8];
        }
};
// ALL DIR:
// ========
export const multiply_all_3D_directions_by_a_4x4_matrix_in_place = (vectors, m, start = 0, end = vectors.length) => {
    let v;
    let x, y, z;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        x = v[0];
        y = v[1];
        z = v[2];
        v[0] = x * m[0] + y * m[4] + z * m[8];
        v[1] = x * m[1] + y * m[5] + z * m[9];
        v[2] = x * m[2] + y * m[6] + z * m[10];
    }
};
export const multiply_all_3D_directions_by_a_4x4_matrix_to_out3 = (vectors, m, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++) {
        o = outs[i];
        v = vectors[i];
        o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
        o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
        o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
    }
};
export const multiply_all_3D_directions_by_a_4x4_matrix_to_out4 = (vectors, m, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        o = outs[i];
        o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
        o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
        o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
        o[3] = v[0] * m[3] + v[1] * m[7] + v[2] * m[11];
    }
};
export const normalize_all_3D_directions_in_place = (vectors, start = 0, end = vectors.length) => {
    let v;
    let t_n;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        t_n = v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
        if (t_n === 1)
            continue;
        t_n = 1 / sqrt(t_n);
        v[0] *= t_n;
        v[1] *= t_n;
        v[2] *= t_n;
    }
};
// SOME DIR:
// =========
export const multiply_some_3D_directions_by_a_4x4_matrix_in_place = (vectors, m, include, start = 0, end = vectors.length) => {
    let x, y, z;
    let v;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            x = v[0];
            y = v[1];
            z = v[2];
            v[0] = x * m[0] + y * m[4] + z * m[8];
            v[1] = x * m[1] + y * m[5] + z * m[9];
            v[2] = x * m[2] + y * m[6] + z * m[10];
        }
};
export const multiply_some_3D_directions_by_a_4x4_matrix_to_out3 = (vectors, m, include, outs, start = 0, end = vectors.length) => {
    let o, v;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            o = outs[i];
            o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
            o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
            o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
        }
};
export const multiply_some_3D_directions_by_a_4x4_matrix_to_out4 = (vectors, m, include, outs, start = 0, end = vectors.length) => {
    let o, v;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            o = outs[i];
            o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
            o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
            o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
            o[3] = v[0] * m[3] + v[1] * m[7] + v[2] * m[11];
        }
};
export const normalize_some_3D_directions_in_place = (vectors, include, start = 0, end = vectors.length) => {
    let v;
    let t_n;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            t_n = v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
            if (t_n === 1)
                continue;
            t_n = 1 / sqrt(t_n);
            v[0] *= t_n;
            v[1] *= t_n;
            v[2] *= t_n;
        }
};
// All POS:
// ========
export const multiply_all_3D_positions_by_a_4x4_matrix_in_place = (vectors, m, start = 0, end = vectors.length) => {
    let v;
    let x, y, z;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        x = v[0];
        y = v[1];
        z = v[2];
        v[0] = x * m[0] + y * m[4] + z * m[8] + m[12];
        v[1] = x * m[1] + y * m[5] + z * m[9] + m[13];
        v[2] = x * m[2] + y * m[6] + z * m[10] + m[14];
    }
};
export const multiply_all_3D_positions_by_a_4x4_matrix_to_out3 = (vectors, m, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        o = outs[i];
        o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + m[12];
        o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + m[13];
        o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + m[14];
    }
};
export const multiply_all_3D_positions_by_a_4x4_matrix_to_out4 = (vectors, m, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        o = outs[i];
        o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + m[12];
        o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + m[13];
        o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + m[14];
        o[3] = v[0] * m[3] + v[1] * m[7] + v[2] * m[11] + m[15];
    }
};
// SOME POS:
// =========
export const multiply_some_3D_positions_by_a_4x4_matrix_in_place = (vectors, m, include, start = 0, end = vectors.length) => {
    let v;
    let x, y, z;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            x = v[0];
            y = v[1];
            z = v[2];
            v[0] = x * m[0] + y * m[4] + z * m[8] + m[12];
            v[1] = x * m[1] + y * m[5] + z * m[9] + m[13];
            v[2] = x * m[2] + y * m[6] + z * m[10] + m[14];
        }
};
export const multiply_some_3D_positions_by_a_4x4_matrix_to_out3 = (vectors, m, include, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            o = outs[i];
            o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + m[12];
            o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + m[13];
            o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + m[14];
        }
};
export const multiply_some_3D_positions_by_a_4x4_matrix_to_out4 = (vectors, m, include, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            o = outs[i];
            o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + m[12];
            o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + m[13];
            o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + m[14];
            o[3] = v[0] * m[3] + v[1] * m[7] + v[2] * m[11] + m[15];
        }
};
//# sourceMappingURL=vec3.js.map