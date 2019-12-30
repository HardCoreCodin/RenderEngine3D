import {PRECISION_DIGITS} from "../../constants.js";
import {Float9} from "../../types.js";
import {IMatrix3x3FunctionSet, IMatrixRotationFunctionSet} from "../_interfaces/functions.js";
import {MATRIX_3X3_ALLOCATOR} from "../memory/allocators.js";
import {IVector3D} from "../_interfaces/vectors.js";

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

const set_to_cross_product = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    v: number, [X, Y, Z]
) : void => {
    M11a[a] = M22a[a] = M33a[a] = 0;
    M23a[a] = X[v];  M32a[a] = -X[v];
    M31a[a] = Y[v];  M13a[a] = -Y[v];
    M12a[a] = Z[v];  M21a[a] = -Z[v];
};

const set_to_outer_product = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    v1: number, [X1, Y1, Z1],
    v2: number, [X2, Y2, Z2]
) : void => {
    M11a[a] = X1[v1] * X2[v2];  M12a[a] = Y1[v1] * X2[v2];  M13a[a] = Z1[v1] * X2[v2];
    M21a[a] = X1[v1] * Y2[v2];  M22a[a] = Y1[v1] * Y2[v2];  M23a[a] = Z1[v1] * Y2[v2];
    M31a[a] = X1[v1] * Z2[v2];  M32a[a] = Y1[v1] * Z2[v2];  M33a[a] = Z1[v1] * Z2[v2];
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

const broadcast_add = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a] + b;  M21o[o] = M21a[a] + b;  M31o[o] = M31a[a] + b;
    M12o[o] = M12a[a] + b;  M22o[o] = M22a[a] + b;  M32o[o] = M32a[a] + b;
    M13o[o] = M13a[a] + b;  M23o[o] = M23a[a] + b;  M33o[o] = M33a[a] + b;
};

const broadcast_add_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number
) : void => {
    M11a[a] += b;  M21a[a] += b;  M31a[a] += b;
    M12a[a] += b;  M22a[a] += b;  M32a[a] += b;
    M13a[a] += b;  M23a[a] += b;  M33a[a] += b;
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

const broadcast_subtract = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a] - b;  M21o[o] = M21a[a] - b;  M31o[o] = M31a[a] - b;
    M12o[o] = M12a[a] - b;  M22o[o] = M22a[a] - b;  M32o[o] = M32a[a] - b;
    M13o[o] = M13a[a] - b;  M23o[o] = M23a[a] - b;  M33o[o] = M33a[a] - b;
};

const broadcast_subtract_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number
) : void => {
    M11a[a] -= b;  M21a[a] -= b;  M31a[a] -= b;
    M12a[a] -= b;  M22a[a] -= b;  M32a[a] -= b;
    M13a[a] -= b;  M23a[a] -= b;  M33a[a] -= b;
};

const divide = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a] / b;  M21o[o] = M21a[a] / b;  M31o[o] = M31a[a] / b;
    M12o[o] = M12a[a] / b;  M22o[o] = M22a[a] / b;  M32o[o] = M32a[a] / b;
    M13o[o] = M13a[a] / b;  M23o[o] = M23a[a] / b;  M33o[o] = M33a[a] / b;
};

const divide_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number
) : void => {
    M11a[a] /= b;  M21a[a] /= b;  M31a[a] /= b;
    M12a[a] /= b;  M22a[a] /= b;  M32a[a] /= b;
    M13a[a] /= b;  M23a[a] /= b;  M33a[a] /= b;
};

const scale = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    M11o[o] = M11a[a] * b;  M21o[o] = M21a[a] * b;  M31o[o] = M31a[a] * b;
    M12o[o] = M12a[a] * b;  M22o[o] = M22a[a] * b;  M32o[o] = M32a[a] * b;
    M13o[o] = M13a[a] * b;  M23o[o] = M23a[a] * b;  M33o[o] = M33a[a] * b;
};

