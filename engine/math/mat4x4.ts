import {PRECISION_DIGITS} from "../constants.js";
import {BaseRotationMatrix} from "./base.js";
import {Direction4D, Position4D} from "./vec4.js";
import {f_b, f_v, ff_b, ff_v, fff_v, fnn_v, Matrix4x4Values} from "../types.js";

const temp_matrix = new Float32Array(16);

export const set_identity : f_v = (a: Matrix4x4Values, i: number) : void => {
    a[0][i] = 1;
    a[1][i] = 0;
    a[2][i] = 0;
    a[3][i] = 0;

    a[4][i] = 0;
    a[5][i] = 1;
    a[6][i] = 0;
    a[7][i] = 0;

    a[8][i] = 0;
    a[9][i] = 0;
    a[10][i] = 1;
    a[11][i] = 0;

    a[12][i] = 0;
    a[13][i] = 0;
    a[14][i] = 0;
    a[15][i] = 1;
};

export const inverse : ff_v = (
    a: Matrix4x4Values, i: number,
    o: Matrix4x4Values, k: number
) : void => {
    if (i === k && (
        Object.is(a , o) || (
            (Object.is(a[0], o[0]) || Object.is(a[0].buffer, o[0].buffer)) &&
            (Object.is(a[1], o[1]) || Object.is(a[1].buffer, o[1].buffer)) &&
            (Object.is(a[2], o[2]) || Object.is(a[2].buffer, o[2].buffer)) &&
            (Object.is(a[3], o[3]) || Object.is(a[3].buffer, o[3].buffer)) &&
            (Object.is(a[4], o[4]) || Object.is(a[4].buffer, o[4].buffer)) &&
            (Object.is(a[5], o[5]) || Object.is(a[5].buffer, o[5].buffer)) &&
            (Object.is(a[6], o[6]) || Object.is(a[6].buffer, o[6].buffer)) &&
            (Object.is(a[7], o[7]) || Object.is(a[7].buffer, o[7].buffer)) &&
            (Object.is(a[8], o[8]) || Object.is(a[8].buffer, o[8].buffer)) &&
            (Object.is(a[9], o[9]) || Object.is(a[9].buffer, o[9].buffer)) &&
            (Object.is(a[10], o[10]) || Object.is(a[10].buffer, o[10].buffer)) &&
            (Object.is(a[11], o[11]) || Object.is(a[11].buffer, o[11].buffer)) &&
            (Object.is(a[12], o[12]) || Object.is(a[12].buffer, o[12].buffer)) &&
            (Object.is(a[13], o[13]) || Object.is(a[13].buffer, o[13].buffer)) &&
            (Object.is(a[14], o[14]) || Object.is(a[14].buffer, o[14].buffer)) &&
            (Object.is(a[15], o[15]) || Object.is(a[15].buffer, o[15].buffer))
        )
    )
    ) throw `Can not inverse - shared buffer detected! (Use inverse_in_place)`;

    o[0][k] = a[0][i];
    o[1][k] = a[4][i];
    o[2][k] = a[8][i];
    o[3][k] = a[3][i];

    o[4][k] = a[1][i];
    o[5][k] = a[5][i];
    o[6][k] = a[9][i];
    o[7][k] = a[7][i];

    a[8][k] = a[2][i];
    a[9][k] = a[6][i];
    a[10][k] = a[10][i];
    a[11][k] = a[11][i];

    o[12][k] = -(
        a[12][i] * a[0][i] +
        a[13][i] * a[1][i] +
        a[14][i] * a[2][i]
    );
    o[13][k] = -(
        a[12][i] * a[4][i] +
        a[13][i] * a[5][i] +
        a[14][i] * a[6][i]
    );
    o[14][k] = -(
        a[12][i] * a[8][i] +
        a[13][i] * a[9][i] +
        a[14][i] * a[10][i]
    );
    o[15][k] = 1;
};

