import {PRECISION_DIGITS} from "../constants.js";
import {Direction, Position} from "./base.js";
import {cross, cross_in_place} from "./vec3.js";
import {
    ArrayType,

    bool_op,
    number_op,

    unary_number_op,
    unary_op,
    in_place_unary_op,

    in_place_op,
    in_place_number_op,

    out_op,
    out_number_op,
    out_by_op
} from "../types.js";

let temp_number: number;
const temp_lhs = new ArrayType(4);
const temp_rhs = new ArrayType(4);
const temp_matrix = new ArrayType(16);

export const length : unary_number_op = (
    lhs: ArrayType,
    lhs_offset: number = 0
) : number => Math.hypot(
    lhs[lhs_offset  ],
    lhs[lhs_offset+1],
    lhs[lhs_offset+2],
    lhs[lhs_offset+3]
);

export const length_squared : unary_number_op = (
    lhs: ArrayType,
    lhs_offset: number = 0
) : number => (
    lhs[lhs_offset  ]*lhs[lhs_offset  ] +
    lhs[lhs_offset+1]*lhs[lhs_offset+1] +
    lhs[lhs_offset+2]*lhs[lhs_offset+2] +
    lhs[lhs_offset+3]*lhs[lhs_offset+3]
);

export const distance : number_op = (
    lhs: ArrayType,
    rhs: ArrayType,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : number => Math.hypot(
    (rhs[rhs_offset  ]-lhs[lhs_offset  ]),
    (rhs[rhs_offset+1]-lhs[lhs_offset+1]),
    (rhs[rhs_offset+2]-lhs[lhs_offset+2]),
    (rhs[rhs_offset+3]-lhs[lhs_offset+3])
);

export const distance_squared : number_op = (
    lhs: ArrayType,
    rhs: ArrayType,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : number => (
    (rhs[rhs_offset  ]-lhs[lhs_offset  ])*(rhs[rhs_offset  ]-lhs[lhs_offset  ]) +
    (rhs[rhs_offset+1]-lhs[lhs_offset+1])*(rhs[rhs_offset+1]-lhs[lhs_offset+1]) +
    (rhs[rhs_offset+2]-lhs[lhs_offset+2])*(rhs[rhs_offset+2]-lhs[lhs_offset+2]) +
    (rhs[rhs_offset+3]-lhs[lhs_offset+3])*(rhs[rhs_offset+3]-lhs[lhs_offset+3])
);

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

    return true;
};

export const linearly_interpolate: out_by_op = (
    out: ArrayType,
    from: ArrayType,
    to: ArrayType,
    by: number,

    out_offset: number = 0,
    from_offset: number = 0,
    to_offset: number = 0
) : void => {
    out[out_offset  ] = from[from_offset  ] + by*(to[to_offset  ] - from[from_offset  ]);
    out[out_offset+1] = from[from_offset+1] + by*(to[to_offset+1] - from[from_offset+1]);
    out[out_offset+2] = from[from_offset+2] + by*(to[to_offset+2] - from[from_offset+2]);
    out[out_offset+3] = from[from_offset+3] + by*(to[to_offset+3] - from[from_offset+3]);
};

export const add : out_op = (
    out: ArrayType,
    lhs: ArrayType,
    rhs: ArrayType,

    out_offset: number = 0,
    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    out[out_offset  ] = lhs[lhs_offset  ] + rhs[rhs_offset  ];
    out[out_offset+1] = lhs[lhs_offset+1] + rhs[rhs_offset+1];
    out[out_offset+2] = lhs[lhs_offset+2] + rhs[rhs_offset+2];
    out[out_offset+3] = lhs[lhs_offset+3] + rhs[rhs_offset+3];
};

export const add_in_place : in_place_op = (
    lhs: ArrayType,
    rhs: ArrayType,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] += rhs[rhs_offset  ];
    lhs[lhs_offset+1] += rhs[rhs_offset+1];
    lhs[lhs_offset+2] += rhs[rhs_offset+2];
    lhs[lhs_offset+3] += rhs[rhs_offset+3];
};

