import {TransformableVector, Vector} from "./_base.js";
import Matrix, {Matrix2x2, Matrix3x3, Matrix4x4} from "../matrix.js";
import {Direction, Direction2D, Direction3D, Direction4D, dir2D, dir3D, dir4D} from "./direction.js";
import {position3DFunctions} from "../../_arithmatic/vec3.js";
import {position4DFunctions} from "../../_arithmatic/vec4.js";
import {position2DFunctions} from "../../_arithmatic/vec2.js";
import {IPositionFunctionSet} from "../../_interfaces/function_sets.js";
import {IPosition, IPosition2D, IPosition3D, IPosition4D} from "../../_interfaces/accessors/vector/position.js";
import {IVector} from "../../_interfaces/accessors/vector/_base.js";

export abstract class Position<MatrixType extends Matrix, Other extends Direction<MatrixType>>
    extends TransformableVector<MatrixType>
    implements IPosition<MatrixType, Other> {
    _: IPositionFunctionSet;

    protected readonly abstract _dir: () => Other;

    readonly distanceTo = (other: this): number => this._.distance(
        this.id, this.arrays,
        other.id, other.arrays
    );

    readonly squaredDistanceTo = (other: this): number => this._.distance_squared(
        this.id, this.arrays,
        other.id, other.arrays
    );

    to(other: IPosition, out: Other = this._dir()): typeof out {
        this._.subtract(
            other.id, other.arrays,
            this.id, this.arrays,
            out.id, out.arrays
        );

        return out;
    }
}

export class Position2D extends Position<Matrix2x2, Direction2D> implements IPosition2D {
    readonly _ = position2DFunctions;

    protected readonly _dir = dir2D;

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

export class Position3D extends Position<Matrix3x3, Direction3D> implements IPosition3D {
    readonly _ = position3DFunctions;

    protected readonly _dir = dir3D;

    setTo(x: number, y: number, z: number): this {
        this._.set_to(this.id, this.arrays, x, y, z);

        return this;
    }

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}
}

export class Position4D extends Position<Matrix4x4, Direction4D> implements IPosition4D {
    readonly _ = position4DFunctions;

    protected readonly _dir = dir4D;

    readonly isInView = (near: number = 0, far: number = 1): boolean => this._.in_view(
        this.arrays[0][this.id],
        this.arrays[1][this.id],
        this.arrays[2][this.id],
        this.arrays[3][this.id],
        near,
        far
    );

    readonly isOutOfView = (near: number = 0, far: number = 1): boolean => this._.out_of_view(
        this.arrays[0][this.id],
        this.arrays[1][this.id],
        this.arrays[2][this.id],
        this.arrays[3][this.id],
        near,
        far
    );

    toNDC = (): this => this.divideBy(this.arrays[3][this.id]);

    setTo(x: number, y: number, z: number, w: number): this {
        this._.set_to(this.id, this.arrays, x, y, z, w);

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

const alloc2D = position2DFunctions.allocator;
const alloc3D = position3DFunctions.allocator;
const alloc4D = position4DFunctions.allocator;

export const pos2D = (
    x: number | IVector = 0,
    y: number = 0
): Position2D => typeof x === "number" ?
    new Position2D(alloc2D.allocateTemp(), alloc2D.temp_arrays).setTo(x, y) :
    new Position2D(x.id, x.arrays);

export const pos3D = (
    x: number | IVector = 0,
    y: number = 0,
    z: number = 0
): Position3D => typeof x === "number" ?
    new Position3D(alloc3D.allocateTemp(), alloc3D.temp_arrays).setTo(x, y, z) :
    new Position3D(x.id, x.arrays);

export const pos4D = (
    x: number | IVector = 0,
    y: number = 0,
    z: number = 0,
    w: number = 0
): Position4D => typeof x === "number" ?
    new Position4D(alloc4D.allocateTemp(), alloc4D.temp_arrays).setTo(x, y, z, w) :
    new Position4D(x.id, x.arrays);
