import {MathAccessor} from "./accessor.js";
import {Position2D, Position3D} from "./position.js";
import {Direction2D, Direction3D} from "./direction.js";
import {matrix2x2Functions} from "../math/mat2.js";
import {matrix4x4Functions} from "../math/mat4.js";
import {matrix3x3Functions} from "../math/mat3.js";
import {Float16, Float4, Float9} from "../../types.js";
import {
    IMatrix2x2FunctionSet, IMatrix3x3FunctionSet,
    IMatrixFunctionSet,
    IMatrixRotationFunctionSet
} from "../_interfaces/functions.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4, IRotationMatrix} from "../_interfaces/matrix.js";
import {IVector3D} from "../_interfaces/vectors.js";
import {Vector} from "./vector.js";

export default abstract class Matrix extends MathAccessor implements IMatrix
{
    readonly _: IMatrixFunctionSet;
    protected abstract _getFunctionSet(): IMatrixFunctionSet;

    get is_identity(): boolean {
        return this._.is_identity(
            this.id, this.arrays
        );
    }

    setToIdentity(): this {
        this._.set_to_identity(
            this.id, this.arrays
        );

        return this;
    }

    transpose(out?: this): this {
        if (out && !out.is(this)) {
            this._.transpose(
                this.id, this.arrays,
                out.id, out.arrays
            );

            return out;
        }

        this._.transpose_in_place(
            this.id, this.arrays
        );

        return this;
    }
}

export abstract class RotationMatrix extends Matrix implements IRotationMatrix
{
    readonly _: IMatrixRotationFunctionSet;
    protected abstract _getFunctionSet(): IMatrixRotationFunctionSet;

    readonly abstract translation: Position3D;
    readonly abstract scale: Direction3D;
    readonly abstract x_axis: Direction3D;
    readonly abstract y_axis: Direction3D;
    readonly abstract z_axis: Direction3D;

    rotateAroundX(angle_in_radians: number, out?: this): this {
        if (out && !out.is(this)) {
            this._.rotate_around_x(
                this.id, this.arrays,
                Math.cos(angle_in_radians),
                Math.sin(angle_in_radians),
                out.id, out.arrays
            );
        } else
            this._.rotate_around_x_in_place(
                this.id, this.arrays,
                Math.cos(angle_in_radians),
                Math.sin(angle_in_radians)
            );

        return this;
    }

    rotateAroundY(angle_in_radians: number, out?: this): this {
        if (out && !out.is(this)) {
            this._.rotate_around_y(
                this.id, this.arrays,
                Math.cos(angle_in_radians),
                Math.sin(angle_in_radians),
                out.id, out.arrays
            );
        } else
            this._.rotate_around_y_in_place(
                this.id, this.arrays,
                Math.cos(angle_in_radians),
                Math.sin(angle_in_radians)
            );

        return this;
    }

    rotateAroundZ(angle_in_radians: number, out?: this): this {
        if (out && !out.is(this)) {
            this._.rotate_around_z(
                this.id, this.arrays,
                Math.cos(angle_in_radians),
                Math.sin(angle_in_radians),
                out.id, out.arrays
            );
        } else
            this._.rotate_around_z_in_place(
                this.id, this.arrays,
                Math.cos(angle_in_radians),
                Math.sin(angle_in_radians)
            );

        return this;
    }

    setRotationAroundX(angle_in_radians: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_x(
            this.id, this.arrays,
            Math.cos(angle_in_radians),
            Math.sin(angle_in_radians)
        );

        return this;
    }

    setRotationAroundY(angle_in_radians: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_y(
            this.id, this.arrays,
            Math.cos(angle_in_radians),
            Math.sin(angle_in_radians)
        );

        return this;
    }

    setRotationAroundZ(angle_in_radians: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(
                this.id, this.arrays
            );

        this._.set_rotation_around_z(
            this.id, this.arrays,
            Math.cos(angle_in_radians),
            Math.sin(angle_in_radians)
        );

        return this;
    }

    translateBy(x: number, y: number = 0, z: number = 0, out?: this): this {
        if (out && !out.is(this)) {
            if (x) out.translation.arrays[0][out.id] = x + this.translation.arrays[0][this.id];
            if (y) out.translation.arrays[1][out.id] = y + this.translation.arrays[1][this.id];
            if (z) out.translation.arrays[2][out.id] = z + this.translation.arrays[2][this.id];

            return out;
        }

        if (x) this.translation.arrays[0][this.id] += x;
        if (y) this.translation.arrays[1][this.id] += y;
        if (z) this.translation.arrays[2][this.id] += z;

        return this;
    }

    rotateBy(x: number, y: number = 0, z: number = 0, out?: this): this {
        if (x) this.rotateAroundX(x, out);
        if (y) this.rotateAroundY(y, out);
        if (z) this.rotateAroundZ(z, out);

        return this;
    }

    scaleBy(x: number, y: number = x, z: number = x, out?: this): this {
        if (out && !out.is(this)) {
            if (x !== 1)
                this.x_axis._.scale(
                    this.id, this.x_axis.arrays,
                    x,
                    out.id, out.x_axis.arrays
                );

            if (y !== 1)
                this.y_axis._.scale(
                    this.id, this.y_axis.arrays,
                    y,
                    out.id, out.y_axis.arrays
                );

            if (z !== 1)
                this.z_axis._.scale(
                    this.id, this.z_axis.arrays,
                    z,
                    out.id, out.z_axis.arrays
                );

            return out;
        }

        if (x !== 1) this.x_axis._.scale_in_place(this.id, this.x_axis.arrays, x);
        if (y !== 1) this.y_axis._.scale_in_place(this.id, this.y_axis.arrays, y);
        if (z !== 1) this.z_axis._.scale_in_place(this.id, this.z_axis.arrays, z);

        return this;
    }
}

