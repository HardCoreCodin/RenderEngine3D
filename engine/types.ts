export type Num2 = [number[], number[]];
export type Num3 = [number[], number[], number[]];
export type Num4 = [number[], number[], number[], number[]];
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
export type FloatBuffer = Float2 | Float3 | Float4
export type NumberBuffer = Num2 | Num3 | Num4;
export type IndexBuffer = Int3;
export type Buffer = FloatBuffer | NumberBuffer| IndexBuffer;

export interface IBuffers {
    position: Buffer,
    normal?: Buffer,
    color?: Buffer,
    uv?: Buffer
}

export interface IIndexBuffers extends IBuffers {
    position: IndexBuffer,
    normal?: IndexBuffer,
    color?: IndexBuffer,
    uv?: IndexBuffer
}

export interface IVertexBuffers extends IBuffers {
    position: Float3 | Float4,
    normal?: Float3 | Float4,
    color?: Float3 | Float4,
    uv?: Float3 | Float2
}

export interface IFaceBuffers {
    normal: Float3 | Float4,
    color?: Float3 | Float4,
    position?: Float3 | Float4
}

export interface IInputVaueBuffers extends IBuffers {
    position: Num3,
    normal?: Num3,
    color?: Num3,
    uv?: Num2
}

export interface IInputIndexBuffers extends IBuffers {
    position: Num3,
    normal?: Num3,
    color?: Num3,
    uv?: Num3
}

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
