import {PRECISION_DIGITS} from "../../constants.js";
import {MATRIX_3X3_ALLOCATOR} from "../allocators/float.js";
import {Float9} from "../../types.js";
import {IMatrixRotationFunctionSet} from "../_interfaces/function_sets.js";

let t11, t12, t13,
    t21, t22, t23,
    t31, t32, t33: number;

const set_to = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    m11: number, m12: number, m13: number,
    m21: number, m22: number, m23: number,
    m31: number, m32: number, m33: number
): void => {
    M11a[a] = m11;  M12a[a] = m12;  M13a[a] = m13;
    M21a[a] = m21;  M22a[a] = m22;  M23a[a] = m23;
    M31a[a] = m31;  M32a[a] = m32;  M33a[a] = m33;
};

const set_all_to = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    value: number
): void => {
    M11a[a] = M12a[a] = M13a[a] =
    M21a[a] = M22a[a] = M23a[a] =
    M31a[a] = M32a[a] = M33a[a] = value;
};

const set_from = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
): void => {
    M11a[a] = M11o[o];  M12a[a] = M12o[o];  M13a[a] = M13o[o];
    M21a[a] = M21o[o];  M22a[a] = M22o[o];  M23a[a] = M23o[o];
    M31a[a] = M31o[o];  M32a[a] = M32o[o];  M33a[a] = M33o[o];
};

const set_to_identity = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9
) : void => {
    M11a[a] = M22a[a] = M33a[a] = 1;
    M12a[a] = M13a[a] = M21a[a] = M23a[a] = M31a[a] = M32a[a] = 0;
};

const invert = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M13o[o] = M13a[a];  M11o[o] = M11a[a];
    M23o[o] = M23a[a];  M22o[o] = M22a[a];

    // Transpose the rotation portion of the matrix:
    M12o[o] = M21a[a];
    M21o[o] = M12a[a];

    M31o[o] = -(M31a[a]*M11a[a] + M32a[a]*M12a[a]); // -Dot(original_translation, original_rotation_x)
    M32o[o] = -(M31a[a]*M21a[a] + M32a[a]*M22a[a]); // -Dot(original_translation, original_rotation_y)
    M33o[o] = 1;
};

const invert_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9
) : void => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    t11 = M11a[a];  t21 = M21a[a];  t31 = M31a[a];
    t12 = M12a[a];  t22 = M22a[a];  t32 = M32a[a];

    // Transpose the rotation portion of the matrix:
    M12a[a] = t21[a];
    M21a[a] = t12[a];

    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    M31a[a] = -(t31*t11 + t32*t12); // -Dot(original_translation, original_rotation_x)
    M32a[a] = -(t31*t21 + t32*t22); // -Dot(original_translation, original_rotation_y)
    M33a[a] = 1;
};

const transpose = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a];  M21o[o] = M12a[a];  M31o[o] = M13a[a];
    M12o[o] = M21a[a];  M22o[o] = M22a[a];  M32o[o] = M23a[a];
    M13o[o] = M31a[a];  M23o[o] = M32a[a];  M33o[o] = M33a[a];
};

const transpose_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9
) : void => {[
    M12a[a], M13a[a], M21a[a], M23a[a], M31a[a], M32a[a]] = [
    M21a[a], M31a[a], M12a[a], M32a[a], M13a[a], M23a[a]]
};

const equals = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number, [
        M11b, M12b, M13b,
        M21b, M22b, M23b,
        M31b, M32b, M33b
    ]: Float9
) : boolean =>
    M11a[a].toFixed(PRECISION_DIGITS) ===
    M11b[b].toFixed(PRECISION_DIGITS) &&

    M12a[a].toFixed(PRECISION_DIGITS) ===
    M12b[b].toFixed(PRECISION_DIGITS) &&

    M13a[a].toFixed(PRECISION_DIGITS) ===
    M13b[b].toFixed(PRECISION_DIGITS) &&


    M21a[a].toFixed(PRECISION_DIGITS) ===
    M21b[b].toFixed(PRECISION_DIGITS) &&

    M22a[a].toFixed(PRECISION_DIGITS) ===
    M22b[b].toFixed(PRECISION_DIGITS) &&

    M23a[a].toFixed(PRECISION_DIGITS) ===
    M23b[b].toFixed(PRECISION_DIGITS) &&


    M31a[a].toFixed(PRECISION_DIGITS) ===
    M31b[b].toFixed(PRECISION_DIGITS) &&

    M32a[a].toFixed(PRECISION_DIGITS) ===
    M32b[b].toFixed(PRECISION_DIGITS) &&

    M33a[a].toFixed(PRECISION_DIGITS) ===
    M33b[b].toFixed(PRECISION_DIGITS);

