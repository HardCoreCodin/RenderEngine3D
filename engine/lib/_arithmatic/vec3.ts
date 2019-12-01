import {VECTOR_3D_ALLOCATOR} from "../allocators/float.js";
import {Float3, Float9} from "../../types.js";
import {PRECISION_DIGITS} from "../../constants.js";
import {
    ICrossDirectionFunctionSet,
    IPositionFunctionSet,
    ITransformableVectorFunctionSet,
    IVectorFunctionSet
} from "../_interfaces/function_sets.js";

let t_x,
    t_y,
    t_z,
    t_n: number;

const set_to = (
    a: number, [Xa, Ya, Za]: Float3,

    x: number,
    y: number,
    z: number
): void => {
    Xa[a] = x;
    Ya[a] = y;
    Za[a] = z;
};

const set_all_to = (
    a: number, [Xa, Ya, Za]: Float3,
    value: number
): void => {
    Xa[a] = Ya[a] = Za[a] = value;
};

const set_from = (
    a: number, [Xa, Ya, Za]: Float3,
    o: number, [Xo, Yo, Zo]: Float3
): void => {
    Xa[a] = Xo[o];
    Ya[a] = Yo[o];
    Za[a] = Zo[o];
};

const equals = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : boolean =>
    Xa[a].toFixed(PRECISION_DIGITS) ===
    Xb[b].toFixed(PRECISION_DIGITS) &&

    Ya[a].toFixed(PRECISION_DIGITS) ===
    Yb[b].toFixed(PRECISION_DIGITS) &&

    Za[a].toFixed(PRECISION_DIGITS) ===
    Zb[b].toFixed(PRECISION_DIGITS);

const invert = (
    a: number, [Xa, Ya, Za]: Float3,
    o: number, [Xo, Yo, Zo]: Float3
): void => {
    Xo[o] = -Xa[a];
    Yo[o] = -Ya[a];
    Zo[o] = -Za[a];
};

const invert_in_place = (
    a: number, [Xa, Ya, Za]: Float3
): void => {
    Xa[a] = -Xa[a];
    Ya[a] = -Ya[a];
    Za[a] = -Za[a];
};

const length = (
    a: number, [Xa, Ya, Za]: Float3
) : number => Math.hypot(
    Xa[a],
    Ya[a],
    Za[a]
);

const distance = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : number => Math.hypot(
    (Xb[b] - Xa[a]),
    (Yb[b] - Ya[a]),
    (Zb[b] - Za[a])
);

const length_squared = (
    a: number, [Xa, Ya, Za]: Float3
) : number =>
    Xa[a] ** 2 +
    Ya[a] ** 2 +
    Za[a] ** 2;

const distance_squared = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : number => (
    (Xb[b] - Xa[a]) ** 2 +
    (Yb[b] - Ya[a]) ** 2 +
    (Zb[b] - Za[a]) ** 2
);

const lerp = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3,
    o: number, [Xo, Yo, Zo]: Float3,

    t: number
) : void => {
    Xo[o] = (1-t)*Xa[a] + t*(Xb[b]);
    Yo[o] = (1-t)*Ya[a] + t*(Yb[b]);
    Zo[o] = (1-t)*Za[a] + t*(Zb[b]);
};

const add = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    Xo[o] = Xa[a] + Xb[b];
    Yo[o] = Ya[a] + Yb[b];
    Zo[o] = Za[a] + Zb[b];
};

const add_in_place = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : void => {
    Xa[a] += Xb[b];
    Ya[a] += Yb[b];
    Za[a] += Zb[b];
};

const subtract = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    Xo[o] = Xa[a] - Xb[b];
    Yo[o] = Ya[a] - Yb[b];
    Zo[o] = Za[a] - Zb[b];
};

const subtract_in_place = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : void => {
    Xa[a] -= Xb[b];
    Ya[a] -= Yb[b];
    Za[a] -= Zb[b];
};

