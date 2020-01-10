// export class Vertex<
//     Position extends IPosition,
//     Direction extends IDirection,
//     Color extends IColor,
//     Uv extends IUV
//     >
// {
//     constructor(
//         public readonly position: Position,
//         public readonly normal?: Direction,
//         public readonly color?: Color,
//         public readonly uvs?: Uv
//     ) {}
//
//     lerp(
//         to: this,
//         by: number,
//         out: this
//     ) : this {
//         this.position.lerp(to.position, by, out.position);
//         if (this.uvs) this.uvs.lerp(to.uvs, by, out.uvs);
//         if (this.color) this.color.lerp(to.color, by, out.color);
//         if (this.normal) {
//             this.normal.lerp(to.normal, by, out.normal);
//             out.normal.normalize();
//         }
//
//         return out;
//     }
//
//     setFromOther(other: this) : this {
//         this.position.setFromOther(other.position);
//         this.normal!.setFromOther(other.normal);
//         this.uvs!.setFromOther(other.uvs);
//         this.color!.setFromOther(other.color);
//
//         return this;
//     }
//
//     setTo(
//         position: Position,
//         normal?: Direction,
//         uv_coords?: Uv,
//         color?: Color
//     ) : this {
//         this.position.setFromOther(position);
//         this.normal!.setFromOther(normal);
//         this.uvs!.setFromOther(uv_coords);
//         this.color!.setFromOther(color);
//
//         return this;
//     }
//
//     get includes() : ATTRIBUTE {
//         let includes = ATTRIBUTE.position;
//         if (this.normal) includes |= ATTRIBUTE.normal;
//         if (this.color) includes |= ATTRIBUTE.normal;
//         if (this.uvs) includes |= ATTRIBUTE.normal;
//
//         return includes;
//     }
// }
//
// export class Vertex3D extends Vertex<Position3D, Direction3D, RGB, UV> {
//     static SIZE = (include: ATTRIBUTE) : IBufferSizes => ({
//         vec3D: 1 + (
//             include & ATTRIBUTE.normal ? 1 : 0
//         ) + (
//             include & ATTRIBUTE.color ? 1 : 0
//         ),
//         vec2D: include & ATTRIBUTE.uv ? 1 : 0
//     });
//
//     // copy(
//     //     vector3D_allocator: Vector3DAllocator = defaultVector3DAllocator,
//     //     vector2D_allocator: Vector2DAllocator = defaultVector2DAllocator
//     // ) {
//     //     return vert3(this.includes, vector3D_allocator, vector2D_allocator).setFromOther(this);
//     // }
// }
//
// export class Vertex4D extends Vertex<Position4D, Direction4D, RGBA, UVW> {
//     static SIZE = (include: ATTRIBUTE) : IBufferSizes => ({
//         vec4D: 1 + (
//             include & ATTRIBUTE.normal ? 1 : 0
//         ) + (
//             include & ATTRIBUTE.color ? 1 : 0
//         ),
//         vec3D: include & ATTRIBUTE.uv ? 1 : 0
//     });
//
//     // copy(
//     //     vector4D_allocator: Vector4DAllocator = defaultVector4DAllocator,
//     //     vector3D_allocator: Vector3DAllocator = defaultVector3DAllocator
//     // ) {
//     //     return vert4(this.includes, vector4D_allocator, vector3D_allocator).setFromOther(this);
//     // }
// }
//
// export class VertexView<
//     Position extends IPosition,
//     Direction extends IDirection,
//     Color extends IColor,
//     Uv extends IUV
//     > extends Vertex<Position, Direction, Color, Uv> {
//
//     constructor(
//         private readonly vertex: Vertices<Position, Direction, Color, Uv>,
//         public num: number = 0
//     ) {
//         super(
//             vertex.positions.current[num],
//             vertex.normals ? vertex.normals.current[num] : undefined,
//             vertex.colors ? vertex.colors.current[num] : undefined,
//             vertex.uvs ? vertex.uvs.current[num] : undefined
//         )
//     }
// }
//
// export class Vertex3DView extends VertexView<Position3D, Direction3D, RGB, UV> {}
// export class Vertex4DView extends VertexView<Position4D, Direction4D, RGBA, UVW> {}
//
// export const vert3 = (
//     include: ATTRIBUTE = ATTRIBUTE.position,
//     vector3D_allocator: Vector3DAllocator = defaultVector3DAllocator,
//     vector2D_allocator: Vector2DAllocator = defaultVector2DAllocator
// ) : Vertex3D => new Vertex3D(
//     pos3D(vector3D_allocator),
//     include & ATTRIBUTE.normal ? dir3D(vector3D_allocator) : undefined,
//     include & ATTRIBUTE.color ? rgb(vector3D_allocator) : undefined,
//     include & ATTRIBUTE.uv ? uv(vector2D_allocator) : undefined
// );
//
// export const vert4 = (
//     include: ATTRIBUTE = ATTRIBUTE.position,
//     vector4D_allocator: Vector4DAllocator = defaultVector4DAllocator,
//     vector3D_allocator: Vector3DAllocator = defaultVector3DAllocator
// ) : Vertex4D => new Vertex4D(
//     pos4D(vector4D_allocator),
//     include & ATTRIBUTE.normal ? dir4D(vector4D_allocator) : undefined,
//     include & ATTRIBUTE.color ? rgba(vector4D_allocator) : undefined,
//     include & ATTRIBUTE.uv ? uvw(vector3D_allocator) : undefined
// );