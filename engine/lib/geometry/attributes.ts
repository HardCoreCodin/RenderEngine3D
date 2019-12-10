import {Accessor} from "../accessors/accessor.js";
import {Vector} from "../accessors/vector.js";
import {FloatBuffer} from "../memory/buffers.js";
import {ATTRIBUTE, DIM} from "../../constants.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";
import {zip} from "../../utils.js";
import {InputAttribute} from "./inputs.js";
import {
    IAttribute,
    IFaceAttribute,
    ILoadableVertexAttribute,
    IPullableVertexAttribute,
    IVertexAttribute
} from "../_interfaces/attributes.js";
import {IVector} from "../_interfaces/vectors.js";
import {AnyConstructor, Tuple} from "../../types.js";
import {IAccessorConstructor} from "../_interfaces/accessors.js";

export abstract class Attribute<
    Attr extends ATTRIBUTE,
    Dim extends DIM,
    AccessorType extends Accessor>
    extends FloatBuffer<Dim>
    implements IAttribute<Attr, Dim, AccessorType>
{
    readonly abstract attribute: Attr;
    readonly abstract Vector: IAccessorConstructor<AccessorType>;

    arrays: Tuple<Float32Array, Dim>;
    current: AccessorType;

    constructor(
        protected _face_vertices: IFaceVertices,
        protected _face_count: number = _face_vertices.length,
        length = _face_count,
        arrays?: Tuple<Float32Array, Dim>
    ) {
        super(length, arrays);
        this._postInit();
    }

    protected _postInit(): void {
        this.current = new this.Vector(0, this.arrays);
    }

    * [Symbol.iterator](): Generator<AccessorType> {
        for (let id = 0; id < this.length; id++) {
            this.current.id = id;
            yield this.current;
        }
    }

    setFrom(other: IAttribute<Attr, DIM._2D|DIM._3D|DIM._4D, IVector>): this {
        for (const [this_array, other_array] of zip(this.arrays, other.arrays))
            this_array.set(other_array);

        return this;
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

export class Triangle<VectorType extends Vector> {
    vertices: [VectorType, VectorType, VectorType];
}

export abstract class VertexAttribute<
    Attr extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends Attribute<Attr, Dim, VectorType>
    implements IVertexAttribute<Attr, Dim, VectorType>
{
    protected _is_shared: boolean;
    protected readonly _current_face_vertex_vectors: [
        VectorType,
        VectorType,
        VectorType
        ] = [null, null, null];

    readonly abstract Triangle: AnyConstructor<TriangleType>;
    current_triangle: TriangleType;

    constructor(
        protected _face_vertices: IFaceVertices,
        is_shared: number | boolean = true,
        protected _face_count: number = _face_vertices.length,
        arrays?: Tuple<Float32Array, Dim>
    ) {
        super(_face_vertices, _face_count, is_shared ? _face_count : _face_count * 3, arrays);
        this._is_shared = !!is_shared;
    }

    _postInit(): void {
        super._postInit();

        this._current_face_vertex_vectors[0] = new this.Vector(0, this.arrays);
        this._current_face_vertex_vectors[1] = new this.Vector(0, this.arrays);
        this._current_face_vertex_vectors[2] = new this.Vector(0, this.arrays);

        this.current_triangle = new this.Triangle();
        this.current_triangle.vertices = this._current_face_vertex_vectors;
    }

    get is_shared(): boolean {
        return this._is_shared;
    }

    protected *_iterTriangles() : Generator<TriangleType> {
        if (this._is_shared) {
            for (const [index_1, index_2, index_3] of this._face_vertices.values()) {
                this._current_face_vertex_vectors[0].id = index_1;
                this._current_face_vertex_vectors[1].id = index_2;
                this._current_face_vertex_vectors[2].id = index_3;

                yield this.current_triangle;
            }
        } else {
            for (let face_index = 0; face_index < this._face_count; face_index++) {
                this._current_face_vertex_vectors[0].id = face_index;
                this._current_face_vertex_vectors[1].id = face_index + this._face_count;
                this._current_face_vertex_vectors[2].id = face_index + this._face_count + this._face_count;

                yield this.current_triangle;
            }
        }
    }

    get triangles(): Generator<TriangleType> {
        return this._iterTriangles();
    }
}

export abstract class LoadableVertexAttribute<
    Attr extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>,
    InputAttributeType extends InputAttribute>
    extends VertexAttribute<Attr, Dim, VectorType, TriangleType>
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
    TriangleType extends Triangle<VectorType>,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends IFaceAttribute<Attr, PulledAttr, Dim>>
    extends LoadableVertexAttribute<Attr, Dim, VectorType, TriangleType, InputAttributeType>
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

