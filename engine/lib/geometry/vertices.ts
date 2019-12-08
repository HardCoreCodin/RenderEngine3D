import {MeshOptions} from "./options.js";
import {ATTRIBUTE, DIM} from "../../constants.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {
    IVertexColors,
    IVertexColorsConstructor,
    IVertexNormals,
    IVertexNormalsConstructor,
    IVertexPositions,
    IVertexPositionsConstructor, IVertexUVs, IVertexUVsConstructor
} from "../_interfaces/attributes.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {VertexNormals3D, VertexNormals4D} from "./normals.js";
import {VertexColors3D, VertexColors4D} from "./colors.js";
import {VertexUVs2D, VertexUVs3D} from "./uvs.js";


abstract class Vertices<PositionDim extends DIM._3D | DIM._4D,
    NormalDim extends DIM._3D | DIM._4D = PositionDim,
    ColorDim extends DIM._3D | DIM._4D = PositionDim,
    UVDim extends DIM._2D | DIM._3D = PositionDim extends DIM._3D ? DIM._2D : DIM._3D>
{
    protected readonly VertexPositions: IVertexPositionsConstructor<PositionDim>;
    protected readonly VertexNormals: IVertexNormalsConstructor<NormalDim>;
    protected readonly VertexColors: IVertexColorsConstructor<ColorDim>;
    protected readonly VertexUVs: IVertexUVsConstructor<UVDim>;

    public positions: IVertexPositions<PositionDim>;
    public normals: IVertexNormals<NormalDim>|null;
    public colors: IVertexColors<ColorDim>|null;
    public uvs: IVertexUVs<UVDim>|null;

    constructor(
        public face_vertices: IFaceVertices,
        public mesh_options: MeshOptions,

        positions?: IVertexPositions<PositionDim>,
        normals?: IVertexNormals<NormalDim>,
        colors?: IVertexColors<ColorDim>,
        uvs?: IVertexUVs<UVDim>,
    ) {
        const included = mesh_options.vertex_attributes;

        this.positions = positions || new this.VertexPositions(
            face_vertices,mesh_options.share & ATTRIBUTE.position
        );

        this.normals = included & ATTRIBUTE.normal ?
            normals || new this.VertexNormals(
                face_vertices,mesh_options.share & ATTRIBUTE.normal
            ) : null;

        this.colors = included & ATTRIBUTE.color ?
            colors || new this.VertexColors(
                face_vertices,mesh_options.share & ATTRIBUTE.color
            ) : null;

        this.uvs = included & ATTRIBUTE.uv ?
            uvs || new this.VertexUVs(
                face_vertices,mesh_options.share & ATTRIBUTE.color
            ) : null;
    }
}

export class Vertices3D extends Vertices<DIM._3D>
{
    protected readonly VertexPositions = VertexPositions3D;
    protected readonly VertexNormals = VertexNormals3D;
    protected readonly VertexColors = VertexColors3D;
    protected readonly VertexUVs = VertexUVs2D;

    public positions: VertexPositions3D;
    public normals: VertexNormals3D;
    public colors: VertexColors3D;
    public uvs: VertexUVs2D;

    // homogenize(out?: Vertices4D): Vertices4D {
    //     if (out) {
    //         this.positions.homogenize(out.positions);
    //         this.normals!.homogenize(out.normals);
    //         this.colors!.homogenize(out.colors);
    //         this.uvs!.homogenize(out.uvs);
    //         return out;
    //     }
    //
    //     return new Vertices4D(
    //         this.face_vertices,
    //         this.mesh_options,
    //
    //         this.positions.homogenize(),
    //         this.normals!.homogenize(),
    //         this.colors!.homogenize(),
    //         this.uvs!.homogenize()
    //     );
    // }
}

export class Vertices4D extends Vertices<DIM._4D> {
    protected readonly VertexPositions = VertexPositions4D;
    protected readonly VertexNormals = VertexNormals4D;
    protected readonly VertexColors = VertexColors4D;
    protected readonly VertexUVs = VertexUVs3D;

    public positions: VertexPositions4D;
    public normals: VertexNormals4D;
    public colors: VertexColors4D;
    public uvs: VertexUVs3D;

    mul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this.positions.mul(matrix, out.positions);
            this.normals!.mul(matrix, out.normals);
            return out;
        }

        this.positions.mul(matrix);
        this.normals!.mul(matrix);
        return this;
    }
}



