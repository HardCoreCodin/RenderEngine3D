import { PRECISION_DIGITS } from "../constants.js";
import { cross, cross_in_place } from "./vec3.js";
import { BaseColor4D, BasePosition4D, BaseDirection4D } from "./base.js";
let temp_number;
const temp_lhs = new Float32Array(3);
const temp_matrix = new Float32Array(9);
export const length = (a, i) => Math.hypot(a[0][i], a[1][i], a[2][i], a[3][i]);
export const distance = (a, i, b, j) => Math.hypot((b[0][j] - a[0][i]), (b[1][j] - a[1][i]), (b[2][j] - a[2][i]), (b[3][j] - a[3][i]));
export const length_squared = (a, i) => (Math.pow(a[0][i], 2) +
    Math.pow(a[1][i], 2) +
    Math.pow(a[2][i], 2) +
    Math.pow(a[3][i], 2));
export const distance_squared = (a, i, b, j) => (Math.pow((b[0][j] - a[0][i]), 2) +
    Math.pow((b[1][j] - a[1][i]), 2) +
    Math.pow((b[2][j] - a[2][i]), 2) +
    Math.pow((b[3][j] - a[3][i]), 2));
export const equals = (a, i, b, j) => {
    if (i === j && ((Object.is(a, b)) || ((Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
        (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
        (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer)) &&
        (Object.is(a[3], b[3]) || Object.is(a[3].buffer, b[3].buffer)))))
        return true;
    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[3][i].toFixed(PRECISION_DIGITS) !== b[3][j].toFixed(PRECISION_DIGITS))
        return false;
    return true;
};
export const linearly_interpolate = (a, i, b, j, t, o, k) => {
    o[0][k] = (1 - t) * a[0][i] + t * (b[0][j]);
    o[1][k] = (1 - t) * a[1][i] + t * (b[1][j]);
    o[2][k] = (1 - t) * a[2][i] + t * (b[2][j]);
    o[3][k] = (1 - t) * a[3][i] + t * (b[3][j]);
};
export const add = (a, i, b, j, o, k) => {
    o[0][k] = a[0][i] + b[0][j];
    o[1][k] = a[1][i] + b[1][j];
    o[2][k] = a[2][i] + b[2][j];
    o[3][k] = a[3][i] + b[3][j];
};
export const add_in_place = (a, i, b, j) => {
    a[0][i] += b[0][j];
    a[1][i] += b[1][j];
    a[2][i] += b[2][j];
    a[3][i] += b[3][j];
};
export const subtract = (a, i, b, j, o, k) => {
    o[0][k] = a[0][i] - b[0][j];
    o[1][k] = a[1][i] - b[1][j];
    o[2][k] = a[2][i] - b[2][j];
    o[3][k] = a[3][i] - b[3][j];
};
export const subtract_in_place = (a, i, b, j) => {
    a[0][i] -= b[0][j];
    a[1][i] -= b[1][j];
    a[2][i] -= b[2][j];
    a[3][i] -= b[3][j];
};
export const divide = (a, i, n, o, k) => {
    o[0][k] = a[0][i] / n;
    o[1][k] = a[1][i] / n;
    o[2][k] = a[2][i] / n;
    o[3][k] = a[3][i] / n;
};
export const divide_in_place = (a, i, n) => {
    a[0][i] /= n;
    a[1][i] /= n;
    a[2][i] /= n;
    a[3][i] /= n;
};
export const scale = (a, i, n, o, k) => {
    o[0][k] = a[0][i] * n;
    o[1][k] = a[1][i] * n;
    o[2][k] = a[2][i] * n;
    o[3][k] = a[3][i] * n;
};
export const scale_in_place = (a, i, n) => {
    a[0][i] *= n;
    a[1][i] *= n;
    a[2][i] *= n;
    a[3][i] *= n;
};
export const normalize = (a, i, o, k) => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i], a[3][i]);
    o[0][k] = a[0][i] / temp_number;
    o[1][k] = a[1][i] / temp_number;
    o[2][k] = a[2][i] / temp_number;
    o[3][k] = a[3][i] / temp_number;
};
export const normalize_in_place = (a, i) => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i], a[3][i]);
    a[0][i] /= temp_number;
    a[1][i] /= temp_number;
    a[2][i] /= temp_number;
    a[3][i] /= temp_number;
};
export const dot = (a, i, b, j) => (a[0][i] * b[0][j] +
    a[1][i] * b[1][j] +
    a[2][i] * b[2][j] +
    a[3][i] * b[3][j]);