export class Matrix2x2 extends Matrix implements IMatrix2x2
{
    readonly _: IMatrix2x2FunctionSet;
    protected _getFunctionSet(): IMatrix2x2FunctionSet {return matrix2x2Functions}

    public readonly x_axis: Direction2D;
    public readonly y_axis: Direction2D;

    public arrays: Float4;

    constructor(id?: number, arrays?: Float4) {
        super(id, arrays);

        this.x_axis = new Direction2D(this.id, [arrays[0], arrays[1]]);
        this.y_axis = new Direction2D(this.id, [arrays[2], arrays[3]]);
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

    rotateBy(angle_in_radians: number, out?: this): this {
        if (out && !out.is(this)) {
            this._.rotate(
                this.id, this.arrays,
                Math.cos(angle_in_radians),
                Math.sin(angle_in_radians),
                out.id, out.arrays
            );

            return out;
        }

        this._.rotate_in_place(
            this.id, this.arrays,
            Math.cos(angle_in_radians),
            Math.sin(angle_in_radians)
        );

        return this;
    }

    scaleBy(x: number, y: number = x, out?: this): this {
        if (out && !out.is(this)) {
            if (x !== 1)
                this.x_axis._.scale(
                    this.id, this.x_axis.arrays,
                    x,
                    out.id, out.x_axis.arrays
                );

            if (y !== 1)
                this.y_axis._.scale(
                    this.id, this.y_axis.arrays,
                    y,
                    out.id, out.y_axis.arrays
                );

            return out;
        }

        if (x !== 1) this.x_axis._.scale_in_place(this.id, this.x_axis.arrays, x);
        if (y !== 1) this.y_axis._.scale_in_place(this.id, this.y_axis.arrays, y);

        return this;
    }
}

export class Matrix3x3 extends RotationMatrix implements IMatrix3x3
{
    readonly _: IMatrix3x3FunctionSet;
    protected _getFunctionSet(): IMatrix3x3FunctionSet {return matrix3x3Functions}

    readonly mat2: Matrix2x2;
    readonly translation2D: Position2D;
    readonly translation: Position3D;
    readonly scale: Direction3D;
    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    arrays: Float9;

    constructor(id?: number, arrays?: Float9) {
        super(id, arrays);

        this.mat2 = new Matrix2x2(this.id, [
            this.arrays[0], this.arrays[1],
            this.arrays[3], this.arrays[4],
        ]);
        this.translation2D = new Position2D(this.id, [this.arrays[6], this.arrays[7]]);
        this.translation = new Position3D(this.id, [this.arrays[6], this.arrays[7], this.arrays[8]]);
        this.scale = new Direction3D(this.id, [this.arrays[0], this.arrays[4], this.arrays[8]]);

        this.x_axis = new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]]);
        this.y_axis = new Direction3D(this.id, [this.arrays[3], this.arrays[4], this.arrays[5]]);
        this.z_axis = new Direction3D(this.id, [this.arrays[6], this.arrays[7], this.arrays[8]]);
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

    setToCrossProductOf(v: Vector & IVector3D): this {
        this._.set_to_cross_product(
            this.id, this.arrays,
            v.id, v.arrays
        );

        return this;
    }

    setToOuterProductOf(v1: Vector & IVector3D, v2: Vector & IVector3D = v1): this {
        this._.set_to_outer_product(
            this.id, this.arrays,
            v1.id, v1.arrays,
            v2.id, v2.arrays
        );

        return this;
    }

    translate2DBy(x: number, y: number = 0, out?: this): this {
        if (out && !out.is(this)) {
            if (x) out.mat2.x_axis.arrays[0][out.id] = x + this.mat2.x_axis.arrays[0][this.id];
            if (y) out.mat2.y_axis.arrays[1][out.id] = y + this.mat2.y_axis.arrays[1][this.id];

            return out;
        }

        if (x) this.mat2.x_axis.arrays[0][this.id] += x;
        if (y) this.mat2.y_axis.arrays[1][this.id] += y;

        return this;
    }
}

export class Matrix4x4 extends RotationMatrix implements IMatrix4x4
{
    protected _getFunctionSet(): IMatrixRotationFunctionSet {return matrix4x4Functions}

    arrays: Float16;
    readonly mat3: Matrix3x3;
    readonly translation: Position3D;
    readonly scale: Direction3D;

    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    constructor(id?: number, arrays?: Float16) {
        super(id, arrays);

        this.x_axis = new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]]);
        this.y_axis = new Direction3D(this.id, [this.arrays[4], this.arrays[5], this.arrays[6]]);
        this.z_axis = new Direction3D(this.id, [this.arrays[8], this.arrays[9], this.arrays[10]]);

        this.translation = new Position3D(this.id, [this.arrays[12], this.arrays[13], this.arrays[14]]);
        this.scale = new Direction3D(this.id, [this.arrays[0], this.arrays[5], this.arrays[10]]);
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

    toString(): string {
        const a = this.arrays;
        const i = this.id;
        return `${a[0][i]} ${a[1][i]} ${a[2][i]} ${a[3][i]}
${a[4][i]} ${a[5][i]} ${a[6][i]} ${a[7][i]}
${a[8][i]} ${a[9][i]} ${a[10][i]} ${a[11][i]}
${a[12][i]} ${a[13][i]} ${a[14][i]} ${a[15][i]}`;
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