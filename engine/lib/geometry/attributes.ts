import {ATTRIBUTE, DIM} from "../../constants.js";
import {Vector} from "../accessors/vector.js";
import {FloatBuffer} from "../memory/buffers.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";
import {zip} from "../../utils.js";
import {InputAttribute, InputColors, InputNormals, InputPositions, InputUVs} from "./inputs.js";
import {FaceVerticesInt32} from "./indices.js";
import {Color3D, Color4D} from "../accessors/color.js";
import {VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {dir3, dir4, Direction3D, Direction4D} from "../accessors/direction.js";
import {Position3D, Position4D} from "../accessors/position.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {
    IAttribute,
    IFaceAttribute,
    IFaceColors,
    IFaceNormals,
    IFacePositions,
    ILoadableVertexAttribute,
    IPullableVertexAttribute,
    IVertexAttribute,
    IVertexColors,
    IVertexNormals,
    IVertexPositions,
    IVertexUVs
} from "../_interfaces/attributes.js";
import {IVector, VectorConstructor} from "../_interfaces/vectors.js";
import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {transformableAttribute3DFunctions} from "../math/vec3.js";
import {positionAttribute4DFunctions, transformableAttribute4DFunctions} from "../math/vec4.js";
import {Tuple} from "../../types.js";

export abstract class Attribute<Attr extends ATTRIBUTE, Dim extends DIM, VectorType extends Vector>
    extends FloatBuffer<Dim>
    implements IAttribute<Attr, Dim, VectorType>
{
    readonly abstract attribute: Attr;
    readonly abstract Vector: VectorConstructor<VectorType>;

    arrays: Tuple<Float32Array, Dim>;
    current: VectorType;

    constructor(
        protected _face_vertices: IFaceVertices,
        protected _face_count: number = _face_vertices.length,
        length: number = _face_count
    ) {
        super();
        this.init(length);
        this._postInit();
    }

    protected _postInit(): void {
        this.current = new this.Vector(0, this.arrays);
    }

    * [Symbol.iterator](): Generator<VectorType> {
        for (let id = 0; id < this.length; id++) {
            this.current.id = id;
            yield this.current;
        }
    }

    setFrom(other: IAttribute<Attr, DIM._2D|DIM._3D|DIM._4D, IVector>): void {
        for (const [this_array, other_array] of zip(this.arrays, other.arrays))
            this_array.set(other_array);
    }
}

// export abstract class TransformableAttribute<
//     Attr extends ATTRIBUTE,
//     Dim extends DIM,
//     MatrixType extends Matrix = Matrix,
//     VectorType extends TransformableVector<MatrixType> = TransformableVector<MatrixType>>
//     extends Attribute<Attr, Dim, VectorType>
//     implements ITransformableAttribute<Attr, Dim>
// {
//     abstract _: ITransformableAttributeFunctionSet<Dim>;
//
//     imatmul(matrix: MatrixType): void {
//         this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
//
//     }
//
//     matmul(matrix: MatrixType, out: ITransformableAttribute<Attr, Dim>): void {
//         this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
//
//     }
// }

// export abstract class Attribute3D<
//     Attr extends ATTRIBUTE,
//     VectorType extends Vector,
//     HVectorType extends Vector & IVector4D,
//     HAttribute extends Attribute<Attr, DIM._4D, HVectorType>>
//     extends Attribute<Attr, DIM._3D, VectorType>
//     implements IAttribute<Attr, DIM._3D, VectorType>
// {
//     homogenize(out: HAttribute): HAttribute {
//         out.setFrom(this);
//         out.arrays[3].fill(1);
//
//         return out;
//     }
// }

export abstract class FaceAttribute<
    Attr extends ATTRIBUTE,
    PulledAttr extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends Vector,
    VertexAttribute extends IVertexAttribute<PulledAttr, Dim>>
    extends Attribute<Attr, Dim, VectorType>
    implements IFaceAttribute<Attr, PulledAttr, Dim, VectorType, VertexAttribute>
{
    pull(input: VertexAttribute): void {
        let face_index,
            vertex_index_1,
            vertex_index_2,
            vertex_index_3: number;

        for (const [face_component, vertex_component] of zip(this.arrays, input.arrays)) {
            for (face_index = 0; face_index < this._face_count; face_index++) {
                if (input.is_shared) {
                    vertex_index_1 = this._face_vertices.arrays[0][face_index];
                    vertex_index_2 = this._face_vertices.arrays[1][face_index];
                    vertex_index_3 = this._face_vertices.arrays[2][face_index];
                } else
                    vertex_index_1 =
                        vertex_index_2 =
                            vertex_index_3 = face_index;

                face_component[face_index] = (
                    vertex_component[vertex_index_1] +
                    vertex_component[vertex_index_2] +
                    vertex_component[vertex_index_3]
                ) / 3;
            }
        }
    }
}

