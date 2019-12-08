import {IAccessorConstructor, IMathAccessor} from "./accessors.js";
import {
    ICrossDirectionFunctionSet, IDirection3DFunctionSet,
    IDirectionFunctionSet, IPosition3DFunctionSet,
    // IPosition4DFunctionSet,
    IPositionFunctionSet,
    ITransformableVectorFunctionSet,
    IVectorFunctionSet
} from "./functions.js";
import {IMatrix, IMatrix2x2, IMatrix3x3, IMatrix4x4} from "./matrix.js";
import {DIM} from "../../constants.js";


export interface IVector
    extends IMathAccessor {
    _: IVectorFunctionSet;

    lerp(to: this, by: number, out?: this): this;
}

export interface ITransformableVector<Matrix extends IMatrix = IMatrix>
    extends IVector {
    _: ITransformableVectorFunctionSet

    imatmul(matrix: Matrix): this;

    matmul(matrix: Matrix, out?: this): this;
}

export interface IVector2D {
    x: number;
    y: number;
}

export interface IVector3D extends IVector2D {
    z: number;
}

export interface IVector4D extends IVector3D {
    w: number;
}

export type VectorConstructor<VectorType extends IVector> = IAccessorConstructor<VectorType>;

export interface IDirection<Dim extends DIM,
    Matrix extends IMatrix = IMatrix>
    extends ITransformableVector<Matrix> {
    _: IDirectionFunctionSet;

    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;

    normalize(): this;

    normalized(out?: this): this;
}

export interface ICrossedDirection<
    Dim extends DIM,
    Matrix extends IMatrix = IMatrix>
    extends IDirection<Dim, Matrix>
{
    _: ICrossDirectionFunctionSet;

    cross(other: ICrossedDirection<Dim, Matrix>): this;
    crossedWith(other: ICrossedDirection<Dim, Matrix>, out: this): this;
}

export interface IDirection2D<Matrix extends IMatrix2x2 = IMatrix2x2>
    extends IDirection<DIM._2D, Matrix>, IVector2D {
    setTo(x: number, y: number): this;

    xx: IDirection2D;
    xy: IDirection2D;

    yx: IDirection2D;
    yy: IDirection2D;
}

export interface IDirection3D<Matrix extends IMatrix3x3 = IMatrix3x3>
    extends ICrossedDirection<DIM._3D, Matrix>, IVector3D
{
    _: IDirection3DFunctionSet,

    setTo(x: number, y: number, z: number): this;
    mat4mul(matrix: IMatrix4x4, out?: IDirection4D): IDirection4D;

    xx: IDirection2D;
    xy: IDirection2D;
    xz: IDirection2D;

    yx: IDirection2D;
    yy: IDirection2D;
    yz: IDirection2D;

    zx: IDirection2D;
    zy: IDirection2D;
    zz: IDirection2D;

    xxx: IDirection3D;
    xxy: IDirection3D;
    xxz: IDirection3D;
    xyx: IDirection3D;
    xyy: IDirection3D;
    xyz: IDirection3D;
    xzx: IDirection3D;
    xzy: IDirection3D;
    xzz: IDirection3D;

    yxx: IDirection3D;
    yxy: IDirection3D;
    yxz: IDirection3D;
    yyx: IDirection3D;
    yyy: IDirection3D;
    yyz: IDirection3D;
    yzx: IDirection3D;
    yzy: IDirection3D;
    yzz: IDirection3D;

    zxx: IDirection3D;
    zxy: IDirection3D;
    zxz: IDirection3D;
    zyx: IDirection3D;
    zyy: IDirection3D;
    zyz: IDirection3D;
    zzx: IDirection3D;
    zzy: IDirection3D;
    zzz: IDirection3D;
}

