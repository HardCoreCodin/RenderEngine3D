export const set_a_3x3_matrix_to_the_identity_matrix = (
    a: Float32Array,
) : void => {
    a[0] = a[4] = a[8] = 1;
    a[1] = a[2] = a[3] = a[5] = a[6] = a[7] = 0;
};

export const set_a_3x3_matrix_to_a_cross_product_matrix_for_a_3D_direction_in_place = (
    a: Float32Array,
    v: Float32Array
) : void => {
    a[0] = a[4] = a[8] = 0;
    a[5] = v[0];  a[7] = -v[0];
    a[6] = v[1];  a[2] = -v[1];
    a[1] = v[2];  a[3] = -v[2];
};

export const set_a_3x3_matrix_to_an_outer_product_matrix_for_two_3D_directions_in_place = (
    a: Float32Array,
    v1: Float32Array,
    v2: Float32Array
) : void => {
    a[0] = v1[0]*v2[0];  a[1] = v1[1]*v2[0];  a[2] = v1[2]*v2[0];
    a[3] = v1[0]*v2[1];  a[4] = v1[1]*v2[1];  a[5] = v1[2]*v2[1];
    a[6] = v1[0]*v2[2];  a[7] = v1[1]*v2[2];  a[8] = v1[2]*v2[2];
};

export const invert_a_3x3_matrix_to_out = (
    a: Float32Array,
    o: Float32Array
) : void => {
    o[2] = a[2];  o[0] = a[0];
    o[5] = a[5];  o[4] = a[4];

    // Transpose the rotation portion of the matrix:
    o[1] = a[3];
    o[3] = a[1];

    o[6] = -(a[6]*a[0] + a[7]*a[1]); // -Dot(original_translation, original_rotation_x)
    o[7] = -(a[6]*a[3] + a[7]*a[4]); // -Dot(original_translation, original_rotation_y)
    o[8] = 1;
};

export const invert_a_3x3_matrix_in_place = (
    a: Float32Array,
) : void => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    const t11 = a[0];  const t21 = a[3];  const t31 = a[6];
    const t12 = a[1];  const t22 = a[4];  const t32 = a[7];

    // Transpose the rotation portion of the matrix:
    a[1] = t21;
    a[3] = t12;

    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    a[6] = -(t31*t11 + t32*t12); // -Dot(original_translation, original_rotation_x)
    a[7] = -(t31*t21 + t32*t22); // -Dot(original_translation, original_rotation_y)
    a[8] = 1;
};

export const transpose_a_3x3_matrix_to_out = (
    a: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0];  o[3] = a[1];  o[6] = a[2];
    o[1] = a[3];  o[4] = a[4];  o[7] = a[5];
    o[2] = a[6];  o[5] = a[7];  o[8] = a[8];
};

export const transpose_a_3x3_matrix_in_place = (
    a: Float32Array,
) : void => {[
    a[1], a[2], a[3], a[5], a[6], a[7]] = [
    a[3], a[6], a[1], a[7], a[2], a[5]]
};

export const check_if_two_3x3_matrices_are_equal = (
    a: Float32Array,
    b: Float32Array
) : boolean =>
    a[0].toFixed(3) === b[0].toFixed(3) &&
    a[1].toFixed(3) === b[1].toFixed(3) &&
    a[2].toFixed(3) === b[2].toFixed(3) &&

    a[3].toFixed(3) === b[3].toFixed(3) &&
    a[4].toFixed(3) === b[4].toFixed(3) &&
    a[5].toFixed(3) === b[5].toFixed(3) &&

    a[6].toFixed(3) === b[6].toFixed(3) &&
    a[7].toFixed(3) === b[7].toFixed(3) &&
    a[8].toFixed(3) === b[8].toFixed(3);

export const check_if_a_3x3_matrix_is_the_identity_matrix = (
    a: Float32Array,
) : boolean =>
    a[0] === 1  &&  a[3] === 0  &&  a[6] === 0  &&
    a[1] === 0  &&  a[4] === 1  &&  a[7] === 0  &&
    a[2] === 0  &&  a[5] === 0  &&  a[8] === 1;

