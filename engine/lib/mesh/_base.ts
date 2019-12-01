import {MeshInputs} from "./inputs.js";
import {MeshOptions} from "./options.js";
import {COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {FaceVertices} from "./face/vertices.js";
import {VertexFaces} from "./vertex/faces.js";
import {Vertices3D} from "./vertex/attributes.js";
import {Faces3D} from "./face/attributes.js";
import {AABB} from "./bounds.js";

export default class Mesh {
    public readonly face: Faces3D;
    public readonly vertex: Vertices3D;
    public readonly bounds = new AABB();

    constructor(
        public inputs: MeshInputs,
        public options = new MeshOptions(),

        public readonly face_count: number = inputs.position.faces_vertices[0].length,
        public readonly vertex_count: number = inputs.position.vertices[0].length,

        public readonly vertex_faces: VertexFaces = new VertexFaces(inputs.sanitize().position),
        public readonly face_vertices: FaceVertices = new FaceVertices(inputs.sanitize().position)
    ) {
        options.sanitize(this.inputs);

        this.face = new Faces3D(face_vertices, options);
        this.vertex = new Vertices3D(face_vertices, options);
    }

    load(): this {
        this.vertex.positions.load(this.inputs.position);
        this.bounds.load(this.vertex.positions);

        if (this.options.include_uvs)
            this.vertex.uvs.load(this.inputs.uv);

        switch (this.options.normal) {
            case NORMAL_SOURCING.NO_VERTEX__NO_FACE:
                break;
            case NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.face.normals.pull(this.vertex.positions);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertex.normals.load(this.inputs.normal);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertex.normals.load(this.inputs.normal);
                this.face.normals.pull(this.vertex.positions);
                break;
            case NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.face.normals.pull(this.vertex.positions);
                this.vertex.normals.pull(this.face.normals, this.vertex_faces);
                break;
        }

        switch (this.options.color) {
            case COLOR_SOURCING.NO_VERTEX__NO_FACE:
                break;
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
                this.vertex.colors.load(this.inputs.color);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertex.colors.load(this.inputs.color);
                this.face.colors.generate();
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                this.vertex.colors.load(this.inputs.color);
                this.face.colors.pull(this.vertex.colors);
        }

        return this;
    }
}