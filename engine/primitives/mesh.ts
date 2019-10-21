import {
    IInputIndexBuffers,
    IInputVaueBuffers,
    IVertexBuffers,
    IFaceBuffers,
    IIndexBuffers,
    Num3, Num2, Float3, Int3, FloatBuffer
} from "../types.js";
import * as C from "../constants.js";
import {float3, int3, num3, num2} from "../factories.js";
import {cross, subtract} from "../math/vec3.js";

export class Mesh {
    public vertices: IVertexBuffers;
    public indices: IIndexBuffers;
    public faces?: IFaceBuffers;

    constructor(
        input_vertices: IInputVaueBuffers,
        input_indices: IInputIndexBuffers,
        public readonly flags: number = C.DEFAULT_FLAGS,
        public readonly face_count: number = input_indices.position[0].length,
        public readonly vertex_count: number = input_vertices.position[0].length,

        public readonly has_vertex_normals: boolean = (
            flags & C.FLAG__GENERATE__VERTEX_NORMALS
        ) > 0 || (
            Array.isArray(input_vertices.normal) &&
            Array.isArray(input_indices.normal) &&
            input_vertices.normal[0].length > 0 &&
            input_indices.normal[0].length > 0
        ),

        public readonly has_vertex_colors: boolean = (
            flags & C.FLAG__GENERATE__VERTEX_COLORS
        ) > 0 || (
            Array.isArray(input_vertices.color) &&
            Array.isArray(input_indices.color) &&
            input_vertices.color[0].length > 0 &&
            input_indices.color[0].length > 0
        ),

        public readonly has_uvs: boolean = (
            Array.isArray(input_vertices.uv) &&
            Array.isArray(input_indices.uv) &&
            input_vertices.uv[0].length > 0 &&
            input_indices.uv[0].length > 0
        ),

        public readonly has_face_colors: boolean = (
            flags & C.FLAG__GENERATE__FACE_COLORS
        ) > 0,

        public readonly has_face_positions: boolean = (
            flags & C.FLAG__GENERATE__FACE_POSITIONS
        ) > 0,
    ) {
        this.vertices = {
            position: float3(
                (
                    flags & C.FLAG__SHARE__VERTEX_POSITIONS
                ) > 0 ?
                    vertex_count :
                    face_count * 3
            )
        };

        this.indices = {
            position: int3(face_count)
        };

        this.faces = {
            normal: float3(face_count)
        };

        // Populate positions:
        num2float(
            input_vertices.position,
            this.vertices.position,

            input_indices.position,
            this.indices.position,

            (flags & C.FLAG__SHARE__VERTEX_POSITIONS) > 0
        );

        // Generate face normals:
        for (let face_id = 0; face_id < face_count; face_id++) {
            subtract(
                this.vertices.position, this.indices.position[1][face_id],
                this.vertices.position, this.indices.position[0][face_id],
                temp_buffer, 0
            );

            subtract(
                this.vertices.position, this.indices.position[2][face_id],
                this.vertices.position, this.indices.position[0][face_id],
                temp_buffer, 1
            );

            cross(
                temp_buffer, 0,
                temp_buffer, 1,
                temp_buffer, 2
            );

            this.faces.normal[0][face_id] = temp_buffer[0][2];
            this.faces.normal[1][face_id] = temp_buffer[1][2];
            this.faces.normal[2][face_id] = temp_buffer[2][2];

            if (flags & C.FLAG__GENERATE__FACE_COLORS) {
                // Assigned randomized colors to the faces:
                // TODO: Implement...
            }

            if (flags & C.FLAG__GENERATE__FACE_POSITIONS) {
                // Average face positions from their related vertex positions:
                // TODO: Implement...
            }
        }

        // Populate vertex normals:
        if (has_vertex_normals) {
            this.indices.normal = int3(face_count);
            this.vertices.normal = float3(
                (
                    flags & C.FLAG__SHARE__VERTEX_NORMALS
                ) > 0 ?
                    vertex_count :
                    face_count * 3
            );

            if (flags & C.FLAG__GENERATE__VERTEX_NORMALS) {
                if (flags & C.FLAG__SHARE__VERTEX_NORMALS) {
                    // Average vertex normals from their related face's normals:
                    // TODO: Implement...
                } else {
                    // Copy over face normals to their respective vertex normals
                    // TODO: Implement...
                }
            } else if (Array.isArray(input_vertices.normal)) num2float(
                input_vertices.normal,
                this.vertices.normal,

                input_indices.normal,
                this.indices.normal,

                (flags & C.FLAG__SHARE__VERTEX_NORMALS) > 0
            );
        }

        // Populate vertex colors:
        if (has_vertex_normals) {
            this.indices.color = int3(face_count);
            this.vertices.color = float3(
                (
                    flags & C.FLAG__SHARE__VERTEX_COLORS
                ) > 0 ?
                    vertex_count :
                    face_count * 3
            );

            if (flags & C.FLAG__GENERATE__VERTEX_COLORS) {
                if (flags & C.FLAG__GENERATE__FACE_COLORS) {
                    if (flags & C.FLAG__SHARE__VERTEX_COLORS) {
                        // Average vertex colors from their related face's colors:
                        // TODO: Implement...
                    } else {
                        // Copy over face colors to their respective vertex colors
                        // TODO: Implement...
                    }
                } else {
                    // Assigned randomized colors to the vertices
                    if (flags & C.FLAG__SHARE__VERTEX_COLORS) {
                        // TODO: Implement...
                    } else {
                        // TODO: Implement...
                    }
                }
            } else if (Array.isArray(input_vertices.color)) num2float(
                input_vertices.color,
                this.vertices.color,

                input_indices.color,
                this.indices.color,

                (flags & C.FLAG__SHARE__VERTEX_COLORS) > 0
            );
        }

        // Populate vertex UVs:
        if (has_uvs) {
            this.indices.uv = int3(face_count);
            this.vertices.uv = float3(
                (
                    flags & C.FLAG__SHARE__VERTEX_UVS
                ) > 0 ?
                    vertex_count :
                    face_count * 3
            );

            if (Array.isArray(input_vertices.uv)) num2float(
                input_vertices.uv,
                this.vertices.uv,

                input_indices.uv,
                this.indices.uv,

                (flags & C.FLAG__SHARE__VERTEX_UVS) > 0
            );
        }
    }

