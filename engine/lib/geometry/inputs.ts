import {num2, num3, num4} from "../../factories.js";
import {ATTRIBUTE, DIM, FACE_TYPE} from "../../constants.js";
import {
    IInputAttribute,
    IInputColors,
    IInputNormals,
    IInputPositions,
    IInputUVs,
    IMeshInputs
} from "../_interfaces/attributes.js";
import {FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputs, VertexInputStr} from "../../types.js";


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
    get face_count(): number {return this.faces_vertices[0].length}
    get vertex_count(): number {return this.vertices[0].length}

    triangulate(): this {
        if (this._face_type === FACE_TYPE.TRIANGLE)
            return;

        const [v1, v2, v3, v4] = this.faces_vertices;
        const quad_count = v4.length;
        const triangle_count = quad_count * 2;

        const new_v1 = Array(triangle_count);
        const new_v2 = Array(triangle_count);
        const new_v3 = Array(triangle_count);

        let second_index = quad_count;
        for (let first_index = 0; first_index < quad_count; first_index++) {
            new_v1[first_index] = v1[first_index];
            new_v2[first_index] = v2[first_index];
            new_v3[first_index] = v3[first_index];

            new_v1[second_index] = v1[first_index];
            new_v2[second_index] = v3[first_index];
            new_v3[second_index] = v4[first_index];

            second_index++;
        }

        this.faces_vertices = [new_v1, new_v2, new_v3];
        this._face_type = FACE_TYPE.TRIANGLE;

        return this;
    }

    addVertex(...vertex: VertexInputNum | VertexInputStr) {
        this._initVertices(vertex);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this._getVertexComponent(component_value));
    }

    addFace(...face: FaceInputNum | FaceInputStr) {
        this._initFaces(face);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces_vertices[vertex_num].push(this._getVertexIndex(vertex_index));
    }

    _initFaces(face: FaceInputNum | FaceInputStr): void {
        if (this.faces_vertices) {
            if (face.length === this.faces_vertices.length)
                return;

            throw `Invalid face length: Expected ${this.faces_vertices.length} got ${face.length}!`;
        }

        switch (face.length) {
            case DIM._3D: {
                this._face_type = FACE_TYPE.TRIANGLE;
                this.faces_vertices = num3();
                break;
            }
            case DIM._4D: {
                this._face_type = FACE_TYPE.QUAD;
                this.faces_vertices = num4();
                break;
            }
            default:
                throw `Invalid face length: Expected 2 or 3, got ${face.length}!`;
        }
    }

    _initVertices(vertex: VertexInputNum | VertexInputStr): void {
        if (this.vertices) {
            if (vertex.length === this.vertices.length)
                return;

            throw `Invalid vertex length: Expected ${this.vertices.length} got ${vertex.length}!`;
        }

        switch (vertex.length) {
            case DIM._2D: {
                this._dim = DIM._2D;
                this.vertices = num2();
                break;
            }
            case DIM._3D: {
                this._dim = DIM._3D;
                this.vertices = num3();
                break;
            }
            case DIM._4D: {
                this._dim = DIM._4D;
                this.vertices = num4();
                break;
            }
            default:
                throw `Invalid vertex length: Expected 2-4, got ${vertex.length}!`;
        }
    }

    _getVertexComponent(vertex_component: number|string): number {
        if (typeof vertex_component === "string")
            return this._getVertexComponent(vertex_component);

        if (typeof vertex_component === "number") {
            if (Number.isFinite(vertex_component))
                return vertex_component;

            throw `Invalid ${this} vertex component}: ${vertex_component} is not a finite number!`;
        }

        throw `Invalid ${this} component: Got ${typeof vertex_component} is not a number/string!`;
    }

    _getVertexIndex(vertex_index: number|string): number {
        if (typeof vertex_index === "string")
            return this._getVertexIndex(vertex_index);

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