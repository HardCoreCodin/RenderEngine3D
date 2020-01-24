import Matrix4x4 from "../../accessors/matrix4x4.js";
import {ATTRIBUTE} from "../../../constants.js";
import {InputPositions} from "../../geometry/inputs.js";
import {
    Position2D,
    Position3D,
    Position4D
} from "../../accessors/position.js";
import {
    dir3,
    dir4,
    Direction3D,
    Direction4D
} from "../../accessors/direction.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {AnyConstructor} from "../../../types.js";
import {
    Triangle,
    TransformableVertexAttributeBuffer2D,
    TransformableVertexAttributeBuffer3D,
    TransformableVertexAttributeBuffer4D
} from "./_base.js";
import {
    _mulAllPos3Mat4,
    _mulSomePos3Mat4
} from "../_core.js";


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
    extends TransformableVertexAttributeBuffer3D<Position3D, PositionTriangle3D>
{
    readonly attribute: ATTRIBUTE.position;

    protected _getTriangleConstructor(): AnyConstructor<PositionTriangle3D> {
        return PositionTriangle3D
    }

    protected _getVectorConstructor(): VectorConstructor<Position3D> {
        return Position3D
    }

    mul4(matrix: Matrix4x4, out: VertexPositions4D, include?: Uint8Array[]): VertexPositions4D {
        if (include)
            _mulSomePos3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllPos3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
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

    protected _post_init(): void {
        super._post_init();
        this.arrays[3].fill(1);
    }

    load(input_attribute: InputPositions): this {
        return this._load(input_attribute.vertices, true)
    }
}