import {PRECISION_DIGITS} from "../constants.js";
import {f_n, f_v, ff_b, ff_n, ff_v, fff_v, ffnf_v, fn_v, fnf_v, Vector2DValues, Matrix2x2Values} from "../types.js";
import {BaseDirection2D, BasePosition2D, BaseUV2D, VectorConstructor} from "./vec.js";

let temp_number: number;
const temp_vector = new Float32Array(2);
const temp_matrix = new Float32Array(4);

export const length : f_n = (
    a: Vector2DValues, i: number
) : number => Math.hypot(
    a[0][i],
    a[1][i]
);

export const distance : ff_n = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number
) : number => Math.hypot(
    (b[0][j] - a[0][i]),
    (b[1][j] - a[1][i])
);

export const length_squared : f_n = (
    a: Vector2DValues, i: number
) : number => (
    a[0][i]**2 +
    a[1][i]**2
);

export const distance_squared : ff_n = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number
) : number => (
    (b[0][j] - a[0][i])**2 +
    (b[1][j] - a[1][i])**2
);

export const equals : ff_b = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number
) : boolean => {
    if (i === j && ((Object.is(a, b)) || (
        (Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
        (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer))
    ))) return true;

    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const linearly_interpolate: ffnf_v = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number, t: number,
    o: Vector2DValues, k: number
) : void => {
    o[0][k] = (1-t)*a[0][i] + t*(b[0][j]);
    o[1][k] = (1-t)*a[1][i] + t*(b[1][j]);
};

export const add : fff_v = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number,
    o: Vector2DValues, k: number
) : void => {
    o[0][k] = a[0][i] + b[0][j];
    o[1][k] = a[1][i] + b[1][j];
};

export const add_in_place : ff_v = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number
) : void => {
    a[0][i] += b[0][j];
    a[1][i] += b[1][j];
};

export const subtract : fff_v = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number,
    o: Vector2DValues, k: number
) : void => {
    o[0][k] = a[0][i] - b[0][j];
    o[1][k] = a[1][i] - b[1][j];
};

export const subtract_in_place : ff_v = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number
) : void => {
    a[0][i] -= b[0][j];
    a[1][i] -= b[1][j];
};

export const divide : fnf_v = (
    a: Vector2DValues, i: number, n: number,
    o: Vector2DValues, k: number
) : void => {
    o[0][k] = a[0][i] / n;
    o[1][k] = a[1][i] / n;
};

export const divide_in_place : fn_v = (
    a: Vector2DValues, i: number, n: number
) : void => {
    a[0][i] /= n;
    a[1][i] /= n;
};

export const scale : fnf_v = (
    a: Vector2DValues, i: number, n: number,
    o: Vector2DValues, k: number
) : void => {
    o[0][k] = a[0][i] * n;
    o[1][k] = a[1][i] * n;
};

export const scale_in_place : fn_v = (
    a: Vector2DValues, i: number, n: number
) : void => {
    a[0][i] *= n;
    a[1][i] *= n;
};

export const normalize : ff_v = (
    a: Vector2DValues, i: number,
    o: Vector2DValues, k: number
) : void => {
    temp_number = Math.hypot(
        a[0][i],
        a[1][i]
    );

    o[0][k] = a[0][i] / temp_number;
    o[1][k] = a[1][i] / temp_number;
};

export const normalize_in_place : f_v = (
    a: Vector2DValues, i: number
) : void => {
    temp_number = Math.hypot(
        a[0][i],
        a[1][i]
    );

    a[0][i] /= temp_number;
    a[1][i] /= temp_number;
};

export const dot : ff_n = (
    a: Vector2DValues, i: number,
    b: Vector2DValues, j: number
) : number => (
    a[0][i] * b[0][j] +
    a[1][i] * b[1][j]
);

export const multiply : fff_v = (
    a: Vector2DValues, i: number,
    b: Matrix2x2Values, j: number,
    o: Vector2DValues, k: number
) : void => {
    if (k === i && (
        (Object.is(o, a)) || (
            (Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
            (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer))
        )
    )
    ) throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;

    o[0][k] = a[0][i]*b[0][j] + a[1][i]*b[2][j];
    o[1][k] = a[0][i]*b[1][j] + a[1][i]*b[3][j];
};

export const multiply_in_place : ff_v = (
    a: Vector2DValues, i: number,
    b: Matrix2x2Values, j: number
) : void => {
    temp_vector[0] = a[0][i];
    temp_vector[1] = a[1][i];

    temp_matrix[0] = b[0][j];
    temp_matrix[1] = b[1][j];
    temp_matrix[2] = b[2][j];
    temp_matrix[3] = b[3][j];

    a[0][i] = temp_vector[0]*temp_matrix[0] + temp_vector[1]*temp_matrix[2];
    a[1][i] = temp_vector[0]*temp_matrix[1] + temp_vector[1]*temp_matrix[3];
};

export const Vector2D_Mixin = (BaseClass: VectorConstructor) => class extends BaseClass {
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

export class UV2D extends Vector2D_Mixin(BaseUV2D) {}
export class Position2D extends Vector2D_Mixin(BasePosition2D) {
    _distance: ff_n = distance;
    _distance_squared: ff_n = distance_squared;
}
export class Direction2D extends Vector2D_Mixin(BaseDirection2D){
    protected _dot: ff_n = dot;
    protected _length: f_n = length;
    protected _length_squared: f_n = length_squared;

    protected _normalize : ff_v = normalize;
    protected _normalize_in_place : f_v = normalize_in_place;
}