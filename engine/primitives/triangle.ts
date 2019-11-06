import {Matrix4x4} from "../math/mat4x4.js";
import {defaultVector3DAllocator, Position3D} from "../math/vec3.js";
import {Position4D, Direction4D, RGBA, pos4D, dir4D, rgba, defaultVector4DAllocator} from "../math/vec4.js";
import Vertex, {vert} from "./vertex.js";
import {float4} from "../factories.js";
import {Vector3DAllocator, Vector4DAllocator} from "../allocators.js";
import {ATTRIBUTE} from "../constants.js";
import {Mesh} from "./mesh.js";

export default class Triangle {
    constructor(
        public v1: Vertex,
        public v2: Vertex,
        public v3: Vertex,

        public normal?: Direction4D,
        public color?: RGBA,
        public position?: Position4D,

        private vertices = [v1, v2, v3]
    ) {}

    isInView(
        near: number = 0,
        far: number = 1
    ) : boolean {
        return (
            this.v1.position.isInView(near, far) &&
            this.v2.position.isInView(near, far) &&
            this.v3.position.isInView(near, far)
        );
    }

    isOutOfView(
        near: number = 0,
        far: number = 1
    ) : boolean {
        return (
            this.v1.position.isOutOfView(near, far) &&
            this.v2.position.isOutOfView(near, far) &&
            this.v3.position.isOutOfView(near, far)
        );
    }

    asNDC = (new_triangle: Triangle) : Triangle => new_triangle.setFromOther(this).toNDC();
    toNDC = () : Triangle => {
        this.v1.position.toNDC();
        this.v2.position.toNDC();
        this.v3.position.toNDC();

        return this;
    };

    transformedBy = (
        matrix: Matrix4x4,
        new_triangle: Triangle
    ) : Triangle => new_triangle.setFromOther(this).transformTo(matrix);

    transformTo(matrix: Matrix4x4) : Triangle {
        this.v1.position.mul(matrix);
        this.v2.position.mul(matrix);
        this.v3.position.mul(matrix);

        return this;
    }

    // private static vertex_horizontal_compare = (
    //     v1: HVertex,
    //     v2: HVertex
    // ) : number => v2.position.y - v2.position.y;
    //
    // sort_vertices_vertically = () => this.vertices.sort(Triangle.vertex_horizontal_compare);

    sendToNearClippingPlane = (
        from_index: number,
        to_index: number,
        near: number = 0
    ) : void => {
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

    clipToNearClippingPlane(near: number, extra_triangle: Triangle) : number {
        const v0_is_outside = this.v1.position.z < near;
        const v1_is_outside = this.v2.position.z < near;
        const v2_is_outside = this.v3.position.z < near;

        // Early return if the triangle is fully outside/inside the frustum
        if (v0_is_outside && v1_is_outside && v2_is_outside) return 0;
        if (!v0_is_outside && !v1_is_outside && !v2_is_outside) return 1;

        let i1: number; // An index of the first vertex inside the frustum
        let i2: number; // An index of the second vertex inside the frustum
        let o1: number; // An index of the first vertex outside the frustum
        let o2: number; // An index of the second vertex outside the frustum

        if (v0_is_outside) {
            o1 = 0;
            if (v1_is_outside) {
                o2 = 1;
                i1 = 2;
            } else {
                i1 = 1;
                if (v2_is_outside)
                    o2 = 2;
                else
                    i2 = 2;
            }
        } else {
            i1 = 0;
            if (v1_is_outside) {
                o1 = 1;
                if (v2_is_outside)
                    o2 = 2;
                else
                    i2 = 2;
            } else {
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
        } else {
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

    setTo(
        p0: Position4D,
        p1?: Position4D,
        p2?: Position4D,

        uv0?: Position3D,
        uv1?: Position3D,
        uv2?: Position3D,

        color?: RGBA
    ) : Triangle {
        this.v1.position.setFromOther(p0);
        if (p1) this.v2.position.setFromOther(p1);
        if (p2) this.v3.position.setFromOther(p2);
        if (uv0) this.v1.uvs.setFromOther(uv0);
        if (uv1) this.v2.uvs.setFromOther(uv1);
        if (uv2) this.v3.uvs.setFromOther(uv2);

        if (color instanceof RGBA)
            this.color.setFromOther(color);

        return this;
    }

    setFromOther(triangle: this) : this {
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

export const tri = (
    include_vertex_attributes: ATTRIBUTE = ATTRIBUTE.position,
    include_face_attributes: ATTRIBUTE = ATTRIBUTE.normal,
    vector4D_allocator: Vector4DAllocator = defaultVector4DAllocator,
    vector3D_allocator: Vector3DAllocator = defaultVector3DAllocator
) : Triangle => new Triangle(
    vert(include_vertex_attributes, vector4D_allocator, vector3D_allocator),
    vert(include_vertex_attributes, vector4D_allocator, vector3D_allocator),
    vert(include_vertex_attributes, vector4D_allocator, vector3D_allocator),

    include_face_attributes & ATTRIBUTE.position ? dir4D(vector4D_allocator) : undefined,
    include_face_attributes & ATTRIBUTE.normal ? rgba(vector4D_allocator) : undefined,
    include_face_attributes & ATTRIBUTE.color ? pos4D(vector4D_allocator) : undefined,
);