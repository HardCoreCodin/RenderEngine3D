import {IMatrix4x4} from "./matrix.js";
import {IPosition3D} from "./vectors.js";

export interface ITransform {
    readonly matrix: IMatrix4x4;
    readonly scale: IScale;
    readonly rotation: IEulerRotation;
    readonly translation: IPosition3D;

    setFrom(other: this): void;
    update(): void;
}

export interface IScale {
    x: number;
    y: number;
    z: number;
    setFrom(other: this, transform: ITransform): void;
}

export interface IEulerRotation {
    x: number;
    y: number;
    z: number;
    setFrom(other: this, transform: ITransform): void;
}