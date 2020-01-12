import Camera from "./camera.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
import {IVector2D} from "../_interfaces/vectors.js";
import {ICamera, IRectangle, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import {IController} from "../_interfaces/input.js";
import {IScene} from "../_interfaces/nodes.js";
import Scene from "../scene_graph/scene.js";


export abstract class BaseScreen<
    Context extends RenderingContext,
    SceneType extends IScene<Context>,
    CameraType extends ICamera,
    RenderPipelineType extends IRenderPipeline<Context>,
    ViewportType extends IViewport<Context, SceneType, CameraType, RenderPipelineType>>
    implements IScreen<Context, SceneType, CameraType, RenderPipelineType, ViewportType>
{
    protected abstract _createViewport(camera: CameraType, size: IRectangle, position?: IVector2D): ViewportType;
    abstract clear(): void;

    protected readonly _viewports = new Set<ViewportType>();
    protected readonly _render_pipelines = new Map<RenderPipelineType, Set<ViewportType>>();
    protected _active_viewport: ViewportType;
    protected _prior_width = 0;
    protected _prior_height = 0;

    constructor(
        camera: CameraType,
        public scene: SceneType,
        public context: Context,
        public controller: IController,
        protected readonly _canvas: HTMLCanvasElement,
        protected readonly _size: IRectangle = {width: 1, height: 1}
    ) {
        this.active_viewport = this.addViewport(camera);
    }

    refresh() {
        const width = this._canvas.clientWidth;
        const height = this._canvas.clientHeight;
        if (width !== this._prior_width ||
            height !== this._prior_height) {
            this._prior_width = width;
            this._prior_height = height;
            this.resize(width, height);
        }

        this.clear();

        for (const viewport of this._viewports)
            viewport.refresh();
    }

    resize(width: number, height: number): void {
        const width_scale = width / this._size.width;
        const height_scale = height / this._size.height;

        for (const vp of this._viewports)
            vp.scale(width_scale, height_scale);

        this._size.width = width;
        this._size.height = height;
    }

    get viewports(): Generator<ViewportType> {return this._iterViewports()}
    private *_iterViewports(): Generator<ViewportType> {
        for (const viewport of this._viewports)
            yield viewport;
    }

    registerViewport(viewport: ViewportType): void {
        const render_pipeline = viewport.render_pipeline;
        let viewports: Set<ViewportType>;
        if (this._render_pipelines.has(render_pipeline))
            viewports = this._render_pipelines.get(render_pipeline);
        else {
            const mesh_geometries = viewport.camera.scene.mesh_geometries;
            mesh_geometries.on_mesh_added.add(render_pipeline.on_mesh_added.bind(render_pipeline));
            mesh_geometries.on_mesh_removed.add(render_pipeline.on_mesh_removed.bind(render_pipeline));

            viewports = new Set<ViewportType>();
            this._render_pipelines.set(render_pipeline, viewports);
        }

        if (!viewports.has(viewport))
            viewports.add(viewport);
    }

    unregisterViewport(viewport: ViewportType): void {
        const render_pipeline = viewport.render_pipeline;
        if (this._render_pipelines.has(render_pipeline)) {
            const viewports = this._render_pipelines.get(render_pipeline);
            if (viewports.size === 1) {
                const mesh_geometries = viewport.camera.scene.mesh_geometries;
                mesh_geometries.on_mesh_added.delete(render_pipeline.on_mesh_added.bind(render_pipeline));
                mesh_geometries.on_mesh_removed.delete(render_pipeline.on_mesh_removed.bind(render_pipeline));
                this._render_pipelines.delete(render_pipeline);
            } else
                viewports.delete(viewport);
        }
    }

    addViewport(
        camera: CameraType,
        size: IRectangle = this._size,
        position: IVector2D = {
            x: 0,
            y: 0
        }
    ): ViewportType {
        const viewport = this._createViewport(camera, size, position);
        this._viewports.add(viewport);
        this.registerViewport(viewport);
        return viewport;
    }

    removeViewport(viewport: ViewportType): void {
        if (!this._viewports.has(viewport))
            return;

        this.unregisterViewport(viewport);
        this._viewports.delete(viewport);
    }

    get active_viewport(): ViewportType {
        return this._active_viewport;
    }

    set active_viewport(viewport: ViewportType) {
        this._active_viewport = viewport;
        if (this.controller)
            this.controller.viewport = viewport;
    }
}

export default class Screen extends BaseScreen<CanvasRenderingContext2D, Scene, Camera, RenderPipeline, Viewport> {
    protected _createViewport(camera: Camera, size: IRectangle, position?: IVector2D): Viewport {
        return new Viewport(camera, this, size, position);
    }

    clear() {
        this.context.clearRect(0, 0, this._size.width, this._size.height);
    }
}

