import { Buffer, VectorBufferLength } from "./constants.js";
export const equals = (lhs, rhs, precision_digits = 3) => {
    if (Object.is(lhs, rhs))
        return true;
    if (Object.is(lhs.buffer, rhs.buffer))
        return true;
    if (lhs.length !== rhs.length)
        return false;
    if (lhs[0].toFixed(precision_digits) !== rhs[0].toFixed(precision_digits))
        return false;
    if (lhs[1].toFixed(precision_digits) !== rhs[1].toFixed(precision_digits))
        return false;
    if (lhs[2].toFixed(precision_digits) !== rhs[2].toFixed(precision_digits))
        return false;
    return lhs[3].toFixed(precision_digits) === rhs[3].toFixed(precision_digits);
};
export const add = (lhs, rhs) => {
    lhs[0] += rhs[0];
    lhs[1] += rhs[1];
    lhs[2] += rhs[2];
    lhs[3] += rhs[3];
    return lhs;
};
export const plus = (lhs, rhs, out = new Buffer(VectorBufferLength)) => {
    out[0] = lhs[0] + rhs[0];
    out[1] = lhs[1] + rhs[1];
    out[2] = lhs[2] + rhs[2];
    out[3] = lhs[3] + rhs[3];
    return out;
};
export const sub = (lhs, rhs) => {
    lhs[0] -= rhs[0];
    lhs[1] -= rhs[1];
    lhs[2] -= rhs[2];
    lhs[3] -= rhs[3];
    return lhs;
};
export const minus = (lhs, rhs, out = new Buffer(VectorBufferLength)) => {
    out[0] = lhs[0] - rhs[0];
    out[1] = lhs[1] - rhs[1];
    out[2] = lhs[2] - rhs[2];
    out[3] = lhs[3] - rhs[3];
    return out;
};
export const div = (lhs, rhs) => {
    lhs[0] /= rhs;
    lhs[1] /= rhs;
    lhs[2] /= rhs;
    lhs[3] /= rhs;
    return lhs;
};
export const over = (lhs, rhs, out = new Buffer(VectorBufferLength)) => {
    out[0] = lhs[0] / rhs;
    out[1] = lhs[1] / rhs;
    out[2] = lhs[2] / rhs;
    out[3] = lhs[3] / rhs;
    return out;
};
export const mul = (lhs, rhs) => {
    lhs[0] *= rhs;
    lhs[1] *= rhs;
    lhs[2] *= rhs;
    lhs[3] *= rhs;
    return lhs;
};
export const times = (lhs, rhs, out = new Buffer(VectorBufferLength)) => {
    out[0] = lhs[0] * rhs;
    out[1] = lhs[1] * rhs;
    out[2] = lhs[2] * rhs;
    out[3] = lhs[3] * rhs;
    return out;
};
export const vecMatMul = (lhs, rhs, out = new Buffer(VectorBufferLength)) => {
    if (Object.is(out, lhs))
        lhs = Buffer.from(lhs);
    if (Object.is(out, rhs))
        rhs = Buffer.from(rhs);
    out[0] = lhs[0] * rhs[0] + lhs[1] * rhs[4] + lhs[2] * rhs[8] + lhs[3] * rhs[12];
    out[1] = lhs[0] * rhs[1] + lhs[1] * rhs[5] + lhs[2] * rhs[9] + lhs[3] * rhs[13];
    out[2] = lhs[0] * rhs[2] + lhs[1] * rhs[6] + lhs[2] * rhs[10] + lhs[3] * rhs[14];
    out[3] = lhs[0] * rhs[3] + lhs[1] * rhs[7] + lhs[2] * rhs[11] + lhs[3] * rhs[15];
    return out;
};
//# sourceMappingURL=vector.js.map