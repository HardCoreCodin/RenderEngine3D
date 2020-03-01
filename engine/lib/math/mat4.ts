export const set_a_4x4_matrix_to_the_identity_matrix = (
    a: Float32Array
) : void => {
    a[0] = a[5] = a[10] = a[15] = 1;
    a[1] = a[2] = a[3] =
    a[4] = a[6] = a[7] =
    a[8] = a[9] = a[11] =
    a[12] = a[13] = a[14] = 0;
};

export const invert_a_4x4_matrix_to_out = (
    a: Float32Array,
    o: Float32Array
) : void => {
    o[3] = a[3];  o[0] = a[0];  o[1] = a[4];  o[2] = a[8];  o[6] = a[9];
    o[7] = a[7];  o[5] = a[5];  o[4] = a[1];  o[8] = a[2];  o[9] = a[6];
    o[11] = a[11];  o[10] = a[10];

    o[12] = -(a[12]*a[0] + a[13]*a[1] + a[14]*a[2]);
    o[13] = -(a[12]*a[4] + a[13]*a[5] + a[14]*a[6]);
    o[14] = -(a[12]*a[8] + a[13]*a[9] + a[14]*a[10]);
    o[15] = 1;
};

export const invert_a_4x4_matrix_in_place = (
    a: Float32Array
) : void => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    const t11 = a[0];  const t21 = a[4];  const t31 = a[8];  const t41 = a[12];
    const t12 = a[1];  const t22 = a[5];  const t32 = a[9];  const t42 = a[13];
    const t13 = a[2];  const t23 = a[6];  const t33 = a[10];  const t43 = a[14];

    // Transpose the rotation portion of the matrix:
    a[4] = t12;  a[8] = t13;
    a[1] = t21;  a[9] = t23;
    a[2] = t31;  a[6] = t32;

    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    a[12] = -(t41*t11 + t42*t12 + t43*t13); // -Dot(original_translation, original_rotation_x)
    a[13] = -(t41*t21 + t42*t22 + t43*t23); // -Dot(original_translation, original_rotation_y)
    a[14] = -(t41*t31 + t42*t32 + t43*t33); // -Dot(original_translation, original_rotation_z)
    a[15] = 1;
};

export const transpose_a_4x4_matrix_to_out = (
    a: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0];  o[4] = a[1];  o[8] = a[2];  o[12] = a[3];
    o[1] = a[4];  o[5] = a[5];  o[9] = a[6];  o[13] = a[7];
    o[2] = a[8];  o[6] = a[9];  o[10] = a[10];  o[14] = a[11];
    o[3] = a[12];  o[7] = a[13];  o[11] = a[14];  o[15] = a[15];
};

export const transpose_a_4x4_matrix_in_place = (
    a: Float32Array
) : void => {[
    a[1], a[2], a[3], a[4], a[6], a[7], a[8], a[9], a[11], a[12], a[13], a[14]] = [
    a[4], a[8], a[12], a[1], a[9], a[13], a[2], a[6], a[14], a[3], a[7], a[11]]
};

export const check_if_two_4x4_matrices_are_equal = (
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

    a[8].toFixed(3) === b[8].toFixed(3) &&
    a[9].toFixed(3) === b[9].toFixed(3) &&
    a[10].toFixed(3) === b[10].toFixed(3) &&
    a[11].toFixed(3) === b[11].toFixed(3) &&

    a[12].toFixed(3) === b[12].toFixed(3) &&
    a[13].toFixed(3) === b[13].toFixed(3) &&
    a[14].toFixed(3) === b[14].toFixed(3) &&
    a[15].toFixed(3) === b[15].toFixed(3);

export const check_if_a_4x4_matrix_is_the_identity_matrix = (
    a: Float32Array
) : boolean =>
    a[0] === 1  &&  a[4] === 0  &&  a[8] === 0  &&  a[12] === 0 &&
    a[1] === 0  &&  a[5] === 1  &&  a[9] === 0  &&  a[13] === 0 &&
    a[2] === 0  &&  a[6] === 0  &&  a[10] === 1  &&  a[14] === 0 &&
    a[3] === 0  &&  a[7] === 0  &&  a[11] === 0  &&  a[15] === 1;

export const add_a_4x4_matrix_to_another_4x4_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] + b[0];  o[4] = a[4] + b[4];  o[8] = a[8] + b[8];  o[12] = a[12] + b[12];
    o[1] = a[1] + b[1];  o[5] = a[5] + b[5];  o[9] = a[9] + b[9];  o[13] = a[13] + b[13];
    o[2] = a[2] + b[2];  o[6] = a[6] + b[6];  o[10] = a[10] + b[10];  o[14] = a[14] + b[14];
    o[3] = a[3] + b[3];  o[7] = a[7] + b[7];  o[11] = a[11] + b[11];  o[15] = a[15] + b[15];
};

export const add_a_4x4_matrix_to_another_4x4_matrix_in_place = (
    a: Float32Array,
    b: Float32Array,
) : void => {
    a[0] += b[0];  a[4] += b[4];  a[8] += b[8];  a[12] += b[12];
    a[1] += b[1];  a[5] += b[5];  a[9] += b[9];  a[13] += b[13];
    a[2] += b[2];  a[6] += b[6];  a[10] += b[10];  a[14] += b[14];
    a[3] += b[3];  a[7] += b[7];  a[11] += b[11];  a[15] += b[15];
};

export const add_a_number_to_a_4x4_matrix_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] + b;  o[4] = a[4] + b;  o[8] = a[8] + b;  o[12] = a[12] + b;
    o[1] = a[1] + b;  o[5] = a[5] + b;  o[9] = a[9] + b;  o[13] = a[13] + b;
    o[2] = a[2] + b;  o[6] = a[6] + b;  o[10] = a[10] + b;  o[14] = a[14] + b;
    o[3] = a[3] + b;  o[7] = a[7] + b;  o[11] = a[11] + b;  o[15] = a[15] + b;
};

export const add_a_number_to_a_4x4_matrix_in_place = (
    a: Float32Array,
    b: number,
) : void => {
    a[0] += b;  a[4] += b;  a[8] += b;  a[12] += b;
    a[1] += b;  a[5] += b;  a[9] += b;  a[13] += b;
    a[2] += b;  a[6] += b;  a[10] += b;  a[14] += b;
    a[3] += b;  a[7] += b;  a[11] += b;  a[15] += b;
};

