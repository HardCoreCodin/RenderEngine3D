import {CACHE_LINE_SIZE, PRECISION_DIGITS, TEMP_STORAGE_SIZE} from "../constants.js";
import {IBaseArithmaticFunctions, IBaseFunctions, IMatrix2x2, IMatrixFunctions} from "./interfaces.js";
import Matrix from "./mat.js";
import {__setMatrixArrays} from "./vec2.js";

let t11, t12,
    t21, t22: number;

let M11, M12,
    M21, M22: Float32Array;

let SIZE = 0;
let TEMP_SIZE = TEMP_STORAGE_SIZE;

let temp_id = 0;
let id = 0;

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

    M11 = new Float32Array(size);
    M12 = new Float32Array(size);

    M21 = new Float32Array(size);
    M22 = new Float32Array(size);

    __setMatrixArrays(
        M11, M12,
        M21, M22
    );
};

const set_to = (a: number,
                m11: number, m12: number,
                m21: number, m22: number): void => {
    M11[a] = m11;  M12[a] = m12;
    M21[a] = m21;  M22[a] = m22;
};

const set_all_to = (a: number, value: number): void => {
    M11[a] = M12[a] = M21[a] = M22[a] = value;
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

const baseFunctions2x2: IBaseFunctions = {
    getNextAvailableID,
    allocate,

    set_to,
    set_from,
    set_all_to,

    equals,

    invert,
    invert_in_place
};

const baseArithmaticFunctions2x2: IBaseArithmaticFunctions = {
    ...baseFunctions2x2,

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

const matrixFunctions2x2: IMatrixFunctions = {
    ...baseArithmaticFunctions2x2,

    is_identity,
    set_to_identity,

    transpose,
    transpose_in_place,
};

export default class Matrix2x2 extends Matrix implements IMatrix2x2 {
    readonly _ = matrixFunctions2x2;

    setRotation(angle: number, reset: boolean = true): this {
        if (reset)
            this._.set_to_identity(this.id);

        set_rotation(this.id, Math.cos(angle), Math.sin(angle));

        return this;
    }
}

export function mat2(temp: boolean): Matrix2x2;
export function mat2(
    m11_or_temp: number|boolean = 0, m12: number = 0,
    m21: number = 0, m22: number = 0,
    temp: boolean = false
): Matrix2x2 {
    if (typeof m11_or_temp === "number")
        return new Matrix2x2(getNextAvailableID(temp)).setTo(m11_or_temp, m12, m21, m22);

    return new Matrix2x2(getNextAvailableID(m11_or_temp));
}