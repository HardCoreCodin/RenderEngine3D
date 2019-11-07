import {Vector2DValues, VectorValues} from "../types.js";

export interface IVector2D {
    xs: Float32Array,
    ys: Float32Array,

    id: number
}

export interface IVector3D {
    xs: Float32Array,
    ys: Float32Array,
    zs: Float32Array,

    id: number
}

export interface IVector4D {
    xs: Float32Array,
    ys: Float32Array,
    zs: Float32Array,
    ws: Float32Array,

    id: number
}

export interface IDirection {
    dot(other: this) : number;
    invert() : this;
    normalize() : this;
    normalized(out: this) : this;
    x: number;
    y: number;
}

export interface IPosition {
    squaredDistanceTo(other: this) : number;
    distanceTo(other: this) : number;
    to(other: this, out: IDirection) : IDirection;
    x: number;
    y: number;
}

export interface IColor {
    setGreyScale(color: number) : this;
    r: number;
    g: number;
    b: number;
}

export interface IUV {
    u: number;
    v: number;
}

export type IVectorDim = IVector2D | IVector2D | IVector4D;
export type IVectorKind = IPosition | IDirection | IColor | IUV;
export type IVector = IVectorDim & IVectorKind;
export type VectorConstructor<VectorInstance extends IVector> = new (arrays: VectorValues, id?: number) => VectorInstance;