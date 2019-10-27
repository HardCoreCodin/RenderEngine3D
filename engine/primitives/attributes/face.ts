import {ATTRIBUTE} from "../../constants.js";
import {UnsharedVertexColors, UnsharedVertexPositions} from "./vertex.js";
import {
    BaseSharedVertexAttribute,
    SharedVertexColors,
    SharedVertexPositions,
    VertexAttribute
} from "./vertex.js";
import {BaseAttribute, IGenerate, IGather} from "./base.js";
import {
    averageSharedVerticesToFaces,
    averageUnsharedVerticesToFaces,
    computeFaceNormalsFromSharedVertexPositions,
    computeFaceNormalsFromUnsharedVertexPositions
} from "./generate.js";
import {FaceVertices} from "../../types.js";

export class BaseFaceAttribute extends BaseAttribute implements IGather {
    gatherFrom(
        vertex_attribute:
            SharedVertexPositions |
            UnsharedVertexPositions |
            SharedVertexColors |
            UnsharedVertexColors,
        face_vertices?: FaceVertices
    ) : void {
        if (vertex_attribute.is_loaded) {
            if (vertex_attribute instanceof BaseSharedVertexAttribute)
                averageSharedVerticesToFaces(
                    vertex_attribute.values,
                    this.values,
                    face_vertices
                );
            else
                averageUnsharedVerticesToFaces(
                    vertex_attribute.values,
                    this.values
                );
        } else
            throw `Face ${this.name}s can not be pulled! Source attribute ${vertex_attribute.name} is not loaded!`;

        this.is_loaded = true;
    }
}

export class FacePositions extends BaseFaceAttribute {
    public readonly name: string = 'position';
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;

    gatherFrom(attribute: VertexAttribute, face_vertices?: FaceVertices) {
        super.gatherFrom(attribute, face_vertices);
    }
}

export class FaceNormals extends BaseFaceAttribute {
    public readonly name: string = 'normal';
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;

    gatherFrom(attribute: SharedVertexPositions | UnsharedVertexPositions, face_vertices?: FaceVertices) {
        if (attribute instanceof SharedVertexPositions)
            computeFaceNormalsFromSharedVertexPositions(
                attribute.values,
                this.values,
                face_vertices
            );
        else if (attribute instanceof UnsharedVertexPositions)
            computeFaceNormalsFromUnsharedVertexPositions(
                attribute.values,
                this.values
            );

        this.is_loaded = true;
    }
}

export class FaceColors extends BaseFaceAttribute implements IGenerate {
    public readonly name: string = 'color';
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    gatherFrom(attribute: SharedVertexColors | UnsharedVertexColors, face_vertices?: FaceVertices) {
        super.gatherFrom(attribute, face_vertices);
    }

    generate = () : void => this._generate();
}

export type FaceAttribute =  FacePositions | FaceNormals | FaceColors;