export abstract class VertexAttribute<
    Attr extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends Vector>
    extends Attribute<Attr, Dim, VectorType>
    implements IVertexAttribute<Attr, Dim, VectorType>
{
    protected _is_shared: boolean;
    protected readonly _current_face_vertex_vectors: [
        VectorType,
        VectorType,
        VectorType
        ] = [null, null, null];

    constructor(
        protected _face_vertices: FaceVerticesInt32,
        is_shared: number | boolean = true,
        protected _face_count: number = _face_vertices.length
    ) {
        super(_face_vertices, _face_count, is_shared ? _face_count : _face_count * 3);
        this._is_shared = !!is_shared;
    }

    _postInit(): void {
        super._postInit();

        this._current_face_vertex_vectors[0] = new this.Vector(0, this.arrays);
        this._current_face_vertex_vectors[1] = new this.Vector(0, this.arrays);
        this._current_face_vertex_vectors[2] = new this.Vector(0, this.arrays);
    }

    get is_shared(): boolean {
        return this._is_shared;
    }

    * faces(): Generator<[VectorType, VectorType, VectorType]> {
        if (this._is_shared) {
            for (const [index_1, index_2, index_3] of this._face_vertices.values()) {
                this._current_face_vertex_vectors[0].id = index_1;
                this._current_face_vertex_vectors[1].id = index_2;
                this._current_face_vertex_vectors[2].id = index_3;

                yield this._current_face_vertex_vectors;
            }
        } else {
            for (let face_index = 0; face_index < this._face_count; face_index++) {
                this._current_face_vertex_vectors[0].id = face_index;
                this._current_face_vertex_vectors[1].id = face_index + this._face_count;
                this._current_face_vertex_vectors[2].id = face_index + this._face_count + this._face_count;

                yield this._current_face_vertex_vectors;
            }
        }
    }
}

export abstract class LoadableVertexAttribute<
    Attr extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends Vector,
    InputAttributeType extends InputAttribute>
    extends VertexAttribute<Attr, Dim, VectorType>
    implements ILoadableVertexAttribute<Attr, Dim, VectorType, InputAttributeType>
{
    protected _loadShared(input: InputAttributeType): void {
        let in_index, out_index: number;
        for (const [in_component, out_component] of zip(input.vertices, this.arrays))
            for (const [in_indicies, out_indicies] of zip(input.faces_vertices, this._face_vertices.arrays))
                for ([in_index, out_index] of zip(in_indicies, out_indicies))
                    out_component[out_index] = in_component[in_index];
    }

    protected _loadUnshared(input: InputAttributeType): void {
        let face_index, vertex_index: number;

        for (const [vertex_num, face_vertices] of input.faces_vertices.entries())
            for (const [in_component, out_component] of zip(input.vertices, this.arrays))
                for ([face_index, vertex_index] of face_vertices.entries())
                    out_component[vertex_num * this._face_count + face_index] = in_component[vertex_index];
    }

    load(input: InputAttributeType): void {
        if (this._is_shared)
            this._loadShared(input);
        else
            this._loadUnshared(input);
    }
}

export abstract class PulledVertexAttribute<
    Attr extends ATTRIBUTE,
    PulledAttr extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends Vector,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends IFaceAttribute<Attr, PulledAttr, Dim>>
    extends LoadableVertexAttribute<Attr, Dim, VectorType, InputAttributeType>
    implements IPullableVertexAttribute<Attr, PulledAttr, Dim, VectorType, InputAttributeType, FaceAttributeType>
{
    protected _pullShared(input: FaceAttributeType, vertex_faces: IVertexFaces): void {
        // Average vertex-attribute values from their related face's attribute values:
        let face_id: number;

        for (const [vertex_component, face_component] of zip(this.arrays, input.arrays))
            for (const [vertex_id, face_ids] of vertex_faces.indices.entries()) {
                // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
                let accumulated = 0;
                for (face_id of face_ids)
                    accumulated += face_component[face_id];

                vertex_component[vertex_id] = accumulated / face_ids.length;
            }
    }

    protected _pullUnshared(input: FaceAttributeType): void {
        // Copy over face-attribute values to their respective vertex-attribute values:
        let offset = 0;
        for (const [vertex_component, face_ccomponent] of zip(this.arrays, input.arrays)) {
            for (offset = 0; offset < this.length; offset += this._face_count)
                vertex_component.set(face_ccomponent, offset);
        }
    }

    pull(input: FaceAttributeType, vertex_faces: IVertexFaces): void {
        if (this._is_shared)
            this._pullShared(input, vertex_faces);
        else
            this._pullUnshared(input);
    }
}

