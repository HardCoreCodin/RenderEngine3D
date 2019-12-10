import {DIM, PRECISION_DIGITS} from "../../constants.js";
import {
    ICrossDirectionFunctionSet, IDirectionAttribute3DFunctionSet, IDirectionAttribute4DFunctionSet,
    IPositionFunctionSet,
    ITransformableAttributeFunctionSet,
    ITransformableVectorFunctionSet,
    IVectorFunctionSet
} from "../_interfaces/functions.js";
import {Float16, Float4} from "../../types.js";
import {VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";

let t_x,
    t_y,
    t_z,
    t_w,
    t_n: number;


const set_to = (
    a: number, [Xa, Ya, Za, Wa]: Float4,

    x: number,
    y: number,
    z: number,
    w: number
): void => {
    Xa[a] = x;
    Ya[a] = y;
    Za[a] = z;
    Wa[a] = w;
};

const set_all_to = (
    a: number, [Xa, Ya, Za, Wa]: Float4,

    value: number
): void => {
    Xa[a] = Ya[a] = Za[a] = Wa[a] = value;
};

const set_from = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4
): void => {
    Xa[a] = Xo[o];
    Ya[a] = Yo[o];
    Za[a] = Zo[o];
    Wa[a] = Wo[o];
};

const equals = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : boolean =>
    Xa[a].toFixed(PRECISION_DIGITS) ===
    Xb[b].toFixed(PRECISION_DIGITS) &&

    Ya[a].toFixed(PRECISION_DIGITS) ===
    Yb[b].toFixed(PRECISION_DIGITS) &&

    Za[a].toFixed(PRECISION_DIGITS) ===
    Zb[b].toFixed(PRECISION_DIGITS) &&

    Wa[a].toFixed(PRECISION_DIGITS) ===
    Wb[b].toFixed(PRECISION_DIGITS);

const invert = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4
): void => {
    Xo[o] = -Xa[a];
    Yo[o] = -Ya[a];
    Zo[o] = -Za[a];
    Wo[o] = -Wa[a];
};

const invert_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4
): void => {
    Xa[a] = -Xa[a];
    Ya[a] = -Ya[a];
    Za[a] = -Za[a];
    Wa[a] = -Wa[a];
};

const length = (
    a: number, [Xa, Ya, Za, Wa]: Float4
) : number => Math.hypot(
    Xa[a],
    Ya[a],
    Za[a],
    Wa[a]
);

const distance = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : number => Math.hypot(
    (Xb[b] - Xa[a]),
    (Yb[b] - Ya[a]),
    (Zb[b] - Za[a]),
    (Wb[b] - Wa[a])
);

const length_squared = (
    a: number, [Xa, Ya, Za, Wa]: Float4
) : number =>
    Xa[a] ** 2 +
    Ya[a] ** 2 +
    Za[a] ** 2 +
    Wa[a] ** 2;

const distance_squared = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : number => (
    (Xb[b] - Xa[a]) ** 2 +
    (Yb[b] - Ya[a]) ** 2 +
    (Zb[b] - Za[a]) ** 2 +
    (Wb[b] - Wa[a]) ** 2
);

const lerp = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4,

    t: number
) : void => {
    Xo[o] = (1-t)*Xa[a] + t*(Xb[b]);
    Yo[o] = (1-t)*Ya[a] + t*(Yb[b]);
    Zo[o] = (1-t)*Za[a] + t*(Zb[b]);
    Wo[o] = (1-t)*Wa[a] + t*(Wb[b]);
};

const add = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Xa[a] + Xb[b];
    Yo[o] = Ya[a] + Yb[b];
    Zo[o] = Za[a] + Zb[b];
    Wo[o] = Wa[a] + Wb[b];
};

const add_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : void => {
    Xa[a] += Xb[b];
    Ya[a] += Yb[b];
    Za[a] += Zb[b];
    Wa[a] += Wb[b];
};

