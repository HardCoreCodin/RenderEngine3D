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

export type IVector = IVector2D | IVector3D | IVector4D;

export interface IDirection {
    dot(other: this) : number;
    invert() : this;
    normalize() : this;
    normalized(out: this) : this;
}

export interface IPosition {
    squaredDistanceTo(other: this) : number;
    distanceTo(other: this) : number;
    to(other: this, out: IDirection) : IDirection;
}
