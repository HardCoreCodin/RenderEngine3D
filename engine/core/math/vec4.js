export const check_if_two_4D_vectros_are_equal = (a, b) => a[0].toFixed(3) === b[0].toFixed(3) &&
    a[1].toFixed(3) === b[1].toFixed(3) &&
    a[2].toFixed(3) === b[2].toFixed(3) &&
    a[3].toFixed(3) === b[3].toFixed(3);
export const negate_a_4D_direction_to_out = (a, o) => {
    o[0] = -a[0];
    o[1] = -a[1];
    o[2] = -a[2];
    o[3] = -a[3];
};
export const negate_a_4D_direction_in_place = (a) => {
    a[0] = -a[0];
    a[1] = -a[1];
    a[2] = -a[2];
    a[3] = -a[3];
};
export const compute_the_length_of_a_4D_direction = (a) => Math.sqrt((a[0] ** 2 +
    a[1] ** 2 +
    a[2] ** 2 +
    a[3] ** 2));
export const compute_the_distance_from_a_4D_position_to_another_4D_position = (a, b) => Math.sqrt(((b[0] - a[0]) ** 2 +
    (b[1] - a[1]) ** 2 +
    (b[2] - a[2]) ** 2 +
    (b[3] - a[3]) ** 2));
export const square_the_length_of_a_4D_direction = (a) => a[0] ** 2 +
    a[1] ** 2 +
    a[2] ** 2 +
    a[3] ** 2;
export const square_the_distance_from_a_4D_positions_to_another_4D_position = (a, b) => ((b[0] - a[0]) ** 2 +
    (b[1] - a[1]) ** 2 +
    (b[2] - a[2]) ** 2 +
    (b[3] - a[3]) ** 2);
export const linearly_interpolate_from_a_4D_vector_to_another_4D_vector_to_out = (a, b, t, o) => {
    o[0] = (1 - t) * a[0] + t * (b[0]);
    o[1] = (1 - t) * a[1] + t * (b[1]);
    o[2] = (1 - t) * a[2] + t * (b[2]);
    o[3] = (1 - t) * a[3] + t * (b[3]);
};
export const add_a_4D_vector_to_another_4D_vector_to_out = (a, b, o) => {
    o[0] = a[0] + b[0];
    o[1] = a[1] + b[1];
    o[2] = a[2] + b[2];
    o[3] = a[3] + b[3];
};
export const add_a_4D_vector_to_another_4D_vector_in_place = (a, b) => {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
    a[3] += b[3];
};
export const add_a_number_to_a_4D_vector_to_out = (a, b, o) => {
    o[0] = a[0] + b;
    o[1] = a[1] + b;
    o[2] = a[2] + b;
    o[3] = a[3] + b;
};
export const add_a_number_to_a_4D_vector_in_place = (a, b) => {
    a[0] += b;
    a[1] += b;
    a[2] += b;
    a[3] += b;
};
export const subtract_a_4D_vector_from_another_4D_vector_to_out = (a, b, o) => {
    o[0] = a[0] - b[0];
    o[1] = a[1] - b[1];
    o[2] = a[2] - b[2];
    o[3] = a[3] - b[3];
};
export const subtract_a_4D_vector_from_another_4D_vector_in_place = (a, b) => {
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
    a[3] -= b[3];
};
export const subtract_a_number_from_a_4D_vector_to_out = (a, b, o) => {
    o[0] = a[0] - b;
    o[1] = a[1] - b;
    o[2] = a[2] - b;
    o[3] = a[3] - b;
};
export const subtract_a_number_from_a_4D_vector_in_place = (a, b) => {
    a[0] -= b;
    a[1] -= b;
    a[2] -= b;
    a[3] -= b;
};
export const multiply_a_4D_vector_by_another_4D_vector_to_out = (a, b, o) => {
    o[0] = a[0] * b[0];
    o[1] = a[1] * b[1];
    o[2] = a[2] * b[2];
    o[3] = a[3] * b[3];
};
export const multiply_a_4D_vector_by_another_4D_vector_in_place = (a, b) => {
    a[0] *= b[0];
    a[1] *= b[1];
    a[2] *= b[2];
    a[3] *= b[3];
};
export const divide_a_4D_vector_by_a_number_to_out = (a, b, o) => {
    o[0] = a[0] / b;
    o[1] = a[1] / b;
    o[2] = a[2] / b;
    o[3] = a[3] / b;
};
export const divide_a_4D_vector_by_a_number_in_place = (a, b) => {
    a[0] /= b;
    a[1] /= b;
    a[2] /= b;
    a[3] /= b;
};
export const multiply_a_4D_vector_by_a_number_to_out = (a, b, o) => {
    o[0] = a[0] * b;
    o[1] = a[1] * b;
    o[2] = a[2] * b;
    o[3] = a[3] * b;
};
export const multiply_a_4D_vector_by_a_number_in_place = (a, b) => {
    a[0] *= b;
    a[1] *= b;
    a[2] *= b;
    a[3] *= b;
};
export const normalize_a_4D_direction_to_out = (a, o) => {
    let n = a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2;
    if (n === 1) {
        o[0] = a[0];
        o[1] = a[1];
        o[2] = a[2];
        o[3] = a[3];
    }
    else {
        n = 1 / Math.sqrt(n);
        o[0] = a[0] * n;
        o[1] = a[1] * n;
        o[2] = a[2] * n;
        o[3] = a[3] * n;
    }
};
export const normalize_a_4D_direction_in_place = (a) => {
    let n = a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2;
    if (n === 1)
        return;
    n = 1 / Math.sqrt(n);
    a[0] *= n;
    a[1] *= n;
    a[2] *= n;
    a[3] *= n;
};
export const normalize_all_4D_directions_in_place = (vectors, start = 0, end = vectors.length) => {
    let v;
    const sqrt = Math.sqrt;
    let n;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        n = v[0] ** 2 + v[1] ** 2 + v[2] ** 2 + v[3] ** 2;
        if (n === 1)
            continue;
        n = 1 / sqrt(n);
        v[0] *= n;
        v[1] *= n;
        v[2] *= n;
        v[3] *= n;
    }
};
export const normalize_some_4D_directions_in_place = (vectors, include, start = 0, end = vectors.length) => {
    let v;
    let n;
    const sqrt = Math.sqrt;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            n = v[0] ** 2 + v[1] ** 2 + v[2] ** 2 + v[3] ** 2;
            if (n === 1)
                continue;
            n = 1 / sqrt(n);
            v[0] *= n;
            v[1] *= n;
            v[2] *= n;
            v[3] *= n;
        }
};
export const dot_a_4D_direction_with_another_4D_direction = (a, b) => a[0] * b[0] +
    a[1] * b[1] +
    a[2] * b[2] +
    a[3] * b[3];
