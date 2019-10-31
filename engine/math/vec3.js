import { PRECISION_DIGITS } from "../constants.js";
import { ColorMixin, DirectionMixin, PositionMixin, Vector } from "./base.js";
let temp_number;
const temp_lhs = new Float32Array(3);
const temp_rhs = new Float32Array(3);
const temp_matrix = new Float32Array(9);
export const length = (a, i) => Math.hypot(a[0][i], a[1][i], a[2][i]);
export const distance = (a, i, b, j) => Math.hypot((b[0][j] - a[0][i]), (b[1][j] - a[1][i]), (b[2][j] - a[2][i]));
export const length_squared = (a, i) => (Math.pow(a[0][i], 2) +
    Math.pow(a[1][i], 2) +
    Math.pow(a[2][i], 2));
export const distance_squared = (a, i, b, j) => (Math.pow((b[0][j] - a[0][i]), 2) +
    Math.pow((b[1][j] - a[1][i]), 2) +
    Math.pow((b[2][j] - a[2][i]), 2));
export const equals = (a, i, b, j) => {
    if (i === j && ((Object.is(a, b)) || ((Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
        (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
        (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer)))))
        return true;
    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS))
        return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS))
        return false;
    return true;
};
export const linearly_interpolate = (a, i, b, j, t, o, k) => {
    o[0][k] = (1 - t) * a[0][i] + t * (b[0][j]);
    o[1][k] = (1 - t) * a[1][i] + t * (b[1][j]);
    o[2][k] = (1 - t) * a[2][i] + t * (b[2][j]);
};
export const add = (a, i, b, j, o, k) => {
    o[0][k] = a[0][i] + b[0][j];
    o[1][k] = a[1][i] + b[1][j];
    o[2][k] = a[2][i] + b[2][j];
};
export const add_in_place = (a, i, b, j) => {
    a[0][i] += b[0][j];
    a[1][i] += b[1][j];
    a[2][i] += b[2][j];
};
export const subtract = (a, i, b, j, o, k) => {
    o[0][k] = a[0][i] - b[0][j];
    o[1][k] = a[1][i] - b[1][j];
    o[2][k] = a[2][i] - b[2][j];
};
export const subtract_in_place = (a, i, b, j) => {
    a[0][i] -= b[0][j];
    a[1][i] -= b[1][j];
    a[2][i] -= b[2][j];
};
export const divide = (a, i, n, o, k) => {
    o[0][k] = a[0][i] / n;
    o[1][k] = a[1][i] / n;
    o[2][k] = a[2][i] / n;
};
export const divide_in_place = (a, i, n) => {
    a[0][i] /= n;
    a[1][i] /= n;
    a[2][i] /= n;
};
export const scale = (a, i, n, o, k) => {
    o[0][k] = a[0][i] * n;
    o[1][k] = a[1][i] * n;
    o[2][k] = a[2][i] * n;
};
export const scale_in_place = (a, i, n) => {
    a[0][i] *= n;
    a[1][i] *= n;
    a[2][i] *= n;
};
export const normalize = (a, i, o, k) => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i]);
    o[0][k] = a[0][i] / temp_number;
    o[1][k] = a[1][i] / temp_number;
    o[2][k] = a[2][i] / temp_number;
};
export const normalize_in_place = (a, i) => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i]);
    a[0][i] /= temp_number;
    a[1][i] /= temp_number;
    a[2][i] /= temp_number;
};
export const dot = (a, i, b, j) => (a[0][i] * b[0][j] +
    a[1][i] * b[1][j] +
    a[2][i] * b[2][j]);
