import {Triangle} from "./primitives/triangle.js";
import Vertex from "./primitives/vertex";

export default class Screen {
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly context: CanvasRenderingContext2D = canvas.getContext('2d'),
    ) {}

    get width() : number {return this.canvas.width};
    get height() : number {return this.canvas.height};

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