import {IMatrix} from "../matrix.js";
import {IAccessorConstructor, IMathAccessor} from "../_base.js";
import {ITransformableVectorFunctionSet, IVectorFunctionSet} from "../../function_sets.js";

export interface IVector
    extends IMathAccessor
{
    _: IVectorFunctionSet;

    lerp(to: this, by: number, out?: this): this;
}

export interface ITransformableVector<Matrix extends IMatrix = IMatrix>
    extends IVector
{
    _: ITransformableVectorFunctionSet

    imatmul(matrix: Matrix): this;
    matmul(matrix: Matrix, out?: this): this;
}

export interface IVector2D {
    x: number;
    y: number;
}

export interface IVector3D extends IVector2D {
    z: number;
}

export interface IVector4D extends IVector3D {
    w: number;
}

export type VectorConstructor<VectorType extends IVector> = IAccessorConstructor<VectorType>;