export interface IDirection4D<Matrix extends IMatrix4x4 = IMatrix4x4>
    extends ICrossedDirection<DIM._4D, Matrix>, IVector4D
{
    setTo(x: number, y: number, z: number, w: number): this;

    xx: IDirection2D;
    xy: IDirection2D;
    xz: IDirection2D;

    yx: IDirection2D;
    yy: IDirection2D;
    yz: IDirection2D;

    zx: IDirection2D;
    zy: IDirection2D;
    zz: IDirection2D;

    xxx: IDirection3D;
    xxy: IDirection3D;
    xxz: IDirection3D;
    xyx: IDirection3D;
    xyy: IDirection3D;
    xyz: IDirection3D;
    xzx: IDirection3D;
    xzy: IDirection3D;
    xzz: IDirection3D;

    yxx: IDirection3D;
    yxy: IDirection3D;
    yxz: IDirection3D;
    yyx: IDirection3D;
    yyy: IDirection3D;
    yyz: IDirection3D;
    yzx: IDirection3D;
    yzy: IDirection3D;
    yzz: IDirection3D;

    zxx: IDirection3D;
    zxy: IDirection3D;
    zxz: IDirection3D;
    zyx: IDirection3D;
    zyy: IDirection3D;
    zyz: IDirection3D;
    zzx: IDirection3D;
    zzy: IDirection3D;
    zzz: IDirection3D;
}

export interface IPosition<
    Dim extends DIM,
    Matrix extends IMatrix = IMatrix>
    extends ITransformableVector<Matrix> {
    _: IPositionFunctionSet

    to(other: IPosition<Dim>, out: IDirection<Dim>): IDirection<Dim>;
    distanceTo(other: this): number;
    squaredDistanceTo(other: this): number;
}

export interface IPosition2D<Matrix extends IMatrix2x2 = IMatrix2x2>
    extends IPosition<DIM._2D, Matrix>, IVector2D
{
    setTo(x: number, y: number): this;

    xx: IPosition2D;
    xy: IPosition2D;

    yx: IPosition2D;
    yy: IPosition2D;
}

export interface IPosition3D<Matrix extends IMatrix3x3 = IMatrix3x3>
    extends IPosition<DIM._3D, Matrix>, IVector3D
{
    _: IPosition3DFunctionSet,

    setTo(x: number, y: number, z: number): this;
    mat4mul(matrix: IMatrix4x4, out?: IPosition4D): IPosition4D;

    xx: IPosition2D;
    xy: IPosition2D;
    xz: IPosition2D;

    yx: IPosition2D;
    yy: IPosition2D;
    yz: IPosition2D;

    zx: IPosition2D;
    zy: IPosition2D;
    zz: IPosition2D;

    xxx: IPosition3D;
    xxy: IPosition3D;
    xxz: IPosition3D;
    xyx: IPosition3D;
    xyy: IPosition3D;
    xyz: IPosition3D;
    xzx: IPosition3D;
    xzy: IPosition3D;
    xzz: IPosition3D;

    yxx: IPosition3D;
    yxy: IPosition3D;
    yxz: IPosition3D;
    yyx: IPosition3D;
    yyy: IPosition3D;
    yyz: IPosition3D;
    yzx: IPosition3D;
    yzy: IPosition3D;
    yzz: IPosition3D;

    zxx: IPosition3D;
    zxy: IPosition3D;
    zxz: IPosition3D;
    zyx: IPosition3D;
    zyy: IPosition3D;
    zyz: IPosition3D;
    zzx: IPosition3D;
    zzy: IPosition3D;
    zzz: IPosition3D;
}

export interface IPosition4D<Matrix extends IMatrix4x4 = IMatrix4x4>
    extends IPosition<DIM._4D, Matrix>, IVector4D
{
    _: IPositionFunctionSet

    setTo(x: number, y: number, z: number, w: number): this;

    xx: IPosition2D;
    xy: IPosition2D;
    xz: IPosition2D;

    yx: IPosition2D;
    yy: IPosition2D;
    yz: IPosition2D;

    zx: IPosition2D;
    zy: IPosition2D;
    zz: IPosition2D;

    xxx: IPosition3D;
    xxy: IPosition3D;
    xxz: IPosition3D;
    xyx: IPosition3D;
    xyy: IPosition3D;
    xyz: IPosition3D;
    xzx: IPosition3D;
    xzy: IPosition3D;
    xzz: IPosition3D;

    yxx: IPosition3D;
    yxy: IPosition3D;
    yxz: IPosition3D;
    yyx: IPosition3D;
    yyy: IPosition3D;
    yyz: IPosition3D;
    yzx: IPosition3D;
    yzy: IPosition3D;
    yzz: IPosition3D;

    zxx: IPosition3D;
    zxy: IPosition3D;
    zxz: IPosition3D;
    zyx: IPosition3D;
    zyy: IPosition3D;
    zyz: IPosition3D;
    zzx: IPosition3D;
    zzy: IPosition3D;
    zzz: IPosition3D;
}

