import {ATTRIBUTE, DIM} from "../../constants.js";
import {Color3D, Color4D} from "../accessors/color.js";
import {IFaceColors, IVertexColors} from "../_interfaces/attributes.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {InputColors} from "./inputs.js";
import {FaceAttribute, PulledVertexAttribute, Triangle} from "./attributes.js";

class ColorTriangle<VectorType extends Color3D|Color4D> extends Triangle<VectorType> {}
class ColorTriangle3D extends ColorTriangle<Color3D> {}
class ColorTriangle4D extends ColorTriangle<Color4D> {}

export class VertexColors3D
    extends PulledVertexAttribute<
        ATTRIBUTE.color,
        ATTRIBUTE.color,
        DIM._3D,
        Color3D,
        ColorTriangle3D,
        InputColors,
        FaceColors3D>
    implements IVertexColors<DIM._3D, Color3D> {
    readonly attribute = ATTRIBUTE.color;

    readonly dim = DIM._3D;
    readonly Vector = Color3D;
    readonly Triangle = ColorTriangle3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;

    homogenize(out?: VertexColors4D): VertexColors4D {
        if (out) out.setFrom(this);
        else out = new VertexColors4D(this._face_vertices, this._is_shared, this._face_count, [
            this.arrays[0],
            this.arrays[1],
            this.arrays[2],
            new Float32Array(this.length)
        ]);

        out.arrays[3].fill(1);

        return out;
    }

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
    extends PulledVertexAttribute<
        ATTRIBUTE.color,
        ATTRIBUTE.color,
        DIM._4D,
        Color4D,
        ColorTriangle4D,
        InputColors,
        FaceColors4D>
    implements IVertexColors<DIM._4D, Color4D> {
    readonly attribute = ATTRIBUTE.color;

    readonly dim = DIM._4D;
    readonly Vector = Color4D;
    readonly Triangle = ColorTriangle4D;
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

export class FaceColors3D
    extends FaceAttribute<ATTRIBUTE.color, ATTRIBUTE.color, DIM._3D, Color3D, VertexColors3D>
    implements IFaceColors<DIM._3D, Color3D> {
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

    homogenize(out?: FaceColors4D): FaceColors4D {
        if (out) out.setFrom(this);
        else out = new FaceColors4D(this._face_vertices, this._face_count, this._face_count, [
            this.arrays[0],
            this.arrays[1],
            this.arrays[2],
            new Float32Array(this.length)
        ]);

        out.arrays[3].fill(1);

        return out;
    }
}

export class FaceColors4D
    extends FaceAttribute<ATTRIBUTE.color, ATTRIBUTE.color, DIM._4D, Color4D, VertexColors4D>
    implements IFaceColors<DIM._4D, Color4D> {
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