import {ATTRIBUTE} from "../../constants.js";
import {Matrix3x3} from "../accessors/matrix3x3.js";
import {Matrix4x4} from "../accessors/matrix4x4.js";
import {FacePositions3D, FacePositions4D} from "./positions.js";
import {FaceNormals3D, FaceNormals4D} from "./normals.js";
import {FaceColors3D, FaceColors4D} from "./colors.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {FacePositions2D} from "../attributes/face/positions.js";

abstract class Faces {
    protected abstract _createPositions(face_vertices: IFaceVertices): FacePositions2D|FacePositions3D|FacePositions4D;
    protected abstract _createNormals(face_vertices: IFaceVertices): FaceNormals3D|FaceNormals4D;
    protected abstract _createColors(face_vertices: IFaceVertices): FaceColors3D|FaceColors4D;

    positions: FacePositions2D|FacePositions3D|FacePositions4D|null;
    normals: FaceNormals3D|FaceNormals4D|null;
    colors: FaceColors3D|FaceColors4D|null;

    init(
        face_vertices: IFaceVertices,
        include: ATTRIBUTE,

        positions?: FacePositions2D|FacePositions3D|FacePositions4D,
        normals?: FaceNormals3D|FaceNormals4D,
        colors?: FaceColors3D|FaceColors4D
    ): void {
        this.positions = include & ATTRIBUTE.position ? positions || this._createPositions(face_vertices): null;
        this.normals = include & ATTRIBUTE.normal ? normals || this._createNormals(face_vertices) : null;
        this.colors = include & ATTRIBUTE.color ? colors || this._createColors(face_vertices) : null;
    }
}

export class Faces3D extends Faces {
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

    protected _createPositions(face_vertices: IFaceVertices): FacePositions3D {
        return new FacePositions3D(face_vertices);
    }

    protected _createNormals(face_vertices: IFaceVertices): FaceNormals3D {
        return new FaceNormals3D(face_vertices);
    }

    protected _createColors(face_vertices: IFaceVertices): FaceColors3D {
        return new FaceColors3D(face_vertices);
    }
}

export class Faces4D extends Faces {
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

    protected _createPositions(face_vertices: IFaceVertices): FacePositions4D {
        return new FacePositions4D(face_vertices);
    }

    protected _createNormals(face_vertices: IFaceVertices): FaceNormals4D {
        return new FaceNormals4D(face_vertices);
    }

    protected _createColors(face_vertices: IFaceVertices): FaceColors4D {
        return new FaceColors4D(face_vertices);
    }
}