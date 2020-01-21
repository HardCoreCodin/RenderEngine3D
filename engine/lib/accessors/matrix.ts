import {Position3D} from "./position.js";
import {Direction3D} from "./direction.js";
import {MathAccessor} from "./accessor.js";
import {Matrix3x3} from "./matrix3x3.js";
import {Matrix4x4} from "./matrix4x4.js";
import {IMatrix, IRotationMatrix} from "../_interfaces/matrix.js";

const cos = Math.cos;
const sin = Math.cos;

let this_arrays, out_arrays: Float32Array[];

export default abstract class Matrix extends MathAccessor implements IMatrix
{
    protected abstract _transpose_to_out(out: this): void;
    protected abstract _transpose_in_place(): void;

    protected abstract _invert_to_out(out: this): void;
    protected abstract _invert_in_place(): void;

    abstract get is_identity(): boolean;
    abstract setToIdentity(): this;

    transpose(out?: this): this {
        if (out && !out.is(this)) {
            this._transpose_to_out(out);
            return out;
        }

        this._transpose_in_place();
        return this;
    }

    invert(out?: this): this {
        if (out && !out.is(this)) {
            this._invert_to_out(out);
            return out;
        }

        this._invert_in_place();
        return this;
    }
}

export abstract class RotationMatrix extends Matrix implements IRotationMatrix
{
    protected abstract _set_rotation_around_x(sin: number, cos: number): void;
    protected abstract _set_rotation_around_y(sin: number, cos: number): void;
    protected abstract _set_rotation_around_z(sin: number, cos: number): void;

    protected abstract _rotate_around_x_in_place(sin: number, cos: number): void;
    protected abstract _rotate_around_y_in_place(sin: number, cos: number): void;
    protected abstract _rotate_around_z_in_place(sin: number, cos: number): void;

    protected abstract _rotate_around_x_to_out(sin: number, cos: number, out: this): void;
    protected abstract _rotate_around_y_to_out(sin: number, cos: number, out: this): void;
    protected abstract _rotate_around_z_to_out(sin: number, cos: number, out: this): void;

    readonly abstract translation: Position3D;
    readonly abstract scale: Direction3D;
    readonly abstract x_axis: Direction3D;
    readonly abstract y_axis: Direction3D;
    readonly abstract z_axis: Direction3D;

    rotateAroundX(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._rotate_around_x_to_out(sin(angle), cos(angle), out);
            return out;
        }

        this._rotate_around_x_in_place(sin(angle), cos(angle));
        return this;
    }

    rotateAroundY(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._rotate_around_y_to_out(sin(angle), cos(angle), out);
            return out;
        }

        this._rotate_around_y_in_place(sin(angle), cos(angle));
        return this;
    }

    rotateAroundZ(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._rotate_around_z_to_out(sin(angle), cos(angle), out);
            return out;
        }

        this._rotate_around_z_in_place(sin(angle), cos(angle));
        return this;
    }

    setRotationAroundX(angle: number, reset: boolean = false): this {
        if (reset)
            this.setToIdentity();

        this._set_rotation_around_x(sin(angle), cos(angle));
        return this;
    }

    setRotationAroundY(angle: number, reset: boolean = false): this {
        if (reset)
            this.setToIdentity();

        this._set_rotation_around_y(sin(angle), cos(angle));
        return this;
    }

    setRotationAroundZ(angle: number, reset: boolean = false): this {
        if (reset)
            this.setToIdentity();

        this._set_rotation_around_z(sin(angle), cos(angle));
        return this;
    }

    translateBy(x: number, y: number = 0, z: number = 0, out?: this): this {
        this_arrays = this.translation.arrays;
        out_arrays = out.translation.arrays;

        if (out && !out.is(this)) {
            if (x) out_arrays[0][out.id] = x + this_arrays[0][this.id];
            if (y) out_arrays[1][out.id] = y + this_arrays[1][this.id];
            if (z) out_arrays[2][out.id] = z + this_arrays[2][this.id];

            return out;
        }

        if (x) this_arrays[0][this.id] += x;
        if (y) this_arrays[1][this.id] += y;
        if (z) this_arrays[2][this.id] += z;

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
            if (x !== 1) this.x_axis.mul(x, out.x_axis);
            if (y !== 1) this.y_axis.mul(y, out.y_axis);
            if (z !== 1) this.z_axis.mul(z, out.z_axis);

            return out;
        }

        if (x !== 1) this.x_axis.mul(x);
        if (y !== 1) this.y_axis.mul(y);
        if (z !== 1) this.z_axis.mul(z);
        return this;
    }
}

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