import {PRECISION_DIGITS} from "../constants";
import {Matrix} from "./base";
import {Direction3D} from "./vec3.js";
import {
    ArrayType,
    bool_op,
    in_place_op,
    in_place_unary_op,
    number_bool_op,
    out_op,
    unary_bool_op,
    unary_op
} from "../types.js";

const temp_matrix = new ArrayType(9);
let sin, cos;
function setSinCos(angle: number) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
}

export const set_to_identity : in_place_unary_op = (
    lhs: ArrayType,
    lhs_offset: number = 0
) : void => {
    lhs.fill(0, lhs_offset, lhs_offset+9);
    lhs[lhs_offset] = lhs[lhs_offset+4] = lhs[lhs_offset+8] = 1;
};

export const inverse : unary_op = (
    out: ArrayType,
    lhs: ArrayType,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    if (out_offset === lhs_offset && (
        Object.is(out, lhs) ||
        Object.is(out.buffer, lhs.buffer)
    )) throw `Can not inverse - shared buffer detected! (Use inverse_in_place)`;

    out[out_offset  ] = lhs[lhs_offset  ];
    out[out_offset+1] = lhs[lhs_offset+3];
    out[out_offset+2] = lhs[lhs_offset+2];

    out[out_offset+3] = lhs[lhs_offset+1];
    out[out_offset+4] = lhs[lhs_offset+4];
    out[out_offset+5] = lhs[lhs_offset+5];

    out[out_offset+6] = -(
        lhs[lhs_offset+6] * lhs[lhs_offset  ] +
        lhs[lhs_offset+7] * lhs[lhs_offset+1]
    );
    out[out_offset+7] = -(
        lhs[lhs_offset+6] * lhs[lhs_offset+3] +
        lhs[lhs_offset+7] * lhs[lhs_offset+4]
    );
    out[out_offset+8] = 1;
};

export const inverse_in_place : in_place_unary_op = (
    lhs: ArrayType,
    lhs_offset: number = 0
) : void => {
    temp_matrix.set(lhs, lhs_offset);

    lhs[lhs_offset  ] = temp_matrix[0];
    lhs[lhs_offset+1] = temp_matrix[3];
    lhs[lhs_offset+2] = temp_matrix[2];

    lhs[lhs_offset+3] = temp_matrix[1];
    lhs[lhs_offset+4] = temp_matrix[4];
    lhs[lhs_offset+5] = temp_matrix[5];

    lhs[lhs_offset+6] = -(
        temp_matrix[6] * temp_matrix[0] +
        temp_matrix[7] * temp_matrix[1]
    );
    lhs[lhs_offset+7] = -(
        temp_matrix[6] * temp_matrix[3] +
        temp_matrix[7] * temp_matrix[4]
    );
    lhs[lhs_offset+8] = 1;
};

export const transpose : unary_op = (
    out: ArrayType,
    lhs: ArrayType,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    if (out_offset === lhs_offset && (
        Object.is(out, lhs) ||
        Object.is(out.buffer, lhs.buffer)
    )) throw `Can not transpose - shared buffer detected! (Use transpose_in_place)`;

    out[out_offset  ] = lhs[lhs_offset  ];
    out[out_offset+1] = lhs[lhs_offset+3];
    out[out_offset+2] = lhs[lhs_offset+6];

    out[out_offset+3] = lhs[lhs_offset+1];
    out[out_offset+4] = lhs[lhs_offset+4];
    out[out_offset+5] = lhs[lhs_offset+7];

    out[out_offset+6] = lhs[lhs_offset+2];
    out[out_offset+7] = lhs[lhs_offset+5];
    out[out_offset+8] = lhs[lhs_offset+8];
};

export const transpose_in_place : in_place_unary_op = (
    lhs: ArrayType,
    lhs_offset: number = 0
) : void => {
    temp_matrix.set(lhs, lhs_offset);
    lhs[lhs_offset  ] = temp_matrix[0];
    lhs[lhs_offset+1] = temp_matrix[3];
    lhs[lhs_offset+2] = temp_matrix[6];

    lhs[lhs_offset+3] = temp_matrix[1];
    lhs[lhs_offset+4] = temp_matrix[4];
    lhs[lhs_offset+5] = temp_matrix[7];

    lhs[lhs_offset+6] = temp_matrix[2];
    lhs[lhs_offset+7] = temp_matrix[5];
    lhs[lhs_offset+8] = temp_matrix[8];
};

