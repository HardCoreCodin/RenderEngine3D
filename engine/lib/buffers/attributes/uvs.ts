import {iterTriangles, Triangle} from "./_base.js";
import {UV2D, UV3D} from "../../accessors/uv.js";
import {UVs2D, UVs3D} from "../vectors.js";
import {InputUVs} from "../../geometry/inputs.js";
import {ATTRIBUTE} from "../../../constants.js";
import {loadSharedVertices, loadUnsharedVertices} from "./_core.js";
import {IFaceVertices} from "../../_interfaces/buffers.js";
import {IVertexAttribute} from "../../_interfaces/attributes.js";


export class VertexUVs2D extends UVs2D implements IVertexAttribute<UV2D, ATTRIBUTE.uv> {
    readonly attribute: ATTRIBUTE.uv;
    current_triangle: Triangle<UV2D>;

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

    get triangles(): Generator<Triangle<UV2D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputUVs): this {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);

        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(UV2D, this.arrays);
    }
}

export class VertexUVs3D extends UVs3D implements IVertexAttribute<UV3D, ATTRIBUTE.uv> {
    readonly attribute: ATTRIBUTE.uv;
    current_triangle: Triangle<UV3D>;

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

    get triangles(): Generator<Triangle<UV3D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputUVs): this {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);

        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(UV3D, this.arrays);
    }
}