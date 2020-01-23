import {ATTRIBUTE} from "../../../constants.js";
import {InputPositions} from "../../geometry/inputs.js";
import {Position2D, Position3D, Position4D} from "../../accessors/position.js";
import {dir3, dir4, Direction3D, Direction4D} from "../../accessors/direction.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {AnyConstructor} from "../../../types.js";
import {
    TransformableVertexAttributeBuffer2D,
    TransformableVertexAttributeBuffer3D,
    TransformableVertexAttributeBuffer4D, Triangle
} from "./_base.js";

const d1_3D = dir3();
const d2_3D = dir3();
const d1_4D = dir4();
const d2_4D = dir4();

export class PositionTriangle2D extends Triangle<Position2D> {}
export class PositionTriangle3D extends Triangle<Position3D> {
    computeNormal(normal: Direction3D): void {
        this.vertices[0].to(this.vertices[1], d1_3D);
        this.vertices[0].to(this.vertices[2], d2_3D);
        d1_3D.cross(d2_3D).normalize(normal);
    }
}

export class PositionTriangle4D extends Triangle<Position4D> {
    computeNormal(normal: Direction4D): void {
        this.vertices[0].to(this.vertices[1], d1_4D);
        this.vertices[0].to(this.vertices[2], d2_4D);
        d1_4D.cross(d2_4D).normalize(normal);
    }
}

export class VertexPositions2D
    extends TransformableVertexAttributeBuffer2D<Position2D, PositionTriangle2D>
{
    readonly attribute: ATTRIBUTE.position;

    protected _getTriangleConstructor(): AnyConstructor<PositionTriangle2D> {
        return PositionTriangle2D
    }

    protected _getVectorConstructor(): VectorConstructor<Position2D> {
        return Position2D
    }

    load(input_attribute: InputPositions): this {
        return this._load(input_attribute.vertices, true)
    }
}

export class VertexPositions3D
    extends TransformableVertexAttributeBuffer3D<
        Position3D,
        PositionTriangle3D,
        Position4D,
        PositionTriangle4D,
        VertexPositions4D>
{
    readonly attribute: ATTRIBUTE.position;

    protected _getTriangleConstructor(): AnyConstructor<PositionTriangle3D> {
        return PositionTriangle3D
    }

    protected _getVectorConstructor(): VectorConstructor<Position3D> {
        return Position3D
    }

    load(input_attribute: InputPositions): this {
        return this._load(input_attribute.vertices, true)
    }
}

export class VertexPositions4D
    extends TransformableVertexAttributeBuffer4D<Position4D, PositionTriangle4D> {
    readonly attribute: ATTRIBUTE.position;

    protected _getTriangleConstructor(): AnyConstructor<PositionTriangle4D> {
        return PositionTriangle4D
    }

    protected _getVectorConstructor(): VectorConstructor<Position4D> {
        return Position4D
    }

    load(input_attribute: InputPositions): this {
        return this._load(input_attribute.vertices, true)
    }
}