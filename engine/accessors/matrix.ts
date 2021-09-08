import {Position3D} from "./position.js";
import {Direction3D} from "./direction.js";
import {Accessor} from "./accessor.js";
import {IMatrix, IRotationMatrix} from "../core/_interfaces/matrix.js";

export default abstract class Matrix<Other extends IMatrix = IMatrix> extends Accessor implements IMatrix
{
    protected abstract _add_number_in_place(num: number): void;
    protected abstract _add_other_in_place(other: this): void;
    protected abstract _add_number_to_out(v: number, out: this): void;
    protected abstract _add_other_to_out(other: this, out: this): void;

    protected abstract _sub_number_in_place(num: number): void;
    protected abstract _sub_other_in_place(other: this): void;
    protected abstract _sub_number_to_out(num: number, out: this): void;
    protected abstract _sub_other_to_out(other: this, out: this): void;

    protected abstract _mul_number_in_place(num: number): void;
    protected abstract _mul_other_in_place(other: Other): void;
    protected abstract _mul_number_to_out(num: number, out: this): void;
    protected abstract _mul_other_to_out(other: Other, out: this): void;

    protected abstract _div_number_in_place(num: number): void;
    protected abstract _div_number_to_out(num: number, out: this): void;

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

    iadd(num: number): this;
    iadd(other: this): this;
    iadd(other_or_num: this|number): this {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._add_number_in_place(other_or_num);
        } else
            this._add_other_in_place(other_or_num);

        return this;
    }

    add(num: number, out: this): this;
    add(other: this, out: this): this;
    add(other_or_num: this|number, out: this): this {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._add_number_to_out(other_or_num, out);
        } else {
            if (out.is(this))
                return this.iadd(other_or_num);

            this._add_other_to_out(other_or_num, out);
        }

        return out;
    }

    isub(num: number): this;
    isub(other: this): this;
    isub(other_or_num: this|number): this {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._sub_number_in_place(other_or_num);
        } else {
            if (other_or_num.is(this) || other_or_num.equals(this))
                return this.setAllTo(0);

            this._sub_other_in_place(other_or_num);
        }

        return this;
    }

    sub(num: number, out: this): this;
    sub(other: this, out: this): this;
    sub(other_or_num: this|number, out: this): this {
        if (typeof other_or_num === "number") {
            if (other_or_num !== 0)
                this._sub_number_to_out(other_or_num, out);
        } else {
            if (other_or_num.is(this) || other_or_num.equals(this))
                return out.setAllTo(0);

            this._sub_other_to_out(other_or_num, out);
        }

        return out;
    }

    imul(num: number): this;
    imul(other: Other): this;
    imul(other_or_num: Other|number): this {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._mul_number_in_place(other_or_num);
        } else
            this._mul_other_in_place(other_or_num);

        return this;
    }

    mul(num: number, out: this): this;
    mul(other: Other, out: this): this;
    mul(other_or_num: Other|number, out: this): this {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._mul_number_to_out(other_or_num, out);
            else
                return this.setAllTo(0);
        } else {
            if (other_or_num.is(this))
                return this.imul(other_or_num);

            this._mul_other_to_out(other_or_num, out);
        }

        return out;
    }

    idiv(denominator: number): this {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator !== 1)
            this._div_number_in_place(denominator);

        return this;
    }

    div(denominator: number, out: this): this {
        if (out.is(this))
            return this.idiv(denominator);

        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator !== 1)
            this._div_number_to_out(denominator, out);

        return out;
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

    protected abstract _inner_rotate_around_x_in_place(sin: number, cos: number): void;
    protected abstract _inner_rotate_around_y_in_place(sin: number, cos: number): void;
    protected abstract _inner_rotate_around_z_in_place(sin: number, cos: number): void;

    protected abstract _inner_rotate_around_x_to_out(sin: number, cos: number, out: this): void;
    protected abstract _inner_rotate_around_y_to_out(sin: number, cos: number, out: this): void;
    protected abstract _inner_rotate_around_z_to_out(sin: number, cos: number, out: this): void;

    readonly abstract translation: Position3D;

    readonly abstract x_axis: Direction3D;
    readonly abstract y_axis: Direction3D;
    readonly abstract z_axis: Direction3D;

    innerRotateAroundX(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._inner_rotate_around_x_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }

        this._inner_rotate_around_x_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }

    innerRotateAroundY(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._inner_rotate_around_y_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }

        this._inner_rotate_around_y_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }

    innerRotateAroundZ(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._inner_rotate_around_z_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }

        this._inner_rotate_around_z_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }

    rotateAroundX(angle: number, out?: this, include_translation: boolean = true): this {
        if (out && !out.is(this)) {
            this._rotate_around_x_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }

        this._rotate_around_x_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }

    rotateAroundY(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._rotate_around_y_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }

        this._rotate_around_y_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }

    rotateAroundZ(angle: number, out?: this): this {
        if (out && !out.is(this)) {
            this._rotate_around_z_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }

        this._rotate_around_z_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }

    setRotationAroundX(angle: number, reset: boolean = false): this {
        if (reset)
            this.setToIdentity();

        this._set_rotation_around_x(Math.sin(angle), Math.cos(angle));
        return this;
    }

    setRotationAroundY(angle: number, reset: boolean = false): this {
        if (reset)
            this.setToIdentity();

        this._set_rotation_around_y(Math.sin(angle), Math.cos(angle));
        return this;
    }

    setRotationAroundZ(angle: number, reset: boolean = false): this {
        if (reset)
            this.setToIdentity();

        this._set_rotation_around_z(Math.sin(angle), Math.cos(angle));
        return this;
    }

    translateBy(x: number, y: number = 0, z: number = 0, out?: this): this {
        if (out && !out.is(this)) {
            if (x) out.translation.array[0] = x + this.translation.array[0];
            if (y) out.translation.array[1] = y + this.translation.array[1];
            if (z) out.translation.array[2] = z + this.translation.array[2];

            return out;
        }

        if (x) this.translation.array[0] += x;
        if (y) this.translation.array[1] += y;
        if (z) this.translation.array[2] += z;

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

        if (x !== 1) this.x_axis.imul(x);
        if (y !== 1) this.y_axis.imul(y);
        if (z !== 1) this.z_axis.imul(z);
        return this;
    }
}