export const subtract_a_4x4_matrix_from_another_4x4_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] - b[0];  o[4] = a[4] - b[4];  o[8] = a[8] - b[8];  o[12] = a[12] - b[12];
    o[1] = a[1] - b[1];  o[5] = a[5] - b[5];  o[9] = a[9] - b[9];  o[13] = a[13] - b[13];
    o[2] = a[2] - b[2];  o[6] = a[6] - b[6];  o[10] = a[10] - b[10];  o[14] = a[14] - b[14];
    o[3] = a[3] - b[3];  o[7] = a[7] - b[7];  o[11] = a[11] - b[11];  o[15] = a[15] - b[15];
};

export const subtract_a_4x4_matrix_from_another_4x4_matrix_in_place = (
    a: Float32Array,
    b: Float32Array,
) : void => {
    a[0] -= b[0];  a[4] -= b[4];  a[8] -= b[8];  a[12] -= b[12];
    a[1] -= b[1];  a[5] -= b[5];  a[9] -= b[9];  a[13] -= b[13];
    a[2] -= b[2];  a[6] -= b[6];  a[10] -= b[10];  a[14] -= b[14];
    a[3] -= b[3];  a[7] -= b[7];  a[11] -= b[11];  a[15] -= b[15];
};

export const subtract_a_number_from_a_4x4_matrix_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] - b;  o[4] = a[4] - b;  o[8] = a[8] - b;  o[12] = a[12] - b;
    o[1] = a[1] - b;  o[5] = a[5] - b;  o[9] = a[9] - b;  o[13] = a[13] - b;
    o[2] = a[2] - b;  o[6] = a[6] - b;  o[10] = a[10] - b;  o[14] = a[14] - b;
    o[3] = a[3] - b;  o[7] = a[7] - b;  o[11] = a[11] - b;  o[15] = a[15] - b;
};

export const subtract_a_number_from_a_4x4_matrix_in_place = (
    a: Float32Array,
    b: number,
) : void => {
    a[0] -= b;  a[4] -= b;  a[8] -= b;  a[12] -= b;
    a[1] -= b;  a[5] -= b;  a[9] -= b;  a[13] -= b;
    a[2] -= b;  a[6] -= b;  a[10] -= b;  a[14] -= b;
    a[3] -= b;  a[7] -= b;  a[11] -= b;  a[15] -= b;
};

export const divide_a_4x4_matrix_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] / b;  o[4] = a[4] / b;  o[8] = a[8] / b;  o[12] = a[12] / b;
    o[1] = a[1] / b;  o[5] = a[5] / b;  o[9] = a[9] / b;  o[13] = a[13] / b;
    o[2] = a[2] / b;  o[6] = a[6] / b;  o[10] = a[10] / b;  o[14] = a[14] / b;
    o[3] = a[3] / b;  o[7] = a[7] / b;  o[11] = a[11] / b;  o[15] = a[15] / b;
};

export const divide_a_4x4_matrix_by_a_number_in_place = (
    a: Float32Array,
    b: number,
) : void => {
    a[0] /= b;  a[4] /= b;  a[8] /= b;  a[12] /= b;
    a[1] /= b;  a[5] /= b;  a[9] /= b;  a[13] /= b;
    a[2] /= b;  a[6] /= b;  a[10] /= b;  a[14] /= b;
    a[3] /= b;  a[7] /= b;  a[11] /= b;  a[15] /= b;
};

export const multiply_a_4x4_matrix_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] * b;  o[4] = a[4] * b;  o[8] = a[8] * b;  o[12] = a[12] * b;
    o[1] = a[1] * b;  o[5] = a[5] * b;  o[9] = a[9] * b;  o[13] = a[13] * b;
    o[2] = a[2] * b;  o[6] = a[6] * b;  o[10] = a[10] * b;  o[14] = a[14] * b;
    o[3] = a[3] * b;  o[7] = a[7] * b;  o[11] = a[11] * b;  o[15] = a[15] * b;
};

export const multiply_a_4x4_matrix_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] *= b;  a[4] *= b;  a[8] *= b;  a[12] *= b;
    a[1] *= b;  a[5] *= b;  a[9] *= b;  a[13] *= b;
    a[2] *= b;  a[6] *= b;  a[10] *= b;  a[14] *= b;
    a[3] *= b;  a[7] *= b;  a[11] *= b;  a[15] *= b;
};

export const multiply_a_4x4_matrix_by_another_4x4_matrix_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0]*b[0] + a[1]*b[4] + a[2]*b[8] + a[3]*b[12]; // Row 1 | Column 1
    o[1] = a[0]*b[1] + a[1]*b[5] + a[2]*b[9] + a[3]*b[13]; // Row 1 | Column 2
    o[2] = a[0]*b[2] + a[1]*b[6] + a[2]*b[10] + a[3]*b[14]; // Row 1 | Column 3
    o[3] = a[0]*b[3] + a[1]*b[7] + a[2]*b[11] + a[3]*b[15]; // Row 1 | Column 4

    o[4] = a[4]*b[0] + a[5]*b[4] + a[6]*b[8] + a[7]*b[12]; // Row 2 | Column 1
    o[5] = a[4]*b[1] + a[5]*b[5] + a[6]*b[9] + a[7]*b[13]; // Row 2 | Column 2
    o[6] = a[4]*b[2] + a[5]*b[6] + a[6]*b[10] + a[7]*b[14]; // Row 2 | Column 3
    o[7] = a[4]*b[3] + a[5]*b[7] + a[6]*b[11] + a[7]*b[15]; // Row 2 | Column 4

    o[8] = a[8]*b[0] + a[9]*b[4] + a[10]*b[8] + a[11]*b[12]; // Row 3 | Column 1
    o[9] = a[8]*b[1] + a[9]*b[5] + a[10]*b[9] + a[11]*b[13]; // Row 3 | Column 2
    o[10] = a[8]*b[2] + a[9]*b[6] + a[10]*b[10] + a[11]*b[14]; // Row 3 | Column 3
    o[11] = a[8]*b[3] + a[9]*b[7] + a[10]*b[11] + a[11]*b[15]; // Row 3 | Column 4

    o[12] = a[12]*b[0] + a[13]*b[4] + a[14]*b[8] + a[15]*b[12]; // Row 4 | Column 1
    o[13] = a[12]*b[1] + a[13]*b[5] + a[14]*b[9] + a[15]*b[13]; // Row 4 | Column 2
    o[14] = a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14]; // Row 4 | Column 3
    o[15] = a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15]; // Row 4 | Column 4
};

