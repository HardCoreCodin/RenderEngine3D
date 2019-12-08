import {Float16, Float3, Float4, Float9} from "../../types.js";
import {DIM, PRECISION_DIGITS} from "../../constants.js";
import {
    ICrossDirectionFunctionSet,
    IDirection3DFunctionSet,
    IDirectionAttribute3DFunctionSet,
    IPosition3DFunctionSet,
    IPositionAttribute3DFunctionSet,
    IPositionFunctionSet,
    ITransformableAttributeFunctionSet,
    ITransformableVectorFunctionSet,
    IVectorFunctionSet
} from "../_interfaces/functions.js";
import {VECTOR_3D_ALLOCATOR} from "../memory/allocators.js";

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

const multiply = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    Xo[o] = Xa[a] * Xb[b];
    Yo[o] = Ya[a] * Yb[b];
    Zo[o] = Za[a] * Zb[b];
};

const multiply_in_place = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number, [Xb, Yb, Zb]: Float3
) : void => {
    Xa[a] *= Xb[b];
    Ya[a] *= Yb[b];
    Za[a] *= Zb[b];
};

const divide = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    Xo[o] = Xa[a] / b;
    Yo[o] = Ya[a] / b;
    Zo[o] = Za[a] / b;
};

const divide_in_place = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number
) : void => {
    Xa[a] /= b;
    Ya[a] /= b;
    Za[a] /= b;
};

const scale = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number,
    o: number, [Xo, Yo, Zo]: Float3
) : void => {
    Xo[o] = Xa[a] * b;
    Yo[o] = Ya[a] * b;
    Zo[o] = Za[a] * b;
};

