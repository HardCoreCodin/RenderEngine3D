import {ATTRIBUTE, DIM} from "../../../constants.js";
import {IVector, VectorConstructor} from "../accessors/vector/_base.js";
import {IFloatBuffer} from "../buffers/float.js";

export interface IAttribute<Dim extends DIM, VectorType extends IVector>
    extends IFloatBuffer<Dim>
{
    current: VectorType;
    attribute: ATTRIBUTE;
    Vector: VectorConstructor<VectorType>;

    init(length: number, is_shared?: number|boolean): void;

    [Symbol.iterator](): Generator<VectorType>;
}

