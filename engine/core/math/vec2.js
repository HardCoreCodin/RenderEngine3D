export const check_if_two_2D_vectrs_are_equal = (a, b) => a[0].toFixed(3) === b[0].toFixed(3) &&
    a[0].toFixed(3) === b[1].toFixed(3);
export const negate_a_2D_direction_to_out = (a, o) => {
    o[0] = -a[0];
    o[1] = -a[1];
};
export const negate_a_2D_direction_in_place = (a) => {
    a[0] = -a[0];
    a[1] = -a[1];
};
export const compute_the_length_of_a_2D_direction = (a) => Math.sqrt(a[0] ** 2 +
    a[1] ** 2);
export const compute_the_distance_from_a_2D_position_to_another_2D_position = (a, b) => Math.sqrt((b[0] - a[0]) ** 2 +
    (b[1] - a[1]) ** 2);
export const square_the_length_of_a_2D_direction = (a) => a[0] ** 2 +
    a[1] ** 2;
export const square_the_distance_from_a_2D_positions_to_another_2D_position = (a, b) => ((b[1] - a[0]) ** 2 +
    (b[0] - a[1]) ** 2);
export const linearly_interpolate_from_a_2D_vectors_to_another_2D_vector_to_out = (a, b, t, o) => {
    o[0] = (1 - t) * a[0] + t * (b[0]);
    o[1] = (1 - t) * a[1] + t * (b[1]);
};
export const add_a_2D_vector_to_another_2D_vector_to_out = (a, b, o) => {
    o[0] = a[0] + b[0];
    o[1] = a[1] + b[1];
};
export const add_a_2D_vector_to_another_2D_vector_in_place = (a, b) => {
    a[0] += b[0];
    a[1] += b[1];
};
export const add_a_number_to_a_2D_vector_to_out = (a, b, o) => {
    o[0] = a[0] + b;
    o[1] = a[1] + b;
};
export const add_a_number_to_a_2D_vector_in_place = (a, b) => {
    a[0] += b;
    a[1] += b;
};
export const subtract_a_2D_vector_from_another_2D_vector_to_out = (a, b, o) => {
    o[0] = a[0] - b[0];
    o[1] = a[1] - b[1];
};
export const subtract_a_2D_vector_from_another_2D_vector_in_place = (a, b) => {
    a[0] -= b[0];
    a[1] -= b[1];
};
export const subtract_a_number_from_a_2D_vector_to_out = (a, b, o) => {
    o[0] = a[0] - b;
    o[1] = a[1] - b;
};
export const subtract_a_number_from_a_2D_vector_in_place = (a, b) => {
    a[0] -= b;
    a[1] -= b;
};
export const multiply_a_2D_vector_by_another_2D_vector_to_out = (a, b, o) => {
    o[0] = a[0] * b[0];
    o[1] = a[1] * b[1];
};
export const multiply_a_2D_vector_by_another_2D_vector_in_place = (a, b) => {
    a[0] *= b[0];
    a[1] *= b[1];
};
export const divide_a_2D_vector_by_a_number_to_out = (a, b, o) => {
    o[0] = a[0] / b;
    o[1] = a[1] / b;
};
export const divide_a_2D_vector_by_a_number_in_place = (a, b) => {
    a[0] /= b;
    a[1] /= b;
};
export const multiply_a_2D_vector_by_a_number_to_out = (a, b, o) => {
    o[0] = a[0] * b;
    o[1] = a[1] * b;
};
export const multiply_a_2D_vector_by_a_number_in_place = (a, b) => {
    a[0] *= b;
    a[1] *= b;
};
export const normalize_a_2D_direction_to_out = (a, o) => {
    let n = a[0] ** 2 + a[1] ** 2;
    if (n === 1) {
        o[0] = a[0];
        o[1] = a[1];
    }
    else {
        n = 1 / Math.sqrt(n);
        o[0] = a[0] * n;
        o[1] = a[1] * n;
    }
};
export const normalize_a_2D_direction_in_place = (a) => {
    let n = a[0] ** 2 + a[1] ** 2;
    if (n === 1)
        return;
    n = 1 / Math.sqrt(n);
    a[0] *= n;
    a[1] *= n;
};
export const normalize_all_2D_directions_in_place = (vectors, start = 0, end = vectors.length) => {
    let v;
    let n;
    const sqrt = Math.sqrt;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        n = v[0] ** 2 + v[1] ** 2;
        if (n === 1)
            continue;
        n = 1 / sqrt(n);
        v[0] *= n;
        v[1] *= n;
    }
};
export const normalize_some_2D_directions_in_place = (vectors, include, start = 0, end = vectors.length) => {
    let v;
    let n;
    const sqrt = Math.sqrt;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            n = v[0] ** 2 + v[1] ** 2;
            if (n === 1)
                continue;
            n = 1 / sqrt(n);
            v[0] *= n;
            v[1] *= n;
        }
};
export const dot_a_2D_direction_with_another_2D_direction = (a, b) => a[0] * b[0] +
    a[1] * b[1];
export const reflect_a_2D_vector_around_a_2D_direction_to_out = (a, b, o) => {
    const n = 2 * (a[0] * b[0] + a[1] * b[1]);
    o[0] = b[0] * n - a[0];
    o[1] = b[1] * n - a[1];
};
export const reflect_a_2D_vector_around_a_2D_direction_in_place = (a, b) => {
    const n = 2 * (a[0] * b[0] + a[1] * b[1]);
    a[0] = b[0] * n - a[0];
    a[1] = b[1] * n - a[1];
};
export const multiply_a_2D_vector_by_a_2x2_matrix_to_out = (a, m, o) => {
    o[0] = a[0] * m[0] + a[1] * m[2];
    o[1] = a[0] * m[1] + a[1] * m[3];
};
export const multiply_a_2D_vector_by_a_2x2_matrix_in_place = (a, m) => {
    const x = a[0];
    const y = a[1];
    a[0] = x * m[0] + y * m[4];
    a[1] = x * m[1] + y * m[3];
};
export const multiply_all_2D_vectors_by_a_2x2_matrix_to_out = (vectors, m, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        o = outs[i];
        o[0] = v[0] * m[0] + v[1] * m[4];
        o[1] = v[0] * m[1] + v[1] * m[3];
    }
};
export const multiply_all_2D_vectors_by_a_2x2_matrix_in_place = (vectors, m, start = 0, end = vectors.length) => {
    let v;
    let x, y;
    for (let i = start; i < end; i++) {
        v = vectors[i];
        x = v[0];
        y = v[1];
        v[0] = x * m[0] + y * m[2];
        v[1] = x * m[1] + y * m[3];
    }
};
export const multiply_some_2D_vectors_by_a_2x2_matrix_to_out = (vectors, m, include, outs, start = 0, end = vectors.length) => {
    let v, o;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            o = outs[i];
            o[0] = v[0] * m[0] + v[1] * m[2];
            o[1] = v[0] * m[1] + v[1] * m[3];
        }
};
export const multiply_some_2D_vectors_by_a_2x2_matrix_in_place = (vectors, m, include, start = 0, end = vectors.length) => {
    let v;
    let x, y;
    for (let i = start; i < end; i++)
        if (include[i]) {
            v = vectors[i];
            x = v[0];
            y = v[1];
            v[0] = x * m[0] + y * m[2];
            v[1] = x * m[1] + y * m[3];
        }
};
//# sourceMappingURL=vec2.js.map