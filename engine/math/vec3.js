import { CACHE_LINE_SIZE, PRECISION_DIGITS, TEMP_STORAGE_SIZE } from "../constants.js";
import { Direction, Position, Vector } from "./vec.js";
let t_x, t_y, t_z, t_n;
let X, Y, Z, M11, M12, M13, M21, M22, M23, M31, M32, M33;
export const __setMatrixArrays = (m11, m12, m13, m21, m22, m23, m31, m32, m33) => {
    M11 = m11;
    M12 = m12;
    M13 = m13;
    M21 = m21;
    M22 = m22;
    M23 = m23;
    M31 = m31;
    M32 = m32;
    M33 = m33;
};
let SIZE = 0;
let TEMP_SIZE = TEMP_STORAGE_SIZE;
let id = 0;
let temp_id = 0;
export const getNextAvailableID = (temp = false) => {
    if (temp)
        return SIZE + (temp_id++ % TEMP_SIZE);
    if (id === SIZE)
        throw 'Buffer overflow!';
    return id++;
};
export const allocate = (size) => {
    SIZE = size;
    TEMP_SIZE += CACHE_LINE_SIZE - (size % CACHE_LINE_SIZE);
    size += TEMP_SIZE;
    X = new Float32Array(size);
    Y = new Float32Array(size);
    Z = new Float32Array(size);
};
const set_to = (a, x, y, z) => {
    X[a] = x;
    Y[a] = y;
    Z[a] = z;
};
const set_all_to = (a, value) => {
    X[a] = Y[a] = Z[a] = value;
};
const set_from = (a, o) => {
    X[a] = X[o];
    Y[a] = Y[o];
    Z[a] = Z[o];
};
const equals = (a, b) => X[a].toFixed(PRECISION_DIGITS) ===
    X[b].toFixed(PRECISION_DIGITS) &&
    Y[a].toFixed(PRECISION_DIGITS) ===
        Y[b].toFixed(PRECISION_DIGITS) &&
    Z[a].toFixed(PRECISION_DIGITS) ===
        Z[b].toFixed(PRECISION_DIGITS);
const invert = (a, o) => {
    X[o] = -X[a];
    Y[o] = -Y[a];
    Z[o] = -Z[a];
};
const invert_in_place = (a) => {
    X[a] = -X[a];
    Y[a] = -Y[a];
    Z[a] = -Z[a];
};
const length = (a) => Math.hypot(X[a], Y[a], Z[a]);
const distance = (a, b) => Math.hypot((X[b] - X[a]), (Y[b] - Y[a]), (Z[b] - Z[a]));
const length_squared = (a) => Math.pow(X[a], 2) +
    Math.pow(Y[a], 2) +
    Math.pow(Z[a], 2);
const distance_squared = (a, b) => (Math.pow((X[b] - X[a]), 2) +
    Math.pow((Y[b] - Y[a]), 2) +
    Math.pow((Z[b] - Z[a]), 2));
const lerp = (a, b, o, t) => {
    X[o] = (1 - t) * X[a] + t * (X[b]);
    Y[o] = (1 - t) * Y[a] + t * (Y[b]);
    Z[o] = (1 - t) * Z[a] + t * (Z[b]);
};
const add = (a, b, o) => {
    X[o] = X[a] + X[b];
    Y[o] = Y[a] + Y[b];
    Z[o] = Z[a] + Z[b];
};
const add_in_place = (a, b) => {
    X[a] += X[b];
    Y[a] += Y[b];
    Z[a] += Z[b];
};
const subtract = (a, b, o) => {
    X[o] = X[a] - X[b];
    Y[o] = Y[a] - Y[b];
    Z[o] = Z[a] - Z[b];
};
const subtract_in_place = (a, b) => {
    X[a] -= X[b];
    Y[a] -= Y[b];
    Z[a] -= Z[b];
};
const divide = (a, o, n) => {
    X[o] = X[a] / n;
    Y[o] = Y[a] / n;
    Z[o] = Z[a] / n;
};
const divide_in_place = (a, n) => {
    X[a] /= n;
    Y[a] /= n;
    Z[a] /= n;
};
const scale = (a, o, n) => {
    X[o] = X[a] * n;
    Y[o] = Y[a] * n;
    Z[o] = Z[a] * n;
};
const scale_in_place = (a, n) => {
    X[a] *= n;
    Y[a] *= n;
    Z[a] *= n;
};
const normalize = (a, o) => {
    t_n = Math.hypot(X[a], Y[a], Z[a]);
    X[o] = X[a] / t_n;
    Y[o] = Y[a] / t_n;
    Z[o] = Z[a] / t_n;
};
const normalize_in_place = (a) => {
    t_n = Math.hypot(X[a], Y[a], Z[a]);
    X[a] /= t_n;
    Y[a] /= t_n;
    Z[a] /= t_n;
};
const dot = (a, b) => X[a] * X[b] +
    Y[a] * Y[b] +
    Z[a] * Z[b];
