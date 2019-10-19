// import Position4D, {pos4} from "../linalng/4D/position.js";
// import Direction4D from "../linalng/4D/direction.js";
import Transform from "./transform.js";
import Triangles from "../buffers/triangle.js";
import Vertices from "../buffers/vertex.js";
import Direction4D from "../linalng/4D/direction";
import {tri} from "./triangle";
import {BaseBuffer, Uint32Buffer} from "../buffers/base";
import {floatData} from "../types";

export type Meshes = Mesh[];

const OBJ_LINE_HEADER__INDICES = 'f';
const OBJ_LINE_HEADER__POSITIONS = 'v';
const OBJ_LINE_HEADER__NORMALS = 'vn';
const OBJ_LINE_HEADER__UVS = 'vt';


export class Mesh {
    constructor(
        public readonly face_count: number,
        public readonly vertex_count: number,

        public readonly vertex_positions: floatData,
        public readonly vertex_normals: floatData,
        public readonly vertex_colors: floatData,
        public readonly vertex_uvs: floatData,

        public readonly face_positions: floatData,
        public readonly face_normals: floatData,
        public readonly face_colors: floatData,
        public readonly face_uvs: floatData,

        public readonly position_indices: Uint32Array,
        public readonly normal_indices: Uint32Array,
        public readonly color_indices: Uint32Array,
        public readonly uv_indices: Uint32Array,

        public readonly shared_vertex_positions: boolean = vertex_positions.length === vertex_count,
        public readonly shared_vertex_normals: boolean = vertex_normals.length === vertex_count,
        public readonly shared_vertex_colors: boolean = vertex_colors.length === vertex_count,
        public readonly shared_vertex_uvs: boolean = vertex_uvs.length === vertex_count,

        public readonly transform: Transform = new Transform()
    ) {}

