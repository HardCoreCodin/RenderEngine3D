import {FaceAttributeConstructor, IFaceAttribute} from "./_base.js";
import {IColor} from "../../accessors/vector/color.js";
import {IVertexColors} from "../vertex/color.js";
import {ATTRIBUTE, DIM} from "../../../../constants.js";

export interface IFaceColors<
    Dim extends DIM,
    Color extends IColor = IColor,
    VertexColors extends IVertexColors<Dim, Color> = IVertexColors<Dim, Color>>
    extends IFaceAttribute<Dim, Color, VertexColors>
{
    attribute: ATTRIBUTE.color;
}

export type IFaceColorsConstructor<
    Dim extends DIM,
    Color extends IColor = IColor,
    VertexColors extends IVertexColors<Dim, Color> = IVertexColors<Dim, Color>>
    = FaceAttributeConstructor<Dim, IFaceColors<Dim, Color, VertexColors>>;