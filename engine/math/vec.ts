import {IMatrix} from "./mat.js";
import {DIM, PRECISION_DIGITS} from "../constants.js";
import {BaseArithmatic, IBaseArithmatic, IBaseArithmaticFunctions} from "./base.js";

export interface IVectorFunctions
    extends IBaseArithmaticFunctions
{
    distance(a: number, b: number): number;
    distance_squared(a: number, b: number): number;

    length(a: number): number;
    length_squared(a: number): number;

    normalize(a: number, o: number): void;
    normalize_in_place(a: number): void;

    dot(a: number, b: number): number;
    lerp(a: number, b: number, o: number, t: number): void;
}

export interface IVector
    extends IBaseArithmatic
{
    _: IVectorFunctions;

    lerp(to: this, by: number, out?: this): this;
}

export abstract class Vector
    extends BaseArithmatic implements IVector
{
    readonly abstract _: IVectorFunctions;

    lerp(to: this, by: number, out: this = this.copy()): this {
        this._.lerp(this.id, to.id, out.id, by);

        return out;
    }
}

export interface IColor
    extends IVector
{
    r: number;
    g: number;
    b: number;
}

export abstract class Color
    extends Vector
    implements IColor
{
    set r(r: number) {this._.set(this.id, DIM._1D, r)}
    set g(g: number) {this._.set(this.id, DIM._2D, g)}
    set b(b: number) {this._.set(this.id, DIM._3D, b)}

    get r(): number {return this._.get(this.id, DIM._1D)}
    get g(): number {return this._.get(this.id, DIM._2D)}
    get b(): number {return this._.get(this.id, DIM._3D)}
}

export interface ITexCoords
    extends IVector
{
    u: number;
    v: number;
}

export abstract class TexCoords
    extends Vector
    implements ITexCoords
{
    set u(u: number) {this._.set(this.id, DIM._1D, u)}
    set v(v: number) {this._.set(this.id, DIM._2D, v)}

    get u(): number {return this._.get(this.id, DIM._1D)}
    get v(): number {return this._.get(this.id, DIM._2D)}
}

export interface ITransformableVector<
    Matrix extends IMatrix = IMatrix
    >
    extends IVector
{
    transform(matrix: Matrix): this;
    transformedBy(matrix: Matrix, out?: this): this;
}

export abstract class TransformableVector<
    Matrix extends IMatrix = IMatrix
    >
    extends Vector
    implements ITransformableVector<Matrix>
{
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

export interface IDirection<
    Matrix extends IMatrix = IMatrix
    >
    extends ITransformableVector<Matrix>
{
    length: number;
    length_squared: number;
    is_noemalized: boolean;

    dot(other: this): number;

    normalize(): this;
    normalized(out?: this): this;
}

export abstract class Direction<
    Matrix extends IMatrix = IMatrix
    >
    extends TransformableVector<Matrix>
    implements IDirection<Matrix>
{
    readonly dot = (other: this): number =>
        this._.dot(this.id, other.id);

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

export interface IPosition<
    Matrix extends IMatrix,
    DirectionType extends IDirection<Matrix>
    >
    extends ITransformableVector<Matrix>
{
    to(other: this, out: DirectionType): typeof out;
    distanceTo(other: this): number;
    squaredDistanceTo(other: this): number;
}

export abstract class Position<
    Matrix extends IMatrix,
    DirectionType extends IDirection<IMatrix>
    >
    extends TransformableVector<Matrix>
    implements IPosition<Matrix, DirectionType>
{
    protected readonly abstract _dir: () => DirectionType;

    readonly distanceTo = (other: this): number => this._.distance(this.id, other.id);
    readonly squaredDistanceTo = (other: this): number => this._.distance_squared(this.id, other.id);

    to(other: this, out: DirectionType = this._dir()): typeof out {
        this._.subtract(other.id, this.id, out.id);

        return out;
    }
}