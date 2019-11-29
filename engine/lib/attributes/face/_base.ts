import {zip} from "../../../utils.js";
import {Attribute} from "../_base.js";
import {Vector} from "../../accessors/vector/_base.js";
import {IFaceAttribute} from "../../_interfaces/attributes/face/_base.js";
import {IVertexAttribute} from "../../_interfaces/attributes/vertex/_base.js";
import {DIM} from "../../../constants.js";

export abstract class FaceAttribute<
    Dim extends DIM,
    VectorType extends Vector,
    VertexAttribute extends IVertexAttribute<Dim>>
    extends Attribute<Dim, VectorType>
    implements IFaceAttribute<Dim, VectorType, VertexAttribute>
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