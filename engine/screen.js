export default class Screen {
    constructor(canvas, context = canvas.getContext('2d')) {
        this.canvas = canvas;
        this.context = context;
        this.updateSize();
    }
    updateSize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.image = this.context.getImageData(0, 0, this.width, this.height);
        this.pixels = new Int32Array(this.image.data.buffer);
    }
    putPixel(x, y, r, g, b, a) {
        this.pixels[y * this.width + x] =
            ((a * 255) << 24) | // alpha
                ((b * 255) << 16) | // blue
                ((g * 255) << 8) | // green
                (r * 255); // red
    }
    draw() {
        this.context.putImageData(this.image, 0, 0);
    }
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