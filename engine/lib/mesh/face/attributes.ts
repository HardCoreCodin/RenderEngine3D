import {MeshOptions} from "../options.js";
import {FaceVertices} from "./vertices.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {FaceColors3D, FaceColors4D} from "../../attributes/face/color.js";
import {FaceNormals3D, FaceNormals4D} from "../../attributes/face/normal.js";
import {FacePositions3D, FacePositions4D} from "../../attributes/face/position.js";
import {IFaceColors, IFaceColorsConstructor} from "../../_interfaces/attributes/face/color.js";
import {IFaceNormals, IFaceNormalsConstructor} from "../../_interfaces/attributes/face/normal.js";
import {IFacePositions, IFacePositionsConstructor} from "../../_interfaces/attributes/face/position.js";

abstract class Faces<PositionDim extends DIM._3D | DIM._4D,
    NormalDim extends DIM._3D | DIM._4D = PositionDim,
    ColorDim extends DIM._3D | DIM._4D = PositionDim>
{
    protected readonly FacePositions: IFacePositionsConstructor<PositionDim>;
    protected readonly FaceNormals: IFaceNormalsConstructor<NormalDim>;
    protected readonly FaceColors: IFaceColorsConstructor<NormalDim>;

    public positions: IFacePositions<PositionDim>;
    public normals: IFaceNormals<NormalDim>;
    public colors: IFaceColors<NormalDim>;

    constructor(
        protected readonly _face_vertices: FaceVertices,
        protected readonly _mesh_options: MeshOptions,
    ) {
        this.positions = new this.FacePositions(this._face_vertices);
        this.normals = new this.FaceNormals(this._face_vertices);
        this.colors = new this.FaceColors(this._face_vertices);

        this.init();
    }

    init(): void {
        const count = this._face_vertices.length;
        const included = this._mesh_options.face_attributes;

        if (included & ATTRIBUTE.position) this.positions.init(count);
        if (included & ATTRIBUTE.normal) this.normals.init(count);
        if (included & ATTRIBUTE.color) this.colors.init(count);
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