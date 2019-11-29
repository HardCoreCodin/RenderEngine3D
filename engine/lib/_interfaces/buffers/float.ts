import {IFloatAllocator} from "../allocators.js";
import {IBuffer} from "./_base.js";
import {DIM} from "../../../constants.js";

export interface IFloatBuffer<Dim extends DIM> extends IBuffer<Float32Array, Dim> {
    allocator: IFloatAllocator<Dim>;
}