export const multiply_a_4x4_matrix_by_another_4x4_matrix_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    const t11 = a[0];  const t12 = a[1];  const t13 = a[2];  const t14 = a[3];
    const t21 = a[4];  const t22 = a[5];  const t23 = a[6];  const t24 = a[7];
    const t31 = a[8];  const t32 = a[9];  const t33 = a[10];  const t34 = a[11];
    const t41 = a[12];  const t42 = a[13];  const t43 = a[14];  const t44 = a[15];

    a[0] = t11*b[0] + t12*b[4] + t13*b[8] + t14*b[12]; // Row 1 | Column 1
    a[4] = t21*b[0] + t22*b[4] + t23*b[8] + t24*b[12]; // Row 2 | Column 1
    a[8] = t31*b[0] + t32*b[4] + t33*b[8] + t34*b[12]; // Row 3 | Column 1
    a[12] = t41*b[0] + t42*b[4] + t43*b[8] + t44*b[12]; // Row 4 | Column 1

    a[1] = t11*b[1] + t12*b[5] + t13*b[9] + t14*b[13]; // Row 1 | Column 2
    a[5] = t21*b[1] + t22*b[5] + t23*b[9] + t24*b[13]; // Row 2 | Column 2
    a[9] = t31*b[1] + t32*b[5] + t33*b[9] + t34*b[13]; // Row 3 | Column 2
    a[13] = t41*b[1] + t42*b[5] + t43*b[9] + t44*b[13]; // Row 4 | Column 2

    a[2] = t11*b[2] + t12*b[6] + t13*b[10] + t14*b[14]; // Row 1 | Column 3
    a[6] = t21*b[2] + t22*b[6] + t23*b[10] + t24*b[14]; // Row 2 | Column 3
    a[10] = t31*b[2] + t32*b[6] + t33*b[10] + t34*b[14]; // Row 3 | Column 3
    a[14] = t41*b[2] + t42*b[6] + t43*b[10] + t44*b[14]; // Row 4 | Column 3

    a[3] = t11*b[3] + t12*b[7] + t13*b[11] + t14*b[15]; // Row 1 | Column 4
    a[7] = t21*b[3] + t22*b[7] + t23*b[11] + t24*b[15]; // Row 2 | Column 4
    a[11] = t31*b[3] + t32*b[7] + t33*b[11] + t34*b[15]; // Row 3 | Column 4
    a[15] = t41*b[3] + t42*b[7] + t43*b[11] + t44*b[15]; // Row 4 | Column 4
};

export const set_a_4x4_matrix_to_a_rotation_around_x_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    a[10] = a[5] = cos;
    a[6] = sin;
    a[9] = -sin;
};

export const set_a_4x4_matrix_to_a_rotation_around_y_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    a[0] = a[10] = cos;
    a[2] = sin;
    a[8] = -sin;
};

export const set_a_4x4_matrix_to_a_rotation_around_z_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    a[0] = a[5] = cos;
    a[1] = sin;
    a[4] = -sin;
};

export const rotate_a_4x4_matrix_around_x_to_out = (
    a: Float32Array,
    sin: number,
    cos: number,
    o: Float32Array
) : void => {
    // t11 t12 t13 t14     r11 r12 r13 r14
    // t21 t22 t23 t24  *  r21 r22 r23 r24
    // t31 t32 t33 t34     r31 r32 r33 r34
    // t41 t42 t43 t44     r41 r42 r43 r44
    //
    // (t11 t12 t13 t14).(r11 r21 r31 r41) (t11 t12 t13 t14).(r12 r22 r32 r42) (t11 t12 t13 t14).(r13 r23 r33 r43) (t11 t12 t13 t14).(r14 r24 r34 r44)
    // (t21 t22 t23 t24).(r11 r21 r31 r41) (t21 t22 t23 t24).(r12 r22 r32 r42) (t21 t22 t23 t24).(r13 r23 r33 r43) (t21 t22 t23 t24).(r14 r24 r34 r44)
    // (t31 t32 t33 t34).(r11 r21 r31 r41) (t31 t32 t33 t34).(r12 r22 r32 r42) (t31 t32 t33 t34).(r13 r23 r33 r43) (t31 t32 t33 t34).(r14 r24 r34 r44)
    // (t41 t42 t43 t44).(r11 r21 r31 r41) (t41 t42 t43 t44).(r12 r22 r32 r42) (t41 t42 t43 t44).(r13 r23 r33 r43) (t41 t42 t43 t44).(r14 r24 r34 r44)
    //
    // r11 r12 r13 r14   1   0     0   0
    // r21 r22 r23 r24 = 0  cos  -sin  0
    // r31 r32 r33 r34   0  sin   cos  0
    // r41 r42 r44 r44   0   0     0   1
    //
    // (t11 t12 t13 t14).(1 0 0 0) (t11 t12 t13 t14).(0 cos sin 0) (t11 t12 t13 t14).(0 -sin cos 0) (t11 t12 t13 t14).(0 0 0 1)
    // (t21 t22 t23 t24).(1 0 0 0) (t21 t22 t23 t24).(0 cos sin 0) (t21 t22 t23 t24).(0 -sin cos 0) (t21 t22 t23 t24).(0 0 0 1)
    // (t31 t32 t33 t34).(1 0 0 0) (t31 t32 t33 t34).(0 cos sin 0) (t31 t32 t33 t34).(0 -sin cos 0) (t31 t32 t33 t34).(0 0 0 1)
    // (t41 t42 t43 t44).(1 0 0 0) (t41 t42 t43 t44).(0 cos sin 0) (t41 t42 t43 t44).(0 -sin cos 0) (t41 t42 t43 t44).(0 0 0 1)
    //
    // (t11*1 + t12*0 + t13*0 + t14*0) (t11*0 + t12*cos + t13*sin + t14*0) (t11*0 + t12*-sin + t13*cos + t14*0) (t11*0 t12*0 t13*0 t14*1)
    // (t21*1 + t22*0 + t23*0 + t24*0) (t21*0 + t22*cos + t23*sin + t24*0) (t21*0 + t22*-sin + t23*cos + t24*0) (t21*0 t22*0 t23*0 t24*1)
    // (t31*1 + t32*0 + t33*0 + t34*0) (t31*0 + t32*cos + t33*sin + t34*0) (t31*0 + t32*-sin + t33*cos + t34*0) (t31*0 t32*0 t33*0 t34*1)
    // (t41*1 + t42*0 + t43*0 + t44*0) (t41*0 + t42*cos + t43*sin + t44*0) (t41*0 + t42*-sin + t43*cos + t44*0) (t41*0 t42*0 t43*0 t44*1)
    //
    // (t11 + 0 + 0 + 0) (0 + t12*cos + t13*sin + 0) (0 - t12*sin + t13*cos + 0) (0 + 0 + 0 + t14)
    // (t21 + 0 + 0 + 0) (0 + t22*cos + t23*sin + 0) (0 - t22*sin + t23*cos + 0) (0 + 0 + 0 + t24)
    // (t31 + 0 + 0 + 0) (0 + t32*cos + t33*sin + 0) (0 - t32*sin + t33*cos + 0) (0 + 0 + 0 + t34)
    // (t41 + 0 + 0 + 0) (0 + t42*cos + t43*sin + 0) (0 - t42*sin + t43*cos + 0) (0 + 0 + 0 + t44)
    //
    // (t11) (t12*cos + t13*sin) (t13*cos - t12*sin) (t14)
    // (t21) (t22*cos + t23*sin) (t23*cos - t22*sin) (t24)
    // (t31) (t32*cos + t33*sin) (t33*cos - t32*sin) (t34)
    // (t41) (t42*cos + t43*sin) (t43*cos - t42*sin) (t44)
    //
    // o11=t11  o12=(t13*sin + t12*cos)  o13=(t13*cos - t12*sin)  o14=t14
    // o21=t21  o22=(t23*sin + t22*cos)  o23=(t23*cos - t22*sin)  o24=t24
    // o31=t31  o32=(t33*sin + t32*cos)  o33=(t33*cos - t32*sin)  o34=t34
    // o41=t41  o42=(t43*sin + t42*cos)  o43=(t43*cos - t42*sin)  o44=t44
    //
    // o11 = t11  o12 = t13*sin + t12*cos  o13 = t13*cos - t12*sin  o14 = t14
    // o21 = t21  o22 = t23*sin + t22*cos  o23 = t23*cos - t22*sin  o24 = t24
    // o31 = t31  o32 = t33*sin + t32*cos  o33 = t33*cos - t32*sin  o34 = t34
    // o41 = t41  o42 = t43*sin + t42*cos  o33 = t43*cos - t42*sin  o44 = t44

    o[0] = a[0];  o[1] = a[2]*sin + a[1]*cos;  o[2] = a[2]*cos - a[1]*sin;  o[3] = a[3];
    o[4] = a[4];  o[5] = a[6]*sin + a[5]*cos;  o[6] = a[6]*cos - a[5]*sin;  o[7] = a[7];
    o[8] = a[8];  o[9] = a[10]*sin + a[9]*cos;  o[10] = a[10]*cos - a[9]*sin;  o[11] = a[11];
    o[12] = a[12];  o[13] = a[14]*sin + a[13]*cos;  o[14] = a[14]*cos - a[13]*sin;  o[15] = a[15];
};

