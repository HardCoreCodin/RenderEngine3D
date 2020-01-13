import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
export class BaseScreen {
    constructor(camera, scene, context, controller, _canvas, _size = { width: 1, height: 1 }) {
        this.scene = scene;
        this.context = context;
        this.controller = controller;
        this._canvas = _canvas;
        this._size = _size;
        this._viewports = new Set();
        this._render_pipelines = new Map();
        this._prior_width = 0;
        this._prior_height = 0;
        this._default_render_pipeline = this._createDefaultRenderPipeline(context, scene);
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
    resize(width, height) {
        const width_scale = width / this._size.width;
        const height_scale = height / this._size.height;
        for (const vp of this._viewports)
            vp.scale(width_scale, height_scale);
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
    addViewport(camera, size = this._size, position = {
        x: 0,
        y: 0
    }, render_pipeline = this._default_render_pipeline) {
        const viewport = this._createViewport(camera, render_pipeline, size, position);
        this._viewports.add(viewport);
        this.registerViewport(viewport);
        return viewport;
    }
    removeViewport(viewport) {
        if (!this._viewports.has(viewport))
            return;
        this.unregisterViewport(viewport);
        this._viewports.delete(viewport);
    }
    get active_viewport() {
        return this._active_viewport;
    }
    set active_viewport(viewport) {
        this._active_viewport = viewport;
        if (this.controller)
            this.controller.viewport = viewport;
    }
}
export default class Screen extends BaseScreen {
    _createDefaultRenderPipeline(context, scene) {
        return new RenderPipeline(context, scene);
    }
    _createViewport(camera, render_pipeline, size, position) {
        return new Viewport(camera, render_pipeline, this, size, position);
    }
    clear() {
        this.context.clearRect(0, 0, this._size.width, this._size.height);
    }
}
//# sourceMappingURL=screen.js.map