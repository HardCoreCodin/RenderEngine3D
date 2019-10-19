import {PRECISION_DIGITS} from "../constants";
import {Matrix} from "./base";
import {Direction3D} from "./vec3.js";
import {
    mnb_v,
    m_v,
    mm_v,
    mmm_v,
    mf_v,
    mm_b,
    m_b
} from "../types.js";

const temp_matrix = new Float32Array(9);
let sin, cos;
function setSinCos(angle: number) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
}

export const set_to_identity : m_v = (m: Float32Array) : void => {
    m.fill(0);
    m[0] = m[4] = m[8] = 1;
};

export const inverse : mf_v = (
    m: Float32Array,
    o: Float32Array
) : void => {
    if (Object.is(m , o) ||
        Object.is(m.buffer, o.buffer)
    ) throw `Can not inverse - shared buffer detected! (Use inverse_in_place)`;

    o[0] = m[0];
    o[1] = m[3];
    o[2] = m[2];

    o[3] = m[1];
    o[4] = m[4];
    o[5] = m[5];

    o[6] = -(
        m[6] * m[0] +
        m[7] * m[1]
    );
    o[7] = -(
        m[6] * m[3] +
        m[7] * m[4]
    );
    o[8] = 1;
};

export const inverse_in_place : m_v = (m: Float32Array) : void => {
    temp_matrix.set(m);

    m[0] = temp_matrix[0];
    m[1] = temp_matrix[3];
    m[2] = temp_matrix[2];

    m[3] = temp_matrix[1];
    m[4] = temp_matrix[4];
    m[5] = temp_matrix[5];

    m[6] = -(
        temp_matrix[6] * temp_matrix[0] +
        temp_matrix[7] * temp_matrix[1]
    );
    m[7] = -(
        temp_matrix[6] * temp_matrix[3] +
        temp_matrix[7] * temp_matrix[4]
    );
    m[8] = 1;
};

export const transpose : mf_v = (
    m: Float32Array,
    o: Float32Array
) : void => {
    if (Object.is(o, m) ||
        Object.is(o.buffer, m.buffer)
    ) throw `Can not transpose - shared buffer detected! (Use transpose_in_place)`;

    o[0] = m[0];
    o[1] = m[3];
    o[2] = m[6];

    o[3] = m[1];
    o[4] = m[4];
    o[5] = m[7];

    o[6] = m[2];
    o[7] = m[5];
    o[8] = m[8];
};

export const transpose_in_place : m_v = (m: Float32Array) : void => {
    temp_matrix.set(m);
    m[0] = temp_matrix[0];
    m[1] = temp_matrix[3];
    m[2] = temp_matrix[6];

    m[3] = temp_matrix[1];
    m[4] = temp_matrix[4];
    m[5] = temp_matrix[7];

    m[6] = temp_matrix[2];
    m[7] = temp_matrix[5];
    m[8] = temp_matrix[8];
};

