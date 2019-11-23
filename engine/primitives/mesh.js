import { Faces3D, Vertices3D } from "./attribute.js";
import { num2, num3, num4 } from "../factories.js";
export default class Mesh {
    constructor(inputs, options = new MeshOptions()) {
        this.inputs = inputs;
        this.options = options;
        inputs.init();
        options.sanitize(this.inputs);
        this.face_count = inputs.position.faces_vertices[0].length;
        this.vertex_count = inputs.position.vertices[0].length;
        this.face = new Faces3D(this);
        this.vertex = new Vertices3D(this);
    }
    get sizes() {
        const result = this.vertex.sizes;
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
        this.vertex.init(this.vertex_count, this.options.vertex_attributes, this.options.share);
        this.face.init(this.face_count, this.options.face_attributes);
        this.vertex.faces.load(this.inputs.vertex_faces.number_arrays);
        this.face.vertices.load(positions.faces_vertices);
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
export class InputAttribute {
    constructor(face_type = 3 /* TRIANGLE */, vertices, faces_vertices) {
        this.face_type = face_type;
        this.vertices = vertices;
        this.faces_vertices = faces_vertices;
        this.dim = 3 /* _3D */;
        if (!faces_vertices)
            switch (face_type) {
                case 3 /* TRIANGLE */:
                    this.faces_vertices = num3();
                    break;
                case 4 /* QUAD */:
                    this.faces_vertices = num4();
                    break;
                default:
                    throw `Invalid face type ${face_type}! Only supports triangles and quads.`;
            }
        if (!vertices)
            this.vertices = Array(this.dim);
        switch (this.dim) {
            case 2 /* _2D */:
                this.vertices = num2();
                break;
            case 3 /* _3D */:
                this.vertices = num3();
                break;
            default:
                throw `Invalid vertex dimension ${this.dim}! Only supports 2D or 3D.`;
        }
    }
    triangulate() {
        if (this.face_type === 4 /* QUAD */) {
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
            this.face_type = 3 /* TRIANGLE */;
        }
    }
    getValue(value, is_index) {
        let error;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`;
                }
                else
                    return value;
            }
            else
                error = `${value} is not a finite number`;
        }
        else if (typeof value === "string")
            return this.getValue(+value, is_index);
        else
            error = `Got ${typeof value} ${value} instead or a number or a string`;
        throw `Invalid ${this} ${is_index ? 'index' : 'value'}! ${error}`;
    }
    checkInputSize(input_size, is_index) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this} ${is_index ? 'index_arrays' : 'values'} input! Got ${input_size} ${is_index ? 'vertices per face' : 'dimensions'} instead of ${required_size}`;
    }
    pushVertex(vertex) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }
    pushFace(face) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces_vertices[vertex_num].push(this.getValue(vertex_index, true));
    }
}
export class InputPositions extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 1 /* position */;
    }
}
export class InputNormals extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
    }
}
export class InputColors extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 4 /* color */;
    }
}
export class InputUVs extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 8 /* uv */;
        this.dim = 2 /* _2D */;
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
    init(inputs) {
        this.number_arrays.length = inputs.vertices[0].length;
        for (let i = 0; i < inputs.vertices[0].length; i++)
            this.number_arrays[i] = [];
        this.size = 0;
        let vertex_id, face_id;
        for (const face_vertex_ids of inputs.faces_vertices) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                this.number_arrays[vertex_id].push(face_id);
                this.size++;
            }
        }
    }
}
//# sourceMappingURL=mesh.js.map