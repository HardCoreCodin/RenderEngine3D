import {ATTRIBUTE, DIM} from "../../constants.js";
import {Vector} from "../accessors/vector/_base.js";
import {IAttribute} from "../_interfaces/attributes/_base.js";
import {VectorConstructor} from "../_interfaces/accessors/vector/_base.js";
import {FloatBuffer} from "../buffers/float.js";
import Mesh from "../mesh/_base.js";
import {FaceVertices} from "../mesh/face/vertices.js";

export abstract class Attribute<Dim extends DIM, VectorType extends Vector>
    extends FloatBuffer<Dim>
    implements IAttribute<Dim, VectorType>
{
    readonly abstract attribute: ATTRIBUTE;
    readonly abstract Vector: VectorConstructor<VectorType>;

    current: VectorType;

    constructor(
        protected _face_vertices: FaceVertices,
        protected _face_count: number = _face_vertices.length,
        length: number = _face_count
    ) {
        super();
        this.init(length);
        this._postInit();
    }

    protected _postInit(): void {
        this.current = new this.Vector(0, this.arrays);
    }

    *[Symbol.iterator](): Generator<VectorType> {
        for (let id = 0; id < this.length; id++) {
            this.current.id = id;
            yield this.current;
        }
    }
}

export abstract class AttributeCollection {
    constructor(
        public readonly mesh: Mesh
    ) {
        this._validateParameters();
    }

    protected _validate(
        value: number,
        name: string,
        min: number = 0,
        max: number = Number.MAX_SAFE_INTEGER
    ) : boolean {
        if (Number.isInteger(value)) {
            if (Number.isFinite(value)) {
                if (value > min) {
                    if (value < max) {
                        return true;
                    } console.debug(`${name} has to be a smaller than ${max} - got ${value}`)
                } console.debug(`${name} has to be a greater than ${min} - got ${value}`)
            } else console.debug(`${name} has to be a finite number - got ${value}`);
        } else console.debug(`${name} has to be an integer - got ${value}`);

        return false;
    }

    protected abstract _validateParameters(): void;
}
