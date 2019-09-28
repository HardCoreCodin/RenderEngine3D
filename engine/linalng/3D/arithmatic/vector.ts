import {Buffer, VectorBufferLength} from "./constants.js";

export const equals = (
    lhs: Buffer,
    rhs: Buffer,
    precision_digits: number = 3
) : boolean => {
    if (Object.is(lhs, rhs)) return true;
    if (Object.is(lhs.buffer, rhs.buffer)) return true;
    if (lhs.length !== rhs.length) return false;

    if (lhs[0].toFixed(precision_digits) !== rhs[0].toFixed(precision_digits)) return false;
    if (lhs[1].toFixed(precision_digits) !== rhs[1].toFixed(precision_digits)) return false;
    return lhs[2].toFixed(precision_digits) === rhs[2].toFixed(precision_digits);
};


export const add = (
    lhs: Buffer,
    rhs: Buffer
) : Buffer => {
    lhs[0] += rhs[0];
    lhs[1] += rhs[1];
    lhs[2] += rhs[2];

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

    return out;
};

export const sub = (
    lhs: Buffer,
    rhs: Buffer
) : Buffer => {
    lhs[0] -= rhs[0];
    lhs[1] -= rhs[1];
    lhs[2] -= rhs[2];

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

    return out;
};

export const div = (
    lhs: Buffer,
    rhs: number
) : Buffer => {
    lhs[0] /= rhs;
    lhs[1] /= rhs;
    lhs[2] /= rhs;

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

    return out;
};

export const mul = (
    lhs: Buffer,
    rhs: number
) : Buffer => {
    lhs[0] *= rhs;
    lhs[1] *= rhs;
    lhs[2] *= rhs;

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
    if (Object.is(out, lhs)) lhs = Buffer.from(lhs);
    if (Object.is(out, rhs)) rhs = Buffer.from(rhs);

    out[0] = lhs[1]*rhs[2] - lhs[2]*rhs[1];
    out[1] = lhs[2]*rhs[0] - lhs[0]*rhs[2];
    out[2] = lhs[0]*rhs[1] - lhs[1]*rhs[0];

    return out;
};

export const lerp = (
    from: Buffer,
    to: Buffer,
    by: number,
    out: Buffer = new Buffer(VectorBufferLength)
) : Buffer => {
    out[0] = from[0] + by*(to[0] - from[0]);
    out[1] = from[1] + by*(to[1] - from[1]);
    out[2] = from[2] + by*(to[2] - from[2]);

    return out;
};

export const vecMatMul = (
    lhs: Buffer,
    rhs0: Buffer, rhs1: Buffer, rhs2: Buffer,
    out: Buffer = new Buffer(VectorBufferLength)
) : Buffer => {
    if (Object.is(out, lhs)) lhs = Buffer.from(lhs);
    if (Object.is(out, rhs0)) rhs0 = Buffer.from(rhs0);
    if (Object.is(out, rhs1)) rhs1 = Buffer.from(rhs1);
    if (Object.is(out, rhs2)) rhs2 = Buffer.from(rhs2);

    out[0] = lhs[0]*rhs0[0] + lhs[1]*rhs1[0] + lhs[2]*rhs2[0];
    out[1] = lhs[0]*rhs0[1] + lhs[1]*rhs1[1] + lhs[2]*rhs2[1];
    out[2] = lhs[0]*rhs0[2] + lhs[1]*rhs1[2] + lhs[2]*rhs2[2];

    return out;
};