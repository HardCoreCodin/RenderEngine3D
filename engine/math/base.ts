import {IArithmaticFunctions, IBaseFunctions} from "./interfaces/functions.js";
import {IBase, IBaseArithmatic} from "./interfaces/classes.js";
import {AnyConstructor} from "../types.js";

export abstract class Base implements IBase
{
    readonly abstract _: IBaseFunctions;

    constructor(public id: number) {}

    setTo(...values: number[]): this {
        this._.set_to(this.id, ...values);

        return this;
    }

    setAllTo(value: number): this {
        this._.set_all_to(this.id, value);

        return this;
    }

    setFrom(other: this): this {
        this._.set_from(this.id, other.id);

        return this;
    }

    readonly is = (other: this): boolean => this.id === other.id;
    readonly equals = (other: this): boolean => other.is(this) || this._.equals(other.id, this.id);

    copy(out?: this): this {
        if (!out)
            out = new (this.constructor as AnyConstructor<this>)(this._.getTempID());

        this._.set_from(out.id, this.id);

        return out;
    }
}

export abstract class BaseArithmatic
    extends Base implements IBaseArithmatic
{
    readonly abstract _: IArithmaticFunctions;

    add(other: this) {
        this._.add_in_place(this.id, other.id);

        return this;
    }

    subtract(other: this): this {
        return undefined;
    }

    scaleBy(factor: number): this {
        this._.scale_in_place(this.id, factor);

        return this;
    }

    divideBy(denominator: number): this {
        this._.divide_in_place(this.id, denominator);

        return this;
    }

    plus(other: BaseArithmatic, out: this = this.copy()): this {
        if (out.is(this))
            this._.add_in_place(this.id, other.id);
        else
            this._.add(this.id, other.id, out.id);

        return out;
    }

    minus(other: BaseArithmatic, out: this = this.copy()): this {
        if (out.is(this))
            this._.set_all_to(this.id, 0);
        else
            this._.subtract(this.id, other.id, out.id);

        return out;
    }

    times(factor: number, out: this = this.copy()): this {
        if (out.is(this))
            this._.scale_in_place(this.id, factor);
        else
            this._.scale(this.id, out.id, factor);

        return out;
    }

    over(denominator: number, out: this = this.copy()): this {
        if (out.is(this))
            this._.divide_in_place(this.id, denominator);
        else
            this._.divide(this.id, denominator, out.id);

        return out;
    }


    invert(): this {
        this._.invert_in_place(this.id);

        return this;
    }

    inverted(out: this = this.copy()): this {
        this._.invert(this.id, out.id);

        return out;
    }
}

