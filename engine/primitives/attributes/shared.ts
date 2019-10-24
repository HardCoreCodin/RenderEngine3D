import {FaceValues, SharedVertexValues} from "../../types.js";
import {ATTR_LOADING_MODE, ATTRIBUTE} from "../../constants.js";
import {
    averageFacesToSharedVertices,
    averageSharedVerticesToFaces,
    computeFaceNormalsFromSharedVertexPositions,
    randomize
} from "./generate.js";
import {DataAttribute} from "./base.js";

export class SharedVertexAttribute extends DataAttribute {
    public values: SharedVertexValues = null;

    loadFromInputs() : void {
        if (ATTR_LOADING_MODE.FROM_INPUTS in this.supported_loading_modes) {
            const input = this.mesh.input[this.name];
            if (input) {
                // TODO: Implement...
                // if (input_vertex[0].length === this.vertex_count) {
                //     let face_id, input_id, vertex_num, component_num, data_id : number = 0;
                //     let input_values, input_ids: number[];
                //     for ([vertex_num, input_ids] of input_index.entries())
                //         data_index[vertex_num].set(input_ids);
                // }
            } else
                throw `Missing inputs for vertex ${this.name}!`;
        } else
            throw `Vertex ${this.name}s can not be loaded from inputs!`;
    }

    generate() : void {
        if (ATTR_LOADING_MODE.GENERATED in this.supported_loading_modes)
            randomize(this.values);
        else
            throw `Can not generate vertex ${this.name}s!`;
    }

    fanIn() : void {
        if (
            ATTR_LOADING_MODE.FAN_IN in this.supported_loading_modes &&
            this.name in this.mesh.faces &&
            this.mesh.vertices[this.name].is_loaded
        )
            averageFacesToSharedVertices(
                this.mesh.vertices[this.name].values,
                this.values,
                this.mesh.vertex_faces
            );
        else
            throw `Vertex ${this.name}s can not be fanned-in!`;
    }

    fanOut() : void {
        if (
            this.name in this.mesh.faces &&
            this.mesh.faces[this.name].is_loaded
        )
            averageSharedVerticesToFaces(
                this.values,
                this.mesh.faces[this.name].values,
                this.mesh.face_vertices
            );
        else
            throw `Vertex ${this.name}s can not be fanned-out!`;
    }
}

export class SharedVertexPositions extends SharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS
    ];

    loadFromInputs() : void {
        this.values[0].set(this.mesh.input.position.values[0]);
        this.values[1].set(this.mesh.input.position.values[1]);
        this.values[2].set(this.mesh.input.position.values[2]);
    }

    generateFaceNormals() : void {
        if (this.mesh.faces.normal)
            computeFaceNormalsFromSharedVertexPositions(
                this.values,
                this.mesh.faces.normal.values,
                this.mesh.face_vertices
            );
        else
            throw `Can not generate face normals, as they were not allocated!`;
    }
}

export class SharedVertexNormals extends SharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS,
        ATTR_LOADING_MODE.FAN_IN
    ];
}

export class SharedVertexColors extends SharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS,
        ATTR_LOADING_MODE.GENERATED,
        ATTR_LOADING_MODE.FAN_IN
    ];
}

export class SharedVertexUVx extends SharedVertexAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
    public readonly dim: number = 2;
    public readonly supported_loading_modes = [
        ATTR_LOADING_MODE.FROM_INPUTS
    ];
}