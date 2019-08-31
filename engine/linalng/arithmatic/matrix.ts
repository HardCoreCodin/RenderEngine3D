import {Buffer, MatrixBufferLength, VectorBufferLength} from "./types.js";

export const identity = (out?: Buffer) : Buffer => {
    if (out instanceof Buffer)
        out.fill(0);
    else
        out = new Buffer(MatrixBufferLength);

    out[0] = out[5] = out[10] = out[15] = 1;

    return out;
};

export const inverse = (
    _in: Buffer,
    out: Buffer = new Buffer(MatrixBufferLength)
) : Buffer => {
    if (Object.is(out, _in)) _in = Buffer.from(_in);

    out[0] = _in[0];
    out[1] = _in[4];
    out[2] = _in[8];
    out[3] = _in[3];

    out[4] = _in[1];
    out[5] = _in[5];
    out[6] = _in[9];
    out[7] = _in[7];

    out[8] = _in[2];
    out[9] = _in[6];
    out[10] = _in[10];
    out[11] = _in[11];

    out[12] = -(
        _in[12] * _in[0] +
        _in[13] * _in[1] +
        _in[14] * _in[2]
    );
    out[13] = -(
        _in[12] * _in[4] +
        _in[13] * _in[5] +
        _in[14] * _in[6]
    );
    out[14] = -(
        _in[12] * _in[8] +
        _in[13] * _in[9] +
        _in[14] * _in[10]
    );
    out[15] = 1;

    return out;
};

export const transpose = (
    _in: Buffer,
    out: Buffer = new Buffer(MatrixBufferLength)
) : Buffer => {
    [
        out[0], out[1], out[2], out[3],
        out[4], out[5], out[6], out[7],
        out[8], out[9], out[10], out[11],
        out[12], out[13], out[14], out[15],
    ] = [
        _in[0], _in[4], _in[8], _in[12],
        _in[1], _in[5], _in[9], _in[13],
        _in[2], _in[6], _in[10], _in[14],
        _in[3], _in[7], _in[11], _in[15],
    ];
    return out;
};

export const equals = (
    lhs: Buffer,
    rhs: Buffer,
    precision_digits: number = 3
) : boolean => {
    if (Object.is(lhs, rhs)) return true;
    if (Object.is(lhs.buffer, rhs.buffer)) return true;
    if (lhs.length !== rhs.length) return false;

    for (let i = 0; i < MatrixBufferLength; i++)
        if (lhs[i].toFixed(precision_digits) !== rhs[i].toFixed(precision_digits))
            return false;

    return true;
};

// export const toColumnMajor = (
//     _in: Buffer,
//     out: Buffer = new Buffer(MatrixBufferLength)
// ) : Buffer => {
//     [
//         out[0], out[1], out[2], out[3],
//         out[4], out[5], out[6], out[7],
//         out[8], out[9], out[10], out[11],
//         out[12], out[13], out[14], out[15],
//     ] = [
//         _in[15], _in[11], _in[7], _in[3],
//         _in[14], _in[10], _in[6], _in[2],
//         _in[13], _in[9], _in[5], _in[1],
//         _in[12], _in[8], _in[4], _in[0],
//     ];
//     return out;
// };

export const isIdentity = (m: Buffer) =>
    m[0] === 1 &&
    m[5] === 1 &&
    m[10] === 1 &&
    m[15] === 1 &&

    m[1] === 0 &&
    m[2] === 0 &&
    m[3] === 0 &&
    m[4] === 0 &&

    m[6] === 0 &&
    m[7] === 0 &&
    m[8] === 0 &&
    m[9] === 0 &&

    m[11] === 0 &&
    m[12] === 0 &&
    m[13] === 0 &&
    m[14] === 0
;