const scale_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    b: number
) : void => {
    M11a[a] *= b;  M21a[a] *= b;  M31a[a] *= b;
    M12a[a] *= b;  M22a[a] *= b;  M32a[a] *= b;
    M13a[a] *= b;  M23a[a] *= b;  M33a[a] *= b;
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
    t11 = M11a[a];  t12 = M12a[a];  t13 = M13a[a];
    t21 = M21a[a];  t22 = M22a[a];  t23 = M23a[a];
    t31 = M31a[a];  t32 = M32a[a];  t33 = M33a[a];

    M11a[a] = t11*M11b[b] + t12*M21b[b] + t13*M31b[b]; // Row 1 | Column 1
    M21a[a] = t21*M11b[b] + t22*M21b[b] + t23*M31b[b]; // Row 2 | Column 1
    M31a[a] = t31*M11b[b] + t32*M21b[b] + t33*M31b[b]; // Row 3 | Column 1

    M12a[a] = t11*M12b[b] + t12*M22b[b] + t13*M32b[b]; // Row 1 | Column 2
    M22a[a] = t21*M12b[b] + t22*M22b[b] + t23*M32b[b]; // Row 2 | Column 2
    M32a[a] = t31*M12b[b] + t32*M22b[b] + t33*M32b[b]; // Row 3 | Column 2

    M13a[a] = t11*M13b[b] + t12*M23b[b] + t13*M33b[b]; // Row 1 | Column 3
    M23a[a] = t21*M13b[b] + t22*M23b[b] + t23*M33b[b]; // Row 2 | Column 3
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


const rotate_around_x = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
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
    // r21 r22 r23 = 0  cos   sin
    // r31 r32 r33   0  -sin  cos
    //
    // (t11 t12 t13).(1 0 0) (t11 t12 t13).(0 cos -sin) (t11 t12 t13).(0 +sin cos)
    // (t21 t22 t23).(1 0 0) (t21 t22 t23).(0 cos -sin) (t21 t22 t23).(0 +sin cos)
    // (t31 t32 t33).(1 0 0) (t31 t32 t33).(0 cos -sin) (t31 t32 t33).(0 +sin cos)
    //
    // (t11*1 + t12*0 + t13*0) (t11*0 + t12*cos + t13*-sin) (t11*0 + t12*sin + t13*cos)
    // (t21*1 + t22*0 + t23*0) (t21*0 + t22*cos + t23*-sin) (t21*0 + t22*sin + t23*cos)
    // (t31*1 + t32*0 + t33*0) (t31*0 + t32*cos + t33*-sin) (t31*0 + t32*sin + t33*cos)
    //
    // (t11 + 0 + 0) (0 + t12*cos - t13*sin) (0 + t12*sin + t13*cos)
    // (t21 + 0 + 0) (0 + t22*cos - t23*sin) (0 + t22*sin + t23*cos)
    // (t31 + 0 + 0) (0 + t32*cos - t33*sin) (0 + t32*sin + t33*cos)
    //
    // (t11) (t12*cos - t13*sin) (t12*sin + t13*cos)
    // (t21) (t22*cos - t23*sin) (t22*sin + t23*cos)
    // (t31) (t32*cos - t33*sin) (t32*sin + t33*cos)
    //
    // o11=t11  o12=(t12*cos - t13*sin)  o13=(t12*sin + t13*cos)
    // o21=t21  o22=(t22*cos - t23*sin)  o23=(t22*sin + t23*cos)
    // o31=t31  o32=(t32*cos - t33*sin)  o33=(t32*sin + t33*cos)
    //
    // o11 = t11  o12 = t12*cos - t13*sin  o13 = t12*sin + t13*cos
    // o21 = t21  o22 = t22*cos - t23*sin  o23 = t22*sin + t23*cos
    // o31 = t31  o32 = t32*cos - t33*sin  o33 = t32*sin + t33*cos

    M11o[o] = M11a[a];  M12o[o] = M12a[a]*cos - M13a[a]*sin;  M13o[o] = M12a[a]*sin + M13a[a]*cos;
    M21o[o] = M21a[a];  M22o[o] = M22a[a]*cos - M23a[a]*sin;  M23o[o] = M22a[a]*sin + M23a[a]*cos;
    M31o[o] = M31a[a];  M32o[o] = M32a[a]*cos - M33a[a]*sin;  M33o[o] = M32a[a]*sin + M33a[a]*cos;
};

