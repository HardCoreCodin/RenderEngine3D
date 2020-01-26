import {I2D, IColor} from "../../_interfaces/vectors.js";
import {IViewport} from "../../_interfaces/render.js";
import {IS_BIG_ENDIAN} from "../../../constants.js";


export default class RenderTarget {
    protected _image: ImageData;
    protected _array: Uint32Array;
    // protected _array_buffer: ArrayBuffer;
    // protected _clamped_array: Uint8ClampedArray;

    constructor(
        protected readonly _viewport: IViewport<CanvasRenderingContext2D>,
        protected readonly _context = _viewport.context
    ) {}

    reset(): void {
        this._image = this._context.getImageData(
            this._viewport.x,
            this._viewport.y,
            this._viewport.width,
            this._viewport.height
        );

        // this._array_buffer = new ArrayBuffer(this._image.data.length);
        // this._clamped_array = new Uint8ClampedArray(this._array_buffer);
        // this._array = new Uint32Array(this._array_buffer);
        this._array = new Uint32Array(this._image.data.buffer);
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
        index: number,

        r: number,
        g: number,
        b: number,
        a: number = 1
    ) {
        put_pixel_data(this._array, index, r, g, b, a);
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
        // this._image.data.set(this._clamped_array);
        this._context.putImageData(this._image, this._viewport.x, this._viewport.y);
    }
}


const put_pixel_data = IS_BIG_ENDIAN ? (
    data: Uint32Array,
    index: number,

    r: number,
    g: number,
    b: number,
    a: number
): void => {
    data[index] = (
        // red
        (r * 255) << 24
    ) | (
        // green
        (g * 255) << 16
    ) | (
        // blue
        (b * 255) << 8
    )  | (
        // alpha
        (a * 255)
    );
} : (
    data: Uint32Array,
    index: number,

    r: number,
    g: number,
    b: number,
    a: number
): void => {
    data[index] = (
        // alpha
        (a * 255) << 24
    ) | (
        // blue
        (b * 255) << 16
    ) | (
        // green
        (g * 255) << 8
    )  | (
        // red
        (r * 255)
    );
};