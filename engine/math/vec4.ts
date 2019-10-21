import {PRECISION_DIGITS} from "../constants.js";
import {Direction, Position} from "./base.js";
import {cross, cross_in_place} from "./vec3.js";
import {
    FloatArrays,

    ff_b,
    ff_n,

    f_n,
    ff_v,
    f_v,

    lr_v,
    fn_v,

    fff_v,
    fnf_v,
    ffnf_v
} from "../types.js";

let temp_number: number;
const temp_lhs = new FloatArrays(4);
const temp_rhs = new FloatArrays(4);
const temp_matrix = new FloatArrays(16);

export const length : f_n = (
    lhs: FloatArrays,
    lhs_offset: number = 0
) : number => Math.hypot(
    lhs[lhs_offset  ],
    lhs[lhs_offset+1],
    lhs[lhs_offset+2],
    lhs[lhs_offset+3]
);

export const length_squared : f_n = (
    lhs: FloatArrays,
    lhs_offset: number = 0
) : number => (
    lhs[lhs_offset  ]*lhs[lhs_offset  ] +
    lhs[lhs_offset+1]*lhs[lhs_offset+1] +
    lhs[lhs_offset+2]*lhs[lhs_offset+2] +
    lhs[lhs_offset+3]*lhs[lhs_offset+3]
);

export const distance : ff_n = (
    lhs: FloatArrays,
    rhs: FloatArrays,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : number => Math.hypot(
    (rhs[rhs_offset  ]-lhs[lhs_offset  ]),
    (rhs[rhs_offset+1]-lhs[lhs_offset+1]),
    (rhs[rhs_offset+2]-lhs[lhs_offset+2]),
    (rhs[rhs_offset+3]-lhs[lhs_offset+3])
);

export const distance_squared : ff_n = (
    lhs: FloatArrays,
    rhs: FloatArrays,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : number => (
    (rhs[rhs_offset  ]-lhs[lhs_offset  ])*(rhs[rhs_offset  ]-lhs[lhs_offset  ]) +
    (rhs[rhs_offset+1]-lhs[lhs_offset+1])*(rhs[rhs_offset+1]-lhs[lhs_offset+1]) +
    (rhs[rhs_offset+2]-lhs[lhs_offset+2])*(rhs[rhs_offset+2]-lhs[lhs_offset+2]) +
    (rhs[rhs_offset+3]-lhs[lhs_offset+3])*(rhs[rhs_offset+3]-lhs[lhs_offset+3])
);

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

    return true;
};

export const linearly_interpolate: ffnf_v = (
    out: FloatArrays,
    from: FloatArrays,
    to: FloatArrays,
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

export const add : fff_v = (
    out: FloatArrays,
    lhs: FloatArrays,
    rhs: FloatArrays,

    out_offset: number = 0,
    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    out[out_offset  ] = lhs[lhs_offset  ] + rhs[rhs_offset  ];
    out[out_offset+1] = lhs[lhs_offset+1] + rhs[rhs_offset+1];
    out[out_offset+2] = lhs[lhs_offset+2] + rhs[rhs_offset+2];
    out[out_offset+3] = lhs[lhs_offset+3] + rhs[rhs_offset+3];
};

export const add_in_place : lr_v = (
    lhs: FloatArrays,
    rhs: FloatArrays,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] += rhs[rhs_offset  ];
    lhs[lhs_offset+1] += rhs[rhs_offset+1];
    lhs[lhs_offset+2] += rhs[rhs_offset+2];
    lhs[lhs_offset+3] += rhs[rhs_offset+3];
};

export const subtract : fff_v = (
    out: FloatArrays,
    lhs: FloatArrays,
    rhs: FloatArrays,

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
    lhs: FloatArrays,
    rhs: FloatArrays,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] -= rhs[rhs_offset  ];
    lhs[lhs_offset+1] -= rhs[rhs_offset+1];
    lhs[lhs_offset+2] -= rhs[rhs_offset+2];
    lhs[lhs_offset+3] -= rhs[rhs_offset+3];
};

export const divide : fnf_v = (
    out: FloatArrays,
    lhs: FloatArrays,
    rhs: number,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    out[out_offset  ] = lhs[lhs_offset  ] / rhs;
    out[out_offset+1] = lhs[lhs_offset+1] / rhs;
    out[out_offset+2] = lhs[lhs_offset+2] / rhs;
    out[out_offset+3] = lhs[lhs_offset+3] / rhs;
};

