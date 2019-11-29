import Matrix from "../matrix.js";
import {ArithmaticAccessor} from "../_base.js";
import {ITransformableVector, IVector} from "../../_interfaces/accessors/vector/_base.js";
import {ITransformableVectorFunctionSet, IVectorFunctionSet} from "../../_interfaces/function_sets.js";

export abstract class Vector
    extends ArithmaticAccessor
    implements IVector {
    readonly abstract _: IVectorFunctionSet;

    lerp(to: this, by: number, out: this = this.copy()): this {
        this._.lerp(
            this.id, this.arrays,
            to.id, to.arrays,
            out.id, out.arrays,
            by
        );

        return out;
    }
}

export abstract class TransformableVector<MatrixType extends Matrix>
    extends Vector
    implements ITransformableVector<MatrixType> {
    readonly abstract _: ITransformableVectorFunctionSet;

    transform(matrix: MatrixType): this {
        this._.multiply_in_place(
            this.id, this.arrays,
            matrix.id, matrix.arrays
        );

        return this;
    }

    transformedBy(matrix: MatrixType, out: this = this.copy()): this {
        if (out.is(this))
            this._.multiply_in_place(
                this.id, this.arrays,
                matrix.id, matrix.arrays
            );
        else
            this._.multiply(
                this.id, this.arrays,
                matrix.id, matrix.arrays,
                out.id, out.arrays
            );

        return out;
    }
}