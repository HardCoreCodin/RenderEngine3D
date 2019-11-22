import {
    NumArrays2,
    NumArrays3,
    NumArrays4,
} from "./types.js";

export const num2 = (length: number = 0) : NumArrays2 => [
    Array(length),
    Array(length)
];

export const num3 = (length: number = 0) : NumArrays3 => [
    Array(length),
    Array(length),
    Array(length)
];

export const num4 = (length: number = 0) : NumArrays4 => [
    Array(length),
    Array(length),
    Array(length),
    Array(length)
];