const PRECISION_DIGITS = 3;

let t11, t12, t13, t14,
    t21, t22, t23, t24,
    t31, t32, t33, t34,
    t41, t42, t43, t44: number;

export const set_the_components_of_a_4x4_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    m11: number, m12: number, m13: number, m14: number,
    m21: number, m22: number, m23: number, m24: number,
    m31: number, m32: number, m33: number, m34: number,
    m41: number, m42: number, m43: number, m44: number
): void => {
    M11a[a] = m11;  M12a[a] = m12;  M13a[a] = m13;  M14a[a] = m14;
    M21a[a] = m21;  M22a[a] = m22;  M23a[a] = m23;  M24a[a] = m24;
    M31a[a] = m31;  M32a[a] = m32;  M33a[a] = m33;  M34a[a] = m34;
    M41a[a] = m41;  M42a[a] = m42;  M43a[a] = m43;  M44a[a] = m44;
};

export const set_all_components_of_a_4x4_matrix_to_a_number = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    value: number
): void => {
    M11a[a] = M12a[a] = M13a[a] = M14a[a] =
    M21a[a] = M22a[a] = M23a[a] = M24a[a] =
    M31a[a] = M32a[a] = M33a[a] = M34a[a] =
    M41a[a] = M42a[a] = M43a[a] = M44a[a] = value;
};

export const set_a_4x4_matrix_from_another_4x4_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
): void => {
    M11a[a] = M11o[o];  M12a[a] = M12o[o];  M13a[a] = M13o[o];  M14a[a] = M14o[o];
    M21a[a] = M21o[o];  M22a[a] = M22o[o];  M23a[a] = M23o[o];  M24a[a] = M24o[o];
    M31a[a] = M31o[o];  M32a[a] = M32o[o];  M33a[a] = M33o[o];  M34a[a] = M34o[o];
    M41a[a] = M41o[o];  M42a[a] = M42o[o];  M43a[a] = M43o[o];  M44a[a] = M44o[o];
};

export const set_a_4x4_matrix_to_the_identity_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array
) : void => {
    M11a[a] = M22a[a] = M33a[a] = M44a[a] = 1;
    M12a[a] = M13a[a] = M14a[a] =
    M21a[a] = M23a[a] = M24a[a] =
    M31a[a] = M32a[a] = M34a[a] =
    M41a[a] = M42a[a] = M43a[a] = 0;
};

export const invert_a_4x4_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M14o[o] = M14a[a];  M11o[o] = M11a[a];  M12o[o] = M21a[a];  M13o[o] = M31a[a];  M23o[o] = M32a[a];
    M24o[o] = M24a[a];  M22o[o] = M22a[a];  M21o[o] = M12a[a];  M31o[o] = M13a[a];  M32o[o] = M23a[a];
    M34o[o] = M34a[a];  M33o[o] = M33a[a];

    M41o[o] = -(M41a[a]*M11a[a] + M42a[a]*M12a[a] + M43a[a]*M13a[a]);
    M42o[o] = -(M41a[a]*M21a[a] + M42a[a]*M22a[a] + M43a[a]*M23a[a]);
    M43o[o] = -(M41a[a]*M31a[a] + M42a[a]*M32a[a] + M43a[a]*M33a[a]);
    M44o[o] = 1;
};

export const invert_a_4x4_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array
) : void => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    t11 = M11a[a];  t21 = M21a[a];  t31 = M31a[a];  t41 = M41a[a];
    t12 = M12a[a];  t22 = M22a[a];  t32 = M32a[a];  t42 = M42a[a];
    t13 = M13a[a];  t23 = M23a[a];  t33 = M33a[a];  t43 = M43a[a];

    // Transpose the rotation portion of the matrix:
    M21a[a] = t12;  M31a[a] = t13;
    M12a[a] = t21;                 M32a[a] = t23;
    M13a[a] = t31;  M23a[a] = t32;

    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    M41a[a] = -(t41*t11 + t42*t12 + t43*t13); // -Dot(original_translation, original_rotation_x)
    M42a[a] = -(t41*t21 + t42*t22 + t43*t23); // -Dot(original_translation, original_rotation_y)
    M43a[a] = -(t41*t31 + t42*t32 + t43*t33); // -Dot(original_translation, original_rotation_z)
    M44a[a] = 1;
};

