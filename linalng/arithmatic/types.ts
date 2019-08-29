export const VectorBufferLength = 4;
export const MatrixBufferLength = 16;

export const M0_Start = 0;
export const M1_Start = VectorBufferLength;
export const M2_Start = VectorBufferLength + M1_Start;
export const M3_Start = VectorBufferLength + M2_Start;

export const M0_End = M1_Start;
export const M1_End = M2_Start;
export const M2_End = M3_Start;
export const M3_End = MatrixBufferLength;

export const Buffer = Float32Array;
export type Buffer = Float32Array;

export type VectorArray = [
    number,
    number,
    number,
    number,
];

export type MatrixArray = [
    number,
    number,
    number,
    number,

    number,
    number,
    number,
    number,

    number,
    number,
    number,
    number,

    number,
    number,
    number,
    number,
];

export type MatrixVectorArrays = [
    VectorArray,
    VectorArray,
    VectorArray,
    VectorArray
];

export type MatrixVectorBuffers = [
    Buffer,
    Buffer,
    Buffer,
    Buffer
];