export const PRECISION_DIGITS = 3;

let t11, t12,
    t21, t22: number;

export const set_the_components_of_a_2x2_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    m11: number, m12: number,
    m21: number, m22: number
): void => {
    M11a[a] = m11;  M12a[a] = m12;
    M21a[a] = m21;  M22a[a] = m22;
};

export const set_all_components_of_a_2x2_matrix_to_a_number = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    value: number
): void => {
    M11a[a] = M12a[a] =
    M21a[a] = M22a[a] = value;
};

export const set_a_2x2_matrix_from_another_2x2_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
): void => {
    M11a[a] = M11o[o];  M12a[a] = M12o[o];
    M21a[a] = M21o[o];  M22a[a] = M22o[o];
};

export const set_a_2x2_matrix_to_the_identity_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,
) : void => {
    M11a[a] = M22a[a] = 1;
    M12a[a] = M21a[a] = 0;
};

// TODO: Fix...
export const invert_a_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a];  M21o[o] = M12a[a];
    M12o[o] = M21a[a];  M22o[o] = M22a[a];
};

// TODO: Fix...
export const invert_a_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,
) : void => {
    [
        M12a[a], M21a[a]
    ] = [
        M21a[a], M12a[a]
    ]
};

export const transpose_a_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a];  M21o[o] = M12a[a];
    M12o[o] = M21a[a];  M22o[o] = M22a[a];
};

export const transpose_a_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,
) : void => {
    [
        M12a[a], M21a[a]
    ] = [
        M21a[a], M12a[a]
    ]
};

export const check_if_two_2x2_matrices_are_equal = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array,
    M21b: Float32Array, M22b: Float32Array
) : boolean =>
    M11a[a].toFixed(PRECISION_DIGITS) ===
    M11b[b].toFixed(PRECISION_DIGITS) &&

    M12a[a].toFixed(PRECISION_DIGITS) ===
    M12b[b].toFixed(PRECISION_DIGITS) &&


    M21a[a].toFixed(PRECISION_DIGITS) ===
    M21b[b].toFixed(PRECISION_DIGITS) &&

    M22a[a].toFixed(PRECISION_DIGITS) ===
    M22b[b].toFixed(PRECISION_DIGITS);

export const check_if_a_2x2_matrix_is_the_identity_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,
) : boolean =>
    M11a[a] === 1  &&  M21a[a] === 0 &&
    M12a[a] === 0  &&  M22a[a] === 1;

export const add_a_2x2_matrix_to_another_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array,
    M21b: Float32Array, M22b: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a] + M11b[b];  M21o[o] = M21a[a] + M21b[b];
    M12o[o] = M12a[a] + M12b[b];  M22o[o] = M22a[a] + M22b[b];
};

export const add_a_2x2_matrix_to_another_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array,
    M21b: Float32Array, M22b: Float32Array
) : void => {
    M11a[a] += M11b[b];  M21a[a] += M21b[b];
    M12a[a] += M12b[b];  M22a[a] += M22b[b];
};

export const add_a_number_to_a_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a] + b;  M21o[o] = M21a[a] + b;
    M12o[o] = M12a[a] + b;  M22o[o] = M22a[a] + b;
};

export const add_a_number_to_a_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number
) : void => {
    M11a[a] += b;  M21a[a] += b;
    M12a[a] += b;  M22a[a] += b;
};

export const subtract_a_2x2_matrix_from_another_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array,
    M21b: Float32Array, M22b: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a] - M11b[b];  M21o[o] = M21a[a] - M21b[b];
    M12o[o] = M12a[a] - M12b[b];  M22o[o] = M22a[a] - M22b[b];
};

export const subtract_a_2x2_matrix_from_another_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array,
    M21b: Float32Array, M22b: Float32Array
) : void => {
    M11a[a] -= M11b[b];  M21a[a] -= M21b[b];
    M12a[a] -= M12b[b];  M22a[a] -= M22b[b];
};

export const subtract_a_number_from_a_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a] - b;  M21o[o] = M21a[a] - b;
    M12o[o] = M12a[a] - b;  M22o[o] = M22a[a] - b;
};

export const subtract_a_number_from_a_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number
) : void => {
    M11a[a] -= b;  M21a[a] -= b;
    M12a[a] -= b;  M22a[a] -= b;
};

export const divide_a_2x2_matrix_by_a_number_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a] / b;  M21o[o] = M21a[a] / b;
    M12o[o] = M12a[a] / b;  M22o[o] = M22a[a] / b;
};

export const divide_a_2x2_matrix_by_a_number_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number
) : void => {
    M11a[a] /= b;  M21a[a] /= b;
    M12a[a] /= b;  M22a[a] /= b;
};

export const multiply_a_2x2_matrix_by_a_number_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a] * b;  M21o[o] = M21a[a] * b;
    M12o[o] = M12a[a] * b;  M22o[o] = M22a[a] * b;
};

export const multiply_a_2x2_matrix_by_a_number_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number
) : void => {
    M11a[a] *= b;  M21a[a] *= b;
    M12a[a] *= b;  M22a[a] *= b;
};

