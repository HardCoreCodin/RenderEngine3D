import {ATTRIBUTE, DIM} from "../../constants.js";
import {Position3D, Position4D} from "../accessors/position.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {IFacePositions, IVertexPositions, IVertexPositions3D, IVertexPositions4D} from "../_interfaces/attributes.js";
import {positionAttribute3DFunctions, transformableAttribute3DFunctions} from "../math/vec3.js";
import {InputPositions} from "./inputs.js";
import {Triangle, FaceAttribute, LoadableVertexAttribute} from "./attributes.js";
import {ICrossedDirection, IPosition, IVector3D} from "../_interfaces/vectors.js";
import {dir3, dir4, Direction3D, Direction4D} from "../accessors/direction.js";
import {transformableAttribute4DFunctions} from "../math/vec4.js";
// import {FaceVerticesInt32} from "./indices.js";
// import {Tuple} from "../../types.js";

const d1_3D = dir3();
const d2_3D = dir3();
const d1_4D = dir4();
const d2_4D = dir4();

abstract class PositionTriangle<
    Dim extends DIM,
    VectorType extends IPosition<Dim> & IVector3D>
    extends Triangle<VectorType>
{
    computeNormal(normal: ICrossedDirection<Dim>): void {}
}

export class PositionTriangle3D extends PositionTriangle<DIM._3D, Position3D> {
    computeNormal(normal: Direction3D): void {
        this.vertices[0].to(this.vertices[1], d1_3D);
        this.vertices[0].to(this.vertices[2], d2_3D);
        d1_3D.cross(d2_3D).normalized(normal);
    }
}

let p1, p2, p3: Position4D;
export class PositionTriangle4D extends PositionTriangle<DIM._4D, Position4D>
{
    computeNormal(normal: Direction4D): void {
        [p1, p2, p3] = this.vertices;
        p1.to(p2, d1_4D).cross(p1.to(p3, d2_4D)).normalized(normal);
    }

    // get in_view(): boolean {
    //     [p1, p2, p3] = this.vertices;
    //     return positionAttribute4DFunctions.in_view_tri(
    //         p1.x, p1.y, p1.z, p1.w,
    //         p2.x, p2.y, p2.z, p2.w,
    //         p3.x, p3.y, p3.z, p3.w
    //     );
    // }
    //
    // toNDC(out?: PositionTriangle3D|PositionTriangle4D): void {
    //     this.vertices[0].toNDC(out!.vertices[0]);
    //     this.vertices[1].toNDC(out!.vertices[1]);
    //     this.vertices[2].toNDC(out!.vertices[2]);
    // }

    as3D(out: PositionTriangle3D = new PositionTriangle3D()): PositionTriangle3D {
        this.vertices[0].as3D(out.vertices[0]);
        this.vertices[1].as3D(out.vertices[1]);
        this.vertices[2].as3D(out.vertices[2]);

        return out;
    }
}

export class VertexPositions3D
    extends LoadableVertexAttribute<
        ATTRIBUTE.position,
        DIM._3D,
        Position3D,
        PositionTriangle3D,
        InputPositions>
    implements IVertexPositions3D<Matrix3x3, Position3D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = positionAttribute3DFunctions;

    readonly dim = DIM._3D;
    readonly Vector = Position3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
    readonly Triangle = PositionTriangle3D;

    load(input_attribute: InputPositions): void {
        this._is_shared = true;
        this.arrays[0].set(input_attribute.vertices[0]);
        this.arrays[1].set(input_attribute.vertices[1]);
        this.arrays[2].set(input_attribute.vertices[2]);
    }
    //
    // homogenize(out: VertexPositions4D): VertexPositions4D {
    //     if (out) out.setFrom(this);
    //     else out = new VertexPositions4D(this._face_vertices, this._is_shared, this._face_count, [
    //         this.arrays[0],
    //         this.arrays[1],
    //         this.arrays[2],
    //         new Float32Array(this.length)
    //     ]);
    //
    //     out.arrays[3].fill(1);
    //
    //     return out;
    // }

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }

    mat4mul(matrix: Matrix4x4, out: VertexPositions4D): VertexPositions4D {
        this._.matrix_multiply_all_positions_by_mat4(
            this.arrays, matrix.id,
            matrix.arrays,
            out.arrays
        );

        return out;
    }
}

export class VertexPositions4D
    extends LoadableVertexAttribute<
        ATTRIBUTE.position,
        DIM._4D,
        Position4D,
        PositionTriangle4D,
        InputPositions>
    implements IVertexPositions4D<Matrix4x4, Position4D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = transformableAttribute4DFunctions;

    readonly dim = DIM._4D;
    readonly Vector = Position4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;
    readonly Triangle = PositionTriangle4D;

    load(input_attribute: InputPositions): void {
        this.arrays[0].set(input_attribute.vertices[0]);
        this.arrays[1].set(input_attribute.vertices[1]);
        this.arrays[2].set(input_attribute.vertices[2]);
        this.arrays[3].fill(1);
    }

    matmul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }

    // inView(mask?: Uint8Array): boolean {
    //     return this._.in_view_all(this.arrays, mask);
    // }

    // toNDC(out: VertexPositions3D|VertexPositions4D, mask?: Uint8Array): void {
    //     if (out)
    //         this._.to_ndc_all(this.arrays, out.arrays, mask);
    //     else
    //         this._.to_ndc_all_in_place(this.arrays, mask);
    // }
}

export class FacePositions3D
    extends FaceAttribute<ATTRIBUTE.position, ATTRIBUTE.position, DIM._3D, Position3D, VertexPositions3D>
    implements IFacePositions<DIM._3D, Matrix3x3, Position3D, VertexPositions3D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = transformableAttribute3DFunctions;

    readonly dim = DIM._3D;
    readonly Vector = Position3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    // homogenize(out?: FacePositions4D): FacePositions4D {
    //     if (out) out.setFrom(this);
    //     else out = new FacePositions4D(this._face_vertices, this._face_count, this._face_count, [
    //         this.arrays[0],
    //         this.arrays[1],
    //         this.arrays[2],
    //         new Float32Array(this.length)
    //     ]);
    //
    //     out.arrays[3].fill(1);
    //
    //     return out;
    // }

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }
}

export class FacePositions4D
    extends FaceAttribute<ATTRIBUTE.position, ATTRIBUTE.position, DIM._4D, Position4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = transformableAttribute4DFunctions;

    readonly dim = DIM._4D;
    readonly Vector = Position4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    pull(input: VertexPositions4D): void {
        super.pull(input);

        this.arrays[3].fill(1);
    }

    matmul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }
    //
    // inView(mask?: Uint8Array): boolean {
    //     return this._.in_view_all(this.arrays, mask);
    // }
    //
    // toNDC(out: VertexPositions3D|VertexPositions4D, mask?: Uint8Array): void {
    //     if (out)
    //         this._.to_ndc_all(this.arrays, out.arrays, mask);
    //     else
    //         this._.to_ndc_all_in_place(this.arrays, mask);
    // }
}