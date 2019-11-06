import { defaultVector3DAllocator } from "../math/vec3.js";
import { RGBA, pos4D, dir4D, rgba, defaultVector4DAllocator } from "../math/vec4.js";
import { vert } from "./vertex.js";
import { float4 } from "../factories.js";
export default class Triangle {
    constructor(v1, v2, v3, normal, color, position, vertices = [v1, v2, v3]) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.normal = normal;
        this.color = color;
        this.position = position;
        this.vertices = vertices;
        this.asNDC = (new_triangle) => new_triangle.setFromOther(this).toNDC();
        this.toNDC = () => {
            this.v1.position.toNDC();
            this.v2.position.toNDC();
            this.v3.position.toNDC();
            return this;
        };
        this.transformedBy = (matrix, new_triangle) => new_triangle.setFromOther(this).transformTo(matrix);
        // private static vertex_horizontal_compare = (
        //     v1: HVertex,
        //     v2: HVertex
        // ) : number => v2.position.y - v2.position.y;
        //
        // sort_vertices_vertically = () => this.vertices.sort(Triangle.vertex_horizontal_compare);
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
            this.color = red;
            return 1; // A single (smaller)triangle
        }
        else {
            extra_triangle.setFromOther(this);
            // Two vertices are inside the frustum.
            // Clipping forms a quad which needs to be split into 2 triangles.
            // The first is the original (only smaller, as above).
            this.sendToNearClippingPlane(i1, o1, near);
            this.color = green;
            // The second is a new extra triangle, sharing 2 vertices
            extra_triangle.vertices[i1].setFromOther(this.vertices[o1]);
            extra_triangle.sendToNearClippingPlane(i2, o1, near);
            return 2; // Two adjacent triangles
        }
    }
    setTo(p0, p1, p2, uv0, uv1, uv2, color) {
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
        if (color instanceof RGBA)
            this.color.setFromOther(color);
        return this;
    }
    setFromOther(triangle) {
        this.v1.position.setFromOther(triangle.v1.position);
        this.v2.position.setFromOther(triangle.v2.position);
        this.v3.position.setFromOther(triangle.v3.position);
        this.v1.uvs.setFromOther(triangle.v1.uvs);
        this.v2.uvs.setFromOther(triangle.v2.uvs);
        this.v3.uvs.setFromOther(triangle.v3.uvs);
        this.color.setFromOther(triangle.color);
        return this;
    }
}
// temp colors:
const temp = float4(2);
const red = new RGBA(temp);
const green = new RGBA(temp);
red.r = red.a = green.g = green.a = green.id = 1;
export const tri = (include_vertex_attributes = 1 /* position */, include_face_attributes = 2 /* normal */, vector4D_allocator = defaultVector4DAllocator, vector3D_allocator = defaultVector3DAllocator) => new Triangle(vert(include_vertex_attributes, vector4D_allocator, vector3D_allocator), vert(include_vertex_attributes, vector4D_allocator, vector3D_allocator), vert(include_vertex_attributes, vector4D_allocator, vector3D_allocator), include_face_attributes & 1 /* position */ ? dir4D(vector4D_allocator) : undefined, include_face_attributes & 2 /* normal */ ? rgba(vector4D_allocator) : undefined, include_face_attributes & 4 /* color */ ? pos4D(vector4D_allocator) : undefined);
//# sourceMappingURL=triangle.js.map