export const inverse_in_place : f_v = (a: Matrix4x4Values, i: number) : void => {
    temp_matrix[0] = a[0][i];
    temp_matrix[1] = a[1][i];
    temp_matrix[2] = a[2][i];
    temp_matrix[3] = a[3][i];

    temp_matrix[4] = a[4][i];
    temp_matrix[5] = a[5][i];
    temp_matrix[6] = a[6][i];
    temp_matrix[7] = a[7][i];

    temp_matrix[8] = a[8][i];
    temp_matrix[0] = a[9][i];
    temp_matrix[10] = a[10][i];
    temp_matrix[11] = a[11][i];

    temp_matrix[12] = a[12][i];
    temp_matrix[13] = a[13][i];
    temp_matrix[14] = a[14][i];
    temp_matrix[15] = a[15][i];

    a[0][i] = temp_matrix[0];
    a[1][i] = temp_matrix[4];
    a[2][i] = temp_matrix[8];
    a[3][i] = temp_matrix[3];

    a[4][i] = temp_matrix[1];
    a[5][i] = temp_matrix[5];
    a[6][i] = temp_matrix[9];
    a[7][i] = temp_matrix[7];

    a[8][i] = temp_matrix[2];
    a[9][i] = temp_matrix[6];
    a[10][i] = temp_matrix[10];
    a[11][i] = temp_matrix[11];

    a[12][i] = -(
        temp_matrix[12] * temp_matrix[0] +
        temp_matrix[13] * temp_matrix[1] +
        temp_matrix[14] * temp_matrix[2]
    );
    a[13][i] = -(
        temp_matrix[12] * temp_matrix[4] +
        temp_matrix[13] * temp_matrix[5] +
        temp_matrix[14] * temp_matrix[6]
    );
    a[14][i] = -(
        temp_matrix[12] * temp_matrix[8] +
        temp_matrix[13] * temp_matrix[9] +
        temp_matrix[14] * temp_matrix[10]
    );
    a[15][i] = 1;
};

export const transpose : ff_v = (
    a: Matrix4x4Values, i: number,
    o: Matrix4x4Values, k: number
) : void => {
    if (
        i === k && (
            Object.is(a , o) || (
                (Object.is(a[0], o[0]) || Object.is(a[0].buffer, o[0].buffer)) &&
                (Object.is(a[1], o[1]) || Object.is(a[1].buffer, o[1].buffer)) &&
                (Object.is(a[2], o[2]) || Object.is(a[2].buffer, o[2].buffer)) &&
                (Object.is(a[3], o[3]) || Object.is(a[3].buffer, o[3].buffer)) &&
                (Object.is(a[4], o[4]) || Object.is(a[4].buffer, o[4].buffer)) &&
                (Object.is(a[5], o[5]) || Object.is(a[5].buffer, o[5].buffer)) &&
                (Object.is(a[6], o[6]) || Object.is(a[6].buffer, o[6].buffer)) &&
                (Object.is(a[7], o[7]) || Object.is(a[7].buffer, o[7].buffer)) &&
                (Object.is(a[8], o[8]) || Object.is(a[8].buffer, o[8].buffer)) &&
                (Object.is(a[9], o[9]) || Object.is(a[9].buffer, o[9].buffer)) &&
                (Object.is(a[10], o[10]) || Object.is(a[10].buffer, o[10].buffer)) &&
                (Object.is(a[11], o[11]) || Object.is(a[11].buffer, o[11].buffer)) &&
                (Object.is(a[12], o[12]) || Object.is(a[12].buffer, o[12].buffer)) &&
                (Object.is(a[13], o[13]) || Object.is(a[13].buffer, o[13].buffer)) &&
                (Object.is(a[14], o[14]) || Object.is(a[14].buffer, o[14].buffer)) &&
                (Object.is(a[15], o[15]) || Object.is(a[15].buffer, o[15].buffer))
            )
        )
    ) throw `Can not transpose - shared buffer detected! (Use transpose_in_place)`;

    o[0][k] = a[0][i];
    o[1][k] = a[4][i];
    o[2][k] = a[8][i];
    o[3][k] = a[12][i];

    o[4][k] = a[1][i];
    o[5][k] = a[5][i];
    o[6][k] = a[9][i];
    o[7][k] = a[13][i];

    o[8][k] = a[2][i];
    o[9][k] = a[6][i];
    o[10][k] = a[10][i];
    o[11][k] = a[14][i];

    o[12][k] = a[3][i];
    o[13][k] = a[7][i];
    o[14][k] = a[11][i];
    o[15][k] = a[15][i];
};

