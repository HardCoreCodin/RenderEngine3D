import {
    Matrix4x4Values,
    FloatArrays2,
    Vector3DValues,
    FloatArrays4,
    Matrix3x3Values,
    FloatValues,
    IntArrays3,
    NumArrays2,
    NumArrays3,
    NumArrays4,
    NumArrays
} from "./types.js";
import {DIM} from "./constants";

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

export const num = (length: number, dim: DIM = DIM._3D) : NumArrays => {
    switch (dim) {
        case DIM._2D: return num2(length);
        case DIM._3D: return num3(length);
        case DIM._4D: return num4(length);
    }

    throw `Invalid dimension ${dim}! Must be between 2 and 4`;
};

export const int3 = (length: number) : IntArrays3 => [
    new Uint32Array(length),
    new Uint32Array(length),
    new Uint32Array(length)
];

export const float2 = (length: number) : FloatArrays2 => [
    new Float32Array(length),
    new Float32Array(length)
];

export const float3 = (length: number) : Vector3DValues => [
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length)
];

export const float4 = (length: number) : FloatArrays4 => [
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length)
];

export const float9 = (length: number) : Matrix3x3Values => [
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),

    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),

    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length)
];

export const float16 = (length: number) : Matrix4x4Values => [
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),

    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),

    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),

    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length)
];

export const float = (length: number, dim: DIM = DIM._3D) : FloatValues => {
    switch (dim) {
        case DIM._2D: return float2(length);
        case DIM._3D: return float3(length);
        case DIM._4D: return float4(length);
    }

    throw `Invalid dimension ${dim}! Must be between 2 and 4`;
};