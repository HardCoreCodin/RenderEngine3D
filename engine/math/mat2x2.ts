import Matrix from "./mat.js";
import {FloatBuffer} from "../buffer.js";
import {PRECISION_DIGITS} from "../constants.js";
import {IMatrixFunctions} from "./interfaces/functions.js";
import {IMatrix2x2} from "./interfaces/classes.js";
import {update_vector2D_M11, update_vector2D_M12, update_vector2D_M21, update_vector2D_M22} from "./vec2.js";

let t11, t12,
    t21, t22: number;

let M11, M12,
    M21, M22: Float32Array;

const MATRIX2x2_ARRAYS = [
    null, null,
    null, null,
];

const update_M11 = (m11) => {M11 = MATRIX2x2_ARRAYS[0] = m11; update_vector2D_M11(m11)};
const update_M12 = (m12) => {M12 = MATRIX2x2_ARRAYS[1] = m12; update_vector2D_M12(m12)};

const update_M21 = (m21) => {M21 = MATRIX2x2_ARRAYS[2] = m21; update_vector2D_M21(m21)};
const update_M22 = (m22) => {M22 = MATRIX2x2_ARRAYS[3] = m22; update_vector2D_M22(m22)};

const M11_BUFFER = new FloatBuffer(update_M11);
const M12_BUFFER = new FloatBuffer(update_M12);

const M21_BUFFER = new FloatBuffer(update_M21);
const M22_BUFFER = new FloatBuffer(update_M22);


let _temp_id: number;
const getTempID = (): number => {
    _temp_id = M11_BUFFER.allocateTemp();
    M12_BUFFER.allocateTemp();
    M21_BUFFER.allocateTemp();
    M22_BUFFER.allocateTemp();

    return _temp_id;
};

const get = (a: number, dim: 0|1|2|3): number => MATRIX2x2_ARRAYS[dim][a];
const set = (a: number, dim: 0|1|2|3, value: number): void => {MATRIX2x2_ARRAYS[dim][a] = value};

const set_to = (a: number,
                m11: number, m12: number,
                m21: number, m22: number): void => {
    M11[a] = m11;  M12[a] = m12;
    M21[a] = m21;  M22[a] = m22;
};

const set_all_to = (a: number, value: number): void => {
    M11[a] = M12[a] =
        M21[a] = M22[a] = value;
};

const set_from = (a: number, o: number): void => {
    M11[a] = M11[o];  M12[a] = M12[o];
    M21[a] = M21[o];  M22[a] = M22[o];
};


const set_to_identity = (a: number) : void => {
    M11[a] = M22[a] = 1;
    M12[a] = M21[a] = 0;
};

const transpose = (a: number, o: number) : void => {
    M11[o] = M11[a];  M21[o] = M12[a];
    M12[o] = M21[a];  M22[o] = M22[a];
};

const transpose_in_place = (a: number) : void => {[
    M12[a], M21[a]] = [
    M21[a], M12[a]]
};

// TODO: Fix...
const invert = (a: number, o: number) : void => {
    M11[o] = M11[a];  M21[o] = M12[a];
    M12[o] = M21[a];  M22[o] = M22[a];
};

// TODO: Fix...
const invert_in_place = (a: number) : void => {[
    M12[a], M21[a]] = [
    M21[a], M12[a]]
};

const equals = (a: number, b: number) : boolean =>
    M11[a].toFixed(PRECISION_DIGITS) ===
    M11[b].toFixed(PRECISION_DIGITS) &&

    M12[a].toFixed(PRECISION_DIGITS) ===
    M12[b].toFixed(PRECISION_DIGITS) &&


    M21[a].toFixed(PRECISION_DIGITS) ===
    M21[b].toFixed(PRECISION_DIGITS) &&

    M22[a].toFixed(PRECISION_DIGITS) ===
    M22[b].toFixed(PRECISION_DIGITS);

const is_identity = (a: number) : boolean =>
    M11[a] === 1  &&  M21[a] === 0 &&
    M12[a] === 0  &&  M22[a] === 1;

