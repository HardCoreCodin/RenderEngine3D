import {IMatrix} from "./matrix.js";
import {IAccessor} from "./accessors.js";
import {Direction2D, Direction3D, Direction4D} from "../accessors/direction.js";
import {Position2D, Position3D, Position4D} from "../accessors/position.js";
import {Matrix4x4} from "../accessors/matrix4x4.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {Color3D} from "../accessors/color.js";

export interface IMathAccessor extends IAccessor {
    add(other: IAccessor|number, out?: IAccessor): this|typeof out;
    sub(other: IAccessor|number, out?: IAccessor): this|typeof out;
    mul(other: this|number, out?: this): this;
    div(denominator: number, out?: this): this;
}

export interface IVector extends IMathAccessor
{
    lerp(to: this, by: number, out: this): this;
}

export interface ITransformableVector<Matrix extends IMatrix = IMatrix> extends IVector
{
    mul(other: Matrix|this|number, out?: this): this;
}

export interface I2D {
    x: number;
    y: number;
}

export interface I3D extends I2D {
    z: number;
}

export interface I4D extends I3D {
    w: number;
}

export type IVector2D = IVector & I2D;
export type IVector3D = IVector & I3D;
export type IVector4D = IVector & I4D;

export interface IDirection2D
    extends ITransformableVector, I2D
{
    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;
    normalize(out?: this): this;
    negate(out?: this): this;

    xx: Direction2D;
    xy: Direction2D;

    yx: Direction2D;
    yy: Direction2D;
}

export interface IDirection3D
    extends ITransformableVector, I3D
{
    mat4mul(matrix: Matrix4x4, out: Direction4D): Direction4D;

    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;
    cross(other: this, out?: this): this;
    normalize(out?: this): this;
    negate(out?: this): this;

    xx: Direction2D;
    xy: Direction2D;
    xz: Direction2D;

    yx: Direction2D;
    yy: Direction2D;
    yz: Direction2D;

    zx: Direction2D;
    zy: Direction2D;
    zz: Direction2D;

    xxx: Direction3D;
    xxy: Direction3D;
    xxz: Direction3D;
    xyx: Direction3D;
    xyy: Direction3D;
    xyz: Direction3D;
    xzx: Direction3D;
    xzy: Direction3D;
    xzz: Direction3D;

    yxx: Direction3D;
    yxy: Direction3D;
    yxz: Direction3D;
    yyx: Direction3D;
    yyy: Direction3D;
    yyz: Direction3D;
    yzx: Direction3D;
    yzy: Direction3D;
    yzz: Direction3D;

    zxx: Direction3D;
    zxy: Direction3D;
    zxz: Direction3D;
    zyx: Direction3D;
    zyy: Direction3D;
    zyz: Direction3D;
    zzx: Direction3D;
    zzy: Direction3D;
    zzz: Direction3D;
}

export interface IDirection4D
    extends ITransformableVector, I4D
{
    length: number;
    length_squared: number;
    is_normalized: boolean;

    dot(other: this): number;
    cross(other: this, out?: this): this;
    normalize(out?: this): this;
    negate(out?: this): this;

    xx: Direction2D;
    xy: Direction2D;
    xz: Direction2D;

    yx: Direction2D;
    yy: Direction2D;
    yz: Direction2D;

    zx: Direction2D;
    zy: Direction2D;
    zz: Direction2D;

    xxx: Direction3D;
    xxy: Direction3D;
    xxz: Direction3D;
    xyx: Direction3D;
    xyy: Direction3D;
    xyz: Direction3D;
    xzx: Direction3D;
    xzy: Direction3D;
    xzz: Direction3D;

    yxx: Direction3D;
    yxy: Direction3D;
    yxz: Direction3D;
    yyx: Direction3D;
    yyy: Direction3D;
    yyz: Direction3D;
    yzx: Direction3D;
    yzy: Direction3D;
    yzz: Direction3D;

    zxx: Direction3D;
    zxy: Direction3D;
    zxz: Direction3D;
    zyx: Direction3D;
    zyy: Direction3D;
    zyz: Direction3D;
    zzx: Direction3D;
    zzy: Direction3D;
    zzz: Direction3D;
}

export interface IPosition2D
    extends ITransformableVector, I2D
{
    to(other: this, out: IDirection2D): IDirection2D;
    distanceTo(other: this): number;
    distanceSquaredTo(other: this): number;

    xx: Position2D;
    xy: Position2D;

    yx: Position2D;
    yy: Position2D;
}

