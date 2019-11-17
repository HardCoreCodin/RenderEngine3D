import Matrix3x3, {IMatrix3x3} from "./mat3x3.js";
import {
    Color,
    TexCoords,
    Direction,
    Position,
    ITexCoords,
    IColor,
    IVectorFunctions,
    ITransformableVector
} from "./vec.js";
import {PRECISION_DIGITS} from "../constants.js";
import {IBaseArithmaticFunctions, IBaseFunctions} from "./base.js";
import {FloatArray} from "../types.js";
import {FloatBuffer} from "../allocators.js";

let t_x, 
    t_y, 
    t_z, 
    t_n: number;

let X, Y, Z,
    M11, M12, M13,
    M21, M22, M23,
    M31, M32, M33 : Float32Array;

export const update_matrix3x3_arrays = (MATRIX3x3_ARRAYS: Array<FloatArray>) => [
    M11, M12, M13,
    M21, M22, M23,
    M31, M32, M33
] = MATRIX3x3_ARRAYS;

const VECTOR3D_ARRAYS: Array<FloatArray> = [null, null];
export const vector3Dbuffer = new FloatBuffer(
    VECTOR3D_ARRAYS,
    () => [
        X, Y, Z
    ] = VECTOR3D_ARRAYS
);


const get = (a: number, dim: 0|1|2): number => VECTOR3D_ARRAYS[dim][a];
const set = (a: number, dim: 0|1|2, value: number): void => {VECTOR3D_ARRAYS[dim][a] = value};

const set_to = (a: number, x: number, y: number, z: number): void => {
    X[a] = x;
    Y[a] = y;
    Z[a] = z;
};

const set_all_to = (a: number, value: number): void => {
    X[a] = Y[a] = Z[a] = value;
};

const set_from = (a: number, o: number): void => {
    X[a] = X[o];
    Y[a] = Y[o];
    Z[a] = Z[o];
};

const equals = (a: number, b: number) : boolean =>
    X[a].toFixed(PRECISION_DIGITS) ===
    X[b].toFixed(PRECISION_DIGITS) &&

    Y[a].toFixed(PRECISION_DIGITS) ===
    Y[b].toFixed(PRECISION_DIGITS) &&

    Z[a].toFixed(PRECISION_DIGITS) ===
    Z[b].toFixed(PRECISION_DIGITS);

const invert = (a: number, o: number): void => {
    X[o] = -X[a];
    Y[o] = -Y[a];
    Z[o] = -Z[a];
};

const invert_in_place = (a: number): void => {
    X[a] = -X[a];
    Y[a] = -Y[a];
    Z[a] = -Z[a];
};


const length = (a: number) : number => Math.hypot(
    X[a],
    Y[a],
    Z[a]
);

const distance = (a: number, b: number) : number => Math.hypot(
    (X[b] - X[a]),
    (Y[b] - Y[a]),
    (Z[b] - Z[a])
);

const length_squared = (a: number) : number =>
    X[a] ** 2 +
    Y[a] ** 2 +
    Z[a] ** 2;

const distance_squared = (a: number, b: number) : number => (
    (X[b] - X[a]) ** 2 +
    (Y[b] - Y[a]) ** 2 +
    (Z[b] - Z[a]) ** 2
);

const lerp = (a: number, b: number, o: number, t: number) : void => {
    X[o] = (1-t)*X[a] + t*(X[b]);
    Y[o] = (1-t)*Y[a] + t*(Y[b]);
    Z[o] = (1-t)*Z[a] + t*(Z[b]);
};

const add = (a: number, b: number, o: number) : void => {
    X[o] = X[a] + X[b];
    Y[o] = Y[a] + Y[b];
    Z[o] = Z[a] + Z[b];
};

