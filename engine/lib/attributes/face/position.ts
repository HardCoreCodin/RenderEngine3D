import {FaceAttribute} from "./_base.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {Position3D, Position4D} from "../../accessors/vector/position.js";
import {VertexPositions3D, VertexPositions4D} from "../vertex/position.js";
import {IFacePositions} from "../../_interfaces/attributes/face/position.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../../allocators.js";

export class FacePositions3D
    extends FaceAttribute<DIM._3D, Position3D, VertexPositions3D>

    implements IFacePositions<DIM._3D, Position3D, VertexPositions3D>
{
    readonly attribute = ATTRIBUTE.position;

    readonly dim = DIM._3D;
    readonly Vector = Position3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
}

export class FacePositions4D
    extends FaceAttribute<DIM._4D, Position4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.position;

    readonly dim = DIM._4D;
    readonly Vector = Position4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    pull(input: VertexPositions4D): void {
        super.pull(input);

        this.arrays[3].fill(1);
    }
}