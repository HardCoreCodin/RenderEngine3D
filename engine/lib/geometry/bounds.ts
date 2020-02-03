import {cube_face_vertices, cube_vertex_count} from "./cube.js";
import {VertexPositions3D, VertexPositions4D} from "../buffers/attributes/positions.js";
import {Position3D, Position4D} from "../accessors/position.js";
import {IBounds, IBounds3D, IBounds4D} from "../_interfaces/geometry.js";


abstract class Bounds implements IBounds {
    abstract readonly vertex_positions: VertexPositions3D | VertexPositions4D;
    abstract readonly min: Position3D | Position4D;
    abstract readonly max: Position3D | Position4D;

    load(source_positions: VertexPositions3D | VertexPositions4D) {
        const [source_x, source_y, source_z] = source_positions.arrays;
        const [x, y, z] = this.vertex_positions.arrays;

        x[0] = x[3] = x[4] = x[7] = Math.min.apply(Math, source_x);
        x[1] = x[2] = x[5] = x[6] = Math.max.apply(Math, source_x);

        y[0] = y[1] = y[4] = y[5] = Math.min.apply(Math, source_y);
        y[2] = y[3] = y[6] = y[7] = Math.max.apply(Math, source_y);

        z[0] = z[1] = z[2] = z[3] = Math.min.apply(Math, source_z);
        z[4] = z[5] = z[6] = z[7] = Math.max.apply(Math, source_z);
    }
}

export class Bounds3D extends Bounds implements IBounds3D {
    constructor(
        readonly vertex_positions = new VertexPositions3D().autoInit(cube_vertex_count, cube_face_vertices),
        readonly min = new Position3D(0, vertex_positions.arrays),
        readonly max = new Position3D(6, vertex_positions.arrays)
    ) {
        super();
    }
}

export class Bounds4D extends Bounds implements IBounds4D {
    constructor(
        readonly vertex_positions = new VertexPositions4D().autoInit(cube_vertex_count, cube_face_vertices),
        readonly min = new Position4D(0, vertex_positions.arrays),
        readonly max = new Position4D(6, vertex_positions.arrays)
    ) {
        super();
    }
}