export class VertexPositions3D
    extends LoadableVertexAttribute<ATTRIBUTE.position, DIM._3D, Position3D, InputPositions>
    implements IVertexPositions<DIM._3D, Matrix3x3, Position3D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = transformableAttribute3DFunctions;

    readonly dim = DIM._3D;
    readonly Vector = Position3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    protected _loadShared(input_attribute: InputPositions): void {
        this.arrays[0].set(input_attribute.vertices[0]);
        this.arrays[1].set(input_attribute.vertices[1]);
        this.arrays[2].set(input_attribute.vertices[2]);
    }

    homogenize(out: VertexPositions4D): VertexPositions4D {
        out.setFrom(this);
        out.arrays[3].fill(1);

        return out;
    }

    imatmul(matrix: Matrix3x3): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix3x3, out: VertexPositions3D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }
}

export class VertexPositions4D
    extends LoadableVertexAttribute<ATTRIBUTE.position, DIM._4D, Position4D, InputPositions>
    implements IVertexPositions<DIM._4D, Matrix4x4, Position4D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = positionAttribute4DFunctions;

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

    imatmul(matrix: Matrix4x4): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix4x4, out: VertexPositions4D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }

    any_in_view(near: number, far: number): boolean {
        return this._.in_view_any(this.arrays, near, far);
    }

    any_out_ofview(near: number, far: number): boolean {
        return this._.out_of_view_any(this.arrays, near, far);
    }
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

    homogenize(out: FacePositions4D): FacePositions4D {
        out.setFrom(this);
        out.arrays[3].fill(1);

        return out;
    }

    imatmul(matrix: Matrix3x3): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix3x3, out: FacePositions3D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }

}

export class FacePositions4D
    extends FaceAttribute<ATTRIBUTE.position, ATTRIBUTE.position, DIM._4D, Position4D, VertexPositions4D>
{
    readonly attribute = ATTRIBUTE.position;
    readonly _ = positionAttribute4DFunctions;

    readonly dim = DIM._4D;
    readonly Vector = Position4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    pull(input: VertexPositions4D): void {
        super.pull(input);

        this.arrays[3].fill(1);
    }

    imatmul(matrix: Matrix4x4): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix4x4, out: FacePositions4D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }

    any_in_view(near: number, far: number): boolean {
        return this._.in_view_any(this.arrays, near, far);
    }

    any_out_ofview(near: number, far: number): boolean {
        return this._.out_of_view_any(this.arrays, near, far);
    }
}

export class FaceColors3D
    extends FaceAttribute<ATTRIBUTE.color, ATTRIBUTE.color, DIM._3D, Color3D, VertexColors3D>
    implements IFaceColors<DIM._3D, Color3D>
{
    readonly attribute = ATTRIBUTE.color;

    readonly dim = DIM._3D;
    readonly Vector = Color3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    generate(): void {
        const [array_0, array_1, array_2] = this.arrays;

        for (let i = 0; i < this.length; i++) {
            array_0[i] = Math.random();
            array_1[i] = Math.random();
            array_2[i] = Math.random();
        }
    }

    homogenize(out: FaceColors4D): FaceColors4D {
        out.setFrom(this);
        out.arrays[3].fill(1);

        return out;
    }
}

export class FaceColors4D
    extends FaceAttribute<ATTRIBUTE.color, ATTRIBUTE.color, DIM._4D, Color4D, VertexColors4D>
    implements IFaceColors<DIM._4D, Color4D> {
    readonly attribute = ATTRIBUTE.color;

    readonly dim = DIM._4D;
    readonly Vector = Color4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    generate(): void {
        const [array_0, array_1, array_2, array_3] = this.arrays;

        for (let i = 0; i < this.length; i++) {
            array_0[i] = Math.random();
            array_1[i] = Math.random();
            array_2[i] = Math.random();
            array_3[i] = Math.random();
        }
    }
}

const d1_3D = dir3();
const d2_3D = dir3();
const d1_4D = dir4();
const d2_4D = dir4();

export class FaceNormals3D
    extends FaceAttribute<ATTRIBUTE.normal, ATTRIBUTE.position, DIM._3D, Direction3D, VertexPositions3D>
    implements IFaceNormals<DIM._3D, Matrix3x3, Direction3D, VertexPositions3D>
{
    readonly _ = transformableAttribute3DFunctions;

    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._3D;
    readonly Vector = Direction3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    pull(vertex_positions: VertexPositions3D) {
        for (const [face_normal, [p1, p2, p3]] of zip(this, vertex_positions.faces())) {
            p1.to(p2, d1_3D);
            p1.to(p3, d2_3D);
            d1_3D.cross(d2_3D).normalized(face_normal);
        }
    }

    homogenize(out: FaceNormals4D): FaceNormals4D {
        out.setFrom(this);
        out.arrays[3].fill(1);

        return out;
    }

    imatmul(matrix: Matrix3x3): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix3x3, out: FaceNormals3D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }
}

