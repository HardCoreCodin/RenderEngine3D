import {Buffer, MatrixBufferLength, VectorBufferLength} from "./types.js";

export const add = (
    lhs: Buffer,
    rhs: Buffer
) : Buffer => {
    lhs[0] += rhs[0];
    lhs[1] += rhs[1];
    lhs[2] += rhs[2];
    lhs[3] += rhs[3];

    return lhs;
};

export const plus = (
    lhs: Buffer,
    rhs: Buffer,
    out: Buffer = new Buffer(VectorBufferLength)
) : Buffer => {
    out[0] = lhs[0] + rhs[0];
    out[1] = lhs[1] + rhs[1];
    out[2] = lhs[2] + rhs[2];
    out[3] = lhs[3] + rhs[3];

    return out;
};

export const sub = (
    lhs: Buffer,
    rhs: Buffer
) : Buffer => {
    lhs[0] -= rhs[0];
    lhs[1] -= rhs[1];
    lhs[2] -= rhs[2];
    lhs[3] -= rhs[3];

    return lhs;
};

export const minus = (
    lhs: Buffer,
    rhs: Buffer,
    out: Buffer = new Buffer(VectorBufferLength)
) : Buffer => {
    out[0] = lhs[0] - rhs[0];
    out[1] = lhs[1] - rhs[1];
    out[2] = lhs[2] - rhs[2];
    out[3] = lhs[3] - rhs[3];

    return out;
};

export const div = (
    lhs: Buffer,
    rhs: number
) : Buffer => {
    lhs[0] /= rhs;
    lhs[1] /= rhs;
    lhs[2] /= rhs;
    lhs[3] /= rhs;

    return lhs;
};

export const over = (
    lhs: Buffer,
    rhs: number,
    out: Buffer = new Buffer(VectorBufferLength)
) : Buffer => {
    out[0] = lhs[0] / rhs;
    out[1] = lhs[1] / rhs;
    out[2] = lhs[2] / rhs;
    out[3] = lhs[3] / rhs;

    return out;
};

export const mul = (
    lhs: Buffer,
    rhs: number
) : Buffer => {
    lhs[0] *= rhs;
    lhs[1] *= rhs;
    lhs[2] *= rhs;
    lhs[3] *= rhs;

    return lhs;
};

export const times = (
    lhs: Buffer,
    rhs: number,
    out: Buffer = new Buffer(VectorBufferLength)
) : Buffer => {
    out[0] = lhs[0] * rhs;
    out[1] = lhs[1] * rhs;
    out[2] = lhs[2] * rhs;
    out[3] = lhs[3] * rhs;

    return out;
};

export const dot = (
    lhs: Buffer,
    rhs: Buffer
    ) : number =>
    lhs[0]*rhs[0] +
    lhs[1]*rhs[1] +
    lhs[2]*rhs[2]
;

export const cross = (
    lhs: Buffer,
    rhs: Buffer,
    out: Buffer = new Buffer(VectorBufferLength)
) : Buffer => {
    out[0] = lhs[1]*rhs[2] - lhs[2]*rhs[1];
    out[1] = lhs[2]*rhs[0] - lhs[0]*rhs[2];
    out[2] = lhs[0]*rhs[1] - lhs[1]*rhs[0];

    return out;
};

export const vecMatMul = (
    lhs: Buffer,
    rhs: Buffer,
    out: Buffer = new Buffer(MatrixBufferLength)
) : Buffer => {
    if (Object.is(out, lhs) || Object.is(out, rhs)) {
        const x = lhs[0] * rhs[0] + lhs[1] * rhs[4] + lhs[2] * rhs[8] + lhs[3] * rhs[12];
        const y = lhs[0] * rhs[1] + lhs[1] * rhs[5] + lhs[2] * rhs[9] + lhs[3] * rhs[13];
        const z = lhs[0] * rhs[2] + lhs[1] * rhs[6] + lhs[2] * rhs[10] + lhs[3] * rhs[14];
        const w = lhs[0] * rhs[3] + lhs[1] * rhs[7] + lhs[2] * rhs[11] + lhs[3] * rhs[15];
        out[0] = x;
        out[1] = y;
        out[2] = z;
        out[3] = w;
    } else {
        out[0] = lhs[0] * rhs[0] + lhs[1] * rhs[4] + lhs[2] * rhs[8] + lhs[3] * rhs[12];
        out[1] = lhs[0] * rhs[1] + lhs[1] * rhs[5] + lhs[2] * rhs[9] + lhs[3] * rhs[13];
        out[2] = lhs[0] * rhs[2] + lhs[1] * rhs[6] + lhs[2] * rhs[10] + lhs[3] * rhs[14];
        out[3] = lhs[0] * rhs[3] + lhs[1] * rhs[7] + lhs[2] * rhs[11] + lhs[3] * rhs[15];
    }

    return out;
};