import {IMatrix2x2FunctionSet, IMatrixFunctionSet, IMatrixRotationFunctionSet} from "./functions.js";
import {IMathAccessor} from "./accessors.js";
import {IDirection2D, IDirection3D, IPosition2D, IPosition3D} from "./vectors.js";

export interface IMatrix
    extends IMathAccessor
{
    _: IMatrixFunctionSet;

    T: this;
    is_identity: boolean;

    setToIdentity(): this;

    transpose(): this;
    transposed(out?: this): this;

    toArray(array: Float32Array): Float32Array;
}

export interface IRotationMatrix
    extends IMatrix
{
    _: IMatrixRotationFunctionSet;

    setRotationAroundX(angle: number, reset: boolean): this;
    setRotationAroundY(angle: number, reset: boolean): this;
    setRotationAroundZ(angle: number, reset: boolean): this;

    rotateAroundX(angle: number, out?: this): this;
    rotateAroundY(angle: number, out?: this): this;
    rotateAroundZ(angle: number, out?: this): this;

    rotateBy(x: number, y?: number, z?: number): this;
}

export interface IMatrix2x2 extends IMatrix
{
    _: IMatrix2x2FunctionSet,

    m11: number;
    m12: number;

    m21: number;
    m22: number;

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this;

    setRotation(angle: number, reset: boolean): this;
    rotateBy(angle: number, out?: this): this;
    scaleBy(x: number, y?: number): this;
}

export interface IMatrix3x3
    extends IRotationMatrix
{
    mat2: IMatrix2x2;
    translation: IPosition2D;
    x_axis_2D: IDirection2D;
    y_axis_2D: IDirection2D;

    x_axis: IDirection3D;
    y_axis: IDirection3D;
    z_axis: IDirection3D;

    m11: number;
    m12: number;
    m13: number;

    m21: number;
    m22: number;
    m23: number;

    m31: number;
    m32: number;
    m33: number;

    translateBy(x: number, y?: number): this;
    scale2DBy(x: number, y?: number): this;
    scaleBy(x: number, y?: number, z?: number): this;
}

export interface IMatrix4x4
    extends IRotationMatrix
{
    mat3: IMatrix3x3;
    translation: IPosition3D;

    x_axis: IDirection3D;
    y_axis: IDirection3D;
    z_axis: IDirection3D;

    m11: number;
    m12: number;
    m13: number;
    m14: number;

    m21: number;
    m22: number;
    m23: number;
    m24: number;

    m31: number;
    m32: number;
    m33: number;
    m34: number;

    m41: number;
    m42: number;
    m43: number;
    m44: number;

    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number
    ): this;

    translateBy(x: number, y?: number, z?: number): this;
    scaleBy(x: number, y?: number, z?: number): this;
}