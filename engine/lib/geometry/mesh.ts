import {MeshInputs} from "./inputs.js";
import {MeshOptions} from "./options.js";
import {COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {Vertices3D, Vertices4D} from "./vertices.js";
import {Faces3D, Faces4D} from "./faces.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";
import {FaceVerticesInt32, VertexFacesInt32} from "./indices.js";
import {Matrix4x4} from "../accessors/matrix.js";
import BBox from "./bounds.js";

export default class Mesh {
    public readonly data: MeshData3D;
    public readonly bbox = new BBox();

    constructor(
        public inputs: MeshInputs,
        public options: MeshOptions = new MeshOptions(),

        public readonly face_vertices: IFaceVertices = new FaceVerticesInt32(inputs.sanitize().position),

        public readonly vertex_count: number = inputs.position.vertices[0].length,
        public readonly vertex_faces: IVertexFaces = new VertexFacesInt32(face_vertices, vertex_count),

        public readonly face_count: number = face_vertices.length,

    ) {
        options.sanitize(this.inputs);

        this.data = new MeshData3D(face_vertices, options);
    }

    load(): this {
        this.data.vertices.positions.load(this.inputs.position);
        this.bbox.load(this.data.vertices.positions);

        if (this.options.include_uvs)
            this.data.vertices.uvs.load(this.inputs.uv);

        switch (this.options.normal) {
            case NORMAL_SOURCING.NO_VERTEX__NO_FACE:
                break;
            case NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.data.faces.normals.pull(this.data.vertices.positions);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                this.data.vertices.normals.load(this.inputs.normal);
                break;
            case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.data.vertices.normals.load(this.inputs.normal);
                this.data.faces.normals.pull(this.data.vertices.positions);
                break;
            case NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.data.faces.normals.pull(this.data.vertices.positions);
                this.data.vertices.normals.pull(this.data.faces.normals, this.vertex_faces);
                break;
        }

        switch (this.options.color) {
            case COLOR_SOURCING.NO_VERTEX__NO_FACE:
                break;
            case COLOR_SOURCING.NO_VERTEX__GENERATE_FACE:
                this.data.faces.colors.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__NO_FACE:
                this.data.vertices.colors.generate();
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GENERATE_FACE:
                this.data.faces.colors.generate();
                this.data.vertices.colors.generate();
                break;
            case COLOR_SOURCING.GATHER_VERTEX__GENERATE_FACE:
                this.data.faces.colors.generate();
                this.data.vertices.colors.pull(this.data.faces.colors, this.vertex_faces);
                break;
            case COLOR_SOURCING.GENERATE_VERTEX__GATHER_FACE:
                this.data.vertices.colors.generate();
                this.data.faces.colors.pull(this.data.vertices.colors);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                this.data.vertices.colors.load(this.inputs.color);
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                this.data.vertices.colors.load(this.inputs.color);
                this.data.faces.colors.generate();
                break;
            case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                this.data.vertices.colors.load(this.inputs.color);
                this.data.faces.colors.pull(this.data.vertices.colors);
        }

        return this;
    }
}

export class MeshData3D {
    constructor(
        public face_vertices: IFaceVertices,
        public mesh_options: MeshOptions,

        public readonly faces: Faces3D = new Faces3D(face_vertices, mesh_options),
        public readonly vertices: Vertices3D = new Vertices3D(face_vertices, mesh_options)
    ) {}

    // homogenize(out?: MeshData4D): MeshData4D {
    //     if (out) {
    //         this.faces.homogenize(out.faces);
    //         this.vertices.homogenize(out.vertices);
    //         return out;
    //     }
    //
    //     return new MeshData4D(
    //         this.face_vertices,
    //         this.mesh_options,
    //
    //         this.faces.homogenize(),
    //         this.vertices.homogenize()
    //     );
    // }
}

export class MeshData4D {
    constructor(
        public face_vertices: IFaceVertices,
        public mesh_options: MeshOptions,

        public readonly faces: Faces4D = new Faces4D(face_vertices, mesh_options),
        public readonly vertices: Vertices4D = new Vertices4D(face_vertices, mesh_options)
    ) {}

    mul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this.vertices.mul(matrix, out.vertices);
            this.faces.mul(matrix, out.faces);
            return out;
        }

        this.vertices.mul(matrix);
        this.faces.mul(matrix);
        return this;
    }
}
