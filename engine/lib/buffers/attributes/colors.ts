import {iterSharedTriangles, iterUnsharedTriangles, Triangle} from "./_base.js";
import {Color3D, Color4D} from "../../accessors/color.js";
import {Colors3D, Colors4D} from "../vectors.js";
import {InputColors} from "../../geometry/inputs.js";
import {ATTRIBUTE} from "../../../constants.js";
import {
    loadSharedVertices,
    loadUnsharedVertices,
    pullSharedVertices,
    pullUnsharedVertices,
    pullFacesWithUnsharedVertices,
    pullFaceWithSharedVertices
} from "./_core.js";
import {IFaceVertices, IVertexFaces} from "../../_interfaces/buffers.js";
import {IFaceAttribute, IVertexAttribute} from "../../_interfaces/attributes.js";


export class VertexColors3D extends Colors3D implements IVertexAttribute<Color3D, ATTRIBUTE.color> {
    readonly attribute: ATTRIBUTE.color;
    current_triangle: Triangle<Color3D>;

    protected _is_shared: boolean;
    protected _face_vertices: IFaceVertices;

    autoInit(vertex_count: number, face_vertices: IFaceVertices, is_shared: number | boolean = true): this {
        this._is_shared = !!is_shared;
        this._face_vertices = face_vertices;
        this.init(is_shared ? vertex_count : this.face_count * 3);
        return this;
    }

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this._face_vertices.length}
    get vertex_count(): number {return this.length}
    get is_shared(): boolean {return this._is_shared}

    get triangles(): Generator<Triangle<Color3D>> {
        return this._is_shared ?
            iterSharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays) :
            iterUnsharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays);
    }

    load(inputs: InputColors): this {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);

        return this;
    }

    pull(faces: FaceColors3D, vertex_faces: IVertexFaces): void {
        if (this._is_shared)
            pullSharedVertices(faces.arrays, this.arrays, vertex_faces.arrays);
        else
            pullUnsharedVertices(faces.arrays, this.arrays);
    }

    generate(): this {
        this._randomize();
        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Color3D, this.arrays[0]);
    }
}
export class VertexColors4D extends Colors4D implements IVertexAttribute<Color4D, ATTRIBUTE.color> {
    readonly attribute: ATTRIBUTE.color;
    current_triangle: Triangle<Color4D>;

    protected _is_shared: boolean;
    protected _face_vertices: IFaceVertices;

    autoInit(vertex_count: number, face_vertices: IFaceVertices, is_shared: number | boolean = true): this {
        this._is_shared = !!is_shared;
        this._face_vertices = face_vertices;
        this.init(is_shared ? vertex_count : this.face_count * 3);
        return this;
    }

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this._face_vertices.length}
    get vertex_count(): number {return this.length}
    get is_shared(): boolean {return this._is_shared}

    get triangles(): Generator<Triangle<Color4D>> {
        return this._is_shared ?
            iterSharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays) :
            iterUnsharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays);
    }

    load(inputs: InputColors): this {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);

        return this;
    }

    pull(faces: FaceColors4D, vertex_faces: IVertexFaces): void {
        if (this._is_shared)
            pullSharedVertices(faces.arrays, this.arrays, vertex_faces.arrays);
        else
            pullUnsharedVertices(faces.arrays, this.arrays);
    }

    generate(): this {
        this._randomize();
        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Color4D, this.arrays[0]);
    }
}

export class FaceColors3D extends Colors3D implements IFaceAttribute<Color3D, ATTRIBUTE.color> {
    readonly attribute: ATTRIBUTE.color;

    protected _face_vertices: IFaceVertices;

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this.length}

    autoInit(face_vertices: IFaceVertices): this {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }

    pull(vertices: VertexColors3D): this {
        if (vertices.is_shared)
            pullFaceWithSharedVertices(vertices.arrays, this.arrays, this._face_vertices.arrays);
        else
            pullFacesWithUnsharedVertices(vertices.arrays, this.arrays);

        return this;
    }

    generate(): this {
        this._randomize();
        return this;
    }
}
export class FaceColors4D extends Colors4D implements IFaceAttribute<Color4D, ATTRIBUTE.color>  {
    readonly attribute: ATTRIBUTE.color;

    protected _face_vertices: IFaceVertices;

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this.length}

    autoInit(face_vertices: IFaceVertices): this {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }

    pull(vertices: VertexColors4D): this {
        if (vertices.is_shared)
            pullFaceWithSharedVertices(vertices.arrays, this.arrays, this._face_vertices.arrays);
        else
            pullFacesWithUnsharedVertices(vertices.arrays, this.arrays);

        return this;
    }

    generate(): this {
        this._randomize();
        return this;
    }
}