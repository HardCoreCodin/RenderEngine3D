import {IAccessor} from "./accessors.js";
import {Direction2D, Direction3D, Direction4D} from "../../accessors/direction.js";
import {Position2D, Position3D, Position4D} from "../../accessors/position.js";
import Matrix4x4 from "../../accessors/matrix4x4.js";
import {UV2D} from "../../accessors/uv.js";
import {Color3D} from "../../accessors/color.js";
import {Accessor, Vector} from "../../accessors/accessor.js";
import Matrix3x3 from "../../accessors/matrix3x3.js";
import Matrix2x2 from "../../accessors/matrix2x2.js";
import {TypedArray} from "../types.js";


export interface IVector<Other extends IAccessor<ArrayType>, ArrayType extends TypedArray = Float32Array> extends IAccessor<ArrayType>
{
    iadd(other: Other|number): this;
    add(other: Other|number, out: this): this;

    isub(other: Other|number): this;
    sub(other: Other|number, out: this): this;

    imul(other: this|number): this;
    mul(other: this|number, out: this): this;

    idiv(denominator: number): this;
    div(denominator: number, out: this): this;

    lerp(to: this, by: number, out: this): this;
}

export type VectorConstructor<VectorType extends IVector<IAccessor<ArrayType>, ArrayType>, ArrayType extends TypedArray = Float32Array> = new (
    array?: ArrayType
) => VectorType;

export interface I2D {
    x: number;
    y: number;
}

export interface I3D extends I2D {
    z: number;
}

export interface I4D extends I3D {
    w: number;
}

export type IVector2D<ArrayType extends TypedArray = Float32Array, Other extends Accessor<ArrayType> = Accessor<ArrayType>> = IVector<Other, ArrayType> & I2D;
export type IVector3D<ArrayType extends TypedArray = Float32Array, Other extends Accessor<ArrayType> = Accessor<ArrayType>> = IVector<Other, ArrayType> & I3D;
export type IVector4D<ArrayType extends TypedArray = Float32Array, Other extends Accessor<ArrayType> = Accessor<ArrayType>> = IVector<Other, ArrayType> & I4D;


export interface IDirection2D<ArrayType extends TypedArray = Float32Array>
    extends IVector2D<ArrayType>
{
    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;

    inormalize(): this;
    normalize(out: this): this;

    inegate(): this;
    negate(out: this): this;

    imatmul(matrix: Matrix2x2): this;
    matmul(matrix: Matrix2x2, out: this): this;
}

export interface IDirection3D<ArrayType extends TypedArray = Float32Array>
    extends IVector3D<ArrayType>
{
    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;

    icross(other: this): this;
    cross(other: this, out: this): this;

    inormalize(): this;
    normalize(out: this): this;

    inegate(): this;
    negate(out: this): this;

    imatmul(matrix: Matrix3x3|Matrix4x4): this;
    matmul(matrix: Matrix3x3|Matrix4x4, out: Direction3D|Direction4D): Direction3D|Direction4D;

    xy: Direction2D;
    yz: Direction2D;
}

export interface IDirection4D<ArrayType extends TypedArray = Float32Array>
    extends IVector4D<ArrayType>
{
    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;

    icross(other: this): this;
    cross(other: this, out: this): this;

    inormalize(): this;
    normalize(out: this): this;

    inegate(): this;
    negate(out: this): this;

    imatmul(matrix: Matrix4x4): this;
    matmul(matrix: Matrix4x4, out: this): this;

    xy: Direction2D;
    yz: Direction2D;
    zw: Direction2D;

    xyz: Direction3D;
    yzw: Direction3D;
}

export interface IPosition2D<ArrayType extends TypedArray = Float32Array>
    extends IVector2D<ArrayType>
{
    to(other: this, out: Direction2D): Direction2D;
    distanceTo(other: this): number;
    distanceSquaredTo(other: this): number;

    imatmul(matrix: Matrix2x2): this;
    matmul(matrix: Matrix2x2, out: this): this;
}

export interface IPosition3D<ArrayType extends TypedArray = Float32Array>
    extends IVector3D<ArrayType>
{
    to(other: this, out: Direction3D): Direction3D;
    distanceTo(other: this): number;
    distanceSquaredTo(other: this): number;

    imatmul(matrix: Matrix3x3|Matrix4x4): this;
    matmul(matrix: Matrix3x3|Matrix4x4, out: Position3D|Position4D): Position3D|Position4D;

    xy: Position2D;
    yz: Position2D;
}

export interface IPosition4D<ArrayType extends TypedArray = Float32Array>
    extends IVector4D<ArrayType>
{
    to(other: this, out: Direction4D): Direction4D;
    distanceTo(other: this): number;
    distanceSquaredTo(other: this): number;

    imatmul(matrix: Matrix4x4): this;
    matmul(matrix: Matrix4x4, out: this): this;

    xy: Position2D;
    yz: Position2D;
    zw: Position2D;

    xyz: Position3D;
    yzw: Position3D;
}

export interface IColor extends IVector<IAccessor> {
    r: number;
    g: number;
    b: number;

    toString(): string;
}

export interface IColor3D extends IColor, I3D {
    setTo(r: number, g: number, b: number): this;
}

export interface IColor4D extends IColor, I4D {
    a: number;

    setTo(r: number, g: number, b: number, a: number): this;

    rgb: Color3D;
}

export interface IUV extends IVector<IAccessor> {
    u: number;
    v: number;
}

export interface IUV2D extends IUV, I2D {
    setTo(u: number, v: number): this;
}
export interface IUV3D extends IUV, I3D {
    w: number;

    setTo(u: number, v: number, w: number): this;

    uv: UV2D;
    vw: UV2D;
}