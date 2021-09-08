import {Triangle, iterSharedTriangles, iterUnsharedTriangles} from "./base.js";
import {ATTRIBUTE} from "../../core/constants.js";
import {InputNormals} from "../../geometry/inputs.js";
import {Position3D, Position4D} from "../../accessors/position.js";
import {Direction3D, Direction4D, dir3, dir4} from "../../accessors/direction.js";
import {Directions3D, Directions4D} from "../vectors.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {
    loadSharedVertices,
    loadUnsharedVertices,
    pullSharedVertices,
    pullUnsharedVertices,
} from "./core.js";
import {zip} from "../../core/utils.js";
import {IFaceVertices, IVertexFaces} from "../../core/interfaces/buffers.js";
import {IFaceAttribute, IVertexAttribute} from "../../core/interfaces/attributes.js";


export class VertexNormals3D extends Directions3D implements IVertexAttribute<Direction3D, ATTRIBUTE.normal> {
    readonly attribute: ATTRIBUTE.normal;
    current_triangle: Triangle<Direction3D>;

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

    get triangles(): Generator<Triangle<Direction3D>> {
        return this._is_shared ?
            iterSharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays) :
            iterUnsharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays);
    }

    load(inputs: InputNormals): this {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);
        return this;
    }

    pull(faces: FaceNormals3D, vertex_faces: IVertexFaces): void {
        if (this._is_shared)
            pullSharedVertices(faces.arrays, this.arrays, vertex_faces.arrays);
        else
            pullUnsharedVertices(faces.arrays, this.arrays);

        for (const normal of this) normal.inormalize();
        // let one_over_length;
        // for (const array of this.arrays) {
        //     one_over_length = Math.sqrt(array[0]*array[0] + array[1]*array[1] + array[2]*array[2]);
        //     array[0] *= one_over_length;
        //     array[1] *= one_over_length;
        //     array[2] *= one_over_length;
        // }
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Direction3D, this.arrays[0]);
    }
}
export class VertexNormals4D extends Directions4D implements IVertexAttribute<Direction4D, ATTRIBUTE.normal> {
    readonly attribute: ATTRIBUTE.normal;
    current_triangle: Triangle<Direction4D>;

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

    get triangles(): Generator<Triangle<Direction4D>> {
        return this._is_shared ?
            iterSharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays) :
            iterUnsharedTriangles(this.current_triangle, this.arrays, this._face_vertices.arrays);
    }

    load(inputs: InputNormals): this {
        if (this._is_shared)
            loadSharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays, this._face_vertices.arrays);
        else
            loadUnsharedVertices(inputs.vertices, inputs.faces_vertices, this.arrays);

        return this;
    }

    pull(faces: FaceNormals4D, vertex_faces: IVertexFaces): void {
        if (this._is_shared)
            pullSharedVertices(faces.arrays, this.arrays, vertex_faces.arrays);
        else
            pullUnsharedVertices(faces.arrays, this.arrays);

        // for (const normal of this) normal.inormalize();
        let one_over_length;
        for (const array of this.arrays) {
            one_over_length = 1.0 / Math.sqrt(array[0]*array[0] + array[1]*array[1] + array[2]*array[2]);
            array[0] *= one_over_length;
            array[1] *= one_over_length;
            array[2] *= one_over_length;
            array[3] = 0;
        }
    }

    protected _post_init(): void {
        super._post_init();
        this.current_triangle = new Triangle(Direction4D, this.arrays[0]);
    }
}

export class FaceNormals3D extends Directions3D
    implements IFaceAttribute<Direction3D, ATTRIBUTE.normal, Position3D, ATTRIBUTE.position>
{
    readonly attribute: ATTRIBUTE.normal;

    protected _face_vertices: IFaceVertices;

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this.length}

    autoInit(face_vertices: IFaceVertices): this {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
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
        this._randomize();
        return this;
    }
}
export class FaceNormals4D extends Directions4D
    implements IFaceAttribute<Direction4D, ATTRIBUTE.normal, Position4D, ATTRIBUTE.position>
{
    readonly attribute: ATTRIBUTE.normal;

    protected _face_vertices: IFaceVertices;

    get face_vertices(): IFaceVertices {return this._face_vertices}
    get face_count(): number {return this.length}

    autoInit(face_vertices: IFaceVertices): this {
        this._face_vertices = face_vertices;
        this.init(face_vertices.length);
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
        this._randomize();
        return this;
    }
}

const AB = dir3();
const AC = dir3();
const AB_4D = dir4();
const AC_4D = dir4();