const divide = (
    a: number, [Xa, Ya, Za]: Float3,
    o: number, [Xo, Yo, Zo]: Float3,

    n: number
) : void => {
    Xo[o] = Xa[a] / n;
    Yo[o] = Ya[a] / n;
    Zo[o] = Za[a] / n;
};

const divide_in_place = (
    a: number, [Xa, Ya, Za]: Float3,

    n: number
) : void => {
    Xa[a] /= n;
    Ya[a] /= n;
    Za[a] /= n;
};

const scale = (
    a: number, [Xa, Ya, Za]: Float3,
    o: number, [Xo, Yo, Zo]: Float3,

    n: number
) : void => {
    Xo[o] = Xa[a] * n;
    Yo[o] = Ya[a] * n;
    Zo[o] = Za[a] * n;
};

const scale_in_place = (
    a: number, [Xa, Ya, Za]: Float3,

    n: number
) : void => {
    Xa[a] *= n;
    Ya[a] *= n;
    Za[a] *= n;
};

const normalize = (
    a: number, [Xa, Ya, Za]: Float3,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    t_n = Math.hypot(
        Xa[a],
        Ya[a],
        Za[a]
    );

    Xo[o] = Xa[a] / t_n;
    Yo[o] = Ya[a] / t_n;
    Zo[o] = Za[a] / t_n;
};

const normalize_in_place = (
    a: number, [Xa, Ya, Za]: Float3
) : void => {
    t_n = Math.hypot(
        Xa[a],
        Ya[a],
        Za[a]
    );

    Xa[a] /= t_n;
    Ya[a] /= t_n;
    Za[a] /= t_n;
};

const dot = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : number =>
    Xa[a] * Xb[b] +
    Ya[a] * Yb[b] +
    Za[a] * Zb[b];

const cross = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    Xo[o] = Ya[a]*Zb[b] - Za[a]*Yb[b];
    Yo[o] = Za[a]*Xb[b] - Xa[a]*Zb[b];
    Zo[o] = Xa[a]*Yb[b] - Ya[a]*Xb[b];
};

const cross_in_place = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : void => {
    t_x = Xa[a];
    t_y = Ya[a];
    t_z = Za[a];

    Xa[a] = t_y*Zb[b] - t_z*Yb[b];
    Ya[a] = t_z*Xb[b] - t_x*Zb[b];
    Za[a] = t_x*Yb[b] - t_y*Xb[b];
};

const multiply = (
    a: number, [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13,
        M21, M22, M23,
        M31, M32, M33
    ]: Float9,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    Xo[o] = Xa[a]*M11[m] + Ya[a]*M21[m] + Za[a]*M31[m];
    Yo[o] = Xa[a]*M12[m] + Ya[a]*M22[m] + Za[a]*M32[m];
    Zo[o] = Xa[a]*M13[m] + Ya[a]*M23[m] + Za[a]*M33[m];
};

const multiply_in_place = (
    a: number, [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13,
        M21, M22, M23,
        M31, M32, M33
    ]: Float9
) : void => {
    t_x = Xa[a];
    t_y = Ya[a];
    t_z = Za[a];

    Xa[a] = t_x*M11[m] + t_y*M21[m] + t_z*M31[m];
    Ya[a] = t_x*M12[m] + t_y*M22[m] + t_z*M32[m];
    Za[a] = t_x*M13[m] + t_y*M23[m] + t_z*M33[m];
};


export const base3DFunctions: IVectorFunctionSet = {
    allocator: VECTOR_3D_ALLOCATOR,

    set_to,
    set_from,
    set_all_to,

    equals,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    invert,
    invert_in_place,

    lerp
};

export const vector3DFunctions: ITransformableVectorFunctionSet = {
    ...base3DFunctions,

    multiply,
    multiply_in_place,
};

export const position3DFunctions: IPositionFunctionSet = {
    ...vector3DFunctions,

    distance,
    distance_squared
};

export const direction3DFunctions: ICrossDirectionFunctionSet = {
    ...vector3DFunctions,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot,
    cross,
    cross_in_place
};
