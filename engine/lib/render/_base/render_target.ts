import {I2D, IColor} from "../../_interfaces/vectors.js";
import {IRenderTarget, IViewport} from "../../_interfaces/render.js";


export default class RenderTarget implements IRenderTarget {
    protected _image: ImageData;
    protected _array: Uint32Array;
    protected _clamped_array: Uint8ClampedArray;

    constructor(
        protected readonly _viewport: IViewport<CanvasRenderingContext2D>,
        protected readonly _context = _viewport.context
    ) {
        this.reset();
    }

    reset(): void {
        this._image = this._context.getImageData(
            this._viewport.x,
            this._viewport.y,
            this._viewport.width,
            this._viewport.height
        );

        this._clamped_array = this._image.data;
        this._array = new Uint32Array(this._clamped_array.buffer);
    }

    drawTriangle(v1: I2D, v2: I2D, v3: I2D, color: IColor) {
        this._context.beginPath();

        this._context.moveTo(v1.x, v1.y);
        this._context.lineTo(v2.x, v2.y);
        this._context.lineTo(v3.x, v3.y);
        // this.context.lineTo(v1.x, v1.y);
        this._context.closePath();

        this._context.strokeStyle = `${color}`;
        this._context.stroke();
    }

    fillTriangle(v1: I2D, v2: I2D, v3: I2D, color: IColor) {
        this._context.beginPath();

        this._context.moveTo(v1.x, v1.y);
        this._context.lineTo(v2.x, v2.y);
        this._context.lineTo(v3.x, v3.y);

        this._context.closePath();

        this._context.fillStyle = `${color}`;
        this._context.fill();
    }

    putPixel(
        x: number,
        y: number,
        r: number,
        g: number,
        b: number,
        a: number
    ) {
        this._array[y * this._viewport.width + x] =
            ((a * 255) << 24) |    // alpha
            ((b * 255) << 16) |    // blue
            ((g * 255) << 8) |    // green
            (r * 255);            // red
    }

    putPixelClamped(
        x: number,
        y: number,
        r: number,
        g: number,
        b: number,
        a: number
    ) {
        array = this._clamped_array;
        offset = y * this._viewport.width + x;

        array[offset++] = r * 255;
        array[offset++] = g * 255;
        array[offset++] = b * 255;
        array[offset] = a * 255;
    }

    clear(): void {
        this._context.clearRect(
            this._viewport.x,
            this._viewport.y,
            this._viewport.width,
            this._viewport.height
        );
    }

    draw(): void {
        this._context.putImageData(this._image, this._viewport.x, this._viewport.y);
    }
}

let offset: number;
let array: Uint8ClampedArray;