export const subtract : out_op = (
    out: ArrayType,
    lhs: ArrayType,
    rhs: ArrayType,

    out_offset: number,
    lhs_offset: number,
    rhs_offset: number
) : void => {
    out[out_offset  ] = lhs[lhs_offset  ] - rhs[rhs_offset  ];
    out[out_offset+1] = lhs[lhs_offset+1] - rhs[rhs_offset+1];
    out[out_offset+2] = lhs[lhs_offset+2] - rhs[rhs_offset+2];
    out[out_offset+3] = lhs[lhs_offset+3] - rhs[rhs_offset+3];
};

export const subtract_in_place = (
    lhs: ArrayType,
    rhs: ArrayType,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] -= rhs[rhs_offset  ];
    lhs[lhs_offset+1] -= rhs[rhs_offset+1];
    lhs[lhs_offset+2] -= rhs[rhs_offset+2];
    lhs[lhs_offset+3] -= rhs[rhs_offset+3];
};

export const divide : out_number_op = (
    out: ArrayType,
    lhs: ArrayType,
    rhs: number,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    out[out_offset  ] = lhs[lhs_offset  ] / rhs;
    out[out_offset+1] = lhs[lhs_offset+1] / rhs;
    out[out_offset+2] = lhs[lhs_offset+2] / rhs;
    out[out_offset+3] = lhs[lhs_offset+3] / rhs;
};

export const divide_in_place : in_place_number_op = (
    lhs: ArrayType,
    rhs: number,

    lhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] /= rhs;
    lhs[lhs_offset+1] /= rhs;
    lhs[lhs_offset+2] /= rhs;
    lhs[lhs_offset+3] /= rhs;
};

export const scale : out_number_op = (
    out: ArrayType,
    lhs: ArrayType,
    rhs: number,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    out[out_offset  ] = lhs[lhs_offset  ] * rhs;
    out[out_offset+1] = lhs[lhs_offset+1] * rhs;
    out[out_offset+2] = lhs[lhs_offset+2] * rhs;
    out[out_offset+3] = lhs[lhs_offset+3] * rhs;
};

export const scale_in_place : in_place_number_op = (
    lhs: ArrayType,
    rhs: number,

    lhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] *= rhs;
    lhs[lhs_offset+1] *= rhs;
    lhs[lhs_offset+2] *= rhs;
    lhs[lhs_offset+3] *= rhs;
};

export const normalize : unary_op = (
    out: ArrayType,
    lhs: ArrayType,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    temp_number = Math.hypot(
        lhs[lhs_offset  ],
        lhs[lhs_offset+1],
        lhs[lhs_offset+2],
        lhs[lhs_offset+3]
    );

    out[out_offset  ] = lhs[lhs_offset  ] / temp_number;
    out[out_offset+1] = lhs[lhs_offset+1] / temp_number;
    out[out_offset+2] = lhs[lhs_offset+2] / temp_number;
    out[out_offset+3] = lhs[lhs_offset+3] / temp_number;
};

export const normalize_in_place : in_place_unary_op = (
    lhs: ArrayType,
    lhs_offset: number = 0
) : void => {
    temp_number = Math.hypot(
        lhs[lhs_offset  ],
        lhs[lhs_offset+1],
        lhs[lhs_offset+2],
        lhs[lhs_offset+3]
    );

    lhs[lhs_offset  ] /= temp_number;
    lhs[lhs_offset+1] /= temp_number;
    lhs[lhs_offset+2] /= temp_number;
    lhs[lhs_offset+3] /= temp_number;
};

