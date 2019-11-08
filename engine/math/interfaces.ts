import {Vector2DValues, Vector3DValues, Vector4DValues, VectorValues} from "../types.js";

interface IBase {
    id: number
}

export interface IBaseDirection extends IBase {
    length: number;
    length_squared: number;
    dot(other: this) : number;
    invert() : this;
    normalize() : this;
    normalized(out: this) : this;
}

export interface IBasePosition extends IBase {
    squaredDistanceTo(other: this) : number;
    distanceTo(other: this) : number;
}

export interface IBaseColor extends IBase {
    setGreyScale(color: number) : this;
    r: number;
    g: number;
    b: number;
}

export interface IBaseUV extends IBase {
    u: number;
    v: number;
}


export interface IBase2D extends IBase {
    xs: Float32Array,
    ys: Float32Array,

    setTo(x: number, y: number);
    arrays: readonly [Float32Array, Float32Array];

    x: number;
    y: number;
}

export interface IBase3D extends IBase {
    xs: Float32Array,
    ys: Float32Array,
    zs: Float32Array,

    setTo(x: number, y: number, z: number);
    arrays: readonly [Float32Array, Float32Array, Float32Array];

    x: number;
    y: number;
    z: number;
}

export interface IBase4D extends IBase {
    xs: Float32Array,
    ys: Float32Array,
    zs: Float32Array,
    ws: Float32Array,

    setTo(x: number, y: number, z: number, w: number);
    arrays: readonly [Float32Array, Float32Array, Float32Array, Float32Array];

    x: number;
    y: number;
    z: number;
    w: number;
}

export type IBaseDirection2D = IBaseDirection & IBase2D;
export type IBaseDirection3D = IBaseDirection & IBase3D;
export type IBaseDirection4D = IBaseDirection & IBase4D;

export type IBasePosition2D = IBasePosition & IBase2D;
export type IBasePosition3D = IBasePosition & IBase3D;
export type IBasePosition4D = IBasePosition & IBase4D;

export type IBaseColor3D = IBaseColor & IBase3D;
export type IBaseColor4D = IBaseColor & IBase4D;

export type IBaseUV2D = IBaseUV & IBase2D;
export type IBaseUV3D = IBaseUV & IBase3D;

export interface IBaseVector<Matrix extends IBaseMatrix = IBaseMatrix> extends IBase {
    copyTo(out: any) : typeof out
    setFromOther(other: any) : any;
    isSameAs(other: any);
    equals(other: any);
    lerp(to: any, by: number, out: any) : any;
    add(other: any);
    sub(other: any) : this;
    plus(other: any, out: any) : typeof out;
    minus(other: any, out: any) : typeof out;
    div(by: number) : any;
    mul(factor_or_matrix: number | Matrix) : any;
    over(by: number, out: any) : any;
    times(factor_or_matrix: number | Matrix, out: any) : any;
}

export type IBaseDirectionVector = IBaseVector & IBaseDirection;
export type IBasePositionVector = IBaseVector & IBasePosition;
export type IBaseColorVector = IBaseVector & IBaseColor;
export type IBaseUVVector = IBaseVector & IBaseUV;

// export type IBaseVector2D = IBaseVector<IBase2D>;
// export type lBaseVector3D = IBaseVector<IBase3D>;
// export type IBaseVector4D = IBaseVector<IBase4D>;

export type IBaseVectorPosition2D = IBaseVector<IBaseMatrix2x2> & IBasePosition2D;
export type IBaseVectorPosition3D = IBaseVector<IBaseMatrix3x3> & IBasePosition3D;
export type IBaseVectorPosition4D = IBaseVector<IBaseMatrix4x4> & IBasePosition4D;

export type IBaseVectorDirection2D = IBaseVector<IBaseMatrix2x2> & IBaseDirection2D;
export type IBaseVectorDirection3D = IBaseVector<IBaseMatrix3x3> & IBaseDirection3D;
export type IBaseVectorDirection4D = IBaseVector<IBaseMatrix4x4> & IBaseDirection4D;

export type IBaseVectorColor3D = IBaseVector<IBaseMatrix3x3> & IBaseColor3D;
export type IBaseVectorColor4D = IBaseVector<IBaseMatrix4x4> & IBaseColor4D;

