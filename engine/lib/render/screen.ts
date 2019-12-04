import Camera from "./camera.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
import {IRectangle} from "../_interfaces/render.js";
import {IColor, IVector2D} from "../_interfaces/vectors.js";


export default class Screen {
    private readonly _viewports: Viewport[] = [];
    private readonly _images: ImageData[] = [];

    public size: IRectangle;

    constructor(
        camera: Camera,
        private readonly canvas: HTMLCanvasElement,
        private readonly context = canvas.getContext('2d')
    ) {
        this.addViewport(camera);
        this.updateSize();
    }

    refresh(render_pipeline: RenderPipeline) {
        if (this.size.width !== this.canvas.width ||
            this.size.height !== this.canvas.height)
            this.updateSize();

        for (const viewport of this._viewports)
            viewport.refresh(render_pipeline);
    }

    updateSize() {
        const old_width = this.size.width;
        const old_height = this.size.height;

        this.size.width = this.canvas.width;
        this.size.height = this.canvas.height;

        let image: ImageData;
        let new_width, new_height, new_x, new_y: number;
        for (const [i, viewport] of this._viewports.entries()) {

            new_width = this.size.width * (old_width / viewport.width);
            new_height = this.size.height * (old_height / viewport.height);

            new_x = this.size.width * (old_width / viewport.position.x);
            new_y = this.size.height * (old_height / viewport.position.y);

            this._images[i] = image = this.context.getImageData(new_x, new_y, new_width, new_height);

            viewport.reset(
                new Uint32Array(image.data.buffer),

                new_width,
                new_height,

                new_x,
                new_y
            );
        }
    }

    get viewports(): Generator<Viewport> {
        return this._iterViewports();
    }

    addViewport(
        camera: Camera,
        size: IRectangle = this.size,
        position: IVector2D = {x: 0, y: 0}
    ) {
        const image = this.context.getImageData(
            position.x,
            position.y,

            size.width,
            size.height
        );
        const pixels = new Uint32Array(image.data.buffer);
        const viewport = new Viewport(camera, size, position, pixels);

        this._images.push(image);
        this._viewports.push(viewport);
    }

    draw() {
        for (const [i, viewport] of this._viewports.entries()) {
            this.context.putImageData(this._images[i], viewport.position.x, viewport.position.y);
        }
    }

    clearAll() {
        for (const viewport of this._viewports)
            this.clear(viewport);
    }

    clear(viewport: Viewport) {
        this.context.clearRect(
            viewport.position.x,
            viewport.position.y,

            viewport.width,
            viewport.height
        );
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