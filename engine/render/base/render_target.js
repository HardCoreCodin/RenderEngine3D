import { drawPixel } from "../../core/utils.js";
import { drawLine2D } from "../raster/software/core/line.js";
export default class RenderTarget {
    constructor(viewport, context = viewport.context) {
        this.viewport = viewport;
        this.context = context;
    }
    reset() {
        this.image = this.context.getImageData(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
        this.array = new Uint32Array(this.image.data.buffer);
    }
    drawTriangle(v1, v2, v3, color) {
        this.context.beginPath();
        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);
        this.context.closePath();
        this.context.strokeStyle = `${color}`;
        this.context.stroke();
    }
    fillTriangle(v1, v2, v3, color) {
        this.context.beginPath();
        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);
        this.context.closePath();
        this.context.fillStyle = `${color}`;
        this.context.fill();
    }
    putPixel(index, r, g, b, a = 1) {
        drawPixel(this.array, index, r, g, b, a);
    }
    drawLine2D(x1, y1, x2, y2, r, g, b, a = 1) {
        drawLine2D(this.array, this.viewport.width, this.viewport.height, x1, x2, y1, y2, r, g, b, a);
    }
    clear() {
        this.array.fill(0);
    }
    draw() {
        this.context.putImageData(this.image, this.viewport.x, this.viewport.y);
    }
}
//# sourceMappingURL=render_target.js.map