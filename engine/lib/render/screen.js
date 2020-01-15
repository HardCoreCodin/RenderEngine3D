import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
import { FPSController } from "../input/controllers.js";
import { VIEWPORT_BORDER_STYLE } from "../../constants.js";
export class BaseScreen {
    constructor(camera, scene, context, _canvas, _size = { width: 1, height: 1 }) {
        this.scene = scene;
        this.context = context;
        this._canvas = _canvas;
        this._size = _size;
        this._viewports = new Set();
        this._render_pipelines = new Map();
        this._viewport_border = document.createElement('div');
        this._viewport_border.style.cssText = VIEWPORT_BORDER_STYLE;
        this._canvas.insertAdjacentElement('afterend', this._viewport_border);
        this._default_render_pipeline = this._createDefaultRenderPipeline(context, scene);
        this.active_viewport = this.addViewport(camera);
    }
    _createDefaultController() {
        return new FPSController(this._canvas);
    }
    ;
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
    resize(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
        // const width_scale = width / this._size.width;
        // const height_scale = height / this._size.height;
        for (const viewport of this._viewports)
            viewport.reset((viewport.width / this._size.width) * width, (viewport.height / this._size.height) * height, (viewport.x / this._size.width) * width, (viewport.y / this._size.height) * height);
        if (this._viewports.size > 1)
            this._updateBorder();
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
        if (this._active_viewport) {
            this._active_viewport.width /= 2;
            viewport.setFrom(this._active_viewport);
            viewport.x += viewport.width;
        }
        this._active_viewport = viewport;
        this._updateBorder();
        return viewport;
    }
    removeViewport(viewport) {
        if (!this._viewports.has(viewport))
            return;
        if (this._viewports.size === 1)
            throw `Can not remove last viewport! Screen must always have at least one.`;
        this.unregisterViewport(viewport);
        this._viewports.delete(viewport);
        this._updateBorder();
    }
    get active_viewport() {
        return this._active_viewport;
    }
    set active_viewport(viewport) {
        if (Object.is(viewport, this._active_viewport))
            return;
        this._active_viewport = viewport;
        this._updateBorder();
    }
    setViewportAt(x, y) {
        if (this._active_viewport.is_inside(x, y))
            return;
        for (const viewport of this._viewports)
            if (!Object.is(viewport, this._active_viewport) && viewport.is_inside(x, y)) {
                this.active_viewport = viewport;
                break;
            }
    }
    _updateBorder() {
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
export default class Screen extends BaseScreen {
    _createDefaultRenderPipeline(context, scene) {
        return new RenderPipeline(context, scene);
    }
    _createViewport(camera, render_pipeline, controller, size, position) {
        return new Viewport(camera, render_pipeline, controller, this, size, position);
    }
}
//# sourceMappingURL=screen.js.map