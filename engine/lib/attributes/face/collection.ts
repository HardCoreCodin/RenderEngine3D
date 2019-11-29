import {MeshOptions} from "../../../primitives/mesh.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {FaceVertices} from "../../buffers/index.js";
import {IFacePositions, IFacePositionsConstructor} from "../../_interfaces/attributes/face/position.js";
import {IFaceNormals, IFaceNormalsConstructor} from "../../_interfaces/attributes/face/normal.js";
import {IFaceColors, IFaceColorsConstructor} from "../../_interfaces/attributes/face/color.js";
import {FaceColors3D, FaceColors4D} from "./color.js";
import {FaceNormals3D, FaceNormals4D} from "./normal.js";
import {FacePositions3D, FacePositions4D} from "./position.js";


abstract class Faces<Dim extends DIM._3D|DIM._4D>
{
    protected readonly abstract _dim: Dim;
    protected readonly abstract FacePositions: IFacePositionsConstructor<Dim>;
    protected readonly abstract FaceNormals: IFaceNormalsConstructor<Dim>;
    protected readonly abstract FaceColors: IFaceColorsConstructor<Dim>;

    public abstract positions: IFacePositions<Dim>;
    public abstract normals: IFaceNormals<Dim>;
    public abstract colors: IFaceColors<Dim>;

    init(mesh_options: MeshOptions, face_vertices: FaceVertices) : void {
        const count = face_vertices.length;
        const included = mesh_options.face_attributes;

        if (included & ATTRIBUTE.position) {
            this.positions = new this.FacePositions(face_vertices);
            this.positions.init(count);
        }

        if (included & ATTRIBUTE.normal) {
            this.normals = new this.FaceNormals(face_vertices);
            this.normals.init(count);
        }

        if (included & ATTRIBUTE.color) {
            this.colors = new this.FaceColors(face_vertices);
            this.colors.init(count);
        }
    }
}

export class Faces3D extends Faces<DIM._3D> {
    protected _dim: DIM._3D;
    protected readonly FacePositions = FacePositions3D;
    protected readonly FaceNormals = FaceNormals3D;
    protected readonly FaceColors= FaceColors3D;

    public positions: FacePositions3D;
    public normals: FaceNormals3D;
    public colors: FaceColors3D;
}

export class Faces4D extends Faces<DIM._4D> {
    protected _dim: DIM._4D;
    protected readonly FacePositions = FacePositions4D;
    protected readonly FaceNormals = FaceNormals4D;
    protected readonly FaceColors = FaceColors4D;

    public positions: FacePositions4D;
    public normals: FaceNormals4D;
    public colors: FaceColors4D;
}