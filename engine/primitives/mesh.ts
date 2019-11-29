import {ATTRIBUTE, COLOR_SOURCING, DIM, FACE_TYPE, NORMAL_SOURCING} from "../constants.js";
import {FaceInputNum, FaceInputs, FaceInputStr, TriangleInputs, VertexInputNum, VertexInputStr} from "../types.js";
import {num2, num3, num4} from "../factories.js";
import {IInputAttribute} from "../lib/_interfaces/mesh/inputs/attributes/_base.js";
import {IInputPositions} from "../lib/_interfaces/mesh/inputs/attributes/position.js";
import {IInputNormals} from "../lib/_interfaces/mesh/inputs/attributes/normal.js";
import {IInputColors} from "../lib/_interfaces/mesh/inputs/attributes/color.js";
import {IInputUVs} from "../lib/_interfaces/mesh/inputs/attributes/uv.js";
import {FaceVertices, VertexFaces} from "../lib/buffers/index.js";
import {Faces3D} from "../lib/attributes/face/collection.js";
import {Vertices3D} from "../lib/attributes/vertex/collection.js";

export default class Mesh {
    public readonly face: Faces3D = new Faces3D();
    public readonly face_count: number;
    public readonly face_vertices: FaceVertices = new FaceVertices();

    public readonly vertex: Vertices3D = new Vertices3D();
    public readonly vertex_count: number;
    public readonly vertex_faces: VertexFaces = new VertexFaces();


    constructor(
        public inputs: MeshInputs,
        public options: MeshOptions = new MeshOptions(),
    ) {
        inputs.init();
        options.sanitize(this.inputs);

        this.face_count = inputs.position.faces_vertices[0].length;
        this.vertex_count = inputs.position.vertices[0].length;
    }

    load() : this {
        const positions = this.inputs.position;
        const normals = this.inputs.normal;
        const colors = this.inputs.color;
        const uvs = this.inputs.uv;
        const vertex_faces = this.inputs.vertex_faces;

        // Init:
        this.vertex_faces.init(vertex_faces.size);
        this.vertex_faces.load(vertex_faces.number_arrays);

        this.face_vertices.init(this.face_count);
        this.face_vertices.load(positions.faces_vertices as TriangleInputs);

        this.vertex.init(this.options, this.face_vertices);
        this.face.init(this.options, this.face_vertices);

        // Load:
        this.vertex.positions.load(positions);
        if (this.options.include_uvs)
            this.vertex.uvs.load(uvs);

        switch (this.options.normal) {
            case NORMAL_SOURCING.NO_VERTEX__NO_FACE: break;
            case NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.face.normals.pull(this.vertex.positions);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertex.normals.load(normals);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertex.normals.load(normals);
                this.face.normals.pull(this.vertex.positions);
                break;
            case NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.face.normals.pull(this.vertex.positions);
                this.vertex.normals.pull(this.face.normals, this.vertex_faces);
                break;
        }

        switch (this.options.color) {
            case COLOR_SOURCING.NO_VERTEX__NO_FACE: break;
            case COLOR_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.face.colors.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__NO_FACE:
                this.vertex.colors.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GENERATE_FACE:
                this.face.colors.generate();
                this.vertex.colors.generate();
                break;
            case COLOR_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.face.colors.generate();
                this.vertex.colors.pull(this.face.colors, this.vertex_faces);
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GATHER_FACE:
                this.vertex.colors.generate();
                this.face.colors.pull(this.vertex.colors);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertex.colors.load(colors);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertex.colors.load(colors);
                this.face.colors.generate();
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                this.vertex.colors.load(colors);
                this.face.colors.pull(this.vertex.colors);
        }

        return this;
    }
}

export class MeshOptions {
    constructor(
        public share: ATTRIBUTE = 0,
        public normal: NORMAL_SOURCING = 0,
        public color: COLOR_SOURCING = 0,

        public include_uvs: boolean = false,
        public generate_face_positions: boolean = false
    ) {}

