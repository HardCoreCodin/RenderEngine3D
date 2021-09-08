export const set_a_2x2_matrix_to_the_identity_matrix = (
    a: Float32Array,
) : void => {
    a[0] = a[3] = 1;
    a[1] = a[2] = 0;
};

// TODO: Fix...
export const invert_a_2x2_matrix_to_out = (
    a: Float32Array,
    o: Float32Array,
) : void => {
    o[0] = a[0];  o[2] = a[1];
    o[1] = a[2];  o[3] = a[3];
};

// TODO: Fix...
export const invert_a_2x2_matrix_in_place = (
    a: Float32Array,
) : void => {
    [
        a[1], a[2]
    ] = [
        a[2], a[1]
    ]
};

export const transpose_a_2x2_matrix_to_out = (
    a: Float32Array,
    o: Float32Array,
) : void => {
    o[0] = a[0];  o[2] = a[1];
    o[1] = a[2];  o[3] = a[3];
};

export const transpose_a_2x2_matrix_in_place = (
    a: Float32Array,
) : void => {
    [
        a[1], a[2]
    ] = [
        a[2], a[1]
    ]
};

export const check_if_two_2x2_matrices_are_equal = (
    a: Float32Array,
    b: Float32Array
) : boolean =>
    a[0].toFixed(3) === b[0].toFixed(3) &&
    a[1].toFixed(3) === b[1].toFixed(3) &&
    a[2].toFixed(3) === b[2].toFixed(3) &&
    a[3].toFixed(3) === b[3].toFixed(3);

export const check_if_a_2x2_matrix_is_the_identity_matrix = (
    a: Float32Array,
) : boolean =>
    a[0] === 1  &&  a[2] === 0 &&
    a[1] === 0  &&  a[3] === 1;

export const add_a_2x2_matrix_to_another_2x2_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array,
) : void => {
    o[0] = a[0] + b[0];  o[2] = a[2] + b[2];
    o[1] = a[1] + b[1];  o[3] = a[3] + b[3];
};

export const add_a_2x2_matrix_to_another_2x2_matrix_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] += b[0];  a[2] += b[2];
    a[1] += b[1];  a[3] += b[3];
};

export const add_a_number_to_a_2x2_matrix_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array,
) : void => {
    o[0] = a[0] + b;  o[2] = a[2] + b;
    o[1] = a[1] + b;  o[3] = a[3] + b;
};

export const add_a_number_to_a_2x2_matrix_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] += b;  a[2] += b;
    a[1] += b;  a[3] += b;
};

export const subtract_a_2x2_matrix_from_another_2x2_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array,
) : void => {
    o[0] = a[0] - b[0];  o[2] = a[2] - b[2];
    o[1] = a[1] - b[1];  o[3] = a[3] - b[3];
};

export const subtract_a_2x2_matrix_from_another_2x2_matrix_in_place = (
    a: Float32Array,

    b: Float32Array
) : void => {
    a[0] -= b[0];  a[2] -= b[2];
    a[1] -= b[1];  a[3] -= b[3];
};

export const subtract_a_number_from_a_2x2_matrix_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array,
) : void => {
    o[0] = a[0] - b;  o[2] = a[2] - b;
    o[1] = a[1] - b;  o[3] = a[3] - b;
};

export const subtract_a_number_from_a_2x2_matrix_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] -= b;  a[2] -= b;
    a[1] -= b;  a[3] -= b;
};

export const divide_a_2x2_matrix_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array,
) : void => {
    o[0] = a[0] / b;  o[2] = a[2] / b;
    o[1] = a[1] / b;  o[3] = a[3] / b;
};

export const divide_a_2x2_matrix_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] /= b;  a[2] /= b;
    a[1] /= b;  a[3] /= b;
};

export const multiply_a_2x2_matrix_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array,
) : void => {
    o[0] = a[0] * b;  o[2] = a[2] * b;
    o[1] = a[1] * b;  o[3] = a[3] * b;
};

export const multiply_a_2x2_matrix_by_a_number_in_place = (
    a: Float32Array,

    b: number
) : void => {
    a[0] *= b;  a[2] *= b;
    a[1] *= b;  a[3] *= b;
};

export const multiply_a_2x2_matrix_by_another_2x2_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array,
) : void => {
    o[0] = a[0]*b[0] + a[1]*b[2]; // Row 1 | Column 1
    o[1] = a[0]*b[1] + a[1]*b[3]; // Row 1 | Column 2

    o[2] = a[2]*b[0] + a[3]*b[2]; // Row 2 | Column 1
    o[3] = a[2]*b[1] + a[3]*b[3]; // Row 2 | Column 2
};

export const multiply_a_2x2_matrix_by_another_2x2_matrix_in_place = (
    a: Float32Array,
    b: Float32Array,
) : void => {
    const t11 = a[0];  const t21 = a[2];
    const t12 = a[1];  const t22 = a[3];

    a[0] = t11*b[0] + t12*b[2]; // Row 1 | Column 1
    a[1] = t11*b[1] + t12*b[3]; // Row 1 | Column 2

    a[2] = t21*b[0] + t22*b[2]; // Row 2 | Column 1
    a[3] = t21*b[1] + t22*b[3]; // Row 2 | Column 2
};

export const set_a_2x2_matrix_to_a_rotation_matrix = (
    a: Float32Array,

    sin: number,
    cos: number
) : void => {
    a[0] = a[3] = cos;
    a[1] = sin;
    a[2] = -sin;
};

export const rotate_a_2x2_matrix_to_out = (
    a: Float32Array,

    sin: number,
    cos: number,

    o: Float32Array,
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

    o[0] = a[0]*cos - a[1]*sin;  o[1] = a[0]*sin + a[1]*cos;
    o[2] = a[2]*cos - a[3]*sin;  o[3] = a[2]*sin + a[3]*cos;
};

export const rotate_a_2x2_matrix_in_place = (
    a: Float32Array,

    sin: number,
    cos: number
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

    const t11 = a[0];  const t21 = a[2];
    const t12 = a[1];  const t22 = a[3];

    a[0] = t11 * cos - t12 * sin;   a[1] = t11 * sin + t12 * cos;
    a[2] = t21 * cos - t22 * sin;   a[3] = t21 * sin + t22 * cos;
};