export const transpose_a_4x4_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a];  M21o[o] = M12a[a];  M31o[o] = M13a[a];  M41o[o] = M14a[a];
    M12o[o] = M21a[a];  M22o[o] = M22a[a];  M32o[o] = M23a[a];  M42o[o] = M24a[a];
    M13o[o] = M31a[a];  M23o[o] = M32a[a];  M33o[o] = M33a[a];  M43o[o] = M34a[a];
    M14o[o] = M41a[a];  M24o[o] = M42a[a];  M34o[o] = M43a[a];  M44o[o] = M44a[a];
};

export const transpose_a_4x4_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array
) : void => {[
    M12a[a], M13a[a], M14a[a], M21a[a], M23a[a], M24a[a], M31a[a], M32a[a], M34a[a], M41a[a], M42a[a], M43a[a]] = [
    M21a[a], M31a[a], M41a[a], M12a[a], M32a[a], M42a[a], M13a[a], M23a[a], M43a[a], M14a[a], M24a[a], M34a[a]]
};

export const check_if_two_4x4_matrices_are_equal = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array, M13b: Float32Array, M14b: Float32Array,
    M21b: Float32Array, M22b: Float32Array, M23b: Float32Array, M24b: Float32Array,
    M31b: Float32Array, M32b: Float32Array, M33b: Float32Array, M34b: Float32Array,
    M41b: Float32Array, M42b: Float32Array, M43b: Float32Array, M44b: Float32Array
) : boolean =>
    M11a[a].toFixed(PRECISION_DIGITS) ===
    M11b[b].toFixed(PRECISION_DIGITS) &&

    M12a[a].toFixed(PRECISION_DIGITS) ===
    M12b[b].toFixed(PRECISION_DIGITS) &&

    M13a[a].toFixed(PRECISION_DIGITS) ===
    M13b[b].toFixed(PRECISION_DIGITS) &&

    M14a[a].toFixed(PRECISION_DIGITS) ===
    M14b[b].toFixed(PRECISION_DIGITS) &&


    M21a[a].toFixed(PRECISION_DIGITS) ===
    M21b[b].toFixed(PRECISION_DIGITS) &&

    M22a[a].toFixed(PRECISION_DIGITS) ===
    M22b[b].toFixed(PRECISION_DIGITS) &&

    M23a[a].toFixed(PRECISION_DIGITS) ===
    M23b[b].toFixed(PRECISION_DIGITS) &&

    M24a[a].toFixed(PRECISION_DIGITS) ===
    M24b[b].toFixed(PRECISION_DIGITS) &&


    M31a[a].toFixed(PRECISION_DIGITS) ===
    M31b[b].toFixed(PRECISION_DIGITS) &&

    M32a[a].toFixed(PRECISION_DIGITS) ===
    M32b[b].toFixed(PRECISION_DIGITS) &&

    M33a[a].toFixed(PRECISION_DIGITS) ===
    M33b[b].toFixed(PRECISION_DIGITS) &&

    M34a[a].toFixed(PRECISION_DIGITS) ===
    M34b[b].toFixed(PRECISION_DIGITS) &&


    M41a[a].toFixed(PRECISION_DIGITS) ===
    M41b[b].toFixed(PRECISION_DIGITS) &&

    M42a[a].toFixed(PRECISION_DIGITS) ===
    M42b[b].toFixed(PRECISION_DIGITS) &&

    M43a[a].toFixed(PRECISION_DIGITS) ===
    M43b[b].toFixed(PRECISION_DIGITS) &&

    M44a[a].toFixed(PRECISION_DIGITS) ===
    M44b[b].toFixed(PRECISION_DIGITS);

