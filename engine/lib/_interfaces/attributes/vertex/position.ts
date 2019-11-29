import {ILoadableVertexAttribute, VertexAttributeConstructor} from "./_base.js";
import {IPosition} from "../../accessors/vector/position.js";
import {IInputPositions} from "../../mesh/inputs/attributes/position.js";
import {ATTRIBUTE, DIM} from "../../../../constants.js";

export interface IVertexPositions<
    Dim extends DIM,
    Position extends IPosition<Dim> = IPosition<Dim>>
    extends ILoadableVertexAttribute<Dim, Position, IInputPositions>
{
    attribute: ATTRIBUTE.position;
}

export type IVertexPositionsConstructor<
    Dim extends DIM,
    Position extends IPosition<Dim> = IPosition<Dim>
    > = VertexAttributeConstructor<Dim, IVertexPositions<Dim, Position>>;