export const rotate_a_4x4_matrix_around_x_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    // t11 t12 t13 t14      r11 r12 r13 r14
    // t21 t22 t23 t24  *=  r21 r22 r23 r24
    // t31 t32 t33 t34      r31 r32 r33 r34
    // t41 t42 t43 t44      r41 r42 r43 r44
    //
    // (t11 t12 t13 t14).(r11 r21 r31 r41) (t11 t12 t13 t14).(r12 r22 r32 r42) (t11 t12 t13 t14).(r13 r23 r33 r43) (t11 t12 t13 t14).(r14 r24 r34 r44)
    // (t21 t22 t23 t24).(r11 r21 r31 r41) (t21 t22 t23 t24).(r12 r22 r32 r42) (t21 t22 t23 t24).(r13 r23 r33 r43) (t21 t22 t23 t24).(r14 r24 r34 r44)
    // (t31 t32 t33 t34).(r11 r21 r31 r41) (t31 t32 t33 t34).(r12 r22 r32 r42) (t31 t32 t33 t34).(r13 r23 r33 r43) (t31 t32 t33 t34).(r14 r24 r34 r44)
    // (t41 t42 t43 t44).(r11 r21 r31 r41) (t41 t42 t43 t44).(r12 r22 r32 r42) (t41 t42 t43 t44).(r13 r23 r33 r43) (t41 t42 t43 t44).(r14 r24 r34 r44)
    //
    // r11 r12 r13 r14   1   0     0   0
    // r21 r22 r23 r24 = 0  cos  -sin  0
    // r31 r32 r33 r34   0  sin   cos  0
    // r41 r42 r44 r44   0   0     0   1
    //
    // (t11 t12 t13 t14).(1 0 0 0) (t11 t12 t13 t14).(0 cos sin 0) (t11 t12 t13 t14).(0 -sin cos 0) (t11 t12 t13 t14).(0 0 0 1)
    // (t21 t22 t23 t24).(1 0 0 0) (t21 t22 t23 t24).(0 cos sin 0) (t21 t22 t23 t24).(0 -sin cos 0) (t21 t22 t23 t24).(0 0 0 1)
    // (t31 t32 t33 t34).(1 0 0 0) (t31 t32 t33 t34).(0 cos sin 0) (t31 t32 t33 t34).(0 -sin cos 0) (t31 t32 t33 t34).(0 0 0 1)
    // (t41 t42 t43 t44).(1 0 0 0) (t41 t42 t43 t44).(0 cos sin 0) (t41 t42 t43 t44).(0 -sin cos 0) (t41 t42 t43 t44).(0 0 0 1)
    //
    // (t11*1 + t12*0 + t13*0 + t14*0) (t11*0 + t12*cos + t13*sin + t14*0) (t11*0 - t12*sin + t13*cos + t14*0) (t11*0 t12*0 t13*0 t14*1)
    // (t21*1 + t22*0 + t23*0 + t24*0) (t21*0 + t22*cos + t23*sin + t24*0) (t21*0 - t22*sin + t23*cos + t24*0) (t21*0 t22*0 t23*0 t24*1)
    // (t31*1 + t32*0 + t33*0 + t34*0) (t31*0 + t32*cos + t33*sin + t34*0) (t31*0 - t32*sin + t33*cos + t34*0) (t31*0 t32*0 t33*0 t34*1)
    // (t41*1 + t42*0 + t43*0 + t44*0) (t41*0 + t42*cos + t43*sin + t44*0) (t41*0 - t42*sin + t43*cos + t44*0) (t41*0 t42*0 t43*0 t44*1)
    //
    // (t11 + 0 + 0 + 0) (0 + t12*cos + t13*sin + 0) (0 - t12*sin + t13*cos + 0) (0 + 0 + 0 + t14)
    // (t21 + 0 + 0 + 0) (0 + t22*cos + t23*sin + 0) (0 - t22*sin + t23*cos + 0) (0 + 0 + 0 + t24)
    // (t31 + 0 + 0 + 0) (0 + t32*cos + t33*sin + 0) (0 - t32*sin + t33*cos + 0) (0 + 0 + 0 + t34)
    // (t41 + 0 + 0 + 0) (0 + t42*cos + t43*sin + 0) (0 - t42*sin + t43*cos + 0) (0 + 0 + 0 + t44)
    //
    // (t11) (t12*cos + t13*sin) (t13*cos - t12*sin) (t14)
    // (t21) (t22*cos + t23*sin) (t23*cos - t22*sin) (t24)
    // (t31) (t32*cos + t33*sin) (t33*cos - t32*sin) (t34)
    // (t41) (t42*cos + t43*sin) (t43*cos - t42*sin) (t44)
    //
    // o11=t11  o12=(t12*cos + t13*sin)  o13=(t13*cos - t12*sin)  o14=t14
    // o21=t21  o22=(t22*cos + t23*sin)  o23=(t23*cos - t22*sin)  o24=t24
    // o31=t31  o32=(t32*cos + t33*sin)  o33=(t33*cos - t32*sin)  o34=t34
    // o41=t41  o42=(t42*cos + t43*sin)  o43=(t43*cos - t42*sin)  o44=t44
    //
    // o12 = t12*cos + t13*sin  o13 = t13*cos - t12*sin
    // o22 = t22*cos + t23*sin  o23 = t23*cos - t22*sin
    // o32 = t32*cos + t33*sin  o33 = t33*cos - t32*sin
    // o42 = t42*cos + t43*sin  o33 = t43*cos - t42*sin

    const t12 = a[1];  const t13 = a[2];
    const t22 = a[5];  const t23 = a[6];
    const t32 = a[9];  const t33 = a[10];
    const t42 = a[13];  const t43 = a[14];

    a[1] = t12*cos + t13*sin;  a[2] = t13*cos - t12*sin;
    a[5] = t22*cos + t23*sin;  a[6] = t23*cos - t22*sin;
    a[9] = t32*cos + t33*sin;  a[10] = t33*cos - t32*sin;
    a[13] = t42*cos + t43*sin;  a[14] = t43*cos - t42*sin;
};

