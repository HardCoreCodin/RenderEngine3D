import {MeshOptions} from "./options.js";
import {ATTRIBUTE} from "../../constants.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {
    IVertexColors,
    IVertexColorsConstructor,
    IVertexNormals,
    IVertexNormalsConstructor,
    IVertexPositions,
    IVertexPositionsConstructor, IVertexUVs, IVertexUVsConstructor
} from "../_interfaces/attributes.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {VertexNormals3D, VertexNormals4D} from "./normals.js";
import {VertexColors3D, VertexColors4D} from "./colors.js";
import {VertexUVs2D, VertexUVs3D} from "./uvs.js";


export class Vertices {
    protected readonly VertexPositions: IVertexPositionsConstructor;
    protected readonly VertexNormals: IVertexNormalsConstructor;
    protected readonly VertexColors: IVertexColorsConstructor;
    protected readonly VertexUVs: IVertexUVsConstructor;

    public positions: IVertexPositions;
    public normals: IVertexNormals|null;
    public colors: IVertexColors|null;
    public uvs: IVertexUVs|null;

    constructor(
        public face_vertices: IFaceVertices,
        public mesh_options: MeshOptions,

        positions?: IVertexPositions,
        normals?: IVertexNormals,
        colors?: IVertexColors,
        uvs?: IVertexUVs,
    ) {
        const included = mesh_options.vertex_attributes;

        this.positions = positions || new this.VertexPositions(
            face_vertices,mesh_options.share & ATTRIBUTE.position
        );

        this.normals = included & ATTRIBUTE.normal ?
            normals || new this.VertexNormals(
                face_vertices,mesh_options.share & ATTRIBUTE.normal
            ) : null;

        this.colors = included & ATTRIBUTE.color ?
            colors || new this.VertexColors(
                face_vertices,mesh_options.share & ATTRIBUTE.color
            ) : null;

        this.uvs = included & ATTRIBUTE.uv ?
            uvs || new this.VertexUVs(
                face_vertices,mesh_options.share & ATTRIBUTE.color
            ) : null;
    }
}

export class Vertices3D extends Vertices {
    protected readonly VertexPositions = VertexPositions3D;
    protected readonly VertexNormals = VertexNormals3D;
    protected readonly VertexColors = VertexColors3D;
    protected readonly VertexUVs = VertexUVs2D;

    public positions: VertexPositions3D;
    public normals: VertexNormals3D;
    public colors: VertexColors3D;
    public uvs: VertexUVs2D;
}

export class Vertices4D extends Vertices {
    protected readonly VertexPositions = VertexPositions4D;
    protected readonly VertexNormals = VertexNormals4D;
    protected readonly VertexColors = VertexColors4D;
    protected readonly VertexUVs = VertexUVs3D;

    public positions: VertexPositions4D;
    public normals: VertexNormals4D;
    public colors: VertexColors4D;
    public uvs: VertexUVs3D;

    mul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this.positions.matmul(matrix, out.positions);
            this.normals!.matmul(matrix, out.normals);
            return out;
        }

        this.positions.matmul(matrix);
        this.normals!.matmul(matrix);
        return this;
    }
}