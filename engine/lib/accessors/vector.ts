import Matrix from "./matrix.js";
import {MathAccessor} from "./accessor.js";
import {ITransformableVectorFunctionSet, IVectorFunctionSet} from "../_interfaces/functions.js";
import {ITransformableVector, IVector} from "../_interfaces/vectors.js";

export abstract class Vector extends MathAccessor
    implements IVector
{
    readonly _: IVectorFunctionSet;

    lerp(to: this, by: number, out: this = this._new()): this {
        this._.lerp(
            this.id, this.arrays,
            to.id, to.arrays,
            out.id, out.arrays,
            by
        );

        return out;
    }
}

export abstract class TransformableVector<MatrixType extends Matrix> extends Vector
    implements ITransformableVector<MatrixType>
{
    readonly _: ITransformableVectorFunctionSet;

    imatmul(matrix: MatrixType): this {
        this._.matrix_multiply_in_place(
            this.id, this.arrays,
            matrix.id, matrix.arrays
        );

        return this;
    }

    matmul(matrix: MatrixType, out: this = this._new()): this {
        if (out.is(this))
            this._.matrix_multiply_in_place(
                this.id, this.arrays,
                matrix.id, matrix.arrays
            );
        else
            this._.matrix_multiply(
                this.id, this.arrays,
                matrix.id, matrix.arrays,
                out.id, out.arrays
            );

        return out;
    }
}