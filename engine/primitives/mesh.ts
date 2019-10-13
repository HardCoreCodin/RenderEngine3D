// import Position4D, {pos4} from "../linalng/4D/position.js";
// import Direction4D from "../linalng/4D/direction.js";
import Transform from "./transform.js";
import Triangles from "../buffers/triangle.js";
import Vertices from "../buffers/vertex.js";
import Direction4D from "../linalng/4D/direction";
import {tri} from "./triangle";
import {BaseBuffer} from "../buffers/base";

export type Meshes = Mesh[];

export class Mesh {
    constructor(
        public readonly count: number,
        public readonly vertices: Vertices = new Vertices(count * 3),
        public readonly triangles: Triangles = new Triangles(count, vertices),

        public transform: Transform = new Transform()
    ) {}

    static fromObj(obj: string, smooth_normals: boolean = false) : Mesh {
        let line_parts: string[];
        let line_header : string;
        let index: string;
        let index_parts: string[];

        let vertex_count = 0;
        let triangle_count = 0;

        const positions: number[] = [];
        const position_indices: number[] = [];

        const normals: number[] = [];
        const normal_indices: number[] = [];

        const uvs: number[] = [];
        const uv_indices: number[] = [];

        for (const line of obj.split('\n')) {
            line_parts = line.split(' ');
            line_header = line_parts.shift();

            if (line_header === 'f') {
                triangle_count++;

                for (index of line_parts) {
                    index_parts = index.split('/');
                    position_indices.push(+index_parts[0]);
                    if (index_parts[1] !== undefined) uv_indices.push(+index_parts[1]);
                    if (index_parts[2] !== undefined) normal_indices.push(+index_parts[2]);
                }
            } else if (line_header === 'v') {
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