import Matrix4x4 from "./mat4x4.js";
import {Position, CrossedDirection, Interpolatable} from "./vec.js";
import {PRECISION_DIGITS} from "../constants.js";
import {FloatArray} from "../types.js";
import {ICrossFunctions, IInterpolateFunctions, IPositionFunctions, IVectorFunctions} from "./interfaces/functions.js";
import {IColor4D, IDirection4D, IPosition4D} from "./interfaces/classes.js";
import {FloatBuffer} from "../buffer.js";

let t_x,
    t_y,
    t_z,
    t_w,
    t_n: number;

let X, Y, Z, W,
    M11, M12, M13, M14,
    M21, M22, M23, M24,
    M31, M32, M33, M34,
    M41, M42, M43, M44: FloatArray;

const VECTOR4D_ARRAYS = [null, null, null, null];

const update_X = (x) => X = VECTOR4D_ARRAYS[0] = x;
const update_Y = (y) => Y = VECTOR4D_ARRAYS[1] = y;
const update_Z = (z) => Z = VECTOR4D_ARRAYS[2] = z;
const update_W = (w) => W = VECTOR4D_ARRAYS[3] = w;

export const update_vector4D_M11 = (m11) => M11 = m11;
export const update_vector4D_M12 = (m12) => M12 = m12;
export const update_vector4D_M13 = (m13) => M13 = m13;
export const update_vector4D_M14 = (m14) => M14 = m14;

export const update_vector4D_M21 = (m21) => M21 = m21;
export const update_vector4D_M22 = (m22) => M22 = m22;
export const update_vector4D_M23 = (m23) => M23 = m23;
export const update_vector4D_M24 = (m24) => M24 = m24;

export const update_vector4D_M31 = (m31) => M31 = m31;
export const update_vector4D_M32 = (m32) => M32 = m32;
export const update_vector4D_M33 = (m33) => M33 = m33;
export const update_vector4D_M34 = (m34) => M34 = m34;

export const update_vector4D_M41 = (m41) => M41 = m41;
export const update_vector4D_M42 = (m42) => M42 = m42;
export const update_vector4D_M43 = (m43) => M43 = m43;
export const update_vector4D_M44 = (m44) => M44 = m44;

const X_BUFFER = new FloatBuffer(update_X);
const Y_BUFFER = new FloatBuffer(update_Y);
const Z_BUFFER = new FloatBuffer(update_Z);
const W_BUFFER = new FloatBuffer(update_W);

let _temp_id: number;
const getTempID = (): number => {
    _temp_id = X_BUFFER.allocateTemp();
    Y_BUFFER.allocateTemp();
    Z_BUFFER.allocateTemp();
    W_BUFFER.allocateTemp();

    return _temp_id;
};


const get = (a: number, dim: 0|1|2|3): number => VECTOR4D_ARRAYS[dim][a];
const set = (a: number, dim: 0|1|2|3, value: number): void => {VECTOR4D_ARRAYS[dim][a] = value};

const set_to = (a: number, x: number, y: number, z: number, w: number): void => {
    X[a] = x;
    Y[a] = y;
    Z[a] = z;
    W[a] = w;
};

const set_all_to = (a: number, value: number): void => {
    X[a] = Y[a] = Z[a] = W[a] = value;
};

const set_from = (a: number, o: number): void => {
    X[a] = X[o];
    Y[a] = Y[o];
    Z[a] = Z[o];
    W[a] = W[o];
};

const equals = (a: number, b: number) : boolean =>
    X[a].toFixed(PRECISION_DIGITS) ===
    X[b].toFixed(PRECISION_DIGITS) &&

    Y[a].toFixed(PRECISION_DIGITS) ===
    Y[b].toFixed(PRECISION_DIGITS) &&

    Z[a].toFixed(PRECISION_DIGITS) ===
    Z[b].toFixed(PRECISION_DIGITS) &&

    W[a].toFixed(PRECISION_DIGITS) ===
    W[b].toFixed(PRECISION_DIGITS);

const invert = (a: number, o: number): void => {
    X[o] = -X[a];
    Y[o] = -Y[a];
    Z[o] = -Z[a];
    W[o] = -W[a];
};

