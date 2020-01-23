import {Vector} from "../accessors/accessor.js";
import {FloatBuffer} from "../memory/buffers.js";
import {ATTRIBUTE} from "../../constants.js";
import {VectorConstructor} from "../_interfaces/vectors.js";
import {IFaceVertices} from "../_interfaces/buffers.js";

export abstract class AttributeBuffer<VectorType extends Vector> extends FloatBuffer {
    readonly abstract attribute: ATTRIBUTE;

    protected abstract _getVectorConstructor(): VectorConstructor<VectorType>;

    readonly Vector: VectorConstructor<VectorType>;
    readonly current: VectorType;

    protected constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length,
        length?: number,
        arrays?: Float32Array[]
    ) {
        super(length, arrays);
        this.Vector = this._getVectorConstructor();
        this.current = new this.Vector(0, this.arrays);
    }

    * [Symbol.iterator](): Generator<VectorType> {
        for (let id = 0; id < this.length; id++) {
            this.current.id = id;
            yield this.current;
        }
    }

    setFrom(other: AttributeBuffer<VectorType>): this {
        for (const [i, array] of this.arrays.entries())
            array.set(other.arrays[i]);

        return this;
    }
}