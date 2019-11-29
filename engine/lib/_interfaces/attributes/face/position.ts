import {FaceAttributeConstructor, IFaceAttribute} from "./_base.js";
import {IVertexPositions} from "../vertex/position.js";
import {IPosition} from "../../accessors/vector/position.js";
import {ATTRIBUTE, DIM} from "../../../../constants.js";

export interface IFacePositions<
    Dim extends DIM,
    Position extends IPosition<Dim> = IPosition<Dim>,
    VertexPositions extends IVertexPositions<Dim, Position> = IVertexPositions<Dim, Position>>
    extends IFaceAttribute<Dim, Position, VertexPositions>
{
    attribute: ATTRIBUTE.position;
}

export type IFacePositionsConstructor<
    Dim extends DIM,
    Position extends IPosition<Dim> = IPosition<Dim>,
    VertexPositions extends IVertexPositions<Dim, Position> = IVertexPositions<Dim, Position>>
    = FaceAttributeConstructor<Dim, IFacePositions<Dim, Position, VertexPositions>>;