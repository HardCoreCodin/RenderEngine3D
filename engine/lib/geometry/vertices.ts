import {ATTRIBUTE} from "../../constants.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {VertexNormals3D, VertexNormals4D} from "./normals.js";
import {VertexColors3D, VertexColors4D} from "./colors.js";
import {VertexUVs2D, VertexUVs3D} from "./uvs.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {IMeshOptions} from "../_interfaces/geometry.js";
import {
    IVertexColors,
    IVertexColorsConstructor,
    IVertexNormals,
    IVertexNormalsConstructor,
    IVertexPositions,
    IVertexPositionsConstructor,
    IVertexUVs,
    IVertexUVsConstructor,
    IVertices,
    IVertices3D,
    IVertices4D
} from "../_interfaces/attributes.js";


export class Vertices implements IVertices {
    readonly VertexPositions: IVertexPositionsConstructor;
    readonly VertexNormals: IVertexNormalsConstructor;
    readonly VertexColors: IVertexColorsConstructor;
    readonly VertexUVs: IVertexUVsConstructor;

    readonly positions: IVertexPositions;
    readonly normals: IVertexNormals | null;
    readonly colors: IVertexColors | null;
    readonly uvs: IVertexUVs | null;

    constructor(
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        readonly mesh_options: IMeshOptions,

        positions?: IVertexPositions,
        normals?: IVertexNormals,
        colors?: IVertexColors,
        uvs?: IVertexUVs,
    ) {
        const included = mesh_options.vertex_attributes;

        this.positions = positions || new this.VertexPositions(
            vertex_count,
            face_vertices,
            mesh_options.share & ATTRIBUTE.position
        );

        this.normals = included & ATTRIBUTE.normal ?
            normals || new this.VertexNormals(
                vertex_count,
                face_vertices,
            mesh_options.share & ATTRIBUTE.normal
            ) : null;

        this.colors = included & ATTRIBUTE.color ?
            colors || new this.VertexColors(
                vertex_count,
                face_vertices,
            mesh_options.share & ATTRIBUTE.color
            ) : null;

        this.uvs = included & ATTRIBUTE.uv ?
            uvs || new this.VertexUVs(
                vertex_count,
                face_vertices,
            mesh_options.share & ATTRIBUTE.color
            ) : null;
    }
}

export class Vertices3D extends Vertices implements IVertices3D {
    readonly VertexPositions = VertexPositions3D;
    readonly VertexNormals = VertexNormals3D;
    readonly VertexColors = VertexColors3D;
    readonly VertexUVs = VertexUVs2D;

    readonly positions: VertexPositions3D;
    readonly normals: VertexNormals3D;
    readonly colors: VertexColors3D;
    readonly uvs: VertexUVs2D;
}

export class Vertices4D extends Vertices implements IVertices4D {
    readonly VertexPositions = VertexPositions4D;
    readonly VertexNormals = VertexNormals4D;
    readonly VertexColors = VertexColors4D;
    readonly VertexUVs = VertexUVs3D;

    readonly positions: VertexPositions4D;
    readonly normals: VertexNormals4D;
    readonly colors: VertexColors4D;
    readonly uvs: VertexUVs3D;

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