const invert_in_place = (a: number): void => {
    X[a] = -X[a];
    Y[a] = -Y[a];
    Z[a] = -Z[a];
    W[a] = -W[a];
};

const length = (a: number) : number => Math.hypot(
    X[a],
    Y[a],
    Z[a],
    W[a]
);

const distance = (a: number, b: number) : number => Math.hypot(
    (X[b] - X[a]),
    (Y[b] - Y[a]),
    (Z[b] - Z[a]),
    (W[b] - W[a])
);

const length_squared = (a: number) : number =>
    X[a] ** 2 +
    Y[a] ** 2 +
    Z[a] ** 2 +
    W[a] ** 2;

const distance_squared = (a: number, b: number) : number => (
    (X[b] - X[a]) ** 2 +
    (Y[b] - Y[a]) ** 2 +
    (Z[b] - Z[a]) ** 2 +
    (W[b] - W[a]) ** 2
);

const lerp = (a: number, b: number, o: number, t: number) : void => {
    X[o] = (1-t)*X[a] + t*(X[b]);
    Y[o] = (1-t)*Y[a] + t*(Y[b]);
    Z[o] = (1-t)*Z[a] + t*(Z[b]);
    W[o] = (1-t)*W[a] + t*(W[b]);
};

const add = (a: number, b: number, o: number) : void => {
    X[o] = X[a] + X[b];
    Y[o] = Y[a] + Y[b];
    Z[o] = Z[a] + Z[b];
    W[o] = W[a] + W[b];
};

