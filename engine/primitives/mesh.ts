import * as C from "../constants.js";
import {ATTR_NAMES, ATTRIBUTE, ATTRS} from "../constants.js";
import {float3, int3} from "../factories.js";
import {FaceVertices, IMesh, VertexFaces} from "../types.js";
import {MeshInputs} from "./attributes/input";
import {Faces, Vertices} from "./mesh/data";


export class Mesh implements IMesh {
    public readonly faces: Faces;
    public readonly face_vertices: FaceVertices;

    public readonly vertices: Vertices;
    public readonly vertex_faces: VertexFaces;

    public readonly has_uvs: boolean;
    public readonly has_face_colors: boolean;
    public readonly has_face_positions: boolean;
    public readonly has_vertex_colors: boolean;
    public readonly has_vertex_normals: boolean;

    public readonly has_uv_inputs: boolean;
    public readonly has_color_inputs: boolean;
    public readonly has_normal_inputs: boolean;

    public readonly shared_positions: boolean;
    public readonly shared_normals: boolean;
    public readonly shared_colors: boolean;
    public readonly shared_uvs: boolean;

    public readonly generated_face_positions: boolean;
    public readonly generated_face_colors: boolean;
    public readonly generated_vertex_colors: boolean;
    public readonly generated_vertex_normals: boolean;

    constructor(
        public readonly input: MeshInputs,
        public readonly flags: number = C.DEFAULT_FLAGS,

        public readonly face_count: number = input.position.faces[0].length,
        public readonly vertex_count: number = input.position.vertices[0].length
    ) {
        this.shared_positions = !!(C.FLAG__SHARE__VERTEX_POSITIONS & flags);
        this.shared_normals = !!(C.FLAG__SHARE__VERTEX_NORMALS & flags);
        this.shared_colors = !!(C.FLAG__SHARE__VERTEX_COLORS & flags);
        this.shared_uvs = !!(C.FLAG__SHARE__VERTEX_UVS & flags);

        this.generated_face_positions = !!(C.FLAG__GENERATE__FACE_POSITIONS & flags);
        this.generated_face_colors = !!(C.FLAG__GENERATE__FACE_COLORS & flags);
        this.generated_vertex_colors = !!(C.FLAG__GENERATE__VERTEX_COLORS & flags);
        this.generated_vertex_normals = !!(C.FLAG__GENERATE__VERTEX_NORMALS & flags);

        this.has_uv_inputs = this.hasInput(ATTRIBUTE.uv);
        this.has_color_inputs = this.hasInput(ATTRIBUTE.color);
        this.has_normal_inputs = this.hasInput(ATTRIBUTE.normal);

        this.has_uvs = this.has_uv_inputs;
        this.has_face_positions = this.generated_face_positions;
        this.has_face_colors = this.generated_face_colors;
        this.has_vertex_colors = this.generated_vertex_colors || this.has_color_inputs;
        this.has_vertex_normals = this.generated_vertex_normals || this.has_normal_inputs;

        // If any vertex attribute is shared, create a face->vertex index mapping
        // from the same mapping in the input's position attribute:
        if (this.shared_positions ||
            this.shared_colors ||
            this.shared_normals ||
            this.shared_uvs) {
            this.face_vertices = int3(face_count);
            this.face_vertices[0].set(input.position.face_vertices[0]);
            this.face_vertices[1].set(input.position.face_vertices[1]);
            this.face_vertices[2].set(input.position.face_vertices[2]);
        }


        const temp_array = Array(vertex_count);
        for (let i = 0; i < vertex_count; i++)
            temp_array[i] = [];

        let vertex_id, face_id, connections : number  = 0;
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


        // IF any vertex attribute is NOT shared, Build a 'unique' face-vertex index:
        if (!this.shared_positions ||
            !this.shared_colors ||
            !this.shared_normals ||
            !this.shared_uvs) {
            this.unique_vertex_index = int3(face_count);
            let vertex_num, face_id, offset: number = 0;
            for (vertex_num = 0; vertex_num < 3; vertex_num++) {
                offset = vertex_num * face_count;
                for (face_id = 0; face_id < face_count; face_id++)
                    this.unique_vertex_index[vertex_num][face_id] = face_id + offset;
            }
        }


        this.data.vertex = {position: float3(this.shared_positions ? vertex_count : face_count * 3)};
        this.data.index = {position: this.shared_positions ? this.shared_vertex_index : int3(face_count)};
        this.data.face = {normal: float3(face_count)};

        // Populate vertex positions:
        if (this.shared_positions) {
            this.data.vertex.position[0].set(this.input.vertex.position[0]);
            this.data.vertex.position[1].set(this.input.vertex.position[1]);
            this.data.vertex.position[2].set(this.input.vertex.position[2]);
        } else
            this.setUniqueVertexAttribute(ATTRIBUTE.position);

        // Populate face attributes:
        this.generateFaceNormals();
        if (this.generated_face_positions) this.generateFacePositions();
        if (this.generated_face_colors) this.generateFaceColors();

        // Populate vertex attributes:
        for (const attr of ATTRS) this.populate(attr);
    }

    hasInput(attribute: ATTRIBUTE) : boolean {
        const attr_name: string = ATTR_NAMES[attribute];
        return (
            attr_name in this.input.vertex && this.input.vertex[attr_name][0].length > 0 &&
            attr_name in this.input.index && this.input.index[attr_name][0].length > 0
        );
    }

    isShared(attribute: ATTRIBUTE) : boolean {
        switch(attribute) {
            case ATTRIBUTE.position: return this.shared_positions;
            case ATTRIBUTE.normal: return this.shared_normals;
            case ATTRIBUTE.color: return this.shared_colors;
            case ATTRIBUTE.uv: return this.shared_uvs;
        }
    }

    isGenerated(attribute: ATTRIBUTE, face: boolean = false) : boolean {
        switch(attribute) {
            case ATTRIBUTE.position: return face ? this.generated_face_positions : false;
            case ATTRIBUTE.normal: return face ? true : this.generated_vertex_normals;
            case ATTRIBUTE.color: return face ? this.generated_face_colors : this.generated_vertex_colors;
        }
        return false;
    }

}

