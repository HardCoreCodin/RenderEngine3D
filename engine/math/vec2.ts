import {PRECISION_DIGITS} from "../constants.js";
import {Direction, ITexCoords, ITransformableVector, IVectorFunctions, Position, Vector} from "./vec.js";
import Matrix2x2, {IMatrix2x2} from "./mat2x2.js";
import {IBaseArithmaticFunctions, IBaseFunctions} from "./base.js";
import {FloatBuffer} from "../allocators.js";
import {FloatArray} from "../types.js";

let t_x,
    t_y,
    t_n: number;

let X, Y,
    M11, M12,
    M21, M22: FloatArray;

export const update_matrix2x2_arrays = (MATRIX2x2_ARRAYS: Array<FloatArray>) => [
    M11, M12,
    M21, M22
] = MATRIX2x2_ARRAYS;

const VECTOR2D_ARRAYS: Array<FloatArray> = [null, null];
export const vector2Dbuffer = new FloatBuffer(
    VECTOR2D_ARRAYS,
    () => [
        X, Y
    ] = VECTOR2D_ARRAYS
);

//
// const DIMENTION: DIM = DIM._2D;
// const TEMPORARY_STORAGE_LENGTH = CACHE_LINE_SIZE * 16;
// // const VECTOR2D_BUFFERS: [Float32Array, Float32Array] = [null, null];
// const BUFFERS_BEFORE_INIT: [Float32Array, Float32Array] = [null, null];
// let BUFFER_LENGTH = 0;
//
// let temporary_storage_offset = 0;
// let current_storage_offset = TEMPORARY_STORAGE_LENGTH;
// export const allocateTemporaryArray2D = (): number =>
//     temporary_storage_offset++ % TEMPORARY_STORAGE_LENGTH;
//
// let offset_before_allocation: number;
// export const allocateArray2D = (length: number): number => {
//     offset_before_allocation = current_storage_offset;
//     current_storage_offset += length;
//
//     if (current_storage_offset > BUFFER_LENGTH)
//         throw '2D Buffer overflow!';
//
//     return offset_before_allocation;
// };
//
// let i: number;
// export const initBuffer2D = (length: number): void => {
//     BUFFER_LENGTH = TEMPORARY_STORAGE_LENGTH + length;
//
//     for (i= 0; i< DIMENTION; i++)
//         BUFFERS_BEFORE_INIT[i] = VECTOR2D_BUFFERS[i];
//
//     X = VECTOR2D_BUFFERS[0] = new Float32Array(BUFFER_LENGTH);
//     Y = VECTOR2D_BUFFERS[1] = new Float32Array(BUFFER_LENGTH);
//
//     if (BUFFERS_BEFORE_INIT[0] !== null)
//         for (i = 0; i < DIMENTION; i++)
//             VECTOR2D_BUFFERS[i].set(BUFFERS_BEFORE_INIT[i]);
// };

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

const baseFunctions2D: IBaseFunctions = {
    buffer: vector2Dbuffer,

    get,
    set,
    set_to,
    set_from,
    set_all_to,

    equals,

    invert,
    invert_in_place
};

const baseArithmaticFunctions2D: IBaseArithmaticFunctions = {
    ...baseFunctions2D,

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

const vectorFunctions2D: IVectorFunctions = {
    ...baseArithmaticFunctions2D,

    distance,
    distance_squared,

    length,
    length_squared,

    normalize,
    normalize_in_place,

    dot,
    lerp
};

export interface IUV
    extends ITexCoords
{
    setTo(u: number, v: number);
}
export class UV
    extends Vector
    implements IUV
{
    readonly _ = vectorFunctions2D;

    setTo(u: number, v: number): this {
        this._.set_to(this.id, u, v);

        return this;
    }

    set u(u: number) {X[this.id] = u}
    set v(v: number) {Y[this.id] = v}

    get u(): number {return X[this.id]}
    get v(): number {return Y[this.id]}
}

export interface I2D
    extends ITransformableVector<IMatrix2x2>
{
    setTo(x: number, y: number): this;

    x: number;
    y: number;
}
export class Direction2D
    extends Direction<Matrix2x2>
    implements I2D
{
    readonly _ = vectorFunctions2D;

    setTo(x: number, y: number): this {
        this._.set_to(this.id, x, y);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
}
export class Position2D
    extends Position<Matrix2x2, Direction2D>
    implements I2D
{
    readonly _ = vectorFunctions2D;
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
    new Position2D(x.buffer_offset, x.array_index) :
    new Position2D(vector2Dbuffer.tempID).setTo(x, y);

export const dir2D = (
    x: number|Position2D = 0,
    y: number = 0
): Direction2D => x instanceof Position2D ?
    new Direction2D(x.buffer_offset, x.array_index) :
    new Direction2D(vector2Dbuffer.tempID).setTo(x, y);

export const uv = (
    u: number = 0,
    v: number = 0
): UV => new UV(vector2Dbuffer.tempID).setTo(u, v);