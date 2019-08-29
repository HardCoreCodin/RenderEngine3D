export const add = (
    lhs: Float32Array,
    rhs: Float32Array
) : Float32Array => {
    lhs[0] += rhs[0];
    lhs[1] += rhs[1];
    lhs[2] += rhs[2];
    lhs[3] += rhs[3];

    return lhs;
};

export const plus = (
    lhs: Float32Array,
    rhs: Float32Array,
    out: Float32Array = new Float32Array(4)
) : Float32Array => {
    out[0] = lhs[0] + rhs[0];
    out[1] = lhs[1] + rhs[1];
    out[2] = lhs[2] + rhs[2];
    out[3] = lhs[3] + rhs[3];

    return out;
};

export const sub = (
    lhs: Float32Array,
    rhs: Float32Array
) : Float32Array => {
    lhs[0] -= rhs[0];
    lhs[1] -= rhs[1];
    lhs[2] -= rhs[2];
    lhs[3] -= rhs[3];

    return lhs;
};

export const minus = (
    lhs: Float32Array,
    rhs: Float32Array,
    out: Float32Array = new Float32Array(4)
) : Float32Array => {
    out[0] = lhs[0] - rhs[0];
    out[1] = lhs[1] - rhs[1];
    out[2] = lhs[2] - rhs[2];
    out[3] = lhs[3] - rhs[3];

    return out;
};

export const div = (
    lhs: Float32Array,
    rhs: number
) : Float32Array => {
    lhs[0] /= rhs;
    lhs[1] /= rhs;
    lhs[2] /= rhs;
    lhs[3] /= rhs;

    return lhs;
};

export const over = (
    lhs: Float32Array,
    rhs: number,
    out: Float32Array = new Float32Array(4)
) : Float32Array => {
    out[0] = lhs[0] / rhs;
    out[1] = lhs[1] / rhs;
    out[2] = lhs[2] / rhs;
    out[3] = lhs[3] / rhs;

    return out;
};

export const mul = (
    lhs: Float32Array,
    rhs: number
) : Float32Array => {
    lhs[0] *= rhs;
    lhs[1] *= rhs;
    lhs[2] *= rhs;
    lhs[3] *= rhs;

    return lhs;
};

export const times = (
    lhs: Float32Array,
    rhs: number,
    out: Float32Array = new Float32Array(4)
) : Float32Array => {
    out[0] = lhs[0] * rhs;
    out[1] = lhs[1] * rhs;
    out[2] = lhs[2] * rhs;
    out[3] = lhs[3] * rhs;

    return out;
};

export const dot = (
    lhs: Float32Array,
    rhs: Float32Array
    ) : number =>
    lhs[0]*rhs[0] +
    lhs[1]*rhs[1] +
    lhs[2]*rhs[2]
;

export const cross = (
    lhs: Float32Array,
    rhs: Float32Array,
    out: Float32Array = new Float32Array(4)
) : Float32Array => {
    out[0] = lhs[1]*rhs[2] - lhs[2]*rhs[1];
    out[1] = lhs[2]*rhs[0] - lhs[0]*rhs[2];
    out[2] = lhs[0]*rhs[1] - lhs[1]*rhs[0];

    return out;
};

export const matMul = (
    lhs: Float32Array,
    rhs: Float32Array,
    out: Float32Array = new Float32Array(16)
) : Float32Array => {
    out[0] = lhs[0] * rhs[0] + lhs[1] * rhs[4] + lhs[2] * rhs[8] + lhs[3] * rhs[12];
    out[1] = lhs[0] * rhs[1] + lhs[1] * rhs[5] + lhs[2] * rhs[9] + lhs[3] * rhs[13];
    out[2] = lhs[0] * rhs[2] + lhs[1] * rhs[6] + lhs[2] * rhs[10] + lhs[3] * rhs[14];
    out[3] = lhs[0] * rhs[3] + lhs[1] * rhs[7] + lhs[2] * rhs[11] + lhs[3] * rhs[15];

    return out;
};