export const check_if_a_4x4_matrix_is_the_identity_matrix = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array
) : boolean =>
    M11a[a] === 1  &&  M21a[a] === 0  &&  M31a[a] === 0  &&  M41a[a] === 0 &&
    M12a[a] === 0  &&  M22a[a] === 1  &&  M32a[a] === 0  &&  M42a[a] === 0 &&
    M13a[a] === 0  &&  M23a[a] === 0  &&  M33a[a] === 1  &&  M43a[a] === 0 &&
    M14a[a] === 0  &&  M24a[a] === 0  &&  M34a[a] === 0  &&  M44a[a] === 1;

export const add_a_4x4_matrix_to_another_4x4_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array, M13b: Float32Array, M14b: Float32Array,
    M21b: Float32Array, M22b: Float32Array, M23b: Float32Array, M24b: Float32Array,
    M31b: Float32Array, M32b: Float32Array, M33b: Float32Array, M34b: Float32Array,
    M41b: Float32Array, M42b: Float32Array, M43b: Float32Array, M44b: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a] + M11b[b];  M21o[o] = M21a[a] + M21b[b];  M31o[o] = M31a[a] + M31b[b];  M41o[o] = M41a[a] + M41b[b];
    M12o[o] = M12a[a] + M12b[b];  M22o[o] = M22a[a] + M22b[b];  M32o[o] = M32a[a] + M32b[b];  M42o[o] = M42a[a] + M42b[b];
    M13o[o] = M13a[a] + M13b[b];  M23o[o] = M23a[a] + M23b[b];  M33o[o] = M33a[a] + M33b[b];  M43o[o] = M43a[a] + M43b[b];
    M14o[o] = M14a[a] + M14b[b];  M24o[o] = M24a[a] + M24b[b];  M34o[o] = M34a[a] + M34b[b];  M44o[o] = M44a[a] + M44b[b];
};

export const add_a_4x4_matrix_to_another_4x4_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array, M13b: Float32Array, M14b: Float32Array,
    M21b: Float32Array, M22b: Float32Array, M23b: Float32Array, M24b: Float32Array,
    M31b: Float32Array, M32b: Float32Array, M33b: Float32Array, M34b: Float32Array,
    M41b: Float32Array, M42b: Float32Array, M43b: Float32Array, M44b: Float32Array,
) : void => {
    M11a[a] += M11b[b];  M21a[a] += M21b[b];  M31a[a] += M31b[b];  M41a[a] += M41b[b];
    M12a[a] += M12b[b];  M22a[a] += M22b[b];  M32a[a] += M32b[b];  M42a[a] += M42b[b];
    M13a[a] += M13b[b];  M23a[a] += M23b[b];  M33a[a] += M33b[b];  M43a[a] += M43b[b];
    M14a[a] += M14b[b];  M24a[a] += M24b[b];  M34a[a] += M34b[b];  M44a[a] += M44b[b];
};

export const add_a_number_to_a_4x4_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a] + b;  M21o[o] = M21a[a] + b;  M31o[o] = M31a[a] + b;  M41o[o] = M41a[a] + b;
    M12o[o] = M12a[a] + b;  M22o[o] = M22a[a] + b;  M32o[o] = M32a[a] + b;  M42o[o] = M42a[a] + b;
    M13o[o] = M13a[a] + b;  M23o[o] = M23a[a] + b;  M33o[o] = M33a[a] + b;  M43o[o] = M43a[a] + b;
    M14o[o] = M14a[a] + b;  M24o[o] = M24a[a] + b;  M34o[o] = M34a[a] + b;  M44o[o] = M44a[a] + b;
};

export const add_a_number_to_a_4x4_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
) : void => {
    M11a[a] += b;  M21a[a] += b;  M31a[a] += b;  M41a[a] += b;
    M12a[a] += b;  M22a[a] += b;  M32a[a] += b;  M42a[a] += b;
    M13a[a] += b;  M23a[a] += b;  M33a[a] += b;  M43a[a] += b;
    M14a[a] += b;  M24a[a] += b;  M34a[a] += b;  M44a[a] += b;
};