const add_in_place = (a: number, b: number) : void => {
    X[a] += X[b];
    Y[a] += Y[b];
    Z[a] += Z[b];
    W[a] += W[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    X[o] = X[a] - X[b];
    Y[o] = Y[a] - Y[b];
    Z[o] = Z[a] - Z[b];
    W[o] = W[a] - W[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    X[a] -= X[b];
    Y[a] -= Y[b];
    Z[a] -= Z[b];
    W[a] -= W[b];
};

const divide = (a: number, o: number, n: number) : void => {
    X[o] = X[a] / n;
    Y[o] = Y[a] / n;
    Z[o] = Z[a] / n;
    W[o] = W[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    X[a] /= n;
    Y[a] /= n;
    Z[a] /= n;
    W[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    X[o] = X[a] * n;
    Y[o] = Y[a] * n;
    Z[o] = Z[a] * n;
    W[o] = W[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    X[a] *= n;
    Y[a] *= n;
    Z[a] *= n;
    W[a] *= n;
};

const normalize = (a: number, o: number) : void => {
    t_n = Math.hypot(
        X[a],
        Y[a],
        Z[a],
        W[a]
    );

    X[o] = X[a] / t_n;
    Y[o] = Y[a] / t_n;
    Z[o] = Z[a] / t_n;
    W[o] = W[a] / t_n;
};

const normalize_in_place = (a: number) : void => {
    t_n = Math.hypot(
        X[a],
        Y[a],
        Z[a],
        W[a]
    );

    X[a] /= t_n;
    Y[a] /= t_n;
    Z[a] /= t_n;
    W[a] /= t_n;
};

const dot = (a: number, b: number) : number =>
    X[a] * X[b] +
    Y[a] * Y[b] +
    Z[a] * Z[b] +
    W[a] * W[b];

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

const in_view = (x: number, y: number, z: number, w: number, n: number, f: number) : boolean =>
    n <= z && z <= f &&
    -w <= y && y <= w &&
    -w <= x && x <= w;

const out_of_view = (x: number, y: number, z: number, w: number, n: number, f: number) : boolean =>
    n > z || z > f ||
    -w > y || y > w ||
    -w > x  || x > w;

const multiply = (a: number, b: number, o: number) : void => {
    X[o] = X[a]*M11[b] + Y[a]*M21[b] + Z[a]*M31[b] + W[a]*M41[b];
    Y[o] = X[a]*M12[b] + Y[a]*M22[b] + Z[a]*M32[b] + W[a]*M42[b];
    Z[o] = X[a]*M13[b] + Y[a]*M23[b] + Z[a]*M33[b] + W[a]*M43[b];
    W[o] = X[a]*M14[b] + Y[a]*M24[b] + Z[a]*M34[b] + W[a]*M44[b];
};

const multiply_in_place = (a: number, b: number) : void => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];
    t_w = W[a];

    X[a] = t_x*M11[b] + t_y*M21[b] + t_z*M31[b] + t_w*M41[b];
    Y[a] = t_x*M12[b] + t_y*M22[b] + t_z*M32[b] + t_w*M42[b];
    Z[a] = t_x*M13[b] + t_y*M23[b] + t_z*M33[b] + t_w*M43[b];
    W[a] = t_x*M14[b] + t_y*M24[b] + t_z*M34[b] + t_w*M44[b];
};

const baseFunctions: IInterpolateFunctions = {
    getTempID,
    get,
    set,

    set_to,
    set_from,
    set_all_to,

    equals,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    invert,
    invert_in_place,

    lerp
};

const vectorFunctions: IVectorFunctions = {
    ...baseFunctions,

    multiply,
    multiply_in_place,
};

const positionFunctions: IPositionFunctions = {
    ...vectorFunctions,

    distance,
    distance_squared
};

const directionFunctions: ICrossFunctions = {
    ...vectorFunctions,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot,
    cross,
    cross_in_place
};


export class Color4D extends Interpolatable implements IColor4D
{
    readonly _ = baseFunctions;

    setTo(r: number, g: number, b: number, a: number): this {
        set_to(this.id, r, g, b, a);

        return this;
    }

    set r(r: number) {X[this.id] = r}
    set g(g: number) {Y[this.id] = g}
    set b(b: number) {Z[this.id] = b}
    set a(a: number) {W[this.id] = a}

    get r(): number {return X[this.id]}
    get g(): number {return Y[this.id]}
    get b(): number {return Z[this.id]}
    get a(): number {return W[this.id]}
}
export class Direction4D extends CrossedDirection<Matrix4x4> implements IDirection4D
{
    readonly _ = directionFunctions;

    setTo(x: number, y: number, z: number, w: number): this {
        this._.set_to(this.id, x, y, z, w);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}
    set z(z: number) {Y[this.id] = z}
    set w(w: number) {Y[this.id] = w}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
    get z(): number {return Z[this.id]}
    get w(): number {return W[this.id]}
}

export class Position4D extends Position<Matrix4x4, Direction4D> implements IPosition4D
{
    readonly _ = positionFunctions;

    protected readonly _dir = dir4D;

    readonly isInView = (near: number = 0, far: number = 1) : boolean => in_view(
        X[this.id],
        Y[this.id],
        Z[this.id],
        W[this.id],
        near,
        far
    );

    readonly isOutOfView = (near: number = 0, far: number = 1) : boolean => out_of_view(
        X[this.id],
        Y[this.id],
        Z[this.id],
        W[this.id],
        near,
        far
    );

    toNDC = () : this => this.divideBy(W[this.id]);

    setTo(x: number, y: number, z: number, w: number): this {
        this._.set_to(this.id, x, y, z, w);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}
    set z(z: number) {Y[this.id] = z}
    set w(w: number) {Y[this.id] = w}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
    get z(): number {return Z[this.id]}
    get w(): number {return W[this.id]}
}

export const pos4D = (
    x: number|Direction4D = 0,
    y: number = 0,
    z: number = 0,
    w: number = 0
): Position4D => x instanceof Direction4D ?
    new Position4D(x.id) :
    new Position4D(getTempID()).setTo(x, y, z, w);

export const dir4D = (
    x: number|Position4D = 0,
    y: number = 0,
    z: number = 0,
    w: number = 0
): Direction4D => x instanceof Position4D ?
    new Direction4D(x.id) :
    new Direction4D(getTempID()).setTo(x, y, z, w);

export const rgba = (
    r: number = 0,
    g: number = 0,
    b: number = 0,
    a: number = 0
): Color4D => new Color4D(getTempID()).setTo(r, g, b, a);