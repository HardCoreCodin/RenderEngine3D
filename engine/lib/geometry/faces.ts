import {MeshOptions} from "./options.js";
import {ATTRIBUTE, DIM} from "../../constants.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {
    IFaceColors,
    IFaceColorsConstructor,
    IFaceNormals,
    IFaceNormalsConstructor,
    IFacePositions,
    IFacePositionsConstructor
} from "../_interfaces/attributes.js";
import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {FacePositions3D, FacePositions4D} from "./positions.js";
import {FaceNormals3D, FaceNormals4D} from "./normals.js";
import {FaceColors3D, FaceColors4D} from "./colors.js";

abstract class Faces<PositionDim extends DIM._3D | DIM._4D,
    NormalDim extends DIM._3D | DIM._4D = PositionDim,
    ColorDim extends DIM._3D | DIM._4D = PositionDim>
{
    protected readonly FacePositions: IFacePositionsConstructor<PositionDim>;
    protected readonly FaceNormals: IFaceNormalsConstructor<NormalDim>;
    protected readonly FaceColors: IFaceColorsConstructor<NormalDim>;

    public readonly positions: IFacePositions<PositionDim>|null;
    public readonly normals: IFaceNormals<NormalDim>|null;
    public readonly colors: IFaceColors<NormalDim>|null;

    constructor(
        public face_vertices: IFaceVertices,
        public mesh_options: MeshOptions,

        positions?: IFacePositions<PositionDim>,
        normals?: IFaceNormals<NormalDim>,
        colors?: IFaceColors<NormalDim>
    ) {
        const included = mesh_options.face_attributes;
        this.positions = included & ATTRIBUTE.position ? positions || new this.FacePositions(face_vertices) : null;
        this.normals = included & ATTRIBUTE.normal ? normals || new this.FaceNormals(face_vertices) : null;
        this.colors = included & ATTRIBUTE.color ? colors || new this.FaceColors(face_vertices) : null;
    }
}

export class Faces3D extends Faces<DIM._3D>
{
    protected readonly FacePositions = FacePositions3D;
    protected readonly FaceNormals = FaceNormals3D;
    protected readonly FaceColors = FaceColors3D;

    public positions: FacePositions3D;
    public normals: FaceNormals3D;
    public colors: FaceColors3D;

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

export class Faces4D extends Faces<DIM._4D>
{
    protected readonly FacePositions = FacePositions4D;
    protected readonly FaceNormals = FaceNormals4D;
    protected readonly FaceColors = FaceColors4D;

    public positions: FacePositions4D;
    public normals: FaceNormals4D;
    public colors: FaceColors4D;

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