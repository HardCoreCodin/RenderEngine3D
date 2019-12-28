import {TransformableVector} from "./vector.js";
import Matrix, {Matrix2x2, Matrix3x3, Matrix4x4} from "./matrix.js";
import {
    Arrays,
    ICrossDirectionFunctionSet,
    IDirection3DFunctionSet,
    IDirectionFunctionSet
} from "../_interfaces/functions.js";
import {PRECISION_DIGITS} from "../../constants.js";
import {direction2DFunctions} from "../math/vec2.js";
import { direction4DFunctions} from "../math/vec4.js";
import {direction3DFunctions} from "../math/vec3.js";
import {ICrossedDirection, IDirection, IDirection2D, IDirection3D, IDirection4D} from "../_interfaces/vectors.js";

export abstract class Direction<MatrixType extends Matrix>
    extends TransformableVector<MatrixType>
    implements IDirection<MatrixType>
{
    _: IDirectionFunctionSet;
    _newOut(): this {return this._new()}

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

export abstract class CrossedDirection<MatrixType extends Matrix>
    extends Direction<MatrixType>
    implements ICrossedDirection<MatrixType>
{
    readonly _: ICrossDirectionFunctionSet;

    get z(): number {
        return this.arrays[2][this.id]
    }

    set z(z: number) {
        this.arrays[2][this.id] = z
    }

    cross(other: ICrossedDirection<MatrixType>): this {
        this._.cross_in_place(
            this.id, this.arrays,
            other.id, other.arrays
        );

        return this;
    };

    crossedWith(other: ICrossedDirection<MatrixType>, out: this): this {
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

export class Direction2D extends Direction<Matrix2x2> implements IDirection2D
{
    constructor(
        id?: number,
        arrays?: Arrays
    ) {
        super(direction2DFunctions, id, arrays)
    }

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


    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
}

export class Direction3D extends CrossedDirection<Matrix3x3> implements IDirection3D
{
    readonly _: IDirection3DFunctionSet;

    constructor(
        id?: number,
        arrays?: Arrays
    ) {
        super(direction3DFunctions, id, arrays)
    }

    setTo(x: number, y: number, z: number): this {
        this._.set_to(
            this.id, this.arrays,

            x, y, z
        );

        return this;
    }

    mat4mul(matrix: Matrix4x4, out: Direction4D = new Direction4D()): Direction4D {
        this._.matrix_multiply_direction_by_mat4(
            this.id, this.arrays,
            matrix.id, matrix.arrays,
            out.id, out.arrays
        );

        return out;
    }

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export class Direction4D extends CrossedDirection<Matrix4x4> implements IDirection4D
{
    readonly _: ICrossDirectionFunctionSet;

    constructor(
        id?: number,
        arrays?: Arrays
    ) {
        super(direction4DFunctions, id, arrays)
    }

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

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export const dir2 = (
    x: number = 0,
    y: number = x
): Direction2D => new Direction2D().setTo(x, y);

export const dir3 = (
    x: number = 0,
    y: number = x,
    z: number = x
): Direction3D => new Direction3D().setTo(x, y, z);

export const dir4 = (
    x: number = 0,
    y: number = x,
    z: number = x,
    w: number = x
): Direction4D => new Direction4D().setTo(x, y, z, w);