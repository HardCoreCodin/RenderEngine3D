import {
    FaceInputs,
    FaceInputStr,
    FaceInputNum,
    VertexInputs,
    VertexInputStr,
    VertexInputNum
} from "../../types.js";
import {ATTRIBUTE, DIM, VERTICES_PER_FACE} from "../../constants.js";
import {num2, num3, num4} from "../../factories.js";

export class AttributeInputs {
    public readonly id: ATTRIBUTE;
    public readonly name: string;
    public readonly dim: DIM = DIM._3D;
    public readonly vertices: VertexInputs;
    public readonly faces: FaceInputs;

    constructor(
        public readonly vertices_per_face: VERTICES_PER_FACE = VERTICES_PER_FACE.TRIANGLE
    ) {
        this.vertices = this.dim === 3 ? num3() : num2();
        this.faces = this.vertices_per_face === 3 ? num3() : num4();
    }

    private getValue(value: number | string, is_index: boolean) : number {
        let error: string;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`
                } else
                    return value;
            } else
                error = `${value} is not a finite number`;
        } else if (typeof value === "string")
            return this.getValue(+value, is_index);
         else
             error =`Got ${typeof value} ${value} instead or a number or a string`;

        throw `Invalid ${this.name} ${is_index ? 'index' : 'value'}! ${error}`;
    }

    private checkInputSize(input_size: number, is_index: boolean) {
        const required_size = is_index ? this.vertices_per_face : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this.name} ${
                is_index ? 'indices' : 'values'
            } input! Got ${input_size} ${
                is_index ? 'vertices per face' : 'dimensions'
            } instead of ${required_size}`;
    }

    pushVertex(vertex: VertexInputNum | VertexInputStr) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }

    pushFace(face: FaceInputNum | FaceInputStr) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces[vertex_num].push(this.getValue(vertex_index, true));
    }
}

export class PositionInputs extends AttributeInputs {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
}

export class NormalInputs extends AttributeInputs {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
}

export class ColorInputs extends AttributeInputs {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
}

export class UVInputs extends AttributeInputs {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
    public readonly dim: DIM = DIM._2D;
}

export class MeshInputs {
    constructor(
        has_normals: boolean = false,
        has_colors: boolean = false,
        has_uvs: boolean = false,

        public position: PositionInputs = new PositionInputs(),
        public normal: NormalInputs | null = has_normals ? new PositionInputs() : null,
        public color: ColorInputs | null = has_colors ? new ColorInputs() : null,
        public uv: UVInputs | null = has_uvs ? new UVInputs() : null
    ) {}
}