    static fromObj(obj: string, share_flags: number = C.DEFAULT_FLAGS): Mesh {
        const position_ids = num3();
        const normal_ids = num3();
        const color_ids = num3();
        const positions = num3();
        const normals = num3();
        const colors = num3();
        const uv_ids = num3();
        const uvs = num2();
        const ids = [position_ids, uv_ids, normal_ids, color_ids];

        let attr_ids, id: string;
        let strings: string[];
        let vertex, attr: number;

        for (const line of obj.split('\n')) {
            if (line.length === 0 || line[0] === '/')
                continue;

            strings = line.split(' ');
            switch (strings.shift()) {
                case C.OBJ_LINE_HEADER__VERTEX: str2num(strings, positions); break;
                case C.OBJ_LINE_HEADER__NORMAL: str2num(strings, normals); break;
                case C.OBJ_LINE_HEADER__UV:     str2num(strings, uvs); break;
                case C.OBJ_LINE_HEADER__FACE:
                    for ([vertex, attr_ids] of strings.entries())
                        for ([attr, id] of attr_ids.split('/').entries())
                            if (id !== '') ids[attr][vertex].push(+id);
            }
        }

        const vertices: IInputVaueBuffers = {position: positions};
        const indices: IInputIndexBuffers = {position: position_ids};

        if (normals[0].length) vertices.normal = normals;
        if (colors[0].length) vertices.color = colors;
        if (uvs[0].length) vertices.uv = uvs;

        if (normal_ids[0].length) indices.normal = normal_ids;
        if (color_ids[0].length) indices.color = color_ids;
        if (uv_ids[0].length) indices.uv = uv_ids;

        return new Mesh(vertices, indices, share_flags);
    }
}

const temp_buffer: Float3 = float3(3);

const str2num = (
    strings: string[],
    numbers: Num2 | Num3
) => {
    for (const [i, string] of strings.entries())
        numbers[i].push(+string);
};

const num2float = (
    input_values: Num2 | Num3,
    output_values: FloatBuffer,

    input_ids: Num3,
    output_ids: Int3,

    shared: boolean
) => {
    let vertex_num: number;
    let vertex_ids: number[];

    let component_num: number;
    let component_values: number[];

    if (shared) {
        for ([
            component_num,
            component_values
        ] of input_values.entries())
            output_values[component_num].set(component_values);

        for ([
            vertex_num,
            vertex_ids
        ] of input_ids.entries())
            output_ids[vertex_num].set(vertex_ids);
    } else {
        let output_id = 0;
        let input_id,
            face_id,
            vertex_num,
            component_num: number;

        for ([vertex_num, vertex_ids] of input_ids.entries()) {
            for ([face_id, input_id] of vertex_ids.entries()) {
                output_ids[vertex_num][face_id] = output_id;

                for ([
                    component_num,
                    component_values
                ] of input_values.entries())
                    output_values[component_num][output_id] = component_values[input_id];

                output_id++;
            }

            output_id += vertex_ids.length;
        }
    }
};

const num2float2 = (iv: Num2|Num3, ov: FloatBuffer, ii: Num3, oi: Int3, shared: boolean) => {
    if (shared) {
        for (const [i, v] of iv.entries()) ov[i].set(v);
        for (const [i, v] of ii.entries()) oi[i].set(v);
    } else {
        let oid = 0;
        for (const [i, ids] of ii.entries()) {
            for (const [j, id] of ids.entries()) {
                oi[i][j] = oid;
                for (const [c, vs] of iv.entries()) ov[c][oid] = vs[id];
                oid++;
            }
            oid += ids.length;
        }
    }
};