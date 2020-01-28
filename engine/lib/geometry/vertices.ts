import {ATTRIBUTE} from "../../constants.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {VertexUVs2D, VertexUVs3D} from "../buffers/attributes/uvs.js";
import {VertexColors3D, VertexColors4D} from "../buffers/attributes/colors.js";
import {VertexNormals3D, VertexNormals4D} from "../buffers/attributes/normals.js";
import {VertexPositions2D, VertexPositions3D, VertexPositions4D} from "../buffers/attributes/positions.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {IMulVertexAttribute, IVertexAttribute} from "../_interfaces/attributes.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {Color3D, Color4D} from "../accessors/color.js";
import {Direction2D, Direction3D, Direction4D} from "../accessors/direction.js";
import {Position2D, Position3D, Position4D} from "../accessors/position.js";
import Matrix from "../accessors/matrix.js";


type VertexPositions = IMulVertexAttribute<Position2D|Position3D|Position4D, ATTRIBUTE.position>;
type VertexPositionsConstructor<VertexPositionsClass extends VertexPositions> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexPositionsClass;

type VertexNormals = IMulVertexAttribute<Direction2D|Direction3D|Direction4D, ATTRIBUTE.normal>;
type VertexNormalsConstructor<VertexNormalsClass extends VertexNormals> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexNormalsClass;

type VertexColors = IVertexAttribute<Color3D|Color4D, ATTRIBUTE.color>;
type VertexColorsConstructor<VertexColorsClass extends VertexColors> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexColorsClass;

type VertexUVs = IVertexAttribute<UV2D|UV3D, ATTRIBUTE.uv>;
type VertexUVsConstructor<VertexUVsClass extends VertexUVs> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexUVsClass;

export class Vertices<
    VertexPositionsClass extends VertexPositions,
    VertexNormalsClass extends VertexNormals,
    VertexColorsClass extends VertexColors,
    VertexUVsClass extends VertexUVs>
{
    positions: VertexPositionsClass;
    normals: VertexNormalsClass;
    colors: VertexColorsClass;
    uvs: VertexUVsClass;

    constructor(
        protected readonly VertexPositions: VertexPositionsConstructor<VertexPositionsClass>,
        protected readonly VertexNormals: VertexNormalsConstructor<VertexNormalsClass>,
        protected readonly VertexColors: VertexColorsConstructor<VertexColorsClass>,
        protected readonly VertexUVs: VertexUVsConstructor<VertexUVsClass>
    ) {}

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,
        share: ATTRIBUTE,
        count: number,

        positions?: VertexPositionsClass,
        normals?: VertexNormalsClass,
        colors?: VertexColorsClass,
        uvs?: VertexUVsClass,
    ): void {
        this.positions = positions || new this.VertexPositions(count, indices,share & ATTRIBUTE.position).autoInit();
        this.normals = include & ATTRIBUTE.normal ?
            normals || new this.VertexNormals(count, indices,share & ATTRIBUTE.normal).autoInit() : null;

        this.colors = include & ATTRIBUTE.color ?
            colors || new this.VertexColors(count, indices,share & ATTRIBUTE.color).autoInit() : null;

        this.uvs = include & ATTRIBUTE.uv ?
            uvs || new this.VertexUVs(count, indices,share & ATTRIBUTE.uv).autoInit() : null;
    }

    mul(matrix: Matrix, out: this): this {
        this.positions.mul(matrix, out.positions);
        this.normals!.mul(matrix, out.normals);

        return out;
    }

    imul(matrix: Matrix): this {
        this.positions.imul(matrix);
        this.normals!.imul(matrix);

        return this;
    }
}

export class Vertices3D {
    positions: VertexPositions3D;
    normals: VertexNormals3D;
    colors: VertexColors3D;
    uvs: VertexUVs2D;

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,
        share: ATTRIBUTE,
        count: number,

        positions?: VertexPositions3D,
        normals?: VertexNormals3D,
        colors?: VertexColors3D,
        uvs?: VertexUVs2D,
    ): void {
        this.positions = positions || new VertexPositions3D(count, indices,share & ATTRIBUTE.position).autoInit();
        this.normals = include & ATTRIBUTE.normal ?
            normals || new VertexNormals3D(count, indices,share & ATTRIBUTE.normal).autoInit() : null;

        this.colors = include & ATTRIBUTE.color ?
            colors || new VertexColors3D(count, indices,share & ATTRIBUTE.color).autoInit() : null;

        this.uvs = include & ATTRIBUTE.uv ?
            uvs || new VertexUVs2D(count, indices,share & ATTRIBUTE.uv).autoInit() : null;
    }
}

export class Vertices4D {
    positions: VertexPositions4D;
    normals: VertexNormals4D;
    colors: VertexColors4D;
    uvs: VertexUVs3D;

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,
        share: ATTRIBUTE,
        count: number,

        positions?: VertexPositions4D,
        normals?: VertexNormals4D,
        colors?: VertexColors4D,
        uvs?: VertexUVs3D,
    ): void {
        this.positions = positions || new VertexPositions4D(count, indices,share & ATTRIBUTE.position).autoInit();
        this.normals = include & ATTRIBUTE.normal ?
            normals || new VertexNormals4D(count, indices,share & ATTRIBUTE.normal).autoInit() : null;

        this.colors = include & ATTRIBUTE.color ?
            colors || new VertexColors4D(count, indices,share & ATTRIBUTE.color).autoInit() : null;

        this.uvs = include & ATTRIBUTE.uv ?
            uvs || new VertexUVs3D(count, indices,share & ATTRIBUTE.uv).autoInit() : null;
    }

    mul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this.positions.mul(matrix, out.positions);
            this.normals!.mul(matrix, out.normals);
            return out;
        }

        this.positions.imul(matrix);
        this.normals!.imul(matrix);
        return this;
    }
}