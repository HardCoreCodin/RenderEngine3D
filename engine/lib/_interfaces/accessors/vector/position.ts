import {IDirection} from "./direction.js";
import {ITransformableVector, IVector2D, IVector3D, IVector4D} from "./_base.js";
import {IPosition4DFunctionSet, IPositionFunctionSet} from "../../function_sets.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4} from "../matrix.js";
import {DIM} from "../../../../constants.js";

export interface IPosition<
    Dim extends DIM,
    Matrix extends IMatrix = IMatrix>
    extends ITransformableVector<Matrix>
{
    _: IPositionFunctionSet

    to(other: IPosition<Dim>, out: IDirection<Dim>): IDirection<Dim>;
    distanceTo(other: this): number;
    squaredDistanceTo(other: this): number;
}

export interface IPosition2D extends IPosition<DIM._2D, IMatrix2x2>, IVector2D
{
    setTo(x: number, y: number): this;

    xx: IPosition2D;
    xy: IPosition2D;

    yx: IPosition2D;
    yy: IPosition2D;
}

export interface IPosition3D extends IPosition<DIM._3D, IMatrix3x3>, IVector3D
{
    setTo(x: number, y: number, z: number): this;

    xx: IPosition2D;
    xy: IPosition2D;
    xz: IPosition2D;

    yx: IPosition2D;
    yy: IPosition2D;
    yz: IPosition2D;

    zx: IPosition2D;
    zy: IPosition2D;
    zz: IPosition2D;

    xxx: IPosition3D;
    xxy: IPosition3D;
    xxz: IPosition3D;
    xyx: IPosition3D;
    xyy: IPosition3D;
    xyz: IPosition3D;
    xzx: IPosition3D;
    xzy: IPosition3D;
    xzz: IPosition3D;

    yxx: IPosition3D;
    yxy: IPosition3D;
    yxz: IPosition3D;
    yyx: IPosition3D;
    yyy: IPosition3D;
    yyz: IPosition3D;
    yzx: IPosition3D;
    yzy: IPosition3D;
    yzz: IPosition3D;

    zxx: IPosition3D;
    zxy: IPosition3D;
    zxz: IPosition3D;
    zyx: IPosition3D;
    zyy: IPosition3D;
    zyz: IPosition3D;
    zzx: IPosition3D;
    zzy: IPosition3D;
    zzz: IPosition3D;
}

export interface IPosition4D extends IPosition<DIM._4D, IMatrix4x4>, IVector4D
{
    _: IPosition4DFunctionSet

    setTo(x: number, y: number, z: number, w: number): this;

    xx: IPosition2D;
    xy: IPosition2D;
    xz: IPosition2D;

    yx: IPosition2D;
    yy: IPosition2D;
    yz: IPosition2D;

    zx: IPosition2D;
    zy: IPosition2D;
    zz: IPosition2D;

    xxx: IPosition3D;
    xxy: IPosition3D;
    xxz: IPosition3D;
    xyx: IPosition3D;
    xyy: IPosition3D;
    xyz: IPosition3D;
    xzx: IPosition3D;
    xzy: IPosition3D;
    xzz: IPosition3D;

    yxx: IPosition3D;
    yxy: IPosition3D;
    yxz: IPosition3D;
    yyx: IPosition3D;
    yyy: IPosition3D;
    yyz: IPosition3D;
    yzx: IPosition3D;
    yzy: IPosition3D;
    yzz: IPosition3D;

    zxx: IPosition3D;
    zxy: IPosition3D;
    zxz: IPosition3D;
    zyx: IPosition3D;
    zyy: IPosition3D;
    zyz: IPosition3D;
    zzx: IPosition3D;
    zzy: IPosition3D;
    zzz: IPosition3D;
}