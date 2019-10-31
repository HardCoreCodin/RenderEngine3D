import Position3D from "../linalng/3D/position.js";
import Position4D from "../linalng/4D/position.js";
import Direction4D from "../linalng/4D/direction.js";
import Color3D from "../linalng/3D/color.js";
export default class Vertex {
    constructor(position = new Position4D(), normal = new Direction4D(), uvs = new Position3D(), color = new Color3D()) {
        this.position = position;
        this.normal = normal;
        this.uvs = uvs;
        this.color = color;
        this.copy = (new_vertex = new Vertex()) => new_vertex.setTo(this);
    }
    toNDC() {
        const w = this.position.buffer[3];
        if (w !== 1)
            this.position.div(w);
    }
    isInView(near = 0, far = 1) {
        const [x, y, z, w] = this.position.buffer;
        return (near <= z && z <= far &&
            -w <= y && y <= w &&
            -w <= x && x <= w);
    }
    isOutOfView(near = 0, far = 1) {
        const [x, y, z, w] = this.position.buffer;
        return (z < near ||
            z > far ||
            y > w ||
            y < -w ||
            x > w ||
            x < -w);
    }
    lerp(to, by, out = new Vertex()) {
        this.position.lerp(to.position, by, out.position);
        this.uvs.lerp(to.uvs, by, out.uvs);
        this.normal.lerp(to.normal, by, out.normal);
        // this.color.lerp(to.color, by, out.color);
        return out;
    }
    setTo(position = new Position4D(), normal, uv_coords, color) {
        if (position instanceof Vertex) {
            this.position.setTo(position.position);
            this.normal.setTo(position.normal);
            this.uvs.setTo(position.uvs);
            this.color.setTo(position.color);
        }
        else if (position instanceof Position4D) {
            this.position.setTo(position);
            if (normal instanceof Direction4D)
                this.normal.setTo(normal);
            if (uv_coords instanceof Position3D)
                this.uvs.setTo(uv_coords);
            if (color instanceof Color3D)
                this.color.setTo(color);
        }
        else
            throw `Invalid input (position/vertex): ${position}`;
        return this;
    }
}
//# sourceMappingURL=vertex.js.map