export const equals : mm_b = (
    a: Float32Array,
    b: Float32Array
) : boolean => {
    if (Object.is(a, b) ||
        Object.is(a.buffer, b.buffer))
        return true;

    if (a.length !==
        b.length)
        return false;

    if (a[0].toFixed(PRECISION_DIGITS) !== b[0].toFixed(PRECISION_DIGITS)) return false;
    if (a[1].toFixed(PRECISION_DIGITS) !== b[1].toFixed(PRECISION_DIGITS)) return false;
    if (a[2].toFixed(PRECISION_DIGITS) !== b[2].toFixed(PRECISION_DIGITS)) return false;
    if (a[3].toFixed(PRECISION_DIGITS) !== b[3].toFixed(PRECISION_DIGITS)) return false;
    if (a[4].toFixed(PRECISION_DIGITS) !== b[4].toFixed(PRECISION_DIGITS)) return false;
    if (a[5].toFixed(PRECISION_DIGITS) !== b[5].toFixed(PRECISION_DIGITS)) return false;
    if (a[6].toFixed(PRECISION_DIGITS) !== b[6].toFixed(PRECISION_DIGITS)) return false;
    if (a[7].toFixed(PRECISION_DIGITS) !== b[7].toFixed(PRECISION_DIGITS)) return false;
    if (a[8].toFixed(PRECISION_DIGITS) !== b[8].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const is_identity : m_b = (a: Float32Array) : boolean =>
    a[0] === 1 &&
    a[1] === 0 &&
    a[2] === 0 &&
    a[3] === 0 &&
    a[4] === 1 &&
    a[5] === 0 &&
    a[6] === 0 &&
    a[7] === 0 &&
    a[8] === 1;

export const multiply : mmm_v = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    if (Object.is(o, a) ||
        Object.is(o, b) ||
        Object.is(o.buffer, a.buffer) ||
        Object.is(o.buffer, b.buffer)
    ) throw `Can not multiply - shared buffer detected! (Use multiply_in_place)`;

    // Row 1
    o[0] = // Column 1
        a[0] * b[0] +
        a[1] * b[3] +
        a[2] * b[6];
    o[1] = // Column 2
        a[0] * b[1] +
        a[1] * b[4] +
        a[2] * b[7];
    o[2] = // Column 3
        a[0] * b[2] +
        a[1] * b[5] +
        a[2] * b[8];

    // Row 2
    o[3] = // Column 1
        a[3] * b[0] +
        a[4] * b[3] +
        a[5] * b[6];
    o[4] = // Column 2
        a[3] * b[1] +
        a[4] * b[4] +
        a[5] * b[7];
    o[5] = // Column 3
        a[3] * b[2] +
        a[4] * b[5] +
        a[5] * b[8];

    // Row 3
    o[6] = // Column 1
        a[6] * b[0] +
        a[7] * b[3] +
        a[8] * b[6];
    o[7] = // Column 2
        a[6] * b[1] +
        a[7] * b[4] +
        a[8] * b[7];
    o[8] = // Column 3
        a[6] * b[2] +
        a[7] * b[5] +
        a[8] * b[8];
};

export const multiply_in_place : mm_v = (
    a: Float32Array,
    b: Float32Array
) : void => {
    temp_matrix.set(a);

    // Row 1
    a[0] = // Column 1
        temp_matrix[0] * b[0] +
        temp_matrix[1] * b[3] +
        temp_matrix[2] * b[6];
    a[1] = // Column 2
        temp_matrix[0] * b[1] +
        temp_matrix[1] * b[4] +
        temp_matrix[2] * b[7];
    a[2] = // Column 3
        temp_matrix[0] * b[2] +
        temp_matrix[1] * b[5] +
        temp_matrix[2] * b[8];

    // Row 2
    a[3] = // Column 1
        temp_matrix[3] * b[0] +
        temp_matrix[4] * b[3] +
        temp_matrix[5] * b[6];
    a[4] = // Column 2
        temp_matrix[3] * b[1] +
        temp_matrix[4] * b[4] +
        temp_matrix[5] * b[7];
    a[5] = // Column 3
        temp_matrix[3] * b[2] +
        temp_matrix[4] * b[5] +
        temp_matrix[5] * b[8];

    // Row 3
    a[6] = // Column 1
        temp_matrix[6] * b[0] +
        temp_matrix[7] * b[3] +
        temp_matrix[8] * b[6];
    a[7] = // Column 2
        temp_matrix[6] * b[1] +
        temp_matrix[7] * b[4] +
        temp_matrix[8] * b[7];
    a[8] = // Column 3
        temp_matrix[6] * b[2] +
        temp_matrix[7] * b[5] +
        temp_matrix[8] * b[8];
};

export const set_rotation_around_x : mnb_v = (
    m: Float32Array,
    angle: number,
    reset = true
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(m);

    m[4] = m[8] = cos;
    m[5] = sin;
    m[7] = -sin;
};

export const set_rotation_around_y : mnb_v = (
    m: Float32Array,
    angle: number,
    reset = true
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(m);

    m[0] = m[8] = cos;
    m[2] = sin;
    m[6] = -sin;
};

export const set_rotation_around_z : mnb_v = (
    m: Float32Array,
    angle: number,
    reset = true
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(m);

    m[0] = m[4] = cos;
    m[1] = sin;
    m[3] = -sin;
};

export class Matrix3x3 extends Matrix {
    protected _dim: number = 9;

    protected _equals: mm_b = equals;
    protected _is_identity: m_b = is_identity;
    protected _set_to_identity: m_v = set_to_identity;
    protected _set_rotation_around_x: mnb_v = set_rotation_around_x;
    protected _set_rotation_around_y: mnb_v = set_rotation_around_y;
    protected _set_rotation_around_z: mnb_v = set_rotation_around_z;

    protected _inverse: mm_v = inverse;
    protected _inverse_in_place: m_v = inverse_in_place;

    protected _transpose: mm_v = transpose;
    protected _transpose_in_place: m_v = transpose_in_place;

    protected _multiply : mmm_v = multiply;
    protected _multiply_in_place : mm_v = multiply_in_place;

    constructor(
        public data: Float32Array,
        public i: Direction3D = new Direction3D(data.subarray(0, 3)),
        public j: Direction3D = new Direction3D(data.subarray(3, 6)),
        public k: Direction3D = new Direction3D(data.subarray(6, 9))
    ) {
        super(data);
    }
}

export const mat3 = (
    x0?: number|Matrix3x3, y0: number = 0, z0: number = 0,
    x1: number = 0, y1: number = 0, z1: number = 0,
    x2: number = 0, y2: number = 0, z2: number = 0,
    m = new Float32Array(9)
) : Matrix3x3 => {
    const matrix = new Matrix3x3(m);

    if (x0 instanceof Matrix3x3)
        matrix.setFromOther(x0);
    else
        matrix.setTo(
            x0, y0, z0,
            x1, y1, z1,
            x2, y2, z2
        );

    return matrix
};