import {dir3, dir4, Direction3D, Direction4D} from "../accessors/direction.js";
import {ATTRIBUTE, DIM} from "../../constants.js";
import {VertexPositions3D, VertexPositions4D} from "./positions.js";
import {IFaceNormals, IVertexNormals, IVertexNormals3D, IVertexNormals4D} from "../_interfaces/attributes.js";
import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {directionAttribute4DFunctions, transformableAttribute4DFunctions} from "../math/vec4.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {zip} from "../../utils.js";
import {directionAttribute3DFunctions, transformableAttribute3DFunctions} from "../math/vec3.js";
import {InputNormals} from "./inputs.js";
import {FaceAttribute, PulledVertexAttribute, Triangle} from "./attributes.js";

class NormalTriangle<VectorType extends Direction3D|Direction4D> extends Triangle<VectorType> {}
class NormalTriangle3D extends NormalTriangle<Direction3D> {}
class NormalTriangle4D extends NormalTriangle<Direction4D> {}


export class VertexNormals3D
    extends PulledVertexAttribute<
        ATTRIBUTE.normal,
        ATTRIBUTE.position,
        DIM._3D,
        Direction3D,
        NormalTriangle3D,
        InputNormals,
        FaceNormals3D>
    implements IVertexNormals3D<Matrix3x3, Direction3D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = directionAttribute3DFunctions;

    readonly dim = DIM._3D;
    readonly Vector = Direction3D;
    readonly Triangle = NormalTriangle3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    // homogenize(out?: VertexNormals4D): VertexNormals4D {
    //     if (out) out.setFrom(this);
    //     else out = new VertexNormals4D(this._face_vertices, this._is_shared, this._face_count, [
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

    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    load(input: InputNormals): void {
        super.load(input);
        this.normalize();
    }

    matmul(matrix: Matrix3x3, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }

    mat4mul(matrix: Matrix4x4, out: VertexNormals4D): VertexNormals4D {
        this._.matrix_multiply_all_directions_by_mat4(
            this.arrays, matrix.id,
            matrix.arrays,
            out.arrays
        );

        return out;
    }
}

export class VertexNormals4D
    extends PulledVertexAttribute<
        ATTRIBUTE.normal,
        ATTRIBUTE.position,
        DIM._4D,
        Direction4D,
        NormalTriangle4D,
        InputNormals,
        FaceNormals4D>
    implements IVertexNormals4D<Matrix4x4, Direction4D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = directionAttribute4DFunctions;

    readonly dim = DIM._4D;
    readonly Vector = Direction4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;
    readonly Triangle = NormalTriangle4D;


    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    load(input: InputNormals): void {
        super.load(input);
        this.normalize();
    }

    matmul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }
}

export class FaceNormals3D
    extends FaceAttribute<
        ATTRIBUTE.normal,
        ATTRIBUTE.position,
        DIM._3D,
        Direction3D,
        VertexPositions3D>
    implements IFaceNormals<DIM._3D, Matrix3x3, Direction3D, VertexPositions3D>
{
    readonly _ = directionAttribute3DFunctions;

    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._3D;
    readonly Vector = Direction3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    pull(vertex_positions: VertexPositions3D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
    }

    // homogenize(out?: FaceNormals4D): FaceNormals4D {
    //     if (out) out.setFrom(this);
    //     else out = new FaceNormals4D(this._face_vertices, this._face_count, this._face_count, [
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

export class FaceNormals4D
    extends FaceAttribute<
        ATTRIBUTE.normal,
        ATTRIBUTE.position,
        DIM._4D,
        Direction4D,
        VertexPositions4D>
    implements IFaceNormals<DIM._4D, Matrix4x4, Direction4D, VertexPositions4D>
{
    readonly _ = directionAttribute4DFunctions;
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._4D;
    readonly Vector = Direction4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    normalize(): this {
        this._.normalize_all_in_place(this.arrays);
        return this;
    }

    pull(vertex_positions: VertexPositions4D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
    }

    matmul(matrix: Matrix4x4, out?: this): this {
        if (out) {
            this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
            return out;
        }

        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
        return this;
    }
}
