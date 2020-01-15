import Camera from "./camera.js";
import Scene from "../scene_graph/scene.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
import {FPSController} from "../input/controllers.js";
import {IScene} from "../_interfaces/nodes.js";
import {IVector2D} from "../_interfaces/vectors.js";
import {IController} from "../_interfaces/input.js";
import {ICamera, IRectangle, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import {VIEWPORT_BORDER_STYLE} from "../../constants.js";


export abstract class BaseScreen<
    Context extends RenderingContext,
    CameraType extends ICamera,
    SceneType extends IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, SceneType>,
    ViewportType extends IViewport<Context, SceneType, CameraType, RenderPipelineType>>
    implements IScreen<Context, CameraType, SceneType, RenderPipelineType, ViewportType>
{
    protected _createDefaultController(): IController {
        return new FPSController(this._canvas)
    };

    protected abstract _createDefaultRenderPipeline(
        context: Context,
        scene: SceneType
    ): RenderPipelineType;

    protected abstract _createViewport(
        camera: CameraType,
        render_pipeline: RenderPipelineType,
        controller: IController,
        size: IRectangle,
        position: IVector2D
    ): ViewportType;

    protected readonly _default_render_pipeline: RenderPipelineType;
    protected readonly _viewports = new Set<ViewportType>();
    protected readonly _render_pipelines = new Map<RenderPipelineType, Set<ViewportType>>();

    protected _viewport_border: HTMLDivElement;
    protected _active_viewport: ViewportType;

    constructor(
        camera: CameraType,
        public scene: SceneType,
        public context: Context,
        protected readonly _canvas: HTMLCanvasElement,
        protected readonly _size: IRectangle = {width: 1, height: 1}
    ) {
        this._viewport_border = document.createElement('div');
        this._viewport_border.style.cssText = VIEWPORT_BORDER_STYLE;
        this._canvas.insertAdjacentElement('afterend', this._viewport_border);

        this._default_render_pipeline = this._createDefaultRenderPipeline(context, scene);
        this.active_viewport = this.addViewport(camera);
    }

    refresh() {
        const width = this._canvas.clientWidth;
        const height = this._canvas.clientHeight;
        if (width !== this._size.width ||
            height !== this._size.height) {
            this.resize(width, height);
        }

        for (const viewport of this._viewports)
            viewport.refresh();
    }

    resize(width: number, height: number): void {
        this._canvas.width = width;
        this._canvas.height = height;

        // const width_scale = width / this._size.width;
        // const height_scale = height / this._size.height;
        for (const viewport of this._viewports)
            viewport.reset(
                (viewport.width / this._size.width) * width,
                (viewport.height / this._size.height) * height,
                (viewport.x / this._size.width)  * width,
                (viewport.y / this._size.height) * height,
            );

        if (this._viewports.size > 1)
            this._updateBorder();

        this._size.width = width;
        this._size.height = height;
    }

    get viewports(): Generator<ViewportType> {return this._iterViewports()}
    private *_iterViewports(): Generator<ViewportType> {
        for (const viewport of this._viewports)
            yield viewport;
    }

    registerViewport(viewport: ViewportType): void {
        if (!this._viewports.has(viewport))
            throw `Can not register a foreign viewport!`;

        const render_pipeline = viewport.render_pipeline;
        if (!this._render_pipelines.has(render_pipeline))
            this._render_pipelines.set(render_pipeline, new Set<ViewportType>());

        const viewports = this._render_pipelines.get(render_pipeline);
        if (!viewports.has(viewport))
            viewports.add(viewport);
    }

    unregisterViewport(viewport: ViewportType): void {
        if (!this._viewports.has(viewport))
            throw `Can not unregister a foreign viewport!`;

        const render_pipeline = viewport.render_pipeline;
        if (this._render_pipelines.has(render_pipeline)) {
            const viewports = this._render_pipelines.get(render_pipeline);
            if (viewports.size === 1) {
                render_pipeline.delete();
                this._render_pipelines.delete(render_pipeline);
            } else
                viewports.delete(viewport);
        }
    }

    addViewport(
        camera: CameraType = this.scene.addCamera(),
        size: IRectangle = {
            width: this._size.width,
            height: this._size.height
        },
        position: IVector2D = {
            x: 0,
            y: 0
        },
        render_pipeline: RenderPipelineType = this._default_render_pipeline,
        controller: IController = this._createDefaultController(),
    ): ViewportType {
        const viewport = this._createViewport(camera, render_pipeline, controller, size, position);
        this._viewports.add(viewport);
        this.registerViewport(viewport);

        if (this._active_viewport) {
            this._active_viewport.width /= 2;
            viewport.setFrom(this._active_viewport);
            viewport.x += viewport.width;
        }

        this._active_viewport = viewport;
        this._updateBorder();

        return viewport;
    }

    removeViewport(viewport: ViewportType): void {
        if (!this._viewports.has(viewport))
            return;

        if (this._viewports.size === 1)
            throw `Can not remove last viewport! Screen must always have at least one.`;

        this.unregisterViewport(viewport);
        this._viewports.delete(viewport);
        this._updateBorder();
    }

    get active_viewport(): ViewportType {
        return this._active_viewport;
    }

    set active_viewport(viewport: ViewportType) {
        if (Object.is(viewport, this._active_viewport))
            return;

        this._active_viewport = viewport;
        this._updateBorder();
    }

    setViewportAt(x: number, y: number): void {
        if (this._active_viewport.is_inside(x, y))
            return;

        for (const viewport of this._viewports)
            if (!Object.is(viewport, this._active_viewport) && viewport.is_inside(x, y)) {
                this.active_viewport = viewport;
                break;
            }
    }

    protected _updateBorder(): void {
        if (this._viewports.size === 1) {
            this._viewport_border.style.display = 'none';
            return;
        }

        this._viewport_border.style.display = 'block';
        this._viewport_border.style.left = `${this.active_viewport.x}px`;
        this._viewport_border.style.top = `${this.active_viewport.y}px`;
        this._viewport_border.style.width = `${this.active_viewport.width}px`;
        this._viewport_border.style.height = `${this.active_viewport.height}px`;
    }
}

export default class Screen extends BaseScreen<CanvasRenderingContext2D, Camera, Scene, RenderPipeline, Viewport> {
    protected _createDefaultRenderPipeline(context: CanvasRenderingContext2D, scene: Scene): RenderPipeline {
        return new RenderPipeline(context, scene);
    }

    protected _createViewport(
        camera: Camera,
        render_pipeline: RenderPipeline,
        controller: IController,
        size: IRectangle,
        position: IVector2D
    ): Viewport {
        return new Viewport(camera, render_pipeline, controller, this, size, position);
    }
}

