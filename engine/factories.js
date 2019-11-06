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
//# sourceMappingURL=factories.js.map