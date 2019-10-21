import {PRECISION_DIGITS} from "../constants";
import {Matrix} from "./base";
import {Direction4D} from "./vec4.js";
import {
    FloatArrays,
    ff_b,
    lr_v,
    f_v,
    nbf_v,
    fff_v,
    f_b,
    ff_v
} from "../types.js";
import Position4D from "../linalng/4D/position";

const temp_matrix = new FloatArrays(16);
let sin, cos;
function setSinCos(angle: number) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
}

export const set_to_identity : f_v = (
    lhs: FloatArrays,
    lhs_offset: number = 0
) : void => {
    lhs.fill(0, lhs_offset, lhs_offset+16);
    lhs[lhs_offset] = lhs[lhs_offset+5] = lhs[lhs_offset+10] =  lhs[lhs_offset+15] = 1;
};

export const inverse : ff_v = (
    out: FloatArrays,
    lhs: FloatArrays,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    if (out_offset === lhs_offset && (
        Object.is(out, lhs) ||
        Object.is(out.buffer, lhs.buffer)
    )) throw `Can not inverse - shared buffer detected! (Use inverse_in_place)`;

    out[out_offset  ] = lhs[lhs_offset  ];
    out[out_offset+1] = lhs[lhs_offset+4];
    out[out_offset+2] = lhs[lhs_offset+8];
    out[out_offset+3] = lhs[lhs_offset+3];

    out[out_offset+4] = lhs[lhs_offset+1];
    out[out_offset+5] = lhs[lhs_offset+5];
    out[out_offset+6] = lhs[lhs_offset+9];
    out[out_offset+7] = lhs[lhs_offset+7];

    out[out_offset+8] = lhs[lhs_offset+2];
    out[out_offset+9] = lhs[lhs_offset+6];
    out[out_offset+10] = lhs[lhs_offset+10];
    out[out_offset+11] = lhs[lhs_offset+11];

    out[out_offset+12] = -(
        lhs[lhs_offset+12] * lhs[lhs_offset  ] +
        lhs[lhs_offset+13] * lhs[lhs_offset+1] +
        lhs[lhs_offset+14] * lhs[lhs_offset+2]
    );
    out[out_offset+13] = -(
        lhs[lhs_offset+12] * lhs[lhs_offset+4] +
        lhs[lhs_offset+13] * lhs[lhs_offset+5] +
        lhs[lhs_offset+14] * lhs[lhs_offset+6]
    );
    out[out_offset+14] = -(
        lhs[lhs_offset+12] * lhs[lhs_offset+8] +
        lhs[lhs_offset+13] * lhs[lhs_offset+9] +
        lhs[lhs_offset+14] * lhs[lhs_offset+10]
    );
    out[out_offset+15] = 1;
};

export const inverse_in_place : f_v = (
    lhs: FloatArrays,
    lhs_offset: number = 0
) : void => {
    temp_matrix.set(lhs, lhs_offset);

    lhs[lhs_offset  ] = temp_matrix[0];
    lhs[lhs_offset+1] = temp_matrix[4];
    lhs[lhs_offset+2] = temp_matrix[8];
    lhs[lhs_offset+3] = temp_matrix[3];

    lhs[lhs_offset+4] = temp_matrix[1];
    lhs[lhs_offset+5] = temp_matrix[5];
    lhs[lhs_offset+6] = temp_matrix[9];
    lhs[lhs_offset+7] = temp_matrix[7];

    lhs[lhs_offset+8] = temp_matrix[2];
    lhs[lhs_offset+9] = temp_matrix[6];
    lhs[lhs_offset+10] = temp_matrix[10];
    lhs[lhs_offset+11] = temp_matrix[11];

    lhs[lhs_offset+12] = -(
        temp_matrix[12] * temp_matrix[0] +
        temp_matrix[13] * temp_matrix[1] +
        temp_matrix[14] * temp_matrix[2]
    );
    lhs[lhs_offset+13] = -(
        temp_matrix[12] * temp_matrix[4] +
        temp_matrix[13] * temp_matrix[5] +
        temp_matrix[14] * temp_matrix[6]
    );
    lhs[lhs_offset+14] = -(
        temp_matrix[12] * temp_matrix[8] +
        temp_matrix[13] * temp_matrix[9] +
        temp_matrix[14] * temp_matrix[10]
    );
    lhs[lhs_offset+15] = 1;
};