export const rotate_a_4x4_matrix_around_y_to_out = (
    a: Float32Array,
    sin: number,
    cos: number,
    o: Float32Array
) : void => {
    // t11 t12 t13 t14     r11 r12 r13 r14
    // t21 t22 t23 t24  *  r21 r22 r23 r24
    // t31 t32 t33 t34     r31 r32 r33 r34
    // t41 t42 t43 t44     r41 r42 r43 r44
    //
    // (t11 t12 t13 t14).(r11 r21 r31 r41) (t11 t12 t13 t14).(r12 r22 r32 r42) (t11 t12 t13 t14).(r13 r23 r33 r43) (t11 t12 t13 t14).(r14 r24 r34 r44)
    // (t21 t22 t23 t24).(r11 r21 r31 r41) (t21 t22 t23 t24).(r12 r22 r32 r42) (t21 t22 t23 t24).(r13 r23 r33 r43) (t21 t22 t23 t24).(r14 r24 r34 r44)
    // (t31 t32 t33 t34).(r11 r21 r31 r41) (t31 t32 t33 t34).(r12 r22 r32 r42) (t31 t32 t33 t34).(r13 r23 r33 r43) (t31 t32 t33 t34).(r14 r24 r34 r44)
    // (t41 t42 t43 t44).(r11 r21 r31 r41) (t41 t42 t43 t44).(r12 r22 r32 r42) (t41 t42 t43 t44).(r13 r23 r33 r43) (t41 t42 t43 t44).(r14 r24 r34 r44)
    //
    // r11 r12 r13 r14    cos   0   sin  0
    // r21 r22 r23 r24  =  0    1    0   0
    // r31 r32 r33 r34   -sin   0   cos  0
    // r41 r42 r44 r44     0    0    0   1
    //
    // (t11 t12 t13 r14).(cos 0 -sin 0) (t11 t12 t13 r14).(0 1 0 0) (t11 t12 t13 r14).(sin 0 cos 0) (t11 t12 t13 t14).(0 0 0 1)
    // (t21 t22 t23 r24).(cos 0 -sin 0) (t21 t22 t23 r24).(0 1 0 0) (t21 t22 t23 r24).(sin 0 cos 0) (t21 t22 t23 t24).(0 0 0 1)
    // (t31 t32 t33 r34).(cos 0 -sin 0) (t31 t32 t33 r34).(0 1 0 0) (t31 t32 t33 r34).(sin 0 cos 0) (t31 t32 t33 t34).(0 0 0 1)
    // (t41 t42 t43 r44).(cos 0 -sin 0) (t41 t42 t43 r44).(0 1 0 0) (t41 t42 t43 r44).(sin 0 cos 0) (t41 t42 t43 t44).(0 0 0 1)
    //
    // (t11*cos + t12*0 + t13*-sin + t14*0) (t11*0 + t12*1 + t13*0 + t14*0) (t11*sin + t12*0 + t13*cos + t14*0) (t11*0 t12*0 t13*0 t14*1)
    // (t21*cos + t22*0 + t23*-sin + t24*0) (t21*0 + t22*1 + t23*0 + t24*0) (t21*sin + t22*0 + t23*cos + t24*0) (t21*0 t22*0 t23*0 t24*1)
    // (t31*cos + t32*0 + t33*-sin + t34*0) (t31*0 + t32*1 + t33*0 + t34*0) (t31*sin + t32*0 + t33*cos + t34*0) (t31*0 t32*0 t33*0 t34*1)
    // (t41*cos + t42*0 + t43*-sin + t44*0) (t41*0 + t42*1 + t43*0 + t44*0) (t41*sin + t42*0 + t43*cos + t44*0) (t41*0 t42*0 t43*0 t44*1)
    //
    // (t11*con + 0 + t13*-sin + 0) (0 + t12 + 0 + 0) (t11*sin + 0 + t13*cos + 0) (0 + 0 + 0 + t14)
    // (t21*con + 0 + t23*-sin + 0) (0 + t22 + 0 + 0) (t21*sin + 0 + t23*cos + 0) (0 + 0 + 0 + t24)
    // (t31*con + 0 + t33*-sin + 0) (0 + t32 + 0 + 0) (t31*sin + 0 + t33*cos + 0) (0 + 0 + 0 + t34)
    // (t41*con + 0 + t43*-sin + 0) (0 + t42 + 0 + 0) (t41*sin + 0 + t34*cos + 0) (0 + 0 + 0 + t44)
    //
    // (t11*cos - t13*sin) (t12) (t11*sin + t13*cos) (t14)
    // (t21*cos - t23*sin) (t22) (t21*sin + t23*cos) (t24)
    // (t31*cos - t33*sin) (t32) (t31*sin + t33*cos) (t34)
    // (t41*cos - t43*sin) (t42) (t41*sin + t43*cos) (t44)
    //
    // o11=(t11*cos - t13*sin)  o12=t12  o13=(t11*sin + t13*cos)  o14=t14
    // o21=(t21*cos - t23*sin)  o22=t22  o23=(t21*sin + t23*cos)  o24=t24
    // o31=(t31*cos - t33*sin)  o32=t32  o33=(t31*sin + t33*cos)  o34=t34
    // o41=(t41*cos - t43*sin)  o42=t42  o43=(t41*sin + t43*cos)  o44=t44
    //
    // o11 = t11*cos - t13*sin  o12 = t12  o13 = t11*sin + t13*cos  o14 = t14
    // o21 = t21*cos - t23*sin  o22 = t22  o23 = t21*sin + t23*cos  o24 = t24
    // o31 = t31*cos - t33*sin  o32 = t32  o33 = t31*sin + t33*cos  o34 = t34
    // o41 = t41*cos - t43*sin  o42 = t42  o43 = t41*sin + t43*cos  o44 = t44

    o[0] = a[0]*cos - a[2]*sin;  o[1] = a[1];  o[2] = a[0]*sin + a[2]*cos;  o[3] = a[3];
    o[4] = a[4]*cos - a[6]*sin;  o[5] = a[5];  o[6] = a[4]*sin + a[6]*cos;  o[7] = a[7];
    o[8] = a[8]*cos - a[10]*sin;  o[9] = a[9];  o[10] = a[8]*sin + a[10]*cos;  o[11] = a[11];
    o[12] = a[12]*cos - a[14]*sin;  o[13] = a[13];  o[14] = a[12]*sin + a[14]*cos;  o[15] = a[15];
};

