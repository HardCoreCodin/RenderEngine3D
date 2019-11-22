import { vert3, vert4, Vertex3DView, Vertex4D, Vertex4DView } from "./vertex.js";
import { pos3D, dir3D, rgb } from "../math/vec3.js";
import { pos4D, dir4D, rgba } from "../math/vec4.js";
import { AllocatorSizes } from "../allocators.js";
export class Triangle {
    constructor(v1, v2, v3, normal, color, position, vertices = [v1, v2, v3]) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.normal = normal;
        this.color = color;
        this.position = position;
        this.vertices = vertices;
        this.transformedBy = (matrix, new_triangle) => new_triangle.setFromOther(this).transformTo(matrix);
        this.sendToNearClippingPlane = (from_index, to_index, near = 0) => {
            const from = this.vertices[from_index];
            const from_z = from.position.z;
            if (from_z === near)
                return;
            const to = this.vertices[to_index];
            const to_z = to.position.z;
            const distance = from_z - to_z;
            if (distance) {
                const by = (from_z - near) / distance;
                if (by === 1)
                    from.setFromOther(to);
                else
                    from.lerp(to, by, to);
            }
        };
    }
    transformTo(matrix) {
        this.v1.position.mul(matrix);
        this.v2.position.mul(matrix);
        this.v3.position.mul(matrix);
        return this;
    }
    clipToNearClippingPlane(near, extra_triangle) {
        const v0_is_outside = this.v1.position.z < near;
        const v1_is_outside = this.v2.position.z < near;
        const v2_is_outside = this.v3.position.z < near;
        // Early return if the triangle is fully outside/inside the frustum
        if (v0_is_outside && v1_is_outside && v2_is_outside)
            return 0;
        if (!v0_is_outside && !v1_is_outside && !v2_is_outside)
            return 1;
        let i1; // An index of the first vertex inside the frustum
        let i2; // An index of the second vertex inside the frustum
        let o1; // An index of the first vertex outside the frustum
        let o2; // An index of the second vertex outside the frustum
        if (v0_is_outside) {
            o1 = 0;
            if (v1_is_outside) {
                o2 = 1;
                i1 = 2;
            }
            else {
                i1 = 1;
                if (v2_is_outside)
                    o2 = 2;
                else
                    i2 = 2;
            }
        }
        else {
            i1 = 0;
            if (v1_is_outside) {
                o1 = 1;
                if (v2_is_outside)
                    o2 = 2;
                else
                    i2 = 2;
            }
            else {
                i2 = 1;
                o1 = 2;
            }
        }
        // Break the input triangle into smaller output triangle(s).
        // There are 2 possible cases left (when not returning early above):
        if (i2 === undefined) {
            // Only one vertex is inside the frustum.
            // The triangle just needs to get smaller.
            // The two new vertices need to be on the near clipping plane:
            this.sendToNearClippingPlane(i1, o1, near);
            this.sendToNearClippingPlane(i1, o2, near);
            if (this.color) {
                this.color.r = 1;
                this.color.g = 0;
                this.color.b = 0;
            }
            return 1; // A single (smaller)triangle
        }
        else {
            extra_triangle.setFromOther(this);
            // Two vertices are inside the frustum.
            // Clipping forms a quad which needs to be split into 2 triangles.
            // The first is the original (only smaller, as above).
            this.sendToNearClippingPlane(i1, o1, near);
            if (this.color) {
                this.color.r = 0;
                this.color.g = 1;
                this.color.b = 0;
            }
            // The second is a new extra triangle, sharing 2 vertices
            extra_triangle.vertices[i1].setFromOther(this.vertices[o1]);
            extra_triangle.sendToNearClippingPlane(i2, o1, near);
            return 2; // Two adjacent triangles
        }
    }
    setTo(p0, p1, p2, uv0, uv1, uv2, normal, color, position) {
        this.v1.position.setFromOther(p0);
        if (p1)
            this.v2.position.setFromOther(p1);
        if (p2)
            this.v3.position.setFromOther(p2);
        if (uv0)
            this.v1.uvs.setFromOther(uv0);
        if (uv1)
            this.v2.uvs.setFromOther(uv1);
        if (uv2)
            this.v3.uvs.setFromOther(uv2);
        if (normal && this.normal)
            this.normal.setFromOther(normal);
        if (color && this.color)
            this.color.setFromOther(color);
        if (position && this.position)
            this.position.setFromOther(position);
        return this;
    }
    setFromOther(triangle) {
        this.v1.position.setFromOther(triangle.v1.position);
        this.v2.position.setFromOther(triangle.v2.position);
        this.v3.position.setFromOther(triangle.v3.position);
        this.v1.uvs.setFromOther(triangle.v1.uvs);
        this.v2.uvs.setFromOther(triangle.v2.uvs);
        this.v3.uvs.setFromOther(triangle.v3.uvs);
        if (triangle.normal && this.normal)
            this.normal.setFromOther(triangle.normal);
        if (triangle.color && this.color)
            this.color.setFromOther(triangle.color);
        if (triangle.position && this.position)
            this.position.setFromOther(triangle.position);
        return this;
    }
}
export class Triangle3D extends Triangle {
}
Triangle3D.SIZE = (include_vertex_attributes = 1 /* position */, include_face_attributes = 2 /* normal */) => new AllocatorSizes(Vertex4D.SIZE(include_vertex_attributes)).times(3).add({
    vec3D: (include_face_attributes & 1 /* position */ ? 1 : 0) + (include_face_attributes & 2 /* normal */ ? 1 : 0) + (include_face_attributes & 4 /* color */ ? 1 : 0)
});
export default class Triangle4D extends Triangle {
    constructor() {
        super(...arguments);
        this.asNDC = (new_triangle) => new_triangle.setFromOther(this).toNDC();
        this.toNDC = () => {
            this.v1.position.toNDC();
            this.v2.position.toNDC();
            this.v3.position.toNDC();
            return this;
        };
    }
    isInView(near = 0, far = 1) {
        return (this.v1.position.isInView(near, far) &&
            this.v2.position.isInView(near, far) &&
            this.v3.position.isInView(near, far));
    }
    isOutOfView(near = 0, far = 1) {
        return (this.v1.position.isOutOfView(near, far) &&
            this.v2.position.isOutOfView(near, far) &&
            this.v3.position.isOutOfView(near, far));
    }
}
Triangle4D.SIZE = (include_vertex_attributes = 1 /* position */, include_face_attributes = 2 /* normal */) => new AllocatorSizes(Vertex4D.SIZE(include_vertex_attributes)).times(3).add({
    vec4D: (include_face_attributes & 1 /* position */ ? 1 : 0) + (include_face_attributes & 2 /* normal */ ? 1 : 0) + (include_face_attributes & 4 /* color */ ? 1 : 0)
});
export class Triangle3DView extends Triangle3D {
    constructor(vertex, face) {
        super(new Vertex3DView(vertex, 0), new Vertex3DView(vertex, 1), new Vertex3DView(vertex, 2), face.normals ? face.normals.current : undefined, face.colors ? face.colors.current : undefined, face.positions ? face.positions.current : undefined);
        this.vertex = vertex;
        this.face = face;
    }
    at(face_id) {
        const shared_v1_id = this.face.vertices.index_arrays[0][face_id];
        const shared_v2_id = this.face.vertices.index_arrays[1][face_id];
        const shared_v3_id = this.face.vertices.index_arrays[2][face_id];
        if (this.vertex.positions.is_shared)
            this.vertex.positions.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
        else
            this.vertex.positions.setCurrent(face_id);
        if (this.vertex.normals) {
            if (this.vertex.normals.is_shared)
                this.vertex.normals.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
            else
                this.vertex.normals.setCurrent(face_id);
        }
        if (this.vertex.colors) {
            if (this.vertex.colors.is_shared)
                this.vertex.colors.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
            else
                this.vertex.colors.setCurrent(face_id);
        }
        if (this.vertex.uvs) {
            if (this.vertex.uvs.is_shared)
                this.vertex.uvs.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
            else
                this.vertex.uvs.setCurrent(face_id);
        }
        if (this.normal)
            this.normal.attribute_type = face_id;
        if (this.color)
            this.color.attribute_type = face_id;
        if (this.position)
            this.position.attribute_type = face_id;
        return this;
    }
}
export class Triangle4DView extends Triangle4D {
    constructor(vertex, face) {
        super(new Vertex4DView(vertex, 0), new Vertex4DView(vertex, 1), new Vertex4DView(vertex, 2), face.normals ? face.normals.current : undefined, face.colors ? face.colors.current : undefined, face.positions ? face.positions.current : undefined);
        this.vertex = vertex;
        this.face = face;
    }
    at(face_id) {
        const shared_v1_id = this.face.vertices.index_arrays[0][face_id];
        const shared_v2_id = this.face.vertices.index_arrays[1][face_id];
        const shared_v3_id = this.face.vertices.index_arrays[2][face_id];
        if (this.vertex.positions.is_shared)
            this.vertex.positions.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
        else
            this.vertex.positions.setCurrent(face_id);
        if (this.vertex.normals) {
            if (this.vertex.normals.is_shared)
                this.vertex.normals.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
            else
                this.vertex.normals.setCurrent(face_id);
        }
        if (this.vertex.colors) {
            if (this.vertex.colors.is_shared)
                this.vertex.colors.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
            else
                this.vertex.colors.setCurrent(face_id);
        }
        if (this.vertex.uvs) {
            if (this.vertex.uvs.is_shared)
                this.vertex.uvs.setCurrent(shared_v1_id, shared_v2_id, shared_v3_id);
            else
                this.vertex.uvs.setCurrent(face_id);
        }
        if (this.normal)
            this.normal.attribute_type = face_id;
        if (this.color)
            this.color.attribute_type = face_id;
        if (this.position)
            this.position.attribute_type = face_id;
        return this;
    }
}
export const tri3 = (vector3D_allocator, vector2D_allocator, include_vertex_attributes = 1 /* position */, include_face_attributes = 2 /* normal */) => new Triangle3D(vert3(include_vertex_attributes, vector3D_allocator, vector2D_allocator), vert3(include_vertex_attributes, vector3D_allocator, vector2D_allocator), vert3(include_vertex_attributes, vector3D_allocator, vector2D_allocator), include_face_attributes & 1 /* position */ ? dir3D(vector3D_allocator) : undefined, include_face_attributes & 2 /* normal */ ? rgb(vector3D_allocator) : undefined, include_face_attributes & 4 /* color */ ? pos3D(vector3D_allocator) : undefined);
export const tri4 = (vector4D_allocator, vector3D_allocator, include_vertex_attributes = 1 /* position */, include_face_attributes = 2 /* normal */) => new Triangle4D(vert4(include_vertex_attributes, vector4D_allocator, vector3D_allocator), vert4(include_vertex_attributes, vector4D_allocator, vector3D_allocator), vert4(include_vertex_attributes, vector4D_allocator, vector3D_allocator), include_face_attributes & 1 /* position */ ? dir4D(vector4D_allocator) : undefined, include_face_attributes & 2 /* normal */ ? rgba(vector4D_allocator) : undefined, include_face_attributes & 4 /* color */ ? pos4D(vector4D_allocator) : undefined);
//# sourceMappingURL=triangle.js.map