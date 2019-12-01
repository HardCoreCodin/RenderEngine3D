import {IVector} from "./_base.js";

export interface IColor extends IVector {
    r: number;
    g: number;
    b: number;
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