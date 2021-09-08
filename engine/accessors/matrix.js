import { Accessor } from "./accessor.js";
export default class Matrix extends Accessor {
    transpose(out) {
        if (out && !out.is(this)) {
            this._transpose_to_out(out);
            return out;
        }
        this._transpose_in_place();
        return this;
    }
    invert(out) {
        if (out && !out.is(this)) {
            this._invert_to_out(out);
            return out;
        }
        this._invert_in_place();
        return this;
    }
    iadd(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._add_number_in_place(other_or_num);
        }
        else
            this._add_other_in_place(other_or_num);
        return this;
    }
    add(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._add_number_to_out(other_or_num, out);
        }
        else {
            if (out.is(this))
                return this.iadd(other_or_num);
            this._add_other_to_out(other_or_num, out);
        }
        return out;
    }
    isub(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._sub_number_in_place(other_or_num);
        }
        else {
            if (other_or_num.is(this) || other_or_num.equals(this))
                return this.setAllTo(0);
            this._sub_other_in_place(other_or_num);
        }
        return this;
    }
    sub(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num !== 0)
                this._sub_number_to_out(other_or_num, out);
        }
        else {
            if (other_or_num.is(this) || other_or_num.equals(this))
                return out.setAllTo(0);
            this._sub_other_to_out(other_or_num, out);
        }
        return out;
    }
    imul(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._mul_number_in_place(other_or_num);
        }
        else
            this._mul_other_in_place(other_or_num);
        return this;
    }
    mul(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                this._mul_number_to_out(other_or_num, out);
            else
                return this.setAllTo(0);
        }
        else {
            if (other_or_num.is(this))
                return this.imul(other_or_num);
            this._mul_other_to_out(other_or_num, out);
        }
        return out;
    }
    idiv(denominator) {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator !== 1)
            this._div_number_in_place(denominator);
        return this;
    }
    div(denominator, out) {
        if (out.is(this))
            return this.idiv(denominator);
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator !== 1)
            this._div_number_to_out(denominator, out);
        return out;
    }
}
export class RotationMatrix extends Matrix {
    innerRotateAroundX(angle, out) {
        if (out && !out.is(this)) {
            this._inner_rotate_around_x_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }
        this._inner_rotate_around_x_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }
    innerRotateAroundY(angle, out) {
        if (out && !out.is(this)) {
            this._inner_rotate_around_y_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }
        this._inner_rotate_around_y_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }
    innerRotateAroundZ(angle, out) {
        if (out && !out.is(this)) {
            this._inner_rotate_around_z_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }
        this._inner_rotate_around_z_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }
    rotateAroundX(angle, out, include_translation = true) {
        if (out && !out.is(this)) {
            this._rotate_around_x_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }
        this._rotate_around_x_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }
    rotateAroundY(angle, out) {
        if (out && !out.is(this)) {
            this._rotate_around_y_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }
        this._rotate_around_y_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }
    rotateAroundZ(angle, out) {
        if (out && !out.is(this)) {
            this._rotate_around_z_to_out(Math.sin(angle), Math.cos(angle), out);
            return out;
        }
        this._rotate_around_z_in_place(Math.sin(angle), Math.cos(angle));
        return this;
    }
    setRotationAroundX(angle, reset = false) {
        if (reset)
            this.setToIdentity();
        this._set_rotation_around_x(Math.sin(angle), Math.cos(angle));
        return this;
    }
    setRotationAroundY(angle, reset = false) {
        if (reset)
            this.setToIdentity();
        this._set_rotation_around_y(Math.sin(angle), Math.cos(angle));
        return this;
    }
    setRotationAroundZ(angle, reset = false) {
        if (reset)
            this.setToIdentity();
        this._set_rotation_around_z(Math.sin(angle), Math.cos(angle));
        return this;
    }
    translateBy(x, y = 0, z = 0, out) {
        if (out && !out.is(this)) {
            if (x)
                out.translation.array[0] = x + this.translation.array[0];
            if (y)
                out.translation.array[1] = y + this.translation.array[1];
            if (z)
                out.translation.array[2] = z + this.translation.array[2];
            return out;
        }
        if (x)
            this.translation.array[0] += x;
        if (y)
            this.translation.array[1] += y;
        if (z)
            this.translation.array[2] += z;
        return this;
    }
    rotateBy(x, y = 0, z = 0, out) {
        if (x)
            this.rotateAroundX(x, out);
        if (y)
            this.rotateAroundY(y, out);
        if (z)
            this.rotateAroundZ(z, out);
        return this;
    }
    scaleBy(x, y = x, z = x, out) {
        if (out && !out.is(this)) {
            if (x !== 1)
                this.x_axis.mul(x, out.x_axis);
            if (y !== 1)
                this.y_axis.mul(y, out.y_axis);
            if (z !== 1)
                this.z_axis.mul(z, out.z_axis);
            return out;
        }
        if (x !== 1)
            this.x_axis.imul(x);
        if (y !== 1)
            this.y_axis.imul(y);
        if (z !== 1)
            this.z_axis.imul(z);
        return this;
    }
}
//# sourceMappingURL=matrix.js.map