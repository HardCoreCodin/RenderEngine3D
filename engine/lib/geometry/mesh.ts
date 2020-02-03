import {Bounds3D} from "./bounds.js";
import Faces from "./faces.js";
import Vertices from "./vertices.js";
import {MeshInputs} from "./inputs.js";
import {MeshOptions} from "./options.js";
import {FaceVerticesInt32, VertexFacesInt32} from "./indices.js";
import {ATTRIBUTE, COLOR_SOURCING, DIM, NORMAL_SOURCING} from "../../constants.js";
import {IMesh} from "../_interfaces/geometry.js";
import {IMeshCallback} from "../_interfaces/render.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";


export default class Mesh
    implements IMesh
{
    readonly faces = new Faces();
    readonly vertices = new Vertices();
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

        const face_attrs = this.options.face_attributes;
        const vertex_attrs = this.options.vertex_attributes;

        const pd = this.inputs.position.dim;
        const nd = this.inputs.normal ? this.inputs.normal.dim : 0;
        const cd = this.inputs.color ? this.inputs.color.dim : 0;
        const ud = this.inputs.uv ? this.inputs.uv.dim : 0;

        const fnd = nd || face_attrs & ATTRIBUTE.normal ? pd : undefined;
        const fcd = cd || face_attrs & ATTRIBUTE.color ? DIM._3D : undefined;

        const vnd = nd || vertex_attrs & ATTRIBUTE.normal ? pd : undefined;
        const vcd = cd || vertex_attrs & ATTRIBUTE.color ? DIM._3D : undefined;

        this.faces.init(this.face_vertices, face_attrs, pd, fnd, fcd);
        this.vertices.init(this.face_vertices, vertex_attrs, this.options.share, this.vertex_count, pd, vnd, vcd, ud);

        this.vertices.positions.load(this.inputs.position);
        this.bbox.load(this.vertices.positions);

        if (this.options.include_uvs)
            this.vertices.uvs.load(this.inputs.uv);

        switch (this.options.normal) {
            case NORMAL_SOURCING.NO_VERTEX__NO_FACE:
                break;
            case NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.faces.pullNormalsFrom(this.vertices.positions);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                this.vertices.normals.load(this.inputs.normal);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.vertices.normals.load(this.inputs.normal);
                this.faces.pullNormalsFrom(this.vertices.positions);
                break;
            case NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.faces.pullNormalsFrom(this.vertices.positions);
                this.vertices.pullNormalsFrom(this.faces.normals, this.vertex_faces);
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
                this.vertices.pullColorsFrom(this.faces.colors, this.vertex_faces);
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GATHER_FACE:
                this.vertices.colors.generate();
                this.faces.pullColorsFrom(this.vertices.colors);
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
                this.faces.pullColorsFrom(this.vertices.colors);
        }

        if (this.on_mesh_loaded.size)
            for (const mesh_loaded of this.on_mesh_loaded)
                mesh_loaded(this);

        return this;
    }
}