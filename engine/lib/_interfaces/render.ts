import {INode3D, IScene} from "./nodes.js";
import {I2D, IColor4D} from "./vectors.js";
import {IMatrix4x4} from "./matrix.js";
import {IController} from "./input.js";
import {IGeometry, IMesh} from "./geometry.js";

export interface ISize {
    width: number,
    height: number
}

export interface IRectangle extends ISize, I2D {
    setPosition(x: number, y: number): void;
    resize(width: number, height: number): void;
    reset(width: number, height: number, x: number, y: number): void
}

export interface ILense {
    fov: number;
    zoom: number;
    focal_length: number;

    setFrom(other: this): void;
}

export interface IViewFrustum {
    aspect_ratio: number;
    near: number;
    far: number;

    readonly one_over_depth_span: number;
    setFrom(other: this): void;
}

export interface IProjectionMatrix extends IMatrix4x4 {
    readonly lense: ILense;
    readonly view_frustum: IViewFrustum;

    update(): void;
    updateZ(): void;
    updateW(): void;
    updateXY(): void;
}

export interface ICamera extends INode3D {
    is_perspective: boolean;
    readonly lense: ILense;
    setFrom(other: this): void;
}

export interface IRasterCamera extends ICamera {
    readonly view_frustum: IViewFrustum;
    readonly projection_matrix: IProjectionMatrix;
}

export type CameraConstructor<Instance extends ICamera> = new (scene: IScene) => Instance;

export interface IMaterial<Context extends RenderingContext>
{
    readonly id: number;
    readonly scene: IScene<Context>;
    readonly mesh_geometries: IMeshGeometries;

    prepareMeshForDrawing(mesh: IMesh, render_pipeline: IRenderPipeline<Context>): void;
    drawMesh(mesh: IMesh, matrix: IMatrix4x4): any;
}



export type MaterialConstructor<
    Context extends RenderingContext,
    Instance extends IMaterial<Context> = IMaterial<Context>
    > = new (scene: IScene<Context>) => Instance;

export type IMeshCallback = (mesh: IMesh) => void;

export interface IMeshGeometries {
    readonly scene: IScene;
    readonly meshes: Generator<IMesh>;
    readonly mesh_count: number;
    readonly on_mesh_added: Set<IMeshCallback>;
    readonly on_mesh_removed: Set<IMeshCallback>;

    hasMesh(mesh: IMesh): boolean;
    hasGeometry(geometry: IGeometry): boolean;

    getGeometryCount(mesh: IMesh): number;
    getGeometries(mesh: IMesh): Generator<IGeometry>;

    addGeometry(mesh: IMesh): IGeometry;
    addGeometry(geometry: IGeometry): IGeometry;
    addGeometry(mesh_or_geometry: IGeometry | IMesh): IGeometry;
    removeGeometry(geometry: IGeometry): void;
}

export interface IRenderPipeline<
    Context extends RenderingContext,
    ViewportType extends IViewport<Context> = IViewport<Context>,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
{
    readonly context: Context;
    readonly mesh_geometries: IMeshGeometries;
    readonly materials: Set<MaterialType>

    delete(): void;
    render(viewport: ViewportType): void;
    resetRenderTarget(size: ISize, position: I2D): void;

    on_mesh_added(mesh: IMesh): void;
    on_mesh_removed(mesh: IMesh): void;
    on_mesh_loaded(mesh: IMesh): void;

    readonly on_mesh_loaded_callback: IMeshCallback;
    readonly on_mesh_added_callback: IMeshCallback;
    readonly on_mesh_removed_callback: IMeshCallback;
}

export interface IRasterRenderPipeline<
    Context extends RenderingContext,
    ViewportType extends IRasterViewport<Context>,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends IRenderPipeline<Context, ViewportType, MaterialType>
{
    readonly model_to_clip: IMatrix4x4;
}

export interface ICanvas2DRenderPipeline<
    ViewportType extends IViewport<CanvasRenderingContext2D>,
    MaterialType extends IMaterial<CanvasRenderingContext2D> = IMaterial<CanvasRenderingContext2D>>
    extends IRenderPipeline<CanvasRenderingContext2D, ViewportType, MaterialType>
{
    resetRenderTarget(size: ISize, position: I2D): void;
}

export interface IViewport <
    Context extends RenderingContext = RenderingContext,
    CameraType extends ICamera = ICamera>
    extends IRectangle
{
    display_grid: boolean;
    display_border: boolean;

    grid_size: number;

    setBorderColor(color: IColor4D): void;
    setGridColor(color: IColor4D): void;

    camera: CameraType
    render_pipeline: IRenderPipeline<Context>;
    controller: IController;

    refresh(): void;
    is_inside(x: number, y: number): boolean;

    updateMatrices(): void;
    setFrom(other: this): void;
}

export type ViewportConstructor<Context extends RenderingContext> = new (
    camera: ICamera,
    render_pipeline: IRenderPipeline<Context>,
    controller: IController,
    screen: IScreen<Context>,
    context?: Context,
    size?: ISize,
    position?: I2D
) => IViewport<Context>;

export interface IRasterViewport<
    Context extends RenderingContext = RenderingContext,
    CameraType extends IRasterCamera = IRasterCamera>
    extends IViewport<Context, CameraType>
{
    readonly world_to_view: IMatrix4x4;
    readonly world_to_clip: IMatrix4x4;
}


export interface IScreen<Context extends RenderingContext>
    extends IRectangle
{
    context: Context;
    active_viewport: IViewport<Context>;

    readonly viewports: Generator<IViewport<Context>>;

    refresh(): void;
    resize(width: number, height: number): void;
    setPosition(x: number, y: number): void;

    addViewport(camera: ICamera,
                render_pipeline?: IRenderPipeline<Context>,
                controller?: IController,
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

export interface IRenderEngine<
    Context extends RenderingContext,
    // SceneType extends IScene<Context>,
    ScreenType extends IScreen<Context>>
{
    readonly canvas: HTMLCanvasElement;
    readonly context: Context;

    readonly keys: IRenderEngineKeys;
    readonly pressed: Uint8Array;

    scene: IScene<Context>;
    screen: ScreenType;

    readonly is_active: boolean;
    readonly is_running: boolean;

    handleEvent(event: Event): void;
    update(timestamp): void;

    start(): void;
    stop(): void;
}
