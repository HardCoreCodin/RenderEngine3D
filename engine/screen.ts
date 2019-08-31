import {Triangle} from "./primitives/triangle.js";

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

    drawTriangle(tri: Triangle) {
        this.context.beginPath();

        this.context.moveTo(tri.p0.x, tri.p0.y);
        this.context.lineTo(tri.p1.x, tri.p1.y);
        this.context.lineTo(tri.p2.x, tri.p2.y);
        this.context.lineTo(tri.p0.x, tri.p0.y);

        this.context.closePath();

        this.context.strokeStyle = `${tri.color}`;
        this.context.stroke();
    }

    fillTriangle(tri: Triangle) {
        this.context.beginPath();

        this.context.moveTo(tri.p0.x, tri.p0.y);
        this.context.lineTo(tri.p1.x, tri.p1.y);
        this.context.lineTo(tri.p2.x, tri.p2.y);

        this.context.closePath();

        this.context.fillStyle = `${tri.color}`;
        this.context.fill();
    }
}