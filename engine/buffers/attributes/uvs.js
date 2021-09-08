import { iterSharedTriangles, iterUnsharedTriangles, Triangle } from "./base.js";
import { UV2D, UV3D } from "../../accessors/uv.js";
import { UVs2D, UVs3D } from "../vectors.js";
import { loadSharedVertices, loadUnsharedVertices } from "./core.js";
export class VertexUVs2D extends UVs2D {
    autoInit(vertex_count, face_vertices, is_shared = true) {
        this._is_shared = !!is_shared;
        this._face_vertices = face_vertices;
        this.init(is_shared ? vertex_count : this.face_count * 3);
        return this;
    }
    get face_vertices() { return this._face_vertices; }
    get face_count() { return this._face_vertices.length; }
    get vertex_count() { return this.length; }
    get is_shared() { return this._is_shared; }
    get triangles() {
        return this._is_shared ?
            iterSharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays) :
            iterUnsharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays);
    }
    load(inputs) {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);
        return this;
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(UV2D, this.arrays[0]);
    }
}
export class VertexUVs3D extends UVs3D {
    autoInit(vertex_count, face_vertices, is_shared = true) {
        this._is_shared = !!is_shared;
        this._face_vertices = face_vertices;
        this.init(is_shared ? vertex_count : this.face_count * 3);
        return this;
    }
    get face_vertices() { return this._face_vertices; }
    get face_count() { return this._face_vertices.length; }
    get vertex_count() { return this.length; }
    get is_shared() { return this._is_shared; }
    get triangles() {
        return this._is_shared ?
            iterSharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays) :
            iterUnsharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays);
    }
    load(inputs) {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);
        return this;
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(UV3D, this.arrays[0]);
    }
}
//# sourceMappingURL=uvs.js.map