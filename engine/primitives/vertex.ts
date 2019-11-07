import {defaultVector4DAllocator, dir4D, Direction4D, pos4D, Position4D, RGBA, rgba} from "../math/vec4.js";
import {defaultVector3DAllocator, uvw, UVW} from "../math/vec3.js";
import {IAllocatorSizes, Vector3DAllocator, Vector4DAllocator} from "../allocators.js";
import {ATTRIBUTE} from "../constants.js";
import {Vertices3D, Vertices4D} from "./attribute.js";
import {IBaseColor, IDirection, IPosition, IUV, IVector} from "../math/interfaces.js";

abstract class AbstractVertex<
    Position extends IVector & IPosition,
    Direction extends IVector & IDirection,
    Color extends IVector & IBaseColor,
    Uv extends IVector & IUV
    > {
    abstract static SIZE = (include: ATTRIBUTE) : IAllocatorSizes;

    constructor(
        public position: Position,
        public normal?: Direction,
        public color?: Color,
        public uvs?: Uv
    ) {}

    lerp(
        to: Vertex4D,
        by: number,
        out: Vertex4D
    ) : Vertex4D {
        this.position.lerp(to.position, by, out.position);
        if (this.uvs) this.uvs.lerp(to.uvs, by, out.uvs);
        if (this.color) this.color.lerp(to.color, by, out.color);
        if (this.normal) {
            this.normal.lerp(to.normal, by, out.normal);
            out.normal.normalize();
        }

        return out;
    }

    setFromOther(other: Vertex4D) : Vertex4D {
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
    ) : Vertex4D {
        this.position.setFromOther(position);
        this.normal!.setFromOther(normal);
        this.uvs!.setFromOther(uv_coords);
        this.color!.setFromOther(color);

        return this;
    }
}

export class Vertex4D extends AbstractVertex<Position4D, Direction4D, RGBA, UVW> {
    static SIZE = (include: ATTRIBUTE) : IAllocatorSizes => ({
        vec4D: 1 + (
            include & ATTRIBUTE.normal ? 1 : 0
        ) + (
            include & ATTRIBUTE.color ? 1 : 0
        ),
        vec3D: include & ATTRIBUTE.uv ? 1 : 0
    });
}

export class Vertex4DView extends Vertex4D {
    static SIZE = (include: ATTRIBUTE) : IAllocatorSizes => ({});

    constructor(
        private readonly vertices: Vertices,
        public face_vertex_num: number = 0
    ) {
        super(
            vertices.positions.current
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