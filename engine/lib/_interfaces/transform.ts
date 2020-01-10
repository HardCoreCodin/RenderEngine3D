import {IMatrix4x4} from "./matrix.js";
import {IPosition3D} from "./vectors.js";

export interface ITransform {
    readonly matrix: IMatrix4x4;
    readonly scale: IScale;
    readonly rotation: IEulerRotation;
    readonly translation: IPosition3D;
}

export interface IScale {
    x: number;
    y: number;
    z: number;
    applyEagerly: boolean;
    apply(): void;
}

export interface IEulerRotation {
    x: number;
    y: number;
    z: number;
    computeEagerly: boolean;
    computeMatrix(): void;
}