    get vertex_attributes(): number {
        let flags = ATTRIBUTE.position;

        if (this.normal !== NORMAL_SOURCING.NO_VERTEX__NO_FACE &&
            this.normal !== NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE)
            flags |= ATTRIBUTE.normal;

        if (this.color !== COLOR_SOURCING.NO_VERTEX__NO_FACE &&
            this.color !== COLOR_SOURCING.NO_VERTEX__GENERATE_FACE)
            flags |= ATTRIBUTE.color;

        if (this.include_uvs)
            flags |= ATTRIBUTE.uv;

        return flags;
    }

    get face_attributes(): number {
        let flags = 0;

        if (this.normal !== NORMAL_SOURCING.NO_VERTEX__NO_FACE &&
            this.normal !== NORMAL_SOURCING.LOAD_VERTEX__NO_FACE)
            flags |= ATTRIBUTE.normal;

        if (this.color !== COLOR_SOURCING.NO_VERTEX__NO_FACE &&
            this.color !== COLOR_SOURCING.LOAD_VERTEX__NO_FACE &&
            this.color !== COLOR_SOURCING.GENERATE_VERTEX__NO_FACE)
            flags |= ATTRIBUTE.color;

        if (this.generate_face_positions)
            flags |= ATTRIBUTE.position;

        return flags;
    }

    sanitize(inputs: MeshInputs) {
        if (!(inputs.included & ATTRIBUTE.normal)) {
            switch (this.normal) {
                case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE: this.normal = NORMAL_SOURCING.NO_VERTEX__NO_FACE; break;
                case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE: this.normal = NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE;
            }
        }

        if (!(inputs.included & ATTRIBUTE.normal)) {
            switch (this.color) {
                case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE: this.color = COLOR_SOURCING.NO_VERTEX__NO_FACE; break;
                case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE: this.color = COLOR_SOURCING.NO_VERTEX__GENERATE_FACE;
            }
        }

        if (!(inputs.included & ATTRIBUTE.uv))
            this.include_uvs = false;
    }
}

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

    triangulate() {
        if (this.face_type === FACE_TYPE.QUAD) {
            const v4 = this.faces_vertices.pop();
            const quad_count = v4.length;
            const [v1, v2, v3] = this.faces_vertices;

            v1.length *= 2;
            v2.length *= 2;
            v3.length *= 2;

            for (let quad_id = 0; quad_id < quad_count; quad_id++) {
                v1[quad_id + quad_count] = v1[quad_id];
                v2[quad_id + quad_count] = v3[quad_id];
                v3[quad_id + quad_count] = v4[quad_id];
            }

            this.face_type = FACE_TYPE.TRIANGLE;
        }
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

export class MeshInputs {
    public readonly vertex_faces = new InputVertexFaces();

    constructor(
        public face_type: FACE_TYPE = FACE_TYPE.TRIANGLE,
        public readonly included: ATTRIBUTE = ATTRIBUTE.position,
        public readonly position: InputPositions = new InputPositions(face_type),
        public readonly normal: InputNormals = new InputNormals(face_type),
        public readonly color: InputColors = new InputColors(face_type),
        public readonly uv: InputUVs = new InputUVs(face_type)
    ) {}

    init() {
        if (this.face_type === FACE_TYPE.QUAD) {
            this.position.triangulate();
            if (this.included & ATTRIBUTE.normal) this.normal.triangulate();
            if (this.included & ATTRIBUTE.color) this.color.triangulate();
            if (this.included & ATTRIBUTE.uv) this.uv.triangulate();

            this.face_type = FACE_TYPE.TRIANGLE;
        }

        this.vertex_faces.init(this.position);
    }
}

class InputVertexFaces {
    public readonly number_arrays: number[][];
    public size: number;

    init(inputs: InputPositions) {
        this.number_arrays.length = inputs.vertices[0].length;
        for (let i = 0; i < inputs.vertices[0].length; i++)
            this.number_arrays[i] = [];

        this.size = 0;
        let vertex_id, face_id;
        for (const face_vertex_ids of inputs.faces_vertices) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                this.number_arrays[vertex_id].push(face_id);
                this.size++
            }
        }
    }
}