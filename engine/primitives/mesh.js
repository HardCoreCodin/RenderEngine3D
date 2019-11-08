import { Faces3D, Vertices3D, InputColors, InputNormals, InputPositions, InputUVs } from "./attribute.js";
import { AllocatorSizes } from "../allocators.js";
export default class Mesh {
    constructor(inputs, options = new MeshOptions()) {
        this.inputs = inputs;
        this.options = options;
        inputs.init();
        options.sanitize(this.inputs);
        this.face_count = inputs.position.faces[0].length;
        this.vertex_count = inputs.position.vertices[0].length;
        this.face = new Faces3D(this);
        this.vertex = new Vertices3D(this);
    }
    get allocator_sizes() {
        const result = new AllocatorSizes({
            face_vertices: this.face_count,
            vertex_faces: this.inputs.vertex_faces.size
        });
        const vertex_attributes = this.options.vertex_attributes;
        const face_attributes = this.options.face_attributes;
        const vertex_size = this.vertex_count * 4;
        result.vec3D += vertex_size;
        if (vertex_attributes & 2 /* normal */)
            result.vec3D += vertex_size;
        if (vertex_attributes & 4 /* color */)
            result.vec3D += vertex_size;
        if (vertex_attributes & 8 /* uv */)
            result.vec2D += vertex_size;
        if (face_attributes & 1 /* position */)
            result.vec3D += this.face_count;
        if (face_attributes & 2 /* normal */)
            result.vec3D += this.face_count;
        if (face_attributes & 4 /* color */)
            result.vec3D += this.face_count;
        return result;
    }
    load(allocators) {
        const positions = this.inputs.position;
        const normals = this.inputs.normal;
        const colors = this.inputs.color;
        const uvs = this.inputs.uv;
        // Init::
        this.vertex.init(allocators, this.vertex_count, this.options.vertex_attributes, this.options.share);
        this.vertex.faces.init(allocators.vertex_faces, this.inputs.vertex_faces.size);
        this.vertex.faces.load(this.inputs.vertex_faces.number_arrays);
        this.face.init(allocators, this.face_count, this.options.face_attributes);
        this.face.vertices.load(positions.faces);
        // Load:
        this.vertex.positions.load(positions, this.face.vertices);
        if (this.options.include_uvs)
            this.vertex.uvs.load(uvs, this.face.vertices);
        switch (this.options.normal) {
            case 0 /* NO_VERTEX__NO_FACE */: break;
            case 1 /* NO_VERTEX__GENERATE_FACE */:
                this.face.normals.pull(this.vertex.positions, this.face.vertices);
                break;
            case 2 /* LOAD_VERTEX__NO_FACE */:
                this.vertex.normals.load(normals, this.face.vertices);
                break;
            case 3 /* LOAD_VERTEX__GENERATE_FACE */:
                this.vertex.normals.load(normals, this.face.vertices);
                this.face.normals.pull(this.vertex.positions, this.face.vertices);
                break;
            case 4 /* GATHER_VERTEX__GENERATE_FACE */:
                this.face.normals.pull(this.vertex.positions, this.face.vertices);
                this.vertex.normals.pull(this.face.normals, this.vertex.faces);
                break;
        }
        switch (this.options.color) {
            case 0 /* NO_VERTEX__NO_FACE */: break;
            case 1 /* NO_VERTEX__GENERATE_FACE */:
                this.face.colors.generate();
                break;
            case 5 /* GENERATE_VERTEX__NO_FACE */:
                this.vertex.colors.generate();
                break;
            case 7 /* GENERATE_VERTEX__GENERATE_FACE */:
                this.face.colors.generate();
                this.vertex.colors.generate();
                break;
            case 8 /* GATHER_VERTEX__GENERATE_FACE */:
                this.face.colors.generate();
                this.vertex.colors.pull(this.face.colors, this.vertex.faces);
                break;
            case 6 /* GENERATE_VERTEX__GATHER_FACE */:
                this.vertex.colors.generate();
                this.face.colors.pull(this.vertex.colors, this.face.vertices);
                break;
            case 2 /* LOAD_VERTEX__NO_FACE */:
                this.vertex.colors.load(colors, this.face.vertices);
                break;
            case 4 /* LOAD_VERTEX__GENERATE_FACE */:
                this.vertex.colors.load(colors, this.face.vertices);
                this.face.colors.generate();
                break;
            case 3 /* LOAD_VERTEX__GATHER_FACE */:
                this.vertex.colors.load(colors, this.face.vertices);
                this.face.colors.pull(this.vertex.colors, this.face.vertices);
        }
        return this;
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
        if (!(inputs.included & 2 /* normal */)) {
            switch (this.normal) {
                case 2 /* LOAD_VERTEX__NO_FACE */:
                    this.normal = 0 /* NO_VERTEX__NO_FACE */;
                    break;
                case 3 /* LOAD_VERTEX__GENERATE_FACE */: this.normal = 1 /* NO_VERTEX__GENERATE_FACE */;
            }
        }
        if (!(inputs.included & 2 /* normal */)) {
            switch (this.color) {
                case 2 /* LOAD_VERTEX__NO_FACE */:
                case 3 /* LOAD_VERTEX__GATHER_FACE */:
                    this.color = 0 /* NO_VERTEX__NO_FACE */;
                    break;
                case 4 /* LOAD_VERTEX__GENERATE_FACE */: this.color = 1 /* NO_VERTEX__GENERATE_FACE */;
            }
        }
        if (!(inputs.included & 8 /* uv */))
            this.include_uvs = false;
    }
}
export class MeshInputs {
    constructor(face_type = 3 /* TRIANGLE */, included = 1 /* position */, position = new InputPositions(face_type), normal = new InputNormals(face_type), color = new InputColors(face_type), uv = new InputUVs(face_type)) {
        this.face_type = face_type;
        this.included = included;
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.uv = uv;
        this.vertex_faces = new InputVertexFaces();
    }
    init() {
        if (this.face_type === 4 /* QUAD */) {
            this.position.triangulate();
            if (this.included & 2 /* normal */)
                this.normal.triangulate();
            if (this.included & 4 /* color */)
                this.normal.triangulate();
            if (this.included & 8 /* uv */)
                this.normal.triangulate();
            this.face_type = 3 /* TRIANGLE */;
        }
        this.vertex_faces.init(this.position);
    }
}
class InputVertexFaces {
    constructor() {
        this.number_arrays = [];
    }
    init(inputs) {
        this.number_arrays.length = inputs.vertices[0].length;
        for (let i = 0; i < inputs.vertices[0].length; i++)
            this.number_arrays[i] = [];
        this.size = 0;
        let vertex_id, face_id;
        for (const face_vertex_ids of inputs.faces) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                this.number_arrays[vertex_id].push(face_id);
                this.size++;
            }
        }
    }
}
//# sourceMappingURL=mesh.js.map