import {IFaceData, IInputData, IVertexData} from "./primitives/attributes/interfaces";

export type Num2 = [number[], number[]];
export type Num3 = [number[], number[], number[]];
export type Num4 = [number[], number[], number[], number[]];
export type NumValues = Num2 | Num3 | Num4;
export type Int3 = [Uint32Array, Uint32Array, Uint32Array];
export type Float2 = [Float32Array, Float32Array];
export type Float3 = [Float32Array, Float32Array, Float32Array];
export type Float4 = [Float32Array, Float32Array, Float32Array, Float32Array];
export type Float9 = [
    Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array
];
export type Float16 = [
    Float32Array, Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array, Float32Array,
    Float32Array, Float32Array, Float32Array, Float32Array
];
export type FloatArrays = Float32Array[];
export type IntArrays = Uint32Array[];
export type FloatValues = Float2 | Float3 | Float4;
export type FaceValues = FloatValues;
export type SharedVertexValues = FloatValues;
export type UnsharedVertexValues = [
    FloatValues,
    FloatValues,
    FloatValues
];
export type VertexValues = SharedVertexValues | UnsharedVertexValues;
export type FaceVertices = Int3;
export type VertexFaces = IntArrays;
export type InputValues = Num2 | Num3 | Num4;
export type InputIndices = Num3;

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

export interface IMesh {
    readonly input: IInputData;

    readonly faces: IFaceData;
    readonly face_vertices: FaceVertices;
    readonly face_count: number;

    readonly vertices: IVertexData;
    readonly vertex_faces: VertexFaces;
    readonly vertex_count: number;
}