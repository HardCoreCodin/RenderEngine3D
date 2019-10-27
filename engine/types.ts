import {IFaceData, IInputData, IVertexData} from "./primitives/attributes/interfaces.js";

export type Str2 = [string, string];
export type Str3 = [string, string, string];
export type Str4 = [string, string, string, string];
// export type Str = Str2 | Str3 | Str4;
export type Num2 = [number, number];
export type Num3 = [number, number, number];
export type Num4 = [number, number, number, number];
// export type Num = Num2 | Num3 | Num4;
export type NumArrays2 = [number[], number[]];
export type NumArrays3 = [number[], number[], number[]];
export type NumArrays4 = [number[], number[], number[], number[]];
export type NumArrays = number[][]

// export type InputUV1D = NumArrays1;
// export type InputUV2D = NumArrays2;
// export type InputUV3D = NumArrays3;
// export type InputUV = InputUV1D | InputUV2D | InputUV3D;
// export type InputPosition2D = NumArrays2
// export type InputPosition3D = NumArrays3
// export type InputPosition4D = NumArrays4
// export type InputPosition = InputPosition2D | InputPosition3D | InputPosition4D;

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

export type IntArrays3 = [Uint32Array, Uint32Array, Uint32Array];
export type IntArrays = Uint32Array[];

export type FloatArrays2 = [Float32Array, Float32Array];
export type FloatArrays3 = [Float32Array, Float32Array, Float32Array];
export type FloatArrays4 = [Float32Array, Float32Array, Float32Array, Float32Array];
export type FloatArrays9 = [
    Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array
];
export type FloatArrays16 = [
    Float32Array, Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array, Float32Array
];
export type FloatArrays = Float32Array[];

// export type PositionValues = FloatArrays3 | FloatArrays4;
// export type ColorValues = FloatArrays3 | FloatArrays4;
// export type NormalValues = FloatArrays3;
// export type UvValues = FloatArrays2 | FloatArrays3;
export type Values = FloatArrays2 | FloatArrays3 | FloatArrays4;
// export type FaceValues = FloatArrays2 | FloatArrays3 | FloatArrays4;
// export type SharedVertexValues = Values;
export type UnsharedVertexValues = [Values, Values, Values];

export type f_v = (a: FloatArrays, i: number) => void;
export type f_b = (a: FloatArrays, i: number) => boolean;
export type f_n = (a: FloatArrays, i: number) => number;
export type fn_v = (a: FloatArrays, i: number, n: number) => void;
export type fnf_v = (a: FloatArrays, i: number, n: number,
                     o: FloatArrays, k: number) => void;
export type ff_v = (a: FloatArrays, i: number,
                    o: FloatArrays, k: number) => void;
export type ff_b = (a: FloatArrays, i: number,
                    b: FloatArrays, j: number) => boolean;
export type ff_n = (a: FloatArrays, i: number,
                    b: FloatArrays, j: number) => number;
export type fff_v = (a: FloatArrays, i: number,
                     b: FloatArrays, j: number,
                     o: FloatArrays, k: number) => void;
export type ffnf_v = (a: FloatArrays, i: number,
                      b: FloatArrays, j: number, t: number,
                      o: FloatArrays, k: number) => void;
export type fnb_v = (a: FloatArrays, i: number, angle: number, reset: boolean) => void;

export type FaceInputs = QuadInputs | TriangleInputs;
export type FaceInputStr = QuadInputStr | TriangleInputStr;
export type FaceInputNum = QuadInputNum | TriangleInputNum;
export type VertexInputs = PositionInputs | NormalInputs | UVInputs | ColorInputs;
export type VertexInputStr = PositionInputStr | ColorInputStr | NormalInputStr | UVInputStr;
export type VertexInputNum = PositionInputNum | ColorInputNum | NormalInputNum | UVInputNum;
export type VertexValues = Values | UnsharedVertexValues;
export type VertexFaces = IntArrays;
export type FaceVertices = IntArrays3;


export interface IMesh {
    readonly input: IInputData;

    readonly faces: IFaceData;
    readonly face_vertices: FaceVertices;
    readonly face_count: number;

    readonly vertices: IVertexData;
    readonly vertex_faces: VertexFaces;
    readonly vertex_count: number;
}