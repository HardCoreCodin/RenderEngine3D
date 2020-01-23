import {
    Color3D,
    Color4D
} from "../../accessors/color.js";
import {
    VectorBuffer3D,
    VectorBuffer4D
} from "./_base.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";

export class Colors3D extends VectorBuffer3D<Color3D> {
    protected _getVectorConstructor(): VectorConstructor<Color3D> {
        return Color3D
    }
}

export class Colors4D extends VectorBuffer4D<Color4D> {
    protected _getVectorConstructor(): VectorConstructor<Color4D> {
        return Color4D
    }
}