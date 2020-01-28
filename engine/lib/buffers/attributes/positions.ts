import {iterTriangles, Triangle} from "./_base.js";
import {InputPositions} from "../../geometry/inputs.js";
import {Position2D, Position3D, Position4D} from "../../accessors/position.js";
import {Colors3D, Positions2D, Positions3D, Positions4D} from "../vectors.js";
import {ATTRIBUTE} from "../../../constants.js";
import {loadVerticesSimple, pullFaces} from "./_core.js";
import {IFaceVertices} from "../../_interfaces/buffers.js";
import {IFaceAttribute, IVertexAttribute} from "../../_interfaces/attributes.js";


export class VertexPositions2D extends Positions2D implements IVertexAttribute<Position2D, ATTRIBUTE.position>
{
    readonly attribute: ATTRIBUTE.position;

    protected _is_shared: boolean;
    current_triangle: Triangle<Position2D>;

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

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Position2D, this.arrays);
    }

    get is_shared(): boolean {
        return this._is_shared
    }

    get triangles(): Generator<Triangle<Position2D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    load(inputs: InputPositions): this {
        loadVerticesSimple(this.arrays, inputs.vertices);
        return this;
    }
}
export class VertexPositions3D extends Positions3D implements IVertexAttribute<Position3D, ATTRIBUTE.position> {
    readonly attribute: ATTRIBUTE.position;

    protected _is_shared: boolean;
    current_triangle: Triangle<Position3D>;

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
    get triangles(): Generator<Triangle<Position3D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Position3D, this.arrays);
    }

    load(inputs: InputPositions): this {
        loadVerticesSimple(this.arrays, inputs.vertices);
        return this;
    }
}
export class VertexPositions4D extends Positions4D implements IVertexAttribute<Position4D, ATTRIBUTE.position> {
    readonly attribute: ATTRIBUTE.position;

    protected _is_shared: boolean;
    current_triangle: Triangle<Position4D>;

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
    get triangles(): Generator<Triangle<Position4D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Position4D, this.arrays);
    }

    load(inputs: InputPositions): this {
        loadVerticesSimple(this.arrays, inputs.vertices);
        this.arrays[3].fill(1);
        return this;
    }
}


export class FacePositions2D extends Positions2D implements IFaceAttribute<Position2D, ATTRIBUTE.position>  {
    readonly attribute: ATTRIBUTE.position;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length
    ) {
        super();
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this.face_count, arrays);
        return this;
    }

    pull(inputs: VertexPositions2D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }
}
export class FacePositions3D extends Positions3D implements IFaceAttribute<Position3D, ATTRIBUTE.position> {
    readonly attribute: ATTRIBUTE.position;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length
    ) {
        super();
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this.face_count, arrays);
        return this;
    }

    pull(inputs: VertexPositions3D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }
}
export class FacePositions4D extends Positions4D implements IFaceAttribute<Position4D, ATTRIBUTE.position>  {
    readonly attribute: ATTRIBUTE.position;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length
    ) {
        super();
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this.face_count, arrays);
        return this;
    }

    pull(inputs: VertexPositions4D): this {
        pullFaces(this.arrays, inputs.arrays, this.face_vertices.arrays, this.face_count, inputs.is_shared);
        return this;
    }
}