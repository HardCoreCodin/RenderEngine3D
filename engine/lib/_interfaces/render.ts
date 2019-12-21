import {IScene} from "./nodes.js";
import {IPosition4D, IVector2D} from "./vectors.js";
import {IMatrix4x4} from "./matrix.js";

export interface IRectangle
{
    width: number,
    height: number
}

export interface IFrustom {
    fov: number;
    far: number;
    near: number;

    depth_factor: number;
    fov_factor: number;

    has_changed: boolean;
}

export interface ICamera {
    readonly scene: IScene;
    readonly frustum: IFrustom;

    viewport: IViewport;

    projected_position: IPosition4D;
    projection_matrix: IMatrix4x4;

    updateProjectionMatrix(): void;
}

export interface IViewport {
    readonly width: number;
    readonly height: number;

    camera: ICamera;
    position: IVector2D;

    aspect_ratio: number;
    aspect_ratio_has_changed: boolean;
    size_has_changed: boolean;

    reset(pixels: Uint32Array, width: number, height: number, x: number, y: number): void;
    setSize(width: number, height: number): void;
}