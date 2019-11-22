import { PRECISION_DIGITS } from "../constants.js";
import { RotationMatrix } from "./mat.js";
import { Buffer } from "../allocators.js";
import { update_matrix4x4_arrays } from "./vec4.js";
let t11, t12, t13, t14, t21, t22, t23, t24, t31, t32, t33, t34, t41, t42, t43, t44;
let M11, M12, M13, M14, M21, M22, M23, M24, M31, M32, M33, M34, M41, M42, M43, M44;
const MATRIX4x4_ARRAYS = [
    null, null, null, null,
    null, null, null, null,
    null, null, null, null,
    null, null, null, null
];
const __buffer_slice = [
    null, null, null, null,
    null, null, null, null,
    null, null, null, null,
    null, null, null, null
];
const __buffer_entry = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
];
class Buffer4x4 extends Buffer {
    constructor() {
        super(...arguments);
        this._entry = __buffer_entry;
        this._slice = __buffer_slice;
    }
    _onBuffersChanged() {
        [
            M11, M12, M13, M14,
            M21, M22, M23, M24,
            M31, M32, M33, M34,
            M41, M42, M43, M44
        ] = MATRIX4x4_ARRAYS;
        update_matrix4x4_arrays(MATRIX4x4_ARRAYS);
    }
}
export const matrix4x4buffer = new Buffer4x4(MATRIX4x4_ARRAYS);
const get = (a, dim) => MATRIX4x4_ARRAYS[dim][a];
const set = (a, dim, value) => { MATRIX4x4_ARRAYS[dim][a] = value; };
const set_to = (a, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) => {
    M11[a] = m11;
    M12[a] = m12;
    M13[a] = m13;
    M14[a] = m14;
    M21[a] = m21;
    M22[a] = m22;
    M23[a] = m23;
    M24[a] = m24;
    M31[a] = m31;
    M32[a] = m32;
    M33[a] = m33;
    M34[a] = m34;
    M41[a] = m41;
    M42[a] = m42;
    M43[a] = m43;
    M44[a] = m44;
};
const set_all_to = (a, value) => {
    M11[a] = M12[a] = M13[a] = M14[a] =
        M21[a] = M22[a] = M23[a] = M24[a] =
            M31[a] = M32[a] = M33[a] = M34[a] =
                M41[a] = M42[a] = M43[a] = M44[a] = value;
};
const set_from = (a, o) => {
    M11[a] = M11[o];
    M12[a] = M12[o];
    M13[a] = M13[o];
    M14[a] = M14[o];
    M21[a] = M21[o];
    M22[a] = M22[o];
    M23[a] = M23[o];
    M24[a] = M24[o];
    M31[a] = M31[o];
    M32[a] = M32[o];
    M33[a] = M33[o];
    M34[a] = M34[o];
    M41[a] = M41[o];
    M42[a] = M42[o];
    M43[a] = M43[o];
    M44[a] = M44[o];
};
const set_to_identity = (a) => {
    M11[a] = M22[a] = M33[a] = M44[a] = 1;
    M12[a] = M13[a] = M14[a] =
        M22[a] = M23[a] = M24[a] =
            M31[a] = M32[a] = M34[a] =
                M41[a] = M42[a] = M43[a] = 0;
};
const invert = (a, o) => {
    M14[o] = M14[a];
    M11[o] = M11[a];
    M12[o] = M21[a];
    M13[o] = M31[a];
    M23[o] = M32[a];
    M24[o] = M24[a];
    M22[o] = M22[a];
    M21[o] = M12[a];
    M31[o] = M13[a];
    M32[o] = M23[a];
    M34[o] = M34[a];
    M33[o] = M33[a];
    M41[o] = -(M41[a] * M11[a] + M42[a] * M12[a] + M43[a] * M13[a]);
    M42[o] = -(M41[a] * M21[a] + M42[a] * M22[a] + M43[a] * M23[a]);
    M43[o] = -(M41[a] * M31[a] + M42[a] * M32[a] + M43[a] * M33[a]);
    M44[o] = 1;
};
const invert_in_place = (a) => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    t11 = M11[a];
    t21 = M21[a];
    t31 = M31[a];
    t41 = M41[a];
    t12 = M12[a];
    t22 = M22[a];
    t32 = M32[a];
    t42 = M42[a];
    t13 = M13[a];
    t23 = M23[a];
    t33 = M33[a];
    t43 = M43[a];
    // Transpose the rotation portion of the matrix:
    M21[a] = t12;
    M31[a] = t13;
    M12[a] = t21;
    M32[a] = t23;
    M13[a] = t31;
    M23[a] = t32;
    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    M41[a] = -(t41 * t11 + t42 * t12 + t43 * t13); // -Dot(original_translation, original_rotation_x)
    M42[a] = -(t41 * t21 + t42 * t22 + t43 * t23); // -Dot(original_translation, original_rotation_y)
    M43[a] = -(t41 * t31 + t42 * t32 + t43 * t33); // -Dot(original_translation, original_rotation_z)
    M44[a] = 1;
};
const transpose = (a, o) => {
    M11[o] = M11[a];
    M21[o] = M12[a];
    M31[o] = M13[a];
    M41[o] = M14[a];
    M12[o] = M21[a];
    M22[o] = M22[a];
    M32[o] = M23[a];
    M42[o] = M24[a];
    M13[o] = M31[a];
    M23[o] = M32[a];
    M33[o] = M33[a];
    M43[o] = M34[a];
    M14[o] = M41[a];
    M24[o] = M42[a];
    M34[o] = M43[a];
    M44[o] = M44[a];
};
const transpose_in_place = (a) => {
    [
        M12[a], M13[a], M14[a], M21[a], M23[a], M24[a], M31[a], M32[a], M34[a], M41[a], M42[a], M43[a]
    ] = [
        M21[a], M31[a], M41[a], M12[a], M32[a], M42[a], M13[a], M23[a], M43[a], M14[a], M24[a], M34[a]
    ];
};
const equals = (a, b) => M11[a].toFixed(PRECISION_DIGITS) ===
    M11[b].toFixed(PRECISION_DIGITS) &&
    M12[a].toFixed(PRECISION_DIGITS) ===
        M12[b].toFixed(PRECISION_DIGITS) &&
    M13[a].toFixed(PRECISION_DIGITS) ===
        M13[b].toFixed(PRECISION_DIGITS) &&
    M14[a].toFixed(PRECISION_DIGITS) ===
        M14[b].toFixed(PRECISION_DIGITS) &&
    M21[a].toFixed(PRECISION_DIGITS) ===
        M21[b].toFixed(PRECISION_DIGITS) &&
    M22[a].toFixed(PRECISION_DIGITS) ===
        M22[b].toFixed(PRECISION_DIGITS) &&
    M23[a].toFixed(PRECISION_DIGITS) ===
        M23[b].toFixed(PRECISION_DIGITS) &&
    M24[a].toFixed(PRECISION_DIGITS) ===
        M24[b].toFixed(PRECISION_DIGITS) &&
    M31[a].toFixed(PRECISION_DIGITS) ===
        M31[b].toFixed(PRECISION_DIGITS) &&
    M32[a].toFixed(PRECISION_DIGITS) ===
        M32[b].toFixed(PRECISION_DIGITS) &&
    M33[a].toFixed(PRECISION_DIGITS) ===
        M33[b].toFixed(PRECISION_DIGITS) &&
    M34[a].toFixed(PRECISION_DIGITS) ===
        M34[b].toFixed(PRECISION_DIGITS) &&
    M41[a].toFixed(PRECISION_DIGITS) ===
        M41[b].toFixed(PRECISION_DIGITS) &&
    M42[a].toFixed(PRECISION_DIGITS) ===
        M42[b].toFixed(PRECISION_DIGITS) &&
    M43[a].toFixed(PRECISION_DIGITS) ===
        M43[b].toFixed(PRECISION_DIGITS) &&
    M44[a].toFixed(PRECISION_DIGITS) ===
        M44[b].toFixed(PRECISION_DIGITS);
