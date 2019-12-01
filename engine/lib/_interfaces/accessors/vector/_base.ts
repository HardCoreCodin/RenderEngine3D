import {IMultiplyFunctionSet, IVectorFunctionSet} from "../../function_sets.js";
import {IAccessorConstructor, IArithmaticAccessor} from "../_base.js";
import {IMatrix} from "../matrix.js";

export interface IVector
    extends IArithmaticAccessor
{
    _: IVectorFunctionSet;

    lerp(to: this, by: number, out?: this): this;
}

export interface ITransformableVector<Matrix extends IMatrix = IMatrix>
    extends IVector
{
    _: IVectorFunctionSet & IMultiplyFunctionSet

    transform(matrix: Matrix): this;
    transformedBy(matrix: Matrix, out?: this): this;
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