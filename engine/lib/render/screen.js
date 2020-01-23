import Rectangle from "./rectangle.js";
import { RasterViewport, RayTraceViewport } from "./viewport.js";
import { Rasterizer } from "./pipelines.js";
import { rgba } from "../accessors/color.js";
import { FPSController } from "../input/controllers.js";
import { RayTracer } from "./raytracer.js";
export class BaseScreen extends Rectangle {
    constructor(camera, scene, context, _canvas) {
        super();
        this.scene = scene;
        this.context = context;
        this._canvas = _canvas;
        this._viewports = new Set();
        this._render_pipelines = new Map();
        this._active_viewport_border_color = rgba(0, 1, 0, 1);
        this._inactive_viewport_border_color = rgba(0.75);
        this._grid_color = rgba(0, 1, 1, 1);
        this._default_render_pipeline = this._createDefaultRenderPipeline(context, scene);
        this.active_viewport = this.addViewport(camera);
        this._active_viewport.display_border = false;
        this._active_viewport.setGridColor(this._grid_color);
    }
    _createDefaultController() {
        return new FPSController(this._canvas);
    }
    ;
    get grid_color() { return this._active_viewport_border_color; }
    get active_viewport_border_color() { return this._active_viewport_border_color; }
    get inactive_viewport_border_color() { return this._inactive_viewport_border_color; }
    set grid_color(color) {
        this._grid_color.setFrom(color);
        for (const viewport of this._viewports)
            viewport.setGridColor(color);
    }
    set active_viewport_border_color(color) {
        this._active_viewport_border_color.setFrom(color);
        this._active_viewport.setBorderColor(color);
    }
    set inactive_viewport_border_color(color) {
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
    resize(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
        for (const viewport of this._viewports)
            viewport.reset((viewport.width / this._size.width) * width, (viewport.height / this._size.height) * height, (viewport.x / this._size.width) * width, (viewport.y / this._size.height) * height);
        this._size.width = width;
        this._size.height = height;
    }
    get viewports() { return this._iterViewports(); }
    *_iterViewports() {
        for (const viewport of this._viewports)
            yield viewport;
    }
    registerViewport(viewport) {
        if (!this._viewports.has(viewport))
            throw `Can not register a foreign viewport!`;
        const render_pipeline = viewport.render_pipeline;
        if (!this._render_pipelines.has(render_pipeline))
            this._render_pipelines.set(render_pipeline, new Set());
        const viewports = this._render_pipelines.get(render_pipeline);
        if (!viewports.has(viewport))
            viewports.add(viewport);
    }
    unregisterViewport(viewport) {
        if (!this._viewports.has(viewport))
            throw `Can not unregister a foreign viewport!`;
        const render_pipeline = viewport.render_pipeline;
        if (this._render_pipelines.has(render_pipeline)) {
            const viewports = this._render_pipelines.get(render_pipeline);
            if (viewports.size === 1) {
                render_pipeline.delete();
                this._render_pipelines.delete(render_pipeline);
            }
            else
                viewports.delete(viewport);
        }
    }
    addViewport(camera = this.scene.addCamera(), size = {
        width: this._size.width,
        height: this._size.height
    }, position = {
        x: 0,
        y: 0
    }, render_pipeline = this._default_render_pipeline, controller = this._createDefaultController()) {
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
        }
        else
            this._active_viewport = viewport;
        return viewport;
    }
    removeViewport(viewport) {
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
    get active_viewport() {
        return this._active_viewport;
    }
    set active_viewport(viewport) {
        if (Object.is(viewport, this._active_viewport))
            return;
        viewport.setBorderColor(this._active_viewport_border_color);
        this._active_viewport = viewport;
        for (const other_viewport of this._viewports)
            if (!Object.is(viewport, other_viewport))
                other_viewport.setBorderColor(this._inactive_viewport_border_color);
    }
    setViewportAt(x, y) {
        if (this._active_viewport.is_inside(x, y))
            return;
        for (const viewport of this._viewports)
            if (!Object.is(viewport, this._active_viewport) && viewport.is_inside(x, y))
                this.active_viewport = viewport;
            else
                viewport.setBorderColor(this._inactive_viewport_border_color);
    }
}
export class RasterScreen extends BaseScreen {
    _createDefaultRenderPipeline(context, scene) {
        return new Rasterizer(context, scene);
    }
    _createViewport(camera, render_pipeline, controller, size, position) {
        return new RasterViewport(camera, render_pipeline, controller, this, size, position);
    }
}
export class RayTraceScreen extends BaseScreen {
    _createDefaultRenderPipeline(context, scene) {
        return new RayTracer(context, scene);
    }
    _createViewport(camera, render_pipeline, controller, size, position) {
        return new RayTraceViewport(camera, render_pipeline, controller, this, size, position);
    }
}
//# sourceMappingURL=screen.js.map