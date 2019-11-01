import {PRECISION_DIGITS} from "../constants.js";
import {cross, cross_in_place} from "./vec3.js";
import {
    VectorConstructor,
    BaseColor4D,
    BasePosition4D,
    BaseDirection4D
} from "./base.js";
import {f_n, f_v, ff_b, ff_n, ff_v, fff_v, ffnf_v, fn_v, fnf_v, Vector4DValues, Matrix4x4Values} from "../types.js";

let temp_number: number;
const temp_lhs = new Float32Array(3);
const temp_matrix = new Float32Array(9);

export const length : f_n = (
    a: Vector4DValues, i: number
) : number => Math.hypot(
    a[0][i],
    a[1][i],
    a[2][i],
    a[3][i]
);

export const distance : ff_n = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number
) : number => Math.hypot(
    (b[0][j] - a[0][i]),
    (b[1][j] - a[1][i]),
    (b[2][j] - a[2][i]),
    (b[3][j] - a[3][i])
);

export const length_squared : f_n = (
    a: Vector4DValues, i: number
) : number => (
    a[0][i]**2 +
    a[1][i]**2 +
    a[2][i]**2 +
    a[3][i]**2
);

export const distance_squared : ff_n = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number
) : number => (
    (b[0][j] - a[0][i])**2 +
    (b[1][j] - a[1][i])**2 +
    (b[2][j] - a[2][i])**2 +
    (b[3][j] - a[3][i])**2
);

export const equals : ff_b = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number
) : boolean => {
    if (i === j && ((Object.is(a, b)) || (
        (Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
        (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
        (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer)) &&
        (Object.is(a[3], b[3]) || Object.is(a[3].buffer, b[3].buffer))
    ))) return true;

    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[3][i].toFixed(PRECISION_DIGITS) !== b[3][j].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const linearly_interpolate: ffnf_v = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number, t: number,
    o: Vector4DValues, k: number
) : void => {
    o[0][k] = (1-t)*a[0][i] + t*(b[0][j]);
    o[1][k] = (1-t)*a[1][i] + t*(b[1][j]);
    o[2][k] = (1-t)*a[2][i] + t*(b[2][j]);
    o[3][k] = (1-t)*a[3][i] + t*(b[3][j]);
};

export const add : fff_v = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number,
    o: Vector4DValues, k: number
) : void => {
    o[0][k] = a[0][i] + b[0][j];
    o[1][k] = a[1][i] + b[1][j];
    o[2][k] = a[2][i] + b[2][j];
    o[3][k] = a[3][i] + b[3][j];
};

export const add_in_place : ff_v = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number
) : void => {
    a[0][i] += b[0][j];
    a[1][i] += b[1][j];
    a[2][i] += b[2][j];
    a[3][i] += b[3][j];
};

export const subtract : fff_v = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number,
    o: Vector4DValues, k: number
) : void => {
    o[0][k] = a[0][i] - b[0][j];
    o[1][k] = a[1][i] - b[1][j];
    o[2][k] = a[2][i] - b[2][j];
    o[3][k] = a[3][i] - b[3][j];
};

export const subtract_in_place : ff_v = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number
) : void => {
    a[0][i] -= b[0][j];
    a[1][i] -= b[1][j];
    a[2][i] -= b[2][j];
    a[3][i] -= b[3][j];
};

export const divide : fnf_v = (
    a: Vector4DValues, i: number, n: number,
    o: Vector4DValues, k: number
) : void => {
    o[0][k] = a[0][i] / n;
    o[1][k] = a[1][i] / n;
    o[2][k] = a[2][i] / n;
    o[3][k] = a[3][i] / n;
};

export const divide_in_place : fn_v = (
    a: Vector4DValues, i: number, n: number
) : void => {
    a[0][i] /= n;
    a[1][i] /= n;
    a[2][i] /= n;
    a[3][i] /= n;
};

export const scale : fnf_v = (
    a: Vector4DValues, i: number, n: number,
    o: Vector4DValues, k: number
) : void => {
    o[0][k] = a[0][i] * n;
    o[1][k] = a[1][i] * n;
    o[2][k] = a[2][i] * n;
    o[3][k] = a[3][i] * n;
};

export const scale_in_place : fn_v = (
    a: Vector4DValues, i: number, n: number
) : void => {
    a[0][i] *= n;
    a[1][i] *= n;
    a[2][i] *= n;
    a[3][i] *= n;
};