export const add_a_3x3_matrix_to_another_3x3_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] + b[0];  o[3] = a[3] + b[3];  o[6] = a[6] + b[6];
    o[1] = a[1] + b[1];  o[4] = a[4] + b[4];  o[7] = a[7] + b[7];
    o[2] = a[2] + b[2];  o[5] = a[5] + b[5];  o[8] = a[8] + b[8];
};

export const add_a_3x3_matrix_to_another_3x3_matrix_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] += b[0];  a[3] += b[3];  a[6] += b[6];
    a[1] += b[1];  a[4] += b[4];  a[7] += b[7];
    a[2] += b[2];  a[5] += b[5];  a[8] += b[8];
};

export const add_a_number_to_a_3x3_matrix_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] + b;  o[3] = a[3] + b;  o[6] = a[6] + b;
    o[1] = a[1] + b;  o[4] = a[4] + b;  o[7] = a[7] + b;
    o[2] = a[2] + b;  o[5] = a[5] + b;  o[8] = a[8] + b;
};

export const add_a_number_to_a_3x3_matrix_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] += b;  a[3] += b;  a[6] += b;
    a[1] += b;  a[4] += b;  a[7] += b;
    a[2] += b;  a[5] += b;  a[8] += b;
};

export const subtract_a_3x3_matrix_from_another_3x3_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] - b[0];  o[3] = a[3] - b[3];  o[6] = a[6] - b[6];
    o[1] = a[1] - b[1];  o[4] = a[4] - b[4];  o[7] = a[7] - b[7];
    o[2] = a[2] - b[2];  o[5] = a[5] - b[5];  o[8] = a[8] - b[8];
};

export const subtract_a_3x3_matrix_from_another_3x3_matrix_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] -= b[0];  a[3] -= b[3];  a[6] -= b[6];
    a[1] -= b[1];  a[4] -= b[4];  a[7] -= b[7];
    a[2] -= b[2];  a[5] -= b[5];  a[8] -= b[8];
};

export const subtract_a_number_from_a_3x3_matrix_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] - b;  o[3] = a[3] - b;  o[6] = a[6] - b;
    o[1] = a[1] - b;  o[4] = a[4] - b;  o[7] = a[7] - b;
    o[2] = a[2] - b;  o[5] = a[5] - b;  o[8] = a[8] - b;
};

export const subtract_a_number_from_a_3x3_matrix_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] -= b;  a[3] -= b;  a[6] -= b;
    a[1] -= b;  a[4] -= b;  a[7] -= b;
    a[2] -= b;  a[5] -= b;  a[8] -= b;
};

export const divide_a_3x3_matrix_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] / b;  o[3] = a[3] / b;  o[6] = a[6] / b;
    o[1] = a[1] / b;  o[4] = a[4] / b;  o[7] = a[7] / b;
    o[2] = a[2] / b;  o[5] = a[5] / b;  o[8] = a[8] / b;
};

export const divide_a_3x3_matrix_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] /= b;  a[3] /= b;  a[6] /= b;
    a[1] /= b;  a[4] /= b;  a[7] /= b;
    a[2] /= b;  a[5] /= b;  a[8] /= b;
};

export const multiply_a_3x3_matrix_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] * b;  o[3] = a[3] * b;  o[6] = a[6] * b;
    o[1] = a[1] * b;  o[4] = a[4] * b;  o[7] = a[7] * b;
    o[2] = a[2] * b;  o[5] = a[5] * b;  o[8] = a[8] * b;
};

export const multiply_a_3x3_matrix_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] *= b;  a[3] *= b;  a[6] *= b;
    a[1] *= b;  a[4] *= b;  a[7] *= b;
    a[2] *= b;  a[5] *= b;  a[8] *= b;
};