const cross = (a, b, o) => {
    X[o] = Y[a] * Z[b] - Z[a] * Y[b];
    Y[o] = Z[a] * X[b] - X[a] * Z[b];
    Z[o] = X[a] * Y[b] - Y[a] * X[b];
};
const cross_in_place = (a, b) => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];
    X[a] = t_y * Z[b] - t_z * Y[b];
    Y[a] = t_z * X[b] - t_x * Z[b];
    Z[a] = t_x * Y[b] - t_y * X[b];
};
const multiply = (a, b, o) => {
    X[o] = X[a] * M11[b] + Y[a] * M21[b] + Z[a] * M31[b];
    Y[o] = X[a] * M12[b] + Y[a] * M22[b] + Z[a] * M32[b];
    Z[o] = X[a] * M13[b] + Y[a] * M23[b] + Z[a] * M33[b];
};
const multiply_in_place = (a, b) => {
    t_x = X[a];
    t_y = Y[a];
    t_z = Z[a];
    X[a] = t_x * M11[b] + t_y * M21[b] + t_z * M31[b];
    Y[a] = t_x * M12[b] + t_y * M22[b] + t_z * M32[b];
    Z[a] = t_x * M13[b] + t_y * M23[b] + t_z * M33[b];
};
const baseFunctions3D = {
    getNextAvailableID,
    allocate,
    set_to,
    set_from,
    set_all_to,
    equals,
    invert,
    invert_in_place
};
const baseArithmaticFunctions3D = Object.assign(Object.assign({}, baseFunctions3D), { add,
    add_in_place,
    subtract,
    subtract_in_place,
    divide,
    divide_in_place,
    scale,
    scale_in_place,
    multiply,
    multiply_in_place });
const vectorFunctions3D = Object.assign(Object.assign({}, baseArithmaticFunctions3D), { distance,
    distance_squared,
    length,
    length_squared,
    normalize,
    normalize_in_place,
    dot,
    lerp });
export class Direction3D extends Direction {
    constructor() {
        super(...arguments);
        this._ = vectorFunctions3D;
    }
    cross(other) {
        cross_in_place(this.id, other.id);
        return this;
    }
    ;
    crossedWith(other, out) {
        if (out.is(this))
            return out.cross(other);
        cross(this.id, other.id, out.id);
        return out;
    }
    setTo(x, y, z) {
        this._.set_to(this.id, x, y, z);
        return this;
    }
    set x(x) { X[this.id] = x; }
    set y(y) { Y[this.id] = y; }
    set z(z) { Y[this.id] = z; }
    get x() { return X[this.id]; }
    get y() { return Y[this.id]; }
    get z() { return Z[this.id]; }
}
export class Position3D extends Position {
    constructor() {
        super(...arguments);
        this._ = vectorFunctions3D;
        this._DirectionConstructor = Direction3D;
    }
    setTo(x, y, z) {
        this._.set_to(this.id, x, y, z);
        return this;
    }
    set x(x) { X[this.id] = x; }
    set y(y) { Y[this.id] = y; }
    set z(z) { Z[this.id] = z; }
    get x() { return X[this.id]; }
    get y() { return Y[this.id]; }
    get z() { return Z[this.id]; }
}
export class UVW extends Vector {
    constructor() {
        super(...arguments);
        this._ = vectorFunctions3D;
    }
    setTo(u, v, w) {
        this._.set_to(this.id, u, v, w);
        return this;
    }
    set u(u) { X[this.id] = u; }
    set v(v) { Y[this.id] = v; }
    set w(w) { Z[this.id] = w; }
    get u() { return X[this.id]; }
    get v() { return Y[this.id]; }
    get w() { return Z[this.id]; }
}
export class RGB extends Vector {
    constructor() {
        super(...arguments);
        this._ = vectorFunctions3D;
    }
    setTo(r, g, b) {
        this._.set_to(this.id, r, g, b);
        return this;
    }
    set r(r) { X[this.id] = r; }
    set g(g) { Y[this.id] = g; }
    set b(b) { Z[this.id] = b; }
    get r() { return X[this.id]; }
    get g() { return Y[this.id]; }
    get b() { return Z[this.id]; }
}
export function pos3(x_or_temp_or_direction = 0, y = 0, z = 0, temp = false) {
    if (x_or_temp_or_direction === undefined)
        return new Position3D(getNextAvailableID(true));
    if (typeof x_or_temp_or_direction === "number")
        return new Position3D(getNextAvailableID(temp)).setTo(x_or_temp_or_direction, y, z);
    if (typeof x_or_temp_or_direction === "boolean")
        return new Position3D(getNextAvailableID(x_or_temp_or_direction));
    return new Position3D(x_or_temp_or_direction.id);
}
export function dir3(x_or_temp_or_position = 0, y = 0, z = 0, temp = false) {
    if (x_or_temp_or_position === undefined)
        return new Direction3D(getNextAvailableID(true));
    if (typeof x_or_temp_or_position === "number")
        return new Direction3D(getNextAvailableID(temp)).setTo(x_or_temp_or_position, y, z);
    if (typeof x_or_temp_or_position === "boolean")
        return new Direction3D(getNextAvailableID(x_or_temp_or_position));
    return new Direction3D(x_or_temp_or_position.id);
}
export function uvw(u_or_temp = 0, v = 0, w = 0, temp = false) {
    if (typeof u_or_temp === "number")
        return new UVW(getNextAvailableID(temp)).setTo(u_or_temp, v, w);
    return new UVW(getNextAvailableID(u_or_temp));
}
export function rgb(r_or_temp = 0, g = 0, b = 0, temp = false) {
    if (typeof r_or_temp === "number")
        return new RGB(getNextAvailableID(temp)).setTo(r_or_temp, g, b);
    return new RGB(getNextAvailableID(r_or_temp));
}
//# sourceMappingURL=vec3.js.map