const is_identity = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9
) : boolean =>
    M11a[a] === 1  &&  M21a[a] === 0  &&  M31a[a] === 0  &&
    M12a[a] === 0  &&  M22a[a] === 1  &&  M32a[a] === 0  &&
    M13a[a] === 0  &&  M23a[a] === 0  &&  M33a[a] === 1;

const add = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number, [
        M11b, M12b, M13b,
        M21b, M22b, M23b,
        M31b, M32b, M33b
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a] + M11b[b];  M21o[o] = M21a[a] + M21b[b];  M31o[o] = M31a[a] + M31b[b];
    M12o[o] = M12a[a] + M12b[b];  M22o[o] = M22a[a] + M22b[b];  M32o[o] = M32a[a] + M32b[b];
    M13o[o] = M13a[a] + M13b[b];  M23o[o] = M23a[a] + M23b[b];  M33o[o] = M33a[a] + M33b[b];
};

const add_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number, [
        M11b, M12b, M13b,
        M21b, M22b, M23b,
        M31b, M32b, M33b
    ]: Float9
) : void => {
    M11a[a] += M11b[b];  M21a[a] += M21b[b];  M31a[a] += M31b[b];
    M12a[a] += M12b[b];  M22a[a] += M22b[b];  M32a[a] += M32b[b];
    M13a[a] += M13b[b];  M23a[a] += M23b[b];  M33a[a] += M33b[b];
};

const subtract = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number, [
        M11b, M12b, M13b,
        M21b, M22b, M23b,
        M31b, M32b, M33b
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a] - M11b[b];  M21o[o] = M21a[a] - M21b[b];  M31o[o] = M31a[a] - M31b[b];
    M12o[o] = M12a[a] - M12b[b];  M22o[o] = M22a[a] - M22b[b];  M32o[o] = M32a[a] - M32b[b];
    M13o[o] = M13a[a] - M13b[b];  M23o[o] = M23a[a] - M23b[b];  M33o[o] = M33a[a] - M33b[b];
};

const subtract_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number, [
        M11b, M12b, M13b,
        M21b, M22b, M23b,
        M31b, M32b, M33b
    ]: Float9
) : void => {
    M11a[a] -= M11b[b];  M21a[a] -= M21b[b];  M31a[a] -= M31b[b];
    M12a[a] -= M12b[b];  M22a[a] -= M22b[b];  M32a[a] -= M32b[b];
    M13a[a] -= M13b[b];  M23a[a] -= M23b[b];  M33a[a] -= M33b[b];
};

const divide = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9,

    n: number
) : void => {
    M11o[o] = M11a[a] / n;  M21o[o] = M21a[a] / n;  M31o[o] = M31a[a] / n;
    M12o[o] = M12a[a] / n;  M22o[o] = M22a[a] / n;  M32o[o] = M32a[a] / n;
    M13o[o] = M13a[a] / n;  M23o[o] = M23a[a] / n;  M33o[o] = M33a[a] / n;
};

const divide_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    n: number
) : void => {
    M11a[a] /= n;  M21a[a] /= n;  M31a[a] /= n;
    M12a[a] /= n;  M22a[a] /= n;  M32a[a] /= n;
    M13a[a] /= n;  M23a[a] /= n;  M33a[a] /= n;
};

const scale = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9,

    n: number
) : void => {
    M11o[o] = M11a[a] * n;  M21o[o] = M21a[a] * n;  M31o[o] = M31a[a] * n;
    M12o[o] = M12a[a] * n;  M22o[o] = M22a[a] * n;  M32o[o] = M32a[a] * n;
    M13o[o] = M13a[a] * n;  M23o[o] = M23a[a] * n;  M33o[o] = M33a[a] * n;
};

