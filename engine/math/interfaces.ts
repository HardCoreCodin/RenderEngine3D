export interface IBaseFunctions {
    getNextAvailableID(temp?: boolean): number;
    allocate(size: number): void;

    // get(a: number, dim: DIM): number;
    // set(a: number, dim: DIM, value: number): void;
    set_to(a: number, ...values: number[]): void;
    set_all_to(a: number, value: number): void;
    set_from(a: number, o: number): void;

    equals(a: number, b: number): boolean;

    invert(a: number, b: number): void;
    invert_in_place(a: number): void;
}
export interface IBase {
    id: number;
    readonly _: IBaseFunctions;

    setTo(...values: number[]): this;
    setAllTo(value: number): this;
    setFrom(other: this): this;

    is(other: this): boolean;
    equals(other: this): boolean;

    copy(out?: this): this;

    invert(): this;
    inverted(out?: this): this;
}

// Arythmatic:
export interface IBaseArithmaticFunctions extends IBaseFunctions {
    add(a: number, b: number, o: number): void;
    add_in_place(a: number, b: number): void;

    subtract(a: number, b: number, o: number): void;
    subtract_in_place(a: number, b: number): void;

    divide(a: number, o: number, n: number): void;
    divide_in_place(a: number, n: number): void;

    scale(a: number, o: number, n: number): void;
    scale_in_place(a: number, n: number): void;

    multiply(a: number, b: number, o: number): void;
    multiply_in_place(a: number, b: number): void;
}
export interface IBaseArithmatic extends IBase {
    readonly _: IBaseArithmaticFunctions;

    add(other: this);
    subtract(other: this): this;

    divideBy(denominator: number): this;
    scaleBy(factor: number): this;

    over(denominator: number, out?: this): this;
    times(factor: number, out?: this): this;

    plus(other: IBaseArithmatic, out?: this): this;
    minus(other: IBaseArithmatic, out?: this): this;
}

export interface IMatrixFunctions extends IBaseArithmaticFunctions {
    is_identity(a: number): boolean;
    set_to_identity(a: number): void;

    transpose(a: number, o: number): void;
    transpose_in_place(a: number): void;
}
export interface IMatrix extends IBase {
    readonly _: IMatrixFunctions;

    is_identity: boolean;
    setToIdentity(): this;

    transpose(): this;
    transposed(out?: this): this;

    imul(other: this): this;
    mul(other: this, out?: this): this;
}

export interface IRotationMatrixFunctions extends IMatrixFunctions {
    set_rotation_around_x(a: number, cos: number, sin: number): void;
    set_rotation_around_y(a: number, cos: number, sin: number): void;
    set_rotation_around_z(a: number, cos: number, sin: number): void;
}
export interface IRotationMatrix extends IMatrix {
    readonly _: IRotationMatrixFunctions;

    setRotationAroundX(angle: number, reset: boolean): this;
    setRotationAroundY(angle: number, reset: boolean): this;
    setRotationAroundZ(angle: number, reset: boolean): this;
}

export interface IMatrix2x2 extends IMatrix {
    setTo(
        m11: number, m12: number,
        m21: number, m22: number
    ): this;
}
export interface IMatrix3x3 extends IMatrix {
    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number,
    ): this;
}
export interface IMatrix4x4 extends IMatrix {
    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number,
    ): this;
}

export interface IVectorFunctions extends IBaseArithmaticFunctions {
    distance(a: number, b: number): number;
    distance_squared(a: number, b: number): number;

    length(a: number): number;
    length_squared(a: number): number;

    normalize(a: number, o: number): void;
    normalize_in_place(a: number): void;

    dot(a: number, b: number): number;
    lerp(a: number, b: number, o: number, t: number): void;
}
export interface IVector<Other extends IBaseArithmatic = IBaseArithmatic> extends IBaseArithmatic {
    _: IVectorFunctions;

    lerp(to: this, by: number, out?: this): this;

    plus(other: Other, out?: this) : this;
    minus(other: Other, out?: this) : this;
}

export interface ITransformableVector<Matrix extends IMatrix = IMatrix> extends IVector<IDirection> {
    transform(matrix: Matrix): this;
    transformedBy(matrix: Matrix, out?: this): this;
}

export interface IDirection<Matrix extends IMatrix = IMatrix> extends ITransformableVector<Matrix> {
    length: number;
    length_squared: number;
    is_noemalized: boolean;

    dot(other: this): number;

    normalize(): this;
    normalized(out?: this): this;
}

