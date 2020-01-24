import {ATTRIBUTE} from "../../../constants.js";
import {InputColors} from "../../geometry/inputs.js";
import {
    Color3D,
    Color4D
} from "../../accessors/color.js";
import {
    FaceColors3D,
    FaceColors4D
} from "../face/colors.js";
import {
    Triangle,
    VertexAttributeBuffer3D,
    VertexAttributeBuffer4D
} from "./_base.js";
import {AnyConstructor} from "../../../types.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {IVertexFaces} from "../../_interfaces/buffers.js";
import {_randomize3D, _randomize4D} from "../_core.js";

let this_arrays: Float32Array[];

export class ColorTriangle3D extends Triangle<Color3D> {}
export class ColorTriangle4D extends Triangle<Color4D> {}

export class VertexColors3D
    extends VertexAttributeBuffer3D<Color3D, ColorTriangle3D>
{
    readonly attribute: ATTRIBUTE.color;

    protected _getTriangleConstructor(): AnyConstructor<ColorTriangle3D> {
        return ColorTriangle3D
    }

    protected _getVectorConstructor(): VectorConstructor<Color3D> {
        return Color3D
    }

    load(input_attribute: InputColors): this {
        return this._load(input_attribute.vertices, true)
    }

    pull(input: FaceColors3D, vertex_faces: IVertexFaces): void {
        this._pull(input.arrays, vertex_faces);
    }

    generate(): this {
        this_arrays = this.arrays;
        _randomize3D(this_arrays[0], this_arrays[1], this_arrays[2]);
        return this;
    }
}

export class VertexColors4D
    extends VertexAttributeBuffer4D<Color4D, ColorTriangle4D>
{
    readonly attribute: ATTRIBUTE.color;

    protected _getTriangleConstructor(): AnyConstructor<ColorTriangle4D> {
        return ColorTriangle4D
    }

    protected _getVectorConstructor(): VectorConstructor<Color4D> {
        return Color4D
    }

    load(input_attribute: InputColors): this {
        return this._load(input_attribute.vertices, true)
    }

    pull(input: FaceColors4D, vertex_faces: IVertexFaces): void {
        this._pull(input.arrays, vertex_faces);
    }

    generate(): this {
        this_arrays = this.arrays;
        _randomize4D(this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3]);
        return this;
    }
}