export const multiply_a_3x3_matrix_by_another_3x3_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0]*b[0] + a[1]*b[3] + a[2]*b[6]; // Row 1 | Column 1
    o[1] = a[0]*b[1] + a[1]*b[4] + a[2]*b[7]; // Row 1 | Column 2
    o[2] = a[0]*b[2] + a[1]*b[5] + a[2]*b[8]; // Row 1 | Column 3

    o[3] = a[3]*b[0] + a[4]*b[3] + a[5]*b[6]; // Row 2 | Column 1
    o[4] = a[3]*b[1] + a[4]*b[4] + a[5]*b[7]; // Row 2 | Column 2
    o[5] = a[3]*b[2] + a[4]*b[5] + a[5]*b[8]; // Row 2 | Column 3

    o[6] = a[6]*b[0] + a[7]*b[3] + a[8]*b[6]; // Row 3 | Column 1
    o[7] = a[6]*b[1] + a[7]*b[4] + a[8]*b[7]; // Row 3 | Column 2
    o[8] = a[6]*b[2] + a[7]*b[5] + a[8]*b[8]; // Row 3 | Column 3

};

export const multiply_a_3x3_matrix_by_another_3x3_matrix_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    const t11 = a[0];  const t12 = a[1];  const t13 = a[2];
    const t21 = a[3];  const t22 = a[4];  const t23 = a[5];
    const t31 = a[6];  const t32 = a[7];  const t33 = a[8];

    a[0] = t11*b[0] + t12*b[3] + t13*b[6]; // Row 1 | Column 1
    a[3] = t21*b[0] + t22*b[3] + t23*b[6]; // Row 2 | Column 1
    a[6] = t31*b[0] + t32*b[3] + t33*b[6]; // Row 3 | Column 1

    a[1] = t11*b[1] + t12*b[4] + t13*b[7]; // Row 1 | Column 2
    a[4] = t21*b[1] + t22*b[4] + t23*b[7]; // Row 2 | Column 2
    a[7] = t31*b[1] + t32*b[4] + t33*b[7]; // Row 3 | Column 2

    a[2] = t11*b[2] + t12*b[5] + t13*b[8]; // Row 1 | Column 3
    a[5] = t21*b[2] + t22*b[5] + t23*b[8]; // Row 2 | Column 3
    a[8] = t31*b[2] + t32*b[5] + t33*b[8]; // Row 3 | Column 3
};

export const set_a_3x3_matrix_to_a_rotation_around_x_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    a[8] = a[4] = cos;
    a[5] = -sin;
    a[7] = sin;
};

export const set_a_3x3_matrix_to_a_rotation_around_y_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    a[0] = a[8] = cos;
    a[2] = sin;
    a[6] = -sin;
};

export const set_a_3x3_matrix_to_a_rotation_around_z_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    a[0] = a[4] = cos;
    a[1] = -sin;
    a[3] = sin;
};


