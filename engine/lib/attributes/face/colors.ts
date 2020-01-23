import {ATTRIBUTE} from "../../../constants.js";
import {
    Color3D,
    Color4D
} from "../../accessors/color.js";
import {
    VertexColors3D,
    VertexColors4D,
} from "../vertex/colors.js";
import {
    FaceAttributeBuffer3D,
    FaceAttributeBuffer4D
} from "./_base.js";
import {_randomize3D, _randomize4D} from "../_core.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";

let this_arrays: Float32Array[];

export class FaceColors3D
    extends FaceAttributeBuffer3D<Color3D>
{
    readonly attribute: ATTRIBUTE.color;

    protected _getVectorConstructor(): VectorConstructor<Color3D> {
        return Color3D;
    }

    pull(input: VertexColors3D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }

    generate(): this {
        this_arrays = this.arrays;
        _randomize3D(this_arrays[0], this_arrays[1], this_arrays[2]);
        return this;
    }
}

export class FaceColors4D
    extends FaceAttributeBuffer4D<Color4D> {
    readonly attribute: ATTRIBUTE.color;

    protected _getVectorConstructor(): VectorConstructor<Color4D> {
        return Color4D
    }

    pull(input: VertexColors4D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }

    generate(): this {
        this_arrays = this.arrays;
        _randomize4D(this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3]);
        return this;
    }
}