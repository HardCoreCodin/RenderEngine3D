import {FloatArray, TypedArray} from "./types.js";

export const zip = (a: any[], b: any[]) : [any, any][] => {
    const result = Array(a.length);
    for (const [i, v] of a.entries())
        result[i] = [v, b[i]];
    return result;
};

export function* iterTypedArray<ArrayType extends TypedArray = FloatArray>(
    array: ArrayType,
    size: number = array.length,
    offset: number = 0,
): Generator<number> {
    for (let i = 0; i < size; i++)
        yield array[i + offset];
}

const memcpy = (
    from_array: TypedArray,
    to_array: TypedArray,

    amount?: number,

    from_offset: number = 0,
    to_offset: number = 0
): void =>
    new Uint8Array(to_array.buffer, to_offset, amount).set(
    new Uint8Array(from_array.buffer, from_offset, amount)
);