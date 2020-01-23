import {ATTRIBUTE} from "../../../constants.js";
import {InputUVs} from "../../geometry/inputs.js";
import {
    UV2D,
    UV3D
} from "../../accessors/uv.js";
import {
    Triangle,
    VertexAttributeBuffer2D,
    VertexAttributeBuffer3D
} from "./_base.js";
import {AnyConstructor} from "../../../types.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";

export class UVTriangle2D extends Triangle<UV2D> {}
export class UVTriangle3D extends Triangle<UV3D> {}

export class VertexUVs2D
    extends VertexAttributeBuffer2D<UV2D, UVTriangle2D> {
    readonly attribute: ATTRIBUTE.uv;

    protected _getTriangleConstructor(): AnyConstructor<UVTriangle2D> {
        return UVTriangle2D
    }

    protected _getVectorConstructor(): VectorConstructor<UV2D> {
        return UV2D
    }

    load(input_attribute: InputUVs): this {
        return this._load(input_attribute.vertices, true)
    }
}

export class VertexUVs3D
    extends VertexAttributeBuffer3D<UV3D, UVTriangle3D>
{
    readonly attribute: ATTRIBUTE.uv;

    protected _getTriangleConstructor(): AnyConstructor<UVTriangle3D> {
        return UVTriangle3D
    }

    protected _getVectorConstructor(): VectorConstructor<UV3D> {
        return UV3D
    }

    load(input_attribute: InputUVs): this {
        return this._load(input_attribute.vertices, true)
    }
}