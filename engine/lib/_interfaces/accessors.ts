import {IAllocator} from "./allocators.js";
import {TypedArray} from "../../types.js";

export type IAccessorConstructor<
    ArrayType extends TypedArray,
    Accessor extends IAccessor<ArrayType>
    > = new (array?: ArrayType) => Accessor;

export interface IAccessor<ArrayType extends TypedArray = Float32Array> {
    readonly array: ArrayType;
    readonly allocator: IAllocator<ArrayType>;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: IAccessor<ArrayType>): IAccessor<ArrayType>;

    is(other: IAccessor<ArrayType>): boolean;
    equals(other: IAccessor<ArrayType>): boolean;
    copy(out?: IAccessor<ArrayType>): IAccessor<ArrayType>;
}