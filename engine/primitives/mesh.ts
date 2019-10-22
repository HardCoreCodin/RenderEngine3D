import * as C from "../constants.js";
import {cross, subtract} from "../math/vec3.js";
import {num2, num3, int3, float3, float2} from "../factories.js";
import {Num2, Num3, Int3, Float3, Float4, IData, IInputData} from "../types.js";

export class Mesh {
    public readonly data: IData;

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
        public readonly input: IInputData,
        public readonly flags: number = C.DEFAULT_FLAGS,
        public readonly face_count: number = input.index.position[0].length,
        public readonly vertex_count: number = input.vertex.position[0].length
    ) {
        const unique_attr_length = vertex_count;
        const shared_attr_length = face_count * 3;
        const attr_length = (shared: boolean) : number => shared ? shared_attr_length : unique_attr_length;

        this.shared_positions = !!(C.FLAG__SHARE__VERTEX_POSITIONS & flags);
        this.shared_normals = !!(C.FLAG__SHARE__VERTEX_NORMALS & flags);
        this.shared_colors = !!(C.FLAG__SHARE__VERTEX_COLORS & flags);
        this.shared_uvs = !!(C.FLAG__SHARE__VERTEX_UVS & flags);

        this.generated_face_positions = !!(C.FLAG__GENERATE__FACE_POSITIONS & flags);
        this.generated_face_colors = !!(C.FLAG__GENERATE__FACE_COLORS & flags);
        this.generated_vertex_colors = !!(C.FLAG__GENERATE__VERTEX_COLORS & flags);
        this.generated_vertex_normals = !!(C.FLAG__GENERATE__VERTEX_NORMALS & flags);

        this.has_uv_inputs = this.has_input('uv');
        this.has_color_inputs = this.has_input('color');
        this.has_normal_inputs = this.has_input('normal');

        this.has_uvs = this.has_uv_inputs;
        this.has_face_positions = this.generated_face_positions;
        this.has_face_colors = this.generated_face_colors;
        this.has_vertex_colors = this.generated_vertex_colors || this.has_color_inputs;
        this.has_vertex_normals = this.generated_vertex_normals || this.has_normal_inputs;

        this.data.vertex = {position: float3(attr_length(this.shared_positions))};
        this.data.index = {position: int3(face_count)};
        this.data.face = {normal: float3(face_count)};

        let out: Float3 | Float4 = this.data.vertex.position;
        let _in: Float3 | Float4 | Num3 | Num2 = input.vertex.position;

        let oid: Int3 = this.data.index.position;
        let iid: Int3 | Num3 = input.index.position;

        // Temporary float arrays for computations:
        const temp = float3(3);

        // Populate positions:
        this.setVertexAttribute('position');

        // Populate face attributes:
        for (let face_id = 0; face_id < face_count; face_id++) {
            // Generate face normals:
            subtract(out, oid[1][face_id], out, oid[0][face_id], temp, 0);
            subtract(out, oid[2][face_id], out, oid[0][face_id], temp, 1);
            cross(temp, 0, temp, 1, temp, 2);

            out = this.data.face.normal;
            out[0][face_id] = temp[0][2];
            out[1][face_id] = temp[1][2];
            out[2][face_id] = temp[2][2];

            // Generate face colors:
            if (this.generated_face_colors) {
                // Assigned randomized colors to the faces:
                out = this.data.face.color;
                out[0][face_id] = Math.random();
                out[1][face_id] = Math.random();
                out[2][face_id] = Math.random();
            }

            // Generate face positions:
            if (this.generated_face_positions) {
                // Average face positions by averaging their related vertex positions:
                out = this.data.face.position;
                _in = this.data.vertex.position;
                iid = this.data.index.position;
                let [
                    x_pos, x, v1,
                    y_pos, y, v2,
                    z_pos, z, v3
                ] = [
                    _in[0], out[0], iid[0][face_id],
                    _in[1], out[1], iid[1][face_id],
                    _in[2], out[2], iid[2][face_id]
                ];
                x[face_id] = (x_pos[v1] + x_pos[v2] + x_pos[v3]) / 3;
                y[face_id] = (y_pos[v1] + y_pos[v2] + y_pos[v3]) / 3;
                z[face_id] = (z_pos[v1] + z_pos[v2] + z_pos[v3]) / 3;
            }
        }

        // Populate vertex normals:
        if (this.has_vertex_normals) {
            this.data.index.normal = int3(face_count);
            this.data.vertex.normal = float3(attr_length(this.shared_normals));

            if (this.generated_vertex_normals) {
                if (this.shared_normals) {
                    // Average vertex normals from their related face's normals:
                    // TODO: Implement...
                } else {
                    // Copy over face normals to their respective vertex normals
                    // TODO: Implement...
                }
            } else if (this.has_normal_inputs) this.setVertexAttribute('normal');
        }

        // Populate vertex colors:
        if (this.has_vertex_normals) {
            this.data.index.color = int3(face_count);
            this.data.vertex.color = float3(attr_length(this.shared_colors));

            if (this.generated_vertex_colors) {
                if (this.generated_face_colors) {
                    if (this.shared_colors) {
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
            } else if (this.has_color_inputs) this.setVertexAttribute('color');
        }

        // Populate vertex UVs:
        if (this.has_uv_inputs) {
            this.data.index.uv = int3(face_count);
            this.data.vertex.uv = float2(attr_length(this.shared_uvs));
            this.setVertexAttribute('uv');
        }
    }

    has_input = (attribute: string) : boolean => (
        attribute in this.input.vertex && this.input.vertex[attribute][0].length > 0 &&
        attribute in this.input.index && this.input.index[attribute][0].length > 0
    );

    is_shared = (attribute: string) : boolean => {
        switch(attribute) {
            case 'position': return this.shared_positions;
            case 'normal': return this.shared_normals;
            case 'color': return this.shared_colors;
            case 'uv': return this.shared_uvs;
        }
    };

    setVertexAttribute = (attribute: string) => {
        const data_index = this.data.index[attribute];
        const data_vertex = this.data.vertex[attribute];
        const input_index = this.input.index[attribute];
        const input_vertex = this.input.vertex[attribute];

        let face_id, input_id, vertex_num, component_num, data_id : number = 0;
        let input_values, input_ids: number[];
        if (this.is_shared(attribute)) {
            for ([component_num, input_values] of input_vertex.entries())
                data_vertex[component_num].set(input_values);

            for ([vertex_num, input_ids] of input_index.entries())
                data_index[vertex_num].set(input_ids);
        } else {
            for ([vertex_num, input_ids] of input_index.entries()) {
                for ([face_id, input_id] of input_ids.entries()) {
                    data_index[vertex_num][face_id] = data_id;

                    for ([component_num, input_values] of input_vertex.entries())
                        data_vertex[component_num][data_id] = input_values[input_id];

                    data_id++;
                }

                data_id += input_ids.length;
            }
        }
    };

    static fromObj(obj: string, share_flags: number = C.DEFAULT_FLAGS): Mesh {
        const position_ids = num3();
        const normal_ids = num3();
        const color_ids = num3();
        const positions = num3();
        const normals = num3();
        const colors = num3();
        const uv_ids = num3();
        const uvs = num2();

        // Order of attributes from the .obj format spec.
        const values = [position_ids, uv_ids, normal_ids, color_ids];

        let vertex_num,
            attribute_num: number;
        let indices, index: string;
        let strings: string[];

        const push = (attribute_values: Num2 | Num3) : void => {
            for (const [i, string] of strings.entries())
                attribute_values[i].push(+string);
        };

        for (const line of obj.split('\n')) {
            if (line.length === 0 || line[0] === '/')
                continue;

            strings = line.split(' ');
            switch (strings.shift()) {
                case C.OBJ_LINE_HEADER__VERTEX: push(positions); break;
                case C.OBJ_LINE_HEADER__NORMAL: push(normals); break;
                case C.OBJ_LINE_HEADER__UV:     push(uvs); break;
                case C.OBJ_LINE_HEADER__FACE:
                    for ([vertex_num, indices] of strings.entries())
                        for ([attribute_num, index] of indices.split('/').entries())
                            if (index !== '') values[attribute_num][vertex_num].push(+index);
            }
        }

        const input: IInputData = {
            vertex: {position: positions},
            index: {position: position_ids}
        };

        if (normals[0].length) input.vertex.normal = normals;
        if (colors[0].length) input.vertex.color = colors;
        if (uvs[0].length) input.vertex.uv = uvs;

        if (normal_ids[0].length) input.index.normal = normal_ids;
        if (color_ids[0].length) input.index.color = color_ids;
        if (uv_ids[0].length) input.index.uv = uv_ids;

        return new Mesh(input, share_flags);
    }
}