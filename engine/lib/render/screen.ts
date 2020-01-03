import Camera from "./camera.js";
import Viewport from "./viewport.js";
import {IRectangle} from "../_interfaces/render.js";
import {IColor, IVector2D} from "../_interfaces/vectors.js";


export default class Screen {
    private readonly _viewports: Viewport[] = [];

    constructor(
        camera: Camera,
        private readonly canvas: HTMLCanvasElement,
        private readonly context = canvas.getContext('2d'),
        private readonly size: IRectangle = {width: 1, height: 1}
    ) {
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
            vp.reset(w/vp.width, h/vp.height, w/vp.position.x,h/vp.position.y);
    }

    get viewports(): Generator<Viewport> {
        return this._iterViewports();
    }

    addViewport(
        camera: Camera,
        size: IRectangle = this.size,
        position: IVector2D = {
            x: 0,
            y: 0
        }
    ): Viewport {
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

    drawTriangle(v1: IVector2D, v2: IVector2D, v3: IVector2D, color: IColor) {
        this.context.beginPath();

        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);
        // this.context.lineTo(v1.x, v1.y);
        this.context.closePath();

        this.context.strokeStyle = `${color}`;
        this.context.stroke();
    }

    fillTriangle(v1: IVector2D, v2: IVector2D, v3: IVector2D, color: IColor) {
        this.context.beginPath();

        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);

        this.context.closePath();

        this.context.fillStyle = `${color}`;
        this.context.fill();
    }

    private *_iterViewports(): Generator<Viewport> {
        for (const viewport of this._viewports)
            yield viewport;
    }
}