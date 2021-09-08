import { iterSharedTriangles, iterUnsharedTriangles, Triangle } from "./base.js";
import { Position2D, Position3D, Position4D } from "../../accessors/position.js";
import { Positions2D, Positions3D, Positions4D } from "../vectors.js";
import { loadUnsharedVertices, loadVerticesSimple, pullFacesWithUnsharedVertices, pullFaceWithSharedVertices } from "./core.js";
export class VertexPositions2D extends Positions2D {
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
        loadVerticesSimple(inputs.vertices, this.arrays);
        return this;
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(Position2D, this.arrays[0]);
    }
}
export class VertexPositions3D extends Positions3D {
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
            loadVerticesSimple(inputs.vertices, this.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);
        return this;
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(Position3D, this.arrays[0]);
    }
}
export class VertexPositions4D extends Positions4D {
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
            loadVerticesSimple(inputs.vertices, this.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);
        for (const array of this.arrays)
            array[3] = 1;
        return this;
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(Position4D, this.arrays[0]);
    }
}
export class FacePositions2D extends Positions2D {
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
}
export class FacePositions3D extends Positions3D {
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
}
export class FacePositions4D extends Positions4D {
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
}
//# sourceMappingURL=positions.js.map