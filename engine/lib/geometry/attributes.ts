import {Vector} from "../accessors/vector.js";
import {FloatBuffer} from "../memory/buffers.js";
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
import {AnyConstructor} from "../../types.js";
import {IAccessor, IAccessorConstructor} from "../_interfaces/accessors.js";
import {Arrays} from "../_interfaces/functions.js";
import {ATTRIBUTE} from "../../constants.js";

export abstract class Attribute<AccessorType extends IAccessor = IAccessor>
    extends FloatBuffer
    implements IAttribute<AccessorType>
{
    readonly abstract attribute: ATTRIBUTE;
    readonly abstract Vector: IAccessorConstructor<AccessorType>;

    arrays: Arrays;
    current: AccessorType;

    constructor(
        protected _face_vertices: IFaceVertices,
        protected _face_count: number = _face_vertices.length,
        length = _face_count,
        arrays?: Arrays
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

    setFrom(other: IAttribute<IVector>): this {
        for (const [this_array, other_array] of zip(this.arrays, other.arrays))
            this_array.set(other_array);

        return this;
    }
}

export abstract class FaceAttribute<
    VectorType extends Vector,
    VertexAttribute extends IVertexAttribute>
    extends Attribute<VectorType>
    implements IFaceAttribute<VectorType, VertexAttribute>
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
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
    extends Attribute<VectorType>
    implements IVertexAttribute<VectorType>
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
        public readonly face_vertices: IFaceVertices,
        is_shared: number | boolean = true,
        public readonly face_count: number = face_vertices.length,
        arrays?: Arrays
    ) {
        super(face_vertices, face_count, is_shared ? face_count : face_count * 3, arrays);
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
            for (const [index_1, index_2, index_3] of this.face_vertices.values()) {
                this._current_face_vertex_vectors[0].id = index_1;
                this._current_face_vertex_vectors[1].id = index_2;
                this._current_face_vertex_vectors[2].id = index_3;

                yield this.current_triangle;
            }
        } else {
            for (let face_index = 0; face_index < this.face_count; face_index++) {
                this._current_face_vertex_vectors[0].id = face_index;
                this._current_face_vertex_vectors[1].id = face_index + this.face_count;
                this._current_face_vertex_vectors[2].id = face_index + this.face_count + this.face_count;

                yield this.current_triangle;
            }
        }
    }

    get triangles(): Generator<TriangleType> {
        return this._iterTriangles();
    }
}

export abstract class LoadableVertexAttribute<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>,
    InputAttributeType extends InputAttribute>
    extends VertexAttribute<VectorType, TriangleType>
    implements ILoadableVertexAttribute<VectorType, InputAttributeType>
{
    protected _loadShared(input: InputAttributeType): void {
        let in_index, out_index: number;
        for (const [in_component, out_component] of zip(input.vertices, this.arrays))
            for (const [in_indicies, out_indicies] of zip(input.faces_vertices, this.face_vertices.arrays))
                for ([in_index, out_index] of zip(in_indicies, out_indicies))
                    out_component[out_index] = in_component[in_index];
    }

    protected _loadUnshared(input: InputAttributeType): void {
        let face_index, vertex_index: number;

        for (const [vertex_num, face_vertices] of input.faces_vertices.entries())
            for (const [in_component, out_component] of zip(input.vertices, this.arrays))
                for ([face_index, vertex_index] of face_vertices.entries())
                    out_component[vertex_num * this.face_count + face_index] = in_component[vertex_index];
    }

    load(input: InputAttributeType): void {
        if (this._is_shared)
            this._loadShared(input);
        else
            this._loadUnshared(input);
    }
}

export abstract class PulledVertexAttribute<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends IFaceAttribute>
    extends LoadableVertexAttribute<VectorType, TriangleType, InputAttributeType>
    implements IPullableVertexAttribute<VectorType, InputAttributeType, FaceAttributeType>
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
            for (offset = 0; offset < this.length; offset += this.face_count)
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

