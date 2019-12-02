import {TransformableVector} from "./_base.js";
import Matrix, {Matrix2x2, Matrix3x3, Matrix4x4} from "../matrix.js";
import {Direction2D, Direction3D, Direction4D, dir2, dir3, dir4} from "./direction.js";
import {position3DFunctions} from "../../math/vec3.js";
import {position4DFunctions} from "../../math/vec4.js";
import {position2DFunctions} from "../../math/vec2.js";
import {IPositionFunctionSet} from "../../_interfaces/function_sets.js";
import {IPosition, IPosition2D, IPosition3D, IPosition4D} from "../../_interfaces/accessors/vector/position.js";
import {DIM} from "../../../constants.js";
import {IDirection} from "../../_interfaces/accessors/vector/direction.js";

export abstract class Position<
    Dim extends DIM,
    MatrixType extends Matrix>
    extends TransformableVector<MatrixType>
    implements IPosition<Dim, MatrixType>
{
    _: IPositionFunctionSet;

    abstract _newOut(): IDirection<Dim, MatrixType>;

    readonly distanceTo = (other: this): number => this._.distance(
        this.id, this.arrays,
        other.id, other.arrays
    );

    readonly squaredDistanceTo = (other: this): number => this._.distance_squared(
        this.id, this.arrays,
        other.id, other.arrays
    );

    to(other: IPosition<Dim>, out: IDirection<Dim, MatrixType> = this._newOut()): typeof out {
        this._.subtract(
            other.id, other.arrays,
            this.id, this.arrays,
            out.id, out.arrays
        );

        return out;
    }
}

export class Position2D
    extends Position<DIM._2D, Matrix2x2>
    implements IPosition2D
{
    readonly _ = position2DFunctions;
    _newOut(): Direction2D {return new Direction2D()}

    protected readonly _dir = dir2;

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

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
}

export class Position3D extends Position<DIM._3D, Matrix3x3>
    implements IPosition3D
{
    readonly _ = position3DFunctions;
    _newOut(): Direction3D {return new Direction3D()}

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

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export class Position4D extends Position<DIM._4D, Matrix4x4>
    implements IPosition4D
{
    readonly _ = position4DFunctions;
    _newOut(): Direction4D {return new Direction4D()}

    protected readonly _dir = dir4;

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

    toNDC = (): this => this.div(this.arrays[3][this.id]);

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

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export const pos2 = (
    x: number = 0,
    y: number = x
): Position2D => new Position2D().setTo(x, y);

export const pos3 = (
    x: number = 0,
    y: number = x,
    z: number = x
): Position3D => new Position3D().setTo(x, y, z);

export const pos4 = (
    x: number = 0,
    y: number = x,
    z: number = x,
    w: number = x
): Position4D => new Position4D().setTo(x, y, z, w);
