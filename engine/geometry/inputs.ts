import {ATTRIBUTE, DIM, FACE_TYPE} from "../core/constants.js";
import {
    IInputAttribute,
    IInputColors,
    IInputNormals,
    IInputPositions,
    IInputUVs,
    IMeshInputs
} from "../core/interfaces/attributes.js";
import {
    FaceInputNum,
    FaceInputs,
    FaceInputStr, num2, Num2, num3,
    Num3, num4, Num4,
    VertexInputNum,
    VertexInputs,
    VertexInputStr
} from "../core/types.js";


export class InputAttribute<Attribute extends ATTRIBUTE>
    implements IInputAttribute<Attribute>
{
    vertices: VertexInputs;
    faces_vertices: FaceInputs;

    protected _dim: DIM;
    protected _face_type: FACE_TYPE;

    readonly attribute: Attribute;
    get dim(): DIM {return this._dim}
    get face_type(): number {return this._face_type}
    get face_count(): number {return this.faces_vertices.length}
    get vertex_count(): number {return this.vertices.length}

    triangulate(): this {
        if (this._face_type === FACE_TYPE.TRIANGLE)
            return;

        const quad_count = this.faces_vertices.length;
        const v1 = Array<number>(quad_count);
        const v2 = Array<number>(quad_count);
        const v3 = Array<number>(quad_count);
        const v4 = Array<number>(quad_count);

        let face_id = 0;
        for (const indices of this.faces_vertices) {
            v1[face_id] = indices[0];
            v2[face_id] = indices[1];
            v3[face_id] = indices[2];
            v4[face_id] = indices[3];
            face_id++;
        }

        const triangle_count = quad_count * 2;

        const new_v1 = Array(triangle_count);
        const new_v2 = Array(triangle_count);
        const new_v3 = Array(triangle_count);

        let second_index = quad_count;
        for (let first_index = 0; first_index < quad_count; first_index++, second_index++) {
            new_v1[first_index] = v1[first_index];
            new_v2[first_index] = v2[first_index];
            new_v3[first_index] = v3[first_index];

            new_v1[second_index] = v1[first_index];
            new_v2[second_index] = v3[first_index];
            new_v3[second_index] = v4[first_index];
        }

        this.faces_vertices = Array<Num3>(triangle_count);
        for (let face_id = 0; face_id < triangle_count; face_id++)
            this.faces_vertices[face_id] = [
                new_v1[face_id],
                new_v2[face_id],
                new_v3[face_id],
            ];

        this._face_type = FACE_TYPE.TRIANGLE;

        return this;
    }

    addVertex(...vertex: Array<string|number>) {
        this._initVertices(vertex);
        this.vertices.push(vertex.map(this._getVertexComponent) as VertexInputNum);
    }

    addFace(...face: Array<string|number>) {
        this._initFaces(face);
        this.faces_vertices.push(face.map(this._getVertexIndex) as FaceInputNum);
    }

    _initFaces(face: Array<string|number>): void {
        if (this.faces_vertices) {
            if (face.length === this.faces_vertices[0].length)
                return;

            throw `Invalid face length: Expected ${this.faces_vertices[0].length} got ${face.length}!`;
        }

        switch (face.length) {
            case DIM._3D: {
                this._face_type = FACE_TYPE.TRIANGLE;
                this.faces_vertices = Array<Num3>();
                break;
            }
            case DIM._4D: {
                this._face_type = FACE_TYPE.QUAD;
                this.faces_vertices = Array<Num4>();
                break;
            }
            default:
                throw `Invalid face length: Expected 2 or 3, got ${face.length}!`;
        }
    }

    _initVertices(vertex: Array<string|number>): void {
        if (this.vertices) {
            if (vertex.length === this.vertices[0].length)
                return;

            throw `Invalid vertex length: Expected ${this.vertices[0].length} got ${vertex.length}!`;
        }

        switch (vertex.length) {
            case DIM._2D: {
                this._dim = DIM._2D;
                this.vertices = Array<Num2>();
                break;
            }
            case DIM._3D: {
                this._dim = DIM._3D;
                this.vertices = Array<Num3>();
                break;
            }
            case DIM._4D: {
                this._dim = DIM._4D;
                this.vertices = Array<Num4>();
                break;
            }
            default:
                throw `Invalid vertex length: Expected 2-4, got ${vertex.length}!`;
        }
    }

    _getVertexComponent(vertex_component: number|string): number {
        if (typeof vertex_component === "string")
            vertex_component = Number(vertex_component);

        if (typeof vertex_component === "number") {
            if (Number.isFinite(vertex_component))
                return vertex_component;

            throw `Invalid ${this} vertex component}: ${vertex_component} is not a finite number!`;
        }

        throw `Invalid ${this} component: Got ${typeof vertex_component} is not a number/string!`;
    }

    _getVertexIndex(vertex_index: number|string): number {
        if (typeof vertex_index === "string")
            vertex_index = Number(vertex_index);

        if (typeof vertex_index === "number") {
            if (Number.isFinite(vertex_index)) {
                if (Number.isInteger(vertex_index))
                    return vertex_index;


                throw `Invalid ${this} vertex index}: ${vertex_index} is not an integer!`;
            }

            throw `Invalid ${this} vertex index}: ${vertex_index} is not a finite number!`;
        }

        throw `Invalid ${this} index: Got ${typeof vertex_index} is not a number/string!`;
    }
}

export class InputPositions extends InputAttribute<ATTRIBUTE.position> implements IInputPositions {
    public readonly attribute = ATTRIBUTE.position
}

export class InputNormals extends InputAttribute<ATTRIBUTE.normal> implements IInputNormals {
    public readonly attribute = ATTRIBUTE.normal
}

export class InputColors extends InputAttribute<ATTRIBUTE.color> implements IInputColors {
    public readonly attribute = ATTRIBUTE.color
}

export class InputUVs extends InputAttribute<ATTRIBUTE.uv> implements IInputUVs {
    public readonly attribute = ATTRIBUTE.uv;
}

export class MeshInputs implements IMeshInputs {
    constructor(
        readonly included: ATTRIBUTE = ATTRIBUTE.position,
        readonly position: InputPositions = new InputPositions(),
        readonly normal: InputNormals = included & ATTRIBUTE.normal ? new InputNormals() : null,
        readonly color: InputColors = included & ATTRIBUTE.color ? new InputColors() : null,
        readonly uv: InputUVs = included & ATTRIBUTE.uv ? new InputUVs() : null
    ) {}

    sanitize(): this {
        if (this.position.face_type === FACE_TYPE.QUAD) {
            this.position.triangulate();

            if (this.normal)
                this.normal.triangulate();

            if (this.color)
                this.color.triangulate();

            if (this.uv)
                this.uv.triangulate();
        }

        return this;
    }
}