export const rotate_a_4x4_matrix_around_y_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    // t11 t12 t13 t14      r11 r12 r13 r14
    // t21 t22 t23 t24  *=  r21 r22 r23 r24
    // t31 t32 t33 t34      r31 r32 r33 r34
    // t41 t42 t43 t44      r41 r42 r43 r44
    //
    // (t11 t12 t13 t14).(r11 r21 r31 r41) (t11 t12 t13 t14).(r12 r22 r32 r42) (t11 t12 t13 t14).(r13 r23 r33 r43) (t11 t12 t13 t14).(r14 r24 r34 r44)
    // (t21 t22 t23 t24).(r11 r21 r31 r41) (t21 t22 t23 t24).(r12 r22 r32 r42) (t21 t22 t23 t24).(r13 r23 r33 r43) (t21 t22 t23 t24).(r14 r24 r34 r44)
    // (t31 t32 t33 t34).(r11 r21 r31 r41) (t31 t32 t33 t34).(r12 r22 r32 r42) (t31 t32 t33 t34).(r13 r23 r33 r43) (t31 t32 t33 t34).(r14 r24 r34 r44)
    // (t41 t42 t43 t44).(r11 r21 r31 r41) (t41 t42 t43 t44).(r12 r22 r32 r42) (t41 t42 t43 t44).(r13 r23 r33 r43) (t41 t42 t43 t44).(r14 r24 r34 r44)
    //
    // r11 r12 r13 r14    cos   0   sin  0
    // r21 r22 r23 r24  =  0    1    0   0
    // r31 r32 r33 r34   -sin   0   cos  0
    // r41 r42 r44 r44     0    0    0   1
    //
    // (t11 t12 t13 r14).(cos 0 -sin 0) (t11 t12 t13 r14).(0 1 0 0) (t11 t12 t13 r14).(sin 0 cos 0) (t11 t12 t13 t14).(0 0 0 1)
    // (t21 t22 t23 r24).(cos 0 -sin 0) (t21 t22 t23 r24).(0 1 0 0) (t21 t22 t23 r24).(sin 0 cos 0) (t21 t22 t23 t24).(0 0 0 1)
    // (t31 t32 t33 r34).(cos 0 -sin 0) (t31 t32 t33 r34).(0 1 0 0) (t31 t32 t33 r34).(sin 0 cos 0) (t31 t32 t33 t34).(0 0 0 1)
    // (t41 t42 t43 r44).(cos 0 -sin 0) (t41 t42 t43 r44).(0 1 0 0) (t41 t42 t43 r44).(sin 0 cos 0) (t41 t42 t43 t44).(0 0 0 1)
    //
    // (t11*cos + t12*0 + t13*-sin + t14*0) (t11*0 + t12*1 + t13*0 + t14*0) (t11*sin + t12*0 + t13*cos + t14*0) (t11*0 t12*0 t13*0 t14*1)
    // (t21*cos + t22*0 + t23*-sin + t24*0) (t21*0 + t22*1 + t23*0 + t24*0) (t21*sin + t22*0 + t23*cos + t24*0) (t21*0 t22*0 t23*0 t24*1)
    // (t31*cos + t32*0 + t33*-sin + t34*0) (t31*0 + t32*1 + t33*0 + t34*0) (t31*sin + t32*0 + t33*cos + t34*0) (t31*0 t32*0 t33*0 t34*1)
    // (t41*cos + t42*0 + t43*-sin + t44*0) (t41*0 + t42*1 + t43*0 + t44*0) (t41*sin + t42*0 + t43*cos + t44*0) (t41*0 t42*0 t43*0 t44*1)
    //
    // (t11*con + 0 + t13*-sin + 0) (0 + t12 + 0 + 0) (t11*sin + 0 + t13*cos + 0) (0 + 0 + 0 + t14)
    // (t21*con + 0 + t23*-sin + 0) (0 + t22 + 0 + 0) (t21*sin + 0 + t23*cos + 0) (0 + 0 + 0 + t24)
    // (t31*con + 0 + t33*-sin + 0) (0 + t32 + 0 + 0) (t31*sin + 0 + t33*cos + 0) (0 + 0 + 0 + t34)
    // (t41*con + 0 + t43*-sin + 0) (0 + t42 + 0 + 0) (t41*sin + 0 + t34*cos + 0) (0 + 0 + 0 + t44)
    //
    // (t11*cos - t13*sin) (t12) (t11*sin + t13*cos) (t14)
    // (t21*cos - t23*sin) (t22) (t21*sin + t23*cos) (t24)
    // (t31*cos - t33*sin) (t32) (t31*sin + t33*cos) (t34)
    // (t41*cos - t43*sin) (t42) (t41*sin + t43*cos) (t44)
    //
    // o11=(t11*cos + t13*-sin)  o12=t12  o13=(t11*sin + t13*cos)  o14=t14
    // o21=(t21*cos + t23*-sin)  o22=t22  o23=(t21*sin + t23*cos)  o24=t24
    // o31=(t31*cos + t33*-sin)  o32=t32  o33=(t31*sin + t33*cos)  o34=t34
    // o41=(t41*cos + t43*-sin)  o42=t42  o43=(t41*sin + t43*cos)  o44=t44
    //
    // o11 = t11*cos - t13*sin  o13 = t11*sin + t13*cos
    // o21 = t21*cos - t23*sin  o23 = t21*sin + t23*cos
    // o31 = t31*cos - t33*sin  o33 = t31*sin + t33*cos
    // o41 = t41*cos - t43*sin  o43 = t41*sin + t43*cos

    const t11 = a[0];  const t13 = a[2];
    const t21 = a[4];  const t23 = a[6];
    const t31 = a[8];  const t33 = a[10];
    const t41 = a[12];  const t43 = a[14];

    a[0] = t11*cos - t13*sin;  a[2] = t11*sin + t13*cos;
    a[4] = t21*cos - t23*sin;  a[6] = t21*sin + t23*cos;
    a[8] = t31*cos - t33*sin;  a[10] = t31*sin + t33*cos;
    a[12] = t41*cos - t43*sin;  a[14] = t41*sin + t43*cos;
};