export type IBaseVectorUV2D = IBaseVector & IBaseUV2D;
export type IBaseVectorUV3D = IBaseVector & IBaseUV3D;

export interface IAddSub<TOther extends IBase> extends IBase {
    readonly add: (other: TOther) => this;
    readonly sub: (other: TOther) => this;
}

export interface IVector<
    Matrix extends IBaseMatrix = IBaseMatrix,
    Other extends IAddSub<Other> = IBaseVector,
    Out extends IAddSub<Other> = IBaseVector
    > extends IBaseVector<Matrix> {
    copyTo(out: this) : typeof out
    setFromOther(other: this) : this;
    isSameAs(other: this);
    equals(other: this);
    lerp(to: this, by: number, out: this) : this;
    add(other: Other);
    sub(other: Other) : this;
    div(by: number) : this;
    mul(factor_or_matrix: number | Matrix) : this;
    plus(other: Other, out: Out) : typeof out;
    minus(other: Other, out: Out) : typeof out;
    over(by: number, out: this) : this;
    times(factor_or_matrix: number | Matrix, out: this) : this;
}

// Abstract vectors with just dimensionality added (no added functionality):
export type IVector2D<Other extends IAddSub<Other> & IBase2D, Out extends IAddSub<Other> & IBase2D> = IVector<IBaseMatrix2x2, Other, Out>;
export type IVector3D<Other extends IAddSub<Other> & IBase3D, Out extends IAddSub<Other> & IBase3D> = IVector<IBaseMatrix3x3, Other, Out>;
export type IVector4D<Other extends IAddSub<Other> & IBase4D, Out extends IAddSub<Other> & IBase4D> = IVector<IBaseMatrix4x4, Other, Out>;

// Abstract vectors with just additional functionality added (no dimensions):
export type IDirection<
    Matrix extends IBaseMatrix = IBaseMatrix,
    Other extends IAddSub<Other> = IBaseDirectionVector,
    Out extends IAddSub<Other> = IBaseDirectionVector
    > = IBaseDirection & IVector<Matrix, Other, Out>;
export type IPosition<
    Matrix extends IBaseMatrix = IBaseMatrix,
    Other extends IAddSub<Other> = IBaseDirectionVector,
    Out extends IAddSub<Other> = IBasePositionVector
    > = IBasePosition & IVector<Matrix, Other, Out>;
export type IColor<
    Matrix extends IBaseMatrix = IBaseMatrix,
    Other extends IAddSub<Other> = IBaseColorVector,
    Out extends IAddSub<Other> = IBaseColorVector
    > = IBaseColor & IVector<Matrix, Other, Out>;
export type IUV<
    Matrix extends IBaseMatrix = IBaseMatrix,
    Other extends IAddSub<Other> = IBaseUVVector,
    Out extends IAddSub<Other> = IBaseUVVector
    > = IBaseUV & IVector< Matrix, Other, Out>;

// Applied both (but still kept somewhat abstract):
export type IDirection2D<Other extends IAddSub<Other> & IBase2D = IBaseVectorDirection2D, Out extends IAddSub<Other> & IBase2D = IBaseVectorDirection2D> = IDirection & IVector2D<Other, Out>;
export type IDirection3D<Other extends IAddSub<Other> & IBase3D = IBaseVectorDirection3D, Out extends IAddSub<Other> & IBase3D = IBaseVectorDirection3D> = IDirection & IVector3D<Other, Out>;
export type IDirection4D<Other extends IAddSub<Other> & IBase4D = IBaseVectorDirection4D, Out extends IAddSub<Other> & IBase4D = IBaseVectorDirection4D> = IDirection & IVector4D<Other, Out>;

export type IPosition2D<Other extends IAddSub<Other> & IBase2D = IBaseVectorDirection2D, Out extends IAddSub<Other> & IBase2D = IBaseVectorPosition2D> = IPosition<IMatrix2x2, Other, Out>;
export type IPosition3D<Other extends IAddSub<Other> & IBase3D = IBaseVectorDirection3D, Out extends IAddSub<Other> & IBase3D = IBaseVectorPosition3D> = IPosition<IMatrix3x3, Other, Out>;
export type IPosition4D<Other extends IAddSub<Other> & IBase4D = IBaseVectorDirection4D, Out extends IAddSub<Other> & IBase4D = IBaseVectorPosition4D> = IPosition<IMatrix4x4, Other, Out>;