const add = (a: number, b: number, o: number) : void => {
    M11[o] = M11[a] + M11[b];  M21[o] = M21[a] + M21[b];
    M12[o] = M12[a] + M12[b];  M22[o] = M22[a] + M22[b];
};

const add_in_place = (a: number, b: number) : void => {
    M11[a] += M11[b];  M21[a] += M21[b];
    M12[a] += M12[b];  M22[a] += M22[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    M11[o] = M11[a] - M11[b];  M21[o] = M21[a] - M21[b];
    M12[o] = M12[a] - M12[b];  M22[o] = M22[a] - M22[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    M11[a] -= M11[b];  M21[a] -= M21[b];
    M12[a] -= M12[b];  M22[a] -= M22[b];
};

const divide = (a: number, o: number, n: number) : void => {
    M11[o] = M11[a] / n;  M21[o] = M21[a] / n;
    M12[o] = M12[a] / n;  M22[o] = M22[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    M11[a] /= n;  M21[a] /= n;
    M12[a] /= n;  M22[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    M11[o] = M11[a] * n;  M21[o] = M21[a] * n;
    M12[o] = M12[a] * n;  M22[o] = M22[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    M11[a] *= n;  M21[a] *= n;
    M12[a] *= n;  M22[a] *= n;
};

const multiply = (a: number, b: number, o: number) : void => {
    M11[o] = M11[a]*M11[b] + M12[a]*M21[b]; // Row 1 | Column 1
    M12[o] = M11[a]*M12[b] + M12[a]*M22[b]; // Row 1 | Column 2

    M21[o] = M21[a]*M11[b] + M22[a]*M21[b]; // Row 2 | Column 1
    M22[o] = M21[a]*M12[b] + M22[a]*M22[b]; // Row 2 | Column 2
};

const multiply_in_place = (a: number, b: number) : void => {
    t11 = M11[a];  t21 = M21[a];
    t12 = M12[a];  t22 = M22[a];

    M11[a] = t11*M11[b] + t12*M21[b]; // Row 1 | Column 1
    M12[a] = t11*M12[b] + t12*M22[b]; // Row 1 | Column 2

    M21[a] = t21*M11[b] + t22*M21[b]; // Row 2 | Column 1
    M22[a] = t21*M12[b] + t22*M22[b]; // Row 2 | Column 2
};

const set_rotation = (a: number, cos: number, sin: number) : void => {
    M11[a] = M22[a] = cos;
    M12[a] = sin;
    M21[a] = -sin;
};

const matrixFunctions: IMatrixFunctions = {
    getTempID,

    get,
    set,
    set_to,
    set_from,
    set_all_to,

    equals,

    invert,
    invert_in_place,

    add,
    add_in_place,

    subtract,
    subtract_in_place,

    divide,
    divide_in_place,

    scale,
    scale_in_place,

    multiply,
    multiply_in_place,

    is_identity,
    set_to_identity,

    transpose,
    transpose_in_place,
};

export default class Matrix2x2
    extends Matrix
    implements IMatrix2x2
{
    readonly _ = matrixFunctions;

    set m11(m11: number) {M11[this.id] = m11}
    set m12(m12: number) {M12[this.id] = m12}
    set m21(m21: number) {M21[this.id] = m21}
    set m22(m22: number) {M22[this.id] = m22}

    get m11(): number {return M11[this.id]}
    get m12(): number {return M12[this.id]}
    get m21(): number {return M21[this.id]}
    get m22(): number {return M22[this.id]}

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this {
        set_to(
            this.id,
            m11, m12,
            m21, m22
        );

        return this;
    }

    setRotation(angle: number, reset: boolean = true): this {
        if (reset)
            this._.set_to_identity(this.id);

        set_rotation(this.id, Math.cos(angle), Math.sin(angle));

        return this;
    }
}

// export const mat2x2 = (
//     m11: number = 0, m12: number = 0,
//     m21: number = 0, m22: number = 0
// ): Matrix2x2 => new Matrix2x2(getTempID()).setTo(
//     m11, m12,
//     m21, m22
// );