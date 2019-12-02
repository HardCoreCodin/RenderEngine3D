import {PulledVertexAttribute} from "./_base.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {Direction3D, Direction4D} from "../../accessors/vector/direction.js";
import {FaceNormals3D, FaceNormals4D} from "../face/normal.js";
import {IVertexNormals} from "../../_interfaces/attributes/vertex/normal.js";
import {InputNormals} from "../../mesh/inputs.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../../allocators.js";

export class VertexNormals3D extends PulledVertexAttribute<DIM._3D, Direction3D, InputNormals, FaceNormals3D>
    implements IVertexNormals<DIM._3D, Direction3D>
{
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._3D;
    readonly Vector = Direction3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
}

export class VertexNormals4D extends PulledVertexAttribute<DIM._4D, Direction4D, InputNormals, FaceNormals4D>
    implements IVertexNormals<DIM._4D, Direction4D>
{
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._4D;
    readonly Vector = Direction4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;
}