export const subtract_a_4x4_matrix_from_another_4x4_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array, M13b: Float32Array, M14b: Float32Array,
    M21b: Float32Array, M22b: Float32Array, M23b: Float32Array, M24b: Float32Array,
    M31b: Float32Array, M32b: Float32Array, M33b: Float32Array, M34b: Float32Array,
    M41b: Float32Array, M42b: Float32Array, M43b: Float32Array, M44b: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a] - M11b[b];  M21o[o] = M21a[a] - M21b[b];  M31o[o] = M31a[a] - M31b[b];  M41o[o] = M41a[a] - M41b[b];
    M12o[o] = M12a[a] - M12b[b];  M22o[o] = M22a[a] - M22b[b];  M32o[o] = M32a[a] - M32b[b];  M42o[o] = M42a[a] - M42b[b];
    M13o[o] = M13a[a] - M13b[b];  M23o[o] = M23a[a] - M23b[b];  M33o[o] = M33a[a] - M33b[b];  M43o[o] = M43a[a] - M43b[b];
    M14o[o] = M14a[a] - M14b[b];  M24o[o] = M24a[a] - M24b[b];  M34o[o] = M34a[a] - M34b[b];  M44o[o] = M44a[a] - M44b[b];
};

export const subtract_a_4x4_matrix_from_another_4x4_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array, M13b: Float32Array, M14b: Float32Array,
    M21b: Float32Array, M22b: Float32Array, M23b: Float32Array, M24b: Float32Array,
    M31b: Float32Array, M32b: Float32Array, M33b: Float32Array, M34b: Float32Array,
    M41b: Float32Array, M42b: Float32Array, M43b: Float32Array, M44b: Float32Array,
) : void => {
    M11a[a] -= M11b[b];  M21a[a] -= M21b[b];  M31a[a] -= M31b[b];  M41a[a] -= M41b[b];
    M12a[a] -= M12b[b];  M22a[a] -= M22b[b];  M32a[a] -= M32b[b];  M42a[a] -= M42b[b];
    M13a[a] -= M13b[b];  M23a[a] -= M23b[b];  M33a[a] -= M33b[b];  M43a[a] -= M43b[b];
    M14a[a] -= M14b[b];  M24a[a] -= M24b[b];  M34a[a] -= M34b[b];  M44a[a] -= M44b[b];
};

export const subtract_a_number_from_a_4x4_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a] - b;  M21o[o] = M21a[a] - b;  M31o[o] = M31a[a] - b;  M41o[o] = M41a[a] - b;
    M12o[o] = M12a[a] - b;  M22o[o] = M22a[a] - b;  M32o[o] = M32a[a] - b;  M42o[o] = M42a[a] - b;
    M13o[o] = M13a[a] - b;  M23o[o] = M23a[a] - b;  M33o[o] = M33a[a] - b;  M43o[o] = M43a[a] - b;
    M14o[o] = M14a[a] - b;  M24o[o] = M24a[a] - b;  M34o[o] = M34a[a] - b;  M44o[o] = M44a[a] - b;
};

export const subtract_a_number_from_a_4x4_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
) : void => {
    M11a[a] -= b;  M21a[a] -= b;  M31a[a] -= b;  M41a[a] -= b;
    M12a[a] -= b;  M22a[a] -= b;  M32a[a] -= b;  M42a[a] -= b;
    M13a[a] -= b;  M23a[a] -= b;  M33a[a] -= b;  M43a[a] -= b;
    M14a[a] -= b;  M24a[a] -= b;  M34a[a] -= b;  M44a[a] -= b;
};

