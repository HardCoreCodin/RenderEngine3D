import {Bounds3D} from "./bounds.js";
import {Faces3D} from "./faces.js";
import {Vertices} from "./vertices.js";
import {MeshInputs} from "./inputs.js";
import {MeshOptions} from "./options.js";
import {FaceVerticesInt32, VertexFacesInt32} from "./indices.js";
import {COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {VertexPositions3D} from "../buffers/attributes/positions.js";
import {VertexNormals3D} from "../buffers/attributes/normals.js";
import {VertexColors3D} from "../buffers/attributes/colors.js";
import {VertexUVs2D} from "../buffers/attributes/uvs.js";
import {IMesh} from "../_interfaces/geometry.js";
import {IMeshCallback} from "../_interfaces/render.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";


export default class Mesh implements IMesh {
    readonly faces = new Faces3D();
    readonly vertices = new Vertices(VertexPositions3D, VertexNormals3D, VertexColors3D, VertexUVs2D);
    readonly bbox = new Bounds3D();
    readonly on_mesh_loaded = new Set<IMeshCallback>();

    readonly face_count: number;
    readonly vertex_count: number;

    readonly face_vertices: IFaceVertices;
    readonly vertex_faces: IVertexFaces;

    constructor(
        readonly inputs: MeshInputs,
        readonly options: MeshOptions = new MeshOptions(),
        face_vertices?: IFaceVertices,
        vertex_faces?: IVertexFaces
    ) {
        inputs.sanitize();

        this.vertex_count = inputs.position.vertex_count;
        this.face_vertices = face_vertices || new FaceVerticesInt32().load(inputs.position);
        this.face_count = this.face_vertices.length;
        this.vertex_faces = vertex_faces || new VertexFacesInt32().load(this.face_vertices, this.vertex_count);
    }

    load(): this {
        this.options.sanitize(this.inputs);
        this.faces.init(this.face_vertices, this.options.face_attributes);
        this.vertices.init(this.face_vertices, this.options.vertex_attributes, this.options.share, this.vertex_count);

        this.vertices.positions.load(this.inputs.position);
        this.bbox.load(this.vertices.positions);

        if (this.options.include_uvs)
            this.vertices.uvs.load(this.inputs.uv);

        switch (this.options.normal) {
            case NORMAL_SOURCING.NO_VERTEX__NO_FACE:
                break;
            case NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.faces.normals.pull(this.vertices.positions);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertices.normals.load(this.inputs.normal);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertices.normals.load(this.inputs.normal);
                this.faces.normals.pull(this.vertices.positions);
                break;
            case NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.faces.normals.pull(this.vertices.positions);
                this.vertices.normals.pull(this.faces.normals, this.vertex_faces);
                break;
        }

        switch (this.options.color) {
            case COLOR_SOURCING.NO_VERTEX__NO_FACE:
                break;
            case COLOR_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.faces.colors.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__NO_FACE:
                this.vertices.colors.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GENERATE_FACE:
                this.faces.colors.generate();
                this.vertices.colors.generate();
                break;
            case COLOR_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.faces.colors.generate();
                this.vertices.colors.pull(this.faces.colors, this.vertex_faces);
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GATHER_FACE:
                this.vertices.colors.generate();
                this.faces.colors.pull(this.vertices.colors);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertices.colors.load(this.inputs.color);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertices.colors.load(this.inputs.color);
                this.faces.colors.generate();
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                this.vertices.colors.load(this.inputs.color);
                this.faces.colors.pull(this.vertices.colors);
        }

        if (this.on_mesh_loaded.size)
            for (const mesh_loaded of this.on_mesh_loaded)
                mesh_loaded(this);

        return this;
    }
}