export const rotate_a_3x3_matrix_around_x_to_out = (
    a: Float32Array,
    sin: number,
    cos: number,
    o: Float32Array
) : void => {
    // t11 t12 t13     r11 r12 r13
    // t21 t22 t23  *  r21 r22 r23
    // t31 t32 t33     r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r13) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   1   0     0
    // r21 r22 r23 = 0  cos  -sin
    // r31 r32 r33   0  sin   cos
    //
    // (t11 t12 t13).(1 0 0) (t11 t12 t13).(0 cos sin) (t11 t12 t13).(0 -sin cos)
    // (t21 t22 t23).(1 0 0) (t21 t22 t23).(0 cos sin) (t21 t22 t23).(0 -sin cos)
    // (t31 t32 t33).(1 0 0) (t31 t32 t33).(0 cos sin) (t31 t32 t33).(0 -sin cos)
    //
    // (t11*1 + t12*0 + t13*0) (t11*0 + t12*cos + t13*sin) (t11*0 - t12*sin + t13*cos)
    // (t21*1 + t22*0 + t23*0) (t21*0 + t22*cos + t23*sin) (t21*0 - t22*sin + t23*cos)
    // (t31*1 + t32*0 + t33*0) (t31*0 + t32*cos + t33*sin) (t31*0 - t32*sin + t33*cos)
    //
    // (t11 + 0 + 0) (0 + t12*cos + t13*sin) (0 - t12*sin + t13*cos)
    // (t21 + 0 + 0) (0 + t22*cos + t23*sin) (0 - t22*sin + t23*cos)
    // (t31 + 0 + 0) (0 + t32*cos + t33*sin) (0 - t32*sin + t33*cos)
    //
    // (t11) (t12*cos + t13*sin) (t13*cos - t12*sin)
    // (t21) (t22*cos + t23*sin) (t23*cos - t22*sin)
    // (t31) (t32*cos + t33*sin) (t33*cos - t32*sin)
    //
    // o11=t11  o12=(t12*cos + t13*sin)  o13=(t13*cos - t12*sin)
    // o21=t21  o22=(t22*cos + t23*sin)  o23=(t23*cos - t22*sin)
    // o31=t31  o32=(t32*cos + t33*sin)  o33=(t33*cos - t32*sin)
    //
    // o11 = t11  o12 = t12*cos + t13*sin  o13 = t13*cos - t12*sin
    // o21 = t21  o22 = t22*cos + t23*sin  o23 = t23*cos - t22*sin
    // o31 = t31  o32 = t32*cos + t33*sin  o33 = t33*cos - t32*sin

    o[0] = a[0];  o[1] = a[1]*cos + a[2]*sin;  o[2] = a[2]*cos - a[1]*sin;
    o[3] = a[3];  o[4] = a[4]*cos + a[5]*sin;  o[5] = a[5]*cos - a[4]*sin;
    o[6] = a[6];  o[7] = a[7]*cos + a[8]*sin;  o[8] = a[8]*cos - a[7]*sin;
};

export const rotate_a_3x3_matrix_around_x_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    // t11 t12 t13      r11 r12 r13
    // t21 t22 t23  *=  r21 r22 r23
    // t31 t32 t33      r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r13) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   1   0     0
    // r21 r22 r23 = 0  cos  -sin
    // r31 r32 r33   0  sin   cos
    //
    // (t11 t12 t13).(1 0 0) (t11 t12 t13).(0 cos sin) (t11 t12 t13).(0 -sin cos)
    // (t21 t22 t23).(1 0 0) (t21 t22 t23).(0 cos sin) (t21 t22 t23).(0 -sin cos)
    // (t31 t32 t33).(1 0 0) (t31 t32 t33).(0 cos sin) (t31 t32 t33).(0 -sin cos)
    //
    // (t11*1 + t12*0 + t13*0) (t11*0 + t12*cos + t13*sin) (t11*0 - t12*sin + t13*cos)
    // (t21*1 + t22*0 + t23*0) (t21*0 + t22*cos + t23*sin) (t21*0 - t22*sin + t23*cos)
    // (t31*1 + t32*0 + t33*0) (t31*0 + t32*cos + t33*sin) (t31*0 - t32*sin + t33*cos)
    //
    // (t11 + 0 + 0) (0 + t12*cos + t13*sin) (0 - t12*sin + t13*cos)
    // (t21 + 0 + 0) (0 + t22*cos + t23*sin) (0 - t22*sin + t23*cos)
    // (t31 + 0 + 0) (0 + t32*cos + t33*sin) (0 - t32*sin + t33*cos)
    //
    // (t11) (t12*cos + t13*sin) (t13*cos - t12*sin)
    // (t21) (t22*cos + t23*sin) (t23*cos - t22*sin)
    // (t31) (t32*cos + t33*sin) (t33*cos - t32*sin)
    //
    // o11=t11  o12=(t12*cos + t13*sin)  o13=(t13*cos - t12*sin)
    // o21=t21  o22=(t22*cos + t23*sin)  o23=(t23*cos - t22*sin)
    // o31=t31  o32=(t32*cos + t33*sin)  o33=(t33*cos - t32*sin)
    //
    // o12 = t12*cos + t13*sin  o13 = t13*cos - t12*sin
    // o22 = t22*cos + t23*sin  o23 = t23*cos - t22*sin
    // o32 = t32*cos + t33*sin  o33 = t33*cos - t32*sin

    const t12 = a[1];  const t13 = a[2];
    const t22 = a[4];  const t23 = a[5];
    const t32 = a[7];  const t33 = a[8];

    a[1] = t12*cos + t13*sin;  a[2] = t13*cos - t12*sin;
    a[4] = t22*cos + t23*sin;  a[5] = t23*cos - t22*sin;
    a[7] = t32*cos + t33*sin;  a[8] = t33*cos - t32*sin;
};