export const multiply_a_2x2_matrix_by_another_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array,
    M21b: Float32Array, M22b: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    M11o[o] = M11a[a]*M11b[b] + M12a[a]*M21b[b]; // Row 1 | Column 1
    M12o[o] = M11a[a]*M12b[b] + M12a[a]*M22b[b]; // Row 1 | Column 2

    M21o[o] = M21a[a]*M11b[b] + M22a[a]*M21b[b]; // Row 2 | Column 1
    M22o[o] = M21a[a]*M12b[b] + M22a[a]*M22b[b]; // Row 2 | Column 2
};

export const multiply_a_2x2_matrix_by_another_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array,
    M21b: Float32Array, M22b: Float32Array,
) : void => {
    t11 = M11a[a];  t21 = M21a[a];
    t12 = M12a[a];  t22 = M22a[a];

    M11a[a] = t11*M11b[b] + t12*M21b[b]; // Row 1 | Column 1
    M12a[a] = t11*M12b[b] + t12*M22b[b]; // Row 1 | Column 2

    M21a[a] = t21*M11b[b] + t22*M21b[b]; // Row 2 | Column 1
    M22a[a] = t21*M12b[b] + t22*M22b[b]; // Row 2 | Column 2
};

export const set_a_2x2_matrix_to_a_rotation_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    cos: number,
    sin: number
) : void => {
    M11a[a] = M22a[a] = cos;
    M12a[a] = sin;
    M21a[a] = -sin;
};

export const rotate_a_2x2_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    cos: number,
    sin: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array,
    M21o: Float32Array, M22o: Float32Array,
) : void => {
    // t11 t12 * r11 r12
    // t21 t22   r21 r22
    //
    // (t11 t12).(r11 r21) (t11 t12).(r12 r22)
    // (t21 t22).(r11 r21) (t21 t22).(r12 r22)
    //
    // r11 r12 = cos  sin
    // r21 r22  -sin  cos
    //
    // (t11 t12).(cos -sin) (t11 t12).(sin cos)
    // (t21 t22).(cos -sin) (t21 t22).(sin cos)
    //
    // (t11*cos + t12*-sin + t13*0) (t11*sin + t12*cos + t13*0)
    // (t21*cos + t22*-sin + t23*0) (t21*sin + t22*cos + t23*0)
    //
    // (t11*cos + t12*-sin + 0) (t11*sin + t12*cos + 0)
    // (t21*cos + t22*-sin + 0) (t21*sin + t22*cos + 0)
    //
    // (t11*cos - t12*sin) (t11*sin + t12*cos)
    // (t21*cos - t22*sin) (t21*sin + t22*cos)
    //
    // o11=(t11*cos - t12*sin)  o12=(t11*sin + t12*cos)
    // o21=(t21*cos - t22*sin)  o22=(t21*sin + t22*cos)
    //
    // o11 = t11*cos - t12*sin  o12 = t11*sin + t12*cos
    // o21 = t21*cos - t22*sin  o22 = t21*sin + t22*cos

    M11o[o] = M11a[a]*cos - M12a[a]*sin;  M12o[o] = M11a[a]*sin + M12a[a]*cos;
    M21o[o] = M21a[a]*cos - M22a[a]*sin;  M22o[o] = M21a[a]*sin + M22a[a]*cos;
};

export const rotate_a_2x2_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array,
    M21a: Float32Array, M22a: Float32Array,

    cos: number,
    sin: number
) : void => {
    // t11 t12 *= r11 r12
    // t21 t22    r21 r22
    //
    // (t11 t12).(r11 r21) (t11 t12).(r12 r22)
    // (t21 t22).(r11 r21) (t21 t22).(r12 r22)
    //
    // r11 r12 = cos  sin
    // r21 r22  -sin  cos
    //
    // (t11 t12).(cos -sin) (t11 t12).(sin cos)
    // (t21 t22).(cos -sin) (t21 t22).(sin cos)
    //
    // (t11*cos + t12*-sin + t13*0) (t11*sin + t12*cos + t13*0)
    // (t21*cos + t22*-sin + t23*0) (t21*sin + t22*cos + t23*0)
    //
    // (t11*cos + t12*-sin + 0) (t11*sin + t12*cos + 0)
    // (t21*cos + t22*-sin + 0) (t21*sin + t22*cos + 0)
    //
    // (t11*cos - t12*sin) (t11*sin + t12*cos)
    // (t21*cos - t22*sin) (t21*sin + t22*cos)
    //
    // o11=(t11*cos - t12*sin)  o12=(t11*sin + t12*cos)
    // o21=(t21*cos - t22*sin)  o22=(t21*sin + t22*cos)
    //
    // o11 = t11*cos - t12*sin  o12 = t11*sin + t12*cos
    // o21 = t21*cos - t22*sin  o22 = t21*sin + t22*cos

    t11 = M11a[a];  t21 = M21a[a];
    t12 = M12a[a];  t22 = M22a[a];

    M11a[a] = t11 * cos - t12 * sin;   M12a[a] = t11 * sin + t12 * cos;
    M21a[a] = t21 * cos - t22 * sin;   M22a[a] = t21 * sin + t22 * cos;
};