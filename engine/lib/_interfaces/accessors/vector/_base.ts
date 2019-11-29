import {IMultiplyFunctionSet, IVectorFunctionSet} from "../../function_sets.js";
import {IAccessorConstructor, IArithmaticAccessor} from "../_base.js";
import {IMatrix} from "../matrix.js";

export interface IVector
    extends IArithmaticAccessor
{
    _: IVectorFunctionSet;

    lerp(to: this, by: number, out?: this): this;
}

export interface ITransformableVector<MatrixInterface extends IMatrix = IMatrix>
    extends IVector
{
    _: IVectorFunctionSet & IMultiplyFunctionSet

    transform(matrix: MatrixInterface): this;
    transformedBy(matrix: MatrixInterface, out?: this): this;
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

export type VectorConstructor<VectorType extends IVector> = IAccessorConstructor<VectorType>;