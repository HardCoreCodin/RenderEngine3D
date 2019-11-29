import {
    IArithmaticFunctions, IBaseFunctions,
    ICrossFunctions,
    IDirectionFunctions,
    IInterpolateFunctions,
    IMatrixFunctions, IMatrixRotationFunctions,
    IMultiplyFunctions,
    IPositionFunctions,
} from "./functions.js";

export interface IBase
{
    _: IBaseFunctions,

    id: number;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: this): this;

    is(other: this): boolean;
    equals(other: this): boolean;
    copy(out?: this): this;
}

export interface IBaseArithmatic extends IBase
{
    _: IArithmaticFunctions,

    add(other: this);
    subtract(other: this): this;

    divideBy(denominator: number): this;
    over(denominator: number, out?: this): this;

    scaleBy(factor: number): this;
    times(factor: number, out?: this): this;

    plus(other: IBaseArithmatic, out?: this): this;
    minus(other: IBaseArithmatic, out?: this): this;

    invert(): this;
    inverted(out?: this): this;
}

export interface IInterpolatable extends IBaseArithmatic
{
    _: IInterpolateFunctions;

    lerp(to: this, by: number, out?: this): this;
}

export interface IVector<MatrixInterface extends IMatrix = IMatrix>
    extends IInterpolatable
{
    _: IInterpolateFunctions & IMultiplyFunctions

    transform(matrix: MatrixInterface): this;
    transformedBy(matrix: MatrixInterface, out?: this): this;
}

export interface IDirection<MatrixInterface extends IMatrix = IMatrix>
    extends IVector<MatrixInterface>
{
    _: IDirectionFunctions;

    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;
    normalize(): this;
    normalized(out?: this): this;
}

export interface ICrossedDirection<MatrixInterface extends IMatrix = IMatrix>
    extends IDirection<MatrixInterface>
{
    _: ICrossFunctions;

    cross(other: this): this;
    crossedWith(other: this, out: this): this;
}

export interface IPosition<
    MatrixInterface extends IMatrix = IMatrix,
    Other extends IDirection<MatrixInterface> = IDirection<MatrixInterface>
    >
    extends IVector<MatrixInterface>
{
    _: IPositionFunctions

    to(other: this, out: Other): Other;
    distanceTo(other: this): number;
    squaredDistanceTo(other: this): number;
}

export interface IMatrix extends IBaseArithmatic {
    _: IMatrixFunctions;

    T: this;
    is_identity: boolean;
    setToIdentity(): this;

    transpose(): this;
    transposed(out?: this): this;

    imul(matrix: this): this;
    mul(matrix: this, out?: this): this;
}

export interface IRotationMatrix extends IMatrix {
    _: IMatrixRotationFunctions;

    setRotationAroundX(angle: number, reset: boolean): this;
    setRotationAroundY(angle: number, reset: boolean): this;
    setRotationAroundZ(angle: number, reset: boolean): this;
}

export interface IMatrix2x2 extends IMatrix {
    m11: number;  m12: number;
    m21: number;  m22: number;

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this;

    setRotation(angle: number, reset: boolean): this;
}
export interface IMatrix3x3 extends IRotationMatrix {
    m11: number;  m12: number;  m13: number;
    m21: number;  m22: number;  m23: number;
    m31: number;  m32: number;  m33: number;

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number
    ): this;
}
export interface IMatrix4x4 extends IMatrix {
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

export interface IUV extends IInterpolatable {
    u: number;
    v: number;
}
export interface IUV2D extends IUV {
    setTo(u: number, v: number): this;
}
export interface IUV3D extends IUV {
    w: number;

    setTo(u: number, v: number, w: number): this;
}

export interface IColor extends IInterpolatable {
    r: number;
    g: number;
    b: number;
}
export interface IColor3D extends IColor {
    setTo(r: number, g: number, b: number): this;
}
export interface IColor4D extends IColor {
    a: number;

    setTo(r: number, g: number, b: number, a: number): this;
}

export interface IVector2D {
    x: number;
    y: number;
}
export interface IVector3D {
    x: number;
    y: number;
    z: number;
}
export interface IVector4D {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface IPosition2D extends IPosition<IMatrix2x2, IDirection2D>, IVector2D {
    setTo(x: number, y: number): this;
}
export interface IPosition3D extends IPosition<IMatrix3x3, IDirection3D>, IVector3D {
    setTo(x: number, y: number, z: number): this;
}
export interface IPosition4D extends IPosition<IMatrix4x4, IDirection4D>, IVector4D {
    setTo(x: number, y: number, z: number, w: number): this;
}

export interface IDirection2D extends IDirection<IMatrix2x2>, IVector2D {
    setTo(x: number, y: number): this;
}
export interface IDirection3D extends IDirection<IMatrix3x3>, IVector3D {
    setTo(x: number, y: number, z: number): this;
}
export interface IDirection4D extends IDirection<IMatrix4x4>, IVector3D {
    setTo(x: number, y: number, z: number, w: number): this;
}