export interface IPosition<
        Matrix extends IMatrix = IMatrix,
        Direction extends IDirection = IDirection
    > extends ITransformableVector<Matrix> {

    to(other: this, out: Direction): typeof out;
    distanceTo(other: this): number;
    squaredDistanceTo(other: this): number;
}

export interface IColor<Other extends IVector = IVector> extends IVector<Other> {
    r: number;
    g: number;
    b: number;
}

export interface IRGB extends IColor<IRGB> {
    setTo(r: number, g: number, b: number);
}

export interface IRGBA extends IColor<IRGBA> {
    setTo(r: number, g: number, b: number, a: number);

    a: number;
}

export interface IBaseUV<Other extends IVector = IVector> extends IVector<Other> {
    u: number;
    v: number;
}

export interface IUV extends IBaseUV<IUV> {
    setTo(u: number, v: number);
}

export interface IUVW extends IBaseUV<IUVW> {
    setTo(u: number, v: number, w);

    w: number;
}

export interface I2D {
    setTo(x: number, y: number): this;

    x: number;
    y: number;
}

export interface I3D {
    setTo(x: number, y: number, z: number): this;

    x: number;
    y: number;
    z: number;
}

export interface I4D {
    setTo(x: number, y: number, z: number, w: number): this;

    x: number;
    y: number;
    z: number;
    w: number;
}

// export interface IPosition2D extends IPosition<IMatrix2x2>, I2D {
//     setTo(x: number, y: number): this;
// }
// export interface IPosition3D extends IPosition<IMatrix3x3>, I3D {
//     setTo(x: number, y: number, z: number): this;
// }
// export interface IPosition4D extends IPosition<IMatrix4x4>, I4D {
//     setTo(x: number, y: number, z: number, w: number): this;
// }
//
//
// export interface IDirection2D extends IDirection<IMatrix2x2>, I2D {
//     setTo(x: number, y: number): this;
// }
// export interface IDirection3D extends IDirection<IMatrix3x3>, I3D {
//     setTo(x: number, y: number, z: number): this;
// }
// export interface IDirection4D extends IDirection<IMatrix4x4>, I4D {
//     setTo(x: number, y: number, z: number, w: number): this;
// }

