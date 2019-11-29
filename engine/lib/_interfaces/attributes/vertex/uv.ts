import {ILoadableVertexAttribute, VertexAttributeConstructor} from "./_base.js";
import {IUV} from "../../accessors/vector/uv.js";
import {IInputUVs} from "../../mesh/inputs/attributes/uv.js";
import {ATTRIBUTE, DIM} from "../../../../constants.js";

export interface IVertexUVs<Dim extends DIM, UV extends IUV = IUV>
    extends ILoadableVertexAttribute<Dim, UV, IInputUVs>
{
    attribute: ATTRIBUTE.uv;
}

export type IVertexUVsConstructor<
    Dim extends DIM,
    UV extends IUV = IUV> =
    VertexAttributeConstructor<Dim, IVertexUVs<Dim, UV>>;
