import {Float4} from "../../types.js";
import {PRECISION_DIGITS} from "../../constants.js";
import {IMatrix2x2FunctionSet} from "../_interfaces/functions.js";
import {MATRIX_2X2_ALLOCATOR} from "../memory/allocators.js";

let t11, t12,
    t21, t22: number;

const set_to = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    m11: number, m12: number,
    m21: number, m22: number
): void => {
    M11a[a] = m11;  M12a[a] = m12;
    M21a[a] = m21;  M22a[a] = m22;
};

const set_all_to = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    value: number
): void => {
    M11a[a] = M12a[a] =
    M21a[a] = M22a[a] = value;
};

const set_from = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
): void => {
    M11a[a] = M11o[o];  M12a[a] = M12o[o];
    M21a[a] = M21o[o];  M22a[a] = M22o[o];
};

const set_to_identity = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4
) : void => {
    M11a[a] = M22a[a] = 1;
    M12a[a] = M21a[a] = 0;
};

const transpose = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a];  M21o[o] = M12a[a];
    M12o[o] = M21a[a];  M22o[o] = M22a[a];
};

const transpose_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4
) : void => {
    [
        M12a[a], M21a[a]
    ] = [
        M21a[a], M12a[a]
    ]
};

// TODO: Fix...
const invert = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a];  M21o[o] = M12a[a];
    M12o[o] = M21a[a];  M22o[o] = M22a[a];
};

// TODO: Fix...
const invert_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4
) : void => {
    [
        M12a[a], M21a[a]
    ] = [
        M21a[a], M12a[a]
    ]
};

const equals = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number, [
        M11b, M12b,
        M21b, M22b
    ]: Float4
) : boolean =>
    M11a[a].toFixed(PRECISION_DIGITS) ===
    M11b[b].toFixed(PRECISION_DIGITS) &&

    M12a[a].toFixed(PRECISION_DIGITS) ===
    M12b[b].toFixed(PRECISION_DIGITS) &&


    M21a[a].toFixed(PRECISION_DIGITS) ===
    M21b[b].toFixed(PRECISION_DIGITS) &&

    M22a[a].toFixed(PRECISION_DIGITS) ===
    M22b[b].toFixed(PRECISION_DIGITS);

const is_identity = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4
) : boolean =>
    M11a[a] === 1  &&  M21a[a] === 0 &&
    M12a[a] === 0  &&  M22a[a] === 1;

const add = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number, [
        M11b, M12b,
        M21b, M22b
    ]: Float4,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a] + M11b[b];  M21o[o] = M21a[a] + M21b[b];
    M12o[o] = M12a[a] + M12b[b];  M22o[o] = M22a[a] + M22b[b];
};

const add_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number, [
        M11b, M12b,
        M21b, M22b
    ]: Float4
) : void => {
    M11a[a] += M11b[b];  M21a[a] += M21b[b];
    M12a[a] += M12b[b];  M22a[a] += M22b[b];
};

const broadcast_add = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a] + b;  M21o[o] = M21a[a] + b;
    M12o[o] = M12a[a] + b;  M22o[o] = M22a[a] + b;
};

const broadcast_add_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number
) : void => {
    M11a[a] += b;  M21a[a] += b;
    M12a[a] += b;  M22a[a] += b;
};

const subtract = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number, [
        M11b, M12b,
        M21b, M22b
    ]: Float4,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a] - M11b[b];  M21o[o] = M21a[a] - M21b[b];
    M12o[o] = M12a[a] - M12b[b];  M22o[o] = M22a[a] - M22b[b];
};

const subtract_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number, [
        M11b, M12b,
        M21b, M22b
    ]: Float4
) : void => {
    M11a[a] -= M11b[b];  M21a[a] -= M21b[b];
    M12a[a] -= M12b[b];  M22a[a] -= M22b[b];
};

const broadcast_subtract = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a] - b;  M21o[o] = M21a[a] - b;
    M12o[o] = M12a[a] - b;  M22o[o] = M22a[a] - b;
};

const broadcast_subtract_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number
) : void => {
    M11a[a] -= b;  M21a[a] -= b;
    M12a[a] -= b;  M22a[a] -= b;
};

const divide = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a] / b;  M21o[o] = M21a[a] / b;
    M12o[o] = M12a[a] / b;  M22o[o] = M22a[a] / b;
};

const divide_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number
) : void => {
    M11a[a] /= b;  M21a[a] /= b;
    M12a[a] /= b;  M22a[a] /= b;
};

const scale = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a] * b;  M21o[o] = M21a[a] * b;
    M12o[o] = M12a[a] * b;  M22o[o] = M22a[a] * b;
};

const scale_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number
) : void => {
    M11a[a] *= b;  M21a[a] *= b;
    M12a[a] *= b;  M22a[a] *= b;
};

