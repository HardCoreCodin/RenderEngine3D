import {IAllocator} from "./allocators.js";

export type IAccessorConstructor<Accessor extends IAccessor> = new (array?: Float32Array) => Accessor;

export interface IAccessor {
    readonly array: Float32Array;
    readonly allocator: IAllocator<Float32Array>;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: IAccessor): IAccessor;

    is(other: IAccessor): boolean;
    equals(other: IAccessor): boolean;
    copy(out?: IAccessor): IAccessor;
}