const rotate_around_x_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number
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
    // r21 r22 r23 = 0  cos   sin
    // r31 r32 r33   0  -sin  cos
    //
    // (t11 t12 t13).(1 0 0) (t11 t12 t13).(0 cos -sin) (t11 t12 t13).(0 sin cos)
    // (t21 t22 t23).(1 0 0) (t21 t22 t23).(0 cos -sin) (t21 t22 t23).(0 sin cos)
    // (t31 t32 t33).(1 0 0) (t31 t32 t33).(0 cos -sin) (t31 t32 t33).(0 sin cos)
    //
    // (t11*1 + t12*0 + t13*0) (t11*0 + t12*cos + t13*-sin) (t11*0 + t12*sin + t13*cos)
    // (t21*1 + t22*0 + t23*0) (t21*0 + t22*cos + t23*-sin) (t21*0 + t22*sin + t23*cos)
    // (t31*1 + t32*0 + t33*0) (t31*0 + t32*cos + t33*-sin) (t31*0 + t32*sin + t33*cos)
    //
    // (t11 + 0 + 0) (0 + t12*cos - t13*sin) (0 + t12*sin + t13*cos)
    // (t21 + 0 + 0) (0 + t22*cos - t23*sin) (0 + t22*sin + t23*cos)
    // (t31 + 0 + 0) (0 + t32*cos - t33*sin) (0 + t32*sin + t33*cos)
    //
    // (t11) (t12*cos - t13*sin) (t12*sin + t13*cos)
    // (t21) (t22*cos - t23*sin) (t22*sin + t23*cos)
    // (t31) (t32*cos - t33*sin) (t32*sin + t33*cos)
    //
    // o11=t11  o12=(t12*cos - t13*sin)  o13=(t12*sin + t13*cos)
    // o21=t21  o22=(t22*cos - t23*sin)  o23=(t22*sin + t23*cos)
    // o31=t31  o32=(t32*cos - t33*sin)  o33=(t32*sin + t33*cos)
    //
    // o12 = t12*cos - t13*sin  o13 = t12*sin + t13*cos
    // o22 = t22*cos - t23*sin  o23 = t22*sin + t23*cos
    // o32 = t32*cos - t33*sin  o33 = t32*sin + t33*cos

    t12 = M12a[a];  t13 = M13a[a];
    t22 = M22a[a];  t23 = M23a[a];
    t32 = M32a[a];  t33 = M33a[a];

    M12a[a] = t12*cos - t13*sin;  M13a[a] = t12*sin + t13*cos;
    M22a[a] = t22*cos - t23*sin;  M23a[a] = t22*sin + t23*cos;
    M32a[a] = t32*cos - t33*sin;  M33a[a] = t32*sin + t33*cos;
};

const rotate_around_y = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
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

    M11o[o] = M11a[a]*cos - M13a[a]*sin;  M12o[o] = M12a[a];  M13o[o] = M11a[a]*sin + M13a[a]*cos;
    M21o[o] = M21a[a]*cos - M23a[a]*sin;  M22o[o] = M22a[a];  M23o[o] = M21a[a]*sin + M23a[a]*cos;
    M31o[o] = M31a[a]*cos - M33a[a]*sin;  M32o[o] = M32a[a];  M33o[o] = M31a[a]*sin + M33a[a]*cos;
};

