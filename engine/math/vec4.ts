import Matrix4x4 from "./mat4x4.js";
import {CACHE_LINE_SIZE, PRECISION_DIGITS, TEMP_STORAGE_SIZE} from "../constants.js";
import {IBaseFunctions, IBaseArithmaticFunctions, IVectorFunctions, I4D, IRGBA} from "./interfaces.js";
import {Direction, Position, Vector} from "./vec.js";

let t_x,
    t_y,
    t_z,
    t_w,
    t_n: number;

let X, Y, Z, W,
    M11, M12, M13, M14,
    M21, M22, M23, M24,
    M31, M32, M33, M34,
    M41, M42, M43, M44: Float32Array;

export const __setMatrixArrays = (
    m11: Float32Array,  m12: Float32Array, m13: Float32Array, m14: Float32Array,
    m21: Float32Array,  m22: Float32Array, m23: Float32Array, m24: Float32Array,
    m31: Float32Array,  m32: Float32Array, m33: Float32Array, m34: Float32Array,
    m41: Float32Array,  m42: Float32Array, m43: Float32Array, m44: Float32Array
) => {
    M11 = m11;  M12 = m12;  M13 = m13;  M14 = m14;
    M21 = m21;  M22 = m22;  M23 = m23;  M24 = m24;
    M31 = m31;  M32 = m32;  M33 = m33;  M34 = m34;
    M41 = m41;  M42 = m42;  M43 = m43;  M44 = m44;
};

let SIZE = 0;
let TEMP_SIZE = TEMP_STORAGE_SIZE;

let id = 0;
let temp_id = 0;

export const getNextAvailableID = (temp: boolean = false): number => {
    if (temp)
        return SIZE + (temp_id++ % TEMP_SIZE);

    if (id === SIZE)
        throw 'Buffer overflow!';

    return id++;
};
export const allocate = (size: number): void => {
    SIZE = size;
    TEMP_SIZE += CACHE_LINE_SIZE - (size % CACHE_LINE_SIZE);
    size += TEMP_SIZE;

    X = new Float32Array(size);
    Y = new Float32Array(size);
    Z = new Float32Array(size);
    W = new Float32Array(size);
};

const set_to = (a: number, x: number, y: number, z: number): void => {
    X[a] = x;
    Y[a] = y;
    Z[a] = z;
    W[a] = z;
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


const baseFunctions4D: IBaseFunctions = {
    getNextAvailableID,
    allocate,

    set_to,
    set_from,
    set_all_to,

    equals,

    invert,
    invert_in_place
};

const baseArithmaticFunctions4D: IBaseArithmaticFunctions = {
    ...baseFunctions4D,

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

const vectorFunctions4D: IVectorFunctions = {
    ...baseArithmaticFunctions4D,

    distance,
    distance_squared,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot,
    lerp
};

export class Direction4D extends Direction<Matrix4x4> implements I4D {
    readonly _ = vectorFunctions4D;

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

export class Position4D extends Position<Matrix4x4, Direction4D> implements I4D {
    readonly _ = vectorFunctions4D;
    protected readonly _DirectionConstructor = Direction4D;

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

export class RGBA extends Vector implements IRGBA {
    readonly _ = vectorFunctions4D;

    setTo(r: number, g: number, b: number, a: number): this {
        this._.set_to(this.id, r, g, b, a);

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

export function pos4(temp: boolean): Position4D;
export function pos4(direction: Direction4D): Position4D;
export function pos4(
    x: number,
    y: number,
    z: number,
    w: number,
    temp: boolean
): Position4D;
export function pos4(
    x_or_temp_or_direction: number|boolean|Direction4D = 0,
    y: number = 0,
    z: number = 0,
    w: number = 0,
    temp: boolean = false
): Position4D {
    if (x_or_temp_or_direction === undefined)
        return new Position4D(getNextAvailableID(true));

    if (typeof x_or_temp_or_direction === "number")
        return new Position4D(getNextAvailableID(temp)).setTo(x_or_temp_or_direction, y, z, w);

    if (typeof x_or_temp_or_direction === "boolean")
        return new Position4D(getNextAvailableID(x_or_temp_or_direction));

    return new Position4D(x_or_temp_or_direction.id);
}

export function dir4(temp: boolean): Direction4D;
export function dir4(position: Position4D): Direction4D;
export function dir4(
    x: number,
    y: number,
    z: number,
    w: number,
    temp: boolean
): Direction4D;
export function dir4(
    x_or_temp_or_position: number|boolean|Position4D = 0,
    y: number = 0,
    z: number = 0,
    w: number = 0,

    temp: boolean = false
): Direction4D {
    if (x_or_temp_or_position === undefined)
        return new Direction4D(getNextAvailableID(true));

    if (typeof x_or_temp_or_position === "number")
        return new Direction4D(getNextAvailableID(temp)).setTo(x_or_temp_or_position, y, z, w);

    if (typeof x_or_temp_or_position === "boolean")
        return new Direction4D(getNextAvailableID(x_or_temp_or_position));

    return new Direction4D(x_or_temp_or_position.id);
}

export function rgba(temp: boolean): RGBA;
export function rgba(
    r_or_temp: number|boolean = 0,
    g: number = 0,
    b: number = 0,
    a: number = 0,
    temp: boolean = false
): RGBA {
    if (typeof r_or_temp === "number")
        return new RGBA(getNextAvailableID(temp)).setTo(r_or_temp, g, b, a);

    return new RGBA(getNextAvailableID(r_or_temp));
}