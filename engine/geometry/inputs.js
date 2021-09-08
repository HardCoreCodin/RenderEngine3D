export class InputAttribute {
    get dim() { return this._dim; }
    get face_type() { return this._face_type; }
    get face_count() { return this.faces_vertices.length; }
    get vertex_count() { return this.vertices.length; }
    triangulate() {
        if (this._face_type === 3 /* TRIANGLE */)
            return;
        const quad_count = this.faces_vertices.length;
        const v1 = Array(quad_count);
        const v2 = Array(quad_count);
        const v3 = Array(quad_count);
        const v4 = Array(quad_count);
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
        this.faces_vertices = Array(triangle_count);
        for (let face_id = 0; face_id < triangle_count; face_id++)
            this.faces_vertices[face_id] = [
                new_v1[face_id],
                new_v2[face_id],
                new_v3[face_id],
            ];
        this._face_type = 3 /* TRIANGLE */;
        return this;
    }
    addVertex(...vertex) {
        this._initVertices(vertex);
        this.vertices.push(vertex.map(this._getVertexComponent));
    }
    addFace(...face) {
        this._initFaces(face);
        this.faces_vertices.push(face.map(this._getVertexIndex));
    }
    _initFaces(face) {
        if (this.faces_vertices) {
            if (face.length === this.faces_vertices[0].length)
                return;
            throw `Invalid face length: Expected ${this.faces_vertices[0].length} got ${face.length}!`;
        }
        switch (face.length) {
            case 3 /* _3D */: {
                this._face_type = 3 /* TRIANGLE */;
                this.faces_vertices = Array();
                break;
            }
            case 4 /* _4D */: {
                this._face_type = 4 /* QUAD */;
                this.faces_vertices = Array();
                break;
            }
            default:
                throw `Invalid face length: Expected 2 or 3, got ${face.length}!`;
        }
    }
    _initVertices(vertex) {
        if (this.vertices) {
            if (vertex.length === this.vertices[0].length)
                return;
            throw `Invalid vertex length: Expected ${this.vertices[0].length} got ${vertex.length}!`;
        }
        switch (vertex.length) {
            case 2 /* _2D */: {
                this._dim = 2 /* _2D */;
                this.vertices = Array();
                break;
            }
            case 3 /* _3D */: {
                this._dim = 3 /* _3D */;
                this.vertices = Array();
                break;
            }
            case 4 /* _4D */: {
                this._dim = 4 /* _4D */;
                this.vertices = Array();
                break;
            }
            default:
                throw `Invalid vertex length: Expected 2-4, got ${vertex.length}!`;
        }
    }
    _getVertexComponent(vertex_component) {
        if (typeof vertex_component === "string")
            vertex_component = Number(vertex_component);
        if (typeof vertex_component === "number") {
            if (Number.isFinite(vertex_component))
                return vertex_component;
            throw `Invalid ${this} vertex component}: ${vertex_component} is not a finite number!`;
        }
        throw `Invalid ${this} component: Got ${typeof vertex_component} is not a number/string!`;
    }
    _getVertexIndex(vertex_index) {
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
export class InputPositions extends InputAttribute {
    constructor() {
        super(...arguments);
        this.attribute = 1 /* position */;
    }
}
export class InputNormals extends InputAttribute {
    constructor() {
        super(...arguments);
        this.attribute = 2 /* normal */;
    }
}
export class InputColors extends InputAttribute {
    constructor() {
        super(...arguments);
        this.attribute = 4 /* color */;
    }
}
export class InputUVs extends InputAttribute {
    constructor() {
        super(...arguments);
        this.attribute = 8 /* uv */;
    }
}
export class MeshInputs {
    constructor(included = 1 /* position */, position = new InputPositions(), normal = included & 2 /* normal */ ? new InputNormals() : null, color = included & 4 /* color */ ? new InputColors() : null, uv = included & 8 /* uv */ ? new InputUVs() : null) {
        this.included = included;
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.uv = uv;
    }
    sanitize() {
        if (this.position.face_type === 4 /* QUAD */) {
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
//# sourceMappingURL=inputs.js.map