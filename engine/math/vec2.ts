import {CACHE_LINE_SIZE, PRECISION_DIGITS, TEMP_STORAGE_SIZE} from "../constants.js";
import {IVectorFunctions, IBaseFunctions, IBaseArithmaticFunctions, I2D, IUV} from "./interfaces.js";
import {Direction, Position, Vector} from "./vec.js";
import Matrix2x2 from "./mat2x2.js";

let t_x,
    t_y,
    t_n: number;
let X, Y,
    M11, M12,
    M21, M22: Float32Array;

export const __setMatrixArrays = (
    m11: Float32Array,  m12: Float32Array,
    m21: Float32Array,  m22: Float32Array
) => {
    M11 = m11;  M12 = m12;
    M21 = m21;  M22 = m22;
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
};

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
    getNextAvailableID,
    allocate,

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

export class Direction2D extends Direction<Matrix2x2> implements I2D {
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

export class Position2D extends Position<Matrix2x2, Direction2D> implements I2D {
    readonly _ = vectorFunctions2D;
    protected readonly _DirectionConstructor = Direction2D;

    setTo(x: number, y: number): this {
        this._.set_to(this.id, x, y);

        return this;
    }

    set x(x: number) {X[this.id] = x}
    set y(y: number) {Y[this.id] = y}

    get x(): number {return X[this.id]}
    get y(): number {return Y[this.id]}
}

export class UV extends Vector implements IUV {
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

export function pos2(temp: boolean): Position2D;
export function pos2(direction: Direction2D): Position2D;
export function pos2(
    x: number,
    y: number,
    temp: boolean
): Position2D;
export function pos2(
    x_or_temp_or_direction: number|boolean|Direction2D = 0,
    y: number = 0,
    temp: boolean = false
): Position2D {
    if (x_or_temp_or_direction === undefined)
        return new Position2D(getNextAvailableID(true));

    if (typeof x_or_temp_or_direction === "number")
        return new Position2D(getNextAvailableID(temp)).setTo(x_or_temp_or_direction, y);

    if (typeof x_or_temp_or_direction === "boolean")
        return new Position2D(getNextAvailableID(x_or_temp_or_direction));

    return new Position2D(x_or_temp_or_direction.id);
}

export function dir2(temp: boolean): Direction2D;
export function dir2(position: Position2D): Direction2D;
export function dir2(
    x: number,
    y: number,
    temp: boolean
): Direction2D;
export function dir2(
    x_or_temp_or_position: number|boolean|Position2D  = 0,
    y: number = 0,
    temp: boolean = false
): Direction2D {
    if (x_or_temp_or_position === undefined)
        return new Direction2D(getNextAvailableID(true));

    if (typeof x_or_temp_or_position === "number")
        return new Direction2D(getNextAvailableID(temp)).setTo(x_or_temp_or_position, y);

    if (typeof x_or_temp_or_position === "boolean")
        return new Direction2D(getNextAvailableID(x_or_temp_or_position));

    return new Direction2D(x_or_temp_or_position.id);
}

export function uv(temp: boolean): UV;
export function uv(
    u_or_temp: number|boolean = 0,
    v: number = 0,
    temp: boolean = false
): UV {
    if (typeof u_or_temp === "number")
        return new UV(getNextAvailableID(temp)).setTo(u_or_temp, v);

    return new UV(getNextAvailableID(u_or_temp));
}