export const divide_a_4x4_matrix_by_a_number_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a] / b;  M21o[o] = M21a[a] / b;  M31o[o] = M31a[a] / b;  M41o[o] = M41a[a] / b;
    M12o[o] = M12a[a] / b;  M22o[o] = M22a[a] / b;  M32o[o] = M32a[a] / b;  M42o[o] = M42a[a] / b;
    M13o[o] = M13a[a] / b;  M23o[o] = M23a[a] / b;  M33o[o] = M33a[a] / b;  M43o[o] = M43a[a] / b;
    M14o[o] = M14a[a] / b;  M24o[o] = M24a[a] / b;  M34o[o] = M34a[a] / b;  M44o[o] = M44a[a] / b;
};

export const divide_a_4x4_matrix_by_a_number_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
) : void => {
    M11a[a] /= b;  M21a[a] /= b;  M31a[a] /= b;  M41a[a] /= b;
    M12a[a] /= b;  M22a[a] /= b;  M32a[a] /= b;  M42a[a] /= b;
    M13a[a] /= b;  M23a[a] /= b;  M33a[a] /= b;  M43a[a] /= b;
    M14a[a] /= b;  M24a[a] /= b;  M34a[a] /= b;  M44a[a] /= b;
};

export const multiply_a_4x4_matrix_by_a_number_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a] * b;  M21o[o] = M21a[a] * b;  M31o[o] = M31a[a] * b;  M41o[o] = M41a[a] * b;
    M12o[o] = M12a[a] * b;  M22o[o] = M22a[a] * b;  M32o[o] = M32a[a] * b;  M42o[o] = M42a[a] * b;
    M13o[o] = M13a[a] * b;  M23o[o] = M23a[a] * b;  M33o[o] = M33a[a] * b;  M43o[o] = M43a[a] * b;
    M14o[o] = M14a[a] * b;  M24o[o] = M24a[a] * b;  M34o[o] = M34a[a] * b;  M44o[o] = M44a[a] * b;
};

export const multiply_a_4x4_matrix_by_a_number_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number
) : void => {
    M11a[a] *= b;  M21a[a] *= b;  M31a[a] *= b;  M41a[a] *= b;
    M12a[a] *= b;  M22a[a] *= b;  M32a[a] *= b;  M42a[a] *= b;
    M13a[a] *= b;  M23a[a] *= b;  M33a[a] *= b;  M43a[a] *= b;
    M14a[a] *= b;  M24a[a] *= b;  M34a[a] *= b;  M44a[a] *= b;
};

