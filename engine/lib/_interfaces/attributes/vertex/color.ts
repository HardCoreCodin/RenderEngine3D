import {IPulledVertexAttribute, VertexAttributeConstructor} from "./_base.js";
import {IColor} from "../../accessors/vector/color.js";
import {IInputColors} from "../../mesh/inputs/attributes/color.js";
import {ATTRIBUTE, DIM} from "../../../../constants.js";
import {IFaceColors} from "../face/color.js";

export interface IVertexColors<
    Dim extends DIM,
    Color extends IColor = IColor,
    FaceColors extends IFaceColors<Dim> = IFaceColors<Dim>>
    extends IPulledVertexAttribute<Dim, Color, IInputColors, FaceColors>
{
    attribute: ATTRIBUTE.color;
}

export type IVertexColorsConstructor<
    Dim extends DIM,
    Color extends IColor = IColor> =
    VertexAttributeConstructor<Dim, IVertexColors<Dim, Color>>;