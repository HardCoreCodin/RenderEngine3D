import Matrix4x4 from "../accessors/matrix4x4.js";
import {ATTRIBUTE} from "../../constants.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {VertexNormals3D, VertexNormals4D} from "./normals.js";
import {VertexColors3D, VertexColors4D} from "./colors.js";
import {VertexUVs2D, VertexUVs3D} from "./uvs.js";
import {IFaceVertices} from "../_interfaces/buffers.js";


export abstract class Vertices {
    protected abstract _createPositions(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexPositions3D|VertexPositions3D|VertexPositions4D;
    protected abstract _createNormals(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexNormals3D|VertexNormals4D;
    protected abstract _createColors(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexColors3D|VertexColors4D;
    protected abstract _createUVs(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexUVs2D|VertexUVs3D;

    positions: VertexPositions3D|VertexPositions3D|VertexPositions4D;
    normals: VertexNormals3D|VertexNormals4D|null;
    colors: VertexColors3D|VertexColors4D|null;
    uvs: VertexUVs2D|VertexUVs3D|null;

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,
        share: ATTRIBUTE,
        count: number,

        positions?: VertexPositions3D|VertexPositions3D|VertexPositions4D,
        normals?: VertexNormals3D|VertexNormals4D,
        colors?: VertexColors3D|VertexColors4D,
        uvs?: VertexUVs2D|VertexUVs3D,
    ): void {
        this.positions = positions || this._createPositions(count, indices, share);
        this.normals = include & ATTRIBUTE.normal ?
            normals || this._createNormals(count, indices, share) : null;

        this.colors = include & ATTRIBUTE.color ?
            colors || this._createColors(count, indices, share) : null;

        this.uvs = include & ATTRIBUTE.uv ?
            uvs || this._createUVs(count, indices, share) : null;
    }
}

export class Vertices3D extends Vertices {
    positions: VertexPositions3D;
    normals: VertexNormals3D;
    colors: VertexColors3D;
    uvs: VertexUVs2D;

    protected _createPositions(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexPositions3D {
        return new VertexPositions3D(count, indices,share & ATTRIBUTE.position);
    }

    protected _createNormals(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexNormals3D {
        return new VertexNormals3D(count, indices,share & ATTRIBUTE.normal);
    }

    protected _createColors(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexColors3D {
        return new VertexColors3D(count, indices,share & ATTRIBUTE.color);
    }

    protected _createUVs(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexUVs2D {
        return new VertexUVs2D(count, indices,share & ATTRIBUTE.uv);
    }
}

export class Vertices4D extends Vertices {
    positions: VertexPositions4D;
    normals: VertexNormals4D;
    colors: VertexColors4D;
    uvs: VertexUVs3D;

    protected _createPositions(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexPositions4D {
        return new VertexPositions4D(count, indices,share & ATTRIBUTE.position);
    }

    protected _createNormals(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexNormals4D {
        return new VertexNormals4D(count, indices,share & ATTRIBUTE.normal);
    }

    protected _createColors(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexColors4D {
        return new VertexColors4D(count, indices,share & ATTRIBUTE.color);
    }

    protected _createUVs(count: number, indices: IFaceVertices, share: ATTRIBUTE): VertexUVs3D {
        return new VertexUVs3D(count, indices,share & ATTRIBUTE.uv);
    }

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