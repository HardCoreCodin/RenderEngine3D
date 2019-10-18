import {PRECISION_DIGITS} from "../constants.js";
import {Direction, Position} from "./base.js";
import {
    ArrayType,

    lr_b,
    lr_n,

    l_n,
    lo_v,
    l_v,

    lr_v,
    ln_v,

    lro_v,
    lno_v,
    lrno_v,

    lm_v,
    lmo_v
} from "../types.js";
import {Float32Buffer} from "../buffers/base";

let temp_number: number;
const temp_lhs = new ArrayType(3);
const temp_rhs = new ArrayType(3);
const temp_matrix = new ArrayType(9);

export const length : l_n = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number
) : number => Math.hypot(x[i], y[i], z[i]);

export const length_squared : l_n = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number
) : number => x[i]**2 + y[i]**2 + z[i]**2;

export const distance : lr_n = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number = 0
) : number => Math.hypot(x1[i1] - x0[i0], y1[i1] - y0[i0], z1[i1] - z0[i0]);

export const distance_squared : lr_n = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) : number => (
    (x1[i1] - x0[i0])**2 +
    (y1[i1] - y0[i0])**2 +
    (z1[i1] - z0[i0])**2
);

export const equals : lr_b = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) : boolean => {
    if (i0 === i1 && (
        (Object.is(x0, x1) || Object.is(x0.buffer, x1.buffer)) &&
        (Object.is(y0, y1) || Object.is(y0.buffer, y1.buffer)) &&
        (Object.is(z0, z1) || Object.is(z0.buffer, z1.buffer))
    )) return true;

    if (x0[i0].toFixed(PRECISION_DIGITS) !== x1[i1].toFixed(PRECISION_DIGITS)) return false;
    if (y0[i0].toFixed(PRECISION_DIGITS) !== y1[i1].toFixed(PRECISION_DIGITS)) return false;
    if (z0[i0].toFixed(PRECISION_DIGITS) !== z1[i1].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const linearly_interpolate: lrno_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number,

    t: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) : void => {
    X[o] = (1-t)*x0[i0] + t*(x1[i1]);
    Y[o] = (1-t)*y0[i0] + t*(y1[i1]);
    Z[o] = (1-t)*z0[i0] + t*(z1[i1]);
};

export const add : lro_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,

    i0: number = 0,
    i1: number = 0,
    o: number = 0
) : void => {
    X[o] = x0[i0] + x1[i1];
    Y[o] = y0[i0] + y1[i1];
    Z[o] = z0[i0] + z1[i1];
};

export const add_in_place : lr_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) : void => {
    x0[i0] += x1[i1];
    y0[i0] += y1[i1];
    z0[i0] += z1[i1];
};

export const subtract : lro_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) : void => {
    X[o] = x0[i0] - x1[i1];
    Y[o] = y0[i0] - y1[i1];
    Z[o] = z0[i0] - z1[i1];
};

export const subtract_in_place : lr_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) : void => {
    x0[i0] -= x1[i1];
    y0[i0] -= y1[i1];
    z0[i0] -= z1[i1];
};

export const divide : lno_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    n: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) : void => {
    X[o] = x[i] / n;
    Y[o] = y[i] / n;
    Z[o] = z[i] / n;
};

export const divide_in_place : ln_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    n: number,
) : void => {
    x[i] /= n;
    y[i] /= n;
    z[i] /= n;
};

export const scale : lno_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    n: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) : void => {
    X[o] = x[i] * n;
    Y[o] = y[i] * n;
    Z[o] = z[i] * n;
};

export const scale_in_place : ln_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    n: number
) : void => {
    x[i] *= n;
    y[i] *= n;
    z[i] *= n;
};

export const normalize : lo_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) : void => {
    temp_number = Math.hypot(x[i], y[i], z[i]);

    X[o] = x[i] / temp_number;
    Y[o] = y[i] / temp_number;
    Z[o] = z[i] / temp_number;
};

export const normalize_in_place : l_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number
) : void => {
    temp_number = Math.hypot(x[i], y[i], z[i]);

    x[i] /= temp_number;
    y[i] /= temp_number;
    z[i] /= temp_number;
};

export const dot : lr_n = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) : number =>
    x0[i0] * x1[i1] +
    y0[i0] * y1[i1] +
    z0[i0] * z1[i1];

