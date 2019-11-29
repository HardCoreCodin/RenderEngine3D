import {IPulledVertexAttribute, VertexAttributeConstructor} from "./_base.js";
import {IDirection} from "../../accessors/vector/direction.js";
import {IInputNormals} from "../../mesh/inputs/attributes/normal.js";
import {ATTRIBUTE, DIM} from "../../../../constants.js";
import {IFaceNormals} from "../face/normal.js";

export interface IVertexNormals<
    Dim extends DIM,
    Direction extends IDirection<Dim> = IDirection<Dim>,
    FaceNormals extends IFaceNormals<Dim> = IFaceNormals<Dim>>
    extends IPulledVertexAttribute<Dim, Direction, IInputNormals, FaceNormals>
{
    attribute: ATTRIBUTE.normal;
}

export type IVertexNormalsConstructor<
    Dim extends DIM,
    Direction extends IDirection<Dim> = IDirection<Dim>
    > = VertexAttributeConstructor<Dim, IVertexNormals<Dim, Direction>>;