export const matMatMul = (
    lhs: Buffer,
    rhs: Buffer,
    out = new Buffer(MatrixBufferLength)
) => {
    if (Object.is(out, lhs)) lhs = Buffer.from(lhs);
    if (Object.is(out, rhs)) rhs = Buffer.from(rhs);

    // Row 1
    out[0] = lhs[0] * rhs[0]   +   lhs[1] * rhs[4]   +   lhs[2] * rhs[8]   +   lhs[3] * rhs[12];    // Column 1
    out[1] = lhs[0] * rhs[1]   +   lhs[1] * rhs[5]   +   lhs[2] * rhs[9]   +   lhs[3] * rhs[13];    // Column 2
    out[2] = lhs[0] * rhs[2]   +   lhs[1] * rhs[6]   +   lhs[2] * rhs[10]   +   lhs[3] * rhs[14];    // Column 3
    out[3] = lhs[0] * rhs[3]   +   lhs[1] * rhs[7]   +   lhs[2] * rhs[11]   +   lhs[3] * rhs[15];    // Column 4

    // Row 2
    out[4] = lhs[4] * rhs[0]   +   lhs[5] * rhs[4]   +   lhs[6] * rhs[8]   +   lhs[7] * rhs[12];    // Column 1
    out[5] = lhs[4] * rhs[1]   +   lhs[5] * rhs[5]   +   lhs[6] * rhs[9]   +   lhs[7] * rhs[13];    // Column 2
    out[6] = lhs[4] * rhs[2]   +   lhs[5] * rhs[6]   +   lhs[6] * rhs[10]   +   lhs[7] * rhs[14];    // Column 3
    out[7] = lhs[4] * rhs[3]   +   lhs[5] * rhs[7]   +   lhs[6] * rhs[11]   +   lhs[7] * rhs[15];    // Column 4

    // Row 3
    out[8] = lhs[8] * rhs[0]   +   lhs[9] * rhs[4]   +   lhs[10] * rhs[8]   +   lhs[11] * rhs[12];    // Column 1
    out[9] = lhs[8] * rhs[1]   +   lhs[9] * rhs[5]   +   lhs[10] * rhs[9]   +   lhs[11] * rhs[13];    // Column 2
    out[10] = lhs[8] * rhs[2]   +   lhs[9] * rhs[6]   +   lhs[10] * rhs[10]   +   lhs[11] * rhs[14];    // Column 3
    out[11] = lhs[8] * rhs[3]   +   lhs[9] * rhs[7]   +   lhs[10] * rhs[11]   +   lhs[11] * rhs[15];    // Column 4

    // Row 4
    out[12] = lhs[12] * rhs[0]   +   lhs[13] * rhs[4]   +   lhs[14] * rhs[8]   +   lhs[15] * rhs[12];    // Column 1
    out[13] = lhs[12] * rhs[1]   +   lhs[13] * rhs[5]   +   lhs[14] * rhs[9]   +   lhs[15] * rhs[13];    // Column 2
    out[14] = lhs[12] * rhs[2]   +   lhs[13] * rhs[6]   +   lhs[14] * rhs[10]   +   lhs[15] * rhs[14];    // Column 3
    out[15] = lhs[12] * rhs[3]   +   lhs[13] * rhs[7]   +   lhs[14] * rhs[11]   +   lhs[15] * rhs[15];    // Column 4

    return out;
};

export const translation = (
    x?: number | Buffer,
    y: number = 0,
    z: number = 0,
    reset = false,
    out = new Buffer(MatrixBufferLength)
) : Buffer => {
    if (x === undefined)
        return identity(out);

    if (x instanceof Buffer && x.length === VectorBufferLength) {
        if (reset)
            identity(out);

        out.set(x, 12);

        out[15] = 1;

        return out;
    } else if (typeof x === 'number') {
        if (reset)
            identity(out);

        out[12] = x;

        if (typeof y === 'number') out[13] = y;
        if (typeof z === 'number') out[14] = z;

        out[15] = 1;

        return out;
    }

    throw `Invalid arguments! ${x}, ${y}, ${z}!`
};

let sin, cos;
function setSinCos(angle: number) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
}

export const rotationAroundX = (
    angle: number,
    reset = true,
    out = new Buffer(MatrixBufferLength)
) : Buffer => {
    setSinCos(angle);
    if (reset) identity(out);

    out[5] = out[10] = cos;
    out[6] = sin;
    out[9] = -sin;

    return out;
};

export const rotationAroundY = (
    angle: number,
    reset = true,
    out = new Buffer(MatrixBufferLength)
) : Buffer => {
    setSinCos(angle);
    if (reset) identity(out);

    out[0] = out[10] = cos;
    out[2] = sin;
    out[8] = -sin;

    return out;
};

export const rotationAroundZ = (
    angle: number,
    reset = true,
    out = new Buffer(MatrixBufferLength)
) : Buffer => {
    setSinCos(angle);
    if (reset) identity(out);

    out[0] = out[5] = cos;
    out[1] = sin;
    out[4] = -sin;

    return out;
};

export const projection = (
    aspect: number = 1,
    fov: number = 90,
    near: number = 0.1,
    far: number = 1000,
    out = new Buffer(MatrixBufferLength)
) : Buffer => {
    out.fill(0);

    out[0] = out[5] = 1.0 / Math.tan(fov * 0.5 / 180 * Math.PI);
    out[0] *= aspect;

    out[10] = out[14] = 1.0 / (far - near);
    out[10] *= far;

    out[14] *= -far * near;

    out[11] = 1;

    return out;
};