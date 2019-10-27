import {
    UnsharedVertexPositions,
    UnsharedVertexNormals,
    UnsharedVertexColors,
    UnsharedVertexUVs
} from "../attributes/vertex.js";
import {
    FaceColors,
    FaceNormals,
    FacePositions
} from "../attributes/face.js";
import {MeshInputs} from "../attributes/input.js";
import {ATTRIBUTE} from "../../constants.js";
import {FaceVertices, VertexFaces} from "../../types.js";
import {SharedVertexColors, SharedVertexNormals, SharedVertexPositions, SharedVertexUVs} from "../attributes/vertex";

export class Vertices {
    public readonly position: SharedVertexPositions | UnsharedVertexPositions;
    public readonly normal: SharedVertexNormals | UnsharedVertexNormals | null;
    public readonly color: SharedVertexColors | UnsharedVertexColors | null;
    public readonly uv:  SharedVertexUVs | UnsharedVertexUVs | null;

    constructor(count: number, generate: number = 0, share: number = 0, inputs: MeshInputs) {
        this.position = share & ATTRIBUTE.position ?
            new SharedVertexPositions(count) :
            new UnsharedVertexPositions(count);

        if (inputs.normal || generate & ATTRIBUTE.position)
            this.normal = share & ATTRIBUTE.normal ?
                new SharedVertexNormals(count) :
                new UnsharedVertexNormals(count);

        if (inputs.color || generate & ATTRIBUTE.color)
            this.color = share & ATTRIBUTE.color ?
                new SharedVertexColors(count) :
                new UnsharedVertexColors(count);

        if (inputs.uv)
            this.uv = share & ATTRIBUTE.uv ?
                new SharedVertexUVs(count) :
                new UnsharedVertexUVs(count);
    }
}

export class Faces {
    public readonly position: FacePositions | null;
    public readonly normal: FaceNormals | null;
    public readonly color: FaceColors | null;

    constructor(count: number, generate: number = 0) {
        if (generate & ATTRIBUTE.position) this.position = new FacePositions(length);
        if (generate & ATTRIBUTE.normal) this.normal = new FaceNormals(length);
        if (generate & ATTRIBUTE.color) this.color = new FaceColors(length);
    }
}

export class MeshData {
    public readonly face_vertices: FaceVertices;
    public readonly vertex_faces: VertexFaces;

    constructor(
        public readonly inputs: MeshInputs,

        public readonly shared_vertex_attributes: ATTRIBUTE = 0,
        public readonly generated_vertex_attributes: ATTRIBUTE = 0,
        public readonly generated_face_attributes: ATTRIBUTE = 0,

        public readonly face_count: number = inputs.position.faces[0].length,
        public readonly vertex_count: number = inputs.position.vertices[0].length,

        public readonly vertices: Vertices = new Vertices(vertex_count, generated_vertex_attributes, shared_vertex_attributes, inputs),
        public readonly faces: Faces = new Faces(face_count, generated_face_attributes, inputs)
    ) {

    }
}