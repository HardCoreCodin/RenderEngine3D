export default class Screen {
    constructor(canvas, context = canvas.getContext('2d')) {
        this.canvas = canvas;
        this.context = context;
    }
    get width() { return this.canvas.width; }
    ;
    get height() { return this.canvas.height; }
    ;
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    drawTriangle(triangle) {
        this.context.beginPath();
        this.context.moveTo(triangle.vertices[0].position.buffer[0], triangle.vertices[0].position.buffer[1]);
        this.context.lineTo(triangle.vertices[1].position.buffer[0], triangle.vertices[1].position.buffer[1]);
        this.context.lineTo(triangle.vertices[2].position.buffer[0], triangle.vertices[2].position.buffer[1]);
        this.context.lineTo(triangle.vertices[0].position.buffer[0], triangle.vertices[0].position.buffer[1]);
        this.context.closePath();
        this.context.strokeStyle = `${triangle.color}`;
        this.context.stroke();
    }
    fillTriangle(triangle) {
        this.context.beginPath();
        this.context.moveTo(triangle.vertices[0].position.buffer[0], triangle.vertices[0].position.buffer[1]);
        this.context.lineTo(triangle.vertices[1].position.buffer[0], triangle.vertices[1].position.buffer[1]);
        this.context.lineTo(triangle.vertices[2].position.buffer[0], triangle.vertices[2].position.buffer[1]);
        this.context.closePath();
        this.context.fillStyle = `${triangle.color}`;
        this.context.fill();
    }
}
//# sourceMappingURL=screen.js.map