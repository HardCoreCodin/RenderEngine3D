import {MeshOptions} from "./options.js";
import {ATTRIBUTE} from "../../constants.js";
import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {FacePositions3D, FacePositions4D} from "./positions.js";
import {FaceNormals3D, FaceNormals4D} from "./normals.js";
import {FaceColors3D, FaceColors4D} from "./colors.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {
    IFaceColors,
    IFaceColorsConstructor,
    IFaceNormals,
    IFaceNormalsConstructor,
    IFacePositions,
    IFacePositionsConstructor,
    IFaces,
    IFaces3D, IFaces4D
} from "../_interfaces/attributes.js";

class Faces implements IFaces {
    readonly FacePositions: IFacePositionsConstructor;
    readonly FaceNormals: IFaceNormalsConstructor;
    readonly FaceColors: IFaceColorsConstructor;

    readonly positions: IFacePositions | null;
    readonly normals: IFaceNormals | null;
    readonly colors: IFaceColors | null;

    constructor(
        public face_vertices: IFaceVertices,
        public mesh_options: MeshOptions,

        positions?: IFacePositions,
        normals?: IFaceNormals,
        colors?: IFaceColors
    ) {
        const included = mesh_options.face_attributes;
        this.positions = included & ATTRIBUTE.position ? positions || new this.FacePositions(face_vertices) : null;
        this.normals = included & ATTRIBUTE.normal ? normals || new this.FaceNormals(face_vertices) : null;
        this.colors = included & ATTRIBUTE.color ? colors || new this.FaceColors(face_vertices) : null;
    }
}

export class Faces3D extends Faces implements IFaces3D {
    readonly FacePositions = FacePositions3D;
    readonly FaceNormals = FaceNormals3D;
    readonly FaceColors = FaceColors3D;

    readonly positions: FacePositions3D;
    readonly normals: FaceNormals3D;
    readonly colors: FaceColors3D;

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this.positions.matmul(matrix, out.positions);
            this.normals!.matmul(matrix, out.normals);

            return out;
        }

        this.positions.matmul(matrix);
        this.normals!.matmul(matrix);

        return this;
    }

    mat4mul(matrix: Matrix4x4, out: Faces4D): Faces4D {
        this.positions.mat4mul(matrix, out.positions);
        this.normals!.mat4mul(matrix, out.normals);

        return out;
    }
}

export class Faces4D extends Faces implements IFaces4D {
    readonly FacePositions = FacePositions4D;
    readonly FaceNormals = FaceNormals4D;
    readonly FaceColors = FaceColors4D;

    readonly positions: FacePositions4D;
    readonly normals: FaceNormals4D;
    readonly colors: FaceColors4D;

    matmul(matrix: Matrix4x4, out?: this): this {
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