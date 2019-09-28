import { Buffer, VectorBufferLength } from "./constants.js";
export const identity = (out0, out1, out2) => {
    if (out0 instanceof Buffer)
        out0.fill(0);
    else
        out0 = new Buffer(VectorBufferLength);
    if (out1 instanceof Buffer)
        out1.fill(0);
    else
        out1 = new Buffer(VectorBufferLength);
    if (out2 instanceof Buffer)
        out2.fill(0);
    else
        out2 = new Buffer(VectorBufferLength);
    out0[0] = out1[1] = out2[2] = 1;
    return [
        out0,
        out1,
        out2
    ];
};
export const transpose = (_in0, _in1, _in2, out0 = new Buffer(VectorBufferLength), out1 = new Buffer(VectorBufferLength), out2 = new Buffer(VectorBufferLength)) => {
    if (Object.is(out0, _in0))
        _in0 = Buffer.from(_in0);
    if (Object.is(out1, _in1))
        _in1 = Buffer.from(_in1);
    if (Object.is(out2, _in2))
        _in2 = Buffer.from(_in2);
    out0[0] = _in0[0];
    out0[1] = _in1[0];
    out0[2] = _in2[0];
    out1[0] = _in0[1];
    out1[1] = _in1[1];
    out1[2] = _in2[1];
    out2[0] = _in0[2];
    out2[1] = _in1[2];
    out2[2] = _in2[2];
    return [
        out0,
        out1,
        out2
    ];
};
export const equals = (lhs0, lhs1, lhs2, rhs0, rhs1, rhs2, precision_digits = 3) => {
    if (Object.is(rhs0, lhs0) &&
        Object.is(rhs1, lhs1) &&
        Object.is(rhs2, lhs2))
        return true;
    if (Object.is(rhs0.buffer, lhs0.buffer) &&
        Object.is(rhs1.buffer, lhs1.buffer) &&
        Object.is(rhs2.buffer, lhs2.buffer))
        return true;
    if (lhs0.length !== rhs0.length ||
        lhs1.length !== rhs1.length ||
        lhs2.length !== rhs2.length)
        return false;
    if (lhs0[0].toFixed(precision_digits) !==
        rhs0[0].toFixed(precision_digits))
        return false;
    if (lhs0[1].toFixed(precision_digits) !==
        rhs0[1].toFixed(precision_digits))
        return false;
    if (lhs0[2].toFixed(precision_digits) !==
        rhs0[2].toFixed(precision_digits))
        return false;
    if (lhs1[0].toFixed(precision_digits) !==
        rhs1[0].toFixed(precision_digits))
        return false;
    if (lhs1[1].toFixed(precision_digits) !==
        rhs1[1].toFixed(precision_digits))
        return false;
    if (lhs1[2].toFixed(precision_digits) !==
        rhs1[2].toFixed(precision_digits))
        return false;
    if (lhs2[0].toFixed(precision_digits) !==
        rhs2[0].toFixed(precision_digits))
        return false;
    if (lhs2[1].toFixed(precision_digits) !==
        rhs2[1].toFixed(precision_digits))
        return false;
    return (lhs2[2].toFixed(precision_digits) !==
        rhs2[2].toFixed(precision_digits));
};
export const isIdentity = (m0, m1, m2) => m0[0] === 1 && m0[1] === 0 && m0[2] === 0 &&
    m1[0] === 0 && m1[1] === 1 && m1[2] === 0 &&
    m2[0] === 0 && m2[1] === 0 && m2[2] === 1;
export const matMatMul = (lhs0, lhs1, lhs2, rhs0, rhs1, rhs2, out0, out1, out2) => {
    if (Object.is(out0, lhs0))
        lhs0 = Buffer.from(lhs0);
    if (Object.is(out1, lhs1))
        lhs1 = Buffer.from(lhs1);
    if (Object.is(out2, lhs2))
        lhs2 = Buffer.from(lhs2);
    if (Object.is(out0, rhs0))
        rhs0 = Buffer.from(rhs0);
    if (Object.is(out1, rhs1))
        rhs1 = Buffer.from(rhs1);
    if (Object.is(out2, rhs2))
        rhs2 = Buffer.from(rhs2);
    // Row 1
    out0[0] = lhs0[0] * rhs0[0] + lhs0[1] * rhs1[0] + lhs0[2] * rhs2[0]; // Column 1
    out0[1] = lhs0[0] * rhs0[1] + lhs0[1] * rhs1[1] + lhs0[2] * rhs2[1]; // Column 2
    out0[2] = lhs0[0] * rhs0[2] + lhs0[1] * rhs1[2] + lhs0[2] * rhs2[2]; // Column 3
    // Row 2
    out1[0] = lhs1[0] * rhs0[0] + lhs1[1] * rhs1[0] + lhs1[2] * rhs2[0]; // Column 1
    out1[1] = lhs1[0] * rhs0[1] + lhs1[1] * rhs1[1] + lhs1[2] * rhs2[1]; // Column 2
    out1[2] = lhs1[0] * rhs0[2] + lhs1[1] * rhs1[2] + lhs1[2] * rhs2[2]; // Column 3
    // Row 3
    out2[0] = lhs2[0] * rhs0[0] + lhs2[1] * rhs1[0] + lhs2[2] * rhs2[0]; // Column 1
    out2[1] = lhs2[0] * rhs0[1] + lhs2[1] * rhs1[1] + lhs2[2] * rhs2[1]; // Column 2
    out2[2] = lhs2[0] * rhs0[2] + lhs2[1] * rhs1[2] + lhs2[2] * rhs2[2]; // Column 3
    return [
        out0,
        out1,
        out2
    ];
};
let sin, cos;
function setSinCos(angle) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
}
export const rotationAroundX = (angle, reset = true, out0 = new Buffer(VectorBufferLength), out1 = new Buffer(VectorBufferLength), out2 = new Buffer(VectorBufferLength)) => {
    setSinCos(angle);
    if (reset)
        identity(out0, out1, out2);
    out1[1] = out2[2] = cos;
    out1[2] = sin;
    out2[1] = -sin;
    return [
        out0,
        out1,
        out2
    ];
};
export const rotationAroundY = (angle, reset = true, out0 = new Buffer(VectorBufferLength), out1 = new Buffer(VectorBufferLength), out2 = new Buffer(VectorBufferLength)) => {
    setSinCos(angle);
    if (reset)
        identity(out0, out1, out2);
    out0[0] = out2[2] = cos;
    out0[2] = sin;
    out2[0] = -sin;
    return [
        out0,
        out1,
        out2
    ];
};
export const rotationAroundZ = (angle, reset = true, out0 = new Buffer(VectorBufferLength), out1 = new Buffer(VectorBufferLength), out2 = new Buffer(VectorBufferLength)) => {
    setSinCos(angle);
    if (reset)
        identity(out0, out1, out2);
    out0[0] = out1[1] = cos;
    out0[1] = sin;
    out1[0] = -sin;
    return [
        out0,
        out1,
        out2
    ];
};
//# sourceMappingURL=matrix.js.map