const rotate_around_y_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number
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

    t11 = M11a[a];  t13 = M13a[a];
    t21 = M21a[a];  t23 = M23a[a];
    t31 = M31a[a];  t33 = M33a[a];

    M11a[a] = t11*cos - t13*sin;  M13a[a] = t11*sin + t13*cos;
    M21a[a] = t21*cos - t23*sin;  M23a[a] = t21*sin + t23*cos;
    M31a[a] = t31*cos - t33*sin;  M33a[a] = t31*sin + t33*cos;
};

const rotate_around_z = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number,

    o: number, [
        M11o, M12o, M13o,
        M21o, M22o, M23o,
        M31o, M32o, M33o
    ]: Float9
) : void => {
    // t11 t12 t13     r11 r12 r13
    // t21 t22 t23  *  r21 r22 r23
    // t31 t32 t33     r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r13) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   cos   sin 0
    // r21 r22 r23 = -sin  cos 0
    // r31 r32 r33    0     0  1
    //
    // (t11 t12 t13).(cos -sin 0) (t11 t12 t13).(sin cos 0) (t11 t12 t13).(0 0 1)
    // (t21 t22 t23).(cos -sin 0) (t21 t22 t23).(sin cos 0) (t21 t22 t23).(0 0 1)
    // (t31 t32 t33).(cos -sin 0) (t31 t32 t33).(sin cos 0) (t31 t32 t33).(0 0 1)
    //
    // (t11*cos + t12*-sin + t13*0) (t11*sin + t12*cos + t13*0) (t11*0 + t12*0 + t13*1)
    // (t21*cos + t22*-sin + t23*0) (t21*sin + t22*cos + t23*0) (t21*0 + t22*0 + t23*1)
    // (t31*cos + t32*-sin + t33*0) (t31*sin + t32*cos + t33*0) (t31*0 + t32*0 + t33*1)
    //
    // (t11*cos + t12*-sin + 0) (t11*sin + t12*cos + 0) (0 + 0 + t13)
    // (t21*cos + t22*-sin + 0) (t21*sin + t22*cos + 0) (0 + 0 + t23)
    // (t31*cos + t32*-sin + 0) (t31*sin + t32*cos + 0) (0 + 0 + t33)
    //
    // (t11*cos - t12*sin) (t11*sin + t12*cos) (t13)
    // (t21*cos - t22*sin) (t21*sin + t22*cos) (t23)
    // (t31*cos - t32*sin) (t31*sin + t32*cos) (t33)
    //
    // o11=(t11*cos - t12*sin)  o12=(t11*sin + t12*cos)  o13=t13
    // o21=(t21*cos - t22*sin)  o22=(t21*sin + t22*cos)  o23=t23
    // o31=(t31*cos - t32*sin)  o32=(t31*sin + t32*cos)  o33=t33
    //
    // o11 = t11*cos - t12*sin  o12 = t11*sin + t12*cos  o13 = t13
    // o21 = t21*cos - t22*sin  o22 = t21*sin + t22*cos  o23 = t23
    // o31 = t31*cos - t32*sin  o32 = t31*sin + t32*cos  o33 = t33

    M11o[o] = M11a[a]*cos - M12a[a]*sin;  M12o[o] = M11a[a]*sin + M12a[a]*cos;  M13o[o] = M13a[a];
    M21o[o] = M21a[a]*cos - M22a[a]*sin;  M22o[o] = M21a[a]*sin + M22a[a]*cos;  M23o[o] = M23a[a];
    M31o[o] = M31a[a]*cos - M32a[a]*sin;  M32o[o] = M31a[a]*sin + M32a[a]*cos;  M33o[o] = M33a[a];
};

