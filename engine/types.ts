// export type TypedArray =
//     | Int8Array
//     | Int16Array
//     | Int32Array
//     | Uint8Array
//     | Uint16Array
//     | Uint32Array
//     | Float32Array
//     | Float64Array;
//
// export type TypedArrayConstructor = {
//     new(length: number): TypedArray,
//     from(TypedArray): TypedArray
// }
// export type ArrayTypeConstructor = {
//     new(length: number): ArrayType,
//     from(TypedArray): ArrayType
// }
// export type ItemTypeConstructor = {
//     new(typed_array: TypedArray,
//         typed_array_offset: number),
// }

export const ArrayType = Float32Array;
export type ArrayType = Float32Array;
export type SoA = ArrayType[];

export type nbo_v = (
    angle: number,
    reset: boolean,

    out: SoA,
    out_index: number
) => void;

export type l_b = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number
) => boolean;

export type l_n = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number
) => number;

export type lo_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) => void;

export type l_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number
) => void;

export type lr_b = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) => boolean;

export type lr_n = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) => number;

export type lr_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number
) => void;

export type ln_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    n: number
) => void;

export type lro_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) => void;

export type lno_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    n: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) => void;

export type lrno_v = (
    x0: ArrayType,
    y0: ArrayType,
    z0: ArrayType,
    i0: number,

    x1: ArrayType,
    y1: ArrayType,
    z1: ArrayType,
    i1: number,

    t: number,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) => void;

export type lmo_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    m: ArrayType,

    X: ArrayType,
    Y: ArrayType,
    Z: ArrayType,
    o: number
) => void;

export type lm_v = (
    x: ArrayType,
    y: ArrayType,
    z: ArrayType,
    i: number,

    m: ArrayType
) => void;