export const multiply_a_4x4_matrix_by_another_4x4_matrix_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array, M13b: Float32Array, M14b: Float32Array,
    M21b: Float32Array, M22b: Float32Array, M23b: Float32Array, M24b: Float32Array,
    M31b: Float32Array, M32b: Float32Array, M33b: Float32Array, M34b: Float32Array,
    M41b: Float32Array, M42b: Float32Array, M43b: Float32Array, M44b: Float32Array,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
) : void => {
    M11o[o] = M11a[a]*M11b[b] + M12a[a]*M21b[b] + M13a[a]*M31b[b] + M14a[a]*M41b[b]; // Row 1 | Column 1
    M12o[o] = M11a[a]*M12b[b] + M12a[a]*M22b[b] + M13a[a]*M32b[b] + M14a[a]*M42b[b]; // Row 1 | Column 2
    M13o[o] = M11a[a]*M13b[b] + M12a[a]*M23b[b] + M13a[a]*M33b[b] + M14a[a]*M43b[b]; // Row 1 | Column 3
    M14o[o] = M11a[a]*M14b[b] + M12a[a]*M24b[b] + M13a[a]*M34b[b] + M14a[a]*M44b[b]; // Row 1 | Column 4

    M21o[o] = M21a[a]*M11b[b] + M22a[a]*M21b[b] + M23a[a]*M31b[b] + M24a[a]*M41b[b]; // Row 2 | Column 1
    M22o[o] = M21a[a]*M12b[b] + M22a[a]*M22b[b] + M23a[a]*M32b[b] + M24a[a]*M42b[b]; // Row 2 | Column 2
    M23o[o] = M21a[a]*M13b[b] + M22a[a]*M23b[b] + M23a[a]*M33b[b] + M24a[a]*M43b[b]; // Row 2 | Column 3
    M24o[o] = M21a[a]*M14b[b] + M22a[a]*M24b[b] + M23a[a]*M34b[b] + M24a[a]*M44b[b]; // Row 2 | Column 4

    M31o[o] = M31a[a]*M11b[b] + M32a[a]*M21b[b] + M33a[a]*M31b[b] + M34a[a]*M41b[b]; // Row 3 | Column 1
    M32o[o] = M31a[a]*M12b[b] + M32a[a]*M22b[b] + M33a[a]*M32b[b] + M34a[a]*M42b[b]; // Row 3 | Column 2
    M33o[o] = M31a[a]*M13b[b] + M32a[a]*M23b[b] + M33a[a]*M33b[b] + M34a[a]*M43b[b]; // Row 3 | Column 3
    M34o[o] = M31a[a]*M14b[b] + M32a[a]*M24b[b] + M33a[a]*M34b[b] + M34a[a]*M44b[b]; // Row 3 | Column 4

    M41o[o] = M41a[a]*M11b[b] + M42a[a]*M21b[b] + M43a[a]*M31b[b] + M44a[a]*M41b[b]; // Row 4 | Column 1
    M42o[o] = M41a[a]*M12b[b] + M42a[a]*M22b[b] + M43a[a]*M32b[b] + M44a[a]*M42b[b]; // Row 4 | Column 2
    M43o[o] = M41a[a]*M13b[b] + M42a[a]*M23b[b] + M43a[a]*M33b[b] + M44a[a]*M43b[b]; // Row 4 | Column 3
    M44o[o] = M41a[a]*M14b[b] + M42a[a]*M24b[b] + M43a[a]*M34b[b] + M44a[a]*M44b[b]; // Row 4 | Column 4
};

export const multiply_a_4x4_matrix_by_another_4x4_matrix_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    b: number,
    M11b: Float32Array, M12b: Float32Array, M13b: Float32Array, M14b: Float32Array,
    M21b: Float32Array, M22b: Float32Array, M23b: Float32Array, M24b: Float32Array,
    M31b: Float32Array, M32b: Float32Array, M33b: Float32Array, M34b: Float32Array,
    M41b: Float32Array, M42b: Float32Array, M43b: Float32Array, M44b: Float32Array
) : void => {
    t11 = M11a[a];  t12 = M12a[a];  t13 = M13a[a];  t14 = M14a[a];
    t21 = M21a[a];  t22 = M22a[a];  t23 = M23a[a];  t24 = M24a[a];
    t31 = M31a[a];  t32 = M32a[a];  t33 = M33a[a];  t34 = M34a[a];
    t41 = M41a[a];  t42 = M42a[a];  t43 = M43a[a];  t44 = M44a[a];

    M11a[a] = t11*M11b[b] + t12*M21b[b] + t13*M31b[b] + t14*M41b[b]; // Row 1 | Column 1
    M21a[a] = t21*M11b[b] + t22*M21b[b] + t23*M31b[b] + t24*M41b[b]; // Row 2 | Column 1
    M31a[a] = t31*M11b[b] + t32*M21b[b] + t33*M31b[b] + t34*M41b[b]; // Row 3 | Column 1
    M41a[a] = t41*M11b[b] + t42*M21b[b] + t43*M31b[b] + t44*M41b[b]; // Row 4 | Column 1

    M12a[a] = t11*M12b[b] + t12*M22b[b] + t13*M32b[b] + t14*M42b[b]; // Row 1 | Column 2
    M22a[a] = t21*M12b[b] + t22*M22b[b] + t23*M32b[b] + t24*M42b[b]; // Row 2 | Column 2
    M32a[a] = t31*M12b[b] + t32*M22b[b] + t33*M32b[b] + t34*M42b[b]; // Row 3 | Column 2
    M42a[a] = t41*M12b[b] + t42*M22b[b] + t43*M32b[b] + t44*M42b[b]; // Row 4 | Column 2

    M13a[a] = t11*M13b[b] + t12*M23b[b] + t13*M33b[b] + t14*M43b[b]; // Row 1 | Column 3
    M23a[a] = t21*M13b[b] + t22*M23b[b] + t23*M33b[b] + t24*M43b[b]; // Row 2 | Column 3
    M33a[a] = t31*M13b[b] + t32*M23b[b] + t33*M33b[b] + t34*M43b[b]; // Row 3 | Column 3
    M43a[a] = t41*M13b[b] + t42*M23b[b] + t43*M33b[b] + t44*M43b[b]; // Row 4 | Column 3

    M14a[a] = t11*M14b[b] + t12*M24b[b] + t13*M34b[b] + t14*M44b[b]; // Row 1 | Column 4
    M24a[a] = t21*M14b[b] + t22*M24b[b] + t23*M34b[b] + t24*M44b[b]; // Row 2 | Column 4
    M34a[a] = t31*M14b[b] + t32*M24b[b] + t33*M34b[b] + t34*M44b[b]; // Row 3 | Column 4
    M44a[a] = t41*M14b[b] + t42*M24b[b] + t43*M34b[b] + t44*M44b[b]; // Row 4 | Column 4
};

