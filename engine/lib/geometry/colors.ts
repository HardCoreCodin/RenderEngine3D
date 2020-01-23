import {ATTRIBUTE} from "../../constants.js";
import {Color3D, Color4D} from "../accessors/color.js";
import {
    Float32Allocator3D,
    Float32Allocator4D,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../memory/allocators.js";
import {InputColors} from "./inputs.js";
import {FaceAttribute, PulledVertexAttribute, Triangle} from "./attributes.js";
import {IAccessorConstructor} from "../_interfaces/accessors.js";
import {AnyConstructor} from "../../types.js";

class ColorTriangle3D extends Triangle<Color3D> {}
class ColorTriangle4D extends Triangle<Color4D> {}

export class VertexColors3D
    extends PulledVertexAttribute<Color3D, ColorTriangle3D, InputColors, FaceColors3D>
{
    readonly attribute = ATTRIBUTE.color;
    protected _getTriangleConstructor(): AnyConstructor<ColorTriangle3D> {return ColorTriangle3D}
    protected _getVectorConstructor(): IAccessorConstructor<Color3D> {return Color3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}

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
    extends PulledVertexAttribute<Color4D, ColorTriangle4D, InputColors, FaceColors4D>
{
    readonly attribute = ATTRIBUTE.color;
    protected _getTriangleConstructor(): AnyConstructor<ColorTriangle4D> {return ColorTriangle4D}
    protected _getVectorConstructor(): IAccessorConstructor<Color4D> {return Color4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

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

export class FaceColors3D
    extends FaceAttribute<Color3D, Color3D, VertexColors3D>
{
    readonly attribute = ATTRIBUTE.color;
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}
    protected _getVectorConstructor(): IAccessorConstructor<Color3D> {return Color3D}

    generate(): void {
        const [array_0, array_1, array_2] = this.arrays;

        for (let i = 0; i < this.length; i++) {
            array_0[i] = Math.random();
            array_1[i] = Math.random();
            array_2[i] = Math.random();
        }
    }
}

export class FaceColors4D
    extends FaceAttribute<Color4D, Color4D, VertexColors4D>
{
    readonly attribute = ATTRIBUTE.color;
    protected _getVectorConstructor(): IAccessorConstructor<Color4D> {return Color4D}
    protected _getAllocator(): Float32Allocator4D {return VECTOR_4D_ALLOCATOR}

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