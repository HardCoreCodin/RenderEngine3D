// import {Float2, Float3, Int2} from "../../../types.js";
//
// let i, j: number;
//
// const linearly_interpolate = (
//     l: number, [t, one_minus_t]: Float2,
//     a: number, from: Arrays,
//     b: number, to: Arrays,
//     o: number, out: Arrays,
// ): void => {
//     for (i = 0; i < from.length; i++)
//         out[i][o] = one_minus_t[l] * from[i][a] + t[l] * to[i][b];
// };
//
// const linearly_interpolate_in_place = (
//     l: number, [t, one_minus_t]: Float2,
//     a: number, from: Arrays,
//     b: number, to: Arrays
// ): void => {
//     for (i = 0; i < from.length; i++)
//         from[i][a] = one_minus_t[l] * from[i][a] + t[l] * to[i][b];
// };
//
// const linearly_interpolate_all = (
//     [t, one_minus_t]: Float2,
//     from: Arrays,
//     to: Arrays,
//     out: Arrays,
// ): void => {
//     for (j = 0; j < from[0].length; j++)
//         for (i = 0; i < from.length; i++)
//             out[i][j] = one_minus_t[j] * from[i][j] + t[j] * to[i][j];
// };
//
// const linearly_interpolate_in_place_all = (
//     [t, one_minus_t]: Float2,
//     from: Arrays,
//     to: Arrays
// ): void => {
//     for (j = 0; j < from[0].length; j++)
//         for (i = 0; i < from.length; i++)
//             from[i][j] = one_minus_t[j] * from[i][j] + t[j] * to[i][j];
// };
//
//
// const linearly_interpolate_some = (
//     flags: Uint8Array,
//     [from_index, to_index]: Int2,
//     [t, one_minus_t]: Float2,
//     from: Arrays,
//     to: Arrays,
//     out: Arrays,
// ): void => {
//     for (j = 0; j < from_index.length; j++) if (flags[j])
//         for (i = 0; i < from.length; i++)
//             out[i][from_index[j]] = one_minus_t[j]*from[i][from_index[j]] + t[j]*to[i][to_index[j]];
// };
//
// const linearly_interpolate_in_place_some = (
//     flags: Uint8Array,
//     [from_index, to_index]: Int2,
//     [t, one_minus_t]: Float2,
//     from: Arrays,
//     to: Arrays
// ): void => {
//     for (j = 0; j < from_index.length; j++) if (flags[j])
//         for (i = 0; i < from.length; i++)
//             from[i][from_index[j]] = one_minus_t[j]*from[i][from_index[j]] + t[j]*to[i][to_index[j]];
// };
//
// export const linearInterpolatorFunctions: ILinearInterpolatorFunctionSet = {
//     ...accessor2DFunctions,
//
//     linearly_interpolate,
//     linearly_interpolate_in_place
// };
//
//
// export const linearInterpolatorAttributeFunctions: ILinearInterpolatorAttributeFunctionSet = {
//     linearly_interpolate_all,
//     linearly_interpolate_in_place_all,
//
//     linearly_interpolate_some,
//     linearly_interpolate_in_place_some
// };
//
//
// const barycentric_interpolate = (
//     w: number, [w1, w2, w3]: Float3,
//     a: number, arrays: Arrays,
//     o: number, out: Arrays,
// ): void => {
//     for (i = 0; i < arrays.length; i++)
//         out[i][o] = (
//             w1[i][w] * arrays[i][a] +
//             w2[i][w] * arrays[i][a] +
//             w3[i][w] * arrays[i][a]
//         );
// };
//
// const barycentric_interpolate_in_place = (
//     w: number, [w1, w2, w3]: Float3,
//     a: number, arrays: Arrays,
// ): void => {
//     for (i = 0; i < arrays.length; i++)
//         arrays[i][a] = (
//             w1[i][w] * arrays[i][a] +
//             w2[i][w] * arrays[i][a] +
//             w3[i][w] * arrays[i][a]
//         );
// };
//
// const barycentric_interpolate_all = (
//     [w1, w2, w3]: Float3,
//     arrays: Arrays,
//     out: Arrays,
// ): void => {
//     for (j = 0; j < arrays[0].length; j++)
//         for (i = 0; i < arrays.length; i++)
//             out[i][j] = (
//                 w1[i][j] * arrays[i][j] +
//                 w2[i][j] * arrays[i][j] +
//                 w3[i][j] * arrays[i][j]
//             );
// };
//
// const barycentric_interpolate_in_place_all = (
//     [w1, w2, w3]: Float3,
//     arrays: Arrays,
// ): void => {
//     for (j = 0; j < arrays[0].length; j++)
//         for (i = 0; i < arrays.length; i++)
//             arrays[i][j] = (
//                 w1[i][j] * arrays[i][j] +
//                 w2[i][j] * arrays[i][j] +
//                 w3[i][j] * arrays[i][j]
//             );
// };
//
//
// export const barycentricInterpolatorFunctions: IBarycentricInterpolatorFunctionSet = {
//     ...accessor2DFunctions,
//
//     barycentric_interpolate,
//     barycentric_interpolate_in_place
// };
//
//
// export const barycentricInterpolatorAttributeFunctions: IBarycentricInterpolatorAttributeFunctionSet = {
//     barycentric_interpolate_all,
//     barycentric_interpolate_in_place_all
// };