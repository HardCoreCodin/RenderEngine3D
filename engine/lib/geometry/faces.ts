import {ATTRIBUTE} from "../../constants.js";
import Matrix from "../accessors/matrix.js";
import {
    FacePositions,
    FaceNormals,
    FaceColors,
    FacePositionsConstructor,
    FaceNormalsConstructor,
    FaceColorsConstructor,
} from "../_interfaces/attributes.js";
import {IFaceVertices} from "../_interfaces/buffers.js";


export default class Faces<
    FacePositionsClass extends FacePositions,
    FaceNormalsClass extends FaceNormals,
    FaceColorsClass extends FaceColors>
{
    positions: FacePositionsClass;
    normals: FaceNormalsClass;
    colors: FaceColorsClass;

    constructor(
        protected readonly FacePositions: FacePositionsConstructor<FacePositionsClass>,
        protected readonly FaceNormals: FaceNormalsConstructor<FaceNormalsClass>,
        protected readonly FaceColors: FaceColorsConstructor<FaceColorsClass>
    ) {}

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,

        positions?: FacePositionsClass,
        normals?: FaceNormalsClass,
        colors?: FaceColorsClass
    ): void {
        this.positions = positions || new this.FacePositions(indices).autoInit();
        this.normals = include & ATTRIBUTE.normal ?
            normals || new this.FaceNormals(indices).autoInit() : null;

        this.colors = include & ATTRIBUTE.color ?
            colors || new this.FaceColors(indices).autoInit() : null;
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