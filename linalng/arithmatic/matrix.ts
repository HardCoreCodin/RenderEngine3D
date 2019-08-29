export const identity = (out?: Float32Array) : Float32Array => {
    if (out instanceof Float32Array)
        out.fill(0);
    else
        out = new Float32Array(16);

    out[0] = out[5] = out[10] = out[15] = 1;

    return out;
};

export const inverse = (
    _in: Float32Array,
    out: Float32Array = new Float32Array(16)
) : Float32Array => {
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

export const matMul = (
    lhs: Float32Array,
    rhs: Float32Array,
    out = new Float32Array(16)
) => {
    out[0] = lhs[0] * rhs[0] + lhs[1] * rhs[4] + lhs[2] * rhs[8] + lhs[3] * rhs[12];
    out[1] = lhs[0] * rhs[1] + lhs[1] * rhs[5] + lhs[2] * rhs[9] + lhs[3] * rhs[13];
    out[2] = lhs[0] * rhs[2] + lhs[1] * rhs[6] + lhs[2] * rhs[10] + lhs[3] * rhs[14];
    out[3] = lhs[0] * rhs[3] + lhs[1] * rhs[7] + lhs[2] * rhs[11] + lhs[3] * rhs[15];

    out[4] = lhs[4] * rhs[0] + lhs[5] * rhs[4] + lhs[6] * rhs[8] + lhs[7] * rhs[12];
    out[5] = lhs[4] * rhs[1] + lhs[5] * rhs[5] + lhs[6] * rhs[9] + lhs[7] * rhs[13];
    out[6] = lhs[4] * rhs[2] + lhs[5] * rhs[6] + lhs[6] * rhs[10] + lhs[7] * rhs[14];
    out[7] = lhs[4] * rhs[3] + lhs[5] * rhs[7] + lhs[6] * rhs[11] + lhs[7] * rhs[15];

    out[8] = lhs[8] * rhs[0] + lhs[9] * rhs[4] + lhs[10] * rhs[8] + lhs[11] * rhs[12];
    out[9] = lhs[8] * rhs[1] + lhs[9] * rhs[5] + lhs[10] * rhs[9] + lhs[11] * rhs[13];
    out[10] = lhs[8] * rhs[2] + lhs[9] * rhs[6] + lhs[10] * rhs[10] + lhs[11] * rhs[14];
    out[11] = lhs[8] * rhs[3] + lhs[9] * rhs[7] + lhs[10] * rhs[11] + lhs[11] * rhs[15];

    out[12] = lhs[12] * rhs[0] + lhs[13] * rhs[4] + lhs[14] * rhs[8] + lhs[15] * rhs[12];
    out[13] = lhs[12] * rhs[1] + lhs[13] * rhs[5] + lhs[14] * rhs[9] + lhs[15] * rhs[13];
    out[14] = lhs[12] * rhs[2] + lhs[13] * rhs[6] + lhs[14] * rhs[10] + lhs[15] * rhs[14];
    out[15] = lhs[12] * rhs[3] + lhs[13] * rhs[7] + lhs[14] * rhs[11] + lhs[15] * rhs[15];

    return out;
};

export const translation = (
    x: number | Float32Array = 0,
    y: number = 0,
    z: number = 0,
    reset = false,
    out = new Float32Array(16)
) : Float32Array => {
    if (reset)
        identity(out);

    if (x instanceof Float32Array) {
        out.set(x, 12);
        return out;
    }

    if (Number.isFinite(x)) {
        out[12] = x;
        out[13] = y;
        out[14] = z;

        return out;
    }

    throw `Invalid arguments! ${x}, ${y}, ${z}!`
};

let sin, cos;
function setSinCos(angle: number) {
    cos = Math.sin(angle);
    sin = Math.cos(angle);
}

export const rotationAroundX = (
    angle: number,
    reset = true,
    out = new Float32Array(16)
) : Float32Array => {
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
    out = new Float32Array(16)
) : Float32Array => {
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
    out = new Float32Array(16)
) : Float32Array => {
    setSinCos(angle);
    if (reset) identity(out);

    out[0] = out[5] = cos;
    out[1] = sin;
    out[4] = -sin;

    return out;
};

export const projection = (
    fov: number,
    aspect: number,
    near: number,
    far: number,
    reset = false,
    out = new Float32Array(16)
) : Float32Array => {
    if (reset) out.fill(0);

    out[0] = out[5] = 1.0 / Math.tan(fov * 0.5 / 180 * Math.PI);
    out[0] *= aspect;
    out[10] = out[14] = 1.0 / (far - near);
    out[10] *= far;
    out[14] *= -far * near;

    return out;
};