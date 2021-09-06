import { CUBE_FACE_VERTICES, CUBE_VERTEX_COUNT } from "./cube.js";
import { VertexPositions3D, VertexPositions4D } from "../buffers/attributes/positions.js";
import { Position3D, Position4D } from "../accessors/position.js";
class Bounds {
    load(source_positions) {
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
export class Bounds3D extends Bounds {
    constructor(vertex_positions = new VertexPositions3D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES), min = new Position3D(vertex_positions.arrays[0]), max = new Position3D(vertex_positions.arrays[6])) {
        super();
        this.vertex_positions = vertex_positions;
        this.min = min;
        this.max = max;
    }
}
export class Bounds4D extends Bounds {
    constructor(vertex_positions = new VertexPositions4D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES), min = new Position4D(vertex_positions.arrays[0]), max = new Position4D(vertex_positions.arrays[6])) {
        super();
        this.vertex_positions = vertex_positions;
        this.min = min;
        this.max = max;
    }
}
//# sourceMappingURL=bounds.js.map