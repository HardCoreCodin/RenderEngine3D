import {Triangle4D} from "./primitives/triangle.js";

export default class Screen {
    public width: number;
    public height: number;

    private image: ImageData;
    private pixels: Int32Array;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly context: CanvasRenderingContext2D = canvas.getContext('2d')
    ) {
        this.updateSize();
    }

    updateSize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.image = this.context.getImageData(0, 0, this.width, this.height)
        this.pixels = new Int32Array(this.image.data.buffer);
    }

    putPixel(
        x: number,
        y: number,

        r: number,
        g: number,
        b: number,
        a: number
    ) {
        this.pixels[y * this.width + x] =
            ((a * 255) << 24) |    // alpha
            ((b * 255) << 16) |    // blue
            ((g * 255) <<  8) |    // green
            ( r * 255);            // red
    }

    draw() {
        this.context.putImageData(this.image, 0, 0);
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawTriangle(triangle: Triangle) {
        this.context.beginPath();

        this.context.moveTo(
            triangle.vertices[0].position.buffer[0],
            triangle.vertices[0].position.buffer[1]
        );
        this.context.lineTo(
            triangle.vertices[1].position.buffer[0],
            triangle.vertices[1].position.buffer[1]
        );
        this.context.lineTo(
            triangle.vertices[2].position.buffer[0],
            triangle.vertices[2].position.buffer[1]
        );
        this.context.lineTo(
            triangle.vertices[0].position.buffer[0],
            triangle.vertices[0].position.buffer[1]
        );

        this.context.closePath();

        this.context.strokeStyle = `${triangle.color}`;
        this.context.stroke();
    }

    fillTriangle(triangle: Triangle) {
        this.context.beginPath();

        this.context.moveTo(
            triangle.vertices[0].position.buffer[0],
            triangle.vertices[0].position.buffer[1]
        );
        this.context.lineTo(
            triangle.vertices[1].position.buffer[0],
            triangle.vertices[1].position.buffer[1]
        );
        this.context.lineTo(
            triangle.vertices[2].position.buffer[0],
            triangle.vertices[2].position.buffer[1]
        );

        this.context.closePath();

        this.context.fillStyle = `${triangle.color}`;
        this.context.fill();
    }
}