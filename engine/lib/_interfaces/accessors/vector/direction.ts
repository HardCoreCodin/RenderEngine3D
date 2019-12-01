import {ITransformableVector, IVector2D, IVector3D} from "./_base.js";
import {ICrossDirectionFunctionSet, IDirectionFunctionSet} from "../../function_sets.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4} from "../matrix.js";
import {DIM} from "../../../../constants.js";
import {IVector4D} from "../../../../math/interfaces/classes.js";

export interface IDirection<
    Dim extends DIM,
    Matrix extends IMatrix = IMatrix>
    extends ITransformableVector<Matrix>
{
    _: IDirectionFunctionSet;

    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;
    normalize(): this;
    normalized(out?: this): this;
}

export interface ICrossedDirection<
    Dim extends DIM,
    Matrix extends IMatrix = IMatrix>
    extends IDirection<Dim, Matrix>
{
    _: ICrossDirectionFunctionSet;

    cross(other: ICrossedDirection<Dim, Matrix>): this;
    crossedWith(other: ICrossedDirection<Dim, Matrix>, out: this): this;
}

export interface IDirection2D
    extends IDirection<DIM._2D, IMatrix2x2>, IVector2D
{
    setTo(x: number, y: number): this;

    xx: IDirection2D;
    xy: IDirection2D;

    yx: IDirection2D;
    yy: IDirection2D;
}

export interface IDirection3D
    extends ICrossedDirection<DIM._3D, IMatrix3x3>, IVector3D
{
    setTo(x: number, y: number, z: number): this;

    xx: IDirection2D;
    xy: IDirection2D;
    xz: IDirection2D;

    yx: IDirection2D;
    yy: IDirection2D;
    yz: IDirection2D;

    zx: IDirection2D;
    zy: IDirection2D;
    zz: IDirection2D;

    xxx: IDirection3D;
    xxy: IDirection3D;
    xxz: IDirection3D;
    xyx: IDirection3D;
    xyy: IDirection3D;
    xyz: IDirection3D;
    xzx: IDirection3D;
    xzy: IDirection3D;
    xzz: IDirection3D;

    yxx: IDirection3D;
    yxy: IDirection3D;
    yxz: IDirection3D;
    yyx: IDirection3D;
    yyy: IDirection3D;
    yyz: IDirection3D;
    yzx: IDirection3D;
    yzy: IDirection3D;
    yzz: IDirection3D;

    zxx: IDirection3D;
    zxy: IDirection3D;
    zxz: IDirection3D;
    zyx: IDirection3D;
    zyy: IDirection3D;
    zyz: IDirection3D;
    zzx: IDirection3D;
    zzy: IDirection3D;
    zzz: IDirection3D;
}

export interface IDirection4D
    extends ICrossedDirection<DIM._4D, IMatrix4x4>, IVector4D
{
    setTo(x: number, y: number, z: number, w: number): this;

    xx: IDirection2D;
    xy: IDirection2D;
    xz: IDirection2D;

    yx: IDirection2D;
    yy: IDirection2D;
    yz: IDirection2D;

    zx: IDirection2D;
    zy: IDirection2D;
    zz: IDirection2D;

    xxx: IDirection3D;
    xxy: IDirection3D;
    xxz: IDirection3D;
    xyx: IDirection3D;
    xyy: IDirection3D;
    xyz: IDirection3D;
    xzx: IDirection3D;
    xzy: IDirection3D;
    xzz: IDirection3D;

    yxx: IDirection3D;
    yxy: IDirection3D;
    yxz: IDirection3D;
    yyx: IDirection3D;
    yyy: IDirection3D;
    yyz: IDirection3D;
    yzx: IDirection3D;
    yzy: IDirection3D;
    yzz: IDirection3D;

    zxx: IDirection3D;
    zxy: IDirection3D;
    zxz: IDirection3D;
    zyx: IDirection3D;
    zyy: IDirection3D;
    zyz: IDirection3D;
    zzx: IDirection3D;
    zzy: IDirection3D;
    zzz: IDirection3D;
}