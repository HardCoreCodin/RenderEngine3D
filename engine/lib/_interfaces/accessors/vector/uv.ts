import {IVector} from "./_base.js";

export interface IUV extends IVector {
    u: number;
    v: number;
}

export interface IUV2D extends IUV {
    setTo(u: number, v: number): this;
}

export interface IUV3D extends IUV {
    w: number;

    setTo(u: number, v: number, w: number): this;
}