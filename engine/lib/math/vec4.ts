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
//
// const in_view = (
//     x: number,
//     y: number,
//     z: number,
//     w: number,
// ) : boolean => !(
//     z < 0 ||
//     z > 1 ||
//     w < (x < 0 ? -x : x) ||
//     w < (y < 0 ? -y : y)
// );
//
// const in_view_tri = (
//     x1: number, y1: number, z1: number, w1: number,
//     x2: number, y2: number, z2: number, w2: number,
//     x3: number, y3: number, z3: number, w3: number
// ) : boolean => (
//         // Frustum culling:
//         // ================
//         // Assuming homogeneous coordinates are in clip-space
//         !(
//             z1 < 0 ||
//             z1 > 1 ||
//             w1 < (x1 < 0 ? -x1 : x1) ||
//             w1 < (y1 < 0 ? -y1 : y1)
//         ) ||
//         !(
//             z2 < 0 ||
//             z2 > 1 ||
//             w2 < (x2 < 0 ? -x2 : x2) ||
//             w2 < (y2 < 0 ? -y2 : y2)
//         ) ||
//         !(
//             z3 < 0 ||
//             z3 > 1 ||
//             w3 < (x3 < 0 ? -x3 : x3) ||
//             w3 < (y3 < 0 ? -y3 : y3)
//         )
//     ) && (
//         // Back-face culling:
//         // ==================
//         // Compute the determinant (area of the paralelogram formed by the 3 vertices)
//         // If the area is zero, the triangle also has a zero surface so can not be drawn.
//         // If the area is negative, the parallelogram (triangle) is facing backwards.
//         (((x3 - x2) * (y1 - y2)) - ((y3 - y2) * (x1 - x2))) > 0
//     );
// //
// // let v_1, v_2, v_3,
// //     w_1, w_2, w_3,
// //     x_1, x_2, x_3,
// //     y_1, y_2, y_3,
// //     z_1, z_2, z_3: number;
// //
//
// let bit_mask: number;
// const computePositionMask = (
//     [X, Y, Z, W]: Float4,
//     mask: Uint8Array
// ): void => {
//     for (let i = 0; i < X.length; i++) {
//         t_w = W[i];
//         t_x = X[i];
//         t_y = Y[i];
//         t_z = Z[i];
//
//         bit_mask = (
//             t_z < 0 ? VERTEX_POSITION__Z_B :
//             t_z > 1 ? VERTEX_POSITION__Z_F : 0
//         ) | (
//             t_x > t_w ? VERTEX_POSITION__X_L :
//             t_x < -t_w ? VERTEX_POSITION__X_R : 0
//         ) | (
//             t_y > t_w ? VERTEX_POSITION__Y_A :
//             t_y < -t_w ? VERTEX_POSITION__Y_B : 0
//         );
//
//         mask[i] = (
//             bit_mask & VERTEX_POSITION__X_DIR &&
//             bit_mask & VERTEX_POSITION__Y_DIR &&
//             bit_mask & VERTEX_POSITION__Z_DIR
//         ) ? bit_mask | VERTEX_POSITION__OUT :
//             bit_mask;
//     }
// };
//
//
// let behind, in_front, above, below, right_of, left_of, found: boolean;
// const in_view_all = (
//     [Xa, Ya, Za, Wa]: Float4,
//     mask?: Uint8Array
// ) : boolean => {
//     behind = in_front = above = below = right_of = left_of = found = false;
//
//     for (let i = 0; i < Xa.length; i++) {
//         t_z = Za[i];
//         if (t_z >= 0) {
//             if (t_z <= 1) {
//                 t_w = Wa[i];
//                 t_x = Xa[i];
//                 if (t_x <= t_w) {
//                     if (t_x >= -t_w) {
//                         t_y = Ya[i];
//                         if (t_y <= t_w) {
//                             if (t_y >= -t_w) {
//                                 mask![i] = 1;
//                                 found = true;
//                                 continue;
//                             } else below = true;
//                         } else above = true;
//                     } else left_of = true;
//                 } else right_of = true;
//             } else in_front = true;
//         } else behind = true;
//         mask![i] = 0;
//     }
//
//     return found || (below && above && in_front && behind && left_of && right_of);
// };
//
// const in_view_any = (
//     [Xa, Ya, Za, Wa]: Float4,
// ) : boolean => {
//     for (let i = 0; i < Xa.length; i++) {
//         t_z = Za[i];
//         if (t_z >= 0) {
//             if (t_z <= 1) {
//                 t_w = Wa[i];
//                 t_x = Xa[i];
//                 if (t_x <= t_w && t_x >= -t_w) {
//                     t_y = Ya[i];
//                     if (t_y <= t_w && t_y >= -t_w)
//                         return true;
//                 }
//             }
//         }
//     }
//
//     return false;
// };
//
// let one_over_w;
// const to_ndc = (
//     a: number, [Xa, Ya, Za, Wa]: Float4,
//     o: number, [Xo, Yo, Zo, Wo]: Float4
// ): void => {
//     one_over_w = 1.0 / Wa[a];
//     Xo[o] = Xa[a] * one_over_w;
//     Yo[o] = Ya[a] * one_over_w;
//     Zo[o] = Za[a] * one_over_w;
//     Wo[o] = 1;
// };
//
// const to_ndc_in_place = (
//     a: number, [Xa, Ya, Za, Wa]: Float4
// ): void => {
//     one_over_w = 1.0 / Wa[a];
//     Xa[a] *= one_over_w;
//     Ya[a] *= one_over_w;
//     Za[a] *= one_over_w;
//     Wa[a] = 1;
// };

// const to_ndc_all = (
//     [Xa, Ya, Za, Wa]: Float4,
//     [Xo, Yo, Zo, Wo]: Float4,
//     mask?: Uint8Array
// ): void => {
//     for (let i = 0; i < Xa.length; i++) {
//         if (mask && !mask[i])
//             continue;
//
//         one_over_w = 1.0 / Wa[i];
//         Xo[i] = Xa[i] * one_over_w;
//         Yo[i] = Ya[i] * one_over_w;
//         Zo[i] = Za[i] * one_over_w;
//         Wo[i] = 1;
//     }
// };
//
// const to_ndc_all_in_place = (
//     [Xa, Ya, Za, Wa]: Float4,
//     mask?: Uint8Array
// ): void => {
//     for (let i = 0; i < Xa.length; i++) {
//         if (mask && !mask[i])
//             continue;
//
//         one_over_w = 1.0 / Wa[i];
//         Xa[i] *= one_over_w;
//         Ya[i] *= one_over_w;
//         Za[i] *= one_over_w;
//         Wa[i] = 1;
//     }
// };

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