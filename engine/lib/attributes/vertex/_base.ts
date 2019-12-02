import {zip} from "../../../utils.js";
import {Attribute} from "../_base.js";
import {Vector} from "../../accessors/vector/_base.js";
import {IFaceAttribute} from "../../_interfaces/attributes/face/_base.js";
import {
    ILoadableVertexAttribute,
    IPulledVertexAttribute,
    IVertexAttribute
} from "../../_interfaces/attributes/vertex/_base.js";
import {DIM} from "../../../constants.js";
import {InputAttribute} from "../../mesh/inputs.js";
import {FaceVerticesInt32} from "../../mesh/face/vertices.js";
import {IVertexFaces} from "../../_interfaces/buffers.js";

export abstract class VertexAttribute<Dim extends DIM, VectorType extends Vector>
    extends Attribute<Dim, VectorType>
    implements IVertexAttribute<Dim, VectorType>
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

    *faces(): Generator<[VectorType, VectorType, VectorType]> {
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
    Dim extends DIM,
    VectorType extends Vector,
    InputAttributeType extends InputAttribute>
    extends VertexAttribute<Dim, VectorType>
    implements ILoadableVertexAttribute<Dim, VectorType, InputAttributeType>
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
    Dim extends DIM,
    VectorType extends Vector,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends IFaceAttribute<Dim>>
    extends LoadableVertexAttribute<Dim, VectorType, InputAttributeType>
    implements IPulledVertexAttribute<Dim, VectorType, InputAttributeType, FaceAttributeType>
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