export const equals : bool_op = (
    lhs: ArrayType,
    rhs: ArrayType,

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

    return true;
};

export const is_identity : unary_bool_op = (
    lhs: ArrayType,
    lhs_offset: number = 0
) : boolean =>
    lhs[lhs_offset  ] === 1 &&
    lhs[lhs_offset+1] === 0 &&
    lhs[lhs_offset+2] === 0 &&
    lhs[lhs_offset+3] === 0 &&
    lhs[lhs_offset+4] === 1 &&
    lhs[lhs_offset+5] === 0 &&
    lhs[lhs_offset+6] === 0 &&
    lhs[lhs_offset+7] === 0 &&
    lhs[lhs_offset+8] === 1;

export const multiply : out_op = (
    out: ArrayType,
    lhs: ArrayType,
    rhs: ArrayType,

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
        lhs[lhs_offset+1] * rhs[rhs_offset+3] +
        lhs[lhs_offset+2] * rhs[rhs_offset+6];
    out[out_offset+1] = // Column 2
        lhs[lhs_offset  ] * rhs[rhs_offset+1] +
        lhs[lhs_offset+1] * rhs[rhs_offset+4] +
        lhs[lhs_offset+2] * rhs[rhs_offset+7];
    out[out_offset+2] = // Column 3
        lhs[lhs_offset  ] * rhs[rhs_offset+2] +
        lhs[lhs_offset+1] * rhs[rhs_offset+5] +
        lhs[lhs_offset+2] * rhs[rhs_offset+8];

    // Row 2
    out[out_offset+3] = // Column 1
        lhs[lhs_offset+3] * rhs[rhs_offset  ] +
        lhs[lhs_offset+4] * rhs[rhs_offset+3] +
        lhs[lhs_offset+5] * rhs[rhs_offset+6];
    out[out_offset+4] = // Column 2
        lhs[lhs_offset+3] * rhs[rhs_offset+1] +
        lhs[lhs_offset+4] * rhs[rhs_offset+4] +
        lhs[lhs_offset+5] * rhs[rhs_offset+7];
    out[out_offset+5] = // Column 3
        lhs[lhs_offset+3] * rhs[rhs_offset+2] +
        lhs[lhs_offset+4] * rhs[rhs_offset+5] +
        lhs[lhs_offset+5] * rhs[rhs_offset+8];

    // Row 3
    out[out_offset+6] = // Column 1
        lhs[lhs_offset+6] * rhs[rhs_offset  ] +
        lhs[lhs_offset+7] * rhs[rhs_offset+3] +
        lhs[lhs_offset+8] * rhs[rhs_offset+6];
    out[out_offset+7] = // Column 2
        lhs[lhs_offset+6] * rhs[rhs_offset+1] +
        lhs[lhs_offset+7] * rhs[rhs_offset+4] +
        lhs[lhs_offset+8] * rhs[rhs_offset+7];
    out[out_offset+8] = // Column 3
        lhs[lhs_offset+6] * rhs[rhs_offset+2] +
        lhs[lhs_offset+7] * rhs[rhs_offset+5] +
        lhs[lhs_offset+8] * rhs[rhs_offset+8];
};

