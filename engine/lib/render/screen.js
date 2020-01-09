import Viewport from "./viewport.js";
export class BaseScreen {
    constructor(camera, controller, _canvas, _size = { width: 1, height: 1 }) {
        this.controller = controller;
        this._canvas = _canvas;
        this._size = _size;
        this._viewports = [];
        this._prior_width = 0;
        this._prior_height = 0;
        this._context = this._createContext();
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
    addViewport(camera, size = this._size, position = {
        x: 0,
        y: 0
    }) {
        const viewport = this._createViewport(camera, size, position);
        this._viewports.push(viewport);
        return viewport;
    }
    get active_viewport() {
        return this._active_viewport;
    }
    set active_viewport(viewport) {
        this._active_viewport = viewport;
        this.controller.camera = viewport.camera;
    }
}
export default class Screen extends BaseScreen {
    _createContext() {
        return this._canvas.getContext('2d');
    }
    _createViewport(camera, size, position) {
        return new Viewport(this._context, camera, size, position);
    }
    clear() {
        this._context.clearRect(0, 0, this._size.width, this._size.height);
    }
}
//# sourceMappingURL=screen.js.map