import {Faces3D} from "./faces.js";
import {Bounds3D} from "./bounds.js";
import {Vertices3D} from "./vertices.js";
import {MeshInputs} from "./inputs.js";
import {MeshOptions} from "./options.js";
import {FaceVerticesInt32, VertexFacesInt32} from "./indices.js";
import {COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {IMesh} from "../_interfaces/geometry.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";
import {IMeshCallback} from "../_interfaces/render.js";

export default class Mesh implements IMesh {
    readonly faces: Faces3D;
    readonly vertices: Vertices3D;
    readonly bbox = new Bounds3D();
    readonly on_mesh_loaded = new Set<IMeshCallback>();

    constructor(
        public inputs: MeshInputs,
        public options: MeshOptions = new MeshOptions(),
        readonly face_vertices: IFaceVertices = new FaceVerticesInt32().load(inputs.sanitize().position),
        readonly vertex_count: number = inputs.position.vertex_count,
        readonly vertex_faces: IVertexFaces = new VertexFacesInt32().load(face_vertices, vertex_count),
        readonly face_count: number = face_vertices.length,
        readonly vertex_arrays = VECTOR_4D_ALLOCATOR.allocateBuffer(face_count * 2)
    ) {
        options.sanitize(this.inputs);

        this.faces = new Faces3D(face_vertices, options);
        this.vertices = new Vertices3D(vertex_count, face_vertices, options);
    }

    load(): this {
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