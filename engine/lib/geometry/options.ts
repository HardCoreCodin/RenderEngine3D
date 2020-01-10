import {MeshInputs} from "./inputs.js";
import {ATTRIBUTE, COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {IMeshOptions} from "../_interfaces/geometry.js";

export class MeshOptions implements IMeshOptions {
    constructor(
        public share: ATTRIBUTE = 0,
        public normal: NORMAL_SOURCING = 0,
        public color: COLOR_SOURCING = 0,
        public include_uvs: boolean = false,
        public generate_face_positions: boolean = false
    ) {
    }

    get vertex_attributes(): number {
        let flags = ATTRIBUTE.position;

        if (this.normal !== NORMAL_SOURCING.NO_VERTEX__NO_FACE &&
            this.normal !== NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE)
            flags |= ATTRIBUTE.normal;

        if (this.color !== COLOR_SOURCING.NO_VERTEX__NO_FACE &&
            this.color !== COLOR_SOURCING.NO_VERTEX__GENERATE_FACE)
            flags |= ATTRIBUTE.color;

        if (this.include_uvs)
            flags |= ATTRIBUTE.uv;

        return flags;
    }

    get face_attributes(): number {
        let flags = 0;

        if (this.normal !== NORMAL_SOURCING.NO_VERTEX__NO_FACE &&
            this.normal !== NORMAL_SOURCING.LOAD_VERTEX__NO_FACE)
            flags |= ATTRIBUTE.normal;

        if (this.color !== COLOR_SOURCING.NO_VERTEX__NO_FACE &&
            this.color !== COLOR_SOURCING.LOAD_VERTEX__NO_FACE &&
            this.color !== COLOR_SOURCING.GENERATE_VERTEX__NO_FACE)
            flags |= ATTRIBUTE.color;

        if (this.generate_face_positions)
            flags |= ATTRIBUTE.position;

        return flags;
    }

    sanitize(inputs: MeshInputs) {
        if (!(inputs.included & ATTRIBUTE.normal)) {
            switch (this.normal) {
                case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                    this.normal = NORMAL_SOURCING.NO_VERTEX__NO_FACE;
                    break;
                case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                    this.normal = NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE;
            }
        }

        if (!(inputs.included & ATTRIBUTE.normal)) {
            switch (this.color) {
                case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                    this.color = COLOR_SOURCING.NO_VERTEX__NO_FACE;
                    break;
                case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                    this.color = COLOR_SOURCING.NO_VERTEX__GENERATE_FACE;
            }
        }

        if (!(inputs.included & ATTRIBUTE.uv))
            this.include_uvs = false;
    }
}