export interface IPosition3D
    extends ITransformableVector, I2D
{
    to(other: this, out: Direction3D): Direction3D;
    distanceTo(other: this): number;
    distanceSquaredTo(other: this): number;
    mat4mul(matrix: Matrix4x4, out: Position4D): Position4D;

    xx: Position2D;
    xy: Position2D;
    xz: Position2D;

    yx: Position2D;
    yy: Position2D;
    yz: Position2D;

    zx: Position2D;
    zy: Position2D;
    zz: Position2D;

    xxx: Position3D;
    xxy: Position3D;
    xxz: Position3D;
    xyx: Position3D;
    xyy: Position3D;
    xyz: Position3D;
    xzx: Position3D;
    xzy: Position3D;
    xzz: Position3D;

    yxx: Position3D;
    yxy: Position3D;
    yxz: Position3D;
    yyx: Position3D;
    yyy: Position3D;
    yyz: Position3D;
    yzx: Position3D;
    yzy: Position3D;
    yzz: Position3D;

    zxx: Position3D;
    zxy: Position3D;
    zxz: Position3D;
    zyx: Position3D;
    zyy: Position3D;
    zyz: Position3D;
    zzx: Position3D;
    zzy: Position3D;
    zzz: Position3D;
}

export interface IPosition4D
    extends ITransformableVector, I4D
{
    to(other: this, out: Direction4D): Direction4D;
    distanceTo(other: this): number;
    distanceSquaredTo(other: this): number;

    xx: Position2D;
    xy: Position2D;
    xz: Position2D;

    yx: Position2D;
    yy: Position2D;
    yz: Position2D;

    zx: Position2D;
    zy: Position2D;
    zz: Position2D;

    xxx: Position3D;
    xxy: Position3D;
    xxz: Position3D;
    xyx: Position3D;
    xyy: Position3D;
    xyz: Position3D;
    xzx: Position3D;
    xzy: Position3D;
    xzz: Position3D;

    yxx: Position3D;
    yxy: Position3D;
    yxz: Position3D;
    yyx: Position3D;
    yyy: Position3D;
    yyz: Position3D;
    yzx: Position3D;
    yzy: Position3D;
    yzz: Position3D;

    zxx: Position3D;
    zxy: Position3D;
    zxz: Position3D;
    zyx: Position3D;
    zyy: Position3D;
    zyz: Position3D;
    zzx: Position3D;
    zzy: Position3D;
    zzz: Position3D;
}

export interface IColor extends IVector {
    r: number;
    g: number;
    b: number;

    toString(): string;
}

export interface IColor3D extends IColor, I3D {
    setTo(r: number, g: number, b: number): this;

    rrr: Color3D;
    rrg: Color3D;
    rrb: Color3D;
    rgr: Color3D;
    rgg: Color3D;
    rgb: Color3D;
    rbr: Color3D;
    rbg: Color3D;
    rbb: Color3D;

    grr: Color3D;
    grg: Color3D;
    grb: Color3D;
    ggr: Color3D;
    ggg: Color3D;
    ggb: Color3D;
    gbr: Color3D;
    gbg: Color3D;
    gbb: Color3D;

    brr: Color3D;
    brg: Color3D;
    brb: Color3D;
    bgr: Color3D;
    bgg: Color3D;
    bgb: Color3D;
    bbr: Color3D;
    bbg: Color3D;
    bbb: Color3D;
}

export interface IColor4D extends IColor, I4D {
    a: number;

    setTo(r: number, g: number, b: number, a: number): this;

    rrr: Color3D;
    rrg: Color3D;
    rrb: Color3D;
    rgr: Color3D;
    rgg: Color3D;
    rgb: Color3D;
    rbr: Color3D;
    rbg: Color3D;
    rbb: Color3D;

    grr: Color3D;
    grg: Color3D;
    grb: Color3D;
    ggr: Color3D;
    ggg: Color3D;
    ggb: Color3D;
    gbr: Color3D;
    gbg: Color3D;
    gbb: Color3D;

    brr: Color3D;
    brg: Color3D;
    brb: Color3D;
    bgr: Color3D;
    bgg: Color3D;
    bgb: Color3D;
    bbr: Color3D;
    bbg: Color3D;
    bbb: Color3D;
}

export interface IUV extends IVector {
    u: number;
    v: number;
}

export interface IUV2D extends IUV, I2D {
    setTo(u: number, v: number): this;

    uu: UV2D;
    uv: UV2D;

    vu: UV2D;
    vv: UV2D;
}

export interface IUV3D extends IUV, I3D {
    w: number;

    setTo(u: number, v: number, w: number): this;

    uu: UV2D;
    uv: UV2D;
    uw: UV2D;

    vu: UV2D;
    vv: UV2D;
    vw: UV2D;

    wu: UV2D;
    wv: UV2D;
    ww: UV2D;

    uuu: UV3D;
    uuv: UV3D;
    uuw: UV3D;
    uvu: UV3D;
    uvv: UV3D;
    uvw: UV3D;
    ubu: UV3D;
    ubv: UV3D;
    ubw: UV3D;

    vuu: UV3D;
    vuv: UV3D;
    vuw: UV3D;
    vvu: UV3D;
    vvv: UV3D;
    vvw: UV3D;
    vbu: UV3D;
    vbv: UV3D;
    vbw: UV3D;

    wuu: UV3D;
    wuv: UV3D;
    wuw: UV3D;
    wvu: UV3D;
    wvv: UV3D;
    wvw: UV3D;
    wbu: UV3D;
    wbv: UV3D;
    wbw: UV3D;
}