export const rotate_a_3x3_matrix_around_y_to_out = (
    a: Float32Array,
    sin: number,
    cos: number,
    o: Float32Array
) : void => {
    // t11 t12 t13     r11 r12 r13
    // t21 t22 t23  *  r21 r22 r23
    // t31 t32 t33     r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r13) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   cos   0  sin
    // r21 r22 r23 =  0    1   0
    // r31 r32 r33   -sin  0  cos
    //
    // (t11 t12 t13).(cos 0 -sin) (t11 t12 t13).(0 1 0) (t11 t12 t13).(sin 0 cos)
    // (t21 t22 t23).(cos 0 -sin) (t21 t22 t23).(0 1 0) (t21 t22 t23).(sin 0 cos)
    // (t31 t32 t33).(cos 0 -sin) (t31 t32 t33).(0 1 0) (t31 t32 t33).(sin 0 cos)
    //
    // (t11*cos + t12*0 + t13*-sin) (t11*0 + t12*1 + t13*0) (t11*sin + t12*0 + t13*cos)
    // (t21*cos + t22*0 + t23*-sin) (t21*0 + t22*1 + t23*0) (t21*sin + t22*0 + t23*cos)
    // (t31*cos + t32*0 + t33*-sin) (t31*0 + t32*1 + t33*0) (t31*sin + t32*0 + t33*cos)
    //
    // (t11*con + 0 + t13*-sin) (0 + t12 + 0) (t11*sin + 0 + t13*cos)
    // (t21*con + 0 + t23*-sin) (0 + t22 + 0) (t21*sin + 0 + t23*cos)
    // (t31*con + 0 + t33*-sin) (0 + t32 + 0) (t31*sin + 0 + t33*cos)
    //
    // (t11*cos - t13*sin) (t12) (t11*sin + t13*cos)
    // (t21*cos - t23*sin) (t22) (t21*sin + t23*cos)
    // (t31*cos - t33*sin) (t32) (t31*sin + t33*cos)
    //
    // o11=(t11*cos - t13*sin)  o12=t12  o13=(t11*sin + t13*cos)
    // o21=(t21*cos - t23*sin)  o22=t22  o23=(t21*sin + t23*cos)
    // o31=(t31*cos - t33*sin)  o32=t32  o33=(t31*sin + t33*cos)
    //
    // o11 = t11*cos - t13*sin  o12 = t12  o13 = t11*sin + t13*cos
    // o21 = t21*cos - t23*sin  o22 = t22  o23 = t21*sin + t23*cos
    // o31 = t31*cos - t33*sin  o32 = t32  o33 = t31*sin + t33*cos

    o[0] = a[0]*cos - a[2]*sin;  o[1] = a[1];  o[2] = a[0]*sin + a[2]*cos;
    o[3] = a[3]*cos - a[5]*sin;  o[4] = a[4];  o[5] = a[3]*sin + a[5]*cos;
    o[6] = a[6]*cos - a[8]*sin;  o[7] = a[7];  o[8] = a[6]*sin + a[8]*cos;
};