export const rotate_a_4x4_matrix_around_z_to_out = (
    a: Float32Array,
    sin: number,
    cos: number,
    o: Float32Array
) : void => {
    // t11 t12 t13 t14     r11 r12 r13 r14
    // t21 t22 t23 t24  *  r21 r22 r23 r24
    // t31 t32 t33 t34     r31 r32 r33 r34
    // t41 t42 t43 t44     r41 r42 r43 r44
    //
    // (t11 t12 t13 t14).(r11 r21 r31 r41) (t11 t12 t13 t14).(r12 r22 r32 r42) (t11 t12 t13 t14).(r13 r23 r33 r43) (t11 t12 t13 t14).(r14 r24 r34 r44)
    // (t21 t22 t23 t24).(r11 r21 r31 r41) (t21 t22 t23 t24).(r12 r22 r32 r42) (t21 t22 t23 t24).(r13 r23 r33 r43) (t21 t22 t23 t24).(r14 r24 r34 r44)
    // (t31 t32 t33 t34).(r11 r21 r31 r41) (t31 t32 t33 t34).(r12 r22 r32 r42) (t31 t32 t33 t34).(r13 r23 r33 r43) (t31 t32 t33 t34).(r14 r24 r34 r44)
    // (t41 t42 t43 t44).(r11 r21 r31 r41) (t41 t42 t43 t44).(r12 r22 r32 r42) (t41 t42 t43 t44).(r13 r23 r33 r43) (t41 t42 t43 t44).(r14 r24 r34 r44)
    //
    // r11 r12 r13 r14     cos  -sin  0  0
    // r21 r22 r23 r24  =  sin   cos  0  0
    // r31 r32 r33 r34      0     0   1  0
    // r41 r42 r44 r44      0     0   0  1
    //
    // (t11 t12 t13 r14).(cos sin 0 0) (t11 t12 t13 r14).(-sin cos 0 0) (t11 t12 t13 r14).(0 0 1 0) (t11 t12 t13 t14).(0 0 0 1)
    // (t21 t22 t23 r24).(cos sin 0 0) (t21 t22 t23 r24).(-sin cos 0 0) (t21 t22 t23 r24).(0 0 1 0) (t21 t22 t23 t24).(0 0 0 1)
    // (t31 t32 t33 r34).(cos sin 0 0) (t31 t32 t33 r34).(-sin cos 0 0) (t31 t32 t33 r34).(0 0 1 0) (t31 t32 t33 t34).(0 0 0 1)
    // (t41 t42 t43 r44).(cos sin 0 0) (t41 t42 t43 r44).(-sin cos 0 0) (t41 t42 t43 r44).(0 0 1 0) (t41 t42 t43 t44).(0 0 0 1)
    //
    // (t11*cos + t12*sin + t13*0 + t14*0) (t11*-sin + t12*cos + t13*0 + t14*0) (t11*0 + t12*0 + t13*1 + t14*0) (t11*0 t12*0 t13*0 t14*1)
    // (t21*cos + t22*sin + t23*0 + t24*0) (t21*-sin + t22*cos + t23*0 + t24*0) (t21*0 + t22*0 + t23*1 + t24*0) (t21*0 t22*0 t23*0 t24*1)
    // (t31*cos + t32*sin + t33*0 + t34*0) (t31*-sin + t32*cos + t33*0 + t34*0) (t31*0 + t32*0 + t33*1 + t34*0) (t31*0 t32*0 t33*0 t34*1)
    // (t41*cos + t42*sin + t43*0 + t44*0) (t41*-sin + t42*cos + t43*0 + t44*0) (t41*0 + t42*0 + t43*1 + t44*0) (t41*0 t42*0 t43*0 t44*1)
    //
    // (t11*cos + t12*sin + 0 + 0) (t11*-sin + t12*cos + 0 + 0) (0 + 0 + t13 + 0) (0 + 0 + 0 + t14)
    // (t21*cos + t22*sin + 0 + 0) (t21*-sin + t22*cos + 0 + 0) (0 + 0 + t23 + 0) (0 + 0 + 0 + t24)
    // (t31*cos + t32*sin + 0 + 0) (t31*-sin + t32*cos + 0 + 0) (0 + 0 + t33 + 0) (0 + 0 + 0 + t34)
    // (t41*cos + t42*sin + 0 + 0) (t41*-sin + t42*cos + 0 + 0) (0 + 0 + t43 + 0) (0 + 0 + 0 + t44)
    //
    // (t11*cos + t12*sin) (t11*-sin + t12*cos) (t13) (t14)
    // (t21*cos + t22*sin) (t21*-sin + t22*cos) (t23) (t24)
    // (t31*cos + t32*sin) (t31*-sin + t32*cos) (t33) (t34)
    // (t41*cos + t42*sin) (t41*-sin + t42*cos) (t43) (t44)
    //
    // o11=(t11*cos + t12*sin)  o12=(t12*cos - t11*sin)  o13=t13  o14=t14
    // o21=(t21*cos + t22*sin)  o22=(t22*cos - t21*sin)  o23=t23  o24=t24
    // o31=(t31*cos + t32*sin)  o32=(t32*cos - t31*sin)  o33=t33  o34=t34
    // o41=(t41*cos + t42*sin)  o42=(t42*cos - t41*sin)  o43=t43  o44=t44
    //
    // o11 = t11*cos + t12*sin  o12 = t12*cos -t11*sin  o13 = t13  o14 = t14
    // o21 = t21*cos + t22*sin  o22 = t22*cos -t21*sin  o23 = t23  o24 = t24
    // o31 = t31*cos + t32*sin  o32 = t32*cos -t31*sin  o33 = t33  o34 = t34
    // o41 = t41*cos + t42*sin  o42 = t42*cos -t41*sin  o43 = t43  o44 = t44

    o[0] = a[0]*cos + a[1]*sin;  o[1] = a[1]*cos - a[0]*sin;  o[2] = a[2];  o[3] = a[3];
    o[4] = a[4]*cos + a[5]*sin;  o[5] = a[5]*cos - a[4]*sin;  o[6] = a[6];  o[7] = a[7];
    o[8] = a[8]*cos + a[9]*sin;  o[9] = a[9]*cos - a[8]*sin;  o[10] = a[10];  o[11] = a[11];
    o[12] = a[12]*cos + a[13]*sin;  o[13] = a[13]*cos - a[12]*sin;  o[14] = a[14];  o[15] = a[15];
};

