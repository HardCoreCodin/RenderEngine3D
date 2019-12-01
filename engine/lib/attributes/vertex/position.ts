import {LoadableVertexAttribute} from "./_base.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {Position3D, Position4D} from "../../accessors/vector/position.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../../allocators/float.js";
import {IVertexPositions} from "../../_interfaces/attributes/vertex/position.js";
import {InputPositions} from "../../mesh/inputs.js";

export class VertexPositions3D extends LoadableVertexAttribute<DIM._3D, Position3D, InputPositions>
    implements IVertexPositions<DIM._3D, Position3D>
{
    readonly attribute = ATTRIBUTE.position;

    readonly dim = DIM._3D;
    readonly Vector = Position3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    protected _loadShared(input_attribute: InputPositions): void {
        this.arrays[0].set(input_attribute.vertices[0]);
        this.arrays[1].set(input_attribute.vertices[1]);
        this.arrays[2].set(input_attribute.vertices[2]);
    }
}

export class VertexPositions4D extends LoadableVertexAttribute<DIM._4D, Position4D, InputPositions>
    implements IVertexPositions<DIM._4D, Position4D>
{
    readonly attribute = ATTRIBUTE.position;

    readonly dim = DIM._4D;
    readonly Vector = Position4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    protected _loadShared(input_attribute: InputPositions): void {
        this.arrays[0].set(input_attribute.vertices[0]);
        this.arrays[1].set(input_attribute.vertices[1]);
        this.arrays[2].set(input_attribute.vertices[2]);
        this.arrays[3].fill(1);
    }

    protected _loadUnshared(input: InputPositions): void {
        super._loadUnshared(input);

        this.arrays[3].fill(1);
    }
}