export const divide_in_place : fn_v = (
    lhs: FloatArrays,
    rhs: number,

    lhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] /= rhs;
    lhs[lhs_offset+1] /= rhs;
    lhs[lhs_offset+2] /= rhs;
    lhs[lhs_offset+3] /= rhs;
};

export const scale : fnf_v = (
    out: FloatArrays,
    lhs: FloatArrays,
    rhs: number,

    out_offset: number = 0,
    lhs_offset: number = 0
) : void => {
    out[out_offset  ] = lhs[lhs_offset  ] * rhs;
    out[out_offset+1] = lhs[lhs_offset+1] * rhs;
    out[out_offset+2] = lhs[lhs_offset+2] * rhs;
    out[out_offset+3] = lhs[lhs_offset+3] * rhs;
};

export const scale_in_place : fn_v = (
    lhs: FloatArrays,
    rhs: number,

    lhs_offset: number = 0
) : void => {
    lhs[lhs_offset  ] *= rhs;
    lhs[lhs_offset+1] *= rhs;
    lhs[lhs_offset+2] *= rhs;
    lhs[lhs_offset+3] *= rhs;
};

export const normalize : ff_v = (
    out: FloatArrays,
    lhs: FloatArrays,

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

export const normalize_in_place : f_v = (
    lhs: FloatArrays,
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

export const dot : ff_n = (
    lhs: FloatArrays,
    rhs: FloatArrays,

    lhs_offset: number = 0,
    rhs_offset: number = 0
) : number =>
    lhs[lhs_offset  ] * rhs[rhs_offset  ] +
    lhs[lhs_offset+1] * rhs[rhs_offset+1] +
    lhs[lhs_offset+2] * rhs[rhs_offset+2] +
    lhs[lhs_offset+3] * rhs[rhs_offset+3];

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

export const multiply_in_place : lr_v = (
    lhs: FloatArrays,
    rhs: FloatArrays,

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

    protected _equals: ff_b = equals;
    protected _linearly_interpolate: ffnf_v = linearly_interpolate;

    protected _add: fff_v = add;
    protected _add_in_place: lr_v = add_in_place;

    protected _subtract: fff_v = subtract;
    protected _subtract_in_place: lr_v = subtract_in_place;

    protected _scale: fnf_v = scale;
    protected _scale_in_place: fn_v = scale_in_place;

    protected _divide: fnf_v = divide;
    protected _divide_in_place: fn_v = divide_in_place;

    protected _multiply : fff_v = multiply;
    protected _multiply_in_place : lr_v = multiply_in_place;

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

    protected _equals: ff_b = equals;
    protected _linearly_interpolate: ffnf_v = linearly_interpolate;

    protected _dot: ff_n = dot;
    protected _length: f_n = length;

    protected _normalize : ff_v = normalize;
    protected _normalize_in_place : f_v = normalize_in_place;

    protected _cross : fff_v = cross;
    protected _cross_in_place : lr_v = cross_in_place;

    protected _add: fff_v = add;
    protected _add_in_place: lr_v = add_in_place;

    protected _subtract: fff_v = subtract;
    protected _subtract_in_place: lr_v = subtract_in_place;

    protected _scale: fnf_v = scale;
    protected _scale_in_place: fn_v = scale_in_place;

    protected _divide: fnf_v = divide;
    protected _divide_in_place: fn_v = divide_in_place;

    protected _multiply : fff_v = multiply;
    protected _multiply_in_place : lr_v = multiply_in_place;

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

    protected _equals: ff_b = equals;
    protected _linearly_interpolate: ffnf_v = linearly_interpolate;

    protected _add: fff_v = add;
    protected _add_in_place: lr_v = add_in_place;

    protected _subtract: fff_v = subtract;
    protected _subtract_in_place: lr_v = subtract_in_place;

    protected _scale: fnf_v = scale;
    protected _scale_in_place: fn_v = scale_in_place;

    protected _divide: fnf_v = divide;
    protected _divide_in_place: fn_v = divide_in_place;

    protected _multiply : fff_v = multiply;
    protected _multiply_in_place : lr_v = multiply_in_place;

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
    typed_array: FloatArrays = new FloatArrays(4)
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
    typed_array: FloatArrays = new FloatArrays(4)
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
    typed_array: FloatArrays = new FloatArrays(4)
) : Position4D => {
    const position = new Position4D(typed_array);

    if (x instanceof Position4D)
        position.setFromOther(x);
    else
        position.setTo(x, y, z, w);

    return position
};