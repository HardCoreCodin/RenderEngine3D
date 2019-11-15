import {IDirection, IMatrix, IPosition, ITransformableVector, IVector, IVectorFunctions} from "./interfaces.js";
import {PRECISION_DIGITS} from "../constants.js";
import {AnyConstructor} from "../types.js";
import {BaseArithmatic} from "./base.js";

export abstract class Vector extends BaseArithmatic implements IVector {
    readonly abstract _: IVectorFunctions;

    lerp(to: this, by: number, out: this = this.copy()): this {
        this._.lerp(this.id, to.id, out.id, by);

        return out;
    }
}

export abstract class TransformableVector<Matrix extends IMatrix = IMatrix> extends Vector implements ITransformableVector<Matrix> {
    transform(matrix: Matrix): this {
        this._.multiply_in_place(this.id, matrix.id);

        return this;
    }

    transformedBy(matrix: Matrix, out: this = this.copy()): this {
        if (out.is(this))
            this._.multiply_in_place(this.id, matrix.id);
        else
            this._.multiply(this.id, out.id, matrix.id);

        return out;
    }
}

export abstract class Direction<Matrix extends IMatrix = IMatrix>
    extends TransformableVector<Matrix>
    implements IDirection<Matrix> {

    readonly dot = (other: this): number => this._.dot(this.id, other.id);

    get length(): number {
        return this._.length(this.id);
    }

    get length_squared(): number {
        return this._.length_squared(this.id);
    }

    get is_noemalized(): boolean {
        return this.length_squared.toFixed(PRECISION_DIGITS) === '1.000';
    }

    normalize(): this {
        if (!this.is_noemalized)
            this._.normalize_in_place(this.id);

        return this;
    }

    normalized(out: this = this.copy()): this {
        if (out.is(this))
            return this.normalize();

        if (this.is_noemalized)
            return out.setFrom(this);

        this._.normalize(this.id, out.id);

        return out;
    }
}

export abstract class Position<
    Matrix extends IMatrix = IMatrix,
    DirectionType extends Direction<Matrix> = Direction<Matrix>
    >
    extends TransformableVector<Matrix>
    implements IPosition<Matrix, DirectionType> {

    protected readonly abstract _DirectionConstructor: AnyConstructor<DirectionType>;

    readonly distanceTo = (other: this): number => this._.distance(this.id, other.id);
    readonly squaredDistanceTo = (other: this): number => this._.distance_squared(this.id, other.id);

    to(other: this, out: DirectionType = new this._DirectionConstructor(this._.getNextAvailableID())): DirectionType {
        this._.subtract(other.id, this.id, out.id);

        return out;
    }
}