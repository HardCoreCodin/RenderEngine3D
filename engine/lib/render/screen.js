import Viewport from "./viewport.js";
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
        const render_pipeline = viewport.render_pipeline;
        let viewports;
        if (this._render_pipelines.has(render_pipeline))
            viewports = this._render_pipelines.get(render_pipeline);
        else {
            const mesh_geometries = viewport.camera.scene.mesh_geometries;
            mesh_geometries.on_mesh_added.add(render_pipeline.on_mesh_added);
            mesh_geometries.on_mesh_removed.add(render_pipeline.on_mesh_removed);
            viewports = new Set();
            this._render_pipelines.set(render_pipeline, viewports);
        }
        if (!viewports.has(viewport))
            viewports.add(viewport);
    }
    unregisterViewport(viewport) {
        const render_pipeline = viewport.render_pipeline;
        if (this._render_pipelines.has(render_pipeline)) {
            const viewports = this._render_pipelines.get(render_pipeline);
            if (viewports.size === 1) {
                const mesh_geometries = viewport.camera.scene.mesh_geometries;
                mesh_geometries.on_mesh_added.delete(render_pipeline.on_mesh_added);
                mesh_geometries.on_mesh_removed.delete(render_pipeline.on_mesh_removed);
                this._render_pipelines.delete(render_pipeline);
            }
            else
                viewports.delete(viewport);
        }
    }
    addViewport(camera, size = this._size, position = {
        x: 0,
        y: 0
    }) {
        const viewport = this._createViewport(camera, size, position);
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
        this._active_viewport = this.controller.viewport = viewport;
    }
}
export default class Screen extends BaseScreen {
    _createViewport(camera, size, position) {
        return new Viewport(camera, this, size, position);
    }
    clear() {
        this.context.clearRect(0, 0, this._size.width, this._size.height);
    }
}
//# sourceMappingURL=screen.js.map