export const cross : lro_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) : void => {
    if (
        (
            o === i0 && (
                (Object.is(X, x0) || Object.is(X.buffer, x0.buffer)) &&
                (Object.is(Y, y0) || Object.is(Y.buffer, y0.buffer)) &&
                (Object.is(Z, z0) || Object.is(Z.buffer, z0.buffer))
            )
        ) || (
            o === i1 && (
                (Object.is(X, x1) || Object.is(X.buffer, x1.buffer)) &&
                (Object.is(Y, y1) || Object.is(Y.buffer, y1.buffer)) &&
                (Object.is(Z, z1) || Object.is(Z.buffer, z1.buffer))
            )
        )
    ) throw `Can not cross - shared buffer detected! (Use cross_in_place)`;

    X[o] = y0[i0]*z1[i1] - z0[i0]*y1[i1];
    Y[o] = z0[i0]*x1[i1] - x0[i0]*z1[i1];
    Z[o] = x0[i0]*y1[i1] - y0[i0]*x1[i1];
};

export const cross_in_place : lr_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) : void => {
    temp_lhs[0] = x0[i0];
    temp_lhs[1] = y0[i0];
    temp_lhs[2] = z0[i0];

    temp_rhs[0] = x1[i1];
    temp_rhs[1] = y1[i1];
    temp_rhs[2] = z1[i1];

    x0[i0] = temp_lhs[1]*temp_rhs[2] - temp_lhs[2]*temp_rhs[1];
    y0[i0] = temp_lhs[2]*temp_rhs[0] - temp_lhs[0]*temp_rhs[2];
    z0[i0] = temp_lhs[0]*temp_rhs[1] - temp_lhs[1]*temp_rhs[0];
};

export const multiply : lmo_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    m: ArrayType,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) : void => {
    if (
        o === i0 && (
            (Object.is(X, x0) || Object.is(X.buffer, x0.buffer)) &&
            (Object.is(Y, y0) || Object.is(Y.buffer, y0.buffer)) &&
            (Object.is(Z, z0) || Object.is(Z.buffer, z0.buffer))
        )
    ) throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;

    X[o] = x0[i0]*m[0] + y0[i0]*m[3] + z0[i0]*m[6];
    Y[o] = x0[i0]*m[1] + y0[i0]*m[4] + z0[i0]*m[7];
    Z[o] = x0[i0]*m[2] + y0[i0]*m[5] + z0[i0]*m[8];
};

export const multiply_in_place : lm_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    m: ArrayType
) : void => {
    temp_lhs[0] = x0[i0];
    temp_lhs[1] = y0[i0];
    temp_lhs[2] = z0[i0];

    temp_matrix.set(m);

    x0[i0] = temp_lhs[0]*temp_matrix[0] + temp_lhs[1]*temp_matrix[3] + temp_lhs[2]*temp_matrix[6];
    y0[i0] = temp_lhs[0]*temp_matrix[1] + temp_lhs[1]*temp_matrix[4] + temp_lhs[2]*temp_matrix[7];
    z0[i0] = temp_lhs[0]*temp_matrix[2] + temp_lhs[1]*temp_matrix[5] + temp_lhs[2]*temp_matrix[8];
};

export class Position3D extends Position {
    protected typed_arry0_length: number = 3;

    protected _equals: lr_b = equals;
    protected _linearly_interpolate: lrno_v = linearly_interpolate;

    protected _add: lro_v = add;
    protected _add_in_place: lr_v = add_in_place;

    protected _subtract: lro_v = subtract;
    protected _subtract_in_place: lr_v = subtract_in_place;

    protected _scale: lno_v = scale;
    protected _scale_in_place: ln_v = scale_in_place;

    protected _divide: lno_v = divide;
    protected _divide_in_place: ln_v = divide_in_place;

    protected _multiply : lro_v = multiply;
    protected _multiply_in_place : lr_v = multiply_in_place;

    set x(x) {this.typed_arry0[this.typed_arry0_offset  ] = x}
    set y(y) {this.typed_arry0[this.typed_arry0_offset+1] = y}
    set z(z) {this.typed_arry0[this.typed_arry0_offset+2] = z}

    get x() : number {return this.typed_arry0[this.typed_arry0_offset  ]}
    get y() : number {return this.typed_arry0[this.typed_arry0_offset+1]}
    get z() : number {return this.typed_arry0[this.typed_arry0_offset+2]}
}

export class Direction3D extends Direction {
    protected typed_arry0_length: number = 3;

