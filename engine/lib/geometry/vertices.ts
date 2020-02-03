import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {VertexPositions3D, VertexPositions4D} from "../buffers/attributes/positions.js";
import {FaceNormals3D, FaceNormals4D, VertexNormals3D, VertexNormals4D} from "../buffers/attributes/normals.js";
import {FaceColors3D, FaceColors4D, VertexColors3D, VertexColors4D} from "../buffers/attributes/colors.js";
import {VertexUVs2D, VertexUVs3D} from "../buffers/attributes/uvs.js";
import {ATTRIBUTE, DIM} from "../../constants.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";


export default class Vertices
{
    positions: VertexPositions3D | VertexPositions4D;
    normals: VertexNormals3D | VertexNormals4D;
    colors: VertexColors3D | VertexColors4D;
    uvs: VertexUVs2D | VertexUVs3D;

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,
        share: ATTRIBUTE,
        count: number,


        position_dim: DIM,
        normal_dim?: DIM,
        color_dim?: DIM,
        uv_dim?: DIM
    ): void {
        switch (position_dim) {
            case DIM._3D: this.positions = new VertexPositions3D().autoInit(count, indices, share & ATTRIBUTE.position); break;
            case DIM._4D: this.positions = new VertexPositions4D().autoInit(count, indices, share & ATTRIBUTE.position); break;
            default: throw `Invalid dimension for face positions: Expected 3D/4D got ${position_dim}!`;
        }

        if (include & ATTRIBUTE.normal) {
            switch (normal_dim) {
                case DIM._3D: this.normals = new VertexNormals3D().autoInit(count, indices, share & ATTRIBUTE.normal); break;
                case DIM._4D: this.normals = new VertexNormals4D().autoInit(count, indices, share & ATTRIBUTE.normal); break;
                default: throw `Invalid dimension for face normals: Expected 3D/4D got ${normal_dim}!`;
            }
        }

        if (include & ATTRIBUTE.color) {
            switch (color_dim) {
                case DIM._3D: this.colors = new VertexColors3D().autoInit(count, indices, share & ATTRIBUTE.color); break;
                case DIM._4D: this.colors = new VertexColors4D().autoInit(count, indices, share & ATTRIBUTE.color); break;
                default: throw `Invalid dimension for face colors: Expected 3D/4D got ${color_dim}!`;
            }
        }

        if (include & ATTRIBUTE.uv) {
            switch (uv_dim) {
                case DIM._3D: this.uvs = new VertexUVs3D().autoInit(count, indices, share & ATTRIBUTE.uv); break;
                case DIM._2D: this.uvs = new VertexUVs2D().autoInit(count, indices, share & ATTRIBUTE.uv); break;
                default: throw `Invalid dimension for face uvs: Expected 3D/2D got ${uv_dim}!`;
            }
        }
    }

    pullNormalsFrom(face_normals: FaceNormals3D | FaceNormals4D, vertex_faces: IVertexFaces): void {
        if (face_normals instanceof FaceNormals3D &&
            this.normals instanceof VertexNormals3D)
            this.normals.pull(face_normals, vertex_faces);
        else if (face_normals instanceof FaceNormals4D &&
            this.normals instanceof VertexNormals4D)
            this.normals.pull(face_normals, vertex_faces);
        else
            throw `Can not pull ${this.normals} from ${face_normals}!`;
    }

    pullColorsFrom(face_colors: FaceColors3D | FaceColors4D, vertex_faces: IVertexFaces): void {
        if (face_colors instanceof FaceColors3D &&
            this.colors instanceof VertexColors3D)
            this.colors.pull(face_colors, vertex_faces);
        else if (face_colors instanceof FaceColors4D &&
            this.colors instanceof VertexColors4D)
            this.colors.pull(face_colors, vertex_faces);
        else
            throw `Can not pull ${this.normals} from ${face_colors}!`;
    }

    mul(matrix: Matrix3x3 | Matrix4x4, out: this): this {
        if (matrix instanceof Matrix3x3) {
            if (this.positions instanceof VertexPositions3D &&
                out.positions instanceof VertexPositions3D)
                this.positions.mul(matrix, out.positions);
            else
                throw `Can not multiply a 3x3 matrix with ${this.positions} to ${out.positions}`;

            if (this.normals && out.normals) {
                if (this.normals instanceof VertexNormals3D &&
                    out.normals instanceof VertexNormals3D)
                    this.normals.mul(matrix, out.normals);
                else
                    throw `Can not multiply a 3x3 matrix with ${this.normals} to ${out.normals}`;
            }
        } else if (matrix instanceof Matrix4x4) {
            if (this.positions instanceof VertexPositions3D)
                this.positions.mul(matrix, out.positions);
            else if (
                this.positions instanceof VertexPositions4D &&
                out.positions instanceof VertexPositions4D
            )
                this.positions.mul(matrix, out.positions);

            if (this.normals instanceof VertexNormals3D)
                this.normals.mul(matrix, out.normals);
            else if (
                this.normals instanceof VertexNormals4D &&
                out.normals instanceof VertexNormals4D
            )
                this.normals.mul(matrix, out.normals);
        }

        return out;
    }

    imul(matrix: Matrix3x3 | Matrix4x4): this {
        if (matrix instanceof Matrix3x3) {
            if (this.positions instanceof VertexPositions3D)
                this.positions.imul(matrix);
            else
                throw `Can not multiply a 3x3 matrix with ${this.positions}`;

            if (this.normals) {
                if (this.normals instanceof VertexNormals3D)
                    this.normals.imul(matrix);
                else
                    throw `Can not multiply a 3x3 matrix with ${this.normals}`;
            }
        } else if (matrix instanceof Matrix4x4) {
            this.positions.imul(matrix);
            if (this.normals)
                this.normals.imul(matrix);
        }

        return this;
    }
}