export interface IColor extends IVector {
    r: number;
    g: number;
    b: number;

    toString(): string;
}

export interface IColor3D extends IColor {
    setTo(r: number, g: number, b: number): this;

    rrr: IColor3D;
    rrg: IColor3D;
    rrb: IColor3D;
    rgr: IColor3D;
    rgg: IColor3D;
    rgb: IColor3D;
    rbr: IColor3D;
    rbg: IColor3D;
    rbb: IColor3D;

    grr: IColor3D;
    grg: IColor3D;
    grb: IColor3D;
    ggr: IColor3D;
    ggg: IColor3D;
    ggb: IColor3D;
    gbr: IColor3D;
    gbg: IColor3D;
    gbb: IColor3D;

    brr: IColor3D;
    brg: IColor3D;
    brb: IColor3D;
    bgr: IColor3D;
    bgg: IColor3D;
    bgb: IColor3D;
    bbr: IColor3D;
    bbg: IColor3D;
    bbb: IColor3D;
}

export interface IColor4D extends IColor {
    a: number;

    setTo(r: number, g: number, b: number, a: number): this;

    rrr: IColor3D;
    rrg: IColor3D;
    rrb: IColor3D;
    rgr: IColor3D;
    rgg: IColor3D;
    rgb: IColor3D;
    rbr: IColor3D;
    rbg: IColor3D;
    rbb: IColor3D;

    grr: IColor3D;
    grg: IColor3D;
    grb: IColor3D;
    ggr: IColor3D;
    ggg: IColor3D;
    ggb: IColor3D;
    gbr: IColor3D;
    gbg: IColor3D;
    gbb: IColor3D;

    brr: IColor3D;
    brg: IColor3D;
    brb: IColor3D;
    bgr: IColor3D;
    bgg: IColor3D;
    bgb: IColor3D;
    bbr: IColor3D;
    bbg: IColor3D;
    bbb: IColor3D;
}

export interface IUV extends IVector {
    u: number;
    v: number;
}

export interface IUV2D extends IUV {
    setTo(u: number, v: number): this;

    uu: IUV2D;
    uv: IUV2D;

    vu: IUV2D;
    vv: IUV2D;
}

export interface IUV3D extends IUV {
    w: number;

    setTo(u: number, v: number, w: number): this;

    uu: IUV2D;
    uv: IUV2D;
    uw: IUV2D;

    vu: IUV2D;
    vv: IUV2D;
    vw: IUV2D;

    wu: IUV2D;
    wv: IUV2D;
    ww: IUV2D;

    uuu: IUV3D;
    uuv: IUV3D;
    uuw: IUV3D;
    uvu: IUV3D;
    uvv: IUV3D;
    uvw: IUV3D;
    ubu: IUV3D;
    ubv: IUV3D;
    ubw: IUV3D;

    vuu: IUV3D;
    vuv: IUV3D;
    vuw: IUV3D;
    vvu: IUV3D;
    vvv: IUV3D;
    vvw: IUV3D;
    vbu: IUV3D;
    vbv: IUV3D;
    vbw: IUV3D;

    wuu: IUV3D;
    wuv: IUV3D;
    wuw: IUV3D;
    wvu: IUV3D;
    wvv: IUV3D;
    wvw: IUV3D;
    wbu: IUV3D;
    wbv: IUV3D;
    wbw: IUV3D;
}