import Matrix from "../accessors/matrix.js";
import {ATTRIBUTE} from "../../constants.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {
    VertexPositions,
    VertexNormals,
    VertexColors,
    VertexUVs,
    VertexPositionsConstructor,
    VertexNormalsConstructor,
    VertexColorsConstructor,
    VertexUVsConstructor
} from "../_interfaces/attributes.js";


export default class Vertices<
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