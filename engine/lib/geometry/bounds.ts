import {cube_face_vertices} from "./cube.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";


export default class BBox {
    constructor(
        public readonly vertex_positions = new VertexPositions4D(cube_face_vertices)
    ) {}

    load(source_positions: VertexPositions3D|VertexPositions4D) {
        const [x, y, z] = this.vertex_positions.arrays;

        x[0] = x[3] = x[4] = x[7] = Math.min.apply(Math, source_positions[0]);
        x[1] = x[2] = x[5] = x[6] = Math.max.apply(Math, source_positions[0]);

        y[0] = y[1] = y[4] = x[5] = Math.min.apply(Math, source_positions[1]);
        y[2] = y[3] = y[6] = y[7] = Math.max.apply(Math, source_positions[1]);

        z[0] = z[1] = z[2] = z[3] = Math.min.apply(Math, source_positions[2]);
        z[4] = z[5] = z[6] = z[7] = Math.max.apply(Math, source_positions[2]);
    }
}