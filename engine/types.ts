export type TypedArray =
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Float32Array
    | Float64Array;

export const ArrayType = Float32Array;
export type ArrayType = Float32Array;
export type ArrayTypeConstructor = {
    new(length: number): ArrayType,
    from(TypedArray): ArrayType
}
// export type Color3DBuffer = Uint8Array;
// export const Color3DBuffer = Uint8Array;
// export const Color3DBufferLength = 3;

export type number_bool_op = (
    out: ArrayType,
    angle: number,
    reset: boolean,
    out_offset?: number
) => void;
export type unary_bool_op = (
    lhs: ArrayType,
    lhs_offset?: number
) => boolean;
export type unary_number_op = (
    lhs: ArrayType,
    lhs_offset?: number
) => number;
export type unary_op = (
    out: ArrayType,
    lhs: ArrayType,
    out_offset?: number,
    lhs_offset?: number
) => void;
export type in_place_unary_op = (
    lhs: ArrayType,
    lhs_offset?: number
) => void;
export type bool_op = (
    lhs: ArrayType,
    rhs: ArrayType,
    lhs_offset?: number,
    rhs_offset?: number
) => boolean;
export type number_op = (
    lhs: ArrayType,
    rhs: ArrayType,
    lhs_offset?: number,
    rhs_offset?: number
) => number;
export type in_place_op = (
    lhs: ArrayType,
    rhs: ArrayType,
    lhs_offset?: number,
    rhs_offset?: number
) => void;
export type in_place_number_op = (
    lhs: ArrayType,
    rhs: number,
    lhs_offset?: number,
) => void;
export type out_op = (
    out: ArrayType,
    lhs: ArrayType,
    rhs: ArrayType,
    out_offset?: number,
    rhs_offset?: number,
    lhs_offset?: number
) => void;
export type out_number_op = (
    out: ArrayType,
    lhs: ArrayType,
    rhs: number,
    out_offset?: number,
    lhs_offset?: number
) => void;
export type out_by_op = (
    out: ArrayType,
    from: ArrayType,
    to: ArrayType,
    by: number,
    out_offset?: number,
    from_offset?: number,
    to_offset?: number
) => void;