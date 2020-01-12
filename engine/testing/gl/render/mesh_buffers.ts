import {GLIndexBuffer, GLVertexArray, GLVertexBuffer} from "../buffers.js";
import {IGLAttributeInputs} from "../types.js";
import {IMesh} from "../../../lib/_interfaces/geometry.js";

export class GLMeshBuffers {
    protected _positions: Float32Array;
    protected _normals: Float32Array;
    protected _colors: Float32Array;
    protected _uvs: Float32Array;

    constructor(
        readonly context: WebGL2RenderingContext,
        readonly mesh: IMesh,
        readonly index_buffer = new GLIndexBuffer(context, mesh.face_vertices.toArray()),
        readonly vertex_array = new GLVertexArray(context, mesh.vertex_count)
    ) {
        this.load();
    }

    load(): void {
        let length = this.mesh.vertices.positions.length * this.mesh.vertices.positions.arrays.length;
        if (!this._positions || this._positions.length !== length)
            this._positions = new Float32Array(length);

        this.vertex_array.attributes.position = new GLVertexBuffer(
            this.context,
            this.mesh.vertex_count,
            this.mesh.vertices.positions.toArray(this._positions)
        );

        if (this.mesh.vertices.normals) {
            let length = this.mesh.vertices.normals.length * this.mesh.vertices.normals.arrays.length;
            if (!this._normals || this._normals.length !== length)
                this._normals = new Float32Array(length);

            this.vertex_array.attributes.normal = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.normals.toArray(this._normals)
            )
        }

        if (this.mesh.vertices.colors) {
            let length = this.mesh.vertices.colors.length * this.mesh.vertices.colors.arrays.length;
            if (!this._colors || this._colors.length !== length)
                this._colors = new Float32Array(length);

            this.vertex_array.attributes.color = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.colors.toArray(this._colors)
            )
        }

        if (this.mesh.vertices.uvs) {
            let length = this.mesh.vertices.uvs.length * this.mesh.vertices.uvs.arrays.length;
            if (!this._uvs || this._uvs.length !== length)
                this._uvs = new Float32Array(length);

            this.vertex_array.attributes.uv = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.uvs.toArray(this._uvs)
            )
        }
    }

    delete(): void {
        this.index_buffer.delete();
        this.vertex_array.delete();
    }
}