export const set_a_4x4_matrix_to_a_rotation_around_x_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number
) : void => {
    M33a[a] = M22a[a] = cos;
    M23a[a] = sin;
    M32a[a] = -sin;
};

export const set_a_4x4_matrix_to_a_rotation_around_y_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number
) : void => {
    M11a[a] = M33a[a] = cos;
    M13a[a] = sin;
    M31a[a] = -sin;
};

export const set_a_4x4_matrix_to_a_rotation_around_z_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number
) : void => {
    M11a[a] = M22a[a] = cos;
    M12a[a] = sin;
    M21a[a] = -sin;
};

export const rotate_a_4x4_matrix_around_x_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
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

    M11o[o] = M11a[a];  M12o[o] = M13a[a]*sin + M12a[a]*cos;  M13o[o] = M13a[a]*cos - M12a[a]*sin;  M14o[o] = M14a[a];
    M21o[o] = M21a[a];  M22o[o] = M23a[a]*sin + M22a[a]*cos;  M23o[o] = M23a[a]*cos - M22a[a]*sin;  M24o[o] = M24a[a];
    M31o[o] = M31a[a];  M32o[o] = M33a[a]*sin + M32a[a]*cos;  M33o[o] = M33a[a]*cos - M32a[a]*sin;  M34o[o] = M34a[a];
    M41o[o] = M41a[a];  M42o[o] = M43a[a]*sin + M42a[a]*cos;  M43o[o] = M43a[a]*cos - M42a[a]*sin;  M44o[o] = M44a[a];
};

export const rotate_a_4x4_matrix_around_x_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number
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

    t12 = M12a[a];  t13 = M13a[a];
    t22 = M22a[a];  t23 = M23a[a];
    t32 = M32a[a];  t33 = M33a[a];
    t42 = M42a[a];  t43 = M43a[a];

    M12a[a] = t12*cos + t13*sin;  M13a[a] = t13*cos - t12*sin;
    M22a[a] = t22*cos + t23*sin;  M23a[a] = t23*cos - t22*sin;
    M32a[a] = t32*cos + t33*sin;  M33a[a] = t33*cos - t32*sin;
    M42a[a] = t42*cos + t43*sin;  M43a[a] = t43*cos - t42*sin;
};

