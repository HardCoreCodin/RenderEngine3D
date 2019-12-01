import {ArithmaticAccessor} from "./_base.js";
import {Position2D, Position3D} from "./vector/position.js";
import {Direction2D, Direction3D} from "./vector/direction.js";
import {matrix2x2Functions} from "../_arithmatic/mat2x2.js";
import {matrix4x4Functions} from "../_arithmatic/mat4x4.js";
import {matrix3x3Functions} from "../_arithmatic/mat3x3.js";
import {Float16, Float4, Float9} from "../../types.js";
import {IMatrixFunctionSet, IMatrixRotationFunctionSet} from "../_interfaces/function_sets.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4, IRotationMatrix} from "../_interfaces/accessors/matrix.js";


export default abstract class Matrix
    extends ArithmaticAccessor
    implements IMatrix
{
    readonly abstract _: IMatrixFunctionSet;
    _newOut(): this {return this._new()}

    get is_identity(): boolean {
        return this._.is_identity(
            this.id, this.arrays
        );
    }

    get T(): this {
        return this.copy().transpose();
    }

    setToIdentity(): this {
        this._.set_to_identity(
            this.id, this.arrays
        );

        return this;
    }

    transpose(): this {
        this._.transpose_in_place(
            this.id, this.arrays
        );

        return this;
    }

    transposed(out: this = this.copy()): this {
        this._.transpose(
            this.id, this.arrays,
            out.id, out.arrays
        );

        return out;
    }

    imul(other: this): this {
        this._.multiply_in_place(
            this.id, this.arrays,
            other.id, other.arrays
        );

        return this;
    }

    mul(other: this, out: this = this.copy()): this {
        if (out.is(this))
            this._.multiply_in_place(
                this.id, this.arrays,
                other.id, other.arrays
            );
        else
            this._.multiply(
                this.id, this.arrays,
                other.id, other.arrays,
                out.id, out.arrays
            );

        return out;
    }
}

