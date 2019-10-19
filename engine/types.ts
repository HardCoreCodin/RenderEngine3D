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

export type floatData = Float32Array[];
export type float3 = [Float32Array, Float32Array, Float32Array];
export type float4 = [Float32Array, Float32Array, Float32Array, Float32Array];

export const int = Uint32Array;
export type int = Uint32Array;
export type intArray = int[];
export type int3 = [int, int, int];
export type int4 = [int, int, int, int];

export type f_v = (a: floatData, i: number) => void;
export type f_b = (a: floatData, i: number) => boolean;
export type f_n = (a: floatData, i: number) => number;
export type fn_v = (a: floatData, i: number, n: number) => void;
export type fnf_v = (a: floatData, i: number, n: number,
                     o: floatData, k: number) => void;
export type ff_v = (a: floatData, i: number,
                    o: floatData, k: number) => void;
export type ff_b = (a: floatData, i: number,
                    b: floatData, j: number) => boolean;
export type ff_n = (a: floatData, i: number,
                    b: floatData, j: number) => number;
export type fff_v = (a: floatData, i: number,
                     b: floatData, j: number,
                     o: floatData, k: number) => void;
export type ffnf_v = (a: floatData, i: number,
                      b: floatData, j: number, t: number,
                      o: floatData, k: number) => void;
export type fm_v = (a: floatData, i: number, m: Float32Array) => void;
export type fmf_v = (a: floatData, i: number, m: Float32Array,
                     o: floatData, k: number) => void;
export type m_v = (m: Float32Array) => void;
export type m_b = (m: Float32Array) => boolean;
export type mf_v = (m: Float32Array,
                    o: Float32Array) => void;
export type mm_b = (a: Float32Array,
                    b: Float32Array) => boolean;
export type mmm_v = (a: Float32Array,
                     b: Float32Array,
                     o: Float32Array) => void;
export type mm_v = (a: Float32Array,
                     b: Float32Array) => void;
export type mnb_v = (m: Float32Array, angle: number, reset: boolean) => void;

