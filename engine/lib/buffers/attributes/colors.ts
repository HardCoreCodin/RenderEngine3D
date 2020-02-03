import {iterTriangles, Triangle} from "./_base.js";
import {Color3D, Color4D} from "../../accessors/color.js";
import {Colors3D, Colors4D} from "../vectors.js";
import {InputColors} from "../../geometry/inputs.js";
import {ATTRIBUTE} from "../../../constants.js";
import {loadVertices, pullFaces, pullVertices} from "./_core.js";
import {randomize3D, randomize4D} from "../_core.js";
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
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputColors): this {
        loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, this._is_shared);
        return this;
    }

    pull(input: FaceColors3D, vertex_faces: IVertexFaces): void {
        pullVertices(this.arrays, input.arrays, vertex_faces.arrays, this.face_count, this._is_shared);
    }

    generate(): this {
        randomize3D(this.arrays);
        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Color3D, this.arrays);
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
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputColors): this {
        loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, this._is_shared);
        return this;
    }

    pull(input: FaceColors4D, vertex_faces: IVertexFaces): void {
        pullVertices(this.arrays, input.arrays, vertex_faces.arrays, this.face_count, this._is_shared);
    }

    generate(): this {
        randomize4D(this.arrays);
        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Color4D, this.arrays);
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

    pull(inputs: VertexColors3D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }

    generate(): this {
        randomize3D(this.arrays);
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

    pull(inputs: VertexColors4D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }

    generate(): this {
        randomize4D(this.arrays);
        return this;
    }
}