export abstract class RotationMatrix
    extends Matrix
    implements IRotationMatrix
{
    readonly abstract _: IMatrixRotationFunctionSet;

    setRotationAroundX(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_x(
            this.id, this.arrays,
            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }

    setRotationAroundY(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_y(
            this.id, this.arrays,
            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }

    setRotationAroundZ(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_z(
            this.id, this.arrays,
            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }
}

export class Matrix2x2
    extends Matrix
    implements IMatrix2x2
{
    readonly _ = matrix2x2Functions;

    public readonly i: Direction2D;
    public readonly j: Direction2D;

    public arrays: Float4;

    constructor(id?: number, arrays?: Float4) {
        super(id, arrays);

        this.i = new Direction2D(id, [arrays[0], arrays[1]]);
        this.j = new Direction2D(id, [arrays[2], arrays[3]]);
    }

    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m21(m21: number) {this.arrays[2][this.id] = m21}
    set m22(m22: number) {this.arrays[3][this.id] = m22}

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m21(): number {return this.arrays[2][this.id]}
    get m22(): number {return this.arrays[3][this.id]}

    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this {
        this._.set_to(
            this.id, this.arrays,

            m11, m12,
            m21, m22
        );

        return this;
    }

    setRotation(angle: number, reset: boolean = true): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation(
            this.id, this.arrays,

            Math.cos(angle),
            Math.sin(angle)
        );

        return this;
    }
}

export class Matrix3x3
    extends RotationMatrix
    implements IMatrix3x3
{
    readonly _ = matrix3x3Functions;

    public readonly i: Direction2D;
    public readonly j: Direction2D;
    public readonly k: Direction2D;

    public readonly pos2: Position2D;
    public readonly mat2: Matrix2x2;

    public arrays: Float9;

    constructor(id?: number, arrays?: Float9) {
        super(id, arrays);

        this.i = new Direction2D(id, [arrays[0], arrays[1]]);
        this.j = new Direction2D(id, [arrays[3], arrays[4]]);
        this.k = new Direction2D(id, [arrays[6], arrays[7]]);

        this.pos2 = new Position2D(id, [arrays[6], arrays[7]]);
        this.mat2 = new Matrix2x2(this.id, [
            this.arrays[0], this.arrays[1],
            this.arrays[3], this.arrays[4],
        ]);
    }

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m13(): number {return this.arrays[2][this.id]}

    get m21(): number {return this.arrays[3][this.id]}
    get m22(): number {return this.arrays[4][this.id]}
    get m23(): number {return this.arrays[5][this.id]}

    get m31(): number {return this.arrays[6][this.id]}
    get m32(): number {return this.arrays[7][this.id]}
    get m33(): number {return this.arrays[8][this.id]}


    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m13(m13: number) {this.arrays[2][this.id] = m13}

    set m21(m21: number) {this.arrays[3][this.id] = m21}
    set m22(m22: number) {this.arrays[4][this.id] = m22}
    set m23(m23: number) {this.arrays[5][this.id] = m23}

    set m31(m31: number) {this.arrays[6][this.id] = m31}
    set m32(m32: number) {this.arrays[7][this.id] = m32}
    set m33(m33: number) {this.arrays[8][this.id] = m33}

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number
    ): this {
        this._.set_to(
            this.id,
            this.arrays,

            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        );

        return this;
    }
}

export class Matrix4x4
    extends RotationMatrix
    implements IMatrix4x4
{
    readonly _ = matrix4x4Functions;

    public readonly i: Direction3D;
    public readonly j: Direction3D;
    public readonly k: Direction3D;

    public readonly pos3: Position3D;
    public readonly mat3: Matrix3x3;

    public arrays: Float16;

    constructor(id?: number, arrays?: Float16) {
        super(id, arrays);

        this.i = new Direction3D(id, [arrays[0], arrays[1], arrays[2]]);
        this.j = new Direction3D(id, [arrays[4], arrays[5], arrays[6]]);
        this.k = new Direction3D(id, [arrays[8], arrays[9], arrays[10]]);

        this.pos3 = new Position3D(id, [arrays[12], arrays[13], arrays[14]]);
        this.mat3 = new Matrix3x3(this.id, [
            this.arrays[0], this.arrays[1], this.arrays[2],
            this.arrays[4], this.arrays[5], this.arrays[6],
            this.arrays[8], this.arrays[9], this.arrays[10]
        ]);
    }

    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m13(m13: number) {this.arrays[2][this.id] = m13}
    set m14(m14: number) {this.arrays[3][this.id] = m14}

    set m21(m21: number) {this.arrays[4][this.id] = m21}
    set m22(m22: number) {this.arrays[5][this.id] = m22}
    set m23(m23: number) {this.arrays[6][this.id] = m23}
    set m24(m24: number) {this.arrays[7][this.id] = m24}

    set m31(m31: number) {this.arrays[8][this.id] = m31}
    set m32(m32: number) {this.arrays[9][this.id] = m32}
    set m33(m33: number) {this.arrays[10][this.id] = m33}
    set m34(m34: number) {this.arrays[11][this.id] = m34}

    set m41(m41: number) {this.arrays[12][this.id] = m41}
    set m42(m42: number) {this.arrays[13][this.id] = m42}
    set m43(m43: number) {this.arrays[14][this.id] = m43}
    set m44(m44: number) {this.arrays[15][this.id] = m44}

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m13(): number {return this.arrays[2][this.id]}
    get m14(): number {return this.arrays[3][this.id]}

    get m21(): number {return this.arrays[4][this.id]}
    get m22(): number {return this.arrays[5][this.id]}
    get m23(): number {return this.arrays[6][this.id]}
    get m24(): number {return this.arrays[7][this.id]}

    get m31(): number {return this.arrays[8][this.id]}
    get m32(): number {return this.arrays[9][this.id]}
    get m33(): number {return this.arrays[10][this.id]}
    get m34(): number {return this.arrays[11][this.id]}

    get m41(): number {return this.arrays[12][this.id]}
    get m42(): number {return this.arrays[13][this.id]}
    get m43(): number {return this.arrays[14][this.id]}
    get m44(): number {return this.arrays[15][this.id]}

    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number
    ): this {
        this._.set_to(
            this.id,
            this.arrays,

            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        );

        return this;
    }
}

export const mat2 = (
    m11: number = 0,   m12: number = m11,
    m21: number = m11, m22: number = m11
): Matrix2x2 => new Matrix2x2().setTo(
    m11, m12,
    m21, m22
);

export const mat3 = (
    m11: number = 0,   m12: number = m11, m13: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11,
): Matrix3x3 => new Matrix3x3().setTo(
    m11, m12, m13,
    m21, m22, m23,
    m31, m32, m33
);

export const mat4 = (
    m11: number = 0,   m12: number = m11, m13: number = m11, m14: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11, m24: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11, m34: number = m11,
    m41: number = m11, m42: number = m11, m43: number = m11, m44: number = m11
): Matrix4x4 => new Matrix4x4().setTo(
    m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44
);