const scale_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    n: number
) : void => {
    M11a[a] *= n;  M21a[a] *= n;  M31a[a] *= n;
    M12a[a] *= n;  M22a[a] *= n;  M32a[a] *= n;
    M13a[a] *= n;  M23a[a] *= n;  M33a[a] *= n;
};

const multiply = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number, [
        M11b, M12b, M13b,
        M21b, M22b, M23b,
        M31b, M32b, M33b
    ]: Float9,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a]*M11b[b] + M12a[a]*M21b[b] + M13a[a]*M31b[b]; // Row 1 | Column 1
    M12o[o] = M11a[a]*M12b[b] + M12a[a]*M22b[b] + M13a[a]*M32b[b]; // Row 1 | Column 2
    M13o[o] = M11a[a]*M13b[b] + M12a[a]*M23b[b] + M13a[a]*M33b[b]; // Row 1 | Column 3

    M21o[o] = M21a[a]*M11b[b] + M22a[a]*M21b[b] + M23a[a]*M31b[b]; // Row 2 | Column 1
    M22o[o] = M21a[a]*M12b[b] + M22a[a]*M22b[b] + M23a[a]*M32b[b]; // Row 2 | Column 2
    M23o[o] = M21a[a]*M13b[b] + M22a[a]*M23b[b] + M23a[a]*M33b[b]; // Row 2 | Column 3

    M31o[o] = M31a[a]*M11b[b] + M32a[a]*M21b[b] + M33a[a]*M31b[b]; // Row 3 | Column 1
    M32o[o] = M31a[a]*M12b[b] + M32a[a]*M22b[b] + M33a[a]*M32b[b]; // Row 3 | Column 2
    M33o[o] = M31a[a]*M13b[b] + M32a[a]*M23b[b] + M33a[a]*M33b[b]; // Row 3 | Column 3

};

const multiply_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number, [
        M11b, M12b, M13b,
        M21b, M22b, M23b,
        M31b, M32b, M33b
    ]: Float9
) : void => {
    t11 = M11a[a];  t21 = M21a[a];  t31 = M31a[a];
    t12 = M12a[a];  t22 = M22a[a];  t32 = M32a[a];
    t13 = M13a[a];  t23 = M23a[a];  t33 = M33a[a];

    M11a[a] = t11*M11b[b] + t12*M21b[b] + t13*M31b[b]; // Row 1 | Column 1
    M12a[a] = t11*M12b[b] + t12*M22b[b] + t13*M32b[b]; // Row 1 | Column 2
    M13a[a] = t11*M13b[b] + t12*M23b[b] + t13*M33b[b]; // Row 1 | Column 3

    M21a[a] = t21*M11b[b] + t22*M21b[b] + t23*M31b[b]; // Row 2 | Column 1
    M22a[a] = t21*M12b[b] + t22*M22b[b] + t23*M32b[b]; // Row 2 | Column 2
    M23a[a] = t21*M13b[b] + t22*M23b[b] + t23*M33b[b]; // Row 2 | Column 3

    M31a[a] = t31*M11b[b] + t32*M21b[b] + t33*M31b[b]; // Row 3 | Column 1
    M32a[a] = t31*M12b[b] + t32*M22b[b] + t33*M32b[b]; // Row 3 | Column 2
    M33a[a] = t31*M13b[b] + t32*M23b[b] + t33*M33b[b]; // Row 3 | Column 3
};

const set_rotation_around_x = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number
) : void => {
    M33a[a] = M22a[a] = cos;
    M23a[a] = sin;
    M32a[a] = -sin;
};

const set_rotation_around_y = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number
) : void => {
    M11a[a] = M33a[a] = cos;
    M13a[a] = sin;
    M31a[a] = -sin;
};

const set_rotation_around_z = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number
) : void => {
    M11a[a] = M22a[a] = cos;
    M12a[a] = sin;
    M21a[a] = -sin;
};

export const matrix3x3Functions: IMatrixRotationFunctionSet = {
    allocator: MATRIX_3X3_ALLOCATOR,

    set_to,
    set_from,
    set_all_to,

    equals,

    invert,
    invert_in_place,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    multiply,
    multiply_in_place,

    is_identity,
    set_to_identity,

    transpose,
    transpose_in_place,

    set_rotation_around_x,
    set_rotation_around_y,
    set_rotation_around_z
};