export const dot : number_op = (
    lhs: ArrayType,
    rhs: ArrayType,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : number =>
    lhs[lhs_offset  ] * rhs[rhs_offset  ] +
    lhs[lhs_offset+1] * rhs[rhs_offset+1] +
    lhs[lhs_offset+2] * rhs[rhs_offset+2] +
    lhs[lhs_offset+3] * rhs[rhs_offset+3];

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
    ) throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;

    out[out_offset  ] =
        lhs[lhs_offset  ]*rhs[rhs_offset  ] +
        lhs[lhs_offset+1]*rhs[rhs_offset+4] +
        lhs[lhs_offset+2]*rhs[rhs_offset+8] +
        lhs[lhs_offset+3]*rhs[rhs_offset+12];

    out[out_offset+1] =
        lhs[lhs_offset  ]*rhs[rhs_offset+1] +
        lhs[lhs_offset+1]*rhs[rhs_offset+5] +
        lhs[lhs_offset+2]*rhs[rhs_offset+9] +
        lhs[lhs_offset+3]*rhs[rhs_offset+13];

    out[out_offset+2] =
        lhs[lhs_offset  ]*rhs[rhs_offset+2] +
        lhs[lhs_offset+1]*rhs[rhs_offset+6] +
        lhs[lhs_offset+2]*rhs[rhs_offset+10] +
        lhs[lhs_offset+3]*rhs[rhs_offset+14];

    out[out_offset+3] =
        lhs[lhs_offset  ]*rhs[rhs_offset+3] +
        lhs[lhs_offset+1]*rhs[rhs_offset+7] +
        lhs[lhs_offset+2]*rhs[rhs_offset+11] +
        lhs[lhs_offset+3]*rhs[rhs_offset+15];
};

export const multiply_in_place : in_place_op = (
    lhs: ArrayType,
    rhs: ArrayType,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    temp_lhs.set(lhs.subarray(lhs_offset, lhs_offset+4));
    temp_matrix.set(rhs.subarray(rhs_offset, rhs_offset+16));

    lhs[lhs_offset  ] =
        temp_lhs[0]*temp_matrix[0] +
        temp_lhs[1]*temp_matrix[4] +
        temp_lhs[2]*temp_matrix[8] +
        temp_lhs[3]*temp_matrix[12];

    lhs[lhs_offset+1] =
        temp_lhs[0]*temp_matrix[1] +
        temp_lhs[1]*temp_matrix[5] +
        temp_lhs[2]*temp_matrix[9] +
        temp_lhs[3]*temp_matrix[13];

    lhs[lhs_offset+2] =
        temp_lhs[0]*temp_matrix[2] +
        temp_lhs[1]*temp_matrix[6] +
        temp_lhs[2]*temp_matrix[10] +
        temp_lhs[3]*temp_matrix[14];

    lhs[lhs_offset+3] =
        temp_lhs[0]*temp_matrix[3] +
        temp_lhs[1]*temp_matrix[7] +
        temp_lhs[2]*temp_matrix[11] +
        temp_lhs[3]*temp_matrix[15];
};

export class Position4D extends Position {
    protected typed_array_length: number = 4;

    protected _equals: bool_op = equals;
    protected _linearly_interpolate: out_by_op = linearly_interpolate;

    protected _add: out_op = add;
    protected _add_in_place: in_place_op = add_in_place;

    protected _subtract: out_op = subtract;
    protected _subtract_in_place: in_place_op = subtract_in_place;

    protected _scale: out_number_op = scale;
    protected _scale_in_place: in_place_number_op = scale_in_place;

    protected _divide: out_number_op = divide;
    protected _divide_in_place: in_place_number_op = divide_in_place;

    protected _multiply : out_op = multiply;
    protected _multiply_in_place : in_place_op = multiply_in_place;

    set x(x) {this.typed_array[this.typed_array_offset  ] = x}
    set y(y) {this.typed_array[this.typed_array_offset+1] = y}
    set z(z) {this.typed_array[this.typed_array_offset+2] = z}
    set w(w) {this.typed_array[this.typed_array_offset+3] = w}

    get x() : number {return this.typed_array[this.typed_array_offset  ]}
    get y() : number {return this.typed_array[this.typed_array_offset+1]}
    get z() : number {return this.typed_array[this.typed_array_offset+2]}
    get w() : number {return this.typed_array[this.typed_array_offset+3]}
}

export class Direction4D extends Direction {
    protected typed_array_length: number = 4;

    protected _equals: bool_op = equals;
    protected _linearly_interpolate: out_by_op = linearly_interpolate;

    protected _dot: number_op = dot;
    protected _length: unary_number_op = length;

