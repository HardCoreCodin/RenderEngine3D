import Camera from "./camera.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
import {IVector2D} from "../_interfaces/vectors.js";
import {IRectangle, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import {IController} from "../_interfaces/input.js";


export abstract class BaseScreen<
    Context extends RenderingContext,
    RenderPipelineType extends IRenderPipeline<Context>,
    ViewportType extends IViewport<Context, RenderPipelineType>>
    implements IScreen<Context, RenderPipelineType, ViewportType>
{
    protected abstract _createContext(): Context;
    protected abstract _createViewport(camera: Camera, size: IRectangle, position?: IVector2D): ViewportType;
    abstract clear(): void;

    readonly context: Context;

    protected readonly _viewports = new Set<ViewportType>();
    protected readonly _render_pipelines = new Map<RenderPipelineType, Set<ViewportType>>();
    protected _active_viewport: ViewportType;
    protected _prior_width = 0;
    protected _prior_height = 0;

    constructor(
        camera: Camera,
        public controller: IController,
        protected readonly _canvas: HTMLCanvasElement,
        protected readonly _size: IRectangle = {width: 1, height: 1}
    ) {
        this.context = this._createContext();
        this.addViewport(camera);
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
            mesh_geometries.on_mesh_added.add(render_pipeline.on_mesh_added);
            mesh_geometries.on_mesh_removed.add(render_pipeline.on_mesh_removed);

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
                mesh_geometries.on_mesh_added.delete(render_pipeline.on_mesh_added);
                mesh_geometries.on_mesh_removed.delete(render_pipeline.on_mesh_removed);
                this._render_pipelines.delete(render_pipeline);
            } else
                viewports.delete(viewport);
        }
    }

    addViewport(
        camera: Camera,
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
        this.controller.camera = viewport.camera;
    }
}

export default class Screen extends BaseScreen<CanvasRenderingContext2D, RenderPipeline, Viewport> {
    protected _createContext(): CanvasRenderingContext2D {
        return this._canvas.getContext('2d');
    }

    protected _createViewport(camera: Camera, size: IRectangle, position?: IVector2D): Viewport {
        return new Viewport(this, camera, size, position);
    }

    clear() {
        this.context.clearRect(0, 0, this._size.width, this._size.height);
    }
}