const multiply = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number, [
        M11b, M12b,
        M21b, M22b
    ]: Float4,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4
) : void => {
    M11o[o] = M11a[a]*M11b[b] + M12a[a]*M21b[b]; // Row 1 | Column 1
    M12o[o] = M11a[a]*M12b[b] + M12a[a]*M22b[b]; // Row 1 | Column 2

    M21o[o] = M21a[a]*M11b[b] + M22a[a]*M21b[b]; // Row 2 | Column 1
    M22o[o] = M21a[a]*M12b[b] + M22a[a]*M22b[b]; // Row 2 | Column 2
};

const multiply_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    b: number, [
        M11b, M12b,
        M21b, M22b
    ]: Float4
) : void => {
    t11 = M11a[a];  t21 = M21a[a];
    t12 = M12a[a];  t22 = M22a[a];

    M11a[a] = t11*M11b[b] + t12*M21b[b]; // Row 1 | Column 1
    M12a[a] = t11*M12b[b] + t12*M22b[b]; // Row 1 | Column 2

    M21a[a] = t21*M11b[b] + t22*M21b[b]; // Row 2 | Column 1
    M22a[a] = t21*M12b[b] + t22*M22b[b]; // Row 2 | Column 2
};

const set_rotation = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    cos: number,
    sin: number
) : void => {
    M11a[a] = M22a[a] = cos;
    M12a[a] = sin;
    M21a[a] = -sin;
};

const rotate = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    cos: number,
    sin: number,

    o: number, [
        M11o, M12o,
        M21o, M22o
    ]: Float4,
) : void => {
    // t11 t12 * r11 r12
    // t21 t22   r21 r22
    //
    // (t11 t12).(r11 r21) (t11 t12).(r12 r22)
    // (t21 t22).(r11 r21) (t21 t22).(r12 r22)
    //
    // r11 r12 = cos  sin
    // r21 r22  -sin  cos
    //
    // (t11 t12).(cos -sin) (t11 t12).(sin cos)
    // (t21 t22).(cos -sin) (t21 t22).(sin cos)
    //
    // (t11*cos + t12*-sin + t13*0) (t11*sin + t12*cos + t13*0)
    // (t21*cos + t22*-sin + t23*0) (t21*sin + t22*cos + t23*0)
    //
    // (t11*cos + t12*-sin + 0) (t11*sin + t12*cos + 0)
    // (t21*cos + t22*-sin + 0) (t21*sin + t22*cos + 0)
    //
    // (t11*cos - t12*sin) (t11*sin + t12*cos)
    // (t21*cos - t22*sin) (t21*sin + t22*cos)
    //
    // o11=(t11*cos - t12*sin)  o12=(t11*sin + t12*cos)
    // o21=(t21*cos - t22*sin)  o22=(t21*sin + t22*cos)
    //
    // o11 = t11*cos - t12*sin  o12 = t11*sin + t12*cos
    // o21 = t21*cos - t22*sin  o22 = t21*sin + t22*cos

    M11o[o] = M11a[a]*cos - M12a[a]*sin;  M12o[o] = M11a[a]*sin + M12a[a]*cos;
    M21o[o] = M21a[a]*cos + M22a[a]*sin;  M22o[o] = M21a[a]*sin + M22a[a]*cos;
};

const rotate_in_place = (
    a: number, [
        M11a, M12a,
        M21a, M22a
    ]: Float4,

    cos: number,
    sin: number
) : void => {
    // t11 t12 *= r11 r12
    // t21 t22    r21 r22
    //
    // (t11 t12).(r11 r21) (t11 t12).(r12 r22)
    // (t21 t22).(r11 r21) (t21 t22).(r12 r22)
    //
    // r11 r12 = cos  sin
    // r21 r22  -sin  cos
    //
    // (t11 t12).(cos -sin) (t11 t12).(sin cos)
    // (t21 t22).(cos -sin) (t21 t22).(sin cos)
    //
    // (t11*cos + t12*-sin + t13*0) (t11*sin + t12*cos + t13*0)
    // (t21*cos + t22*-sin + t23*0) (t21*sin + t22*cos + t23*0)
    //
    // (t11*cos + t12*-sin + 0) (t11*sin + t12*cos + 0)
    // (t21*cos + t22*-sin + 0) (t21*sin + t22*cos + 0)
    //
    // (t11*cos - t12*sin) (t11*sin + t12*cos)
    // (t21*cos - t22*sin) (t21*sin + t22*cos)
    //
    // o11=(t11*cos - t12*sin)  o12=(t11*sin + t12*cos)
    // o21=(t21*cos - t22*sin)  o22=(t21*sin + t22*cos)
    //
    // o11 = t11*cos - t12*sin  o12 = t11*sin + t12*cos
    // o21 = t21*cos - t22*sin  o22 = t21*sin + t22*cos

    t11 = M11a[a];  t21 = M21a[a];
    t12 = M12a[a];  t22 = M22a[a];

    M11a[a] = t11 * cos - t12 * sin;   M12a[a] = t11 * sin + t12 * cos;
    M21a[a] = t21 * cos + t22 * sin;   M22a[a] = t21 * sin + t22 * cos;
};

export const matrix2x2Functions: IMatrix2x2FunctionSet = {
    allocator: MATRIX_2X2_ALLOCATOR,

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

    set_rotation,
    rotate,
    rotate_in_place
};