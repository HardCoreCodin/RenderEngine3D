import {IDirection, IDirection2D, IDirection3D, IDirection4D} from "./direction.js";
import {ITransformableVector, IVector2D, IVector3D, IVector4D} from "./_base.js";
import {IPositionFunctionSet} from "../../function_sets.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4} from "../matrix.js";
import {DIM} from "../../../../constants.js";

export interface IPosition<
    Dim extends DIM,
    MatrixInterface extends IMatrix = IMatrix,
    Other extends IDirection<Dim,MatrixInterface> = IDirection<Dim, MatrixInterface>>
    extends ITransformableVector<MatrixInterface>
{
    _: IPositionFunctionSet

    to(other: IPosition<Dim>, out: Other): Other;
    distanceTo(other: this): number;
    squaredDistanceTo(other: this): number;
}

export interface IPosition2D extends IPosition<DIM._2D, IMatrix2x2, IDirection2D>, IVector2D {
    setTo(x: number, y: number): this;
}

export interface IPosition3D extends IPosition<DIM._3D, IMatrix3x3, IDirection3D>, IVector3D {
    setTo(x: number, y: number, z: number): this;
}

export interface IPosition4D extends IPosition<DIM._3D, IMatrix4x4, IDirection4D>, IVector4D {
    setTo(x: number, y: number, z: number, w: number): this;
}