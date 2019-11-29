import {PRECISION_DIGITS} from "../constants.js";
import {BaseArithmatic} from "./base.js";
import Matrix from "./mat.js";
import {
    ICrossFunctions,
    IDirectionFunctions,
    IInterpolateFunctions,
    IPositionFunctions,
    IVectorFunctions,
} from "./interfaces/functions.js";
import {
    ICrossedDirection,
    IDirection,
    IInterpolatable, IPosition,
    IVector
} from "./interfaces/classes.js";

export abstract class Interpolatable
    extends BaseArithmatic
    implements IInterpolatable
{
    readonly abstract _: IInterpolateFunctions;

    lerp(to: this, by: number, out: this = this.copy()): this {
        this._.lerp(this.id, to.id, out.id, by);

        return out;
    }
}

export abstract class Vector<MatrixType extends Matrix>
    extends Interpolatable
    implements IVector<MatrixType>
{
    readonly abstract _: IVectorFunctions;

    transform(matrix: MatrixType): this {
        this._.multiply_in_place(this.id, matrix.id);

        return this;
    }

    transformedBy(matrix: MatrixType, out: this = this.copy()): this {
        if (out.is(this))
            this._.multiply_in_place(this.id, matrix.id);
        else
            this._.multiply(this.id, matrix.id, out.id);

        return out;
    }

}

export abstract class Direction<MatrixType extends Matrix>
    extends Vector<MatrixType>
    implements IDirection<MatrixType>
{
    _: IDirectionFunctions;

    readonly dot = (other: this): number =>
        this._.dot(this.id, other.id);

    get length(): number {
        return this._.length(this.id);
    }

    get length_squared(): number {
        return this._.length_squared(this.id);
    }

    get is_normalized(): boolean {
        return this.length_squared.toFixed(PRECISION_DIGITS) === '1.000';
    }

    normalize(): this {
        if (!this.is_normalized)
            this._.normalize_in_place(this.id);

        return this;
    }

    normalized(out: this = this.copy()): this {
        if (out.is(this))
            return this.normalize();

        if (this.is_normalized)
            return out.setFrom(this);

        this._.normalize(this.id, out.id);

        return out;
    }
}

export abstract class CrossedDirection<MatrixType extends Matrix>
    extends Direction<MatrixType>
    implements ICrossedDirection<MatrixType>
{
    readonly abstract _: ICrossFunctions;

    get z(): number {return this._.get(this.id, 2)}
    set z(z: number) {this._.set(this.id, 2, z)}

    cross(other: this): this {
        this._.cross_in_place(this.id, other.id);

        return this;
    };

    crossedWith(other: this, out: this): this {
        if (out.is(this))
            return out.cross(other);

        this._.cross(this.id, other.id, out.id);

        return out;
    }
}

export abstract class Position<MatrixType extends Matrix, Other extends Direction<MatrixType>>
    extends Vector<MatrixType>
    implements IPosition<MatrixType, Other>
{
    _: IPositionFunctions;

    protected readonly abstract _dir: () => Other;

    readonly distanceTo = (other: this): number => this._.distance(this.id, other.id);
    readonly squaredDistanceTo = (other: this): number => this._.distance_squared(this.id, other.id);

    to(other: this, out: Other = this._dir()): typeof out {
        this._.subtract(other.id, this.id, out.id);

        return out;
    }
}