const scale_in_place = (
    a: number, [Xa, Ya, Za]: Float3,
    b: number
) : void => {
    Xa[a] *= b;
    Ya[a] *= b;
    Za[a] *= b;
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

const normalize_all_in_place = (
    [X, Y, Z]: Float3
) : void => {
    for (let i = 0; i < X.length; i++) {
        t_n = Math.hypot(X[i], Y[i], Z[i]);

        X[i] /= t_n;
        Y[i] /= t_n;
        Z[i] /= t_n;
    }
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

const matrix_multiply = (
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

const matrix_multiply_position_by_mat4 = (
    a: number, [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Xa[a]*M11[m] + Ya[a]*M21[m] + Za[a]*M31[m] + M41[m];
    Yo[o] = Xa[a]*M12[m] + Ya[a]*M22[m] + Za[a]*M32[m] + M42[m];
    Zo[o] = Xa[a]*M13[m] + Ya[a]*M23[m] + Za[a]*M33[m] + M43[m];
    Wo[o] = Xa[a]*M14[m] + Ya[a]*M24[m] + Za[a]*M34[m] + M44[m];
};

const matrix_multiply_direction_by_mat4 = (
    a: number, [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16,
    o: number, [Xo, Yo, Zo, Wo]: Float4
) : void => {
    Xo[o] = Xa[a]*M11[m] + Ya[a]*M21[m] + Za[a]*M31[m];
    Yo[o] = Xa[a]*M12[m] + Ya[a]*M22[m] + Za[a]*M32[m];
    Zo[o] = Xa[a]*M13[m] + Ya[a]*M23[m] + Za[a]*M33[m];
    Wo[o] = Xa[a]*M14[m] + Ya[a]*M24[m] + Za[a]*M34[m];
};

const matrix_multiply_all = (
    [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13,
        M21, M22, M23,
        M31, M32, M33
    ]: Float9,
    [Xo, Yo, Zo]: Float3
): void => {
    for (let i = 0; i < Xa.length; i++) {
        Xo[i] = Xa[i]*M11[m] + Ya[i]*M21[m] + Za[i]*M31[m];
        Yo[i] = Xa[i]*M12[m] + Ya[i]*M22[m] + Za[i]*M32[m];
        Zo[i] = Xa[i]*M13[m] + Ya[i]*M23[m] + Za[i]*M33[m];
    }
};

export const matrix_multiply_all_positions_by_mat4 = (
    [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16,
    [Xo, Yo, Zo, Wo]: Float4
) : void => {
    for (let i = 0; i < Xa.length; i++) {
        Xo[i] = Xa[i]*M11[m] + Ya[i]*M21[m] + Za[i]*M31[m] + M41[m];
        Yo[i] = Xa[i]*M12[m] + Ya[i]*M22[m] + Za[i]*M32[m] + M42[m];
        Zo[i] = Xa[i]*M13[m] + Ya[i]*M23[m] + Za[i]*M33[m] + M43[m];
        Wo[i] = Xa[i]*M14[m] + Ya[i]*M24[m] + Za[i]*M34[m] + M44[m];
    }
};

export const matrix_multiply_all_directions_by_mat4 = (
    [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13, M14,
        M21, M22, M23, M24,
        M31, M32, M33, M34,
        M41, M42, M43, M44
    ]: Float16,
    [Xo, Yo, Zo, Wo]: Float4
) : void => {
    for (let i = 0; i < Xa.length; i++) {
        Xo[i] = Xa[i]*M11[m] + Ya[i]*M21[m] + Za[i]*M31[m];
        Yo[i] = Xa[i]*M12[m] + Ya[i]*M22[m] + Za[i]*M32[m];
        Zo[i] = Xa[i]*M13[m] + Ya[i]*M23[m] + Za[i]*M33[m];
        Wo[i] = Xa[i]*M14[m] + Ya[i]*M24[m] + Za[i]*M34[m];
    }
};


const matrix_multiply_in_place = (
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

const matrix_multiply_in_place_all = (
    [Xa, Ya, Za]: Float3,
    m: number, [
        M11, M12, M13,
        M21, M22, M23,
        M31, M32, M33
    ]: Float9
): void => {
    for (let i = 0; i < Xa.length; i++) {
        t_x = Xa[i];
        t_y = Ya[i];
        t_z = Za[i];

        Xa[i] = t_x*M11[m] + t_y*M21[m] + t_z*M31[m];
        Ya[i] = t_x*M12[m] + t_y*M22[m] + t_z*M32[m];
        Za[i] = t_x*M13[m] + t_y*M23[m] + t_z*M33[m];
    }
};

// const in_view_tri = (
//     x1: number, y1: number, z1: number, top_1: number, right_1: number,
//     x2: number, y2: number, z2: number, top_2: number, right_2: number,
//     x3: number, y3: number, z3: number, top_3: number, right_3: number,
//
//     near: number,
//     far: number
// ) : boolean => (
//         // Frustum culling:
//         // ================
//         !(near > z1 || z1 > far || y1 < -top_1 || y1 > top_1 || x1 < -right_1 || x1 > right_1) ||
//         !(near > z2 || z2 > far || y2 < -top_2 || y2 > top_2 || x2 < -right_2 || x2 > right_2) ||
//         !(near > z3 || z3 > far || y3 < -top_3 || y3 > top_3 || x3 < -right_3 || x3 > right_3)
//     ) && (
//         // Back-face culling:
//         // ==================
//         // Compute the determinant (area of the paralelogram formed by the 3 vertices)
//         // If the area is zero, the triangle also has a zero surface so can not be drawn.
//         // If the area is negative, the parallelogram (triangle) is facing backwards.
//         (((x3 - x2) * (y1 - y2)) - ((y3 - y2) * (x1 - x2))) > 0
//     );
//
// let behind, in_front, above, below, right_of, left_of, in_y, in_z: boolean;
// const in_view_all = (
//     [Xa, Ya, Za]: Float3,
//
//     near: number,
//     far: number
// ) : boolean => {
//     behind = in_front = above = below = right_of = left_of = in_y = in_z = false;
//
//     for (let i = 0; i < Xa.length; i++) {
//         t_z = Za[i];
//
//         if (t_z < near) {
//             if (in_front)
//                 return true;
//
//             behind = true;
//         } else if (t_z > far) {
//             if (behind)
//                 return true;
//
//             in_front = true;
//         } else return true;
//     }
//
//     return false;
// };

export const transformableAttribute3DFunctions: ITransformableAttributeFunctionSet<DIM._3D> = {
    matrix_multiply_all,
    matrix_multiply_in_place_all
};

export const positionAttribute3DFunctions: IPositionAttribute3DFunctionSet = {
    ...transformableAttribute3DFunctions,

    matrix_multiply_all_positions_by_mat4
};

export const directionAttribute3DFunctions: IDirectionAttribute3DFunctionSet = {
    ...transformableAttribute3DFunctions,

    matrix_multiply_all_directions_by_mat4,
    normalize_all_in_place
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

export const vector3DFunctions: ITransformableVectorFunctionSet = {
    ...base3DFunctions,

    matrix_multiply,
    matrix_multiply_in_place,
};

export const position3DFunctions: IPosition3DFunctionSet = {
    ...vector3DFunctions,

    distance,
    distance_squared,

    matrix_multiply_position_by_mat4
};

export const direction3DFunctions: IDirection3DFunctionSet = {
    ...vector3DFunctions,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot,

    cross,
    cross_in_place,

    matrix_multiply_direction_by_mat4
};
