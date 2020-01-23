import Camera from "./camera.js";
import Rectangle from "./rectangle.js";
import {RasterViewport, RayTraceViewport} from "./viewport.js";
import {Rasterizer, RayTracer} from "./pipelines.js";
import {Color4D, rgba} from "../accessors/color.js";
import {FPSController} from "../input/controllers.js";
import {IScene} from "../_interfaces/nodes.js";
import {I2D} from "../_interfaces/vectors.js";
import {IController} from "../_interfaces/input.js";
import {ICamera, ISize, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import {RasterScene, RayTraceScene} from "../scene_graph/scene.js";


export abstract class BaseScreen<
    Context extends RenderingContext,
    CameraType extends ICamera,
    SceneType extends IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, CameraType>,
    ViewportType extends IViewport<Context, CameraType, SceneType, RenderPipelineType>>
    extends Rectangle
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
        size: ISize,
        position: I2D
    ): ViewportType;

    protected readonly _default_render_pipeline: RenderPipelineType;
    protected readonly _viewports = new Set<ViewportType>();
    protected readonly _render_pipelines = new Map<RenderPipelineType, Set<ViewportType>>();
    protected _active_viewport: ViewportType;

    protected readonly _active_viewport_border_color = rgba(0, 1, 0, 1);
    protected readonly _inactive_viewport_border_color = rgba(0.75);
    protected readonly _grid_color = rgba(0, 1, 1, 1);

    constructor(
        camera: CameraType,
        public scene: SceneType,
        public context: Context,
        protected readonly _canvas: HTMLCanvasElement
    ) {
        super();
        this._default_render_pipeline = this._createDefaultRenderPipeline(context, scene);
        this.active_viewport = this.addViewport(camera);
        this._active_viewport.display_border = false;
        this._active_viewport.setGridColor(this._grid_color);
    }

    get grid_color(): Color4D {return this._active_viewport_border_color}
    get active_viewport_border_color(): Color4D {return this._active_viewport_border_color}
    get inactive_viewport_border_color(): Color4D {return this._inactive_viewport_border_color}

    set grid_color(color: Color4D) {
        this._grid_color.setFrom(color);
        for (const viewport of this._viewports)
            viewport.setGridColor(color);
    }

    set active_viewport_border_color(color: Color4D) {
        this._active_viewport_border_color.setFrom(color);
        this._active_viewport.setBorderColor(color);
    }

    set inactive_viewport_border_color(color: Color4D) {
        this._inactive_viewport_border_color.setFrom(color);
        for (const viewport of this._viewports)
            if (!Object.is(viewport, this._active_viewport))
                viewport.setBorderColor(color);
    }

    refresh() {
        const width = this._canvas.clientWidth;
        const height = this._canvas.clientHeight;
        if (width !== this._size.width ||
            height !== this._size.height) {
            this.resize(width, height);
        }

        // this._active_viewport.refresh();
        for (const viewport of this._viewports)
            viewport.refresh();
    }

    resize(width: number, height: number): void {
        this._canvas.width = width;
        this._canvas.height = height;

        for (const viewport of this._viewports)
            viewport.reset(
                (viewport.width / this._size.width) * width,
                (viewport.height / this._size.height) * height,
                (viewport.x / this._size.width)  * width,
                (viewport.y / this._size.height) * height,
            );

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
        size: ISize = {
            width: this._size.width,
            height: this._size.height
        },
        position: I2D = {
            x: 0,
            y: 0
        },
        render_pipeline: RenderPipelineType = this._default_render_pipeline,
        controller: IController = this._createDefaultController(),
    ): ViewportType {
        const viewport = this._createViewport(camera, render_pipeline, controller, size, position);
        this._viewports.add(viewport);
        this.registerViewport(viewport);
        viewport.setGridColor(this._grid_color);

        if (this._active_viewport) {
            this._active_viewport.width /= 2;
            this._active_viewport.display_border = true;
            viewport.setFrom(this._active_viewport);
            viewport.x += viewport.width;
            this.active_viewport = viewport;
        } else
            this._active_viewport = viewport;

        return viewport;
    }

    removeViewport(viewport: ViewportType): void {
        if (!this._viewports.has(viewport))
            return;

        if (this._viewports.size === 1)
            throw `Can not remove last viewport! Screen must always have at least one.`;

        this.unregisterViewport(viewport);
        this._viewports.delete(viewport);
        this.active_viewport = [...this._viewports][0];
        if (this._viewports.size === 1)
            this._active_viewport.display_border = false;
    }

    get active_viewport(): ViewportType {
        return this._active_viewport;
    }

    set active_viewport(viewport: ViewportType) {
        if (Object.is(viewport, this._active_viewport))
            return;

        viewport.setBorderColor(this._active_viewport_border_color);
        this._active_viewport = viewport;

        for (const other_viewport of this._viewports)
            if (!Object.is(viewport, other_viewport))
                other_viewport.setBorderColor(this._inactive_viewport_border_color);
    }

    setViewportAt(x: number, y: number): void {
        if (this._active_viewport.is_inside(x, y))
            return;

        for (const viewport of this._viewports)
            if (!Object.is(viewport, this._active_viewport) && viewport.is_inside(x, y))
                this.active_viewport = viewport;
            else
                viewport.setBorderColor(this._inactive_viewport_border_color);
    }
}

export class RasterScreen extends BaseScreen<CanvasRenderingContext2D, Camera, RasterScene, Rasterizer, RasterViewport> {
    protected _createDefaultRenderPipeline(context: CanvasRenderingContext2D, scene: RasterScene): Rasterizer {
        return new Rasterizer(context, scene);
    }

    protected _createViewport(
        camera: Camera,
        render_pipeline: Rasterizer,
        controller: IController,
        size: ISize,
        position: I2D
    ): RasterViewport {
        return new RasterViewport(camera, render_pipeline, controller, this, size, position);
    }
}

export class RayTraceScreen extends BaseScreen<CanvasRenderingContext2D, Camera, RayTraceScene, RayTracer, RayTraceViewport> {
    protected _createDefaultRenderPipeline(context: CanvasRenderingContext2D, scene: RayTraceScene): RayTracer {
        return new RayTracer(context, scene);
    }

    protected _createViewport(
        camera: Camera,
        render_pipeline: RayTracer,
        controller: IController,
        size: ISize,
        position: I2D
    ): RayTraceViewport {
        return new RayTraceViewport(camera, render_pipeline, controller, this, size, position);
    }
}