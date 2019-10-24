import {ATTR_LOADING_MODE, ATTR_NAMES, ATTRIBUTE} from "../../constants.js";
import {FaceValues, IMesh, VertexValues} from "../../types.js";
import {float} from "../../factories.js";

export class DataAttribute {
    public readonly id: ATTRIBUTE;
    public readonly name: string;
    public readonly dim: number = 3;
    public readonly supported_loading_modes: ATTR_LOADING_MODE[] = [];

    // public readonly is_allocated: boolean;
    public is_loaded: boolean;
    public values: FaceValues | VertexValues | null = null;

    constructor(
        public readonly mesh: IMesh,
        public readonly length: number,
        public readonly loading_mode: ATTR_LOADING_MODE = ATTR_LOADING_MODE.FROM_INPUTS,
    ) {
        this.name = ATTR_NAMES[this.id];
        this.allocate();
        this.load();
    }

    allocate() {
        this.values = float(this.length, this.dim);
        // this.is_allocated = true;
    }

    load() {
        if (!(ATTR_LOADING_MODE.FROM_INPUTS in this.supported_loading_modes))
            throw `Unsupported loading mode ${this.loading_mode} for ${this.name}!`;

        switch (this.loading_mode) {
            case ATTR_LOADING_MODE.FROM_INPUTS: this.loadFromInputs(); break;
            case ATTR_LOADING_MODE.FAN_IN: this.fanIn(); break;
            case ATTR_LOADING_MODE.GENERATED: this.generate(); break;
        }

        this.is_loaded = true;
    }

    generate() : void {
        throw `Not Implemented!`;
    }

    fanIn() : void {
        throw `Not Implemented!`;
    }

    loadFromInputs() : void {
        throw `Not Implemented!`;
    }
}
