import {IScene} from "./nodes.js";
import {IVector2D} from "./vectors.js";
import {IMatrix4x4} from "./matrix.js";
import Scene from "../scene_graph/scene.js";
import {IController} from "./input.js";

export interface IRectangle
{
    width: number,
    height: number
}

export interface ICamera {
    fov: number;
    far: number;
    near: number;
    zoom: number;
    depth_factor: number;
    focal_length: number;

    readonly scene: IScene;
    readonly projection_matrix: IMatrix4x4;

    updateProjectionMatrix(): void;
}

export interface IViewport<Context extends RenderingContext> {
    camera_has_moved_or_rotated: boolean;
    render_pipeline: IRenderPipeline<Context>;

    camera: ICamera

    readonly width: number;
    readonly height: number;
    readonly x: number;
    readonly y: number;

    readonly world_to_view: IMatrix4x4;
    readonly world_to_clip: IMatrix4x4;

    refresh(): void;
    scale(x: number, y: number): void;
    reset(width: number, height: number, x: number, y: number): void;
}

export interface IRenderPipeline<
    Context extends RenderingContext,
    ViewportType extends IViewport<Context> = IViewport<Context>>
{
    render(viewport: ViewportType): void;
}



export interface IScreen<
    Context extends RenderingContext = RenderingContext,
    ViewportType extends IViewport<Context> = IViewport<Context>>
{
    controller: IController,
    active_viewport: ViewportType;
    readonly viewports: Generator<ViewportType>;
    clear(): void;
    refresh(): void;
    resize(width: number, height: number): void;
    addViewport(camera: ICamera, size?: IRectangle, position?: IVector2D): ViewportType;
}

export interface IRenderEngine<ScreenType extends IScreen> {
    readonly scene: Scene;

    screen: ScreenType;
    controller: IController;

    start(): void;
    update(timestamp): void;
}