import {PRECISION_DIGITS} from "../constants.js";
import {BaseMatrix} from "./base.js";
import {Direction2D} from "./vec2.js";
import {f_b, f_v, ff_b, ff_v, fff_v, fnn_v, Matrix2x2Values, Matrix3x3Values} from "../types.js";

const temp_matrix = new Float32Array(4);

export const set_identity : f_v = (a: Matrix2x2Values, i: number) : void => {
    a[0][i] = 1;
    a[1][i] = 0;
    
    a[2][i] = 0;
    a[3][i] = 1;
};

export const transpose : ff_v = (
    a: Matrix2x2Values, i: number,
    o: Matrix2x2Values, k: number
) : void => {
    if (
        i === k && (
            Object.is(a , o) || (
                (Object.is(a[0], o[0]) || Object.is(a[0].buffer, o[0].buffer)) &&
                (Object.is(a[1], o[1]) || Object.is(a[1].buffer, o[1].buffer)) &&
                (Object.is(a[2], o[2]) || Object.is(a[2].buffer, o[2].buffer)) &&
                (Object.is(a[3], o[3]) || Object.is(a[3].buffer, o[3].buffer))
            )
        )
    ) throw `Can not transpose - shared buffer detected! (Use transpose_in_place)`;

    o[0][k] = a[0][i];
    o[1][k] = a[2][i];

    o[2][k] = a[1][i];
    o[3][k] = a[3][i];
};

export const transpose_in_place : f_v = (a: Matrix2x2Values, i: number) : void => {[
    a[1][i], a[2][i]] = [
    a[2][i], a[1][i],
]};

export const equals : ff_b = (
    a: Matrix2x2Values, i: number,
    b: Matrix2x2Values, j: number
) : boolean => {
    if (
        i === j && (
            Object.is(a, b) || (
                (Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
                (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
                (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer)) &&
                (Object.is(a[3], b[3]) || Object.is(a[3].buffer, b[3].buffer))
            )
        )
    )
        return true;

    if (a.length !== b.length)
        return false;

    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[3][i].toFixed(PRECISION_DIGITS) !== b[3][j].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const is_identity : f_b = (a: Matrix2x2Values, i: number) : boolean => (
    a[0][i] === 1 && a[2][i] === 0 &&
    a[1][i] === 0 && a[3][i] === 1
);

export const multiply : fff_v = (
    a: Matrix2x2Values, i: number,
    b: Matrix2x2Values, j: number,
    o: Matrix2x2Values, k: number
) : void => {
    if (
        (
            k === j && (
                Object.is(o, b) || (
                    (Object.is(o[0], b[0]) || Object.is(o[0].buffer, b[0].buffer)) &&
                    (Object.is(o[1], b[1]) || Object.is(o[1].buffer, b[1].buffer)) &&
                    (Object.is(o[2], b[2]) || Object.is(o[2].buffer, b[2].buffer)) &&
                    (Object.is(o[3], b[3]) || Object.is(o[3].buffer, b[3].buffer))
                )
            )
        ) || (
            k === i && (
                Object.is(o, a) || (
                    (Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
                    (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
                    (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer)) &&
                    (Object.is(o[3], a[3]) || Object.is(o[3].buffer, a[3].buffer))
                )
            )
        )
    ) throw `Can not multiply - shared buffer detected! (Use multiply_in_place)`;

    // Row 1
    o[0][k] = // Column 1
        a[0][i] * b[0][j] +
        a[1][i] * b[2][j];
    o[1][k] = // Column 2
        a[0][i] * b[1][j] +
        a[1][i] * b[3][j];

    // Row 2
    o[2][k] = // Column 1
        a[2][i] * b[0][j] +
        a[3][i] * b[2][j];
    o[3][k] = // Column 2
        a[2][i] * b[1][j] +
        a[3][i] * b[3][j];
};

export const multiply_in_place : ff_v = (
    a: Matrix2x2Values, i: number,
    b: Matrix2x2Values, j: number
) : void => {
    temp_matrix[0] = a[0][i];
    temp_matrix[1] = a[1][i];

    temp_matrix[2] = a[2][i];
    temp_matrix[3] = a[3][i];

    // Row 1
    a[0][i] = // Column 1
        temp_matrix[0] * b[0][j] +
        temp_matrix[1] * b[2][j];
    a[1][i] = // Column 2
        temp_matrix[0] * b[1][j] +
        temp_matrix[1] * b[3][j];

    // Row 2
    a[2][i] = // Column 1
        temp_matrix[2] * b[0][j] +
        temp_matrix[3] * b[2][j];
    a[3][i] = // Column 2
        temp_matrix[2] * b[1][j] +
        temp_matrix[3] * b[3][j];
};

export const set_rotation : fnn_v = (
    a: Matrix2x2Values, i: number,
    cos: number,
    sin: number
) : void => {
    a[0][i] = a[3][i] = cos;
    a[1][i] = sin;
    a[2][i] = -sin;
};

export class Matrix2x2 extends BaseMatrix {
    protected _dim: number = 4;

    protected _equals: ff_b = equals;
    protected _is_identity: f_b = is_identity;
    protected _set_identity: f_v = set_identity;
    protected _set_rotation: fnn_v = set_rotation;

    protected _transpose: ff_v = transpose;
    protected _transpose_in_place: f_v = transpose_in_place;

    protected _multiply : fff_v = multiply;
    protected _multiply_in_place : ff_v = multiply_in_place;

    constructor(
        public id: number,
        public arrays: Matrix2x2Values,
        public i: Direction2D = new Direction2D(id, [arrays[0], arrays[1]]),
        public j: Direction2D = new Direction2D(id, [arrays[2], arrays[3]])
    ) {
        super(id, arrays);
    }
}