const is_identity = (a) => M11[a] === 1 && M21[a] === 0 && M31[a] === 0 && M41[a] === 0 &&
    M12[a] === 0 && M22[a] === 1 && M32[a] === 0 && M42[a] === 0 &&
    M13[a] === 0 && M23[a] === 0 && M33[a] === 1 && M43[a] === 0 &&
    M14[a] === 0 && M24[a] === 0 && M34[a] === 0 && M44[a] === 1;
const add = (a, b, o) => {
    M11[o] = M11[a] + M11[b];
    M21[o] = M21[a] + M21[b];
    M31[o] = M31[a] + M31[b];
    M41[o] = M41[a] + M41[b];
    M12[o] = M12[a] + M12[b];
    M22[o] = M22[a] + M22[b];
    M32[o] = M32[a] + M32[b];
    M42[o] = M42[a] + M42[b];
    M13[o] = M13[a] + M13[b];
    M23[o] = M23[a] + M23[b];
    M33[o] = M33[a] + M33[b];
    M43[o] = M43[a] + M43[b];
    M14[o] = M14[a] + M14[b];
    M24[o] = M24[a] + M24[b];
    M34[o] = M34[a] + M34[b];
    M44[o] = M44[a] + M44[b];
};
const add_in_place = (a, b) => {
    M11[a] += M11[b];
    M21[a] += M21[b];
    M31[a] += M31[b];
    M41[a] += M41[b];
    M12[a] += M12[b];
    M22[a] += M22[b];
    M32[a] += M32[b];
    M42[a] += M42[b];
    M13[a] += M13[b];
    M23[a] += M23[b];
    M33[a] += M33[b];
    M43[a] += M43[b];
    M14[a] += M14[b];
    M24[a] += M24[b];
    M34[a] += M34[b];
    M44[a] += M44[b];
};
const subtract = (a, b, o) => {
    M11[o] = M11[a] - M11[b];
    M21[o] = M21[a] - M21[b];
    M31[o] = M31[a] - M31[b];
    M41[o] = M41[a] - M41[b];
    M12[o] = M12[a] - M12[b];
    M22[o] = M22[a] - M22[b];
    M32[o] = M32[a] - M32[b];
    M42[o] = M42[a] - M42[b];
    M13[o] = M13[a] - M13[b];
    M23[o] = M23[a] - M23[b];
    M33[o] = M33[a] - M33[b];
    M43[o] = M43[a] - M43[b];
    M14[o] = M14[a] - M14[b];
    M24[o] = M24[a] - M24[b];
    M34[o] = M34[a] - M34[b];
    M44[o] = M44[a] - M44[b];
};
const subtract_in_place = (a, b) => {
    M11[a] -= M11[b];
    M21[a] -= M21[b];
    M31[a] -= M31[b];
    M41[a] -= M41[b];
    M12[a] -= M12[b];
    M22[a] -= M22[b];
    M32[a] -= M32[b];
    M42[a] -= M42[b];
    M13[a] -= M13[b];
    M23[a] -= M23[b];
    M33[a] -= M33[b];
    M43[a] -= M43[b];
    M14[a] -= M14[b];
    M24[a] -= M24[b];
    M34[a] -= M34[b];
    M44[a] -= M44[b];
};
const divide = (a, o, n) => {
    M11[o] = M11[a] / n;
    M21[o] = M21[a] / n;
    M31[o] = M31[a] / n;
    M41[o] = M41[a] / n;
    M12[o] = M12[a] / n;
    M22[o] = M22[a] / n;
    M32[o] = M32[a] / n;
    M42[o] = M42[a] / n;
    M13[o] = M13[a] / n;
    M23[o] = M23[a] / n;
    M33[o] = M33[a] / n;
    M43[o] = M43[a] / n;
    M14[o] = M14[a] / n;
    M24[o] = M24[a] / n;
    M34[o] = M34[a] / n;
    M44[o] = M44[a] / n;
};
const divide_in_place = (a, n) => {
    M11[a] /= n;
    M21[a] /= n;
    M31[a] /= n;
    M41[a] /= n;
    M12[a] /= n;
    M22[a] /= n;
    M32[a] /= n;
    M42[a] /= n;
    M13[a] /= n;
    M23[a] /= n;
    M33[a] /= n;
    M43[a] /= n;
    M14[a] /= n;
    M24[a] /= n;
    M34[a] /= n;
    M44[a] /= n;
};
const scale = (a, o, n) => {
    M11[o] = M11[a] * n;
    M21[o] = M21[a] * n;
    M31[o] = M31[a] * n;
    M41[o] = M41[a] * n;
    M12[o] = M12[a] * n;
    M22[o] = M22[a] * n;
    M32[o] = M32[a] * n;
    M42[o] = M42[a] * n;
    M13[o] = M13[a] * n;
    M23[o] = M23[a] * n;
    M33[o] = M33[a] * n;
    M43[o] = M43[a] * n;
    M14[o] = M14[a] * n;
    M24[o] = M24[a] * n;
    M34[o] = M34[a] * n;
    M44[o] = M44[a] * n;
};
const scale_in_place = (a, n) => {
    M11[a] *= n;
    M21[a] *= n;
    M31[a] *= n;
    M41[a] *= n;
    M12[a] *= n;
    M22[a] *= n;
    M32[a] *= n;
    M42[a] *= n;
    M13[a] *= n;
    M23[a] *= n;
    M33[a] *= n;
    M43[a] *= n;
    M14[a] *= n;
    M24[a] *= n;
    M34[a] *= n;
    M44[a] *= n;
};
const multiply = (a, b, o) => {
    M11[o] = M11[a] * M11[b] + M12[a] * M21[b] + M13[a] * M31[b] + M14[a] * M41[b]; // Row 1 | Column 1
    M12[o] = M11[a] * M12[b] + M12[a] * M22[b] + M13[a] * M32[b] + M14[a] * M42[b]; // Row 1 | Column 2
    M13[o] = M11[a] * M13[b] + M12[a] * M23[b] + M13[a] * M33[b] + M14[a] * M43[b]; // Row 1 | Column 3
    M14[o] = M11[a] * M14[b] + M12[a] * M24[b] + M13[a] * M34[b] + M14[a] * M44[b]; // Row 1 | Column 4
    M21[o] = M21[a] * M11[b] + M22[a] * M21[b] + M23[a] * M31[b] + M24[a] * M41[b]; // Row 2 | Column 1
    M22[o] = M21[a] * M12[b] + M22[a] * M22[b] + M23[a] * M32[b] + M24[a] * M42[b]; // Row 2 | Column 2
    M23[o] = M21[a] * M13[b] + M22[a] * M23[b] + M23[a] * M33[b] + M24[a] * M43[b]; // Row 2 | Column 3
    M24[o] = M21[a] * M14[b] + M22[a] * M24[b] + M23[a] * M34[b] + M24[a] * M44[b]; // Row 2 | Column 4
    M31[o] = M31[a] * M11[b] + M32[a] * M21[b] + M33[a] * M31[b] + M34[a] * M41[b]; // Row 3 | Column 1
    M32[o] = M31[a] * M12[b] + M32[a] * M22[b] + M33[a] * M32[b] + M34[a] * M42[b]; // Row 3 | Column 2
    M33[o] = M31[a] * M13[b] + M32[a] * M23[b] + M33[a] * M33[b] + M34[a] * M43[b]; // Row 3 | Column 3
    M34[o] = M31[a] * M14[b] + M32[a] * M24[b] + M33[a] * M34[b] + M34[a] * M44[b]; // Row 3 | Column 4
    M41[o] = M41[a] * M11[b] + M42[a] * M21[b] + M43[a] * M31[b] + M44[a] * M41[b]; // Row 4 | Column 1
    M42[o] = M41[a] * M12[b] + M42[a] * M22[b] + M43[a] * M32[b] + M44[a] * M42[b]; // Row 4 | Column 2
    M43[o] = M41[a] * M13[b] + M42[a] * M23[b] + M43[a] * M33[b] + M44[a] * M43[b]; // Row 4 | Column 3
    M44[o] = M41[a] * M14[b] + M42[a] * M24[b] + M43[a] * M34[b] + M44[a] * M44[b]; // Row 4 | Column 4
};
const multiply_in_place = (a, b) => {
    t11 = M11[a];
    t21 = M21[a];
    t31 = M31[a];
    t41 = M41[a];
    t12 = M12[a];
    t22 = M22[a];
    t32 = M32[a];
    t42 = M42[a];
    t13 = M13[a];
    t23 = M23[a];
    t33 = M33[a];
    t43 = M43[a];
    t14 = M14[a];
    t24 = M24[a];
    t34 = M34[a];
    t44 = M44[a];
    M11[a] = t11 * M11[b] + t12 * M21[b] + t13 * M31[b] + t14 * M41[b]; // Row 1 | Column 1
    M12[a] = t11 * M12[b] + t12 * M22[b] + t13 * M32[b] + t14 * M42[b]; // Row 1 | Column 2
    M13[a] = t11 * M13[b] + t12 * M23[b] + t13 * M33[b] + t14 * M43[b]; // Row 1 | Column 3
    M14[a] = t11 * M14[b] + t12 * M24[b] + t13 * M34[b] + t14 * M44[b]; // Row 1 | Column 4
    M21[a] = t21 * M11[b] + t22 * M21[b] + t23 * M31[b] + t24 * M41[b]; // Row 2 | Column 1
    M22[a] = t21 * M12[b] + t22 * M22[b] + t23 * M32[b] + t24 * M42[b]; // Row 2 | Column 2
    M23[a] = t21 * M13[b] + t22 * M23[b] + t23 * M33[b] + t24 * M43[b]; // Row 2 | Column 3
    M24[a] = t21 * M14[b] + t22 * M24[b] + t23 * M34[b] + t24 * M44[b]; // Row 2 | Column 4
    M31[a] = t31 * M11[b] + t32 * M21[b] + t33 * M31[b] + t34 * M41[b]; // Row 3 | Column 1
    M32[a] = t31 * M12[b] + t32 * M22[b] + t33 * M32[b] + t34 * M42[b]; // Row 3 | Column 2
    M33[a] = t31 * M13[b] + t32 * M23[b] + t33 * M33[b] + t34 * M43[b]; // Row 3 | Column 3
    M34[a] = t31 * M14[b] + t32 * M24[b] + t33 * M34[b] + t34 * M44[b]; // Row 3 | Column 4
    M41[a] = t41 * M11[b] + t42 * M21[b] + t43 * M31[b] + t44 * M41[b]; // Row 4 | Column 1
    M42[a] = t41 * M12[b] + t42 * M22[b] + t43 * M32[b] + t44 * M42[b]; // Row 4 | Column 2
    M43[a] = t41 * M13[b] + t42 * M23[b] + t43 * M33[b] + t44 * M43[b]; // Row 4 | Column 3
    M44[a] = t41 * M14[b] + t42 * M24[b] + t43 * M34[b] + t44 * M44[b]; // Row 4 | Column 4
};
const set_rotation_around_x = (a, cos, sin) => {
    M33[a] = M22[a] = cos;
    M23[a] = sin;
    M32[a] = -sin;
};
const set_rotation_around_y = (a, cos, sin) => {
    M11[a] = M33[a] = cos;
    M13[a] = sin;
    M31[a] = -sin;
};
const set_rotation_around_z = (a, cos, sin) => {
    M11[a] = M22[a] = cos;
    M12[a] = sin;
    M21[a] = -sin;
};
const matrixFunctions = {
    get,
    set,
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
export default class Matrix4x4 extends RotationMatrix {
    constructor() {
        super(...arguments);
        this._ = matrixFunctions;
        this._buffer = matrix4x4buffer;
    }
    set m11(m11) { M11[this.id] = m11; }
    set m12(m12) { M12[this.id] = m12; }
    set m13(m13) { M13[this.id] = m13; }
    set m14(m14) { M14[this.id] = m14; }
    set m21(m21) { M21[this.id] = m21; }
    set m22(m22) { M22[this.id] = m22; }
    set m23(m23) { M23[this.id] = m23; }
    set m24(m24) { M24[this.id] = m24; }
    set m31(m31) { M31[this.id] = m31; }
    set m32(m32) { M32[this.id] = m32; }
    set m33(m33) { M33[this.id] = m33; }
    set m34(m34) { M34[this.id] = m34; }
    set m41(m41) { M41[this.id] = m41; }
    set m42(m42) { M42[this.id] = m42; }
    set m43(m43) { M43[this.id] = m43; }
    set m44(m44) { M44[this.id] = m44; }
    get m11() { return M11[this.id]; }
    get m12() { return M12[this.id]; }
    get m13() { return M13[this.id]; }
    get m14() { return M14[this.id]; }
    get m21() { return M21[this.id]; }
    get m22() { return M22[this.id]; }
    get m23() { return M23[this.id]; }
    get m24() { return M24[this.id]; }
    get m31() { return M31[this.id]; }
    get m32() { return M32[this.id]; }
    get m33() { return M33[this.id]; }
    get m34() { return M34[this.id]; }
    get m41() { return M41[this.id]; }
    get m42() { return M42[this.id]; }
    get m43() { return M43[this.id]; }
    get m44() { return M44[this.id]; }
    setTo(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        set_to(this.id, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return this;
    }
}
export const mat4x4 = (m11 = 0, m12 = 0, m13 = 0, m14 = 0, m21 = 0, m22 = 0, m23 = 0, m24 = 0, m31 = 0, m32 = 0, m33 = 0, m34 = 0, m41 = 0, m42 = 0, m43 = 0, m44 = 0) => new Matrix4x4(matrix4x4buffer.tempID).setTo(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
//# sourceMappingURL=mat4x4.js.map