export const reflect_a_4D_vector_around_a_4D_direction_to_out = (a, b, o) => {
    const n = (a[0] * b[0] +
        a[1] * b[1] +
        a[2] * b[2] +
        a[3] * b[3]);
    o[0] = b[0] * n - a[0];
    o[1] = b[1] * n - a[1];
    o[2] = b[2] * n - a[2];
    o[3] = b[3] * n - a[3];
};
export const reflect_a_4D_vector_around_a_4D_direction_in_place = (a, b) => {
    const n = (a[0] * b[0] +
        a[1] * b[1] +
        a[2] * b[2] +
        a[3] * b[3]) * 2;
    a[0] = b[0] * n - a[0];
    a[1] = b[1] * n - a[1];
    a[2] = b[2] * n - a[2];
    a[3] = b[3] * n - a[3];
};
export const multiply_a_4D_vector_by_a_4x4_matrix_in_place = (a, m) => {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const w = a[3];
    a[0] = x * m[0] + y * m[4] + z * m[8] + w * m[12];
    a[1] = x * m[1] + y * m[5] + z * m[9] + w * m[13];
    a[2] = x * m[2] + y * m[6] + z * m[10] + w * m[14];
    a[3] = x * m[3] + y * m[7] + z * m[11] + w * m[15];
};
export const multiply_a_4D_vector_by_a_4x4_matrix_to_out = (a, m, o) => {
    o[0] = a[0] * m[0] + a[1] * m[4] + a[2] * m[8] + a[3] * m[12];
    o[1] = a[0] * m[1] + a[1] * m[5] + a[2] * m[9] + a[3] * m[13];
    o[2] = a[0] * m[2] + a[1] * m[6] + a[2] * m[10] + a[3] * m[14];
    o[3] = a[0] * m[3] + a[1] * m[7] + a[2] * m[11] + a[3] * m[15];
};
export const multiply_all_4D_vectors_by_a_4x4_matrix_to_out = (vectors, m, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        o = outs[i];
        o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + v[3] * m[12];
        o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + v[3] * m[13];
        o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + v[3] * m[14];
        o[3] = v[0] * m[3] + v[1] * m[7] + v[2] * m[11] + v[3] * m[15];
    }
};
export const multiply_some_4D_vectors_by_a_4x4_matrix_to_out = (vectors, m, include, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            o = outs[i];
            o[0] = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + v[3] * m[12];
            o[1] = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + v[3] * m[13];
            o[2] = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + v[3] * m[14];
            o[3] = v[0] * m[3] + v[1] * m[7] + v[2] * m[11] + v[3] * m[15];
        }
};
export const multiply_all_4D_vectors_by_a_4x4_matrix_in_place = (vectors, m, start = 0, end = vectors.length) => {
    let v;
    let x, y, z, w;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        x = v[0];
        y = v[1];
        z = v[2];
        w = v[3];
        v[0] = x * m[0] + y * m[4] + z * m[8] + w * m[12];
        v[1] = x * m[1] + y * m[5] + z * m[9] + w * m[13];
        v[2] = x * m[2] + y * m[6] + z * m[10] + w * m[14];
        v[3] = x * m[3] + y * m[7] + z * m[11] + w * m[15];
    }
};
export const multiply_some_4D_vectors_by_a_4x4_matrix_in_place = (vectors, m, include, start = 0, end = vectors.length) => {
    let v;
    let x, y, z, w;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            x = v[0];
            y = v[1];
            z = v[2];
            w = v[3];
            v[0] = x * m[0] + y * m[4] + z * m[8] + w * m[12];
            v[1] = x * m[1] + y * m[5] + z * m[9] + w * m[13];
            v[2] = x * m[2] + y * m[6] + z * m[10] + w * m[14];
            v[3] = x * m[3] + y * m[7] + z * m[11] + w * m[15];
        }
};
//# sourceMappingURL=vec4.js.map