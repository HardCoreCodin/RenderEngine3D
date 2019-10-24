import {DataAttribute} from "./base.js";
import {ATTR_LOADING_MODE, ATTRIBUTE} from "../../constants.js";
import {FaceValues} from "../../types.js";

export class FaceAttribute extends DataAttribute {
    public values: FaceValues = null;

    fanIn() : void {
        if (
            ATTR_LOADING_MODE.FAN_IN in this.supported_loading_modes &&
            this.name in this.mesh.vertices &&
            this.mesh.vertices[this.name].is_loaded
        )
            this.mesh.vertices[this.name].fanOut();
        else
            throw `Face ${this.name}s can not be fanned-in!`;
    }
}

export class FacePositions extends FaceAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FAN_IN
    ];
}

export class FaceNormals extends FaceAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.GENERATED
    ];

    generate() {
        this.mesh.vertices.position.generateFaceNormals();
    }
}

export class FaceColors extends FaceAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.GENERATED,
        ATTR_LOADING_MODE.FAN_IN
    ];
}