export const cross = (a, i, b, j, o, k) => {
    if ((k === i && ((Object.is(o, a)) || ((Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
        (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
        (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer))))) || (k === j && ((Object.is(o, b)) || ((Object.is(o[0], b[0]) || Object.is(o[0].buffer, b[0].buffer)) &&
        (Object.is(o[1], b[1]) || Object.is(o[1].buffer, b[1].buffer)) &&
        (Object.is(o[2], b[2]) || Object.is(o[2].buffer, b[2].buffer))))))
        throw `Can not cross - shared buffer detected! (Use cross_in_place)`;
    o[0][k] = a[1][i] * b[2][j] - a[2][i] * b[1][j];
    o[1][k] = a[2][i] * b[0][j] - a[0][i] * b[2][j];
    o[2][k] = a[0][i] * b[1][j] - a[1][i] * b[0][j];
};
export const cross_in_place = (a, i, b, j) => {
    temp_lhs[0] = a[0][i];
    temp_lhs[1] = a[1][i];
    temp_lhs[2] = a[2][i];
    temp_rhs[0] = b[0][j];
    temp_rhs[1] = b[1][j];
    temp_rhs[2] = b[2][j];
    a[0][i] = temp_lhs[1] * temp_rhs[2] - temp_lhs[2] * temp_rhs[1];
    a[1][i] = temp_lhs[2] * temp_rhs[0] - temp_lhs[0] * temp_rhs[2];
    a[2][i] = temp_lhs[0] * temp_rhs[1] - temp_lhs[1] * temp_rhs[0];
};
export const multiply = (a, i, b, j, o, k) => {
    if (k === i && ((Object.is(o, a)) || ((Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
        (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
        (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer)))))
        throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;
    o[0][k] = a[0][i] * b[0][j] + a[1][i] * b[3][j] + a[2][i] * b[6][j];
    o[1][k] = a[0][i] * b[1][j] + a[1][i] * b[4][j] + a[2][i] * b[7][j];
    o[2][k] = a[0][i] * b[2][j] + a[1][i] * b[5][j] + a[2][i] * b[8][j];
};
export const multiply_in_place = (a, i, b, j) => {
    temp_lhs[0] = a[0][i];
    temp_lhs[1] = a[1][i];
    temp_lhs[2] = a[2][i];
    temp_matrix[0] = b[0][j];
    temp_matrix[1] = b[1][j];
    temp_matrix[2] = b[2][j];
    temp_matrix[3] = b[3][j];
    temp_matrix[4] = b[4][j];
    temp_matrix[5] = b[5][j];
    temp_matrix[6] = b[6][j];
    temp_matrix[7] = b[7][j];
    temp_matrix[8] = b[8][j];
    a[0][i] = temp_lhs[0] * temp_matrix[0] + temp_lhs[1] * temp_matrix[3] + temp_lhs[2] * temp_matrix[6];
    a[1][i] = temp_lhs[0] * temp_matrix[1] + temp_lhs[1] * temp_matrix[4] + temp_lhs[2] * temp_matrix[7];
    a[2][i] = temp_lhs[0] * temp_matrix[2] + temp_lhs[1] * temp_matrix[5] + temp_lhs[2] * temp_matrix[8];
};
class Vector3D extends Vector {
    constructor() {
        super(...arguments);
        this._dim = 3;
        this._equals = equals;
        this._linearly_interpolate = linearly_interpolate;
        this._add = add;
        this._add_in_place = add_in_place;
        this._subtract = subtract;
        this._subtract_in_place = subtract_in_place;
        this._scale = scale;
        this._scale_in_place = scale_in_place;
        this._divide = divide;
        this._divide_in_place = divide_in_place;
        this._multiply = multiply;
        this._multiply_in_place = multiply_in_place;
    }
}
export class Color3D extends ColorMixin(Vector3D) {
    set r(r) { this.data[0][this.id] = r; }
    set g(g) { this.data[0][this.id] = g; }
    set b(b) { this.data[2][this.id] = b; }
    get r() { return this.data[0][this.id]; }
    get g() { return this.data[1][this.id]; }
    get b() { return this.data[2][this.id]; }
}
export class Position3D extends PositionMixin(Vector3D) {
    set x(x) { this.data[0][this.id] = x; }
    set y(y) { this.data[1][this.id] = y; }
    set z(z) { this.data[2][this.id] = z; }
    get x() { return this.data[0][this.id]; }
    get y() { return this.data[1][this.id]; }
    get z() { return this.data[2][this.id]; }
}
export class Direction3D extends DirectionMixin(Vector3D) {
    constructor() {
        super(...arguments);
        this._dot = dot;
        this._length = length;
        this._normalize = normalize;
        this._normalize_in_place = normalize_in_place;
        this._cross = cross;
        this._cross_in_place = cross_in_place;
    }
    set x(x) { this.data[0][this.id] = x; }
    set y(y) { this.data[1][this.id] = y; }
    set z(z) { this.data[2][this.id] = z; }
    get x() { return this.data[0][this.id]; }
    get y() { return this.data[1][this.id]; }
    get z() { return this.data[2][this.id]; }
}
// type Constructor<T> = new(...args: any[]) => T;
//
// export function Vector3DFunctions<T extends Constructor<{}>>(BaseClass: T) {
//     return class extends BaseClass {
//         protected _dim: number = 3;
//
//         protected _equals: ff_b = equals;
//         protected _linearly_interpolate: ffnf_v = linearly_interpolate;
//
//         protected _add: fff_v = add;
//         protected _add_in_place: ff_v = add_in_place;
//
//         protected _subtract: fff_v = subtract;
//         protected _subtract_in_place: ff_v = subtract_in_place;
//
//         protected _scale: fnf_v = scale;
//         protected _scale_in_place: fn_v = scale_in_place;
//
//         protected _divide: fnf_v = divide;
//         protected _divide_in_place: fn_v = divide_in_place;
//
//         protected _multiply : fmf_v = multiply;
//         protected _multiply_in_place : fm_v = multiply_in_place;
//     }
// }
// export class Position3D extends Vector3DFunctions(Position) {
//     set x(x) {this.data[0][this.id] = x}
//     set y(y) {this.data[1][this.id] = y}
//     set z(z) {this.data[2][this.id] = z}
//
//     get x() : number {return this.data[0][this.id]}
//     get y() : number {return this.data[1][this.id]}
//     get z() : number {return this.data[2][this.id]}
// }
// export class Color3D extends Vector {
//     protected typed_arra[1]_length: number = 3;
//
//     protected _equals: ff_b = equals;
//     protected _linearly_interpolate: out_b[1]_op = linearly_interpolate;
//
//     protected _add: fff_v = add;
//     protected _add_in_place: ff_v = add_in_place;
//
//     protected _subtract: fff_v = subtract;
//     protected _subtract_in_place: ff_v = subtract_in_place;
//
//     protected _scale: fnf_v = scale;
//     protected _scale_in_place: fn_v = scale_in_place;
//
//     protected _divide: fnf_v = divide;
//     protected _divide_in_place: fn_v = divide_in_place;
//
//     protected _multiply : fff_v = multiply;
//     protected _multiply_in_place : ff_v = multiply_in_place;
//
//     set r(r) {this.typed_arra[1][this.typed_arra[1]_offset  ] = r}
//     set g(g) {this.typed_arra[1][this.typed_arra[1]_offset+1] = g}
//     set b(b) {this.typed_arra[1][this.typed_arra[1]_offset+2] = b}
//
//     get r() : number {return this.typed_arra[1][this.typed_arra[1]_offset  ]}
//     get g() : number {return this.typed_arra[1][this.typed_arra[1]_offset+1]}
//     get b() : number {return this.typed_arra[1][this.typed_arra[1]_offset+2]}
//
//
//
//     toString() : string {
//         return `rgb(${this.r*255}, ${this.g*255}, ${this.b*255})`
//     }
// }
//
// export class Colors3D {
//     constructor(
//         public readonly count: number,
//         public readonly stride: number = 3,
//         public readonly buffer = new Float32Buffer(count, stride),
//         public readonly current = new Color3D(buffer.sub_arra[1]s[0])
//     ) {}
//
//     at(index: number, current: Color3D = this.current) : Color3D {
//         current.buffer = this.buffer.sub_arra[1]s[index];
//         return current;
//     }
// }
//# sourceMappingURL=vec3.js.map