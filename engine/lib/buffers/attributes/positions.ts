import {iterTriangles, Triangle} from "./_base.js";
import {InputPositions} from "../../geometry/inputs.js";
import {Position2D, Position3D, Position4D} from "../../accessors/position.js";
import {Positions2D, Positions3D, Positions4D} from "../vectors.js";
import {ATTRIBUTE} from "../../../constants.js";
import {loadVertices, loadVerticesSimple, pullFaces} from "./_core.js";
import {IFaceVertices} from "../../_interfaces/buffers.js";
import {IFaceAttribute, IVertexAttribute} from "../../_interfaces/attributes.js";


export class VertexPositions2D extends Positions2D implements IVertexAttribute<Position2D, ATTRIBUTE.position>
{
    readonly attribute: ATTRIBUTE.position;
    current_triangle: Triangle<Position2D>;

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

    get triangles(): Generator<Triangle<Position2D>> {
        return iterTriangles(this.current_triangle, this._face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputPositions): this {
        loadVerticesSimple(this.arrays, inputs.vertices);
        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Position2D, this.arrays);
    }
}
export class VertexPositions3D extends Positions3D implements IVertexAttribute<Position3D, ATTRIBUTE.position> {
    readonly attribute: ATTRIBUTE.position;
    current_triangle: Triangle<Position3D>;

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

    get triangles(): Generator<Triangle<Position3D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputPositions): this {
        if (this._is_shared)
            loadVerticesSimple(this.arrays, inputs.vertices);
        else
            loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, false);
        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Position3D, this.arrays);
    }
}
export class VertexPositions4D extends Positions4D implements IVertexAttribute<Position4D, ATTRIBUTE.position> {
    readonly attribute: ATTRIBUTE.position;
    current_triangle: Triangle<Position4D>;

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

    get triangles(): Generator<Triangle<Position4D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputPositions): this {
        if (this._is_shared)
            loadVerticesSimple(this.arrays, inputs.vertices);
        else
            loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, false);
        this.arrays[3].fill(1);
        return this;
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Position4D, this.arrays);
    }
}


export class FacePositions2D extends Positions2D implements IFaceAttribute<Position2D, ATTRIBUTE.position>  {
    readonly attribute: ATTRIBUTE.position;

    protected _face_vertices: IFaceVertices;

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this.length}

    autoInit(face_vertices: IFaceVertices): this {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }

    pull(inputs: VertexPositions2D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }
}
export class FacePositions3D extends Positions3D implements IFaceAttribute<Position3D, ATTRIBUTE.position> {
    readonly attribute: ATTRIBUTE.position;

    protected _face_vertices: IFaceVertices;

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this.length}

    autoInit(face_vertices: IFaceVertices): this {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }

    pull(inputs: VertexPositions3D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }
}
export class FacePositions4D extends Positions4D implements IFaceAttribute<Position4D, ATTRIBUTE.position>  {
    readonly attribute: ATTRIBUTE.position;

    protected _face_vertices: IFaceVertices;

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this.length}

    autoInit(face_vertices: IFaceVertices): this {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
        return this;
    }

    pull(inputs: VertexPositions4D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }
}