import {
    distributeFacesToUnsharedVertices,
    averageUnsharedVerticesToFaces,
    randomize,
    computeFaceNormalsFromUnsharedVertexPositions
} from "./generate.js";
import {FaceValues, UnsharedVertexValues} from "../../types.js";
import {ATTR_LOADING_MODE, ATTRIBUTE} from "../../constants.js";
import {DataAttribute} from "./base.js";
import {float} from "../../factories.js";

export class UnsharedVertexAttribute extends DataAttribute {
    public values: UnsharedVertexValues = null;

    loadFromInputs() : void {
        if (ATTR_LOADING_MODE.FROM_INPUTS in this.supported_loading_modes) {
            const input = this.mesh.input[this.name];
            if (input) {
                let component_num, data_id : number = 0;
                let input_values : number[];
                for (const [vertex_num, input_ids] of input_index.entries()) {
                    for (const [face_id, input_id] of input_ids.entries()) {
                        this.mesh.face_vertices[vertex_num][face_id] = data_id;

                        for ([component_num, input_values] of input_vertex.entries())
                            data_vertex[component_num][data_id] = input_values[input_id];

                        data_id++;
                    }

                    data_id += input_ids.length;
                }
            } else
                throw `Missing inputs for vertex ${this.name}!`;
        } else
            throw `Vertex ${this.name}s can not be loaded from inputs!`;
    }

    allocate() {
        this.values = [
            float(this.length, this.dim),
            float(this.length, this.dim),
            float(this.length, this.dim)
        ];
        // this.is_allocated = true;
    }

    generate() : void {
        if (ATTR_LOADING_MODE.GENERATED in this.supported_loading_modes)
            for (const values of this.values)
                randomize(values);
        else
            throw `Can not generate vertex ${this.name}s!`;
    }

    fanIn() : void {
        if (
            ATTR_LOADING_MODE.FAN_IN in this.supported_loading_modes &&
            this.name in this.mesh.faces &&
            this.mesh.faces[this.name].is_loaded
        )
            distributeFacesToUnsharedVertices(
                this.mesh.faces[this.name].values,
                this.values
            );
        else
            throw `Vertex ${this.name}s can not be fanned-in!`;
    }

    fanOut() : void {
        if (
            this.name in this.mesh.faces &&
            this.mesh.faces[this.name].is_loaded
        )
            averageUnsharedVerticesToFaces(
                this.values,
                this.mesh.faces[this.name].values
            );
        else
            throw `Vertex ${this.name}s can not be fanned-out!`;
    }
}

export class UnsharedVertexPositions extends UnsharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS
    ];

    generateFaceNormals() : void {
        if (this.mesh.faces.normal)
            computeFaceNormalsFromUnsharedVertexPositions(
                this.values,
                this.mesh.faces.normal.values
            );
        else
            throw `Can not generate face normals, as they were not allocated!`;
    }
}

export class UnsharedVertexNormals extends UnsharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS,
        ATTR_LOADING_MODE.FAN_IN
    ];
}

export class UnsharedVertexColors extends UnsharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS,
        ATTR_LOADING_MODE.GENERATED,
        ATTR_LOADING_MODE.FAN_IN
    ];
}

export class UnsharedVertexUVx extends UnsharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
    public readonly dim: number = 2;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS
    ];
}