import {INode3D, IScene} from "./nodes.js";
import {IColor4D, I2D} from "./vectors.js";
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
    readonly lense: ILense;
    readonly scene: IScene;
    readonly view_frustum: IViewFrustum;
    readonly projection_matrix: IProjectionMatrix;

    is_perspective: boolean;

    setFrom(other: this): void;
}

export type CameraConstructor<Instance extends ICamera> = new (scene: IScene) => Instance;

export interface IMaterial<
    Context extends RenderingContext,
    RenderPipelineType extends IRenderPipeline<Context, ICamera> = IRenderPipeline<Context, ICamera>>
{
    readonly id: number;
    readonly scene: IScene<Context>;
    readonly mesh_geometries: IMeshGeometries;

    prepareMeshForDrawing(mesh: IMesh, render_pipeline: RenderPipelineType): void;
    drawMesh(mesh: IMesh, matrix: IMatrix4x4): any;
}

export type MaterialConstructor<
    Context extends RenderingContext,
    RenderPipelineType extends IRenderPipeline<Context, ICamera>,
    Instance extends IMaterial<Context, RenderPipelineType>
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
    CameraType extends ICamera = ICamera>
{
    readonly scene: IScene<Context, CameraType>;
    readonly context: Context;
    readonly model_to_clip: IMatrix4x4;

    delete(): void;
    render(viewport: IViewport<Context, CameraType, IScene<Context, CameraType>>): void;
    resetRenderTarget(size: ISize, position: I2D): void;

    on_mesh_added(mesh: IMesh): void;
    on_mesh_removed(mesh: IMesh): void;
    on_mesh_loaded(mesh: IMesh): void;

    readonly on_mesh_loaded_callback: IMeshCallback;
    readonly on_mesh_added_callback: IMeshCallback;
    readonly on_mesh_removed_callback: IMeshCallback;
}

export interface ICanvas2DRenderPipeline<CameraType extends ICamera,
    SceneType extends IScene<CanvasRenderingContext2D, CameraType>>
    extends IRenderPipeline<CanvasRenderingContext2D, CameraType>
{
    resetRenderTarget(size: ISize, position: I2D): void;
}

export interface IViewport<
    Context extends RenderingContext = RenderingContext,
    CameraType extends ICamera = ICamera,
    SceneType extends IScene<Context, CameraType> = IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, CameraType> = IRenderPipeline<Context, CameraType>>
    extends IRectangle
{
    display_grid: boolean;
    display_border: boolean;

    grid_size: number;

    setBorderColor(color: IColor4D): void;
    setGridColor(color: IColor4D): void;

    camera: CameraType
    render_pipeline: RenderPipelineType;
    controller: IController;

    readonly scene: SceneType;
    readonly world_to_view: IMatrix4x4;
    readonly world_to_clip: IMatrix4x4;

    refresh(): void;
    is_inside(x: number, y: number): boolean;

    updateMatrices(): void;
    setFrom(other: this): void;
}


export interface IScreen<
    Context extends RenderingContext,
    CameraType extends ICamera,
    SceneType extends IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, CameraType>,
    ViewportType extends IViewport<Context, CameraType, SceneType, RenderPipelineType> = IViewport<Context, CameraType, SceneType, RenderPipelineType>>
    extends IRectangle
{
    scene: SceneType;
    context: Context;
    active_viewport: ViewportType;

    readonly viewports: Generator<ViewportType>;

    refresh(): void;
    resize(width: number, height: number): void;
    setPosition(x: number, y: number): void;

    addViewport(camera: CameraType, size?: ISize, position?: I2D): ViewportType;
    removeViewport(viewport: ViewportType): void;

    registerViewport(viewport: ViewportType): void;
    unregisterViewport(viewport: ViewportType): void;

    setViewportAt(x: number, y: number): void;
}

export interface IRenderEngineKeys {
    ctrl: number;
    esc: number;
    space: number;
}

export interface IRenderEngine<
    Context extends RenderingContext,
    CameraType extends ICamera,
    SceneType extends IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, CameraType>,
    ViewportType extends IViewport<Context, CameraType, SceneType, RenderPipelineType>,
    ScreenType extends IScreen<Context, CameraType, SceneType, RenderPipelineType, ViewportType>>
{
    readonly canvas: HTMLCanvasElement;
    readonly context: Context;

    readonly keys: IRenderEngineKeys;
    readonly pressed: Uint8Array;

    scene: SceneType;
    screen: ScreenType;

    readonly is_active: boolean;
    readonly is_running: boolean;

    handleEvent(event: Event): void;
    update(timestamp): void;

    start(): void;
    stop(): void;
}