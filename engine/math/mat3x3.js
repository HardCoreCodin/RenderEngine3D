import { RotationMatrix } from "./mat.js";
import { TypedArraysBuffer } from "../buffer.js";
import { PRECISION_DIGITS } from "../constants.js";
import { update_matrix3x3_arrays } from "./vec3.js";
let t11, t12, t13, t21, t22, t23, t31, t32, t33;
let M11, M12, M13, M21, M22, M23, M31, M32, M33;
const MATRIX3x3_ARRAYS = [
    null, null, null,
    null, null, null,
    null, null, null
];
export const update_arrays = () => [
    M11, M12, M13,
    M21, M22, M23,
    M31, M32, M33
] = update_matrix3x3_arrays(MATRIX3x3_ARRAYS);
export const matrix3x3Buffer = new TypedArraysBuffer(3 * 3, Float32Array, update_arrays, MATRIX3x3_ARRAYS);
const getTempID = () => matrix3x3Buffer.allocateTemp();
const get = (a, dim) => MATRIX3x3_ARRAYS[dim][a];
const set = (a, dim, value) => { MATRIX3x3_ARRAYS[dim][a] = value; };
const set_to = (a, m11, m12, m13, m21, m22, m23, m31, m32, m33) => {
    M11[a] = m11;
    M12[a] = m12;
    M13[a] = m13;
    M21[a] = m21;
    M22[a] = m22;
    M23[a] = m23;
    M31[a] = m31;
    M32[a] = m32;
    M33[a] = m33;
};
const set_all_to = (a, value) => {
    M11[a] = M12[a] = M13[a] =
        M21[a] = M22[a] = M23[a] =
            M31[a] = M32[a] = M33[a] = value;
};
const set_from = (a, o) => {
    M11[a] = M11[o];
    M12[a] = M12[o];
    M13[a] = M13[o];
    M21[a] = M21[o];
    M22[a] = M22[o];
    M23[a] = M23[o];
    M31[a] = M31[o];
    M32[a] = M32[o];
    M33[a] = M33[o];
};
const set_to_identity = (a) => {
    M11[a] = M22[a] = M33[a] = 1;
    M12[a] = M13[a] = M22[a] = M23[a] = M31[a] = M32[a] = 0;
};
const invert = (a, o) => {
    M13[o] = M13[a];
    M11[o] = M11[a];
    M23[o] = M23[a];
    M22[o] = M22[a];
    // Transpose the rotation portion of the matrix: 
    M12[o] = M21[a];
    M21[o] = M12[a];
    M31[o] = -(M31[a] * M11[a] + M32[a] * M12[a]); // -Dot(original_translation, original_rotation_x)
    M32[o] = -(M31[a] * M21[a] + M32[a] * M22[a]); // -Dot(original_translation, original_rotation_y)
    M33[o] = 1;
};
const invert_in_place = (a) => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    t11 = M11[a];
    t21 = M21[a];
    t31 = M31[a];
    t12 = M12[a];
    t22 = M22[a];
    t32 = M32[a];
    // Transpose the rotation portion of the matrix:
    M12[a] = t21[a];
    M21[a] = t12[a];
    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    M31[a] = -(t31 * t11 + t32 * t12); // -Dot(original_translation, original_rotation_x)
    M32[a] = -(t31 * t21 + t32 * t22); // -Dot(original_translation, original_rotation_y)
    M33[a] = 1;
};
const transpose = (a, o) => {
    M11[o] = M11[a];
    M21[o] = M12[a];
    M31[o] = M13[a];
    M12[o] = M21[a];
    M22[o] = M22[a];
    M32[o] = M23[a];
    M13[o] = M31[a];
    M23[o] = M32[a];
    M33[o] = M33[a];
};
const transpose_in_place = (a) => {
    [
        M12[a], M13[a], M21[a], M23[a], M31[a], M32[a]
    ] = [
        M21[a], M31[a], M12[a], M32[a], M13[a], M23[a]
    ];
};
const equals = (a, b) => M11[a].toFixed(PRECISION_DIGITS) ===
    M11[b].toFixed(PRECISION_DIGITS) &&
    M12[a].toFixed(PRECISION_DIGITS) ===
        M12[b].toFixed(PRECISION_DIGITS) &&
    M13[a].toFixed(PRECISION_DIGITS) ===
        M13[b].toFixed(PRECISION_DIGITS) &&
    M21[a].toFixed(PRECISION_DIGITS) ===
        M21[b].toFixed(PRECISION_DIGITS) &&
    M22[a].toFixed(PRECISION_DIGITS) ===
        M22[b].toFixed(PRECISION_DIGITS) &&
    M23[a].toFixed(PRECISION_DIGITS) ===
        M23[b].toFixed(PRECISION_DIGITS) &&
    M31[a].toFixed(PRECISION_DIGITS) ===
        M31[b].toFixed(PRECISION_DIGITS) &&
    M32[a].toFixed(PRECISION_DIGITS) ===
        M32[b].toFixed(PRECISION_DIGITS) &&
    M33[a].toFixed(PRECISION_DIGITS) ===
        M33[b].toFixed(PRECISION_DIGITS);
