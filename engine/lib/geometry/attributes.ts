import {zip} from "../../utils.js";
import {Vector} from "../accessors/accessor.js";
import {FloatBuffer} from "../memory/buffers.js";
import {ATTRIBUTE} from "../../constants.js";
import {InputAttribute} from "./inputs.js";
import {IAttribute} from "../_interfaces/attributes.js";
import {IFaceVertices, IVertexFaces} from "../_interfaces/buffers.js";
import {AnyConstructor, T3} from "../../types.js";
import {VectorConstructor} from "../_interfaces/vectors.js";

export abstract class Attribute<VectorType extends Vector>
    extends FloatBuffer
    implements IAttribute<VectorType>
{
    readonly abstract attribute: ATTRIBUTE;
    readonly Vector: VectorConstructor<VectorType>;
    protected abstract _getVectorConstructor(): VectorConstructor<VectorType>;

    current: VectorType;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length,
        length?: number,
        arrays?: Float32Array[]
    ) {
        super(length, arrays);
        this.Vector = this._getVectorConstructor();
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

    setFrom(other: Attribute<Vector>): this {
        for (const [this_array, other_array] of zip(this.arrays, other.arrays))
            this_array.set(other_array);

        return this;
    }
}

export abstract class FaceAttribute<
    VectorType extends Vector = Vector,
    VertexVectorType extends Vector = Vector,
    VertexAttributeType extends VertexAttribute<VertexVectorType, Triangle<VertexVectorType>> = VertexAttribute<VertexVectorType, Triangle<VertexVectorType>>>
    extends Attribute<VectorType>
{
    constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length,
        arrays?: Float32Array[]
    ) {
        super(face_vertices, face_count, face_count, arrays);
    }

    pull(input: VertexAttributeType): void {
        let face_index,
            vertex_index_1,
            vertex_index_2,
            vertex_index_3: number;

        for (const [face_component, vertex_component] of zip(this.arrays, input.arrays)) {
            for (face_index = 0; face_index < this.face_count; face_index++) {
                if (input.is_shared) {
                    vertex_index_1 = this.face_vertices.arrays[0][face_index];
                    vertex_index_2 = this.face_vertices.arrays[1][face_index];
                    vertex_index_3 = this.face_vertices.arrays[2][face_index];
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
{
    protected _is_shared: boolean;
    protected _current_face_vertex_vectors: T3<VectorType>;

    Triangle: AnyConstructor<TriangleType>;
    protected abstract _getTriangleConstructor(): AnyConstructor<TriangleType>;

    current_triangle: TriangleType;

    constructor(
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        is_shared: number | boolean = true,
        readonly face_count: number = face_vertices.length,
        arrays?: Float32Array[]
    ) {
        super(face_vertices, face_count, is_shared ? vertex_count : face_count * 3, arrays);
        this._is_shared = !!is_shared;
    }

    _postInit(): void {
        super._postInit();

        this._current_face_vertex_vectors = [
            new this.Vector(0, this.arrays),
            new this.Vector(0, this.arrays),
            new this.Vector(0, this.arrays)
        ];

        this.Triangle = this._getTriangleConstructor();
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
            let offset = 0;
            for (let face_index = 0; face_index < this.face_count; face_index++) {
                this._current_face_vertex_vectors[0].id = offset;
                this._current_face_vertex_vectors[1].id = offset + 1;
                this._current_face_vertex_vectors[2].id = offset + 2;
                offset += 3;

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
{
    protected _loadShared(input: InputAttributeType): void {
        let in_index, out_index: number;
        for (const [in_component, out_component] of zip(input.vertices, this.arrays))
            for (const [in_indicies, out_indicies] of zip(input.faces_vertices, this.face_vertices.arrays))
                for ([in_index, out_index] of zip(in_indicies, out_indicies))
                    out_component[out_index] = in_component[in_index];
    }

    protected _loadUnshared(input: InputAttributeType): void {
        let offset, face_index: number;
        const v1_indices = input.faces_vertices[0];
        const v2_indices = input.faces_vertices[1];
        const v3_indices = input.faces_vertices[2];
        const face_count = v1_indices.length;
        for (const [in_component, out_component] of zip(input.vertices, this.arrays)) {
            offset = 0;
            for (face_index = 0; face_index < face_count; face_index++) {
                out_component[offset  ] = in_component[v1_indices[face_index]];
                out_component[offset+1] = in_component[v2_indices[face_index]];
                out_component[offset+2] = in_component[v3_indices[face_index]];
                offset += 3;
            }
        }
    }

    load(input: InputAttributeType): this {
        if (this._is_shared)
            this._loadShared(input);
        else
            this._loadUnshared(input);

        return this;
    }
}

export abstract class PulledVertexAttribute<
    VectorType extends Vector,
    TriangleType extends Triangle<VectorType>,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends FaceAttribute>
    extends LoadableVertexAttribute<VectorType, TriangleType, InputAttributeType>
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

