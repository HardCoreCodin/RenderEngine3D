import {ATTRIBUTE, COLOR_SOURCING, NORMAL_SOURCING, VERTICES_PER_FACE} from "../constants.js";
import {FaceVertices, VertexFaces} from "../types.js";
import {Faces, Vertices} from "./attribute.js";
import {ColorInputs, NormalInputs, PositionInputs, UVInputs} from "./inputs.js";

export class Mesh {
    public readonly faces: Faces;
    public readonly face_vertices: FaceVertices;

    public readonly vertices: Vertices;
    public readonly vertex_faces: VertexFaces;

    constructor(
        public readonly inputs: MeshInputs,
        public readonly options: MeshOptions = new MeshOptions(),
        public readonly face_count: number = inputs.position.faces[0].length,
        public readonly vertex_count: number = inputs.position.vertices[0].length
    ) {
        // Sanitize options:
        if (inputs.normal === null) {
            switch (options.normal) {
                case NORMAL_SOURCING.LOAD_VERTEX__NO_FACE:
                    options.normal = NORMAL_SOURCING.NO_VERTEX__NO_FACE;
                    break;
                case NORMAL_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                    options.normal = NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE;
                    break;
            }
        }
        if (inputs.color === null) {
            switch (options.color) {
                case COLOR_SOURCING.LOAD_VERTEX__NO_FACE:
                case COLOR_SOURCING.LOAD_VERTEX__GATHER_FACE:
                    options.color = COLOR_SOURCING.NO_VERTEX__NO_FACE;
                    break;
                case COLOR_SOURCING.LOAD_VERTEX__GENERATE_FACE:
                    options.color = COLOR_SOURCING.NO_VERTEX__GENERATE_FACE;
                    break;
            }
        }

        // Initialize data buffers:
        this.faces = new Faces(face_count, options.face_attributes);
        this.vertices = new Vertices(vertex_count, options.vertex_attributes, options.share);

        // Load data:
        if (inputs.position.vertices_per_face)
            this.vertices.position.load(inputs.position);

        if (options.include_uvs && inputs.uv)
            this.vertices.uv.load(inputs.uv);


    }
}

export class MeshOptions {
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
}

export class MeshInputs {
    public readonly position: PositionInputs;
    public readonly normal: NormalInputs = null;
    public readonly color: ColorInputs = null;
    public readonly uv: UVInputs = null;

    constructor(
        public readonly attributes: ATTRIBUTE = ATTRIBUTE.position,
        public readonly vertices_per_face: VERTICES_PER_FACE = VERTICES_PER_FACE.TRIANGLE,
    ) {
        this.position = new PositionInputs(vertices_per_face);

        if (attributes & ATTRIBUTE.normal)
            this.normal = new NormalInputs(vertices_per_face);

        if (attributes & ATTRIBUTE.color)
            this.color = new ColorInputs(vertices_per_face);

        if (attributes & ATTRIBUTE.uv)
            this.uv = new UVInputs(vertices_per_face);
    }

    triangulate(): void {
        // TODO: Implement...
    }
}

export const generateVertexFaces = (
    face_vertices: FaceVertices,
    vertex_count: number
): VertexFaces => {
    const temp_array = Array(vertex_count);
    for (let i = 0; i < vertex_count; i++)
        temp_array[i] = [];

    let vertex_id, face_id, connections: number = 0;
    for (const face_vertex_ids of face_vertices) {
        for ([face_id, vertex_id] of face_vertex_ids.entries()) {
            temp_array[vertex_id].push(face_id);
            connections++
        }
    }

    const vertex_faces: VertexFaces = Array(vertex_count);
    const buffer = new Uint32Array(connections);
    let offset = 0;
    for (const [i, array] of temp_array.entries()) {
        vertex_faces[i] = buffer.subarray(offset, array.length);
        vertex_faces[i].set(array);
        offset += array.length;
    }

    return vertex_faces;
};