const subtract = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Xa[a] - Xb[b];
    Yo[o] = Ya[a] - Yb[b];
    Zo[o] = Za[a] - Zb[b];
    Wo[o] = Wa[a] - Wb[b];
};

const subtract_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : void => {
    Xa[a] -= Xb[b];
    Ya[a] -= Yb[b];
    Za[a] -= Zb[b];
    Wa[a] -= Wb[b];
};

const multiply = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Xa[a] * Xb[b];
    Yo[o] = Ya[a] * Yb[b];
    Zo[o] = Za[a] * Zb[b];
    Wo[o] = Wa[a] * Wb[b];
};

const multiply_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : void => {
    Xa[a] *= Xb[b];
    Ya[a] *= Yb[b];
    Za[a] *= Zb[b];
    Wa[a] *= Wb[b];
};

const divide = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number,
    o: number, [Xo, Yo, Zo, Wo]: Float4,
) : void => {
    Xo[o] = Xa[a] / b;
    Yo[o] = Ya[a] / b;
    Zo[o] = Za[a] / b;
    Wo[o] = Wa[a] / b;
};

const divide_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    n: number
) : void => {
    Xa[a] /= n;
    Ya[a] /= n;
    Za[a] /= n;
    Wa[a] /= n;
};

const scale = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Xa[a] * b;
    Yo[o] = Ya[a] * b;
    Zo[o] = Za[a] * b;
    Wo[o] = Wa[a] * b;
};

const scale_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number
) : void => {
    Xa[a] *= b;
    Ya[a] *= b;
    Za[a] *= b;
    Wa[a] *= b;
};

const normalize = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    t_n = Math.hypot(
        Xa[a],
        Ya[a],
        Za[a],
        Wa[a]
    );

    Xo[o] = Xa[a] / t_n;
    Yo[o] = Ya[a] / t_n;
    Zo[o] = Za[a] / t_n;
    Wo[o] = Wa[a] / t_n;
};

const normalize_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4
) : void => {
    t_n = Math.hypot(
        Xa[a],
        Ya[a],
        Za[a],
        Wa[a]
    );

    Xa[a] /= t_n;
    Ya[a] /= t_n;
    Za[a] /= t_n;
    Wa[a] /= t_n;
};

const normalize_all_in_place = (
    [X, Y, Z, W]: Float4
) : void => {
    for (let i = 0; i < X.length; i++) {
        t_n = Math.hypot(X[i], Y[i], Z[i], W[i] );

        X[i] /= t_n;
        Y[i] /= t_n;
        Z[i] /= t_n;
        W[i] /= t_n;
    }
};

const dot = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : number =>
    Xa[a] * Xb[b] +
    Ya[a] * Yb[b] +
    Za[a] * Zb[b] +
    Wa[a] * Wb[b];

const cross = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Ya[a]*Zb[b] - Za[a]*Yb[b];
    Yo[o] = Za[a]*Xb[b] - Xa[a]*Zb[b];
    Zo[o] = Xa[a]*Yb[b] - Ya[a]*Xb[b];
};

const cross_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    b: number, [Xb, Yb, Zb, Wb]: Float4
) : void => {
    t_x = Xa[a];
    t_y = Ya[a];
    t_z = Za[a];

    Xa[a] = t_y*Zb[b] - t_z*Yb[b];
    Ya[a] = t_z*Xb[b] - t_x*Zb[b];
    Za[a] = t_x*Yb[b] - t_y*Xb[b];
};

const matrix_multiply = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Xa[a]*M11[m] + Ya[a]*M21[m] + Za[a]*M31[m] + Wa[a]*M41[m];
    Yo[o] = Xa[a]*M12[m] + Ya[a]*M22[m] + Za[a]*M32[m] + Wa[a]*M42[m];
    Zo[o] = Xa[a]*M13[m] + Ya[a]*M23[m] + Za[a]*M33[m] + Wa[a]*M43[m];
    Wo[o] = Xa[a]*M14[m] + Ya[a]*M24[m] + Za[a]*M34[m] + Wa[a]*M44[m];
};