    static fromObj(obj: string, share_vertex_positions: boolean = true, smooth_normals: boolean = false) : Mesh {
        //
        // const positions: number[] = [];
        // const position_indices: number[] = [];
        //
        // const normals: number[] = [];
        // const normal_indices: number[] = [];
        //
        // const uvs: number[] = [];
        // const uv_indices: number[] = [];

        let line_parts: string[];
        let line_header : string;

        let vertex_index: number;
        let vertex_indices: string[];

        let line: string[];
        let line_index: number;
        let line_part: string;
        let line_part_index: number;

        let offset: number;
        let face_index: number;
        let face_vertex_index: number;

        const index_lines = [];
        const position_lines = [];
        const normal_lines = [];
        const uv_lines = [];

        for (const line of obj.split('\n')) {
            line_parts = line.split(' ');
            line_header = line_parts.shift();

            switch (line_header) {
                case OBJ_LINE_HEADER__INDICES: index_lines.push(line_parts); break;
                case OBJ_LINE_HEADER__POSITIONS: position_lines.push(line_parts); break;
                case OBJ_LINE_HEADER__NORMALS: normal_lines.push(line_parts); break;
                case OBJ_LINE_HEADER__UVS: uv_lines.push(line_parts); break;
            }
        }

        const vertices_per_face = index_lines[0].length;
        const vertex_count = position_lines.length;
        const face_count = index_lines.length;

        const vertex_array_length = vertex_count << 2;
        const face_array_length = face_count << 2;
        const index_array_length = face_count * vertices_per_face;

        const vertex_positions = new floatData(vertex_array_length);
        const face_positions = new floatData(face_array_length);
        const face_normals: floatData = new floatData(face_array_length);
        const face_colors: floatData = new floatData(face_array_length);
        const face_uvs: floatData = new floatData(face_count << 1);

        const position_indices = new Uint32Array(index_array_length);
        const normal_indices = new Uint32Array(index_array_length);
        const color_indices = new Uint32Array(index_array_length);
        const uv_indices = new Uint32Array(index_array_length);

        // Collect index arrays::
        for ([line_index, line] of index_lines.entries()) {
            offset = line_index * vertices_per_face;

            for ([line_part_index, line_part] of line.entries()) {
                offset += line_part_index;

                vertex_indices = line_part.split('/');

                position_indices[offset] = +vertex_indices[0];
                if (vertex_indices[1] !== undefined) uv_indices[offset] = +vertex_indices[1];
                if (vertex_indices[2] !== undefined) normal_indices[offset] = +vertex_indices[2];
                // TODO: Vertex colors
            }
        }

        vertex_positions.fill(1);
        for ([line_index, line] of position_lines.entries()) {
            offset = line_index * vertices_per_face;
            for ([line_part_index, line_part] of line.entries()) {
                offset += line_part_index;
                vertex_positions[offset] = +line_part;
            }
        }

        const a_to_b = 
        for (face_index = 0; face_index < face_count; face_index++) {
            offset = face_index * vertices_per_face;

            for (face_vertex_index = 0; face_vertex_index < vertices_per_face; face_vertex_index++) {
                vertex_index = position_indices[offset + face_vertex_index];
                face_positions[face_index  ] += vertex_positions[vertex_index  ];
                face_positions[face_index+1] += vertex_positions[vertex_index+1];
                face_positions[face_index+2] += vertex_positions[vertex_index+2];
            }

            face_positions[face_index  ] /= vertices_per_face;
            face_positions[face_index+1] /= vertices_per_face;
            face_positions[face_index+2] /= vertices_per_face;
            face_positions[face_index+3] = 1;

            if (normal_lines.length === 0) {
                // Compute face normals from face vertex positions:

            }
        }

        let vertex_normals: floatData;
        let normal_index: number;

        if (normal_lines.length) {
            vertex_normals = new floatData(normal_lines.length);
            for ([line_index, line] of normal_lines.entries()) {
                offset = line_index * vertices_per_face;
                for ([line_part_index, line_part] of line.entries())
                    vertex_normals[offset + line_part_index] = +line_part;
            }

            // Compute face normals as average of vertex normals
            for (face_index = 0; face_index < face_count; face_index++) {
                offset = face_index * vertices_per_face;

                for (face_vertex_index = 0; face_vertex_index < vertices_per_face; face_vertex_index++) {
                    vertex_index = normal_indices[offset + face_vertex_index];
                    face_normals[face_index  ] += vertex_normals[vertex_index  ];
                    face_normals[face_index+1] += vertex_normals[vertex_index+1];
                    face_normals[face_index+2] += vertex_normals[vertex_index+2];
                }

                face_normals[face_index  ] /= vertices_per_face;
                face_normals[face_index+1] /= vertices_per_face;
                face_normals[face_index+2] /= vertices_per_face;
            }
        } else {
            // Compute face normals from face vertex positions:
            for (face_index = 0; face_index < face_count; face_index++) {
                offset = face_index * vertices_per_face;

                for (face_vertex_index = 0; face_vertex_index < vertices_per_face; face_vertex_index++) {
                    vertex_index = position_indices[offset + face_vertex_index];
                }
            }
            // Compute vertex normals:
            if (share_vertex_positions) {
                vertex_normals = new floatData(vertex_array_length);

            } else {
                vertex_normals = new floatData(vertex_array_length * vertices_per_face);
            }
        }



        for (const line of obj.split('\n')) {
            line_parts = line.split(' ');
            line_header = line_parts.shift();

            if (line_header === 'v') {
                vertex_count++;

                positions.push(+line_parts[0]);
                positions.push(+line_parts[1]);
                positions.push(+line_parts[2]);
                positions.push(1);
            } else if (line_header === 'vn') {
                normals.push(+line_parts[0]);
                normals.push(+line_parts[1]);
                normals.push(+line_parts[2]);
                normals.push(0);
            } else if (line_header === 'vt') {
                uvs.push(+line_parts[0]);
                uvs.push(+line_parts[1]);
                uvs.push(1);
            }
        }

        const mesh = new Mesh(triangle_count);
        mesh.vertices.positions.buffer.array.set(positions);
        mesh.triangles.indices.array.set(position_indices);

        const triangles = new Triangles(triangle_count);
        triangles.vertices.positions.buffer.array.set(positions);
        triangles.indices.array.set(position_indices);

        if (normals.length || uvs.length) {
            const vertex_normals = triangles.vertices.normals.buffer.array;
            const vertex_uvs = triangles.vertices.uvs.buffer.array;

            let v_idxs: number[];
            let n_idxs: number[];
            let uv_idxs: number[];

            let s, e: number;

            for (let t = 0; t < triangle_count; t++) {
                s = 3 * t;
                e = 3 * (t + 1);

                v_idxs = position_indices.slice(s, e);

                if (normals.length)
                    for (const [v_idx, n_idx] of normal_indices.slice(s, e).entries())
                        vertex_normals.set(
                            // Vertex normal data
                            normals.slice(
                                n_idx,
                                n_idx + 4
                            ),
                            // Offset correlated with vertex index
                            v_idxs[v_idx] * 4
                        );

                if (uvs.length)
                    for (const [v, uv_idx] of uv_indices.slice(s, e).entries())
                        vertex_uvs.set(
                            // Vertex UV coordinates data
                            normals.slice(
                                uv_idx,
                                uv_idx + 3
                            ),
                            // Offset correlated with vertex index
                            v_idxs[v] * 3
                        );
            }
        }



        const triangleLine1 = new Direction4D();
        const triangleLine2 = new Direction4D();
// normal(
//     normal: Direction4D = new Direction4D()
// ) : Direction4D {
//     // Get lines either side of triangle
//     this.vertices[0].position.to(this.vertices[1].position, triangleLine1);
//     this.vertices[0].position.to(this.vertices[2].position, triangleLine2);
//
//     // Take cross product of lines to get normal to triangle surface
//     return triangleLine1.cross(triangleLine2, normal).normalize();
// }

        return new Mesh(triangles);
    }

    setTo(buffer: BaseBuffer, source_data, source_indices) {

    }
}