export const rotate_a_3x3_matrix_around_y_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    // t11 t12 t13      r11 r12 r13
    // t21 t22 t23  *=  r21 r22 r23
    // t31 t32 t33      r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r13) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   cos   0  sin
    // r21 r22 r23 =  0    1   0
    // r31 r32 r33   -sin  0  cos
    //
    // (t11 t12 t13).(cos 0 -sin) (t11 t12 t13).(0 1 0) (t11 t12 t13).(sin 0 cos)
    // (t21 t22 t23).(cos 0 -sin) (t21 t22 t23).(0 1 0) (t21 t22 t23).(sin 0 cos)
    // (t31 t32 t33).(cos 0 -sin) (t31 t32 t33).(0 1 0) (t31 t32 t33).(sin 0 cos)
    //
    // (t11*cos + t12*0 + t13*-sin) (t11*0 + t12*1 + t13*0) (t11*sin + t12*0 + t13*cos)
    // (t21*cos + t22*0 + t23*-sin) (t21*0 + t22*1 + t23*0) (t21*sin + t22*0 + t23*cos)
    // (t31*cos + t32*0 + t33*-sin) (t31*0 + t32*1 + t33*0) (t31*sin + t32*0 + t33*cos)
    //
    // (t11*con + 0 + t13*-sin) (0 + t12 + 0) (t11*sin + 0 + t13*cos)
    // (t21*con + 0 + t23*-sin) (0 + t22 + 0) (t21*sin + 0 + t23*cos)
    // (t31*con + 0 + t33*-sin) (0 + t32 + 0) (t31*sin + 0 + t33*cos)
    //
    // (t11*cos - t13*sin) (t12) (t11*sin + t13*cos)
    // (t21*cos - t23*sin) (t22) (t21*sin + t23*cos)
    // (t31*cos - t33*sin) (t32) (t31*sin + t33*cos)
    //
    // o11=(t11*cos - t13*sin)  o12=t12  o13=(t11*sin + t13*cos)
    // o21=(t21*cos - t23*sin)  o22=t22  o23=(t21*sin + t23*cos)
    // o31=(t31*cos - t33*sin)  o32=t32  o33=(t31*sin + t33*cos)
    //
    // o11 = t11*cos - t13*sin  o13 = t11*sin + t13*cos
    // o21 = t21*cos - t23*sin  o23 = t21*sin + t23*cos
    // o31 = t31*cos - t33*sin  o33 = t31*sin + t33*cos

    const t11 = a[0];  const t13 = a[2];
    const t21 = a[3];  const t23 = a[5];
    const t31 = a[6];  const t33 = a[8];

    a[0] = t11*cos - t13*sin;  a[2] = t11*sin + t13*cos;
    a[3] = t21*cos - t23*sin;  a[5] = t21*sin + t23*cos;
    a[6] = t31*cos - t33*sin;  a[8] = t31*sin + t33*cos;
};

export const rotate_a_3x3_matrix_around_z_to_out = (
    a: Float32Array,
    sin: number,
    cos: number,
    o: Float32Array
) : void => {
    // t11 t12 t13     r11 r12 r13
    // t21 t22 t23  *  r21 r22 r23
    // t31 t32 t33     r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r13) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   cos  -sin 0
    // r21 r22 r23 = sin   cos 0
    // r31 r32 r33    0     0  1
    //
    // (t11 t12 t13).(cos sin 0) (t11 t12 t13).(-sin cos 0) (t11 t12 t13).(0 0 1)
    // (t21 t22 t23).(cos sin 0) (t21 t22 t23).(-sin cos 0) (t21 t22 t23).(0 0 1)
    // (t31 t32 t33).(cos sin 0) (t31 t32 t33).(-sin cos 0) (t31 t32 t33).(0 0 1)
    //
    // (t11*cos + t12*sin + t13*0) (t12*cos - t11*sin + t13*0) (t11*0 + t12*0 + t13*1)
    // (t21*cos + t22*sin + t23*0) (t22*cos - t21*sin + t23*0) (t21*0 + t22*0 + t23*1)
    // (t31*cos + t32*sin + t33*0) (t32*cos - t31*sin + t33*0) (t31*0 + t32*0 + t33*1)
    //
    // (t11*cos + t12*sin + 0) (t12*cos - t11*sin + 0) (0 + 0 + t13)
    // (t21*cos + t22*sin + 0) (t22*cos - t21*sin + 0) (0 + 0 + t23)
    // (t31*cos + t32*sin + 0) (t32*cos - t31*sin + 0) (0 + 0 + t33)
    //
    // (t11*cos + t12*sin) (t12*cos - t11*sin) (t13)
    // (t21*cos + t22*sin) (t22*cos - t21*sin) (t23)
    // (t31*cos + t32*sin) (t32*cos - t31*sin) (t33)
    //
    // o11=(t11*cos + t12*sin)  o12=(t12*cos - t11*sin)  o13=t13
    // o21=(t21*cos + t22*sin)  o22=(t22*cos - t21*sin)  o23=t23
    // o31=(t31*cos + t32*sin)  o32=(t32*cos - t31*sin)  o33=t33
    //
    // o11 = t11*cos + t12*sin  o12 = t12*cos - t11*sin  o13 = t13
    // o21 = t21*cos + t22*sin  o22 = t22*cos - t21*sin  o23 = t23
    // o31 = t31*cos + t32*sin  o32 = t32*cos - t31*sin  o33 = t33

    o[0] = a[0]*cos + a[1]*sin;  o[1] = a[1]*cos - a[0]*sin;  o[2] = a[2];
    o[3] = a[3]*cos + a[4]*sin;  o[4] = a[4]*cos - a[3]*sin;  o[5] = a[5];
    o[6] = a[6]*cos + a[7]*sin;  o[7] = a[7]*cos - a[6]*sin;  o[8] = a[8];
};

