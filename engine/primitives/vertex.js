import { defaultVector4DAllocator, dir4D, Direction4D, pos4D, Position4D, RGBA, rgba } from "../math/vec4.js";
import { defaultVector3DAllocator, uvw, UVW } from "../math/vec3.js";
export default class Vertex {
    constructor(position, normal, color, uvs) {
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.uvs = uvs;
    }
    static fromBuffers(positions, position_id, normals, normal_id, uvs, uv_id, colors, color_id) {
        return new Vertex(new Position4D(positions, position_id), normals ? new Direction4D(normals, normal_id) : undefined, colors ? new RGBA(colors, color_id) : undefined, uvs ? new UVW(uvs, uv_id) : undefined);
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
            out.normal.normalize();
        }
        return out;
    }
    setFromOther(other) {
        this.position.setFromOther(other.position);
        this.normal.setFromOther(other.normal);
        this.uvs.setFromOther(other.uvs);
        this.color.setFromOther(other.color);
        return this;
    }
    setTo(position, normal, uv_coords, color) {
        this.position.setFromOther(position);
        this.normal.setFromOther(normal);
        this.uvs.setFromOther(uv_coords);
        this.color.setFromOther(color);
        return this;
    }
}
export const vert = (include = 1 /* position */, vector4D_allocator = defaultVector4DAllocator, vector3D_allocator = defaultVector3DAllocator) => new Vertex(pos4D(vector4D_allocator), include & 2 /* normal */ ? dir4D(vector4D_allocator) : undefined, include & 4 /* color */ ? rgba(vector4D_allocator) : undefined, include & 8 /* uv */ ? uvw(vector3D_allocator) : undefined);
//# sourceMappingURL=vertex.js.map