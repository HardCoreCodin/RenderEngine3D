import {ATTRIBUTE} from "../../constants.js";
import {Matrix4x4} from "./matrix4x4.js";
import {InputPositions} from "../geometry/inputs.js";
import {TransformableVector2D} from "./vector2D.js";
import {TransformableVector3D} from "./vector3D.js";
import {TransformableVector4D} from "./vector4D.js";
import {
    Triangle,
    TransformableFaceAttributeBuffer2D,
    TransformableFaceAttributeBuffer3D,
    TransformableFaceAttributeBuffer4D,
    TransformableVertexAttributeBuffer2D,
    TransformableVertexAttributeBuffer3D,
    TransformableVertexAttributeBuffer4D
} from "./attributes.js";
import {dir3, dir4, Direction2D, Direction3D, Direction4D} from "./direction.js";
import {
    compute_the_distance_from_a_2D_position_to_another_2D_position,
    square_the_distance_from_a_2D_positions_to_another_2D_position,
    subtract_a_2D_vector_from_another_2D_vector_to_out
} from "../math/vec2.js";
import {
    compute_the_distance_from_a_3D_position_to_another_3D_position,
    multiply_a_3D_position_by_a_4x4_matrix_to_out,
    square_the_distance_from_a_3D_positions_to_another_3D_position,
    subtract_a_3D_vector_from_another_3D_vector_to_out
} from "../math/vec3.js";
import {
    compute_the_distance_from_a_4D_position_to_another_4D_position,
    square_the_distance_from_a_4D_positions_to_another_4D_position,
    subtract_a_4D_vector_from_another_4D_vector_to_out
} from "../math/vec4.js";
import {IPosition2D, IPosition3D, IPosition4D, VectorConstructor} from "../_interfaces/vectors.js";
import {AnyConstructor} from "../../types.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export class Position2D extends TransformableVector2D implements IPosition2D
{
    copy(out: Position2D = new Position2D()): Position2D {return out.setFrom(this)}

    distanceTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return compute_the_distance_from_a_2D_position_to_another_2D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        );
    }

    distanceSquaredTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return square_the_distance_from_a_2D_positions_to_another_2D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        );
    }

    to(other: this, out: Direction2D): typeof out {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_2D_vector_from_another_2D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1],

            out.id,
            out_arrays[0],
            out_arrays[1]
        );

        return out;
    }

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
}

export class Position3D extends TransformableVector3D implements IPosition3D
{
    copy(out: Position3D = new Position3D()): Position3D {return out.setFrom(this)}

    distanceTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return compute_the_distance_from_a_3D_position_to_another_3D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );
    }

    distanceSquaredTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return square_the_distance_from_a_3D_positions_to_another_3D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );
    }

    to(other: this, out: Direction3D): typeof out {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_3D_vector_from_another_3D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );

        return out;
    }

    mat4mul(matrix: Matrix4x4, out: Position4D): Position4D {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;
        out_arrays = out.arrays;

        multiply_a_3D_position_by_a_4x4_matrix_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export class Position4D extends TransformableVector4D implements IPosition4D
{
    copy(out: Position4D = new Position4D()): Position4D {return out.setFrom(this)}

    distanceTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return compute_the_distance_from_a_4D_position_to_another_4D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3]
        );
    }

    distanceSquaredTo(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return square_the_distance_from_a_4D_positions_to_another_4D_position(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3]
        );
    }

    to(other: this, out: Direction4D): Direction4D {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_4D_vector_from_another_4D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }

    get xx(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Position2D {return new Position2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Position2D {return new Position2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Position2D {return new Position2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Position3D {return new Position3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Position3D {return new Position3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Position3D {return new Position3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Position2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Position2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Position2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Position3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Position3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Position3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export const pos2 = (
    x: number = 0,
    y: number = x
): Position2D => new Position2D().setTo(x, y);

export const pos3 = (
    x: number = 0,
    y: number = x,
    z: number = x
): Position3D => new Position3D().setTo(x, y, z);

export const pos4 = (
    x: number = 0,
    y: number = x,
    z: number = x,
    w: number = x
): Position4D => new Position4D().setTo(x, y, z, w);


// Attribute Buffers:

const d1_3D = dir3();
const d2_3D = dir3();
const d1_4D = dir4();
const d2_4D = dir4();

export class PositionTriangle2D extends Triangle<Position2D> {
}

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
    extends TransformableVertexAttributeBuffer2D<Position2D, PositionTriangle2D> {
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
    extends TransformableVertexAttributeBuffer3D<Position3D,
        PositionTriangle3D,
        Position4D,
        PositionTriangle4D,
        VertexPositions4D> {
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

export class FacePositions2D
    extends TransformableFaceAttributeBuffer2D<Position2D> {
    readonly attribute: ATTRIBUTE.position;

    protected _getVectorConstructor(): VectorConstructor<Position2D> {
        return Position2D
    }

    pull(input: VertexPositions2D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }
}

export class FacePositions3D
    extends TransformableFaceAttributeBuffer3D<Position3D,
        Position4D,
        FacePositions4D> {
    readonly attribute: ATTRIBUTE.position;

    protected _getVectorConstructor(): VectorConstructor<Position3D> {
        return Position3D;
    }

    pull(input: VertexPositions3D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }
}

export class FacePositions4D
    extends TransformableFaceAttributeBuffer4D<Position4D> {
    readonly attribute: ATTRIBUTE.position;

    protected _getVectorConstructor(): VectorConstructor<Position4D> {
        return Position4D
    }

    pull(input: VertexPositions4D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }
}