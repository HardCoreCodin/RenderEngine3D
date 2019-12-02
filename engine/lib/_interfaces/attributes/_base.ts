import {ATTRIBUTE, DIM} from "../../../constants.js";
import {IVector, VectorConstructor} from "../accessors/vector/_base.js";
import {IBuffer} from "../buffers.js";

export interface IAttribute<Dim extends DIM, VectorType extends IVector>
    extends IBuffer<Dim>
{
    current: VectorType;
    attribute: ATTRIBUTE;
    Vector: VectorConstructor<VectorType>;

    [Symbol.iterator](): Generator<VectorType>;
}