export const rotate_a_4x4_matrix_around_z_in_place = (
    a: Float32Array,
    sin: number,
    cos: number
) : void => {
    // t11 t12 t13 t14      r11 r12 r13 r14
    // t21 t22 t23 t24  *=  r21 r22 r23 r24
    // t31 t32 t33 t34      r31 r32 r33 r34
    // t41 t42 t43 t44      r41 r42 r43 r44
    //
    // (t11 t12 t13 t14).(r11 r21 r31 r41) (t11 t12 t13 t14).(r12 r22 r32 r42) (t11 t12 t13 t14).(r13 r23 r33 r43) (t11 t12 t13 t14).(r14 r24 r34 r44)
    // (t21 t22 t23 t24).(r11 r21 r31 r41) (t21 t22 t23 t24).(r12 r22 r32 r42) (t21 t22 t23 t24).(r13 r23 r33 r43) (t21 t22 t23 t24).(r14 r24 r34 r44)
    // (t31 t32 t33 t34).(r11 r21 r31 r41) (t31 t32 t33 t34).(r12 r22 r32 r42) (t31 t32 t33 t34).(r13 r23 r33 r43) (t31 t32 t33 t34).(r14 r24 r34 r44)
    // (t41 t42 t43 t44).(r11 r21 r31 r41) (t41 t42 t43 t44).(r12 r22 r32 r42) (t41 t42 t43 t44).(r13 r23 r33 r43) (t41 t42 t43 t44).(r14 r24 r34 r44)
    //
    // r11 r12 r13 r14     cos  -sin  0  0
    // r21 r22 r23 r24  =  sin   cos  0  0
    // r31 r32 r33 r34      0     0   1  0
    // r41 r42 r44 r44      0     0   0  1
    //
    // (t11 t12 t13 r14).(cos sin 0 0) (t11 t12 t13 r14).(-sin cos 0 0) (t11 t12 t13 r14).(0 0 1 0) (t11 t12 t13 t14).(0 0 0 1)
    // (t21 t22 t23 r24).(cos sin 0 0) (t21 t22 t23 r24).(-sin cos 0 0) (t21 t22 t23 r24).(0 0 1 0) (t21 t22 t23 t24).(0 0 0 1)
    // (t31 t32 t33 r34).(cos sin 0 0) (t31 t32 t33 r34).(-sin cos 0 0) (t31 t32 t33 r34).(0 0 1 0) (t31 t32 t33 t34).(0 0 0 1)
    // (t41 t42 t43 r44).(cos sin 0 0) (t41 t42 t43 r44).(-sin cos 0 0) (t41 t42 t43 r44).(0 0 1 0) (t41 t42 t43 t44).(0 0 0 1)
    //
    // (t11*cos + t12*sin + t13*0 + t14*0) (t11*-sin + t12*cos + t13*0 + t14*0) (t11*0 + t12*0 + t13*1 + t14*0) (t11*0 t12*0 t13*0 t14*1)
    // (t21*cos + t22*sin + t23*0 + t24*0) (t21*-sin + t22*cos + t23*0 + t24*0) (t21*0 + t22*0 + t23*1 + t24*0) (t21*0 t22*0 t23*0 t24*1)
    // (t31*cos + t32*sin + t33*0 + t34*0) (t31*-sin + t32*cos + t33*0 + t34*0) (t31*0 + t32*0 + t33*1 + t34*0) (t31*0 t32*0 t33*0 t34*1)
    // (t41*cos + t42*sin + t43*0 + t44*0) (t41*-sin + t42*cos + t43*0 + t44*0) (t41*0 + t42*0 + t43*1 + t44*0) (t41*0 t42*0 t43*0 t44*1)
    //
    // (t11*cos + t12*sin + 0 + 0) (t11*-sin + t12*cos + 0 + 0) (0 + 0 + t13 + 0) (0 + 0 + 0 + t14)
    // (t21*cos + t22*sin + 0 + 0) (t21*-sin + t22*cos + 0 + 0) (0 + 0 + t23 + 0) (0 + 0 + 0 + t24)
    // (t31*cos + t32*sin + 0 + 0) (t31*-sin + t32*cos + 0 + 0) (0 + 0 + t33 + 0) (0 + 0 + 0 + t34)
    // (t41*cos + t42*sin + 0 + 0) (t41*-sin + t42*cos + 0 + 0) (0 + 0 + t43 + 0) (0 + 0 + 0 + t44)
    //
    // (t11*cos + t12*sin) (t11*-sin + t12*cos) (t13) (t14)
    // (t21*cos + t22*sin) (t21*-sin + t22*cos) (t23) (t24)
    // (t31*cos + t32*sin) (t31*-sin + t32*cos) (t33) (t34)
    // (t41*cos + t42*sin) (t41*-sin + t42*cos) (t43) (t44)
    //
    // o11=(t11*cos + t12*sin)  o12=(t11*-sin + t12*cos)  o13=t13  o14=t14
    // o21=(t21*cos + t22*sin)  o22=(t21*-sin + t22*cos)  o23=t23  o24=t24
    // o31=(t31*cos + t32*sin)  o32=(t31*-sin + t32*cos)  o33=t33  o34=t34
    // o41=(t41*cos + t42*sin)  o42=(t41*-sin + t42*cos)  o43=t43  o44=t44
    //
    // o11 = t11*cos + t12*sin  o12 = t12*cos - t11*sin
    // o21 = t21*cos + t22*sin  o22 = t22*cos - t21*sin
    // o31 = t31*cos + t32*sin  o32 = t32*cos - t31*sin
    // o41 = t41*cos + t42*sin  o42 = t42*cos - t41*sin

    const t11 = a[0];  const t12 = a[1];
    const t21 = a[4];  const t22 = a[5];
    const t31 = a[8];  const t32 = a[9];
    const t41 = a[12];  const t42 = a[13];

    a[0] = t11*cos + t12*sin;  a[1] = t12*cos - t11*sin;
    a[4] = t21*cos + t22*sin;  a[5] = t22*cos - t21*sin;
    a[8] = t31*cos + t32*sin;  a[9] = t32*cos - t31*sin;
    a[12] = t41*cos + t42*sin;  a[13] = t42*cos - t41*sin;
};