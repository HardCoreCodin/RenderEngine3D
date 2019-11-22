export const IntArray = Uint32Array;
export type IntArray = Uint32Array;

export const FloatArray = Float32Array;
export type FloatArray = Float32Array;

export type TypedArray = ArrayLike<number> & {
    BYTES_PER_ELEMENT: number;
    buffer: ArrayBuffer,
    set(array: ArrayLike<number>, offset?: number): void;
    subarray(begin: number, end?: number): TypedArray;
};

export type TypedArrayConstructor<T> = {
    new (): T;
    new (length: number): T;
    new (object: ArrayLike<number>): T;
    new (buffer: ArrayBuffer, bytesOffset?: number, length?: number): T;
    BYTES_PER_ELEMENT: number;
}

// import {DIM} from "./constants.js";

// export interface Tuple<T extends any, L extends DIM> extends Array<T> {0: T, length: L}


export type T2<T> = [ T, T ];
export type T3<T> = [ T, T, T ];
export type T4<T> = [ T, T, T, T ];
export type T9<T> = [ T, T, T, T, T, T, T, T, T ];
export type T16<T> = [ T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T ];
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
// export type TArray = FloatArray | IntArray;

// export type RawArray<ArrayType extends TypedArray = FloatArray> = [ArrayType, number, number];
// export type RawArrays<ArrayType extends TypedArray = FloatArray> = [ArrayType[], number, number];
//
// export type RawFloatArray = RawArray<FloatArray>;
// export type RawFloatArrays = RawArrays<FloatArray>;

// export type TypedTuple<T extends TypedArray, L extends DIM> = Tuple<T, L>;
// export type Float<L extends DIM> = TypedTuple<FloatArray, L>;
// export type Floats<L extends DIM> = Tuple<FloatArray[], L>;
//
// export type Int<L extends DIM> = TypedTuple<IntArray, L>;
// export type Ints<L extends DIM> = Tuple<IntArray[], L>;
//
// export type Str<L extends DIM> = Tuple<string, L>;
// export type Strs<L extends DIM> = Tuple<string[], L>;
//
// export type Num<L extends DIM> = Tuple<number, L>;
// export type Nums<L extends DIM> = Tuple<number[], L>;

export type Str2 = T2<string>;
export type Str3 = T3<string>;
export type Str4 = T4<string>;

export type Num2 = T2<number>;
export type Num3 = T3<number>;
export type Num4 = T4<number>;
export type Num9 = T9<number>;
export type Num16 = T16<number>;

export type NumArrays2 = T2<number[]>;
export type NumArrays3 = T3<number[]>;
export type NumArrays4 = T4<number[]>;

export type Ints3 = T3<IntArray[]>;
export type Int3 = T3<IntArray>;

export type Float2 = T2<FloatArray>;
export type Float3 = T3<FloatArray>;
export type Float4 = T4<FloatArray>;
export type Float9 = T9<FloatArray>;
export type Float16 = T16<FloatArray>;

export type PositionInputs = NumArrays3
export type NormalInputs = NumArrays3;
export type ColorInputs = NumArrays3;
export type UVInputs = NumArrays2;

export type QuadInputs = NumArrays4;
export type TriangleInputs = NumArrays3;

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

export type VectorValues = Float2 | Float3 | Float4;

export type UnsharedValues = [
    VectorValues,
    VectorValues,
    VectorValues
    ];
// export type UnsharedRawIterators = [
//     Generator<RawFloatArrays>,
//     Generator<RawFloatArrays>,
//     Generator<RawFloatArrays>
//     ];

// export type UnsharedRawComponents = [
//     RawFloatArray,
//     RawFloatArray,
//     RawFloatArray
//     ][];
// export type UnsharedRawArrays = [
//     RawFloatArrays,
//     RawFloatArrays,
//     RawFloatArrays
//     ];

export type FaceInputs = QuadInputs | TriangleInputs;
export type FaceInputStr = QuadInputStr | TriangleInputStr;
export type FaceInputNum = QuadInputNum | TriangleInputNum;
export type VertexInputs = PositionInputs | NormalInputs | UVInputs | ColorInputs;
export type VertexInputStr = PositionInputStr | ColorInputStr | NormalInputStr | UVInputStr;
export type VertexInputNum = PositionInputNum | ColorInputNum | NormalInputNum | UVInputNum;
export type VertexFacesIndices = IntArray[];
// export type FaceVertexIndices = Ints3;

// export type AnyFunction<FunctionReturnType = any> = (...input: any[]) => FunctionReturnType;
export type AnyConstructor<ConstructorInstanceType = object> = new (...input: any[]) => ConstructorInstanceType;
// export type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;


// export type FaceVertexIndexEntries = Generator<[number, [number, number, number]]>;