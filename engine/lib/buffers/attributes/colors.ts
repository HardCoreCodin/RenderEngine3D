import {iterTriangles, Triangle} from "./_base.js";
import {Color3D, Color4D} from "../../accessors/color.js";
import {Colors3D, Colors4D} from "../vectors.js";
import {InputColors} from "../../geometry/inputs.js";
import {ATTRIBUTE} from "../../../constants.js";
import {loadVertices, pullVertices, pullFaces} from "./_core.js";
import {randomize3D, randomize4D} from "../_core.js";
import {IFaceVertices, IVertexFaces} from "../../_interfaces/buffers.js";
import {IVertexAttribute} from "../../_interfaces/attributes.js";


export class VertexColors3D extends Colors3D implements IVertexAttribute<Color3D, ATTRIBUTE.color> {
    readonly attribute: ATTRIBUTE.color;

    protected _is_shared: boolean;
    current_triangle: Triangle<Color3D>;

    constructor(
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        is_shared: number | boolean = true,
        readonly face_count: number = face_vertices.length
    ) {
        super();
        this._is_shared = !!is_shared;
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this._is_shared ? this.vertex_count : this.face_count * 3, arrays);
        return this;
    }

    get is_shared(): boolean {return this._is_shared}
    get triangles(): Generator<Triangle<Color3D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Color3D, this.arrays);
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
}
export class VertexColors4D extends Colors4D implements IVertexAttribute<Color4D, ATTRIBUTE.color> {
    readonly attribute: ATTRIBUTE.color;

    protected _is_shared: boolean;
    current_triangle: Triangle<Color4D>;

    constructor(
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        is_shared: number | boolean = true,
        readonly face_count: number = face_vertices.length
    ) {
        super();
        this._is_shared = !!is_shared;
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this._is_shared ? this.vertex_count : this.face_count * 3, arrays);
        return this;
    }

    get is_shared(): boolean {return this._is_shared}
    get triangles(): Generator<Triangle<Color4D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Color4D, this.arrays);
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
}

export class FaceColors3D extends Colors3D {
    readonly attribute: ATTRIBUTE.color;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length
    ) {
        super();
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this.face_count);
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
export class FaceColors4D extends Colors4D {
    readonly attribute: ATTRIBUTE.color;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length
    ) {
        super();
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this.face_count);
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