    protected _normalize : unary_op = normalize;
    protected _normalize_in_place : in_place_unary_op = normalize_in_place;

    protected _cross : out_op = cross;
    protected _cross_in_place : in_place_op = cross_in_place;

    protected _add: out_op = add;
    protected _add_in_place: in_place_op = add_in_place;

    protected _subtract: out_op = subtract;
    protected _subtract_in_place: in_place_op = subtract_in_place;

    protected _scale: out_number_op = scale;
    protected _scale_in_place: in_place_number_op = scale_in_place;

    protected _divide: out_number_op = divide;
    protected _divide_in_place: in_place_number_op = divide_in_place;

    protected _multiply : out_op = multiply;
    protected _multiply_in_place : in_place_op = multiply_in_place;

    set x(x) {this.typed_array[this.typed_array_offset  ] = x}
    set y(y) {this.typed_array[this.typed_array_offset+1] = y}
    set z(z) {this.typed_array[this.typed_array_offset+2] = z}
    set w(w) {this.typed_array[this.typed_array_offset+3] = w}

    get x() : number {return this.typed_array[this.typed_array_offset  ]}
    get y() : number {return this.typed_array[this.typed_array_offset+1]}
    get z() : number {return this.typed_array[this.typed_array_offset+2]}
    get w() : number {return this.typed_array[this.typed_array_offset+3]}
}

export class Color4D extends Position {
    protected typed_array_length: number = 4;

    protected _equals: bool_op = equals;
    protected _linearly_interpolate: out_by_op = linearly_interpolate;

    protected _add: out_op = add;
    protected _add_in_place: in_place_op = add_in_place;

    protected _subtract: out_op = subtract;
    protected _subtract_in_place: in_place_op = subtract_in_place;

    protected _scale: out_number_op = scale;
    protected _scale_in_place: in_place_number_op = scale_in_place;

    protected _divide: out_number_op = divide;
    protected _divide_in_place: in_place_number_op = divide_in_place;

    protected _multiply : out_op = multiply;
    protected _multiply_in_place : in_place_op = multiply_in_place;

    set r(r) {this.typed_array[this.typed_array_offset  ] = r}
    set g(g) {this.typed_array[this.typed_array_offset+1] = g}
    set b(b) {this.typed_array[this.typed_array_offset+2] = b}
    set a(a) {this.typed_array[this.typed_array_offset+3] = a}

    get r() : number {return this.typed_array[this.typed_array_offset  ]}
    get g() : number {return this.typed_array[this.typed_array_offset+1]}
    get b() : number {return this.typed_array[this.typed_array_offset+2]}
    get a() : number {return this.typed_array[this.typed_array_offset+3]}

    setGreyScale(color: number) : Color4D {
        this.typed_array.fill(
            color,
            this.typed_array_offset,
            this.typed_array_offset+3
        );

        return this;
    }

    toString() : string {
        return `rgba(${this.r*255}, ${this.g*255}, ${this.b*255}, ${this.a*255})`
    }
}

export const rgba = (
    r?: number|Color4D,
    g: number = 0,
    b: number = 0,
    a: number = 0,
    typed_array: ArrayType = new ArrayType(4)
) : Color4D => {
    const color = new Color4D(typed_array);

    if (r instanceof Color4D)
        color.setFromOther(r);
    else
        color.setTo(r, g, b, a);

    return color
};

export const dir4 = (
    x?: number|Direction4D,
    y: number = 0,
    z: number = 0,
    w: number = 0,
    typed_array: ArrayType = new ArrayType(4)
) : Direction4D => {
    const direction = new Direction4D(typed_array);

    if (x instanceof Direction4D)
        direction.setFromOther(x);
    else
        direction.setTo(x, y, z, w);

    return direction
};

export const pos4 = (
    x?: number|Position4D,
    y: number = 0,
    z: number = 0,
    w: number = 0,
    typed_array: ArrayType = new ArrayType(4)
) : Position4D => {
    const position = new Position4D(typed_array);

    if (x instanceof Position4D)
        position.setFromOther(x);
    else
        position.setTo(x, y, z, w);

    return position
};