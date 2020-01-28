import {ATTRIBUTE} from "../../constants.js";
import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {FaceColors3D, FaceColors4D} from "../buffers/attributes/colors.js";
import {FaceNormals3D, FaceNormals4D} from "../buffers/attributes/normals.js";
import {FacePositions3D, FacePositions4D} from "../buffers/attributes/positions.js";
import {IFaceVertices} from "../_interfaces/buffers.js";


export class Faces3D {
    positions: FacePositions3D;
    normals: FaceNormals3D;
    colors: FaceColors3D;

    init(
        face_vertices: IFaceVertices,
        include: ATTRIBUTE,

        positions?: FacePositions3D,
        normals?: FaceNormals3D,
        colors?: FaceColors3D
    ): void {
        this.positions = include & ATTRIBUTE.position ? positions || new FacePositions3D(face_vertices).autoInit(): null;
        this.normals = include & ATTRIBUTE.normal ? normals || new FaceNormals3D(face_vertices).autoInit() : null;
        this.colors = include & ATTRIBUTE.color ? colors || new FaceColors3D(face_vertices).autoInit() : null;
    }

    mul(matrix: Matrix3x3|Matrix4x4, out: this|Faces4D): typeof out {
        this.positions.mul(matrix, out.positions);
        this.normals!.mul(matrix, out.normals);

        return out;
    }

    imul(matrix: Matrix3x3|Matrix4x4): this {
        this.positions.imul(matrix);
        this.normals!.imul(matrix);

        return this;
    }
}

export class Faces4D {
    positions: FacePositions4D;
    normals: FaceNormals4D;
    colors: FaceColors4D;

    init(
        face_vertices: IFaceVertices,
        include: ATTRIBUTE,

        positions?: FacePositions4D,
        normals?: FaceNormals4D,
        colors?: FaceColors4D
    ): void {
        this.positions = include & ATTRIBUTE.position ? positions || new FacePositions4D(face_vertices).autoInit(): null;
        this.normals = include & ATTRIBUTE.normal ? normals || new FaceNormals4D(face_vertices).autoInit() : null;
        this.colors = include & ATTRIBUTE.color ? colors || new FaceColors4D(face_vertices).autoInit() : null;
    }

    mul(matrix: Matrix4x4, out: this): this {
        this.positions.mul(matrix, out.positions);
        this.normals!.mul(matrix, out.normals);

        return out;
    }

    imul(matrix: Matrix4x4): this {
        this.positions.imul(matrix);
        this.normals!.imul(matrix);

        return this;
    }
}