export class FaceNormals4D
    extends FaceAttribute<ATTRIBUTE.normal, ATTRIBUTE.position, DIM._4D, Direction4D, VertexPositions4D>
    implements IFaceNormals<DIM._4D, Matrix4x4, Direction4D, VertexPositions4D>
{
    readonly _ = transformableAttribute4DFunctions;
    readonly attribute = ATTRIBUTE.normal;

    readonly dim = DIM._4D;
    readonly Vector = Direction4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    pull(vertex_positions: VertexPositions4D) {
        for (const [face_normal, [p1, p2, p3]] of zip(this, vertex_positions.faces())) {
            p1.to(p2, d1_4D);
            p1.to(p3, d2_4D);
            d1_4D.cross(d2_4D).normalized(face_normal);
        }
    }

    imatmul(matrix: Matrix4x4): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix4x4, out: FaceNormals4D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }
}

export class VertexNormals3D
    extends PulledVertexAttribute<ATTRIBUTE.normal, ATTRIBUTE.position, DIM._3D, Direction3D, InputNormals, FaceNormals3D>
    implements IVertexNormals<DIM._3D, Matrix3x3, Direction3D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = transformableAttribute3DFunctions;

    readonly dim = DIM._3D;
    readonly Vector = Direction3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    homogenize(out: VertexNormals4D): VertexNormals4D {
        out.setFrom(this);
        out.arrays[3].fill(1);

        return out;
    }

    imatmul(matrix: Matrix3x3): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix3x3, out: VertexNormals3D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }
}

export class VertexNormals4D
    extends PulledVertexAttribute<ATTRIBUTE.normal, ATTRIBUTE.position, DIM._4D, Direction4D, InputNormals, FaceNormals4D>
    implements IVertexNormals<DIM._4D, Matrix4x4, Direction4D>
{
    readonly attribute = ATTRIBUTE.normal;
    readonly _ = transformableAttribute4DFunctions;

    readonly dim = DIM._4D;
    readonly Vector = Direction4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    imatmul(matrix: Matrix4x4): void {
        this._.matrix_multiply_in_place_all(this.arrays, matrix.id, matrix.arrays);
    }

    matmul(matrix: Matrix4x4, out: VertexNormals4D): void {
        this._.matrix_multiply_all(this.arrays, matrix.id, matrix.arrays, out.arrays);
    }
}

export class VertexColors3D
    extends PulledVertexAttribute<ATTRIBUTE.color, ATTRIBUTE.color, DIM._3D, Color3D, InputColors, FaceColors3D>
    implements IVertexColors<DIM._3D, Color3D> {
    readonly attribute = ATTRIBUTE.color;

    readonly dim = DIM._3D;
    readonly Vector = Color3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    homogenize(out: VertexColors4D): VertexColors4D {
        out.setFrom(this);
        out.arrays[3].fill(1);

        return out;
    }

    generate(): void {
        const [array_0, array_1, array_2] = this.arrays;

        for (let i = 0; i < this.length; i++) {
            array_0[i] = Math.random();
            array_1[i] = Math.random();
            array_2[i] = Math.random();
        }
    }
}

export class VertexColors4D
    extends PulledVertexAttribute<ATTRIBUTE.color, ATTRIBUTE.color, DIM._4D, Color4D, InputColors, FaceColors4D>
    implements IVertexColors<DIM._4D, Color4D>
{
    readonly attribute = ATTRIBUTE.color;

    readonly dim = DIM._4D;
    readonly Vector = Color4D;
    readonly allocator = VECTOR_4D_ALLOCATOR;

    generate(): void {
        const [array_0, array_1, array_2, array_3] = this.arrays;

        for (let i = 0; i < this.length; i++) {
            array_0[i] = Math.random();
            array_1[i] = Math.random();
            array_2[i] = Math.random();
            array_3[i] = Math.random();
        }
    }
}

export class VertexUVs2D
    extends LoadableVertexAttribute<ATTRIBUTE.uv, DIM._2D, UV2D, InputUVs>
    implements IVertexUVs<DIM._2D, UV2D>
{
    readonly attribute = ATTRIBUTE.uv;

    readonly dim = DIM._2D;
    readonly Vector = UV2D;
    readonly allocator = VECTOR_2D_ALLOCATOR;

    homogenize(out: VertexUVs3D): VertexUVs3D {
        out.setFrom(this);
        out.arrays[2].fill(1);

        return out;
    }

}

export class VertexUVs3D
    extends LoadableVertexAttribute<ATTRIBUTE.uv, DIM._3D, UV3D, InputUVs>
    implements IVertexUVs<DIM._3D, UV3D>
{
    readonly attribute = ATTRIBUTE.uv;

    readonly dim = DIM._3D;
    readonly Vector = UV3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
}