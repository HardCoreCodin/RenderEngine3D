import { Color3D, Direction3D, Position3D } from "./math/vec3.js";
import { Matrix3x3 } from "./math/mat3x3.js";
export const num2 = (length = 0) => [
    Array(length),
    Array(length)
];
export const num3 = (length = 0) => [
    Array(length),
    Array(length),
    Array(length)
];
export const num4 = (length = 0) => [
    Array(length),
    Array(length),
    Array(length),
    Array(length)
];
export const num = (length, dim = 3 /* _3D */) => {
    switch (dim) {
        case 2 /* _2D */: return num2(length);
        case 3 /* _3D */: return num3(length);
        case 4 /* _4D */: return num4(length);
    }
    throw `Invalid dimension ${dim}! Must be between 2 and 4`;
};
export const int3 = (length) => [
    new Uint32Array(length),
    new Uint32Array(length),
    new Uint32Array(length)
];
export const float2 = (length) => [
    new Float32Array(length),
    new Float32Array(length)
];
export const float3 = (length) => [
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length)
];
export const float4 = (length) => [
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length),
    new Float32Array(length)
];
export const float9 = (length) => [
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
export const float16 = (length) => [
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
export const float = (length, dim = 3 /* _3D */) => {
    switch (dim) {
        case 2 /* _2D */: return float2(length);
        case 3 /* _3D */: return float3(length);
        case 4 /* _4D */: return float4(length);
    }
    throw `Invalid dimension ${dim}! Must be between 2 and 4`;
};
export const rgb = (r, g = 0, b = 0, data = float3(1), id = 0, out = new Color3D(id, data)) => {
    if (r instanceof Color3D)
        out.setFromOther(r);
    else
        out.setTo(r, g, b);
    return out;
};
export const dir3 = (x, y = 0, z = 0, data = float3(1), id = 0, out = new Direction3D(id, data)) => {
    if (x instanceof Direction3D)
        out.setFromOther(x);
    else
        out.setTo(x, y, z);
    return out;
};
export const pos3 = (x, y = 0, z = 0, data = float3(1), id = 0, out = new Position3D(id, data)) => {
    if (x instanceof Position3D)
        out.setFromOther(x);
    else
        out.setTo(x, y, z);
    return out;
};
export const mat3 = (m00, m01 = 0, m02 = 0, m10 = 0, m11 = 0, m12 = 0, m20 = 0, m21 = 0, m22 = 0, data = float9(1), id = 0, out = new Matrix3x3(id, data)) => {
    if (m00 instanceof Matrix3x3)
        out.setFromOther(m00);
    else
        out.setTo(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return out;
};
//# sourceMappingURL=factories.js.map