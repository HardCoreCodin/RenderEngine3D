import {Vector2DValues, Vector3DValues, Vector4DValues} from "../types.js";
import {Position3D, Direction3D, Color3D, UV3D} from "../math/vec3.js";
import {Position4D, Direction4D, Color4D} from "../math/vec4.js";
import {UV2D} from "../math/vec2.js";

export default class Vertex {
    constructor(
        public position: Position3D | Position4D,
        public normal: Direction3D,
        public uvs: UV2D | UV3D = null,
        public color: Color3D | Color4D = null
    ) {}

    static fromBuffers(
        positions: Vector3DValues | Vector4DValues,
        normals?: Vector3DValues | Vector4DValues,
        uvs?: Vector2DValues | Vector3DValues,
        colors?: Vector3DValues | Vector4DValues
    ) : Vertex {
        return new Vertex(
            positions.length === 3 ?
                new Position3D(positions) :
                new Position4D(positions),
            normals ?
                normals.length === 3 ?
                    new Direction3D(normals) :
                    new Direction4D(normals)
                : null,
            uvs ?
                uvs.length === 3 ?
                    new UV3D(uvs) :
                    new UV2D(uvs)
                : null,
            colors ?
                colors.length === 3 ?
                    new Direction3D(colors) :
                    new Direction4D(colors)
                : null
        );
    };

    copy = (
        new_vertex: Vertex = new Vertex()
    ) : Vertex => new_vertex.setTo(this);

    lerp(
        to: Vertex,
        by: number,
        out: Vertex
    ) : Vertex {
        this.position.lerp(to.position, by, out.position);
        if (this.uvs) this.uvs.lerp(to.uvs, by, out.uvs);
        if (this.color) this.color.lerp(to.color, by, out.color);
        if (this.normal) {
            this.normal.lerp(to.normal, by, out.normal);
            this.normal.normalize();
        }

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