import {Position3D, Direction3D, Color3D} from "../math/vec3.js";
import {Position4D, Direction4D, Color4D} from "../math/vec4.js";

export default class Vertex {
    constructor(
        public position: Position3D | Position4D,
        public normal?: Direction3D | Direction4D,
        public uvs?: Position3D,
        public color?: Color3D | Color4D
    ) {}

    static fromBuffers(

    ) : this {
        return new Vertex()
    };

    copy = (
        new_vertex: Vertex = new Vertex()
    ) : Vertex => new_vertex.setTo(this);

    toNDC() : void {
        const w = this.position.buffer[3];
        if (w !== 1) this.position.div(w);
    }

    isInView(near: number = 0, far: number = 1) : boolean {
        const [x, y, z, w] = this.position.buffer;
        return (
            near <= z && z <= far &&
            -w <= y && y <= w &&
            -w <= x && x <= w
        );
    }

    isOutOfView(near: number = 0, far: number = 1) : boolean {
        const [x, y, z, w] = this.position.buffer;
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
        this.uvs.lerp(to.uvs, by, out.uvs);
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
            this.uvs.setTo(position.uvs);
            this.color.setTo(position.color);
        } else if (position instanceof Position4D) {
            this.position.setTo(position);

            if (normal instanceof Direction4D)
                this.normal.setTo(normal);

            if (uv_coords instanceof Position3D)
                this.uvs.setTo(uv_coords);

            if (color instanceof Color3D)
                this.color.setTo(color);
        } else
            throw `Invalid input (position/vertex): ${position}`;

        return this;
    }
}