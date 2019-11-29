import {TransformableVector} from "./_base.js";
import Matrix, {Matrix2x2, Matrix3x3, Matrix4x4} from "../matrix.js";
import {
    ICrossedDirection,
    IDirection,
    IDirection2D,
    IDirection3D,
    IDirection4D
} from "../../_interfaces/accessors/vector/direction.js";
import {ICrossFunctionSet, IDirectionFunctionSet} from "../../_interfaces/function_sets.js";
import {DIM, PRECISION_DIGITS} from "../../../constants.js";
import {direction2DFunctions} from "../../_arithmatic/vec2.js";
import {direction4DFunctions} from "../../_arithmatic/vec4.js";
import {direction3DFunctions} from "../../_arithmatic/vec3.js";
import {IVector} from "../../_interfaces/accessors/vector/_base.js";

export abstract class Direction<Dim extends DIM, MatrixType extends Matrix>
    extends TransformableVector<MatrixType>
    implements IDirection<Dim ,MatrixType> {
    _: IDirectionFunctionSet;

    readonly dot = (other: this): number =>
        this._.dot(
            this.id, this.arrays,
            other.id, other.arrays
        );

    get length(): number {
        return this._.length(
            this.id, this.arrays
        );
    }

    get length_squared(): number {
        return this._.length_squared(
            this.id, this.arrays
        );
    }

    get is_normalized(): boolean {
        return this.length_squared.toFixed(PRECISION_DIGITS) === '1.000';
    }

    normalize(): this {
        if (!this.is_normalized)
            this._.normalize_in_place(
                this.id, this.arrays
            );

        return this;
    }

    normalized(out: this = this.copy()): this {
        if (out.is(this))
            return this.normalize();

        if (this.is_normalized)
            return out.setFrom(this);

        this._.normalize(
            this.id, this.arrays,
            out.id, out.arrays
        );

        return out;
    }
}

export abstract class CrossedDirection<Dim extends DIM, MatrixType extends Matrix>
    extends Direction<Dim, MatrixType>
    implements ICrossedDirection<Dim, MatrixType> {
    readonly abstract _: ICrossFunctionSet;

    get z(): number {
        return this.arrays[2][this.id]
    }

    set z(z: number) {
        this.arrays[2][this.id] = z
    }

    cross(other: IDirection<Dim>): this {
        this._.cross_in_place(
            this.id, this.arrays,
            other.id, other.arrays
        );

        return this;
    };

    crossedWith(other: IDirection<Dim>, out: this): this {
        if (out.is(this))
            return out.cross(other);

        this._.cross(
            this.id, this.arrays,
            other.id, other.arrays,
            out.id, out.arrays
        );

        return out;
    }
}

export class Direction2D extends Direction<DIM._2D, Matrix2x2> implements IDirection2D {
    readonly _ = direction2DFunctions;

    setTo(x: number, y: number): this {
        this._.set_to(
            this.id, this.arrays,

            x, y
        );

        return this;
    }

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
}

export class Direction3D extends CrossedDirection<DIM._3D, Matrix3x3> implements IDirection3D {
    readonly _ = direction3DFunctions;

    setTo(x: number, y: number, z: number): this {
        this._.set_to(
            this.id, this.arrays,

            x, y, z
        );

        return this;
    }

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}
}

export class Direction4D extends CrossedDirection<DIM._4D, Matrix4x4> implements IDirection4D {
    readonly _ = direction4DFunctions;

    setTo(x: number, y: number, z: number, w: number): this {
        this._.set_to(
            this.id, this.arrays,

            x, y, z, w
        );

        return this;
    }

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}
    set w(w: number) {this.arrays[3][this.id] = w}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}
    get w(): number {return this.arrays[3][this.id]}
}

const alloc2D = direction2DFunctions.allocator;
const alloc3D = direction3DFunctions.allocator;
const alloc4D = direction4DFunctions.allocator;

export const dir2D = (
    x: number | IVector = 0,
    y: number = 0
): Direction2D => typeof x === "number" ?
    new Direction2D(alloc2D.allocateTemp(), alloc2D.temp_arrays).setTo(x, y) :
    new Direction2D(x.id, x.arrays);

export const dir3D = (
    x: number | IVector = 0,
    y: number = 0,
    z: number = 0
): Direction3D => typeof x === "number" ?
    new Direction3D(alloc3D.allocateTemp(), alloc3D.temp_arrays).setTo(x, y, z) :
    new Direction3D(x.id, x.arrays);

export const dir4D = (
    x: number | IVector = 0,
    y: number = 0,
    z: number = 0,
    w: number = 0
): Direction4D => typeof x === "number" ?
    new Direction4D(alloc4D.allocateTemp(), alloc4D.temp_arrays).setTo(x, y, z, w) :
    new Direction4D(x.id, x.arrays);
