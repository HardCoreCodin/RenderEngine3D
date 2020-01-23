import {Vector} from "../accessors/accessor.js";
import {FloatBuffer} from "../memory/buffers.js";
import {ATTRIBUTE} from "../../constants.js";
import {VectorConstructor} from "../_interfaces/vectors.js";
import {IFaceVertices} from "../_interfaces/buffers.js";
import {zip} from "../../utils.js";

export abstract class VectorBuffer<VectorType extends Vector> extends FloatBuffer {
    protected abstract _getVectorConstructor(): VectorConstructor<VectorType>;

    current: VectorType;
    protected Vector: VectorConstructor<VectorType>;

    constructor(
        length?: number,
        arrays?: Float32Array[]
    ) {
        super(length, arrays);
    }

    init(length: number, arrays?: Float32Array[]): this {
        super.init(length, arrays);
        this._post_init();
        return this;
    }

    protected _post_init(): void {
        this.Vector = this._getVectorConstructor();
        this.current = new this.Vector(0, this.arrays);
    }

    * [Symbol.iterator](): Generator<VectorType> {
        for (let id = 0; id < this.length; id++) {
            this.current.id = id;
            yield this.current;
        }
    }

    setFrom<OtherVectorType extends Vector>(other: VectorBuffer<OtherVectorType>): this {
        for (const [this_array, other_array] of zip(this.arrays, other.arrays))
            this_array.set(other_array);

        return this;
    }
}

export abstract class AttributeBuffer<VectorType extends Vector>
    extends VectorBuffer<VectorType>
{
    readonly abstract attribute: ATTRIBUTE;

    protected constructor(
        readonly face_vertices: IFaceVertices,
        readonly face_count: number = face_vertices.length,
        length?: number,
        arrays?: Float32Array[]
    ) {
        super(length, arrays);
    }
}