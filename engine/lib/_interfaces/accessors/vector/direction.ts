import {ITransformableVector, IVector2D, IVector3D} from "./_base.js";
import {ICrossFunctionSet, IDirectionFunctionSet} from "../../function_sets.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4} from "../matrix.js";
import {DIM} from "../../../../constants.js";
import {IVector4D} from "../../../../math/interfaces/classes.js";

export interface IDirection<Dim extends DIM, MatrixInterface extends IMatrix = IMatrix>
    extends ITransformableVector<MatrixInterface> {
    _: IDirectionFunctionSet;

    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;
    normalize(): this;
    normalized(out?: this): this;
}

export interface ICrossedDirection<Dim extends DIM, MatrixInterface extends IMatrix = IMatrix>
    extends IDirection<Dim, MatrixInterface> {
    _: ICrossFunctionSet;

    cross(other: ICrossedDirection<Dim>): this;
    crossedWith(other: ICrossedDirection<Dim>, out: this): this;
}

export interface IDirection2D extends IDirection<DIM._2D, IMatrix2x2>, IVector2D {
    setTo(x: number, y: number): this;
}

export interface IDirection3D extends IDirection<DIM._3D, IMatrix3x3>, IVector3D {
    setTo(x: number, y: number, z: number): this;
}

export interface IDirection4D extends IDirection<DIM._4D, IMatrix4x4>, IVector4D {
    setTo(x: number, y: number, z: number, w: number): this;
}