export type IColor3D<Other extends IAddSub<Other> & IBase3D = IBaseVectorColor3D, Out extends IAddSub<Other> & IBase3D = IBaseVectorColor3D> = IColor<IMatrix3x3, Other, Out>;
export type IColor4D<Other extends IAddSub<Other> & IBase4D = IBaseVectorColor4D, Out extends IAddSub<Other> & IBase4D = IBaseVectorColor4D> = IColor<IMatrix4x4, Other, Out>;

export type IUV2D<Other extends IAddSub<Other> & IBase2D = IBaseVectorUV2D, Out extends IAddSub<Other> & IBase2D = IBaseVectorUV2D> = IUV<IMatrix2x2, Other, Out>;
export type IUV3D<Other extends IAddSub<Other> & IBase3D = IBaseVectorUV3D, Out extends IAddSub<Other> & IBase3D = IBaseVectorUV3D> = IUV<IMatrix3x3, Other, Out>;

export interface IBaseMatrix extends IBase {
    is_identity : boolean;
    setToIdentity() : this;
    transpose() : this;
    transposed(out: this) : this;
    copyTo(out: this) : this;
    setFromOther(other: this) : this;
    isSameAs(other: this) : boolean;
    equals(other: this) : boolean;
    add(other: this) : this;
    sub(other: this) : this;
    div(by: number) : this;
    mul(factor_or_matrix: (number | this)) : this;
    plus(other: this, out: this) : this;
    minus(other: this, out: this) : this;
    over(by: number, out: this) : this;
    times(factor_or_matrix: (number | this), out: this) : this;
}

export interface IBaseRotationMatrix extends IBaseMatrix {
    setRotationAroundX(angle: number, reset: boolean): this;
    setRotationAroundY(angle: number, reset: boolean): this;
    setRotationAroundZ(angle: number, reset: boolean): this;
}

interface IBaseMatrix2x2 extends IBaseMatrix {
    m11: Float32Array; m12: Float32Array;
    m21: Float32Array; m22: Float32Array;

    setTo(m11: number, m12: number, m21: number, m22: number) : this;
}

interface IBaseMatrix3x3 extends IBaseRotationMatrix {
    m11: Float32Array; m12: Float32Array; m13: Float32Array;
    m21: Float32Array; m22: Float32Array; m23: Float32Array;
    m31: Float32Array; m32: Float32Array; m33: Float32Array;

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number,
    ) : this;
}

interface IBaseMatrix4x4 extends IBaseRotationMatrix {
    m11: Float32Array; m12: Float32Array; m13: Float32Array; m14: Float32Array;
    m21: Float32Array; m22: Float32Array; m23: Float32Array; m24: Float32Array;
    m31: Float32Array; m32: Float32Array; m33: Float32Array; m34: Float32Array;
    m41: Float32Array; m42: Float32Array; m43: Float32Array; m44: Float32Array;

    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number,
    ) : this;
}

export interface IMatrix2x2<
    Direction extends IDirection2D = IDirection2D,
    > extends IBaseMatrix2x2 {
    i: Direction;
    j: Direction;

    setRotation(angle: number, reset?: boolean): this;
}

export interface IMatrix3x3<
    Direction extends IDirection3D = IDirection3D,
    Position extends IPosition3D = IBaseVectorPosition3D
    > extends IBaseMatrix3x3 {
    i: Direction;
    j: Direction;
    k: Direction;
    t: Position;
}

export interface IMatrix4x4<
    Direction extends IDirection4D = IDirection4D,
    Position extends IPosition4D = IBaseVectorPosition4D
    > extends IBaseMatrix4x4 {
    i: Direction;
    j: Direction;
    k: Direction;
    t: Position;
}

export type VectorConstructor<VectorInstance extends IVector> = new (arrays: VectorValues, id?: number) => VectorInstance;