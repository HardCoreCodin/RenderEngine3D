import Object3D from "./object.js";
import {Allocators} from "../allocators.js";
import Transform, {trans} from "./transform.js";
import Mesh from "../primitives/mesh.js";
import {Triangle3DView, Triangle4DView} from "../primitives/triangle.js";
import {Vertices4D} from "../primitives/attribute.js";
import {BufferSizes} from "../buffer.js";
export default class MeshRenderer extends Object3D {
    public readonly allocator_sizes: BufferSizes;
    public readonly mesh_triangle_view: Triangle3DView;
    public readonly render_triangle_view: Triangle4DView;

    constructor(
        public readonly mesh: Mesh,
        public readonly transform: Transform,
        private vertices = new Vertices4D(mesh)
    ) {
        super(transform);

        this.mesh_triangle_view = new Triangle3DView(mesh.vertex, mesh.face);
        this.allocator_sizes = new BufferSizes(mesh.sizes);

        this.allocator_sizes.mat4x4 = this.allocator_sizes.mat3x3;
        this.allocator_sizes.mat3x3 = 0;

        this.allocator_sizes.vec4D = this.allocator_sizes.vec3D;
        this.allocator_sizes.vec3D = this.allocator_sizes.vec2D;
        this.allocator_sizes.vec2D = 0;

        this.allocator_sizes.vertex_faces = 0;
        this.allocator_sizes.face_vertices = 0;
    }

    init(allocators: Allocators) {

    }
}

export const rend = (mesh: Mesh, allocators: Allocators) : MeshRenderer => new MeshRenderer(mesh, trans(
    allocators.mat4x4,
    allocators.mat3x3
));