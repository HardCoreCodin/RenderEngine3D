import {IDirection} from "../../accessors/vector/direction.js";
import {FaceAttributeConstructor, IFaceAttribute} from "./_base.js";
import {IVertexPositions} from "../vertex/position.js";
import {ATTRIBUTE, DIM} from "../../../../constants.js";
import {IPosition} from "../../accessors/vector/position.js";

export interface IFaceNormals<
    Dim extends DIM,
    Direction extends IDirection<Dim> = IDirection<Dim>,
    VertexPositions extends IVertexPositions<Dim, IPosition<Dim>> = IVertexPositions<Dim, IPosition<Dim>>>
    extends IFaceAttribute<Dim, Direction, VertexPositions>
{
    attribute: ATTRIBUTE.normal;
}

export type IFaceNormalsConstructor<
    Dim extends DIM,
    Direction extends IDirection<Dim> = IDirection<Dim>,
    VertexPositions extends IVertexPositions<Dim, IPosition<Dim>> = IVertexPositions<Dim, IPosition<Dim>>>
    = FaceAttributeConstructor<Dim, IFaceNormals<Dim, Direction, VertexPositions>>;