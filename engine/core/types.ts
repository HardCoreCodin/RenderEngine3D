export type FloatArray = Float32Array;

export type TypedArray = ArrayLike<number> & Iterable<number> & {[i: number]: number} & {
    BYTES_PER_ELEMENT: number;
    buffer: ArrayBuffer,
    set(array: ArrayLike<number>, offset?: number): void;
    fill(value: number): void;
    subarray(begin: number, end?: number): TypedArray;
    copyWithin(target: number, begin: number, end?: number): void;
};

export type TypedArrayConstructor<T> = {
    new (): T;
    new (length: number): T;
    new (object: ArrayLike<number>): T;
    new (buffer: ArrayBuffer, bytesOffset?: number, length?: number): T;
    BYTES_PER_ELEMENT: number;
}

export type T2<T> = [ T, T ];
export type T3<T> = [ T, T, T ];
export type T4<T> = [ T, T, T, T ];
export type T9<T> = [ T, T, T, T, T, T, T, T, T ];
export type T16<T> = [ T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T ];


export type Str2 = T2<string>;
export type Str3 = T3<string>;
export type Str4 = T4<string>;

export type Num2 = T2<number>;
export type Num3 = T3<number>;
export type Num4 = T4<number>;

export type NumArrays2 = T2<number[]>;
export type NumArrays3 = T3<number[]>;
export type NumArrays4 = T4<number[]>;

export type PositionInputStr = Str3;
export type ColorInputStr = Str3;
export type NormalInputStr = Str3;
export type UVInputStr = Str2;

export type QuadInputStr = Str4;
export type TriangleInputStr = Str3;

export type PositionInputNum = Num3;
export type ColorInputNum = Num3;
export type NormalInputNum = Num3;
export type UVInputNum = Num2;

export type QuadInputNum = Num4;
export type TriangleInputNum = Num3;

export type FaceInputs = Array<Num3|Num4>;
export type FaceInputStr = QuadInputStr | TriangleInputStr;
export type FaceInputNum = QuadInputNum | TriangleInputNum;
export type VertexInputs = Array<Num2|Num3|Num4>;
export type VertexInputStr = PositionInputStr | ColorInputStr | NormalInputStr | UVInputStr;
export type VertexInputNum = PositionInputNum | ColorInputNum | NormalInputNum | UVInputNum;
export type Indices = Uint8Array | Uint16Array | Uint32Array;

export const num2 = (length: number = 0): NumArrays2 => [
    Array(length),
    Array(length)
];
export const num3 = (length: number = 0): NumArrays3 => [
    Array(length),
    Array(length),
    Array(length)
];
export const num4 = (length: number = 0): NumArrays4 => [
    Array(length),
    Array(length),
    Array(length),
    Array(length)
];