export const rotate_a_4x4_matrix_around_y_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
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

    M11o[o] = M11a[a]*cos - M13a[a]*sin;  M12o[o] = M12a[a];  M13o[o] = M11a[a]*sin + M13a[a]*cos;  M14o[o] = M14a[a];
    M21o[o] = M21a[a]*cos - M23a[a]*sin;  M22o[o] = M22a[a];  M23o[o] = M21a[a]*sin + M23a[a]*cos;  M24o[o] = M24a[a];
    M31o[o] = M31a[a]*cos - M33a[a]*sin;  M32o[o] = M32a[a];  M33o[o] = M31a[a]*sin + M33a[a]*cos;  M34o[o] = M34a[a];
    M41o[o] = M41a[a]*cos - M43a[a]*sin;  M42o[o] = M42a[a];  M43o[o] = M41a[a]*sin + M43a[a]*cos;  M44o[o] = M44a[a];
};

export const rotate_a_4x4_matrix_around_y_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number
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

    t11 = M11a[a];  t13 = M13a[a];
    t21 = M21a[a];  t23 = M23a[a];
    t31 = M31a[a];  t33 = M33a[a];
    t41 = M41a[a];  t43 = M43a[a];

    M11a[a] = t11*cos - t13*sin;  M13a[a] = t11*sin + t13*cos;
    M21a[a] = t21*cos - t23*sin;  M23a[a] = t21*sin + t23*cos;
    M31a[a] = t31*cos - t33*sin;  M33a[a] = t31*sin + t33*cos;
    M41a[a] = t41*cos - t43*sin;  M43a[a] = t41*sin + t43*cos;
};

export const rotate_a_4x4_matrix_around_z_to_out = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number,

    o: number,
    M11o: Float32Array, M12o: Float32Array, M13o: Float32Array, M14o: Float32Array,
    M21o: Float32Array, M22o: Float32Array, M23o: Float32Array, M24o: Float32Array,
    M31o: Float32Array, M32o: Float32Array, M33o: Float32Array, M34o: Float32Array,
    M41o: Float32Array, M42o: Float32Array, M43o: Float32Array, M44o: Float32Array
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

    M11o[o] = M11a[a]*cos + M12a[a]*sin;  M12o[o] = M12a[a]*cos - M11a[a]*sin;  M13o[o] = M13a[a];  M14o[o] = M14a[a];
    M21o[o] = M21a[a]*cos + M22a[a]*sin;  M22o[o] = M22a[a]*cos - M21a[a]*sin;  M23o[o] = M23a[a];  M24o[o] = M24a[a];
    M31o[o] = M31a[a]*cos + M32a[a]*sin;  M32o[o] = M32a[a]*cos - M31a[a]*sin;  M33o[o] = M33a[a];  M34o[o] = M34a[a];
    M41o[o] = M41a[a]*cos + M42a[a]*sin;  M42o[o] = M42a[a]*cos - M41a[a]*sin;  M43o[o] = M43a[a];  M44o[o] = M44a[a];
};

export const rotate_a_4x4_matrix_around_z_in_place = (
    a: number,
    M11a: Float32Array, M12a: Float32Array, M13a: Float32Array, M14a: Float32Array,
    M21a: Float32Array, M22a: Float32Array, M23a: Float32Array, M24a: Float32Array,
    M31a: Float32Array, M32a: Float32Array, M33a: Float32Array, M34a: Float32Array,
    M41a: Float32Array, M42a: Float32Array, M43a: Float32Array, M44a: Float32Array,

    cos: number,
    sin: number
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

    t11 = M11a[a];  t12 = M12a[a];
    t21 = M21a[a];  t22 = M22a[a];
    t31 = M31a[a];  t32 = M32a[a];
    t41 = M41a[a];  t42 = M42a[a];

    M11a[a] = t11*cos + t12*sin;  M12a[a] = t12*cos - t11*sin;
    M21a[a] = t21*cos + t22*sin;  M22a[a] = t22*cos - t21*sin;
    M31a[a] = t31*cos + t32*sin;  M32a[a] = t32*cos - t31*sin;
    M31a[a] = t41*cos + t42*sin;  M42a[a] = t42*cos - t41*sin;
};