import {DIM} from "../../constants.js";
import {face_vertices} from "./cube.js";
import {VertexPositions3D, VertexPositions4D} from "../attributes/vertex/position.js";
import {IVertexPositions, IVertexPositionsConstructor} from "../_interfaces/attributes/vertex/position.js";


abstract class AABB<Dim extends DIM._3D|DIM._4D>
{
    protected readonly VertexPositions: IVertexPositionsConstructor<Dim>;
    public readonly positions: IVertexPositions<Dim>;

    constructor() {
        this.positions = new this.VertexPositions(face_vertices);
    }

    load(source_positions: VertexPositions3D|VertexPositions4D) {
        const [x, y, z] = this.positions.arrays;

        x[0] = x[3] = x[4] = x[7] = Math.min.apply(Math, source_positions[0]);
        x[1] = x[2] = x[5] = x[6] = Math.max.apply(Math, source_positions[0]);

        y[0] = y[1] = y[4] = x[5] = Math.min.apply(Math, source_positions[1]);
        y[2] = y[3] = y[6] = y[7] = Math.max.apply(Math, source_positions[1]);

        z[0] = z[1] = z[2] = z[3] = Math.min.apply(Math, source_positions[2]);
        z[4] = z[5] = z[6] = z[7] = Math.max.apply(Math, source_positions[2]);
    }
}

export class AABB3D
    extends AABB<DIM._3D>
{
    protected readonly VertexPositions = VertexPositions3D;
    public positions: VertexPositions3D;
}

export class AABB4D
    extends AABB<DIM._4D>
{
    protected readonly VertexPositions = VertexPositions4D;
    public positions: VertexPositions4D;
}