import {Faces3D} from "./faces.js";
import {Bounds3D} from "./bounds.js";
import {Vertices3D} from "./vertices.js";
import {MeshInputs} from "./inputs.js";
import {MeshOptions} from "./options.js";
import {FaceVerticesInt32, VertexFacesInt32} from "./indices.js";
import {COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {IMesh, IMeshData3D} from "../_interfaces/geometry.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";

export default class Mesh implements IMesh {
    readonly data: MeshData3D;
    readonly bbox = new Bounds3D();

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

        this.data = new MeshData3D(vertex_count, face_vertices, options);
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

export class MeshData3D implements IMeshData3D {
    constructor(
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        readonly mesh_options: MeshOptions,
        readonly faces: Faces3D = new Faces3D(face_vertices, mesh_options),
        readonly vertices: Vertices3D = new Vertices3D(vertex_count, face_vertices, mesh_options)
    ) {}
}
//
// export class MeshData4D {
//     constructor(
//         public face_vertices: IFaceVertices,
//         public mesh_options: MeshOptions,
//
//         public readonly faces: Faces4D = new Faces4D(face_vertices, mesh_options),
//         public readonly vertices: Vertices4D = new Vertices4D(face_vertices, mesh_options)
//     ) {}
//
//     mul(matrix: Matrix4x4, out?: this): this {
//         if (out) {
//             this.vertices.mul(matrix, out.vertices);
//             this.faces.mul(matrix, out.faces);
//             return out;
//         }
//
//         this.vertices.mul(matrix);
//         this.faces.mul(matrix);
//         return this;
//     }
// }