export const multiply = (a, i, b, j, o, k) => {
    if (k === i && ((Object.is(o, a)) || ((Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
        (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
        (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer)) &&
        (Object.is(o[3], a[3]) || Object.is(o[3].buffer, a[3].buffer)))))
        throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;
    o[0][k] =
        a[0][i] * b[0][j] +
            a[1][i] * b[4][j] +
            a[2][i] * b[8][j] +
            a[3][i] * b[12][j];
    o[1][k] =
        a[0][i] * b[1][j] +
            a[1][i] * b[5][j] +
            a[2][i] * b[9][j] +
            a[3][i] * b[13][j];
    o[2][k] =
        a[0][i] * b[2][j] +
            a[1][i] * b[6][j] +
            a[2][i] * b[10][j] +
            a[3][i] * b[14][j];
    o[3][k] =
        a[0][i] * b[3][j] +
            a[1][i] * b[7][j] +
            a[2][i] * b[11][j] +
            a[3][i] * b[15][j];
};
export const multiply_in_place = (a, i, b, j) => {
    temp_lhs[0] = a[0][i];
    temp_lhs[1] = a[1][i];
    temp_lhs[2] = a[2][i];
    temp_lhs[3] = a[3][i];
    temp_matrix[0] = b[0][j];
    temp_matrix[1] = b[1][j];
    temp_matrix[2] = b[2][j];
    temp_matrix[3] = b[3][j];
    temp_matrix[4] = b[4][j];
    temp_matrix[5] = b[5][j];
    temp_matrix[6] = b[6][j];
    temp_matrix[7] = b[7][j];
    temp_matrix[8] = b[8][j];
    temp_matrix[9] = b[9][j];
    temp_matrix[10] = b[10][j];
    temp_matrix[11] = b[11][j];
    temp_matrix[12] = b[12][j];
    temp_matrix[13] = b[13][j];
    temp_matrix[14] = b[14][j];
    temp_matrix[15] = b[15][j];
    a[0][i] =
        temp_lhs[0] * temp_matrix[0] +
            temp_lhs[1] * temp_matrix[4] +
            temp_lhs[2] * temp_matrix[8] +
            temp_lhs[3] * temp_matrix[12];
    a[1][i] =
        temp_lhs[0] * temp_matrix[1] +
            temp_lhs[1] * temp_matrix[5] +
            temp_lhs[2] * temp_matrix[9] +
            temp_lhs[3] * temp_matrix[13];
    a[2][i] =
        temp_lhs[0] * temp_matrix[2] +
            temp_lhs[1] * temp_matrix[6] +
            temp_lhs[2] * temp_matrix[10] +
            temp_lhs[3] * temp_matrix[14];
    a[3][i] =
        temp_lhs[0] * temp_matrix[3] +
            temp_lhs[1] * temp_matrix[7] +
            temp_lhs[2] * temp_matrix[11] +
            temp_lhs[3] * temp_matrix[15];
};
const Vector4DMixin = (BaseClass) => class extends BaseClass {
    constructor() {
        super(...arguments);
        this._dim = 4;
        this._equals = equals;
        this._linearly_interpolate = linearly_interpolate;
        this._add = add;
        this._add_in_place = add_in_place;
        this._subtract = subtract;
        this._subtract_in_place = subtract_in_place;
        this._scale = scale;
        this._scale_in_place = scale_in_place;
        this._divide = divide;
        this._divide_in_place = divide_in_place;
        this._multiply = multiply;
        this._multiply_in_place = multiply_in_place;
    }
};
export class Color4D extends Vector4DMixin(BaseColor4D) {
}
export class Position4D extends Vector4DMixin(BasePosition4D) {
    constructor() {
        super(...arguments);
        this._distance = distance;
        this._distance_squared = distance_squared;
    }
}
export class Direction4D extends Vector4DMixin(BaseDirection4D) {
    constructor() {
        super(...arguments);
        this._dot = dot;
        this._length = length;
        this._length_squared = length_squared;
        this._normalize = normalize;
        this._normalize_in_place = normalize_in_place;
        this._cross = cross;
        this._cross_in_place = cross_in_place;
    }
}
//# sourceMappingURL=vec4.js.map