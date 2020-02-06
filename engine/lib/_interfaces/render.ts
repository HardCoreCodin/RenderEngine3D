import Scene from "../nodes/scene.js";
import Geometry, {ImplicitGeometry, MeshGeometries} from "../nodes/geometry.js";
import {Border, Grid} from "../render/_base/viewport.js";
import {ProjectionMatrix, ViewFrustum} from "../render/raster/_base/viewport.js";
import {I2D} from "./vectors.js";
import {IMatrix4x4} from "./matrix.js";
import {IController} from "./input.js";
import {IMesh} from "./geometry.js";

export interface ISize {
    width: number,
    height: number
}

export interface IRectangle extends ISize, I2D {
    setPosition(x: number, y: number): void;
    resize(width: number, height: number): void;
    reset(width: number, height: number, x: number, y: number): void
}

export interface IMaterial<Context extends RenderingContext>
{
    readonly id: number;
    readonly scene: Scene<Context>;
    readonly mesh_geometries: MeshGeometries;

    prepareMeshForDrawing(mesh: IMesh, render_pipeline: IRenderPipeline<Context>): void;
    drawMesh(mesh: IMesh, matrix: IMatrix4x4): any;
}

export type IMaterialConstructor<
    Context extends RenderingContext,
    Instance extends IMaterial<Context> = IMaterial<Context>
    > = new (scene: Scene<Context>) => Instance;

export type IMeshCallback = (mesh: IMesh) => void;
export type IImplicitGeometryCallback = (geometry: ImplicitGeometry) => void;

export interface IRenderPipeline<
    Context extends RenderingContext,
    ViewportType extends IViewport<Context> = IViewport<Context>>
{
    readonly context: Context;
    readonly scene: Scene<Context>;

    delete(): void;
    render(viewport: ViewportType): void;

    on_mesh_added(mesh: IMesh): void;
    on_mesh_removed(mesh: IMesh): void;
    on_mesh_loaded(mesh: IMesh): void;

    readonly on_mesh_loaded_callback: IMeshCallback;
    readonly on_mesh_added_callback: IMeshCallback;
    readonly on_mesh_removed_callback: IMeshCallback;
}

export type IRenderPipelineConstructor<
    Context extends RenderingContext,
    ViewportType extends IViewport<Context> = IViewport<Context>> = new (
    context: Context,
    scene: Scene<Context>
) => IRenderPipeline<Context, ViewportType>;

export interface IRasterRenderPipeline<
    Context extends RenderingContext,
    ViewportType extends IRasterViewport<Context>>
    extends IRenderPipeline<Context, ViewportType>
{
    readonly model_to_clip: IMatrix4x4;
}

export interface IViewport<
    Context extends RenderingContext = RenderingContext,
    GridType extends Grid = Grid,
    BorderType extends Border = Border>
    extends IRectangle
{
    readonly grid: GridType;
    readonly border: BorderType;
    readonly context: Context;

    controller: IController;
    render_pipeline: IRenderPipeline<Context>;

    is_active: boolean;
    is_inside(x: number, y: number): boolean;
    refresh(): void;

    update(): void;
    setFrom(other: this): void;
}

export type IViewportConstructor<Context extends RenderingContext> = new (
    controller: IController,
    render_pipeline: IRenderPipeline<Context>,
    screen: IDisplay<Context>,
    context?: Context,
    size?: ISize,
    position?: I2D
) => IViewport<Context>;

export interface IRasterViewport<
    Context extends RenderingContext,
    GridType extends Grid = Grid,
    BorderType extends Border = Border>
    extends IViewport<Context, GridType, BorderType>
{
    readonly view_frustum: ViewFrustum<Context>;
    readonly projection_matrix: ProjectionMatrix<Context>;
    readonly world_to_view: IMatrix4x4;
    readonly world_to_clip: IMatrix4x4;
}


export interface IDisplay<Context extends RenderingContext>
    extends IRectangle
{
    context: Context;
    active_viewport: IViewport<Context>;

    readonly viewports: Generator<IViewport<Context>>;

    refresh(): void;
    resize(width: number, height: number): void;
    setPosition(x: number, y: number): void;

    addViewport(controller?: IController,
                render_pipeline?: IRenderPipeline<Context>,
                viewport?: IViewport<Context>
    ): IViewport<Context>;
    removeViewport(viewport: IViewport<Context>): void;

    registerViewport(viewport: IViewport<Context>): void;
    unregisterViewport(viewport: IViewport<Context>): void;

    setViewportAt(x: number, y: number): void;
}

export interface IRenderEngineKeys {
    ctrl: number;
    esc: number;
    space: number;
}

export interface IRenderEngine<Context extends RenderingContext>
{
    readonly canvas: HTMLCanvasElement;
    readonly context: Context;

    readonly keys: IRenderEngineKeys;
    readonly pressed: Uint8Array;

    scene: Scene<Context>;
    display: IDisplay<Context>;

    readonly is_active: boolean;
    readonly is_running: boolean;

    handleEvent(event: Event): void;
    update(timestamp): void;

    start(): void;
    stop(): void;
}