    protected _equals: lr_b = equals;
    protected _linearly_interpolate: out_y1_op = linearly_interpolate;

    protected _dot: lr_n = dot;
    protected _length: l_n = length;

    protected _normalize : lo_v = normalize;
    protected _normalize_in_place : l_v = normalize_in_place;

    protected _cross : lro_v = cross;
    protected _cross_in_place : lr_v = cross_in_place;

    protected _add: lro_v = add;
    protected _add_in_place: lr_v = add_in_place;

    protected _subtract: lro_v = subtract;
    protected _subtract_in_place: lr_v = subtract_in_place;

    protected _scale: lno_v = scale;
    protected _scale_in_place: ln_v = scale_in_place;

    protected _divide: lno_v = divide;
    protected _divide_in_place: ln_v = divide_in_place;

    protected _multiply : lro_v = multiply;
    protected _multiply_in_place : lr_v = multiply_in_place;

    set x(x) {this.typed_arry0[this.typed_arry0_offset  ] = x}
    set y(y) {this.typed_arry0[this.typed_arry0_offset+1] = y}
    set z(z) {this.typed_arry0[this.typed_arry0_offset+2] = z}

    get x() : number {return this.typed_arry0[this.typed_arry0_offset  ]}
    get y() : number {return this.typed_arry0[this.typed_arry0_offset+1]}
    get z() : number {return this.typed_arry0[this.typed_arry0_offset+2]}
}

export class Color3D extends Position {
    protected typed_arry0_length: number = 3;

    protected _equals: lr_b = equals;
    protected _linearly_interpolate: out_y1_op = linearly_interpolate;

    protected _add: lro_v = add;
    protected _add_in_place: lr_v = add_in_place;

    protected _subtract: lro_v = subtract;
    protected _subtract_in_place: lr_v = subtract_in_place;

    protected _scale: lno_v = scale;
    protected _scale_in_place: ln_v = scale_in_place;

    protected _divide: lno_v = divide;
    protected _divide_in_place: ln_v = divide_in_place;

    protected _multiply : lro_v = multiply;
    protected _multiply_in_place : lr_v = multiply_in_place;

    set r(r) {this.typed_arry0[this.typed_arry0_offset  ] = r}
    set g(g) {this.typed_arry0[this.typed_arry0_offset+1] = g}
    set b(b) {this.typed_arry0[this.typed_arry0_offset+2] = b}

    get r() : number {return this.typed_arry0[this.typed_arry0_offset  ]}
    get g() : number {return this.typed_arry0[this.typed_arry0_offset+1]}
    get b() : number {return this.typed_arry0[this.typed_arry0_offset+2]}

    setGreyScale(color: number) : Color3D {
        this.typed_arry0.fill(
            color,
            this.typed_arry0_offset,
            this.typed_arry0_offset+3
        );

        return this;
    }

    toString() : string {
        return `rgb(${this.r*255}, ${this.g*255}, ${this.b*255})`
    }
}

export class Colors3D {
    constructor(
        public readonly count: number,
        public readonly stride: number = 3,
        public readonly buffer = new Float32Buffer(count, stride),
        public readonly current = new Color3D(buffer.sub_arry0s[0])
    ) {}

    at(index: number, current: Color3D = this.current) : Color3D {
        current.buffer = this.buffer.sub_arry0s[index];
        return current;
    }
}

export const rgb = (
    r?: number|Color3D,
    g: number = 0,
    b: number = 0,
    typed_arry0: ArrayType = new ArrayType(3)
) : Color3D => {
    const color = new Color3D(typed_arry0);

    if (r instanceof Color3D)
        color.setFromOther(r);
    else
        color.setTo(r, g, b);

    return color
};

export const dir3 = (
    x?: number|Direction3D,
    y: number = 0,
    z: number = 0,
    typed_arry0: ArrayType = new ArrayType(3)
) : Direction3D => {
    const direction = new Direction3D(typed_arry0);

    if (x instanceof Direction3D)
        direction.setFromOther(x);
    else
        direction.setTo(x, y, z);

    return direction
};

export const pos3 = (
    x?: number|Position3D,
    y: number = 0,
    z: number = 0,
    typed_arry0: ArrayType = new ArrayType(3)
) : Position3D => {
    const position = new Position3D(typed_arry0);

    if (x instanceof Position3D)
        position.setFromOther(x);
    else
        position.setTo(x, y, z);

    return position
};