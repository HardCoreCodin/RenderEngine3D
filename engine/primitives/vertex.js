import { defaultVector4DAllocator, dir4D, pos4D, rgba } from "../math/vec4.js";
import { defaultVector3DAllocator, uvw } from "../math/vec3.js";
class AbstractVertex {
    constructor(position, normal, color, uvs) {
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.uvs = uvs;
    }
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
AbstractVertex.SIZE = (include) => ;
export class Vertex4D extends AbstractVertex {
}
Vertex4D.SIZE = (include) => ({
    vec4D: 1 + (include & 2 /* normal */ ? 1 : 0) + (include & 4 /* color */ ? 1 : 0),
    vec3D: include & 8 /* uv */ ? 1 : 0
});
export class Vertex4DView extends Vertex4D {
    constructor(vertices, face_vertex_num = 0) {
        super(vertices.positions.current);
        this.vertices = vertices;
        this.face_vertex_num = face_vertex_num;
    }
}
Vertex4DView.SIZE = (include) => ({});
export const vert = (include = 1 /* position */, vector4D_allocator = defaultVector4DAllocator, vector3D_allocator = defaultVector3DAllocator) => new Vertex(pos4D(vector4D_allocator), include & 2 /* normal */ ? dir4D(vector4D_allocator) : undefined, include & 4 /* color */ ? rgba(vector4D_allocator) : undefined, include & 8 /* uv */ ? uvw(vector3D_allocator) : undefined);
//# sourceMappingURL=vertex.js.map