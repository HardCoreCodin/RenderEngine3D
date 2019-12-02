import {Arrays, IMathFunctionSet, IFunctionSet} from "../function_sets.js";

export type IAccessorConstructor<Accessor extends IAccessor> = new (
    id?: number,
    arrays?: Float32Array[]
) => Accessor;

export interface IAccessor {
    _: IFunctionSet,

    id: number;
    arrays: Arrays;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: this): this;

    is(other: IAccessor): boolean;
    equals(other: IAccessor): boolean;

    copy(out?: this): this;
}

export interface IMathAccessor
    extends IAccessor
{
    _: IMathFunctionSet,
    _newOut(): IMathAccessor;

    add(other: IMathAccessor);
    sub(other: IMathAccessor): this;
    mul(other: IMathAccessor|number): this;
    times(other: IMathAccessor|number, out?: this): this;

    div(denominator: number): this;
    over(denominator: number, out?: this): this;

    plus(other: IMathAccessor, out?: IMathAccessor): IMathAccessor;
    minus(other: IMathAccessor, out?: IMathAccessor): IMathAccessor;

    invert(): this;
    inverted(out?: this): this;
}