//
// export type IBaseDirection2D = IDirection & IVector2D;
// export type IBaseDirection3D = IDirection & IVector3D;
// export type IBaseDirection4D = IDirection & IVector4D;
//
// export type IBasePosition2D = IPosition & IVector2D;
// export type IBasePosition3D = IPosition & IVector3D;
// export type IBasePosition4D = IPosition & IVector4D;
//
// export type IBaseColor3D = IColor & IVector3D;
// export type IBaseColor4D = IColor & IVector4D;
//
// export type IBaseUV2D = IUV & IVector2D;
// export type IBaseUV3D = IUV & IVector3D;
//
// export interface IVector<Matrix extends IBaseMatrix = IBaseMatrix> extends IBase {
//     copyTo(out: any) : typeof out
//     setFromOther(other: any) : any;
//     isSameAs(other: any);
//     isEqualTo(other: any);
//     lerp(to: any, by: number, out: any) : any;
//     add(other: any);
//     sub(other: any) : this;
//     plus(other: any, out: any) : typeof out;
//     minus(other: any, out: any) : typeof out;
//     div(by: number) : any;
//     mul(factor_or_matrix: number | Matrix) : any;
//     over(by: number, out: any) : any;
//     times(factor_or_matrix: number | Matrix, out: any) : any;
// }
//
// export type IBaseDirectionVector = IVector & IDirection;
// export type IBasePositionVector = IVector & IPosition;
// export type IBaseColorVector = IVector & IColor;
// export type IBaseUVVector = IVector & IUV;
//
// // export type IBaseVector2D = IVector<IVector2D>;
// // export type lBaseVector3D = IVector<IVector3D>;
// // export type IBaseVector4D = IVector<IVector4D>;
//
// export type IBaseVectorPosition2D = IVector<IBaseMatrix2x2> & IBasePosition2D;
// export type IBaseVectorPosition3D = IVector<IBaseMatrix3x3> & IBasePosition3D;
// export type IBaseVectorPosition4D = IVector<IBaseMatrix4x4> & IBasePosition4D;
//
// export type IBaseVectorDirection2D = IVector<IBaseMatrix2x2> & IBaseDirection2D;
// export type IBaseVectorDirection3D = IVector<IBaseMatrix3x3> & IBaseDirection3D;
// export type IBaseVectorDirection4D = IVector<IBaseMatrix4x4> & IBaseDirection4D;
//
// export type IBaseVectorColor3D = IVector<IBaseMatrix3x3> & IBaseColor3D;
// export type IBaseVectorColor4D = IVector<IBaseMatrix4x4> & IBaseColor4D;
//
// export type IBaseVectorUV2D = IVector & IBaseUV2D;
// export type IBaseVectorUV3D = IVector & IBaseUV3D;
//
// export interface IAddSub<TOther extends IBase> extends IBase {
//     readonly add: (other: TOther) => this;
//     readonly sub: (other: TOther) => this;
// }
//
// export interface IVector<
//     Matrix extends IBaseMatrix = IBaseMatrix,
//     Other extends IAddSub<Other> = IVector,
//     Out extends IAddSub<Other> = IVector
//     > extends IVector<Matrix> {
//     copyTo(out: this) : typeof out
//     setFromOther(other: this) : this;
//     isSameAs(other: this);
//     isEqualTo(other: this);
//     lerp(to: this, by: number, out: this) : this;
//     add(other: Other);
//     sub(other: Other) : this;
//     div(by: number) : this;
//     mul(factor_or_matrix: number | Matrix) : this;
//     plus(other: Other, out: Out) : typeof out;
//     minus(other: Other, out: Out) : typeof out;
//     over(by: number, out: this) : this;
//     times(factor_or_matrix: number | Matrix, out: this) : this;
// }
//
// // Abstract vectors with just dimensionality added (no added functionality):
// export type IVector2D<Other extends IAddSub<Other> & IVector2D, Out extends IAddSub<Other> & IVector2D> = IVector<IBaseMatrix2x2, Other, Out>;
// export type IVector3D<Other extends IAddSub<Other> & IVector3D, Out extends IAddSub<Other> & IVector3D> = IVector<IBaseMatrix3x3, Other, Out>;
// export type IVector4D<Other extends IAddSub<Other> & IVector4D, Out extends IAddSub<Other> & IVector4D> = IVector<IBaseMatrix4x4, Other, Out>;
//
// // Abstract vectors with just additional functionality added (no dimensions):
// export type IDirection<
//     Matrix extends IBaseMatrix = IBaseMatrix,
//     Other extends IAddSub<Other> = IBaseDirectionVector,
//     Out extends IAddSub<Other> = IBaseDirectionVector
//     > = IDirection & IVector<Matrix, Other, Out>;
// export type IPosition<
//     Matrix extends IBaseMatrix = IBaseMatrix,
//     Other extends IAddSub<Other> = IBaseDirectionVector,
//     Out extends IAddSub<Other> = IBasePositionVector
//     > = IPosition & IVector<Matrix, Other, Out>;
// export type IColor<
//     Matrix extends IBaseMatrix = IBaseMatrix,
//     Other extends IAddSub<Other> = IBaseColorVector,
//     Out extends IAddSub<Other> = IBaseColorVector
//     > = IColor & IVector<Matrix, Other, Out>;
// export type IUV<
//     Matrix extends IBaseMatrix = IBaseMatrix,
//     Other extends IAddSub<Other> = IBaseUVVector,
//     Out extends IAddSub<Other> = IBaseUVVector
//     > = IUV & IVector< Matrix, Other, Out>;
//
// // Applied both (but still kept somewhat abstract):
// export type IDirection2D<Other extends IAddSub<Other> & IVector2D = IBaseVectorDirection2D, Out extends IAddSub<Other> & IVector2D = IBaseVectorDirection2D> = IDirection & IVector2D<Other, Out>;
// export type IDirection3D<Other extends IAddSub<Other> & IVector3D = IBaseVectorDirection3D, Out extends IAddSub<Other> & IVector3D = IBaseVectorDirection3D> = IDirection & IVector3D<Other, Out>;
// export type IDirection4D<Other extends IAddSub<Other> & IVector4D = IBaseVectorDirection4D, Out extends IAddSub<Other> & IVector4D = IBaseVectorDirection4D> = IDirection & IVector4D<Other, Out>;
//
// export type IPosition2D<Other extends IAddSub<Other> & IVector2D = IBaseVectorDirection2D, Out extends IAddSub<Other> & IVector2D = IBaseVectorPosition2D> = IPosition<IMatrix2x2, Other, Out>;
// export type IPosition3D<Other extends IAddSub<Other> & IVector3D = IBaseVectorDirection3D, Out extends IAddSub<Other> & IVector3D = IBaseVectorPosition3D> = IPosition<IMatrix3x3, Other, Out>;
// export type IPosition4D<Other extends IAddSub<Other> & IVector4D = IBaseVectorDirection4D, Out extends IAddSub<Other> & IVector4D = IBaseVectorPosition4D> = IPosition<IMatrix4x4, Other, Out>;
//
// export type IColor3D<Other extends IAddSub<Other> & IVector3D = IBaseVectorColor3D, Out extends IAddSub<Other> & IVector3D = IBaseVectorColor3D> = IColor<IMatrix3x3, Other, Out>;
// export type IColor4D<Other extends IAddSub<Other> & IVector4D = IBaseVectorColor4D, Out extends IAddSub<Other> & IVector4D = IBaseVectorColor4D> = IColor<IMatrix4x4, Other, Out>;
//
// export type IUV2D<Other extends IAddSub<Other> & IVector2D = IBaseVectorUV2D, Out extends IAddSub<Other> & IVector2D = IBaseVectorUV2D> = IUV<IMatrix2x2, Other, Out>;
// export type IUV3D<Other extends IAddSub<Other> & IVector3D = IBaseVectorUV3D, Out extends IAddSub<Other> & IVector3D = IBaseVectorUV3D> = IUV<IMatrix3x3, Other, Out>;
//
// export interface IBaseMatrix extends IBase {
//     is_identity : boolean;
//     setToIdentity() : this;
//     transpose() : this;
//     transposed(out: this) : this;
//     copyTo(out: this) : this;
//     setFromOther(other: this) : this;
//     isSameAs(other: this) : boolean;
//     equals(other: this) : boolean;
//     add(other: this) : this;
//     sub(other: this) : this;
//     div(by: number) : this;
//     mul(factor_or_matrix: (number | this)) : this;
//     plus(other: this, out: this) : this;
//     minus(other: this, out: this) : this;
//     over(by: number, out: this) : this;
//     times(factor_or_matrix: (number | this), out: this) : this;
// }
//
// export interface IBaseRotationMatrix extends IBaseMatrix {
//     setRotationAroundX(angle: number, reset: boolean): this;
//     setRotationAroundY(angle: number, reset: boolean): this;
//     setRotationAroundZ(angle: number, reset: boolean): this;
// }
//
// interface IBaseMatrix2x2 extends IBaseMatrix {
//     m11: Float32Array; m12: Float32Array;
//     m21: Float32Array; m22: Float32Array;
//
//     setTo(m11: number, m12: number, m21: number, m22: number) : this;
// }
//
// interface IBaseMatrix3x3 extends IBaseRotationMatrix {
//     m11: Float32Array; m12: Float32Array; m13: Float32Array;
//     m21: Float32Array; m22: Float32Array; m23: Float32Array;
//     m31: Float32Array; m32: Float32Array; m33: Float32Array;
//
//     setTo(
//         m11: number, m12: number, m13: number,
//         m21: number, m22: number, m23: number,
//         m31: number, m32: number, m33: number,
//     ) : this;
// }
//
// interface IBaseMatrix4x4 extends IBaseRotationMatrix {
//     m11: Float32Array; m12: Float32Array; m13: Float32Array; m14: Float32Array;
//     m21: Float32Array; m22: Float32Array; m23: Float32Array; m24: Float32Array;
//     m31: Float32Array; m32: Float32Array; m33: Float32Array; m34: Float32Array;
//     m41: Float32Array; m42: Float32Array; m43: Float32Array; m44: Float32Array;
//
//     setTo(
//         m11: number, m12: number, m13: number, m14: number,
//         m21: number, m22: number, m23: number, m24: number,
//         m31: number, m32: number, m33: number, m34: number,
//         m41: number, m42: number, m43: number, m44: number,
//     ) : this;
// }
//
// export interface IMatrix2x2<
//     Direction extends IDirection2D = IDirection2D,
//     > extends IBaseMatrix2x2 {
//     i: Direction;
//     j: Direction;
//
//     setRotation(angle: number, reset?: boolean): this;
// }
//
// export interface IMatrix3x3<
//     Direction extends IDirection3D = IDirection3D,
//     Position extends IPosition3D = IBaseVectorPosition3D
//     > extends IBaseMatrix3x3 {
//     i: Direction;
//     j: Direction;
//     k: Direction;
//     t: Position;
// }
//
// export interface IMatrix4x4<
//     Direction extends IDirection4D = IDirection4D,
//     Position extends IPosition4D = IBaseVectorPosition4D
//     > extends IBaseMatrix4x4 {
//     i: Direction;
//     j: Direction;
//     k: Direction;
//     t: Position;
// }
//
// export type VectorConstructor<VectorInstance extends IVector> = new (arrays: VectorValues, id?: number) => VectorInstance;