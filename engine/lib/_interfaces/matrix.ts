import {Direction3D} from "../accessors/direction.js";
import {Position3D} from "../accessors/position.js";
import {IAccessor} from "./accessors.js";

export interface IMatrix extends IAccessor
{
    is_identity: boolean;

    setToIdentity(): this;
    invert(out?: this): this;
    transpose(out?: this): this;

    iadd(other: this|number): this;
    add(other: this|number, out: this): this;

    isub(other: this|number): this;
    sub(other: this|number, out: this): this;

    imul(other: this|number): this;
    mul(other: this|number, out: this): this;

    idiv(denominator: number): this;
    div(denominator: number, out: this): this;
}

export interface IRotationMatrix extends IMatrix
{
    readonly translation: Position3D;

    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    setRotationAroundX(angle: number, reset: boolean): this;
    setRotationAroundY(angle: number, reset: boolean): this;
    setRotationAroundZ(angle: number, reset: boolean): this;

    rotateAroundX(angle: number, out?: this): this;
    rotateAroundY(angle: number, out?: this): this;
    rotateAroundZ(angle: number, out?: this): this;

    innerRotateAroundX(angle: number, out?: this): this;
    innerRotateAroundY(angle: number, out?: this): this;
    innerRotateAroundZ(angle: number, out?: this): this;

    translateBy(x: number, y?: number, z?: number, out?: this): this;
    rotateBy(x: number, y?: number, z?: number, out?: this): this;
    scaleBy(x: number, y?: number, z?: number, out?: this): this;
}

export interface IMatrix2x2 extends IMatrix
{
    m11: number;  m12: number;
    m21: number;  m22: number;

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
    readonly translation: Position3D;

    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    m11: number;  m12: number;  m13: number;
    m21: number;  m22: number;  m23: number;
    m31: number;  m32: number;  m33: number;

    translate2DBy(x: number, y?: number, out?: this): this;
    setToCrossProductOf(v: Direction3D): this;
    setToOuterProductOf(v1: Direction3D, v2?: Direction3D): this;

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number
    ): this;
}

export interface IMatrix4x4
    extends IRotationMatrix
{
    readonly translation: Position3D;

    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    m11: number;  m12: number;  m13: number;  m14: number;
    m21: number;  m22: number;  m23: number;  m24: number;
    m31: number;  m32: number;  m33: number;  m34: number;
    m41: number;  m42: number;  m43: number;  m44: number;

    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number
    ): this;
}