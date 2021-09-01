import Rectangle from "./rectangle.js";
import { rgba } from "../../accessors/color.js";
export default class Display extends Rectangle {
    constructor(_scene, RenderPipeline, Viewport, Controller, context = _scene.context) {
        super({ width: context.canvas.width, height: context.canvas.height }, { x: 0, y: 0 });
        this._scene = _scene;
        this.RenderPipeline = RenderPipeline;
        this.Viewport = Viewport;
        this.Controller = Controller;
        this.context = context;
        this._viewports = new Set();
        this._render_pipelines = new Map();
        this._active_viewport_border_color = rgba(0, 1, 0, 1);
        this._inactive_viewport_border_color = rgba(0.75);
        this._canvas = context.canvas;
        this._default_render_pipeline = new RenderPipeline(this.context, this._scene);
        this.active_viewport = this.addViewport();
        this._active_viewport.border.display = false;
    }
    get active_viewport_border_color() { return this._active_viewport_border_color; }
    get inactive_viewport_border_color() { return this._inactive_viewport_border_color; }
    set active_viewport_border_color(color) {
        this._active_viewport_border_color.setFrom(color);
        this._active_viewport.border.color = color;
    }
    set inactive_viewport_border_color(color) {
        this._inactive_viewport_border_color.setFrom(color);
        for (const viewport of this._viewports)
            if (!Object.is(viewport, this._active_viewport))
                viewport.border.color = color;
    }
    refresh() {
        const width = this._canvas.clientWidth;
        const height = this._canvas.clientHeight;
        if (width !== this.size.width ||
            height !== this.size.height)
            this.resize(width, height);
        for (const viewport of this._viewports)
            viewport.refresh();
    }
    resize(width, height) {
        const scale_x = width / this.size.width;
        const scale_y = height / this.size.height;
        this.size.width = this._canvas.width = width;
        this.size.height = this._canvas.height = height;
        let new_width, new_height;
        let last_x = 0;
        for (const viewport of this._viewports) {
            new_width = Math.round(viewport.width * scale_x);
            new_height = Math.round(viewport.height * scale_y);
            viewport.reset(new_width, new_height, last_x, viewport.y);
            last_x += new_width;
        }
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
    addViewport(controller = new this.Controller(this._canvas, this._scene.addCamera()), render_pipeline = this._default_render_pipeline, viewport = new this.Viewport(controller, render_pipeline, this)) {
        this._viewports.add(viewport);
        this.registerViewport(viewport);
        if (this._active_viewport) {
            const old_width = this._active_viewport.width;
            const new_width = Math.round(old_width / 2);
            const left_over = old_width - new_width;
            this._active_viewport.width = new_width;
            this._active_viewport.border.display = true;
            this._active_viewport.update();
            viewport.setFrom(this._active_viewport);
            viewport.reset(left_over, viewport.height, this.active_viewport.x + new_width, viewport.y);
            this.active_viewport = viewport;
        }
        else
            this._active_viewport = viewport;
        viewport.is_active = true;
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
            this._active_viewport.border.display = false;
    }
    get active_viewport() {
        return this._active_viewport;
    }
    set active_viewport(viewport) {
        if (Object.is(viewport, this._active_viewport))
            return;
        this._active_viewport.is_active = false;
        viewport.is_active = true;
        viewport.border.color = this._active_viewport_border_color;
        this._active_viewport = viewport;
        for (const other_viewport of this._viewports)
            if (!Object.is(viewport, other_viewport))
                other_viewport.border.color = this._inactive_viewport_border_color;
    }
    setViewportAt(x, y) {
        if (this._active_viewport.is_inside(x, y))
            return;
        for (const viewport of this._viewports)
            if (!Object.is(viewport, this._active_viewport) && viewport.is_inside(x, y))
                this.active_viewport = viewport;
            else
                viewport.border.color = this._inactive_viewport_border_color;
    }
}
//# sourceMappingURL=display.js.map