const rotate_around_z_in_place = (
    a: number, [
        M11a, M12a, M13a,
        M21a, M22a, M23a,
        M31a, M32a, M33a
    ]: Float9,

    cos: number,
    sin: number
) : void => {
    // t11 t12 t13      r11 r12 r13
    // t21 t22 t23  *=  r21 r22 r23
    // t31 t32 t33      r31 r32 r33
    //
    // (t11 t12 t13).(r11 r21 r31) (t11 t12 t13).(r12 r22 r32) (t11 t12 t13).(r13 r23 r33)
    // (t21 t22 t23).(r11 r21 r31) (t21 t22 t23).(r12 r22 r32) (t21 t22 t23).(r13 r23 r33)
    // (t31 t32 t33).(r11 r21 r31) (t31 t32 t33).(r12 r22 r32) (t31 t32 t33).(r13 r23 r33)
    //
    // r11 r12 r13   cos   sin 0
    // r21 r22 r23 = -sin  cos 0
    // r31 r32 r33    0     0  1
    //
    // (t11 t12 t13).(cos -sin 0) (t11 t12 t13).(+sin cos 0) (t11 t12 t13).(0 0 1)
    // (t21 t22 t23).(cos -sin 0) (t21 t22 t23).(+sin cos 0) (t21 t22 t23).(0 0 1)
    // (t31 t32 t33).(cos -sin 0) (t31 t32 t33).(+sin cos 0) (t31 t32 t33).(0 0 1)
    //
    // (t11*cos + t12*-sin + t13*0) (t11*sin + t12*cos + t13*0) (t11*0 + t12*0 + t13*1)
    // (t21*cos + t22*-sin + t23*0) (t21*sin + t22*cos + t23*0) (t21*0 + t22*0 + t23*1)
    // (t31*cos + t32*-sin + t33*0) (t31*sin + t32*cos + t33*0) (t31*0 + t32*0 + t33*1)
    //
    // (t11*cos + t12*-sin + 0) (t11*+sin + t12*cos + 0) (0 + 0 + t13)
    // (t21*cos + t22*-sin + 0) (t21*+sin + t22*cos + 0) (0 + 0 + t23)
    // (t31*cos + t32*-sin + 0) (t31*+sin + t32*cos + 0) (0 + 0 + t33)
    //
    // (t11*cos + t12*-sin) (t11*sin + t12*cos) (t13)
    // (t21*cos + t22*-sin) (t21*sin + t22*cos) (t23)
    // (t31*cos + t32*-sin) (t31*sin + t32*cos) (t33)
    //
    // o11=(t11*cos - t12*sin)  o12=(t11*sin + t12*cos)  o13=t13
    // o21=(t21*cos - t22*sin)  o22=(t21*sin + t22*cos)  o23=t23
    // o31=(t31*cos - t32*sin)  o32=(t31*sin + t32*cos)  o33=t33
    //
    // o11 = t11*cos - t12*sin  o12 = t11*sin + t12*cos
    // o21 = t21*cos - t22*sin  o22 = t21*sin + t22*cos
    // o31 = t31*cos - t32*sin  o32 = t31*sin + t32*cos

    t11 = M11a[a];  t12 = M12a[a];
    t21 = M21a[a];  t22 = M22a[a];
    t31 = M31a[a];  t32 = M32a[a];

    M11a[a] = t11*cos - t12*sin;  M12a[a] = t11*sin + t12*cos;
    M21a[a] = t21*cos - t22*sin;  M22a[a] = t21*sin + t22*cos;
    M31a[a] = t31*cos - t32*sin;  M32a[a] = t31*sin + t32*cos;
};

export const rotationMatrixFunctions: IMatrixRotationFunctionSet = {
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

    broadcast_add,
    broadcast_add_in_place,

    broadcast_subtract,
    broadcast_subtract_in_place,

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
    set_rotation_around_z,

    rotate_around_x,
    rotate_around_y,
    rotate_around_z,

    rotate_around_x_in_place,
    rotate_around_y_in_place,
    rotate_around_z_in_place
};

export const matrix3x3Functions: IMatrix3x3FunctionSet = {
    ...rotationMatrixFunctions,

    set_to_cross_product,
    set_to_outer_product
};