import {AbstractBuffer} from "../allocators.js";

export interface IBaseFunctions {
    buffer: AbstractBuffer,

    get(a: number, dim: number): number;
    set(a: number, dim: number, value: number): void;
    set_to(a: number, ...values: number[]): void;
    set_all_to(a: number, value: number): void;
    set_from(a: number, o: number): void;

    equals(a: number, b: number): boolean;
    invert(a: number, b: number): void;
    invert_in_place(a: number): void;
}

export interface IBase {
    _: IBaseFunctions,
    id: number;

    array_index: number,
    buffer_offset: number,

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: this): this;

    is(other: this): boolean;
    equals(other: this): boolean;

    copy(out?: this): this;
    invert(): this;
    inverted(out?: this): this;
}

export abstract class Base
    implements IBase
{
    readonly abstract _: IBaseFunctions;

    constructor(
        public buffer_offset : number,
        public array_index: number = 0
    ) {}

    get id(): number {
        return this.buffer_offset + this.array_index;
    }

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
        if (!out || out.id === this.id) {
            out = Object.create(this);
            out.buffer_offset = this._.buffer.tempID;
            out.array_index = 0;
        }

        out.setFrom(this);

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

export interface IBaseArithmaticFunctions
    extends IBaseFunctions
{
    add(a: number, b: number, o: number): void;
    add_in_place(a: number, b: number): void;

    subtract(a: number, b: number, o: number): void;
    subtract_in_place(a: number, b: number): void;

    divide(a: number, o: number, n: number): void;
    divide_in_place(a: number, n: number): void;

    scale(a: number, o: number, n: number): void;
    scale_in_place(a: number, n: number): void;

    multiply(a: number, b: number, o: number): void;
    multiply_in_place(a: number, b: number): void;
}

export interface IBaseArithmatic
    extends IBase
{
    _: IBaseArithmaticFunctions,

    add(other: this);
    subtract(other: this): this;

    divideBy(denominator: number): this;
    over(denominator: number, out?: this): this;

    scaleBy(factor: number): this;
    times(factor: number, out?: this): this;

    plus(other: IBaseArithmatic, out?: this): this;
    minus(other: IBaseArithmatic, out?: this): this;
}

export abstract class BaseArithmatic
    extends Base
    implements IBaseArithmatic
{
    readonly abstract _: IBaseArithmaticFunctions;

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

    plus(other: IBaseArithmatic, out: this = this.copy()): this {
        if (out.is(this))
            this._.add_in_place(this.id, other.id);
        else
            this._.add(this.id, other.id, out.id);

        return out;
    }

    minus(other: IBaseArithmatic, out: this = this.copy()): this {
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
}