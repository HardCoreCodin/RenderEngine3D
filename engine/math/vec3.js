import { PRECISION_DIGITS } from "../constants.js";
import { BaseColor3D, BaseUV3D, BasePosition3D, BaseDirection3D } from "./base.js";
let temp_number;
const temp_lhs = new Float32Array(3);
const temp_rhs = new Float32Array(3);
const temp_matrix = new Float32Array(9);
export const length = (a, i) => Math.hypot(a[0][i], a[1][i], a[2][i]);
export const distance = (a, i, b, j) => Math.hypot((b[0][j] - a[0][i]), (b[1][j] - a[1][i]), (b[2][j] - a[2][i]));
export const length_squared = (a, i) => (Math.pow(a[0][i], 2) +
    Math.pow(a[1][i], 2) +
    Math.pow(a[2][i], 2));
export const distance_squared = (a, i, b, j) => (Math.pow((b[0][j] - a[0][i]), 2) +
    Math.pow((b[1][j] - a[1][i]), 2) +
    Math.pow((b[2][j] - a[2][i]), 2));
export const equals = (a, i, b, j) => {
    if (i === j && ((Object.is(a, b)) || ((Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
        (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
        (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer)))))
        return true;
    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS))
        return false;
    return true;
};
export const linearly_interpolate = (a, i, b, j, t, o, k) => {
    o[0][k] = (1 - t) * a[0][i] + t * (b[0][j]);
    o[1][k] = (1 - t) * a[1][i] + t * (b[1][j]);
    o[2][k] = (1 - t) * a[2][i] + t * (b[2][j]);
};
export const add = (a, i, b, j, o, k) => {
    o[0][k] = a[0][i] + b[0][j];
    o[1][k] = a[1][i] + b[1][j];
    o[2][k] = a[2][i] + b[2][j];
};
export const add_in_place = (a, i, b, j) => {
    a[0][i] += b[0][j];
    a[1][i] += b[1][j];
    a[2][i] += b[2][j];
};
export const subtract = (a, i, b, j, o, k) => {
    o[0][k] = a[0][i] - b[0][j];
    o[1][k] = a[1][i] - b[1][j];
    o[2][k] = a[2][i] - b[2][j];
};
export const subtract_in_place = (a, i, b, j) => {
    a[0][i] -= b[0][j];
    a[1][i] -= b[1][j];
    a[2][i] -= b[2][j];
};
export const divide = (a, i, n, o, k) => {
    o[0][k] = a[0][i] / n;
    o[1][k] = a[1][i] / n;
    o[2][k] = a[2][i] / n;
};
export const divide_in_place = (a, i, n) => {
    a[0][i] /= n;
    a[1][i] /= n;
    a[2][i] /= n;
};
export const scale = (a, i, n, o, k) => {
    o[0][k] = a[0][i] * n;
    o[1][k] = a[1][i] * n;
    o[2][k] = a[2][i] * n;
};
export const scale_in_place = (a, i, n) => {
    a[0][i] *= n;
    a[1][i] *= n;
    a[2][i] *= n;
};
export const normalize = (a, i, o, k) => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i]);
    o[0][k] = a[0][i] / temp_number;
    o[1][k] = a[1][i] / temp_number;
    o[2][k] = a[2][i] / temp_number;
};
export const normalize_in_place = (a, i) => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i]);
    a[0][i] /= temp_number;
    a[1][i] /= temp_number;
    a[2][i] /= temp_number;
};
export const dot = (a, i, b, j) => (a[0][i] * b[0][j] +
    a[1][i] * b[1][j] +
    a[2][i] * b[2][j]);
export const cross = (a, i, b, j, o, k) => {
    if ((k === i && ((Object.is(o, a)) || ((Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
        (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
        (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer))))) || (k === j && ((Object.is(o, b)) || ((Object.is(o[0], b[0]) || Object.is(o[0].buffer, b[0].buffer)) &&
        (Object.is(o[1], b[1]) || Object.is(o[1].buffer, b[1].buffer)) &&
        (Object.is(o[2], b[2]) || Object.is(o[2].buffer, b[2].buffer))))))
        throw `Can not cross - shared buffer detected! (Use cross_in_place)`;
    o[0][k] = a[1][i] * b[2][j] - a[2][i] * b[1][j];
    o[1][k] = a[2][i] * b[0][j] - a[0][i] * b[2][j];
    o[2][k] = a[0][i] * b[1][j] - a[1][i] * b[0][j];
};
export const cross_in_place = (a, i, b, j) => {
    temp_lhs[0] = a[0][i];
    temp_lhs[1] = a[1][i];
    temp_lhs[2] = a[2][i];
    temp_rhs[0] = b[0][j];
    temp_rhs[1] = b[1][j];
    temp_rhs[2] = b[2][j];
    a[0][i] = temp_lhs[1] * temp_rhs[2] - temp_lhs[2] * temp_rhs[1];
    a[1][i] = temp_lhs[2] * temp_rhs[0] - temp_lhs[0] * temp_rhs[2];
    a[2][i] = temp_lhs[0] * temp_rhs[1] - temp_lhs[1] * temp_rhs[0];
};
export const multiply = (a, i, b, j, o, k) => {
    if (k === i && ((Object.is(o, a)) || ((Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
        (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
        (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer)))))
        throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;
    o[0][k] = a[0][i] * b[0][j] + a[1][i] * b[3][j] + a[2][i] * b[6][j];
    o[1][k] = a[0][i] * b[1][j] + a[1][i] * b[4][j] + a[2][i] * b[7][j];
    o[2][k] = a[0][i] * b[2][j] + a[1][i] * b[5][j] + a[2][i] * b[8][j];
};
export const multiply_in_place = (a, i, b, j) => {
    temp_lhs[0] = a[0][i];
    temp_lhs[1] = a[1][i];
    temp_lhs[2] = a[2][i];
    temp_matrix[0] = b[0][j];
    temp_matrix[1] = b[1][j];
    temp_matrix[2] = b[2][j];
    temp_matrix[3] = b[3][j];
    temp_matrix[4] = b[4][j];
    temp_matrix[5] = b[5][j];
    temp_matrix[6] = b[6][j];
    temp_matrix[7] = b[7][j];
    temp_matrix[8] = b[8][j];
    a[0][i] = temp_lhs[0] * temp_matrix[0] + temp_lhs[1] * temp_matrix[3] + temp_lhs[2] * temp_matrix[6];
    a[1][i] = temp_lhs[0] * temp_matrix[1] + temp_lhs[1] * temp_matrix[4] + temp_lhs[2] * temp_matrix[7];
    a[2][i] = temp_lhs[0] * temp_matrix[2] + temp_lhs[1] * temp_matrix[5] + temp_lhs[2] * temp_matrix[8];
};
const Vector3DMixin = (BaseClass) => class extends BaseClass {
    constructor() {
        super(...arguments);
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
export class UV3D extends Vector3DMixin(BaseUV3D) {
}
export class Color3D extends Vector3DMixin(BaseColor3D) {
}
export class Position3D extends Vector3DMixin(BasePosition3D) {
    constructor() {
        super(...arguments);
        this._distance = distance;
        this._distance_squared = distance_squared;
    }
}
export class Direction3D extends Vector3DMixin(BaseDirection3D) {
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
//# sourceMappingURL=vec3.js.map