import {IMatrix3x3, IMatrix4x4} from "./matrix.js";
import {IPosition3D} from "./vectors.js";

export interface ITransform {
    readonly matrix: IMatrix4x4;
    readonly scale: IScale;
    readonly rotation: IEulerRotation;
    readonly translation: IPosition3D;

    setFrom(other: this): void;
}

export interface IScale {
    x: number;
    y: number;
    z: number;
    applyEagerly: boolean;
    apply(): void;
    setFrom(other: this): void;
}

export interface IEulerRotation {
    readonly matrix: IMatrix3x3;

    x: number;
    y: number;
    z: number;

    computeEagerly: boolean;
    computeMatrix(): void;
    setFrom(other: this): void;
}