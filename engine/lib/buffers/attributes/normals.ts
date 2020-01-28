import {Triangle, iterTriangles} from "./_base.js";
import {ATTRIBUTE} from "../../../constants.js";
import {InputNormals} from "../../geometry/inputs.js";
import {Position3D, Position4D} from "../../accessors/position.js";
import {Direction3D, Direction4D, dir3, dir4} from "../../accessors/direction.js";
import {Directions3D, Directions4D} from "../vectors.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {randomize3D, randomize4D} from "../_core.js";
import {loadVertices, pullVertices} from "./_core.js";
import {zip} from "../../../utils.js";
import {IFaceVertices, IVertexFaces} from "../../_interfaces/buffers.js";
import {IFaceAttribute, IVertexAttribute} from "../../_interfaces/attributes.js";


export class VertexNormals3D extends Directions3D implements IVertexAttribute<Direction3D, ATTRIBUTE.normal> {
    readonly attribute: ATTRIBUTE.normal;

    protected _is_shared: boolean;
    current_triangle: Triangle<Direction3D>;

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
    get triangles(): Generator<Triangle<Direction3D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Direction3D, this.arrays);
    }

    load(inputs: InputNormals): this {
        loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, this._is_shared);
        return this;
    }

    pull(input: FaceNormals3D, vertex_faces: IVertexFaces): void {
        pullVertices(this.arrays, input.arrays, vertex_faces.arrays, this.face_count, this._is_shared);
    }
}
export class VertexNormals4D extends Directions4D implements IVertexAttribute<Direction4D, ATTRIBUTE.normal> {
    readonly attribute: ATTRIBUTE.normal;

    protected _is_shared: boolean;
    current_triangle: Triangle<Direction4D>;

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
    get triangles(): Generator<Triangle<Direction4D>> {
        return iterTriangles(this.current_triangle, this.face_vertices.arrays, this.face_count, this._is_shared);
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Direction4D, this.arrays);
    }

    load(inputs: InputNormals): this {
        loadVertices(this.arrays, inputs.vertices, this.face_vertices.arrays, inputs.faces_vertices, this.face_count, this._is_shared);
        return this;
    }

    pull(input: FaceNormals4D, vertex_faces: IVertexFaces): void {
        pullVertices(this.arrays, input.arrays, vertex_faces.arrays, this.face_count, this._is_shared);
    }
}

export class FaceNormals3D extends Directions3D
    implements IFaceAttribute<Direction3D, ATTRIBUTE.normal, Position3D, ATTRIBUTE.position>
{
    readonly attribute: ATTRIBUTE.normal;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length,
    ) {
        super();
    }

    autoInit(arrays?: Float32Array[]): this {
        this.init(this.face_count, arrays);
        return this;
    }

    pull(vertex_positions: VertexPositions3D): this {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles)) {
            triangle.a.to(triangle.b, AB);
            triangle.a.to(triangle.c, AC);
            AB.icross(AC).normalize(face_normal);
        }

        return this;
    }

    generate(): this {
        randomize3D(this.arrays);
        return this;
    }
}
export class FaceNormals4D extends Directions4D
    implements IFaceAttribute<Direction4D, ATTRIBUTE.normal, Position4D, ATTRIBUTE.position>
{
    readonly attribute: ATTRIBUTE.normal;

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

    pull(vertex_positions: VertexPositions4D): this {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles)) {
            triangle.a.to(triangle.b, AB_4D);
            triangle.a.to(triangle.c, AC_4D);
            AB_4D.icross(AC_4D).normalize(face_normal);
        }

        return this;
    }

    generate(): this {
        randomize4D(this.arrays);
        return this;
    }
}

const AB = dir3();
const AC = dir3();
const AB_4D = dir4();
const AC_4D = dir4();