const add_in_place = (a: number, b: number) : void => {
    X[a] += X[b];
    Y[a] += Y[b];
    Z[a] += Z[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    X[o] = X[a] - X[b];
    Y[o] = Y[a] - Y[b];
    Z[o] = Z[a] - Z[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    X[a] -= X[b];
    Y[a] -= Y[b];
    Z[a] -= Z[b];
};

const divide = (a: number, o: number, n: number) : void => {
    X[o] = X[a] / n;
    Y[o] = Y[a] / n;
    Z[o] = Z[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    X[a] /= n;
    Y[a] /= n;
    Z[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    X[o] = X[a] * n;
    Y[o] = Y[a] * n;
    Z[o] = Z[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    X[a] *= n;
    Y[a] *= n;
    Z[a] *= n;
};

const normalize = (a: number, o: number) : void => {
    t_n = Math.hypot(
        X[a],
        Y[a],
        Z[a]
    );

    X[o] = X[a] / t_n;
    Y[o] = Y[a] / t_n;
    Z[o] = Z[a] / t_n;
};

const normalize_in_place = (a: number) : void => {
    t_n = Math.hypot(
        X[a],
        Y[a],
        Z[a]
    );

    X[a] /= t_n;
    Y[a] /= t_n;
    Z[a] /= t_n;
};

const dot = (a: number, b: number) : number =>
    X[a] * X[b] +
    Y[a] * Y[b] +
    Z[a] * Z[b];

const cross = (a: number, b: number, o: number) : void => {
    X[o] = Y[a]*Z[b] - Z[a]*Y[b];
    Y[o] = Z[a]*X[b] - X[a]*Z[b];
    Z[o] = X[a]*Y[b] - Y[a]*X[b];
};

const cross_in_place = (a: number, b: number) : void => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];

    X[a] = t_y*Z[b] - t_z*Y[b];
    Y[a] = t_z*X[b] - t_x*Z[b];
    Z[a] = t_x*Y[b] - t_y*X[b];
};

const multiply = (a: number, b: number, o: number) : void => {
    X[o] = X[a]*M11[b] + Y[a]*M21[b] + Z[a]*M31[b];
    Y[o] = X[a]*M12[b] + Y[a]*M22[b] + Z[a]*M32[b];
    Z[o] = X[a]*M13[b] + Y[a]*M23[b] + Z[a]*M33[b];
};

const multiply_in_place = (a: number, b: number) : void => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];

    X[a] = t_x*M11[b] + t_y*M21[b] + t_z*M31[b];
    Y[a] = t_x*M12[b] + t_y*M22[b] + t_z*M32[b];
    Z[a] = t_x*M13[b] + t_y*M23[b] + t_z*M33[b];
};


const baseFunctions3D: IBaseFunctions = {
    buffer: vector3Dbuffer,

    get,
    set,
    set_to,
    set_from,
    set_all_to,

    equals,

    invert,
    invert_in_place
};

const baseArithmaticFunctions3D: IBaseArithmaticFunctions = {
    ...baseFunctions3D,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    multiply,
    multiply_in_place
};

const vectorFunctions3D: IVectorFunctions = {
    ...baseArithmaticFunctions3D,

    distance,
    distance_squared,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot,
    lerp
};

export interface IUVW
    extends ITexCoords
{
    setTo(u: number, v: number, w);

    w: number;
}
export class UVW
    extends TexCoords
    implements IUVW
{
    readonly _ = vectorFunctions3D;

    setTo(u: number, v: number, w: number): this {
        this._.set_to(this.id, u, v, w);

        return this;
    }

    set w(w: number) {Z[this.id] = w}
    get w(): number {return Z[this.id]}
}

export interface IRGB
    extends IColor
{
    setTo(r: number, g: number, b: number);
}

export class RGB
    extends Color
    implements IRGB
{
    readonly _ = vectorFunctions3D;

    setTo(r: number, g: number, b: number): this {
        this._.set_to(this.id, r, g, b);

        return this;
    }
}


export interface I3D
    extends ITransformableVector<IMatrix3x3>
{
    setTo(x: number, y: number, z: number): this;

    x: number;
    y: number;
    z: number;
}
export class Direction3D
    extends Direction<Matrix3x3>
    implements I3D
{
    readonly _ = vectorFunctions3D;

    cross(other: this): this {
        cross_in_place(this.id, other.id);

        return this;
    };

    crossedWith(other: this, out: this): this {
        if (out.is(this))
            return out.cross(other);

        cross(this.id, other.id, out.id);

        return out;
    }

    setTo(x: number, y: number, z: number): this {
        this._.set_to(this.id, x, y, z);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}
    set z(z: number) {Y[this.id] = z}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
    get z(): number {return Z[this.id]}
}

export class Position3D
    extends Position<Matrix3x3, Direction3D>
    implements I3D
{
    readonly _ = vectorFunctions3D;
    readonly _dir = dir3D;

    setTo(x: number, y: number, z: number): this {
        this._.set_to(this.id, x, y, z);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}
    set z(z: number) {Z[this.id] = z}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
    get z(): number {return Z[this.id]}
}

export const pos3D = (
    x: number|Direction3D = 0,
    y: number = 0,
    z: number = 0
): Position3D => x instanceof Direction3D ?
    new Position3D(x.buffer_offset, x.array_index) :
    new Position3D(vector3Dbuffer.tempID).setTo(x, y, z);

export const dir3D = (
    x: number|Position3D = 0,
    y: number = 0,
    z: number = 0
): Direction3D => x instanceof Position3D ?
    new Direction3D(x.buffer_offset, x.array_index) :
    new Direction3D(vector3Dbuffer.tempID).setTo(x, y, z);

export const rgb = (
    r: number = 0,
    g: number = 0,
    b: number = 0
): RGB => new RGB(vector3Dbuffer.tempID).setTo(r, g, b);

export const uvw = (
    u: number = 0,
    v: number = 0,
    w: number = 0
): UVW => new UVW(vector3Dbuffer.tempID).setTo(u, v, w);