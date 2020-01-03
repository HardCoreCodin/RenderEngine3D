import Viewport from "./viewport.js";
export default class Screen {
    constructor(camera, canvas, context = canvas.getContext('2d'), size = { width: 1, height: 1 }) {
        this.canvas = canvas;
        this.context = context;
        this.size = size;
        this._viewports = [];
        this.updateSize();
        this.addViewport(camera);
    }
    refresh() {
        if (this.size.width !== this.canvas.clientWidth ||
            this.size.height !== this.canvas.clientHeight)
            this.updateSize();
        for (const viewport of this._viewports)
            viewport.refresh();
    }
    updateSize() {
        let w = this.size.width;
        let h = this.size.height;
        this.size.width = this.canvas.clientWidth;
        this.size.height = this.canvas.clientHeight;
        w *= this.size.width;
        h *= this.size.height;
        for (const vp of this._viewports)
            vp.reset(w / vp.width, h / vp.height, w / vp.position.x, h / vp.position.y);
    }
    get viewports() {
        return this._iterViewports();
    }
    addViewport(camera, size = this.size, position = {
        x: 0,
        y: 0
    }) {
        const viewport = new Viewport(camera, this.context, size, position);
        this._viewports.push(viewport);
        return viewport;
    }
    draw() {
        for (const vp of this._viewports)
            this.context.putImageData(vp.image, vp.position.x, vp.position.y);
    }
    clear() {
        for (const viewport of this._viewports)
            viewport.clear();
    }
    drawTriangle(v1, v2, v3, color) {
        this.context.beginPath();
        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);
        // this.context.lineTo(v1.x, v1.y);
        this.context.closePath();
        this.context.strokeStyle = `${color}`;
        this.context.stroke();
    }
    fillTriangle(v1, v2, v3, color) {
        this.context.beginPath();
        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);
        this.context.closePath();
        this.context.fillStyle = `${color}`;
        this.context.fill();
    }
    *_iterViewports() {
        for (const viewport of this._viewports)
            yield viewport;
    }
}
//# sourceMappingURL=screen.js.map