export const matrix_multiply_all = (
    [Xa, Ya, Za, Wa]: Float4,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16,
    [Xo, Yo, Zo, Wo]: Float4
) : void => {
    for (let i = 0; i < Xa.length; i++) {
        Xo[i] = Xa[i]*M11[m] + Ya[i]*M21[m] + Za[i]*M31[m] + Wa[i]*M41[m];
        Yo[i] = Xa[i]*M12[m] + Ya[i]*M22[m] + Za[i]*M32[m] + Wa[i]*M42[m];
        Zo[i] = Xa[i]*M13[m] + Ya[i]*M23[m] + Za[i]*M33[m] + Wa[i]*M43[m];
        Wo[i] = Xa[i]*M14[m] + Ya[i]*M24[m] + Za[i]*M34[m] + Wa[i]*M44[m];
    }
};

const matrix_multiply_in_place = (
    a: number, [Xa, Ya, Za, Wa]: Float4,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16
) : void => {
    t_x = Xa[a];
    t_y = Ya[a];
    t_z = Za[a];
    t_w = Wa[a];

    Xa[a] = t_x*M11[m] + t_y*M21[m] + t_z*M31[m] + t_w*M41[m];
    Ya[a] = t_x*M12[m] + t_y*M22[m] + t_z*M32[m] + t_w*M42[m];
    Za[a] = t_x*M13[m] + t_y*M23[m] + t_z*M33[m] + t_w*M43[m];
    Wa[a] = t_x*M14[m] + t_y*M24[m] + t_z*M34[m] + t_w*M44[m];
};

const matrix_multiply_in_place_all = (
    [Xa, Ya, Za, Wa]: Float4,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16
) : void => {
    for (let i = 0; i < Xa.length; i++) {
        t_x = Xa[i];
        t_y = Ya[i];
        t_z = Za[i];
        t_w = Wa[i];

        Xa[i] = t_x*M11[m] + t_y*M21[m] + t_z*M31[m] + t_w*M41[m];
        Ya[i] = t_x*M12[m] + t_y*M22[m] + t_z*M32[m] + t_w*M42[m];
        Za[i] = t_x*M13[m] + t_y*M23[m] + t_z*M33[m] + t_w*M43[m];
        Wa[i] = t_x*M14[m] + t_y*M24[m] + t_z*M34[m] + t_w*M44[m];
    }
};

export const transformableAttribute4DFunctions: ITransformableAttributeFunctionSet<DIM._4D> = {
    matrix_multiply_all,
    matrix_multiply_in_place_all
};

export const directionAttribute4DFunctions: IDirectionAttribute4DFunctionSet = {
    ...transformableAttribute4DFunctions,

    normalize_all_in_place
};

//
// export const positionAttribute4DFunctions: IPositionAttribute4DFunctionSet = {
//     ...transformableAttribute4DFunctions,
//
//     in_view_tri,
//     in_view_all,
//     in_view_any,
//
//     to_ndc_all,
//     to_ndc_all_in_place,
// };

export const base4DFunctions: IVectorFunctionSet = {
    allocator: VECTOR_4D_ALLOCATOR,

    set_to,
    set_from,
    set_all_to,

    equals,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    multiply,
    multiply_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    invert,
    invert_in_place,

    lerp
};

export const vector4DFunctions: ITransformableVectorFunctionSet = {
    ...base4DFunctions,

    matrix_multiply,
    matrix_multiply_in_place
};

export const position4DFunctions: IPositionFunctionSet = {
    ...vector4DFunctions,

    distance,
    distance_squared
    //
    // in_view,
    //
    // to_ndc,
    // to_ndc_in_place
};

export const direction4DFunctions: ICrossDirectionFunctionSet = {
    ...vector4DFunctions,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot,
    cross,
    cross_in_place
};