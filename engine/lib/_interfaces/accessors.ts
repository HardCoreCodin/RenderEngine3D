import {IAllocator} from "./allocators.js";

export type IAccessorConstructor<Accessor extends IAccessor> = new (
    id?: number,
    arrays?: Float32Array[]
) => Accessor;

export interface IAccessor {
    id: number;
    readonly arrays: Float32Array[];
    readonly allocator: IAllocator<Float32Array>;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: IAccessor): IAccessor;

    is(other: IAccessor): boolean;
    equals(other: IAccessor): boolean;
    copy(out?: IAccessor): IAccessor;
    toArray(array: Float32Array): Float32Array;
}