const is_identity = (a) => M11[a] === 1 && M21[a] === 0 && M31[a] === 0 &&
    M12[a] === 0 && M22[a] === 1 && M32[a] === 0 &&
    M13[a] === 0 && M23[a] === 0 && M33[a] === 1;
const add = (a, b, o) => {
    M11[o] = M11[a] + M11[b];
    M21[o] = M21[a] + M21[b];
    M31[o] = M31[a] + M31[b];
    M12[o] = M12[a] + M12[b];
    M22[o] = M22[a] + M22[b];
    M32[o] = M32[a] + M32[b];
    M13[o] = M13[a] + M13[b];
    M23[o] = M23[a] + M23[b];
    M33[o] = M33[a] + M33[b];
};
const add_in_place = (a, b) => {
    M11[a] += M11[b];
    M21[a] += M21[b];
    M31[a] += M31[b];
    M12[a] += M12[b];
    M22[a] += M22[b];
    M32[a] += M32[b];
    M13[a] += M13[b];
    M23[a] += M23[b];
    M33[a] += M33[b];
};
const subtract = (a, b, o) => {
    M11[o] = M11[a] - M11[b];
    M21[o] = M21[a] - M21[b];
    M31[o] = M31[a] - M31[b];
    M12[o] = M12[a] - M12[b];
    M22[o] = M22[a] - M22[b];
    M32[o] = M32[a] - M32[b];
    M13[o] = M13[a] - M13[b];
    M23[o] = M23[a] - M23[b];
    M33[o] = M33[a] - M33[b];
};
const subtract_in_place = (a, b) => {
    M11[a] -= M11[b];
    M21[a] -= M21[b];
    M31[a] -= M31[b];
    M12[a] -= M12[b];
    M22[a] -= M22[b];
    M32[a] -= M32[b];
    M13[a] -= M13[b];
    M23[a] -= M23[b];
    M33[a] -= M33[b];
};
const divide = (a, o, n) => {
    M11[o] = M11[a] / n;
    M21[o] = M21[a] / n;
    M31[o] = M31[a] / n;
    M12[o] = M12[a] / n;
    M22[o] = M22[a] / n;
    M32[o] = M32[a] / n;
    M13[o] = M13[a] / n;
    M23[o] = M23[a] / n;
    M33[o] = M33[a] / n;
};
const divide_in_place = (a, n) => {
    M11[a] /= n;
    M21[a] /= n;
    M31[a] /= n;
    M12[a] /= n;
    M22[a] /= n;
    M32[a] /= n;
    M13[a] /= n;
    M23[a] /= n;
    M33[a] /= n;
};
const scale = (a, o, n) => {
    M11[o] = M11[a] * n;
    M21[o] = M21[a] * n;
    M31[o] = M31[a] * n;
    M12[o] = M12[a] * n;
    M22[o] = M22[a] * n;
    M32[o] = M32[a] * n;
    M13[o] = M13[a] * n;
    M23[o] = M23[a] * n;
    M33[o] = M33[a] * n;
};
const scale_in_place = (a, n) => {
    M11[a] *= n;
    M21[a] *= n;
    M31[a] *= n;
    M12[a] *= n;
    M22[a] *= n;
    M32[a] *= n;
    M13[a] *= n;
    M23[a] *= n;
    M33[a] *= n;
};
const multiply = (a, b, o) => {
    M11[o] = M11[a] * M11[b] + M12[a] * M21[b] + M13[a] * M31[b]; // Row 1 | Column 1
    M12[o] = M11[a] * M12[b] + M12[a] * M22[b] + M13[a] * M32[b]; // Row 1 | Column 2
    M13[o] = M11[a] * M13[b] + M12[a] * M23[b] + M13[a] * M33[b]; // Row 1 | Column 3
    M21[o] = M21[a] * M11[b] + M22[a] * M21[b] + M23[a] * M31[b]; // Row 2 | Column 1
    M22[o] = M21[a] * M12[b] + M22[a] * M22[b] + M23[a] * M32[b]; // Row 2 | Column 2
    M23[o] = M21[a] * M13[b] + M22[a] * M23[b] + M23[a] * M33[b]; // Row 2 | Column 3
    M31[o] = M31[a] * M11[b] + M32[a] * M21[b] + M33[a] * M31[b]; // Row 3 | Column 1
    M32[o] = M31[a] * M12[b] + M32[a] * M22[b] + M33[a] * M32[b]; // Row 3 | Column 2
    M33[o] = M31[a] * M13[b] + M32[a] * M23[b] + M33[a] * M33[b]; // Row 3 | Column 3
};
const multiply_in_place = (a, b) => {
    t11 = M11[a];
    t21 = M21[a];
    t31 = M31[a];
    t12 = M12[a];
    t22 = M22[a];
    t32 = M32[a];
    t13 = M13[a];
    t23 = M23[a];
    t33 = M33[a];
    M11[a] = t11 * M11[b] + t12 * M21[b] + t13 * M31[b]; // Row 1 | Column 1
    M12[a] = t11 * M12[b] + t12 * M22[b] + t13 * M32[b]; // Row 1 | Column 2
    M13[a] = t11 * M13[b] + t12 * M23[b] + t13 * M33[b]; // Row 1 | Column 3
    M21[a] = t21 * M11[b] + t22 * M21[b] + t23 * M31[b]; // Row 2 | Column 1
    M22[a] = t21 * M12[b] + t22 * M22[b] + t23 * M32[b]; // Row 2 | Column 2
    M23[a] = t21 * M13[b] + t22 * M23[b] + t23 * M33[b]; // Row 2 | Column 3
    M31[a] = t31 * M11[b] + t32 * M21[b] + t33 * M31[b]; // Row 3 | Column 1
    M32[a] = t31 * M12[b] + t32 * M22[b] + t33 * M32[b]; // Row 3 | Column 2
    M33[a] = t31 * M13[b] + t32 * M23[b] + t33 * M33[b]; // Row 3 | Column 3
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
    getTempID,
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
export default class Matrix3x3 extends RotationMatrix {
    constructor() {
        super(...arguments);
        this._ = matrixFunctions;
    }
    set m11(m11) { M11[this.id] = m11; }
    set m12(m12) { M12[this.id] = m12; }
    set m13(m13) { M13[this.id] = m13; }
    set m21(m21) { M21[this.id] = m21; }
    set m22(m22) { M22[this.id] = m22; }
    set m23(m23) { M23[this.id] = m23; }
    set m31(m31) { M31[this.id] = m31; }
    set m32(m32) { M32[this.id] = m32; }
    set m33(m33) { M33[this.id] = m33; }
    get m11() { return M11[this.id]; }
    get m12() { return M12[this.id]; }
    get m13() { return M13[this.id]; }
    get m21() { return M21[this.id]; }
    get m22() { return M22[this.id]; }
    get m23() { return M23[this.id]; }
    get m31() { return M31[this.id]; }
    get m32() { return M32[this.id]; }
    get m33() { return M33[this.id]; }
    setTo(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        set_to(this.id, m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return this;
    }
}
export const mat3x3 = (m11 = 0, m12 = 0, m13 = 0, m21 = 0, m22 = 0, m23 = 0, m31 = 0, m32 = 0, m33 = 0) => new Matrix3x3(getTempID()).setTo(m11, m12, m13, m21, m22, m23, m31, m32, m33);
//# sourceMappingURL=mat3x3.js.map