export const transpose : ff_v = (
    out: FloatArrays,
    lhs: FloatArrays,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    if (out_offset === lhs_offset && (
        Object.is(out, lhs) ||
        Object.is(out.buffer, lhs.buffer)
    )) throw `Can not transpose - shared buffer detected! (Use transpose_in_place)`;

    out[out_offset  ] = lhs[lhs_offset  ];
    out[out_offset+1] = lhs[lhs_offset+4];
    out[out_offset+2] = lhs[lhs_offset+8];
    out[out_offset+3] = lhs[lhs_offset+12];

    out[out_offset+4] = lhs[lhs_offset+1];
    out[out_offset+5] = lhs[lhs_offset+5];
    out[out_offset+6] = lhs[lhs_offset+9];
    out[out_offset+7] = lhs[lhs_offset+13];

    out[out_offset+8] = lhs[lhs_offset+2];
    out[out_offset+9] = lhs[lhs_offset+6];
    out[out_offset+10] = lhs[lhs_offset+10];
    out[out_offset+11] = lhs[lhs_offset+14];

    out[out_offset+12] = lhs[lhs_offset+3];
    out[out_offset+13] = lhs[lhs_offset+7];
    out[out_offset+14] = lhs[lhs_offset+11];
    out[out_offset+15] = lhs[lhs_offset+15];
};

export const transpose_in_place : f_v = (
    lhs: FloatArrays,
    lhs_offset: number = 0
) : void => {
    temp_matrix.set(lhs, lhs_offset);

    lhs[lhs_offset  ] = temp_matrix[0];
    lhs[lhs_offset+1] = temp_matrix[4];
    lhs[lhs_offset+2] = temp_matrix[8];
    lhs[lhs_offset+3] = temp_matrix[12];

    lhs[lhs_offset+4] = temp_matrix[1];
    lhs[lhs_offset+5] = temp_matrix[5];
    lhs[lhs_offset+6] = temp_matrix[9];
    lhs[lhs_offset+7] = temp_matrix[13];

    lhs[lhs_offset+8] = temp_matrix[2];
    lhs[lhs_offset+9] = temp_matrix[6];
    lhs[lhs_offset+10] = temp_matrix[10];
    lhs[lhs_offset+11] = temp_matrix[14];

    lhs[lhs_offset+12] = temp_matrix[3];
    lhs[lhs_offset+13] = temp_matrix[7];
    lhs[lhs_offset+14] = temp_matrix[11];
    lhs[lhs_offset+15] = temp_matrix[15];
};

