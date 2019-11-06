import {ATTRIBUTE, COLOR_SOURCING, FACE_TYPE, NORMAL_SOURCING} from "../constants.js";
import {Faces, InputColors, InputNormals, InputPositions, InputUVs, Vertices} from "./attribute.js";
import {IAllocators, IAllocatorSizes} from "../allocators.js";
import {NumArrays} from "../types.js";

export class Mesh {
    public readonly face: Faces = new Faces();
    public readonly face_count: number;

    public readonly vertex: Vertices = new Vertices();
    public readonly vertex_count: number;

    constructor(
        private readonly _inputs: MeshInputs,
        public options: MeshOptions = new MeshOptions(),
    ) {
        _inputs.init();
        const positions = _inputs.position;

        this.face_count = positions.faces[0].length;
        this.vertex_count = positions.vertices[0].length;
    }

    get sizes() : IAllocatorSizes {
        this.options.sanitize(this._inputs);

        let vec2D: number = 0;
        let vec3D: number = 0;

        const vertex_attributes: ATTRIBUTE = this.options.vertex_attributes;
        const face_attributes: ATTRIBUTE = this.options.face_attributes;

        const vertex_size = this.vertex_count * 4;
        vec3D += vertex_size;
        if (vertex_attributes & ATTRIBUTE.normal) vec3D += vertex_size;
        if (vertex_attributes & ATTRIBUTE.color) vec3D += vertex_size;
        if (vertex_attributes & ATTRIBUTE.uv) vec2D += vertex_size;

        if (face_attributes & ATTRIBUTE.position) vec3D += this.face_count;
        if (face_attributes & ATTRIBUTE.normal) vec3D += this.face_count;
        if (face_attributes & ATTRIBUTE.color) vec3D += this.face_count;

        const result: IAllocatorSizes = {
            face_vertices: this.face.count,
            vertex_faces: this._inputs.vertex_faces.size
        };

        result.vec3D = vec3D;
        if (vec2D)
            result.vec2D = vec2D;

        return result;
    }

    load(allocators: IAllocators) {
        const positions = this._inputs.position;
        const normals = this._inputs.normal;
        const colors = this._inputs.color;
        const uvs = this._inputs.uv;

        // Init::
        this.vertex.init(allocators, this.vertex_count, this.options.vertex_attributes, this.options.share);
        this.vertex.faces.init(allocators.vertex_faces, this._inputs.vertex_faces.size);
        this.vertex.faces.load(this._inputs.vertex_faces.vertex_faces);

        this.face.init(allocators, this.face_count, this.options.face_attributes);
        this.face.vertices.load(positions.faces);

        // Load:
        this.vertex.positions.load(positions, this.face.vertices);
        if (this.options.include_uvs)
            this.vertex.uvs.load(uvs, this.face.vertices);

        switch (this.options.normal) {
            case NORMAL_SOURCING.NO_VERTEX__NO_FACE: break;
            case NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.face.normals.pull(this.vertex.positions, this.face.vertices);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertex.normals.load(normals, this.face.vertices);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertex.normals.load(normals, this.face.vertices);
                this.face.normals.pull(this.vertex.positions, this.face.vertices);
                break;
            case NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.face.normals.pull(this.vertex.positions, this.face.vertices);
                this.vertex.normals.pull(this.face.normals, this.vertex.faces);
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
                this.vertex.colors.pull(this.face.colors, this.vertex.faces);
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GATHER_FACE:
                this.vertex.colors.generate();
                this.face.colors.pull(this.vertex.colors, this.face.vertices);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertex.colors.load(colors, this.face.vertices);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertex.colors.load(colors, this.face.vertices);
                this.face.colors.generate();
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                this.vertex.colors.load(colors, this.face.vertices);
                this.face.colors.pull(this.vertex.colors, this.face.vertices);
        }
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
            if (this.included & ATTRIBUTE.color) this.normal.triangulate();
            if (this.included & ATTRIBUTE.uv) this.normal.triangulate();

            this.face_type = FACE_TYPE.TRIANGLE;
        }

        this.vertex_faces.init(this.position);
    }
}

class InputVertexFaces {
    public readonly vertex_faces: NumArrays = [];
    public size: number;

    init(inputs: InputPositions) {
        this.vertex_faces.length = inputs.vertices[0].length;
        for (let i = 0; i < inputs.vertices[0].length; i++)
            this.vertex_faces[i] = [];

        this.size = 0;
        let vertex_id, face_id;
        for (const face_vertex_ids of inputs.faces) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                this.vertex_faces[vertex_id].push(face_id);
                this.size++
            }
        }
    }
}