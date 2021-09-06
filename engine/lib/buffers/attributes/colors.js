import { iterSharedTriangles, iterUnsharedTriangles, Triangle } from "./_base.js";
import { Color3D, Color4D } from "../../accessors/color.js";
import { Colors3D, Colors4D } from "../vectors.js";
import { loadSharedVertices, loadUnsharedVertices, pullSharedVertices, pullUnsharedVertices, pullFacesWithUnsharedVertices, pullFaceWithSharedVertices } from "./_core.js";
export class VertexColors3D extends Colors3D {
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
    pull(faces, vertex_faces) {
        if (this._is_shared)
            pullSharedVertices(faces.arrays, this.arrays, vertex_faces.arrays);
        else
            pullUnsharedVertices(faces.arrays, this.arrays);
    }
    generate() {
        this._randomize();
        return this;
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(Color3D, this.arrays[0]);
    }
}
export class VertexColors4D extends Colors4D {
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
    pull(faces, vertex_faces) {
        if (this._is_shared)
            pullSharedVertices(faces.arrays, this.arrays, vertex_faces.arrays);
        else
            pullUnsharedVertices(faces.arrays, this.arrays);
    }
    generate() {
        this._randomize();
        return this;
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(Color4D, this.arrays[0]);
    }
}
export class FaceColors3D extends Colors3D {
    get face_vertices() { return this._face_vertices; }
    get face_count() { return this.length; }
    autoInit(face_vertices) {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }
    pull(vertices) {
        if (vertices.is_shared)
            pullFaceWithSharedVertices(vertices.arrays, this.arrays, this._face_vertices.arrays);
        else
            pullFacesWithUnsharedVertices(vertices.arrays, this.arrays);
        return this;
    }
    generate() {
        this._randomize();
        return this;
    }
}
export class FaceColors4D extends Colors4D {
    get face_vertices() { return this._face_vertices; }
    get face_count() { return this.length; }
    autoInit(face_vertices) {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }
    pull(vertices) {
        if (vertices.is_shared)
            pullFaceWithSharedVertices(vertices.arrays, this.arrays, this._face_vertices.arrays);
        else
            pullFacesWithUnsharedVertices(vertices.arrays, this.arrays);
        return this;
    }
    generate() {
        this._randomize();
        return this;
    }
}
//# sourceMappingURL=colors.js.map