import {IMatrix2x2FunctionSet, IMatrixFunctionSet, IMatrixRotationFunctionSet} from "../function_sets.js";
import {IArithmaticAccessor} from "./_base.js";
import {IPosition2D, IPosition3D} from "./vector/position.js";
import {IDirection2D, IDirection3D} from "./vector/direction.js";

export interface IMatrix
    extends IArithmaticAccessor
{
    _: IMatrixFunctionSet;

    T: this;
    is_identity: boolean;

    setToIdentity(): this;

    transpose(): this;
    transposed(out?: this): this;

    imul(matrix: this): this;
    mul(matrix: this, out?: this): this;
}

export interface IRotationMatrix
    extends IMatrix
{
    _: IMatrixRotationFunctionSet;

    setRotationAroundX(angle: number, reset: boolean): this;
    setRotationAroundY(angle: number, reset: boolean): this;
    setRotationAroundZ(angle: number, reset: boolean): this;
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
}

export interface IMatrix3x3
    extends IRotationMatrix
{
    mat2: IMatrix2x2;
    pos2: IPosition2D;

    i: IDirection2D;
    j: IDirection2D;
    k: IDirection2D;

    m11: number;
    m12: number;
    m13: number;

    m21: number;
    m22: number;
    m23: number;

    m31: number;
    m32: number;
    m33: number;

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number
    ): this;
}

export interface IMatrix4x4
    extends IRotationMatrix
{
    mat3: IMatrix3x3;
    pos3: IPosition3D;

    i: IDirection3D;
    j: IDirection3D;
    k: IDirection3D;

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