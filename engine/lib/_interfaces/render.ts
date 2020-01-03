import {IScene} from "./nodes.js";
import {IVector2D} from "./vectors.js";
import {IMatrix3x3, IMatrix4x4} from "./matrix.js";
import RenderPipeline from "../render/pipelines.js";

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
    focal_length: number;

    has_changed: boolean;
}

export interface ICamera {
    viewport: IViewport;
    readonly scene: IScene;
    readonly frustum: IFrustom;
    readonly projection_matrix: IMatrix4x4;

    updateProjectionMatrix(perspective?: boolean, zoom?: number): void;
}

export interface IViewport {
    aspect_ratio: number;
    aspect_ratio_has_changed: boolean;
    camera_hase_moved_or_rotated: boolean;
    size_has_changed: boolean;
    render_pipeline: RenderPipeline;
    camera: ICamera

    readonly width: number;
    readonly height: number;
    readonly size: IRectangle;
    readonly position: IVector2D;
    readonly context: CanvasRenderingContext2D;
    readonly world_to_view: IMatrix4x4;
    readonly world_to_clip: IMatrix4x4;
    readonly ndc_to_screen: IMatrix3x3;

    refresh(): void;
    reset(width: number, height: number, x: number, y: number): void;
    setSize(width: number, height: number): void;
}