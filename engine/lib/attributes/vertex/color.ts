import {PulledVertexAttribute} from "./_base.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {Color3D, Color4D} from "../../accessors/vector/color.js";
import {IVertexColors} from "../../_interfaces/attributes/vertex/color.js";
import {FaceColors3D, FaceColors4D} from "../face/color.js";
import {InputColors} from "../../mesh/inputs.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../../allocators.js";

export class VertexColors3D extends PulledVertexAttribute<DIM._3D, Color3D, InputColors, FaceColors3D>
    implements IVertexColors<DIM._3D, Color3D>
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
}

export class VertexColors4D extends PulledVertexAttribute<DIM._4D, Color4D, InputColors, FaceColors4D>
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