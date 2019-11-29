import {FaceAttribute} from "./_base.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {Direction3D, Direction4D, dir3D, dir4D} from "../../accessors/vector/direction.js";
import {VertexPositions3D, VertexPositions4D} from "../vertex/position.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../../allocators/float.js";
import {IFaceNormals} from "../../_interfaces/attributes/face/normal.js";
import {zip} from "../../../utils.js";

const dir3D1 = dir3D();
const dir3D2 = dir3D();
const dir4D1 = dir4D();
const dir4D2 = dir4D();

export class FaceNormals3D extends FaceAttribute<DIM._3D, Direction3D, VertexPositions3D>
    implements IFaceNormals<DIM._3D, Direction3D, VertexPositions3D>
{
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._3D;
    readonly Vector = Direction3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    pull(vertex_positions: VertexPositions3D) {
        for (const [face_normal, [p1, p2, p3]] of zip(this, vertex_positions.faces())) {
            p1.to(p2, dir3D1);
            p1.to(p3, dir3D2);
            dir3D1.cross(dir3D2).normalized(face_normal);
        }
    }
}

export class FaceNormals4D extends FaceAttribute<DIM._4D, Direction4D, VertexPositions4D>
    implements IFaceNormals<DIM._4D, Direction4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._4D;
    readonly Vector = Direction4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    pull(vertex_positions: VertexPositions4D) {
        for (const [face_normal, [p1, p2, p3]] of zip(this, vertex_positions.faces())) {
            p1.to(p2, dir4D1);
            p1.to(p3, dir4D2);
            dir4D1.cross(dir4D2).normalized(face_normal);
        }
    }
}