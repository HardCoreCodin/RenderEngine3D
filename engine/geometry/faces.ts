import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {
    FacePositions3D,
    FacePositions4D,
    VertexPositions3D,
    VertexPositions4D
} from "../buffers/attributes/positions.js";
import {FaceNormals3D, FaceNormals4D} from "../buffers/attributes/normals.js";
import {FaceColors3D, FaceColors4D, VertexColors3D, VertexColors4D} from "../buffers/attributes/colors.js";
import {IFaceVertices} from "../core/interfaces/buffers.js";
import {ATTRIBUTE, DIM} from "../core/constants.js";


export default class Faces
{
    positions: FacePositions3D | FacePositions4D;
    normals: FaceNormals3D | FaceNormals4D;
    colors: FaceColors3D | FaceColors4D;

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,

        position_dim: DIM,
        normal_dim?: DIM,
        color_dim?: DIM
    ): void {
        switch (position_dim) {
            case DIM._3D: this.positions = new FacePositions3D().autoInit(indices); break;
            case DIM._4D: this.positions = new FacePositions4D().autoInit(indices); break;
            default: throw `Invalid dimension for face positions: Expected 3D/4D got ${position_dim}!`;
        }

        if (include & ATTRIBUTE.normal) {
            switch (normal_dim) {
                case DIM._3D: this.normals = new FaceNormals3D().autoInit(indices); break;
                case DIM._4D: this.normals = new FaceNormals4D().autoInit(indices); break;
                default: throw `Invalid dimension for face normals: Expected 3D/4D got ${normal_dim}!`;
            }
        }

        if (include & ATTRIBUTE.color) {
            switch (color_dim) {
                case DIM._3D: this.colors = new FaceColors3D().autoInit(indices); break;
                case DIM._4D: this.colors = new FaceColors4D().autoInit(indices); break;
                default: throw `Invalid dimension for face colors: Expected 3D/4D got ${color_dim}!`;
            }
        }
    }

    pullNormalsFrom(vertex_potitions: VertexPositions3D | VertexPositions4D): void {
        if (vertex_potitions instanceof VertexPositions3D &&
            this.normals instanceof FaceNormals3D)
            this.normals.pull(vertex_potitions);
        else if (vertex_potitions instanceof VertexPositions4D &&
            this.normals instanceof FaceNormals4D)
            this.normals.pull(vertex_potitions);
        else
            throw `Can not pull ${this.normals} from ${vertex_potitions}!`;
    }

    pullColorsFrom(vertex_colors: VertexColors3D | VertexColors4D): void {
        if (vertex_colors instanceof VertexColors3D &&
            this.colors instanceof FaceColors3D)
            this.colors.pull(vertex_colors);
        else if (vertex_colors instanceof VertexColors4D &&
            this.colors instanceof FaceColors4D)
            this.colors.pull(vertex_colors);
        else
            throw `Can not pull ${this.colors} from ${vertex_colors}!`;
    }

    mul(matrix: Matrix3x3 | Matrix4x4, out: this): this {
        if (matrix instanceof Matrix3x3) {
            if (this.positions instanceof FacePositions3D &&
                out.positions instanceof FacePositions3D)
                this.positions.mul(matrix, out.positions);
            else
                throw `Can not multiply a 3x3 matrix with ${this.positions} to ${out.positions}`;

            if (this.normals && out.normals) {
                if (this.normals instanceof FaceNormals3D &&
                    out.normals instanceof FaceNormals3D)
                    this.normals.mul(matrix, out.normals);
                else
                    throw `Can not multiply a 3x3 matrix with ${this.normals} to ${out.normals}`;
            }
        } else if (matrix instanceof Matrix4x4) {
            if (this.positions instanceof FacePositions3D)
                this.positions.mul(matrix, out.positions);
            else if (
                this.positions instanceof FacePositions4D &&
                out.positions instanceof FacePositions4D
            )
                this.positions.mul(matrix, out.positions);

            if (this.normals instanceof FaceNormals3D)
                this.normals.mul(matrix, out.normals);
            else if (
                this.normals instanceof FaceNormals4D &&
                out.normals instanceof FaceNormals4D
            )
                this.normals.mul(matrix, out.normals);
        }

        return out;
    }

    imul(matrix: Matrix3x3 | Matrix4x4): this {
        if (matrix instanceof Matrix3x3) {
            if (this.positions instanceof FacePositions3D)
                this.positions.imul(matrix);
            else
                throw `Can not multiply a 3x3 matrix with ${this.positions}`;

            if (this.normals) {
                if (this.normals instanceof FaceNormals3D)
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