import {IVector} from "./_base.js";

export interface IColor extends IVector {
    r: number;
    g: number;
    b: number;
}

export interface IColor3D extends IColor {
    setTo(r: number, g: number, b: number): this;
}

export interface IColor4D extends IColor {
    a: number;

    setTo(r: number, g: number, b: number, a: number): this;
}