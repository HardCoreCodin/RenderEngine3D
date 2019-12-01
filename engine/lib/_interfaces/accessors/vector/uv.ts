import {IVector} from "./_base.js";

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