export const equals : ff_b = (
    lhs: FloatArrays,
    rhs: FloatArrays,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : boolean => {
    if (Object.is(lhs, rhs) && lhs_offset === rhs_offset) return true;
    if (Object.is(lhs.buffer, rhs.buffer) && lhs_offset === rhs_offset) return true;
    if (lhs.length !== rhs.length) return false;

    if (lhs[lhs_offset  ].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset  ].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+1].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+1].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+2].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+2].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+3].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+3].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+4].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+4].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+5].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+5].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+6].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+6].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+7].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+7].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+8].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+8].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+9].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+9].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+10].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+10].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+11].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+11].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+12].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+12].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+13].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+13].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+14].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+14].toFixed(PRECISION_DIGITS)) return false;
    if (lhs[lhs_offset+15].toFixed(PRECISION_DIGITS) !== rhs[rhs_offset+15].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const is_identity : f_b = (
    lhs: FloatArrays,
    lhs_offset: number = 0
) : boolean =>
    lhs[lhs_offset  ] === 1 &&
    lhs[lhs_offset+1] === 0 &&
    lhs[lhs_offset+2] === 0 &&
    lhs[lhs_offset+3] === 0 &&
    lhs[lhs_offset+4] === 0 &&
    lhs[lhs_offset+5] === 1 &&
    lhs[lhs_offset+6] === 0 &&
    lhs[lhs_offset+7] === 0 &&
    lhs[lhs_offset+8] === 0 &&
    lhs[lhs_offset+9] === 0 &&
    lhs[lhs_offset+10] === 1 &&
    lhs[lhs_offset+11] === 0 &&
    lhs[lhs_offset+12] === 0 &&
    lhs[lhs_offset+13] === 0 &&
    lhs[lhs_offset+14] === 0 &&
    lhs[lhs_offset+15] === 1;

export const multiply : fff_v = (
    out: FloatArrays,
    lhs: FloatArrays,
    rhs: FloatArrays,

    out_offset: number = 0,
    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    if (
        (
            out_offset === lhs_offset && (
                Object.is(out, lhs) ||
                Object.is(out.buffer, lhs.buffer)
            )
        ) || (
            out_offset === rhs_offset && (
                Object.is(out, rhs) ||
                Object.is(out.buffer, rhs.buffer)
            )
        )
    ) throw `Can not multiply - shared buffer detected! (Use multiply_in_place)`;

    // Row 1
    out[out_offset  ] = // Column 1
        lhs[lhs_offset  ] * rhs[rhs_offset  ] +
        lhs[lhs_offset+1] * rhs[rhs_offset+4] +
        lhs[lhs_offset+2] * rhs[rhs_offset+8] +
        lhs[lhs_offset+3] * rhs[rhs_offset+12];
    out[out_offset+1] = // Column 2
        lhs[lhs_offset  ] * rhs[rhs_offset+1] +
        lhs[lhs_offset+1] * rhs[rhs_offset+5] +
        lhs[lhs_offset+2] * rhs[rhs_offset+9] +
        lhs[lhs_offset+3] * rhs[rhs_offset+13];
    out[out_offset+2] = // Column 3
        lhs[lhs_offset  ] * rhs[rhs_offset+2] +
        lhs[lhs_offset+1] * rhs[rhs_offset+6] +
        lhs[lhs_offset+2] * rhs[rhs_offset+10] +
        lhs[lhs_offset+3] * rhs[rhs_offset+14];
    out[out_offset+3] = // Column 4
        lhs[lhs_offset  ] * rhs[rhs_offset+3] +
        lhs[lhs_offset+1] * rhs[rhs_offset+7] +
        lhs[lhs_offset+2] * rhs[rhs_offset+11] +
        lhs[lhs_offset+3] * rhs[rhs_offset+15];

    // Row 2
    out[out_offset+4] = // Column 1
        lhs[lhs_offset+4] * rhs[rhs_offset  ] +
        lhs[lhs_offset+5] * rhs[rhs_offset+4] +
        lhs[lhs_offset+6] * rhs[rhs_offset+8] +
        lhs[lhs_offset+7] * rhs[rhs_offset+12];
    out[out_offset+5] = // Column 2
        lhs[lhs_offset+4] * rhs[rhs_offset+1] +
        lhs[lhs_offset+5] * rhs[rhs_offset+5] +
        lhs[lhs_offset+6] * rhs[rhs_offset+9] +
        lhs[lhs_offset+7] * rhs[rhs_offset+13];
    out[out_offset+6] = // Column 3
        lhs[lhs_offset+4] * rhs[rhs_offset+2] +
        lhs[lhs_offset+5] * rhs[rhs_offset+6] +
        lhs[lhs_offset+6] * rhs[rhs_offset+10] +
        lhs[lhs_offset+7] * rhs[rhs_offset+14];
    out[out_offset+7] = // Column 4
        lhs[lhs_offset+4] * rhs[rhs_offset+3] +
        lhs[lhs_offset+5] * rhs[rhs_offset+7] +
        lhs[lhs_offset+6] * rhs[rhs_offset+11] +
        lhs[lhs_offset+7] * rhs[rhs_offset+15];

    // Row 3
    out[out_offset+8] = // Column 1
        lhs[lhs_offset+8] * rhs[rhs_offset  ] +
        lhs[lhs_offset+9] * rhs[rhs_offset+4] +
        lhs[lhs_offset+10] * rhs[rhs_offset+8] +
        lhs[lhs_offset+11] * rhs[rhs_offset+12];
    out[out_offset+9] = // Column 2
        lhs[lhs_offset+8] * rhs[rhs_offset+1] +
        lhs[lhs_offset+9] * rhs[rhs_offset+5] +
        lhs[lhs_offset+10] * rhs[rhs_offset+9] +
        lhs[lhs_offset+11] * rhs[rhs_offset+13];
    out[out_offset+10] = // Column 3
        lhs[lhs_offset+8] * rhs[rhs_offset+2] +
        lhs[lhs_offset+9] * rhs[rhs_offset+6] +
        lhs[lhs_offset+10] * rhs[rhs_offset+10] +
        lhs[lhs_offset+11] * rhs[rhs_offset+14];
    out[out_offset+11] = // Column 4
        lhs[lhs_offset+8] * rhs[rhs_offset+3] +
        lhs[lhs_offset+9] * rhs[rhs_offset+7] +
        lhs[lhs_offset+10] * rhs[rhs_offset+11] +
        lhs[lhs_offset+11] * rhs[rhs_offset+15];

    // Row 4
    out[out_offset+12] = // Column 1
        lhs[lhs_offset+12] * rhs[rhs_offset  ] +
        lhs[lhs_offset+13] * rhs[rhs_offset+4] +
        lhs[lhs_offset+14] * rhs[rhs_offset+8] +
        lhs[lhs_offset+15] * rhs[rhs_offset+12];
    out[out_offset+13] = // Column 2
        lhs[lhs_offset+12] * rhs[rhs_offset+1] +
        lhs[lhs_offset+13] * rhs[rhs_offset+5] +
        lhs[lhs_offset+14] * rhs[rhs_offset+9] +
        lhs[lhs_offset+15] * rhs[rhs_offset+13];
    out[out_offset+14] = // Column 3
        lhs[lhs_offset+12] * rhs[rhs_offset+2] +
        lhs[lhs_offset+13] * rhs[rhs_offset+6] +
        lhs[lhs_offset+14] * rhs[rhs_offset+10] +
        lhs[lhs_offset+15] * rhs[rhs_offset+14];
    out[out_offset+15] = // Column 4
        lhs[lhs_offset+12] * rhs[rhs_offset+3] +
        lhs[lhs_offset+13] * rhs[rhs_offset+7] +
        lhs[lhs_offset+14] * rhs[rhs_offset+11] +
        lhs[lhs_offset+15] * rhs[rhs_offset+15];
};

export const multiply_in_place : lr_v = (
    lhs: FloatArrays,
    rhs: FloatArrays,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    temp_matrix.set(lhs, lhs_offset);

    // Row 1
    lhs[lhs_offset  ] = // Column 1
        temp_matrix[0] * rhs[rhs_offset  ] +
        temp_matrix[1] * rhs[rhs_offset+3] +
        temp_matrix[2] * rhs[rhs_offset+6];

    // Row 1
    lhs[lhs_offset  ] = // Column 1
        temp_matrix[0] * rhs[rhs_offset  ] +
        temp_matrix[1] * rhs[rhs_offset+4] +
        temp_matrix[2] * rhs[rhs_offset+8] +
        temp_matrix[3] * rhs[rhs_offset+12];
    lhs[lhs_offset+1] = // Column 2
        temp_matrix[0] * rhs[rhs_offset+1] +
        temp_matrix[1] * rhs[rhs_offset+5] +
        temp_matrix[2] * rhs[rhs_offset+9] +
        temp_matrix[3] * rhs[rhs_offset+13];
    lhs[lhs_offset+2] = // Column 3
        temp_matrix[0] * rhs[rhs_offset+2] +
        temp_matrix[1] * rhs[rhs_offset+6] +
        temp_matrix[2] * rhs[rhs_offset+10] +
        temp_matrix[3] * rhs[rhs_offset+14];
    lhs[lhs_offset+3] = // Column 4
        temp_matrix[0] * rhs[rhs_offset+3] +
        temp_matrix[1] * rhs[rhs_offset+7] +
        temp_matrix[2] * rhs[rhs_offset+11] +
        temp_matrix[3] * rhs[rhs_offset+15];

    // Row 2
    lhs[lhs_offset+4] = // Column 1
        temp_matrix[4] * rhs[rhs_offset  ] +
        temp_matrix[5] * rhs[rhs_offset+4] +
        temp_matrix[6] * rhs[rhs_offset+8] +
        temp_matrix[7] * rhs[rhs_offset+12];
    lhs[lhs_offset+5] = // Column 2
        temp_matrix[4] * rhs[rhs_offset+1] +
        temp_matrix[5] * rhs[rhs_offset+5] +
        temp_matrix[6] * rhs[rhs_offset+9] +
        temp_matrix[7] * rhs[rhs_offset+13];
    lhs[lhs_offset+6] = // Column 3
        temp_matrix[4] * rhs[rhs_offset+2] +
        temp_matrix[5] * rhs[rhs_offset+6] +
        temp_matrix[6] * rhs[rhs_offset+10] +
        temp_matrix[7] * rhs[rhs_offset+14];
    lhs[lhs_offset+7] = // Column 4
        temp_matrix[4] * rhs[rhs_offset+3] +
        temp_matrix[5] * rhs[rhs_offset+7] +
        temp_matrix[6] * rhs[rhs_offset+11] +
        temp_matrix[7] * rhs[rhs_offset+15];

    // Row 3
    lhs[lhs_offset+8] = // Column 1
        temp_matrix[8] * rhs[rhs_offset  ] +
        temp_matrix[9] * rhs[rhs_offset+4] +
        temp_matrix[10] * rhs[rhs_offset+8] +
        temp_matrix[11] * rhs[rhs_offset+12];
    lhs[lhs_offset+9] = // Column 2
        temp_matrix[8] * rhs[rhs_offset+1] +
        temp_matrix[9] * rhs[rhs_offset+5] +
        temp_matrix[10] * rhs[rhs_offset+9] +
        temp_matrix[11] * rhs[rhs_offset+13];
    lhs[lhs_offset+10] = // Column 3
        temp_matrix[8] * rhs[rhs_offset+2] +
        temp_matrix[9] * rhs[rhs_offset+6] +
        temp_matrix[10] * rhs[rhs_offset+10] +
        temp_matrix[11] * rhs[rhs_offset+14];
    lhs[lhs_offset+11] = // Column 4
        temp_matrix[8] * rhs[rhs_offset+3] +
        temp_matrix[9] * rhs[rhs_offset+7] +
        temp_matrix[10] * rhs[rhs_offset+11] +
        temp_matrix[11] * rhs[rhs_offset+15];

    // Row 4
    lhs[lhs_offset+12] = // Column 1
        temp_matrix[12] * rhs[rhs_offset  ] +
        temp_matrix[13] * rhs[rhs_offset+4] +
        temp_matrix[14] * rhs[rhs_offset+8] +
        temp_matrix[15] * rhs[rhs_offset+12];
    lhs[lhs_offset+13] = // Column 2
        temp_matrix[12] * rhs[rhs_offset+1] +
        temp_matrix[13] * rhs[rhs_offset+5] +
        temp_matrix[14] * rhs[rhs_offset+9] +
        temp_matrix[15] * rhs[rhs_offset+13];
    lhs[lhs_offset+14] = // Column 3
        temp_matrix[12] * rhs[rhs_offset+2] +
        temp_matrix[13] * rhs[rhs_offset+6] +
        temp_matrix[14] * rhs[rhs_offset+10] +
        temp_matrix[15] * rhs[rhs_offset+14];
    lhs[lhs_offset+15] = // Column 4
        temp_matrix[12] * rhs[rhs_offset+3] +
        temp_matrix[13] * rhs[rhs_offset+7] +
        temp_matrix[14] * rhs[rhs_offset+11] +
        temp_matrix[15] * rhs[rhs_offset+15];
};

export const set_rotation_around_x : nbf_v = (
    out: FloatArrays,
    angle: number,
    reset = true,

    out_offset: number = 0
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(out, out_offset);

    out[out_offset+5] = cos;
    out[out_offset+10] = cos;
    out[out_offset+6] = sin;
    out[out_offset+9] = -sin;
};

export const set_rotation_around_y : nbf_v = (
    out: FloatArrays,
    angle: number,
    reset = true,

    out_offset: number = 0
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(out, out_offset);

    out[out_offset  ] = cos;
    out[out_offset+10] = cos;
    out[out_offset+2] = sin;
    out[out_offset+8] = -sin;
};

export const set_rotation_around_z : nbf_v = (
    out: FloatArrays,
    angle: number,
    reset = true,

    out_offset: number = 0
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(out, out_offset);

    out[out_offset  ] = cos;
    out[out_offset+5] = cos;
    out[out_offset+1] = sin;
    out[out_offset+4] = -sin;
};

export class Matrix4x4 extends Matrix{
    protected typed_array_length: number = 16;

    protected _equals: ff_b = equals;
    protected _is_identity: f_b = is_identity;
    protected _set_to_identity: f_v = set_to_identity;
    protected _set_rotation_around_x: nbf_v = set_rotation_around_x;
    protected _set_rotation_around_y: nbf_v = set_rotation_around_y;
    protected _set_rotation_around_z: nbf_v = set_rotation_around_z;

    protected _inverse: ff_v = inverse;
    protected _inverse_in_place: f_v = inverse_in_place;

    protected _transpose: ff_v = transpose;
    protected _transpose_in_place: f_v = transpose_in_place;

    protected _multiply : fff_v = multiply;
    protected _multiply_in_place : lr_v = multiply_in_place;

    constructor(
        public typed_array: FloatArrays,
        public typed_array_offset: number = 0,
        public i: Direction4D = new Direction4D(typed_array.subarray(typed_array_offset    , typed_array_offset + 4)),
        public j: Direction4D = new Direction4D(typed_array.subarray(typed_array_offset + 4, typed_array_offset + 8)),
        public k: Direction4D = new Direction4D(typed_array.subarray(typed_array_offset + 8, typed_array_offset + 12)),
        public t: Position4D = new Position4D(typed_array.subarray(typed_array_offset + 12, typed_array_offset + 16))
    ) {
        super(typed_array, typed_array_offset);
    }
}

export const mat4 = (
    x0?: number|Matrix4x4, y0: number = 0, z0: number = 0, w0: number = 0,
    x1: number = 0, y1: number = 0, z1: number = 0, w1: number = 0,
    x2: number = 0, y2: number = 0, z2: number = 0, w2: number = 0,
    x3: number = 0, y3: number = 0, z3: number = 0, w3: number = 0,
    typed_array: FloatArrays = new FloatArrays(16)
) : Matrix4x4 => {
    const color = new Matrix4x4(typed_array);

    if (x0 instanceof Matrix4x4)
        color.setFromOther(x0);
    else
        color.setTo(
            x0, y0, z0, w0,
            x1, y1, z1, w1,
            x2, y2, z2, w2,
            x3, y3, z3, w3
        );

    return color
};