export const transpose_in_place : f_v = (a: Matrix4x4Values, i: number) : void => {[
    a[1][i], a[2][i], a[3][i], a[4][i], a[6][i], a[7][i], a[8][i], a[9][i], a[11][i], a[12][i], a[13][i], a[14][i]] = [
    a[4][i], a[8][i], a[12][i], a[1][i], a[9][i], a[13][i], a[2][i], a[6][i], a[14][i], a[3][i], a[7][i], a[11][i]]
};

export const equals : ff_b = (
    a: Matrix4x4Values, i: number,
    b: Matrix4x4Values, j: number
) : boolean => {
    if (
        i === j && (
            Object.is(a, b) || (
                (Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
                (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
                (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer)) &&
                (Object.is(a[3], b[3]) || Object.is(a[3].buffer, b[3].buffer)) &&
                (Object.is(a[4], b[4]) || Object.is(a[4].buffer, b[4].buffer)) &&
                (Object.is(a[5], b[5]) || Object.is(a[5].buffer, b[5].buffer)) &&
                (Object.is(a[6], b[6]) || Object.is(a[6].buffer, b[6].buffer)) &&
                (Object.is(a[7], b[7]) || Object.is(a[7].buffer, b[7].buffer)) &&
                (Object.is(a[8], b[8]) || Object.is(a[8].buffer, b[8].buffer)) &&
                (Object.is(a[9], b[9]) || Object.is(a[9].buffer, b[9].buffer)) &&
                (Object.is(a[10], b[10]) || Object.is(a[10].buffer, b[10].buffer)) &&
                (Object.is(a[11], b[11]) || Object.is(a[11].buffer, b[11].buffer)) &&
                (Object.is(a[12], b[12]) || Object.is(a[12].buffer, b[12].buffer)) &&
                (Object.is(a[13], b[13]) || Object.is(a[13].buffer, b[13].buffer)) &&
                (Object.is(a[14], b[14]) || Object.is(a[14].buffer, b[14].buffer)) &&
                (Object.is(a[15], b[15]) || Object.is(a[15].buffer, b[15].buffer))
            )
        )
    )
        return true;

    if (a.length !==
        b.length)
        return false;

    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[3][i].toFixed(PRECISION_DIGITS) !== b[3][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[4][i].toFixed(PRECISION_DIGITS) !== b[4][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[5][i].toFixed(PRECISION_DIGITS) !== b[5][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[6][i].toFixed(PRECISION_DIGITS) !== b[6][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[7][i].toFixed(PRECISION_DIGITS) !== b[7][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[8][i].toFixed(PRECISION_DIGITS) !== b[8][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[9][i].toFixed(PRECISION_DIGITS) !== b[9][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[10][i].toFixed(PRECISION_DIGITS) !== b[10][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[11][i].toFixed(PRECISION_DIGITS) !== b[11][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[12][i].toFixed(PRECISION_DIGITS) !== b[12][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[13][i].toFixed(PRECISION_DIGITS) !== b[13][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[14][i].toFixed(PRECISION_DIGITS) !== b[14][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[15][i].toFixed(PRECISION_DIGITS) !== b[15][j].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const is_identity : f_b = (a: Matrix4x4Values, i: number) : boolean => (
    a[0][i] === 1 &&
    a[1][i] === 0 &&
    a[2][i] === 0 &&
    a[3][i] === 0 &&

    a[4][i] === 0 &&
    a[5][i] === 1 &&
    a[6][i] === 0 &&
    a[7][i] === 0 &&

    a[8][i] === 0 &&
    a[9][i] === 0 &&
    a[10][i] === 1 &&
    a[11][i] === 0 &&

    a[12][i] === 0 &&
    a[13][i] === 0 &&
    a[14][i] === 0 &&
    a[15][i] === 1
);

export const multiply : fff_v = (
    a: Matrix4x4Values, i: number,
    b: Matrix4x4Values, j: number,
    o: Matrix4x4Values, k: number
) : void => {
    if (
        (
            k === j && (
                Object.is(o, b) || (
                    (Object.is(b[0], o[0]) || Object.is(b[0].buffer, o[0].buffer)) &&
                    (Object.is(b[1], o[1]) || Object.is(b[1].buffer, o[1].buffer)) &&
                    (Object.is(b[2], o[2]) || Object.is(b[2].buffer, o[2].buffer)) &&
                    (Object.is(b[3], o[3]) || Object.is(b[3].buffer, o[3].buffer)) &&
                    (Object.is(b[4], o[4]) || Object.is(b[4].buffer, o[4].buffer)) &&
                    (Object.is(b[5], o[5]) || Object.is(b[5].buffer, o[5].buffer)) &&
                    (Object.is(b[6], o[6]) || Object.is(b[6].buffer, o[6].buffer)) &&
                    (Object.is(b[7], o[7]) || Object.is(b[7].buffer, o[7].buffer)) &&
                    (Object.is(b[8], o[8]) || Object.is(b[8].buffer, o[8].buffer)) &&
                    (Object.is(b[9], o[9]) || Object.is(b[9].buffer, o[9].buffer)) &&
                    (Object.is(b[10], o[10]) || Object.is(b[10].buffer, o[10].buffer)) &&
                    (Object.is(b[11], o[11]) || Object.is(b[11].buffer, o[11].buffer)) &&
                    (Object.is(b[12], o[12]) || Object.is(b[12].buffer, o[12].buffer)) &&
                    (Object.is(b[13], o[13]) || Object.is(b[13].buffer, o[13].buffer)) &&
                    (Object.is(b[14], o[14]) || Object.is(b[14].buffer, o[14].buffer)) &&
                    (Object.is(b[15], o[15]) || Object.is(b[15].buffer, o[15].buffer))
                )
            )
        ) || (
            k === i && (
                Object.is(o, a) || (
                    (Object.is(a[0], o[0]) || Object.is(a[0].buffer, o[0].buffer)) &&
                    (Object.is(a[1], o[1]) || Object.is(a[1].buffer, o[1].buffer)) &&
                    (Object.is(a[2], o[2]) || Object.is(a[2].buffer, o[2].buffer)) &&
                    (Object.is(a[3], o[3]) || Object.is(a[3].buffer, o[3].buffer)) &&
                    (Object.is(a[4], o[4]) || Object.is(a[4].buffer, o[4].buffer)) &&
                    (Object.is(a[5], o[5]) || Object.is(a[5].buffer, o[5].buffer)) &&
                    (Object.is(a[6], o[6]) || Object.is(a[6].buffer, o[6].buffer)) &&
                    (Object.is(a[7], o[7]) || Object.is(a[7].buffer, o[7].buffer)) &&
                    (Object.is(a[8], o[8]) || Object.is(a[8].buffer, o[8].buffer)) &&
                    (Object.is(a[9], o[9]) || Object.is(a[9].buffer, o[9].buffer)) &&
                    (Object.is(a[10], o[10]) || Object.is(a[10].buffer, o[10].buffer)) &&
                    (Object.is(a[11], o[11]) || Object.is(a[11].buffer, o[11].buffer)) &&
                    (Object.is(a[12], o[12]) || Object.is(a[12].buffer, o[12].buffer)) &&
                    (Object.is(a[13], o[13]) || Object.is(a[13].buffer, o[13].buffer)) &&
                    (Object.is(a[14], o[14]) || Object.is(a[14].buffer, o[14].buffer)) &&
                    (Object.is(a[15], o[15]) || Object.is(a[15].buffer, o[15].buffer))
                )
            )
        )
    ) throw `Can not multiply - shared buffer detected! (Use multiply_in_place)`;

    // Row 1
    o[0][k] = // Column 1
        a[0][i] * b[0][j] +
        a[1][i] * b[4][j] +
        a[2][i] * b[8][j] +
        a[3][i] * b[12][j];
    o[1][k] = // Column 2
        a[0][i] * b[1][j] +
        a[1][i] * b[5][j] +
        a[2][i] * b[9][j] +
        a[3][i] * b[13][j];
    o[2][k] = // Column 3
        a[0][i] * b[2][j] +
        a[1][i] * b[6][j] +
        a[2][i] * b[10][j] +
        a[3][i] * b[14][j];
    o[3][k] = // Column 4
        a[0][i] * b[3][j] +
        a[1][i] * b[7][j] +
        a[2][i] * b[11][j] +
        a[3][i] * b[15][j];

    // Row 2
    o[4][k] = // Column 1
        a[4][i] * b[0][j] +
        a[5][i] * b[4][j] +
        a[6][i] * b[8][j] +
        a[7][i] * b[12][j];
    o[5][k] = // Column 2
        a[4][i] * b[1][j] +
        a[5][i] * b[5][j] +
        a[6][i] * b[9][j] +
        a[7][i] * b[13][j];
    o[6][k] = // Column 3
        a[4][i] * b[2][j] +
        a[5][i] * b[6][j] +
        a[6][i] * b[10][j] +
        a[7][i] * b[14][j];
    o[7][k] = // Column 3
        a[4][i] * b[3][j] +
        a[5][i] * b[7][j] +
        a[6][i] * b[11][j] +
        a[7][i] * b[15][j];

    // Row 3
    o[8][k] = // Column 1
        a[8][i] * b[0][j] +
        a[9][i] * b[4][j] +
        a[10][i] * b[8][j] +
        a[11][i] * b[12][j];
    o[9][k] = // Column 2
        a[8][i] * b[1][j] +
        a[9][i] * b[5][j] +
        a[10][i] * b[9][j] +
        a[11][i] * b[13][j];
    o[10][k] = // Column 3
        a[8][i] * b[2][j] +
        a[9][i] * b[6][j] +
        a[10][i] * b[10][j] +
        a[11][i] * b[14][j];
    o[11][k] = // Column 4
        a[8][i] * b[3][j] +
        a[9][i] * b[7][j] +
        a[10][i] * b[11][j] +
        a[11][i] * b[15][j];

    // Row 4
    o[12][k] = // Column 1
        a[12][i] * b[0][j] +
        a[13][i] * b[4][j] +
        a[14][i] * b[8][j] +
        a[15][i] * b[12][j];
    o[13][k] = // Column 2
        a[12][i] * b[1][j] +
        a[13][i] * b[5][j] +
        a[14][i] * b[9][j] +
        a[15][i] * b[13][j];
    o[14][k] = // Column 3
        a[12][i] * b[2][j] +
        a[13][i] * b[6][j] +
        a[14][i] * b[10][j] +
        a[15][i] * b[14][j];
    o[15][k] = // Column 4
        a[12][i] * b[3][j] +
        a[13][i] * b[7][j] +
        a[14][i] * b[11][j] +
        a[15][i] * b[15][j];
};

export const multiply_in_place : ff_v = (
    a: Matrix4x4Values, i: number,
    b: Matrix4x4Values, j: number
) : void => {
    temp_matrix[0] = a[0][i];
    temp_matrix[1] = a[1][i];
    temp_matrix[2] = a[2][i];
    temp_matrix[3] = a[3][i];

    temp_matrix[4] = a[4][i];
    temp_matrix[5] = a[5][i];
    temp_matrix[6] = a[6][i];
    temp_matrix[7] = a[7][i];

    temp_matrix[8] = a[8][i];
    temp_matrix[9] = a[9][i];
    temp_matrix[10] = a[10][i];
    temp_matrix[11] = a[11][i];

    temp_matrix[12] = a[12][i];
    temp_matrix[13] = a[13][i];
    temp_matrix[14] = a[14][i];
    temp_matrix[15] = a[15][i];

    // Row 1
    a[0][i] = // Column 1
        temp_matrix[0] * b[0][j] +
        temp_matrix[1] * b[4][j] +
        temp_matrix[2] * b[8][j] +
        temp_matrix[3] * b[12][j];
    a[1][i] = // Column 2
        temp_matrix[0] * b[1][j] +
        temp_matrix[1] * b[5][j] +
        temp_matrix[2] * b[9][j] +
        temp_matrix[3] * b[13][j];
    a[2][i] = // Column 3
        temp_matrix[0] * b[2][j] +
        temp_matrix[1] * b[6][j] +
        temp_matrix[2] * b[10][j] +
        temp_matrix[3] * b[14][j];
    a[3][i] = // Column 4
        temp_matrix[0] * b[3][j] +
        temp_matrix[1] * b[7][j] +
        temp_matrix[2] * b[11][j] +
        temp_matrix[3] * b[15][j];

    // Row 2
    a[4][i] = // Column 1
        temp_matrix[4] * b[0][j] +
        temp_matrix[5] * b[4][j] +
        temp_matrix[6] * b[8][j] +
        temp_matrix[7] * b[12][j];
    a[5][i] = // Column 2
        temp_matrix[4] * b[1][j] +
        temp_matrix[5] * b[5][j] +
        temp_matrix[6] * b[9][j] +
        temp_matrix[7] * b[13][j];
    a[6][i] = // Column 3
        temp_matrix[4] * b[2][j] +
        temp_matrix[5] * b[6][j] +
        temp_matrix[6] * b[10][j] +
        temp_matrix[7] * b[14][j];
    a[7][i] = // Column 3
        temp_matrix[4] * b[3][j] +
        temp_matrix[5] * b[7][j] +
        temp_matrix[6] * b[11][j] +
        temp_matrix[7] * b[15][j];

    // Row 3
    a[8][i] = // Column 1
        temp_matrix[8] * b[0][j] +
        temp_matrix[9] * b[4][j] +
        temp_matrix[10] * b[8][j] +
        temp_matrix[11] * b[12][j];
    a[9][i] = // Column 2
        temp_matrix[8] * b[1][j] +
        temp_matrix[9] * b[5][j] +
        temp_matrix[10] * b[9][j] +
        temp_matrix[11] * b[13][j];
    a[10][i] = // Column 3
        temp_matrix[8] * b[2][j] +
        temp_matrix[9] * b[6][j] +
        temp_matrix[10] * b[10][j] +
        temp_matrix[11] * b[14][j];
    a[11][i] = // Column 4
        temp_matrix[8] * b[3][j] +
        temp_matrix[9] * b[7][j] +
        temp_matrix[10] * b[11][j] +
        temp_matrix[11] * b[15][j];

    // Row 4
    a[12][i] = // Column 1
        temp_matrix[12] * b[0][j] +
        temp_matrix[13] * b[4][j] +
        temp_matrix[14] * b[8][j] +
        temp_matrix[15] * b[12][j];
    a[13][i] = // Column 2
        temp_matrix[12] * b[1][j] +
        temp_matrix[13] * b[5][j] +
        temp_matrix[14] * b[9][j] +
        temp_matrix[15] * b[13][j];
    a[14][i] = // Column 3
        temp_matrix[12] * b[2][j] +
        temp_matrix[13] * b[6][j] +
        temp_matrix[14] * b[10][j] +
        temp_matrix[15] * b[14][j];
    a[15][i] = // Column 4
        temp_matrix[12] * b[3][j] +
        temp_matrix[13] * b[7][j] +
        temp_matrix[14] * b[11][j] +
        temp_matrix[15] * b[15][j];
};

export const set_rotation_around_x : fnn_v = (
    a: Matrix4x4Values, i: number,
    cos: number,
    sin: number
) : void => {
    a[10][i] = a[5][i] = cos;
    a[6][i] = sin;
    a[9][i] = -sin;
};

export const set_rotation_around_y : fnn_v = (
    a: Matrix4x4Values, i: number,
    cos: number,
    sin: number
) : void => {
    a[0][i] = a[10][i] = cos;
    a[2][i] = sin;
    a[8][i] = -sin;
};

export const set_rotation_around_z : fnn_v = (
    a: Matrix4x4Values, i: number,
    cos: number,
    sin: number
) : void => {
    a[0][i] = a[5][i] = cos;
    a[1][i] = sin;
    a[4][i] = -sin;
};

export class Matrix4x4 extends BaseRotationMatrix {
    protected _dim: number = 16;

    protected _equals: ff_b = equals;
    protected _is_identity: f_b = is_identity;
    protected _set_identity: f_v = set_identity;

    protected _inverse: ff_v = inverse;
    protected _inverse_in_place: f_v = inverse_in_place;

    protected _transpose: ff_v = transpose;
    protected _transpose_in_place: f_v = transpose_in_place;

    protected _multiply : fff_v = multiply;
    protected _multiply_in_place : ff_v = multiply_in_place;

    protected _set_rotation_around_x: fnn_v = set_rotation_around_x;
    protected _set_rotation_around_y: fnn_v = set_rotation_around_y;
    protected _set_rotation_around_z: fnn_v = set_rotation_around_z;

    constructor(
        public id: number,
        public arrays: Matrix4x4Values,
        public i: Direction4D = new Direction4D(id, [arrays[0], arrays[1], arrays[2], arrays[3]]),
        public j: Direction4D = new Direction4D(id, [arrays[4], arrays[5], arrays[6], arrays[7]]),
        public k: Direction4D = new Direction4D(id, [arrays[8], arrays[9], arrays[10], arrays[11]]),
        public t: Position4D = new Position4D(id, [arrays[12], arrays[13], arrays[14], arrays[15]])
    ) {
        super(id, arrays);
    }
}

