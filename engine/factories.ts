import {
    Matrix4x4Values,
    FloatArrays2,
    Vector3DValues,
    FloatArrays4,
    Matrix3x3Values,
    Values,
    IntArrays3,
    NumArrays2,
    NumArrays3,
    NumArrays4,
    NumArrays
} from "./types.js";
import {Color3D, Direction3D, Position3D} from "./math/vec3.js";
import {Matrix3x3} from "./math/mat3x3.js";
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

export const float = (length: number, dim: DIM = DIM._3D) : Values => {
    switch (dim) {
        case DIM._2D: return float2(length);
        case DIM._3D: return float3(length);
        case DIM._4D: return float4(length);
    }

    throw `Invalid dimension ${dim}! Must be between 2 and 4`;
};

export const rgb = (
    r?: number | Color3D,
    g: number = 0,
    b: number = 0,
    data: Vector3DValues = float3(1),
    id: number = 0,
    out: Color3D = new Color3D(id, data)
): Color3D => {
    if (r instanceof Color3D)
        out.setFromOther(r);
    else
        out.setTo(r, g, b);

    return out
};

export const dir3 = (
    x?: number | Direction3D,
    y: number = 0,
    z: number = 0,
    data: Vector3DValues = float3(1),
    id: number = 0,
    out: Direction3D = new Direction3D(id, data)
): Direction3D => {
    if (x instanceof Direction3D)
        out.setFromOther(x);
    else
        out.setTo(x, y, z);

    return out
};

export const pos3 = (
    x?: number | Position3D,
    y: number = 0,
    z: number = 0,
    data: Vector3DValues = float3(1),
    id: number = 0,
    out: Position3D = new Position3D(id, data)
): Position3D => {
    if (x instanceof Position3D)
        out.setFromOther(x);
    else
        out.setTo(x, y, z);

    return out
};

export const mat3 = (
    m00?: number | Matrix3x3, m01: number = 0, m02: number = 0,
    m10: number = 0, m11: number = 0, m12: number = 0,
    m20: number = 0, m21: number = 0, m22: number = 0,
    data: Matrix3x3Values = float9(1),
    id: number = 0,
    out: Matrix3x3 = new Matrix3x3(id, data)
): Matrix3x3 => {
    if (m00 instanceof Matrix3x3)
        out.setFromOther(m00);
    else
        out.setTo(
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22
        );

    return out;
};