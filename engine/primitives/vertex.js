export class Vertex {
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
    get includes() {
        let includes = ATTRIBUTE.position;
        if (this.normal)
            includes |= ATTRIBUTE.normal;
        if (this.color)
            includes |= ATTRIBUTE.normal;
        if (this.uvs)
            includes |= ATTRIBUTE.normal;
        return includes;
    }
}
export class Vertex3D extends Vertex {
}
Vertex3D.SIZE = (include) => ({
    vec3D: 1 + (include & ATTRIBUTE.normal ? 1 : 0) + (include & ATTRIBUTE.color ? 1 : 0),
    vec2D: include & ATTRIBUTE.uv ? 1 : 0
});
export class Vertex4D extends Vertex {
}
Vertex4D.SIZE = (include) => ({
    vec4D: 1 + (include & ATTRIBUTE.normal ? 1 : 0) + (include & ATTRIBUTE.color ? 1 : 0),
    vec3D: include & ATTRIBUTE.uv ? 1 : 0
});
export class VertexView extends Vertex {
    constructor(vertex, num = 0) {
        super(vertex.positions.current[num], vertex.normals ? vertex.normals.current[num] : undefined, vertex.colors ? vertex.colors.current[num] : undefined, vertex.uvs ? vertex.uvs.current[num] : undefined);
        this.vertex = vertex;
        this.num = num;
    }
}
export class Vertex3DView extends VertexView {
}
export class Vertex4DView extends VertexView {
}
export const vert3 = (include = ATTRIBUTE.position, vector3D_allocator = defaultVector3DAllocator, vector2D_allocator = defaultVector2DAllocator) => new Vertex3D(pos3D(vector3D_allocator), include & ATTRIBUTE.normal ? dir3D(vector3D_allocator) : undefined, include & ATTRIBUTE.color ? rgb(vector3D_allocator) : undefined, include & ATTRIBUTE.uv ? uv(vector2D_allocator) : undefined);
export const vert4 = (include = ATTRIBUTE.position, vector4D_allocator = defaultVector4DAllocator, vector3D_allocator = defaultVector3DAllocator) => new Vertex4D(pos4D(vector4D_allocator), include & ATTRIBUTE.normal ? dir4D(vector4D_allocator) : undefined, include & ATTRIBUTE.color ? rgba(vector4D_allocator) : undefined, include & ATTRIBUTE.uv ? uvw(vector3D_allocator) : undefined);
//# sourceMappingURL=vertex.js.map