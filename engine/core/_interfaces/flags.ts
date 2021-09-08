import {IAccessor} from "./accessors.js";

export interface IFlags extends IAccessor<Uint8Array>
{
    anySet(flag: number): boolean;
    allSet(flag: number): boolean;
}

export type FlagsConstructor<FlagsType extends IFlags> = new (
    array?: Uint8Array
) => FlagsType;