import {ATTRIBUTE, DIM} from "../../../constants.js";
import {IVertexPositions, IVertexPositionsConstructor} from "../../_interfaces/attributes/vertex/position.js";
import {IVertexNormals, IVertexNormalsConstructor} from "../../_interfaces/attributes/vertex/normal.js";
import {IVertexColors, IVertexColorsConstructor} from "../../_interfaces/attributes/vertex/color.js";
import {IVertexUVs, IVertexUVsConstructor} from "../../_interfaces/attributes/vertex/uv.js";
import {MeshOptions} from "../../../primitives/mesh.js";
import {FaceVertices} from "../../buffers/index.js";
import {VertexPositions3D, VertexPositions4D} from "./position.js";
import {VertexColors3D, VertexColors4D} from "./color.js";
import {VertexNormals3D, VertexNormals4D} from "./normal.js";
import {VertexUVs2D, VertexUVs3D} from "./uv.js";

abstract class Vertices<Dim extends DIM._3D|DIM._4D>
{
    protected readonly abstract _dim: Dim;
    protected readonly abstract VertexPositions: IVertexPositionsConstructor<Dim>;
    protected readonly abstract VertexNormals: IVertexNormalsConstructor<Dim>;
    protected readonly abstract VertexColors: IVertexColorsConstructor<Dim>;
    protected readonly abstract VertexUVs: IVertexUVsConstructor<Dim extends DIM._3D ? DIM._2D : DIM._3D>;

    public abstract positions: IVertexPositions<Dim>;
    public abstract normals: IVertexNormals<Dim>;
    public abstract colors: IVertexColors<Dim>;
    public abstract uvs: IVertexUVs<Dim extends DIM._3D ? DIM._2D : DIM._3D>;

    init(mesh_options: MeshOptions, face_vertices: FaceVertices) : void {
        const count = face_vertices.length;
        const shared = mesh_options.share;
        const included = mesh_options.vertex_attributes;

        this.positions = new this.VertexPositions(face_vertices);
        this.positions.init(count, shared & ATTRIBUTE.position);

        if (included & ATTRIBUTE.normal) {
            this.normals = new this.VertexNormals(face_vertices);
            this.normals.init(count, shared & ATTRIBUTE.normal);
        }

        if (included & ATTRIBUTE.color) {
            this.colors = new this.VertexColors(face_vertices);
            this.colors.init(count, shared & ATTRIBUTE.color);
        }

        if (included & ATTRIBUTE.uv) {
            this.uvs = new this.VertexUVs(face_vertices);
            this.uvs.init(count, shared & ATTRIBUTE.uv);
        }
    }
}

export class Vertices3D extends Vertices<DIM._3D> {
    protected _dim: DIM._3D;
    protected readonly VertexPositions = VertexPositions3D;
    protected readonly VertexNormals = VertexNormals3D;
    protected readonly VertexColors = VertexColors3D;
    protected readonly VertexUVs = VertexUVs2D;

    public positions: VertexPositions3D;
    public normals: VertexNormals3D;
    public colors: VertexColors3D;
    public uvs: VertexUVs2D;
}

export class Vertices4D extends Vertices<DIM._4D> {
    protected _dim: DIM._4D;
    protected readonly VertexPositions = VertexPositions4D;
    protected readonly VertexNormals = VertexNormals4D;
    protected readonly VertexColors = VertexColors4D;
    protected readonly VertexUVs = VertexUVs3D;

    public positions: VertexPositions4D;
    public normals: VertexNormals4D;
    public colors: VertexColors4D;
    public uvs: VertexUVs3D;
}