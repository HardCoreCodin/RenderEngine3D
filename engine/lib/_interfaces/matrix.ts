import {
    IMatrix2x2FunctionSet,
    IMatrix3x3FunctionSet,
    IMatrixFunctionSet,
    IMatrixRotationFunctionSet
} from "./functions.js";
import {IMathAccessor} from "./accessors.js";
import {IDirection3D, IPosition2D, IPosition3D, IVector, IVector3D} from "./vectors.js";

export interface IMatrix extends IMathAccessor
{
    is_identity: boolean;
    readonly _: IMatrixFunctionSet;

    setToIdentity(): this;
    transpose(out?: this): this;
}

export interface IRotationMatrix extends IMatrix
{
    readonly _: IMatrixRotationFunctionSet;

    readonly translation: IPosition3D;
    readonly x_axis: IDirection3D;
    readonly y_axis: IDirection3D;
    readonly z_axis: IDirection3D;

    setRotationAroundX(angle: number, reset: boolean): this;
    setRotationAroundY(angle: number, reset: boolean): this;
    setRotationAroundZ(angle: number, reset: boolean): this;

    rotateAroundX(angle: number, out?: this): this;
    rotateAroundY(angle: number, out?: this): this;
    rotateAroundZ(angle: number, out?: this): this;

    translateBy(x: number, y?: number, z?: number, out?: this): this;
    rotateBy(x: number, y?: number, z?: number, out?: this): this;
    scaleBy(x: number, y?: number, z?: number, out?: this): this;
}

export interface IMatrix2x2 extends IMatrix
{
    readonly _: IMatrix2x2FunctionSet,

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
    scaleBy(x: number, y?: number, out?: this): this;
}

export interface IMatrix3x3 extends IRotationMatrix
{
    readonly _: IMatrix3x3FunctionSet,

    mat2: IMatrix2x2;
    translation2D: IPosition2D;

    m11: number;
    m12: number;
    m13: number;

    m21: number;
    m22: number;
    m23: number;

    m31: number;
    m32: number;
    m33: number;

    translate2DBy(x: number, y?: number, out?: this): this;
    setToCrossProductOf(v: IVector & IVector3D): this;
    setToOuterProductOf(v1: IVector & IVector3D, v2?: IVector & IVector3D): this;
}

export interface IMatrix4x4
    extends IRotationMatrix
{
    mat3: IMatrix3x3;

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
}