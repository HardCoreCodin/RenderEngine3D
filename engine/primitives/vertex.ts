import {Vector3DValues, Vector4DValues} from "../types.js";
import {defaultVector4DAllocator, dir4D, Direction4D, pos4D, Position4D, RGBA, rgba} from "../math/vec4.js";
import {defaultVector3DAllocator, uvw, UVW} from "../math/vec3.js";
import {IAllocatorSizes, Vector3DAllocator, Vector4DAllocator} from "../allocators.js";
import {ATTRIBUTE} from "../constants.js";

export default class Vertex {
    static SIZE = (include: ATTRIBUTE) : IAllocatorSizes => ({
        vec4D: 1 + (
            include & ATTRIBUTE.normal ? 1 : 0
        ) + (
            include & ATTRIBUTE.color ? 1 : 0
        ),
        vec3D: include & ATTRIBUTE.uv ? 1 : 0
    });

    constructor(
        public position: Position4D,
        public normal?: Direction4D,
        public color?: RGBA,
        public uvs?: UVW
    ) {}

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
            out.normal.normalize();
        }

        return out;
    }

    setFromOther(other: Vertex) : Vertex {
        this.position.setFromOther(other.position);
        this.normal!.setFromOther(other.normal);
        this.uvs!.setFromOther(other.uvs);
        this.color!.setFromOther(other.color);

        return this;
    }

    setTo(
        position: Position4D,
        normal?: Direction4D,
        uv_coords?: UVW,
        color?: RGBA
    ) : Vertex {
        this.position.setFromOther(position);
        this.normal!.setFromOther(normal);
        this.uvs!.setFromOther(uv_coords);
        this.color!.setFromOther(color);

        return this;
    }
}

export class VertexView extends Vertex {
    static SIZE = (include: ATTRIBUTE) : IAllocatorSizes => ({});

    constructor(
        private readonly position_attribute
    ) {
        super(
            new Position4D()
        )
    }
}

export const vert = (
    include: ATTRIBUTE = ATTRIBUTE.position,
    vector4D_allocator: Vector4DAllocator = defaultVector4DAllocator,
    vector3D_allocator: Vector3DAllocator = defaultVector3DAllocator
) : Vertex => new Vertex(
    pos4D(vector4D_allocator),
    include & ATTRIBUTE.normal ? dir4D(vector4D_allocator) : undefined,
    include & ATTRIBUTE.color ? rgba(vector4D_allocator) : undefined,
    include & ATTRIBUTE.uv ? uvw(vector3D_allocator) : undefined
);