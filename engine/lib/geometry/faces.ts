import {MeshOptions} from "./options.js";
import {ATTRIBUTE, DIM} from "../../constants.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {
    FaceColors3D,
    FaceColors4D,
    FaceNormals3D,
    FaceNormals4D,
    FacePositions3D,
    FacePositions4D
} from "./attributes.js";
import {
    IFaceColors,
    IFaceColorsConstructor,
    IFaceNormals,
    IFaceNormalsConstructor,
    IFacePositions,
    IFacePositionsConstructor
} from "../_interfaces/attributes.js";

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

    constructor(face_vertices: IFaceVertices, mesh_options: MeshOptions) {
        const included = mesh_options.face_attributes;
        this.positions = included & ATTRIBUTE.position ? new this.FacePositions(face_vertices) : null;
        this.normals = included & ATTRIBUTE.normal ? new this.FaceNormals(face_vertices) : null;
        this.colors = included & ATTRIBUTE.color ? new this.FaceColors(face_vertices) : null;
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
}

export class Faces4D extends Faces<DIM._4D>
{
    protected readonly FacePositions = FacePositions4D;
    protected readonly FaceNormals = FaceNormals4D;
    protected readonly FaceColors = FaceColors4D;

    public positions: FacePositions4D;
    public normals: FaceNormals4D;
    public colors: FaceColors4D;
}