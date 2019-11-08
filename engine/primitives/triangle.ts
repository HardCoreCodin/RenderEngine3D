import {vert3, vert4, Vertex, Vertex3D, Vertex3DView, Vertex4D, Vertex4DView, VertexView} from "./vertex.js";
import Matrix3x3 from "../math/mat3x3.js";
import Matrix4x4 from "../math/mat4x4.js";
import {UV} from "../math/vec2.js";
import {Position3D, Direction3D, RGB, pos3D, dir3D, rgb, UVW, Base3D} from "../math/vec3.js";
import {Position4D, Direction4D, RGBA, pos4D, dir4D, rgba, Base4D} from "../math/vec4.js";
import {AllocatorSizes, Vector2DAllocator, Vector3DAllocator, Vector4DAllocator} from "../allocators.js";
import {IBaseRotationMatrix, IColor, IDirection, IPosition, IUV} from "../math/interfaces.js";
import {ATTRIBUTE} from "../constants.js";
import {Faces3D, Faces4D, Vertices3D, Vertices4D} from "./attribute.js";

export class Triangle<
        Matrix extends IBaseRotationMatrix,
        Position extends IPosition,
        Direction extends IDirection,
        Color extends IColor,
        Uv extends IUV,
        VertexType extends Vertex<Position, Direction, Color, Uv> = Vertex<Position, Direction, Color, Uv>
    > {

    constructor(
        public readonly v1: VertexType,
        public readonly v2: VertexType,
        public readonly v3: VertexType,

        public readonly normal?: Direction,
        public readonly color?: Color,
        public readonly position?: Position,

        private vertices = [v1, v2, v3]
    ) {}

    transformedBy = (
        matrix: Matrix,
        new_triangle: this
    ) : typeof new_triangle => new_triangle.setFromOther(this).transformTo(matrix);

    transformTo(matrix: Matrix) : this {
        this.v1.position.mul(matrix);
        this.v2.position.mul(matrix);
        this.v3.position.mul(matrix);

        return this;
    }

    sendToNearClippingPlane = (
        from_index: number,
        to_index: number,
        near: number = 0
    ) : void => {
        const from = this.vertices[from_index];
        const from_z = (from.position as (Position & (Base4D | Base3D))).z;

        if (from_z === near)
            return;

        const to = this.vertices[to_index];
        const to_z = (to.position as (Position & (Base4D | Base3D))).z;

        const distance = from_z - to_z;
        if (distance) {
            const by = (from_z - near) / distance;
            if (by === 1)
                from.setFromOther(to);
            else
                from.lerp(to, by, to);
        }
    };

    clipToNearClippingPlane(near: number, extra_triangle: this) : number {
        const v0_is_outside = (this.v1.position as (Position & (Base4D | Base3D))).z < near;
        const v1_is_outside = (this.v2.position as (Position & (Base4D | Base3D))).z < near;
        const v2_is_outside = (this.v3.position as (Position & (Base4D | Base3D))).z < near;

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

            if (this.color) {
                this.color.r = 1;
                this.color.g = 0;
                this.color.b = 0;
            }

            return 1; // A single (smaller)triangle
        } else {
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

    setTo(
        p0: Position,
        p1?: Position,
        p2?: Position,

        uv0?: Uv,
        uv1?: Uv,
        uv2?: Uv,

        normal?: Direction,
        color?: Color,
        position?: Position,
    ) : this {
        this.v1.position.setFromOther(p0);
        if (p1) this.v2.position.setFromOther(p1);
        if (p2) this.v3.position.setFromOther(p2);
        if (uv0) this.v1.uvs.setFromOther(uv0);
        if (uv1) this.v2.uvs.setFromOther(uv1);
        if (uv2) this.v3.uvs.setFromOther(uv2);

        if (normal && this.normal) this.normal.setFromOther(normal);
        if (color && this.color) this.color.setFromOther(color);
        if (position && this.position) this.position.setFromOther(position);

        return this;
    }

    setFromOther(triangle: this) : this {
        this.v1.position.setFromOther(triangle.v1.position);
        this.v2.position.setFromOther(triangle.v2.position);
        this.v3.position.setFromOther(triangle.v3.position);

        this.v1.uvs.setFromOther(triangle.v1.uvs);
        this.v2.uvs.setFromOther(triangle.v2.uvs);
        this.v3.uvs.setFromOther(triangle.v3.uvs);

        if (triangle.normal && this.normal) this.normal.setFromOther(triangle.normal);
        if (triangle.color && this.color) this.color.setFromOther(triangle.color);
        if (triangle.position && this.position) this.position.setFromOther(triangle.position);

        return this;
    }
}

export class Triangle3D<
    VertexType extends Vertex<Position3D, Direction3D, RGB, UV> = Vertex3D
    > extends Triangle<Matrix3x3, Position3D, Direction3D, RGB, UV, VertexType> {
    static SIZE = (
        include_vertex_attributes: ATTRIBUTE = ATTRIBUTE.position,
        include_face_attributes: ATTRIBUTE = ATTRIBUTE.normal,
    ): AllocatorSizes => new AllocatorSizes(Vertex4D.SIZE(include_vertex_attributes)).times(3).add({
        vec3D: (
            include_face_attributes & ATTRIBUTE.position ? 1 : 0
        ) + (
            include_face_attributes & ATTRIBUTE.normal ? 1 : 0
        ) + (
            include_face_attributes & ATTRIBUTE.color ? 1 : 0
        )
    });
}

export default class Triangle4D<
    VertexType extends Vertex<Position4D, Direction4D, RGBA, UVW> = Vertex4D
    > extends Triangle<Matrix4x4, Position4D, Direction4D, RGBA, UVW, VertexType> {
    static SIZE = (
        include_vertex_attributes: ATTRIBUTE = ATTRIBUTE.position,
        include_face_attributes: ATTRIBUTE = ATTRIBUTE.normal,
    ) : AllocatorSizes => new AllocatorSizes(Vertex4D.SIZE(include_vertex_attributes)).times(3).add({
        vec4D: (
            include_face_attributes & ATTRIBUTE.position ? 1 : 0
        ) + (
            include_face_attributes & ATTRIBUTE.normal ? 1 : 0
        ) + (
            include_face_attributes & ATTRIBUTE.color ? 1 : 0
        )
    });

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

    asNDC = (new_triangle: Triangle4D) : Triangle4D => new_triangle.setFromOther(this).toNDC();
    toNDC = () : Triangle4D => {
        this.v1.position.toNDC();
        this.v2.position.toNDC();
        this.v3.position.toNDC();

        return this;
    };
}


export class Triangle3DView extends Triangle3D<Vertex3DView> {

    constructor(
        private readonly vertex: Vertices3D,
        private readonly face: Faces3D
    ) {
        super(
            new Vertex3DView(vertex, 0),
            new Vertex3DView(vertex, 1),
            new Vertex3DView(vertex, 2),

            face.normals ? face.normals.current : undefined,
            face.colors ? face.colors.current : undefined,
            face.positions ? face.positions.current : undefined
        )
    }

    at(face_id: number) : this {
        const shared_v1_id = this.face.vertices.indices[0][face_id];
        const shared_v2_id = this.face.vertices.indices[1][face_id];
        const shared_v3_id = this.face.vertices.indices[2][face_id];

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
            this.normal.id = face_id;

        if (this.color)
            this.color.id = face_id;

        if (this.position)
            this.position.id = face_id;

        return this;
    }
}

export class Triangle34View extends Triangle4D<Vertex4DView> {

    constructor(
        private readonly vertex: Vertices4D,
        private readonly face: Faces4D
    ) {
        super(
            new Vertex4DView(vertex, 0),
            new Vertex4DView(vertex, 1),
            new Vertex4DView(vertex, 2),

            face.normals ? face.normals.current : undefined,
            face.colors ? face.colors.current : undefined,
            face.positions ? face.positions.current : undefined
        )
    }

    at(face_id: number) : this {
        const shared_v1_id = this.face.vertices.indices[0][face_id];
        const shared_v2_id = this.face.vertices.indices[1][face_id];
        const shared_v3_id = this.face.vertices.indices[2][face_id];

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
            this.normal.id = face_id;

        if (this.color)
            this.color.id = face_id;

        if (this.position)
            this.position.id = face_id;

        return this;
    }
}

export const tri3 = (
    vector3D_allocator: Vector3DAllocator,
    vector2D_allocator: Vector2DAllocator,
    include_vertex_attributes: ATTRIBUTE = ATTRIBUTE.position,
    include_face_attributes: ATTRIBUTE = ATTRIBUTE.normal,
) : Triangle3D => new Triangle3D(
    vert3(include_vertex_attributes, vector3D_allocator, vector2D_allocator),
    vert3(include_vertex_attributes, vector3D_allocator, vector2D_allocator),
    vert3(include_vertex_attributes, vector3D_allocator, vector2D_allocator),

    include_face_attributes & ATTRIBUTE.position ? dir3D(vector3D_allocator) : undefined,
    include_face_attributes & ATTRIBUTE.normal ? rgb(vector3D_allocator) : undefined,
    include_face_attributes & ATTRIBUTE.color ? pos3D(vector3D_allocator) : undefined,
);

export const tri4 = (
    vector4D_allocator: Vector4DAllocator,
    vector3D_allocator: Vector3DAllocator,
    include_vertex_attributes: ATTRIBUTE = ATTRIBUTE.position,
    include_face_attributes: ATTRIBUTE = ATTRIBUTE.normal,
) : Triangle4D => new Triangle4D(
    vert4(include_vertex_attributes, vector4D_allocator, vector3D_allocator),
    vert4(include_vertex_attributes, vector4D_allocator, vector3D_allocator),
    vert4(include_vertex_attributes, vector4D_allocator, vector3D_allocator),

    include_face_attributes & ATTRIBUTE.position ? dir4D(vector4D_allocator) : undefined,
    include_face_attributes & ATTRIBUTE.normal ? rgba(vector4D_allocator) : undefined,
    include_face_attributes & ATTRIBUTE.color ? pos4D(vector4D_allocator) : undefined,
);