export const multiply_in_place : in_place_op = (
    lhs: ArrayType,
    rhs: ArrayType,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    temp_matrix.set(lhs, lhs_offset);

    // Row 1
    lhs[lhs_offset  ] = // Column 1
        temp_matrix[0] * rhs[rhs_offset  ] +
        temp_matrix[1] * rhs[rhs_offset+3] +
        temp_matrix[2] * rhs[rhs_offset+6];
    lhs[lhs_offset+1] = // Column 2
        temp_matrix[0] * rhs[rhs_offset+1] +
        temp_matrix[1] * rhs[rhs_offset+4] +
        temp_matrix[2] * rhs[rhs_offset+7];
    lhs[lhs_offset+2] = // Column 3
        temp_matrix[0] * rhs[rhs_offset+2] +
        temp_matrix[1] * rhs[rhs_offset+5] +
        temp_matrix[2] * rhs[rhs_offset+8];

    // Row 2
    lhs[lhs_offset+3] = // Column 1
        temp_matrix[3] * rhs[rhs_offset  ] +
        temp_matrix[4] * rhs[rhs_offset+3] +
        temp_matrix[5] * rhs[rhs_offset+6];
    lhs[lhs_offset+4] = // Column 2
        temp_matrix[3] * rhs[rhs_offset+1] +
        temp_matrix[4] * rhs[rhs_offset+4] +
        temp_matrix[lhs_offset+5] * rhs[rhs_offset+7];
    lhs[lhs_offset+5] = // Column 3
        temp_matrix[3] * rhs[rhs_offset+2] +
        temp_matrix[4] * rhs[rhs_offset+5] +
        temp_matrix[5] * rhs[rhs_offset+8];

    // Row 3
    lhs[lhs_offset+6] = // Column 1
        temp_matrix[6] * rhs[rhs_offset  ] +
        temp_matrix[7] * rhs[rhs_offset+3] +
        temp_matrix[8] * rhs[rhs_offset+6];
    lhs[lhs_offset+7] = // Column 2
        temp_matrix[6] * rhs[rhs_offset+1] +
        temp_matrix[7] * rhs[rhs_offset+4] +
        temp_matrix[8] * rhs[rhs_offset+7];
    lhs[lhs_offset+8] = // Column 3
        temp_matrix[6] * rhs[rhs_offset+2] +
        temp_matrix[7] * rhs[rhs_offset+5] +
        temp_matrix[8] * rhs[rhs_offset+8];
};

export const set_rotation_around_x : number_bool_op = (
    out: ArrayType,
    angle: number,
    reset = true,

    out_offset: number = 0
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(out, out_offset);

    out[out_offset+4] = cos;
    out[out_offset+8] = cos;
    out[out_offset+5] = sin;
    out[out_offset+7] = -sin;
};

export const set_rotation_around_y : number_bool_op = (
    out: ArrayType,
    angle: number,
    reset = true,

    out_offset: number = 0
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(out, out_offset);

    out[out_offset  ] = cos;
    out[out_offset+8] = cos;
    out[out_offset+2] = sin;
    out[out_offset+6] = -sin;
};

export const set_rotation_around_z : number_bool_op = (
    out: ArrayType,
    angle: number,
    reset = true,

    out_offset: number = 0
) : void => {
    setSinCos(angle);
    if (reset) set_to_identity(out, out_offset);

    out[out_offset  ] = cos;
    out[out_offset+4] = cos;
    out[out_offset+1] = sin;
    out[out_offset+3] = -sin;
};

export class Matrix3x3 extends Matrix{
    protected typed_array_length: number = 9;

    protected _equals: bool_op = equals;
    protected _is_identity: unary_bool_op = is_identity;
    protected _set_to_identity: in_place_unary_op = set_to_identity;
    protected _set_rotation_around_x: number_bool_op = set_rotation_around_x;
    protected _set_rotation_around_y: number_bool_op = set_rotation_around_y;
    protected _set_rotation_around_z: number_bool_op = set_rotation_around_z;

    protected _inverse: unary_op = inverse;
    protected _inverse_in_place: in_place_unary_op = inverse_in_place;

    protected _transpose: unary_op = transpose;
    protected _transpose_in_place: in_place_unary_op = transpose_in_place;

    protected _multiply : out_op = multiply;
    protected _multiply_in_place : in_place_op = multiply_in_place;

    constructor(
        public typed_array: ArrayType,
        public typed_array_offset: number = 0,
        public i: Direction3D = new Direction3D(typed_array.subarray(typed_array_offset    , typed_array_offset + 3)),
        public j: Direction3D = new Direction3D(typed_array.subarray(typed_array_offset + 3, typed_array_offset + 6)),
        public k: Direction3D = new Direction3D(typed_array.subarray(typed_array_offset + 6, typed_array_offset + 9))
    ) {
        super(typed_array, typed_array_offset);
    }
}

export const mat3 = (
    x0?: number|Matrix3x3, y0: number = 0, z0: number = 0,
    x1: number = 0, y1: number = 0, z1: number = 0,
    x2: number = 0, y2: number = 0, z2: number = 0,
    typed_array: ArrayType = new ArrayType(9)
) : Matrix3x3 => {
    const color = new Matrix3x3(typed_array);

    if (x0 instanceof Matrix3x3)
        color.setFromOther(x0);
    else
        color.setTo(
            x0, y0, z0,
            x1, y1, z1,
            x2, y2, z2
        );

    return color
};