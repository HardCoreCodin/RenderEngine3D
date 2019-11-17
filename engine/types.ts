export type Str2 = [string, string];
export type Str3 = [string, string, string];
export type Str4 = [string, string, string, string];
export type Num2 = [number, number];
export type Num3 = [number, number, number];
export type Num4 = [number, number, number, number];
export type NumArrays2 = [number[], number[]];
export type NumArrays3 = [number[], number[], number[]];
export type NumArrays4 = [number[], number[], number[], number[]];
export type NumArrays = number[][]

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

export const IntArray = Uint32Array;
export type IntArray = Uint32Array;
export type IntArrays = Uint32Array[];
export type IntArrays3 = [Uint32Array, Uint32Array, Uint32Array];

export const FloatArray = Float32Array;
export type FloatArray = Float32Array;
export type FloatArrays2 = readonly [FloatArray, FloatArray];
export type FloatArrays3 = readonly [FloatArray, FloatArray, FloatArray];
export type FloatArrays4 = readonly [FloatArray, FloatArray, FloatArray, FloatArray];
export type FloatArrays9 = readonly [
    FloatArray, FloatArray, FloatArray,
    FloatArray, FloatArray, FloatArray,
    FloatArray, FloatArray, FloatArray
];
export type FloatArrays16 = readonly [
    FloatArray, FloatArray, FloatArray, FloatArray,
    FloatArray, FloatArray, FloatArray, FloatArray,
    FloatArray, FloatArray, FloatArray, FloatArray,
    FloatArray, FloatArray, FloatArray, FloatArray
];
export type FloatArrays = readonly FloatArray[];
export type FloatValues = FloatArrays2 | FloatArrays3 | FloatArrays4 | FloatArrays9 | FloatArrays16;
export type FaceValues = FloatValues;
export type SharedVertexValues = FloatValues;
export type UnsharedVertexValues = [FloatValues, FloatValues, FloatValues];

export type Vector2DValues = FloatArrays2;
export type Vector3DValues = FloatArrays3;
export type Vector4DValues = FloatArrays4;
export type VectorValues = Vector2DValues | Vector3DValues | Vector4DValues;

export type Matrix2x2Values = FloatArrays4;
export type Matrix3x3Values = FloatArrays9;
export type Matrix4x4Values = FloatArrays16;
export type MatrixValues = Matrix2x2Values | Matrix3x3Values | Matrix4x4Values;

export type Values = VectorValues | MatrixValues;
export type FaceInputs = QuadInputs | TriangleInputs;
export type FaceInputStr = QuadInputStr | TriangleInputStr;
export type FaceInputNum = QuadInputNum | TriangleInputNum;
export type VertexInputs = PositionInputs | NormalInputs | UVInputs | ColorInputs;
export type VertexInputStr = PositionInputStr | ColorInputStr | NormalInputStr | UVInputStr;
export type VertexInputNum = PositionInputNum | ColorInputNum | NormalInputNum | UVInputNum;
export type VertexValues = SharedVertexValues | UnsharedVertexValues;
export type VertexFacesIndices = IntArrays;
export type FaceVertexIndices = IntArrays3;

export type AnyFunction<FunctionReturnType = any> = (...input: any[]) => FunctionReturnType;
export type AnyConstructor<ConstructorInstanceType = object> = new (...input: any[]) => ConstructorInstanceType;
export type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;

export type TypedArray = ArrayLike<any> & {
    BYTES_PER_ELEMENT: number;
    buffer: ArrayBuffer,
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): TypedArray;
};
export type TypedArrayConstructor<T> = {
    new (): T;
    new (length: number): T;
    new (object: ArrayLike<number>): T;
    new (buffer: ArrayBuffer, bytesOffset?: number, length?: number): T;
    BYTES_PER_ELEMENT: number;
}