export const rotate_a_3x3_matrix_around_z_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    // t11 t12 t13      r11 r12 r13
    // t21 t22 t23  *=  r21 r22 r23
    // t31 t32 t33      r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r31) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   cos  -sin 0
    // r21 r22 r23 = sin   cos 0
    // r31 r32 r33    0     0  1
    //
    // (t11 t12 t13).(cos sin 0) (t11 t12 t13).(-sin cos 0) (t11 t12 t13).(0 0 1)
    // (t21 t22 t23).(cos sin 0) (t21 t22 t23).(-sin cos 0) (t21 t22 t23).(0 0 1)
    // (t31 t32 t33).(cos sin 0) (t31 t32 t33).(-sin cos 0) (t31 t32 t33).(0 0 1)
    //
    // (t11*cos + t12*sin + t13*0) (t11*-sin + t12*cos + t13*0) (t11*0 + t12*0 + t13*1)
    // (t21*cos + t22*sin + t23*0) (t21*-sin + t22*cos + t23*0) (t21*0 + t22*0 + t23*1)
    // (t31*cos + t32*sin + t33*0) (t31*-sin + t32*cos + t33*0) (t31*0 + t32*0 + t33*1)
    //
    // (t11*cos + t12*sin + 0) (t11*-sin + t12*cos + 0) (0 + 0 + t13)
    // (t21*cos + t22*sin + 0) (t21*-sin + t22*cos + 0) (0 + 0 + t23)
    // (t31*cos + t32*sin + 0) (t31*-sin + t32*cos + 0) (0 + 0 + t33)
    //
    // (t11*cos + t12*sin) (t12*cos - t11*sin) (t13)
    // (t21*cos + t22*sin) (t22*cos - t21*sin) (t23)
    // (t31*cos + t32*sin) (t32*cos - t31*sin) (t33)
    //
    // o11=(t11*cos + t12*sin)  o12=(t12*cos - t11*sin)  o13=t13
    // o21=(t21*cos + t22*sin)  o22=(t22*cos - t21*sin)  o23=t23
    // o31=(t31*cos + t32*sin)  o32=(t32*cos - t31*sin)  o33=t33
    //
    // o11 = t11*cos + t12*sin  o12 = t12*cos - t11*sin
    // o21 = t21*cos + t22*sin  o22 = t22*cos - t21*sin
    // o31 = t31*cos + t32*sin  o32 = t32*cos - t31*sin

    const t11 = a[0];  const t12 = a[1];
    const t21 = a[3];  const t22 = a[4];
    const t31 = a[6];  const t32 = a[7];

    a[0] = t11*cos + t12*sin;  a[1] = t12*cos - t11*sin;
    a[3] = t21*cos + t22*sin;  a[4] = t22*cos - t21*sin;
    a[6] = t31*cos + t32*sin;  a[7] = t32*cos - t31*sin;
};