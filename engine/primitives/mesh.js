import { Faces, FaceVertices, InputColors, InputNormals, InputPositions, InputUVs, VertexFaces, Vertices } from "./attribute.js";
export class Mesh {
    constructor(inputs, options = new MeshOptions()) {
        this.faces = new Faces();
        this.vertices = new Vertices();
        this.face_vertices = new FaceVertices();
        this.vertex_faces = new VertexFaces();
        this.load(inputs, options);
    }
    load(inputs, options) {
        options.sanitize(inputs);
        inputs.sanitize();
        this.face_count = inputs.position.faces[0].length;
        this.vertex_count = inputs.position.vertices[0].length;
        // Init::
        this.vertices.init(this.vertex_count, options.vertex_attributes, options.share);
        this.faces.init(this.face_count, options.face_attributes);
        this.face_vertices.load(inputs.position);
        // Load:
        this.vertices.position.load(inputs.position, this.face_vertices);
        if (options.include_uvs && inputs.uv)
            this.vertices.uv.load(inputs.uv, this.face_vertices);
        if (options.normal === 4 /* GATHER_VERTEX__GENERATE_FACE */ ||
            options.color === 8 /* GATHER_VERTEX__GENERATE_FACE */)
            this.vertex_faces.load(this.vertex_count, this.face_vertices);
        switch (options.normal) {
            case 0 /* NO_VERTEX__NO_FACE */: break;
            case 1 /* NO_VERTEX__GENERATE_FACE */:
                this.faces.normal.pull(this.vertices.position, this.face_vertices);
                break;
            case 2 /* LOAD_VERTEX__NO_FACE */:
                this.vertices.normal.load(inputs.normal, this.face_vertices);
                break;
            case 3 /* LOAD_VERTEX__GENERATE_FACE */:
                this.vertices.normal.load(inputs.normal, this.face_vertices);
                this.faces.normal.pull(this.vertices.position, this.face_vertices);
                break;
            case 4 /* GATHER_VERTEX__GENERATE_FACE */:
                this.faces.normal.pull(this.vertices.position, this.face_vertices);
                this.vertices.normal.pull(this.faces.normal, this.vertex_faces);
                break;
        }
        switch (options.color) {
            case 0 /* NO_VERTEX__NO_FACE */: break;
            case 1 /* NO_VERTEX__GENERATE_FACE */:
                this.faces.color.generate();
                break;
            case 5 /* GENERATE_VERTEX__NO_FACE */:
                this.vertices.color.generate();
                break;
            case 7 /* GENERATE_VERTEX__GENERATE_FACE */:
                this.faces.color.generate();
                this.vertices.color.generate();
                break;
            case 8 /* GATHER_VERTEX__GENERATE_FACE */:
                this.faces.color.generate();
                this.vertices.color.pull(this.faces.color, this.vertex_faces);
                break;
            case 6 /* GENERATE_VERTEX__GATHER_FACE */:
                this.vertices.color.generate();
                this.faces.color.pull(this.vertices.color, this.face_vertices);
                break;
            case 2 /* LOAD_VERTEX__NO_FACE */:
                this.vertices.color.load(inputs.color, this.face_vertices);
                break;
            case 4 /* LOAD_VERTEX__GENERATE_FACE */:
                this.vertices.color.load(inputs.color, this.face_vertices);
                this.faces.color.generate();
                break;
            case 3 /* LOAD_VERTEX__GATHER_FACE */:
                this.vertices.color.load(inputs.color, this.face_vertices);
                this.faces.color.pull(this.vertices.color, this.face_vertices);
        }
    }
}
export class MeshOptions {
    constructor(share = 0, normal = 0, color = 0, include_uvs = false, generate_face_positions = false) {
        this.share = share;
        this.normal = normal;
        this.color = color;
        this.include_uvs = include_uvs;
        this.generate_face_positions = generate_face_positions;
    }
    get vertex_attributes() {
        let flags = 1 /* position */;
        if (this.normal !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.normal !== 1 /* NO_VERTEX__GENERATE_FACE */)
            flags |= 2 /* normal */;
        if (this.color !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.color !== 1 /* NO_VERTEX__GENERATE_FACE */)
            flags |= 4 /* color */;
        if (this.include_uvs)
            flags |= 8 /* uv */;
        return flags;
    }
    get face_attributes() {
        let flags = 0;
        if (this.normal !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.normal !== 2 /* LOAD_VERTEX__NO_FACE */)
            flags |= 2 /* normal */;
        if (this.color !== 0 /* NO_VERTEX__NO_FACE */ &&
            this.color !== 2 /* LOAD_VERTEX__NO_FACE */ &&
            this.color !== 5 /* GENERATE_VERTEX__NO_FACE */)
            flags |= 4 /* color */;
        if (this.generate_face_positions)
            flags |= 1 /* position */;
        return flags;
    }
    sanitize(inputs) {
        if (inputs.normal === null) {
            switch (this.normal) {
                case 2 /* LOAD_VERTEX__NO_FACE */:
                    this.normal = 0 /* NO_VERTEX__NO_FACE */;
                    break;
                case 3 /* LOAD_VERTEX__GENERATE_FACE */: this.normal = 1 /* NO_VERTEX__GENERATE_FACE */;
            }
        }
        if (inputs.color === null) {
            switch (this.color) {
                case 2 /* LOAD_VERTEX__NO_FACE */:
                case 3 /* LOAD_VERTEX__GATHER_FACE */:
                    this.color = 0 /* NO_VERTEX__NO_FACE */;
                    break;
                case 4 /* LOAD_VERTEX__GENERATE_FACE */: this.color = 1 /* NO_VERTEX__GENERATE_FACE */;
            }
        }
    }
}
export class MeshInputs {
    constructor(included = 1 /* position */, face_type = 3 /* TRIANGLE */, position = new InputPositions(face_type), normal = included & 2 /* normal */ ? new InputNormals(face_type) : null, color = included & 4 /* color */ ? new InputColors(face_type) : null, uv = included & 8 /* uv */ ? new InputUVs(face_type) : null) {
        this.included = included;
        this.face_type = face_type;
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.uv = uv;
    }
    sanitize() {
        if (this.position.face_type === 4 /* QUAD */)
            this._triangulate();
    }
    _triangulate() {
        // TODO: Implement...
        this.position.face_type = 3 /* TRIANGLE */;
    }
}
//# sourceMappingURL=mesh.js.map