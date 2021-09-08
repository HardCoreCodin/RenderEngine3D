import { Triangle, iterSharedTriangles, iterUnsharedTriangles } from "./_base.js";
import { Direction3D, Direction4D, dir3, dir4 } from "../../accessors/direction.js";
import { Directions3D, Directions4D } from "../vectors.js";
import { loadSharedVertices, loadUnsharedVertices, pullSharedVertices, pullUnsharedVertices, } from "./_core.js";
import { zip } from "../../core/utils.js";
export class VertexNormals3D extends Directions3D {
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
        for (const normal of this)
            normal.inormalize();
        // let one_over_length;
        // for (const array of this.arrays) {
        //     one_over_length = Math.sqrt(array[0]*array[0] + array[1]*array[1] + array[2]*array[2]);
        //     array[0] *= one_over_length;
        //     array[1] *= one_over_length;
        //     array[2] *= one_over_length;
        // }
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(Direction3D, this.arrays[0]);
    }
}
export class VertexNormals4D extends Directions4D {
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
        // for (const normal of this) normal.inormalize();
        let one_over_length;
        for (const array of this.arrays) {
            one_over_length = 1.0 / Math.sqrt(array[0] * array[0] + array[1] * array[1] + array[2] * array[2]);
            array[0] *= one_over_length;
            array[1] *= one_over_length;
            array[2] *= one_over_length;
            array[3] = 0;
        }
    }
    _post_init() {
        super._post_init();
        this.current_triangle = new Triangle(Direction4D, this.arrays[0]);
    }
}
export class FaceNormals3D extends Directions3D {
    get face_vertices() { return this._face_vertices; }
    get face_count() { return this.length; }
    autoInit(face_vertices) {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }
    pull(vertex_positions) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles)) {
            triangle.a.to(triangle.b, AB);
            triangle.a.to(triangle.c, AC);
            AB.icross(AC).normalize(face_normal);
        }
        return this;
    }
    generate() {
        this._randomize();
        return this;
    }
}
export class FaceNormals4D extends Directions4D {
    get face_vertices() { return this._face_vertices; }
    get face_count() { return this.length; }
    autoInit(face_vertices) {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }
    pull(vertex_positions) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles)) {
            triangle.a.to(triangle.b, AB_4D);
            triangle.a.to(triangle.c, AC_4D);
            AB_4D.icross(AC_4D).normalize(face_normal);
        }
        return this;
    }
    generate() {
        this._randomize();
        return this;
    }
}
const AB = dir3();
const AC = dir3();
const AB_4D = dir4();
const AC_4D = dir4();
//# sourceMappingURL=normals.js.map