import Position3D from "../linalng/3D/position.js";
import Position4D from "../linalng/4D/position.js";
import Direction4D from "../linalng/4D/direction.js";
import Color3D from "../linalng/3D/color.js";

export default class Vertex {
    constructor(
        public position: Position4D = new Position4D(),
        public normal: Direction4D = new Direction4D(),
        public uv_coords: Position3D = new Position3D(),
        public color: Color3D = new Color3D()
    ) {}

    copy = (
        new_vertex: Vertex = new Vertex()
    ) : Vertex => new_vertex.setTo(this);

    toNDC() : void {
        const w = this.position.buffer[3];
        if (w !== 1) this.position.div(w);
    }

    isInView(near: number = 0, far: number = 1) : boolean {
        const [x, y, z, w] = [...this.position.buffer];
        return (
            near <= z && z <= far &&
            -w <= y && y <= w &&
            -w <= x && x <= w
        );
    }

    isOutOfView(near: number = 0, far: number = 1) : boolean {
        const [x, y, z, w] = [...this.position.buffer];
        return (
            z < near ||
            z > far ||
            y > w ||
            y < -w ||
            x > w ||
            x < -w
        );
    }

    lerp(
        to: Vertex,
        by: number,
        out: Vertex = new Vertex()
    ) : Vertex {
        this.position.lerp(to.position, by, out.position);
        this.uv_coords.lerp(to.uv_coords, by, out.uv_coords);
        this.normal.lerp(to.normal, by, out.normal);
        // this.color.lerp(to.color, by, out.color);

        return out;
    }

    setTo(
        position: Position4D | Vertex = new Position4D(),
        normal?: Direction4D,
        uv_coords?: Position3D,
        color?: Color3D
    ) : Vertex {
        if (position instanceof Vertex) {
            this.position.setTo(position.position);
            this.normal.setTo(position.normal);
            this.uv_coords.setTo(position.uv_coords);
            this.color.setTo(position.color);
        } else if (position instanceof Position4D) {
            this.position.setTo(position);

            if (normal instanceof Direction4D)
                this.normal.setTo(normal);

            if (uv_coords instanceof Position3D)
                this.uv_coords.setTo(uv_coords);

            if (color instanceof Color3D)
                this.color.setTo(color);
        } else
            throw `Invalid input (position/vertex): ${position}`;

        return this;
    }
}