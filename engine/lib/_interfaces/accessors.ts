import {Arrays, IAccessorFunctionSet, IMathFunctionSet} from "./functions.js";

export type IAccessorConstructor<Accessor extends IAccessor> = new (
    id?: number,
    arrays?: Float32Array[]
) => Accessor;

export interface IAccessor {
    _: IAccessorFunctionSet,

    id: number;
    arrays: Arrays;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: this): this;

    is(other: IAccessor): boolean;
    equals(other: IAccessor): boolean;
    copy(out?: this): this;
    toArray(array: Float32Array): Float32Array;
    _new(): this;
}

export interface IMathAccessor extends IAccessor
{
    _: IMathFunctionSet,

    add(other: IMathAccessor|number, out?: IMathAccessor): this|typeof out;
    sub(other: IMathAccessor|number, out?: IMathAccessor): this|typeof out;
    mul(other: this|number, out?: this): this;
    div(denominator: number): this;
    invert(out?: this): this;
}