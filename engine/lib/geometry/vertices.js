import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import { VertexPositions3D, VertexPositions4D } from "../buffers/attributes/positions.js";
import { FaceNormals3D, FaceNormals4D, VertexNormals3D, VertexNormals4D } from "../buffers/attributes/normals.js";
import { FaceColors3D, FaceColors4D, VertexColors3D, VertexColors4D } from "../buffers/attributes/colors.js";
import { VertexUVs2D, VertexUVs3D } from "../buffers/attributes/uvs.js";
export default class Vertices {
    init(indices, include, share, count, position_dim, normal_dim, color_dim, uv_dim) {
        switch (position_dim) {
            case 3 /* _3D */:
                this.positions = new VertexPositions3D().autoInit(count, indices, share & 1 /* position */);
                break;
            case 4 /* _4D */:
                this.positions = new VertexPositions4D().autoInit(count, indices, share & 1 /* position */);
                break;
            default: throw `Invalid dimension for face positions: Expected 3D/4D got ${position_dim}!`;
        }
        if (include & 2 /* normal */) {
            switch (normal_dim) {
                case 3 /* _3D */:
                    this.normals = new VertexNormals3D().autoInit(count, indices, share & 2 /* normal */);
                    break;
                case 4 /* _4D */:
                    this.normals = new VertexNormals4D().autoInit(count, indices, share & 2 /* normal */);
                    break;
                default: throw `Invalid dimension for face normals: Expected 3D/4D got ${normal_dim}!`;
            }
        }
        if (include & 4 /* color */) {
            switch (color_dim) {
                case 3 /* _3D */:
                    this.colors = new VertexColors3D().autoInit(count, indices, share & 4 /* color */);
                    break;
                case 4 /* _4D */:
                    this.colors = new VertexColors4D().autoInit(count, indices, share & 4 /* color */);
                    break;
                default: throw `Invalid dimension for face colors: Expected 3D/4D got ${color_dim}!`;
            }
        }
        if (include & 8 /* uv */) {
            switch (uv_dim) {
                case 3 /* _3D */:
                    this.uvs = new VertexUVs3D().autoInit(count, indices, share & 8 /* uv */);
                    break;
                case 2 /* _2D */:
                    this.uvs = new VertexUVs2D().autoInit(count, indices, share & 8 /* uv */);
                    break;
                default: throw `Invalid dimension for face uvs: Expected 3D/2D got ${uv_dim}!`;
            }
        }
    }
    pullNormalsFrom(face_normals, vertex_faces) {
        if (face_normals instanceof FaceNormals3D &&
            this.normals instanceof VertexNormals3D)
            this.normals.pull(face_normals, vertex_faces);
        else if (face_normals instanceof FaceNormals4D &&
            this.normals instanceof VertexNormals4D)
            this.normals.pull(face_normals, vertex_faces);
        else
            throw `Can not pull ${this.normals} from ${face_normals}!`;
    }
    pullColorsFrom(face_colors, vertex_faces) {
        if (face_colors instanceof FaceColors3D &&
            this.colors instanceof VertexColors3D)
            this.colors.pull(face_colors, vertex_faces);
        else if (face_colors instanceof FaceColors4D &&
            this.colors instanceof VertexColors4D)
            this.colors.pull(face_colors, vertex_faces);
        else
            throw `Can not pull ${this.normals} from ${face_colors}!`;
    }
    mul(matrix, out) {
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
        }
        else if (matrix instanceof Matrix4x4) {
            if (this.positions instanceof VertexPositions3D)
                this.positions.mul(matrix, out.positions);
            else if (this.positions instanceof VertexPositions4D &&
                out.positions instanceof VertexPositions4D)
                this.positions.mul(matrix, out.positions);
            if (this.normals instanceof VertexNormals3D)
                this.normals.mul(matrix, out.normals);
            else if (this.normals instanceof VertexNormals4D &&
                out.normals instanceof VertexNormals4D)
                this.normals.mul(matrix, out.normals);
        }
        return out;
    }
    imul(matrix) {
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
        }
        else if (matrix instanceof Matrix4x4) {
            this.positions.imul(matrix);
            if (this.normals)
                this.normals.imul(matrix);
        }
        return this;
    }
}
//# sourceMappingURL=vertices.js.map