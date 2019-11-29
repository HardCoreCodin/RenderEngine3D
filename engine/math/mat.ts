import {IMatrixFunctions, IMatrixRotationFunctions} from "./interfaces/functions.js";
import {IMatrix, IRotationMatrix} from "./interfaces/classes.js";
import {BaseArithmatic} from "./base.js";

export default abstract class Matrix
    extends BaseArithmatic
    implements IMatrix
{
    readonly abstract _: IMatrixFunctions;

    get is_identity(): boolean {
        return this._.is_identity(this.id);
    }

    get T(): this {
        return this.copy().transpose();
    }

    setToIdentity(): this {
        this._.set_to_identity(this.id);

        return this;
    }

    transpose(): this {
        this._.transpose_in_place(this.id);

        return this;
    }

    transposed(out: this = this.copy()): this {
        this._.transpose(this.id, out.id);

        return out;
    }

    imul(other: this): this {
        this._.multiply_in_place(this.id, other.id);

        return this;
    }

    mul(other: this, out: this = this.copy()): this {
        if (out.is(this))
            this._.multiply_in_place(this.id, other.id);
        else
            this._.multiply(this.id, other.id, out.id);

        return out;
    }
}

export abstract class RotationMatrix extends Matrix implements IRotationMatrix
{
    readonly abstract _: IMatrixRotationFunctions;

    setRotationAroundX(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(this.id);

        this._.set_rotation_around_x(this.id, Math.cos(angle), Math.sin(angle));

        return this;
    }

    setRotationAroundY(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(this.id);


        this._.set_rotation_around_y(this.id, Math.cos(angle), Math.sin(angle));

        return this;
    }

    setRotationAroundZ(angle: number, reset: boolean = false): this {
        if (reset)
            this._.set_to_identity(this.id);

        this._.set_rotation_around_z(this.id, Math.cos(angle), Math.sin(angle));

        return this;
    }

}