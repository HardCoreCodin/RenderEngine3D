import {ATTRIBUTE, COLOR_SOURCING, FACE_TYPE, NORMAL_SOURCING} from "../constants.js";
import {FaceVertices, VertexFaces} from "../types.js";
import {Faces, InputColors, InputNormals, InputPositions, InputUVs, Vertices} from "./attribute.js";

export class Mesh {
    public readonly faces: Faces = new Faces();
    public readonly vertices: Vertices = new Vertices();

    public face_vertices: FaceVertices = [null, null, null];
    public vertex_faces: VertexFaces = [];

    public face_count: number;
    public vertex_count: number;

    constructor(inputs: MeshInputs, options: MeshOptions = new MeshOptions()) {
        this.load(inputs, options);
    }

    load(inputs: MeshInputs, options: MeshOptions) {
        options.sanitize(inputs);
        inputs.sanitize();

        this.face_count = inputs.position.faces[0].length;
        this.vertex_count = inputs.position.vertices[0].length;

        // Init::
        this.vertices.init(this.vertex_count, options.vertex_attributes, options.share);
        this.faces.init(this.face_count, options.face_attributes);

        for (const [i, buffer] of this.face_vertices.entries()) {
            if (buffer === null || buffer.length !== this.face_count)
                this.face_vertices[i] = new Uint32Array(this.face_count);
        }

        this.face_vertices[0].set(inputs.position.faces[0]);
        this.face_vertices[1].set(inputs.position.faces[1]);
        this.face_vertices[2].set(inputs.position.faces[2]);

        // Load:
        this.vertices.position.load(inputs.position, this.face_vertices);
        if (options.include_uvs && inputs.uv)
            this.vertices.uv.load(inputs.uv, this.face_vertices);

        if (options.normal === NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE ||
            options.color === COLOR_SOURCING.GATHER_VERTEX__GENERATE_FACE
        ) this._generateVertexFaces();

        switch (options.normal) {
            case NORMAL_SOURCING.NO_VERTEX__NO_FACE: break;
            case NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.faces.normal.pull(this.vertices.position, this.face_vertices);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertices.normal.load(inputs.normal, this.face_vertices);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertices.normal.load(inputs.normal, this.face_vertices);
                this.faces.normal.pull(this.vertices.position, this.face_vertices);
                break;
            case NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this._generateVertexFaces();
                this.faces.normal.pull(this.vertices.position, this.face_vertices);
                this.vertices.normal.pull(this.faces.normal, this.vertex_faces);
                break;
        }

        switch (options.color) {
            case COLOR_SOURCING.NO_VERTEX__NO_FACE: break;
            case COLOR_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.faces.color.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__NO_FACE:
                this.vertices.color.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GENERATE_FACE:
                this.faces.color.generate();
                this.vertices.color.generate();
                break;
            case COLOR_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.faces.color.generate();
                this.vertices.color.pull(this.faces.color, this.vertex_faces);
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GATHER_FACE:
                this.vertices.color.generate();
                this.faces.color.pull(this.vertices.color, this.face_vertices);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertices.color.load(inputs.color, this.face_vertices);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertices.color.load(inputs.color, this.face_vertices);
                this.faces.color.generate();
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                this.vertices.color.load(inputs.color, this.face_vertices);
                this.faces.color.pull(this.vertices.color, this.face_vertices);
        }
    }

    private _generateVertexFaces() : void {
        const temp_array = Array(this.vertex_count);
        for (let i = 0; i < this.vertex_count; i++)
            temp_array[i] = [];

        let vertex_id, face_id, relations: number = 0;
        for (const face_vertex_ids of this.face_vertices) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                temp_array[vertex_id].push(face_id);
                relations++
            }
        }

        this.vertex_faces = Array(this.vertex_count);
        const buffer = new Uint32Array(relations);
        let offset = 0;
        for (const [i, array] of temp_array.entries()) {
            this.vertex_faces[i] = buffer.subarray(offset, array.length);
            this.vertex_faces[i].set(array);
            offset += array.length;
        }
    };
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
        if (inputs.normal === null) {
            switch (this.normal) {
                case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE: this.normal = NORMAL_SOURCING.NO_VERTEX__NO_FACE; break;
                case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE: this.normal = NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE;
            }
        }
        if (inputs.color === null) {
            switch (this.color) {
                case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE: this.color = COLOR_SOURCING.NO_VERTEX__NO_FACE; break;
                case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE: this.color = COLOR_SOURCING.NO_VERTEX__GENERATE_FACE;
            }
        }
    }
}

export class MeshInputs {
    public readonly position: InputPositions;
    public readonly normal: InputNormals = null;
    public readonly color: InputColors = null;
    public readonly uv: InputUVs = null;

    constructor(
        public readonly included: ATTRIBUTE = ATTRIBUTE.position,
        public readonly face_type: FACE_TYPE = FACE_TYPE.TRIANGLE,
    ) {
        this.position = new InputPositions(face_type);
        if (included & ATTRIBUTE.normal) this.normal = new InputNormals(face_type);
        if (included & ATTRIBUTE.color) this.color = new InputColors(face_type);
        if (included & ATTRIBUTE.uv) this.uv = new InputUVs(face_type);
    }

    sanitize() {
        if (this.position.face_type === FACE_TYPE.QUAD)
            this._triangulate();
    }

    private _triangulate(): void {
        // TODO: Implement...

        this.position.face_type = FACE_TYPE.TRIANGLE;
    }
}