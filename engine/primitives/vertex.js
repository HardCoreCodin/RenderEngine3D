import { Position3D, Direction3D, Color3D, UV3D } from "../math/vec3.js";
import { Position4D, Direction4D } from "../math/vec4.js";
import { UV2D } from "../math/vec2.js";
export default class Vertex {
    constructor(position, normal, uvs = null, color = null) {
        this.position = position;
        this.normal = normal;
        this.uvs = uvs;
        this.color = color;
        this.copy = (new_vertex = new Vertex()) => new_vertex.setTo(this);
    }
    static fromBuffers(positions, normals, uvs, colors) {
        return new Vertex(positions.length === 3 ?
            new Position3D(positions) :
            new Position4D(positions), normals ?
            normals.length === 3 ?
                new Direction3D(normals) :
                new Direction4D(normals)
            : null, uvs ?
            uvs.length === 3 ?
                new UV3D(uvs) :
                new UV2D(uvs)
            : null, colors ?
            colors.length === 3 ?
                new Direction3D(colors) :
                new Direction4D(colors)
            : null);
    }
    ;
    lerp(to, by, out) {
        this.position.lerp(to.position, by, out.position);
        if (this.uvs)
            this.uvs.lerp(to.uvs, by, out.uvs);
        if (this.color)
            this.color.lerp(to.color, by, out.color);
        if (this.normal) {
            this.normal.lerp(to.normal, by, out.normal);
            this.normal.normalize();
        }
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