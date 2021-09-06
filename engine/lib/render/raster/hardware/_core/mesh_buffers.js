import { GLIndexBuffer, GLVertexArray, GLVertexBuffer } from "./buffers.js";
export default class GLMeshBuffers {
    constructor(context, mesh, index_buffer = new GLIndexBuffer(context, mesh.face_vertices.array), vertex_array = new GLVertexArray(context, mesh.vertex_count)) {
        this.context = context;
        this.mesh = mesh;
        this.index_buffer = index_buffer;
        this.vertex_array = vertex_array;
        this.load();
    }
    load() {
        this.vertex_array.attributes.position = new GLVertexBuffer(this.context, this.mesh.vertex_count, this.mesh.vertices.positions.array);
        if (this.mesh.vertices.normals) {
            this.vertex_array.attributes.normal = new GLVertexBuffer(this.context, this.mesh.vertex_count, this.mesh.vertices.normals.array);
        }
        if (this.mesh.vertices.colors) {
            this.vertex_array.attributes.color = new GLVertexBuffer(this.context, this.mesh.vertex_count, this.mesh.vertices.colors.array);
        }
        if (this.mesh.vertices.uvs) {
            this.vertex_array.attributes.uv = new GLVertexBuffer(this.context, this.mesh.vertex_count, this.mesh.vertices.uvs.array);
        }
    }
    delete() {
        this.index_buffer.delete();
        this.vertex_array.delete();
    }
}
//# sourceMappingURL=mesh_buffers.js.map