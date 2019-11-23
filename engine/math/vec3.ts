import Matrix3x3 from "./mat3x3.js";
import {Position, Interpolatable, CrossedDirection} from "./vec.js";
import {PRECISION_DIGITS} from "../constants.js";
import {ICrossFunctions, IInterpolateFunctions, IPositionFunctions, IVectorFunctions} from "./interfaces/functions.js";
import {IColor3D, IDirection3D, IPosition3D, IUV3D} from "./interfaces/classes.js";
import {FloatBuffer} from "../buffer.js";

let t_x,
    t_y,
    t_z,
    t_n: number;

let X, Y, Z,
    M11, M12, M13,
    M21, M22, M23,
    M31, M32, M33 : Float32Array;

const VECTOR3D_ARRAYS = [null, null, null];

const update_X = (x) => X = VECTOR3D_ARRAYS[0] = x;
const update_Y = (y) => Y = VECTOR3D_ARRAYS[1] = y;
const update_Z = (z) => Z = VECTOR3D_ARRAYS[2] = z;

export const update_vector3D_M11 = (m11) => M11 = m11;
export const update_vector3D_M12 = (m12) => M12 = m12;
export const update_vector3D_M13 = (m13) => M13 = m13;

export const update_vector3D_M21 = (m21) => M21 = m21;
export const update_vector3D_M22 = (m22) => M22 = m22;
export const update_vector3D_M23 = (m23) => M23 = m23;

export const update_vector3D_M31 = (m31) => M31 = m31;
export const update_vector3D_M32 = (m32) => M32 = m32;
export const update_vector3D_M33 = (m33) => M33 = m33;

const X_BUFFER = new FloatBuffer(update_X);
const Y_BUFFER = new FloatBuffer(update_Y);
const Z_BUFFER = new FloatBuffer(update_Z);

let _temp_id: number;
const getTempID = (): number => {
    _temp_id = X_BUFFER.allocateTemp();
    Y_BUFFER.allocateTemp();
    Z_BUFFER.allocateTemp();

    return _temp_id;
};

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

type F = Float32Array;
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

export class UV3D extends Interpolatable implements IUV3D
{
    readonly _ = baseFunctions;

    setTo(u: number, v: number, w: number): this {
        set_to(this.id, u, v, w);

        return this;
    }

    set u(u: number) {X[this.id] = u}
    set v(v: number) {Y[this.id] = v}
    set w(w: number) {Z[this.id] = w}

    get u(): number {return X[this.id]}
    get v(): number {return Y[this.id]}
    get w(): number {return Z[this.id]}
}

export class Color3D extends Interpolatable implements IColor3D
{
    readonly _ = baseFunctions;

    setTo(r: number, g: number, b: number): this {
        set_to(this.id, r, g, b);

        return this;
    }

    set r(r: number) {X[this.id] = r}
    set g(g: number) {Y[this.id] = g}
    set b(b: number) {Z[this.id] = b}

    get r(): number {return X[this.id]}
    get g(): number {return Y[this.id]}
    get b(): number {return Z[this.id]}
}

export class Direction3D extends CrossedDirection<Matrix3x3> implements IDirection3D
{
    readonly _ = directionFunctions;

    setTo(x: number, y: number, z:number): this {
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

export class Position3D extends Position<Matrix3x3, Direction3D> implements IPosition3D
{
    readonly _ = positionFunctions;

    protected readonly _dir = dir3D;

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
    new Position3D(x.id) :
    new Position3D(getTempID()).setTo(x, y, z);

export const dir3D = (
    x: number|Position3D = 0,
    y: number = 0,
    z: number = 0
): Direction3D => x instanceof Position3D ?
    new Direction3D(x.id) :
    new Direction3D(getTempID()).setTo(x, y, z);

export const rgb = (
    r: number = 0,
    g: number = 0,
    b: number = 0
): Color3D => new Color3D(getTempID()).setTo(r, g, b);

export const uvw = (
    u: number = 0,
    v: number = 0,
    w: number = 0
): UV3D => new UV3D(getTempID()).setTo(u, v, w);