export const normalize : ff_v = (
    a: Vector4DValues, i: number,
    o: Vector4DValues, k: number
) : void => {
    temp_number = Math.hypot(
        a[0][i],
        a[1][i],
        a[2][i],
        a[3][i]
    );

    o[0][k] = a[0][i] / temp_number;
    o[1][k] = a[1][i] / temp_number;
    o[2][k] = a[2][i] / temp_number;
    o[3][k] = a[3][i] / temp_number;
};

export const normalize_in_place : f_v = (
    a: Vector4DValues, i: number
) : void => {
    temp_number = Math.hypot(
        a[0][i],
        a[1][i],
        a[2][i],
        a[3][i]
    );

    a[0][i] /= temp_number;
    a[1][i] /= temp_number;
    a[2][i] /= temp_number;
    a[3][i] /= temp_number;
};

export const dot : ff_n = (
    a: Vector4DValues, i: number,
    b: Vector4DValues, j: number
) : number => (
    a[0][i] * b[0][j] +
    a[1][i] * b[1][j] +
    a[2][i] * b[2][j] +
    a[3][i] * b[3][j]
);

export const multiply : fff_v = (
    a: Vector4DValues, i: number,
    b: Matrix4x4Values, j: number,
    o: Vector4DValues, k: number
) : void => {
    if (k === i && (
        (Object.is(o, a)) || (
            (Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
            (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
            (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer)) &&
            (Object.is(o[3], a[3]) || Object.is(o[3].buffer, a[3].buffer))
        )
    )
    ) throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;

    o[0][k] =
        a[0][i]*b[0][j] +
        a[1][i]*b[4][j] +
        a[2][i]*b[8][j] +
        a[3][i]*b[12][j];

    o[1][k] =
        a[0][i]*b[1][j] +
        a[1][i]*b[5][j] +
        a[2][i]*b[9][j] +
        a[3][i]*b[13][j];

    o[2][k] =
        a[0][i]*b[2][j] +
        a[1][i]*b[6][j] +
        a[2][i]*b[10][j] +
        a[3][i]*b[14][j];

    o[3][k] =
        a[0][i]*b[3][j] +
        a[1][i]*b[7][j] +
        a[2][i]*b[11][j] +
        a[3][i]*b[15][j];
};

export const multiply_in_place : ff_v = (
    a: Vector4DValues, i: number,
    b: Matrix4x4Values, j: number
) : void => {
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
        temp_lhs[0]*temp_matrix[0] +
        temp_lhs[1]*temp_matrix[4] +
        temp_lhs[2]*temp_matrix[8] +
        temp_lhs[3]*temp_matrix[12];

    a[1][i] =
        temp_lhs[0]*temp_matrix[1] +
        temp_lhs[1]*temp_matrix[5] +
        temp_lhs[2]*temp_matrix[9] +
        temp_lhs[3]*temp_matrix[13];

    a[2][i] =
        temp_lhs[0]*temp_matrix[2] +
        temp_lhs[1]*temp_matrix[6] +
        temp_lhs[2]*temp_matrix[10] +
        temp_lhs[3]*temp_matrix[14];

    a[3][i] =
        temp_lhs[0]*temp_matrix[3] +
        temp_lhs[1]*temp_matrix[7] +
        temp_lhs[2]*temp_matrix[11] +
        temp_lhs[3]*temp_matrix[15];
};

const Vector4DMixin = (BaseClass: VectorConstructor) => class extends BaseClass {
    protected _dim: number = 4;

    protected _equals: ff_b = equals;
    protected _linearly_interpolate: ffnf_v = linearly_interpolate;

    protected _add: fff_v = add;
    protected _add_in_place: ff_v = add_in_place;

    protected _subtract: fff_v = subtract;
    protected _subtract_in_place: ff_v = subtract_in_place;

    protected _scale: fnf_v = scale;
    protected _scale_in_place: fn_v = scale_in_place;

    protected _divide: fnf_v = divide;
    protected _divide_in_place: fn_v = divide_in_place;

    protected _multiply : fff_v = multiply;
    protected _multiply_in_place : ff_v = multiply_in_place;
};

export class Color4D extends Vector4DMixin(BaseColor4D) {}
export class Position4D extends Vector4DMixin(BasePosition4D) {}
export class Direction4D extends Vector4DMixin(BaseDirection4D) {
    protected _dot: ff_n = dot;
    protected _length: f_n = length;

    protected _normalize : ff_v = normalize;
    protected _normalize_in_place : f_v = normalize_in_place;

    protected _cross : fff_v = cross;
    protected _cross_in_place : ff_v = cross_in_place;
}
