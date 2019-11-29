import Matrix2x2 from "./mat2x2.js";
import {TypedArraysBuffer} from "../buffer.js";
import {Interpolatable, Position, Direction} from "./vec.js";
import {PRECISION_DIGITS} from "../constants.js";
import {Float2, Float4} from "../types.js";
import {IPosition2D, IDirection2D, IUV2D} from "./interfaces/classes.js";
import {IPositionFunctions, IDirectionFunctions, IInterpolateFunctions, IVectorFunctions} from "./interfaces/functions.js";

let t_x,
    t_y,
    t_n: number;

let X, Y,
    M11, M12,
    M21, M22: Float32Array;

export const update_matrix2x2_arrays = (MATRIX2x2_ARRAYS: Float4): Float4 => [
    M11, M12,
    M21, M22
] = MATRIX2x2_ARRAYS;

const VECTOR2D_ARRAYS: Float2 = [null, null];
const update_arrays = () => [X, Y] = VECTOR2D_ARRAYS;

export const vector2Dbuffer = new TypedArraysBuffer(2, Float32Array, update_arrays, VECTOR2D_ARRAYS);
const getTempID = (): number => vector2Dbuffer.allocateTemp();

const get = (a: number, dim: 0|1): number => VECTOR2D_ARRAYS[dim][a];
const set = (a: number, dim: 0|1, value: number): void => {VECTOR2D_ARRAYS[dim][a] = value};

const set_to = (a: number, x: number, y: number): void => {
    X[a] = x;
    Y[a] = y;
};

const set_all_to = (a: number, value: number): void => {
    X[a] = Y[a] = value;
};

const set_from = (a: number, o: number): void => {
    X[a] = X[o];
    Y[a] = Y[o];
};


const equals = (a: number, b: number): boolean =>
    X[a].toFixed(PRECISION_DIGITS) ===
    X[b].toFixed(PRECISION_DIGITS) &&

    Y[a].toFixed(PRECISION_DIGITS) ===
    Y[b].toFixed(PRECISION_DIGITS);

const invert = (a: number, o: number): void => {
    X[o] = -X[a];
    Y[o] = -Y[a];
};

const invert_in_place = (a: number): void => {
    X[a] = -X[a];
    Y[a] = -Y[a];
};

const length = (a: number): number => Math.hypot(
    X[a],
    Y[a]
);

const distance = (a: number, b: number): number => Math.hypot(
    (X[b] - X[a]),
    (Y[b] - Y[a])
);

const length_squared = (a: number): number =>
    X[a] ** 2 +
    Y[a] ** 2;

const distance_squared = (a: number, b: number): number => (
    (X[b] - X[a]) ** 2 +
    (Y[b] - Y[a]) ** 2
);

const lerp = (a: number, b: number, o: number, t: number): void => {
    X[o] = (1-t)*X[a] + t*(X[b]);
    Y[o] = (1-t)*Y[a] + t*(Y[b]);
};

const add = (a: number, b: number, o: number): void => {
    X[o] = X[a] + X[b];
    Y[o] = Y[a] + Y[b];
};

const add_in_place = (a: number, b: number): void => {
    X[a] += X[b];
    Y[a] += Y[b];
};

const subtract = (a: number, b: number, o: number): void => {
    X[o] = X[a] - X[b];
    Y[o] = Y[a] - Y[b];
};

const subtract_in_place = (a: number, b: number): void => {
    X[a] -= X[b];
    Y[a] -= Y[b];
};

const divide = (a: number, o: number, n: number): void => {
    X[o] = X[a] / n;
    Y[o] = Y[a] / n;
};

const divide_in_place = (a: number, n: number): void => {
    X[a] /= n;
    Y[a] /= n;
};

const scale = (a: number, o: number, n: number): void => {
    X[o] = X[a] * n;
    Y[o] = Y[a] * n;
};

const scale_in_place = (a: number, n: number): void => {
    X[a] *= n;
    Y[a] *= n;
};

const normalize = (a: number, o: number): void => {
    t_n = Math.hypot(
        X[a],
        Y[a]
    );

    X[o] = X[a] / t_n;
    Y[o] = Y[a] / t_n;
};

const normalize_in_place = (a: number): void => {
    t_n = Math.hypot(
        X[a],
        Y[a]
    );

    X[a] /= t_n;
    Y[a] /= t_n;
};

const dot = (a: number, b: number): number =>
    X[a] * X[b] +
    Y[a] * Y[b];

const multiply = (a: number, b: number, o: number): void => {
    X[o] = X[a]*M11[b] + Y[a]*M21[b];
    Y[o] = X[a]*M12[b] + Y[a]*M22[b];
};

const multiply_in_place = (a: number, b: number): void => {
    t_x = X[a];
    t_y = Y[a];

    X[a] = t_x*M11[b] + t_y*M21[b];
    Y[a] = t_x*M12[b] + t_y*M22[b];
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

const directionFunctions: IDirectionFunctions = {
    ...vectorFunctions,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot
};

export class UV2D extends Interpolatable implements IUV2D
{
    readonly _ = baseFunctions;

    setTo(u: number, v: number): this {
        set_to(this.id, u, v);

        return this;
    }

    set u(u: number) {X[this.id] = u}
    set v(v: number) {Y[this.id] = v}

    get u(): number {return X[this.id]}
    get v(): number {return Y[this.id]}
}

export class Direction2D extends Direction<Matrix2x2> implements IDirection2D
{
    readonly _ = directionFunctions;

    setTo(x: number, y: number): this {
        this._.set_to(this.id, x, y);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
}

export class Position2D extends Position<Matrix2x2, Direction2D> implements IPosition2D
{
    readonly _ = positionFunctions;

    protected readonly _dir = dir2D;

    setTo(x: number, y: number): this {
        this._.set_to(this.id, x, y);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
}

export const pos2D = (
    x: number|Direction2D = 0,
    y: number = 0
): Position2D => x instanceof Direction2D ?
    new Position2D(x.id) :
    new Position2D(getTempID()).setTo(x, y);

export const dir2D = (
    x: number|Position2D = 0,
    y: number = 0
): Direction2D => x instanceof Position2D ?
    new Direction2D(x.id) :
    new Direction2D(getTempID()).setTo(x, y);

export const uv = (
    u: number = 0,
    v: number = 0
): UV2D => new UV2D(getTempID()).setTo(u, v);