import {GLIndexBuffer, GLVertexArray, GLVertexBuffer} from "./buffers.js";
import {IMesh} from "../../../../core/_interfaces/geometry.js";

export default class GLMeshBuffers {

    constructor(
        readonly context: WebGL2RenderingContext,
        readonly mesh: IMesh,
        readonly index_buffer = new GLIndexBuffer(context, mesh.face_vertices.array),
        readonly vertex_array = new GLVertexArray(context, mesh.vertex_count)
    ) {
        this.load();
    }

    load(): void {
        this.vertex_array.attributes.position = new GLVertexBuffer(
            this.context,
            this.mesh.vertex_count,
            this.mesh.vertices.positions.array
        );

        if (this.mesh.vertices.normals) {
            this.vertex_array.attributes.normal = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.normals.array
            )
        }

        if (this.mesh.vertices.colors) {
            this.vertex_array.attributes.color = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.colors.array
            )
        }

        if (this.mesh.vertices.uvs) {
            this.vertex_array.attributes.uv = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.uvs.array
            )
        }
    }

    delete(): void {
        this.index_buffer.delete();
        this.vertex_array.delete();
    }
}