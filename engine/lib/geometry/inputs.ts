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
import {FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../types.js";

export class InputAttribute implements IInputAttribute {
    readonly dim: DIM = DIM._3D;

    constructor(
        public face_type: FACE_TYPE = FACE_TYPE.TRIANGLE,
        public vertices?: number[][],
        public faces_vertices?: FaceInputs,
    ) {
        if (!faces_vertices) switch (face_type) {
            case FACE_TYPE.TRIANGLE:
                this.faces_vertices = num3();
                break;
            case FACE_TYPE.QUAD:
                this.faces_vertices = num4();
                break;
            default:
                throw `Invalid face type ${face_type}! Only supports triangles and quads.`;
        }

        if (!vertices)
            this.vertices = Array<number[]>(this.dim);

        switch (this.dim) {
            case DIM._2D:
                this.vertices = num2();
                break;
            case DIM._3D:
                this.vertices = num3();
                break;
            default:
                throw `Invalid vertex dimension ${this.dim}! Only supports 2D or 3D.`;
        }
    }

    get vertex_count(): number {
        return this.vertices[0].length;
    }

    get face_count(): number {
        return this.faces_vertices[0].length;
    }

    triangulate(): this {
        if (this.face_type === FACE_TYPE.TRIANGLE)
            return;

        const v4 = this.faces_vertices.pop();
        const quad_count = v4.length;
        const triangle_count = quad_count * 2;
        const [v1, v2, v3] = this.faces_vertices;

        v1.length = v2.length = v3.length = triangle_count;

        let doubled, shifted: number;
        for (let quad_id = quad_count - 1; quad_id > 0; quad_id--) {
            doubled = quad_id + quad_id;
            shifted = doubled - 1;

            v1.copyWithin(quad_id, shifted, shifted);
            v2.copyWithin(quad_id, shifted, shifted);
            v3.copyWithin(quad_id, shifted, shifted);

            v1[doubled] = v1[quad_id];
            v2[doubled] = v3[quad_id];
            v3[doubled] = v4[quad_id];
        }

        this.face_type = FACE_TYPE.TRIANGLE;

        return this;
    }

    getValue(value: number | string, is_index: boolean): number {
        let error: string;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`
                } else
                    return value;
            } else
                error = `${value} is not a finite number`;
        } else if (typeof value === "string")
            return this.getValue(+value, is_index);
        else
            error = `Got ${typeof value} ${value} instead or a number or a string`;

        throw `Invalid ${this} ${is_index ? 'index' : 'value'}! ${error}`;
    }

    checkInputSize(input_size: number, is_index: boolean) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this} ${
                is_index ? 'index_arrays' : 'values'
                } input! Got ${input_size} ${
                is_index ? 'vertices per face' : 'dimensions'
                } instead of ${required_size}`;
    }

    pushVertex(vertex: VertexInputNum | VertexInputStr) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }

    pushFace(face: FaceInputNum | FaceInputStr) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces_vertices[vertex_num].push(this.getValue(vertex_index, true));
    }
}

export class InputPositions extends InputAttribute implements IInputPositions {
    public readonly id = ATTRIBUTE.position
}

export class InputNormals extends InputAttribute implements IInputNormals {
    public readonly id = ATTRIBUTE.normal
}

export class InputColors extends InputAttribute implements IInputColors {
    public readonly id = ATTRIBUTE.color
}

export class InputUVs extends InputAttribute implements IInputUVs {
    public readonly id = ATTRIBUTE.uv;
    readonly dim = DIM._2D
}

export class MeshInputs implements IMeshInputs {
    constructor(
        public face_type: FACE_TYPE = FACE_TYPE.TRIANGLE,
        readonly included: ATTRIBUTE = ATTRIBUTE.position,
        readonly position: InputPositions = new InputPositions(face_type),
        readonly normal: InputNormals = new InputNormals(face_type),
        readonly color: InputColors = new InputColors(face_type),
        readonly uv: InputUVs = new InputUVs(face_type)
    ) {}

    sanitize(): this {
        if (this.face_type === FACE_TYPE.QUAD) {
            this.position.triangulate();
            if (this.included & ATTRIBUTE.normal) this.normal.triangulate();
            if (this.included & ATTRIBUTE.color) this.color.triangulate();
            if (this.included & ATTRIBUTE.uv) this.uv.triangulate();

            this.face_type = FACE_TYPE.TRIANGLE;
        }

        return this;
    }
}