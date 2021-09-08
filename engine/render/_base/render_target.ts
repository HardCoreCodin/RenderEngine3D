import {I2D, IColor} from "../../core/_interfaces/vectors.js";
import {IViewport} from "../../core/_interfaces/render.js";
import {drawPixel} from "../../core/utils.js";
import {drawLine2D} from "../raster/software/_core/line.js";


export default class RenderTarget {
    image: ImageData;
    array: Uint32Array;
    // protected _array_buffer: ArrayBuffer;
    // protected _clamped_array: Uint8ClampedArray;

    constructor(
        readonly viewport: IViewport<CanvasRenderingContext2D>,
        readonly context = viewport.context
    ) {}

    reset(): void {
        this.image = this.context.getImageData(
            this.viewport.x,
            this.viewport.y,
            this.viewport.width,
            this.viewport.height
        );

        // this._array_buffer = new ArrayBuffer(this._image.data.length);
        // this._clamped_array = new Uint8ClampedArray(this._array_buffer);
        // this._array = new Uint32Array(this._array_buffer);
        this.array = new Uint32Array(this.image.data.buffer);
    }

    drawTriangle(v1: I2D, v2: I2D, v3: I2D, color: IColor) {
        this.context.beginPath();

        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);
        // this.context.lineTo(v1.x, v1.y);
        this.context.closePath();

        this.context.strokeStyle = `${color}`;
        this.context.stroke();
    }

    fillTriangle(v1: I2D, v2: I2D, v3: I2D, color: IColor) {
        this.context.beginPath();

        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);

        this.context.closePath();

        this.context.fillStyle = `${color}`;
        this.context.fill();
    }

    putPixel(
        index: number,

        r: number,
        g: number,
        b: number,
        a: number = 1
    ) {
        drawPixel(this.array, index, r, g, b, a);
    }

    drawLine2D(
        x1: number, y1: number,
        x2: number, y2: number,

        r: number,
        g: number,
        b: number,
        a: number = 1
    ) {
        drawLine2D(this.array, this.viewport.width, this.viewport.height, x1, x2, y1, y2, r, g, b, a);
    }

    clear(): void {
        this.array.fill(0);
        // this.context.clearRect(
        //     this.viewport.x,
        //     this.viewport.y,
        //     this.viewport.width,
        //     this.viewport.height
        // );
    }

    draw(): void {
        // this._image.data.set(this._clamped_array);
        this.context.putImageData(this.image, this.viewport.x, this.viewport.y);
    }
}


