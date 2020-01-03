import {PRECISION_DIGITS} from "../../constants.js";
import {Float2, Float4} from "../../types.js";
import {
    IDirectionFunctionSet, IAccessorFunctionSet, IMathFunctionSet,
    IPositionFunctionSet,
    ITransformableVectorFunctionSet,
    IVectorFunctionSet
} from "../_interfaces/functions.js";
import {VECTOR_2D_ALLOCATOR} from "../memory/allocators.js";

let t_x,
    t_y,
    t_n: number;

const set_to = (
    a: number, [Xa, Ya]: Float2,

    x: number,
    y: number
): void => {
    Xa[a] = x;
    Ya[a] = y;
};

const set_all_to = (
    a: number, [Xa, Ya]: Float2,
    value: number
): void => {
    Xa[a] = Ya[a] = value;
};

const set_from = (
    a: number, [Xa, Ya]: Float2,
    o: number, [Xo, Yo]: Float2
): void => {
    Xa[a] = Xo[o];
    Ya[a] = Yo[o];
};

const equals = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): boolean =>
    Xa[a].toFixed(PRECISION_DIGITS) ===
    Xb[b].toFixed(PRECISION_DIGITS) &&

    Ya[a].toFixed(PRECISION_DIGITS) ===
    Yb[b].toFixed(PRECISION_DIGITS);

const invert = (
    a: number, [Xa, Ya]: Float2,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = -Xa[a];
    Yo[o] = -Ya[a];
};

const invert_in_place = (
    a: number, [Xa, Ya]: Float2
): void => {
    Xa[a] = -Xa[a];
    Ya[a] = -Ya[a];
};

const length = (
    a: number, [Xa, Ya]: Float2
): number => Math.hypot(
    Xa[a],
    Ya[a]
);

const distance = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): number => Math.hypot(
    (Xb[b] - Xa[a]),
    (Yb[b] - Ya[a])
);

const length_squared = (
    a: number, [Xa, Ya]: Float2
): number =>
    Xa[a] ** 2 +
    Ya[a] ** 2;

const distance_squared = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): number => (
    (Xb[b] - Xa[a]) ** 2 +
    (Yb[b] - Ya[a]) ** 2
);

const lerp = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2,
    o: number, [Xo, Yo]: Float2,

    t: number
): void => {
    Xo[o] = (1-t)*Xa[a] + t*(Xb[b]);
    Yo[o] = (1-t)*Ya[a] + t*(Yb[b]);
};

const add = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = Xa[a] + Xb[b];
    Yo[o] = Ya[a] + Yb[b];
};

const add_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): void => {
    Xa[a] += Xb[b];
    Ya[a] += Yb[b];
};

const broadcast_add = (
    a: number, [Xa, Ya]: Float2,
    b: number,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = Xa[a] + b;
    Yo[o] = Ya[a] + b;
};

const broadcast_add_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number
): void => {
    Xa[a] += b;
    Ya[a] += b;
};

const subtract = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = Xa[a] - Xb[b];
    Yo[o] = Ya[a] - Yb[b];
};

const subtract_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): void => {
    Xa[a] -= Xb[b];
    Ya[a] -= Yb[b];
};

const broadcast_subtract = (
    a: number, [Xa, Ya]: Float2,
    b: number,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = Xa[a] - b;
    Yo[o] = Ya[a] - b;
};

const broadcast_subtract_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number
): void => {
    Xa[a] -= b;
    Ya[a] -= b;
};

const multiply = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = Xa[a] * Xb[b];
    Yo[o] = Ya[a] * Yb[b];
};

const multiply_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): void => {
    Xa[a] *= Xb[b];
    Ya[a] *= Yb[b];
};

const divide = (
    a: number, [Xa, Ya]: Float2,
    b: number,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = Xa[a] / b;
    Yo[o] = Ya[a] / b;
};

const divide_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number
): void => {
    Xa[a] /= b;
    Ya[a] /= b;
};

const scale = (
    a: number, [Xa, Ya]: Float2,
    b: number,
    o: number, [Xo, Yo]: Float2,
): void => {
    Xo[o] = Xa[a] * b;
    Yo[o] = Ya[a] * b;
};

const scale_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number
): void => {
    Xa[a] *= b;
    Ya[a] *= b;
};

const normalize = (
    a: number, [Xa, Ya]: Float2,
    o: number, [Xo, Yo]: Float2
): void => {
    t_n = 1 / Math.hypot(
        Xa[a],
        Ya[a]
    );

    Xo[o] = Xa[a] * t_n;
    Yo[o] = Ya[a] * t_n;
};

const normalize_in_place = (
    a: number, [Xa, Ya]: Float2
): void => {
    t_n = 1 / Math.hypot(
        Xa[a],
        Ya[a]
    );

    Xa[a] *= t_n;
    Ya[a] *= t_n;
};

const dot = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): number =>
    Xa[a] * Xb[b] +
    Ya[a] * Yb[b];

const reflect = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2,
    o: number, [Xo, Yo]: Float2
): void => {
    t_n = Xa[a] * Xb[b] +
          Ya[a] * Yb[b];
    t_n += t_n;

    Xo[o] = Xb[b] * t_n - Xa[a];
    Yo[o] = Yb[b] * t_n - Ya[a];
};

const reflect_in_place = (
    a: number, [Xa, Ya]: Float2,
    b: number, [Xb, Yb]: Float2
): void => {
    t_n = Xa[a] * Xb[b] +
          Ya[a] * Yb[b];
    t_n += t_n;

    Xa[a] = Xb[b] * t_n - Xa[a];
    Ya[a] = Yb[b] * t_n - Ya[a];
};

const matrix_multiply = (
    a: number, [Xa, Ya]: Float2,
    m: number, [
        M11, M12,
        M21, M22
    ]: Float4,
    o: number, [Xo, Yo]: Float2
): void => {
    Xo[o] = Xa[a]*M11[m] + Ya[a]*M21[m];
    Yo[o] = Xa[a]*M12[m] + Ya[a]*M22[m];
};

const matrix_multiply_in_place = (
    a: number, [Xa, Ya]: Float2,
    m: number, [
        M11, M12,
        M21, M22
    ]: Float4
): void => {
    t_x = Xa[a];
    t_y = Ya[a];

    Xa[a] = t_x*M11[m] + t_y*M21[m];
    Ya[a] = t_x*M12[m] + t_y*M22[m];
};

export const accessor2DFunctions: IAccessorFunctionSet = {
    allocator: VECTOR_2D_ALLOCATOR,

    set_to,
    set_from,
    set_all_to,

    equals,
};

export const math2DFunctions: IMathFunctionSet = {
    ...accessor2DFunctions,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    broadcast_add,
    broadcast_add_in_place,

    broadcast_subtract,
    broadcast_subtract_in_place,

    multiply,
    multiply_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    invert,
    invert_in_place,
};

export const base2DFunctions: IVectorFunctionSet = {
    ...math2DFunctions,

    lerp
};

export const vector2DFunctions: ITransformableVectorFunctionSet = {
    ...base2DFunctions,

    matrix_multiply,
    matrix_multiply_in_place,
};

export const position2DFunctions: IPositionFunctionSet = {
    ...vector2DFunctions,

    distance,
    distance_squared
};

export const direction2DFunctions: IDirectionFunctionSet = {
    ...vector2DFunctions,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    reflect,
    reflect_in_place,

    dot
};