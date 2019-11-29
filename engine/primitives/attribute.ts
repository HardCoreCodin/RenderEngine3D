import {UV2D} from "../math/vec2.js";
import {ATTRIBUTE} from "../constants.js";
import {FaceVertices, VertexFaces} from "./index.js";
import {Color3D, dir3D, Direction3D, pos3D, Position3D, UV3D} from "../math/vec3.js";
import {Color4D, Direction4D, Position4D} from "../math/vec4.js";
import Mesh, {InputAttribute, InputColors, InputNormals, InputPositions, InputUVs} from "./mesh.js";
import {AnyConstructor, FloatArray, IntArray, NormalInputs, TypedArray} from "../types.js";
import {BufferSizes, TypedArraysBuffer} from "../buffer.js";
import {zip} from "../utils.js";


type PositionTypes = Position3D | Position4D;
type DirectionTypes = Direction3D | Direction4D;
type ColorTypes = Color3D | Color4D;
type UVTypes = UV2D | UV3D;
type DataTypes = PositionTypes | DirectionTypes | ColorTypes | UVTypes;

export class Data<ArrayType extends TypedArray = FloatArray>
{
    public length: number;
    public begin: number;
    public end: number;
    readonly dim: number;

    protected _slices: ArrayType[] = [];
    protected _values: number[] = [];

    protected readonly _buffer: TypedArraysBuffer<ArrayType>;
    public readonly arrays: ArrayType[];

    constructor() {
        this.arrays = this._buffer.arrays;
        this._slices.length = this._values.length = this.dim = this.arrays.length;
    }

    init(length: number) {
        if (this.length)
            this.free();

        this.length = length;
        this.begin = this._buffer.allocate(length);
        this.end = this.begin + length;
    }

    free() {
        this._buffer.deallocate(this.begin, this.end);
        this.length = this.begin = this.end = 0;
    }

    get slices(): ArrayType[]
    {
        for (const [i, array] of this.arrays.entries())
            this._slices[i] = array.subarray(this.begin, this.end) as ArrayType;

        return this._slices;
    }

    *values(
        begin: number = this.begin,
        end: number = this.end
    ): Generator<number[]> {
        for (let i = begin; i < end; i++)
            for (const [i, array] of this.arrays.entries())
                this._values[i] = array[i];

            yield this._values;
    }
}

export class DataAttribute<DataType extends DataTypes> extends Data<FloatArray>
{
    public readonly attribute_type: ATTRIBUTE;

    protected Vector: AnyConstructor<DataType>;
    public current: DataType;

    init(length: number): void {
        super.init(length);

        this.current = new this.Vector(this.begin);
    }

    free() {
        super.free();

        this.current = null;
    }

    *[Symbol.iterator](): Generator<DataType> {
        for (let id = this.begin; id < this.end; id++) {
            this.current.id = id;
            yield this.current;
        }
    }
}

export class VertexAttribute<DataType extends DataTypes> extends DataAttribute<DataType>
{
    public readonly currents: [DataType, DataType, DataType];
    public readonly begins: [number, number, number] = [0, 0, 0];
    public readonly ends: [number, number, number]  = [0, 0, 0];
    public is_shared: boolean;

    init(length: number, is_shared: boolean|number = this.is_shared): void {
        if (is_shared) {
            super.init(length);
            this.begins[0] = this.begins[1] = this.begins[2] = this.begin;
            this.ends[0] = this.ends[1] = this.ends[2] = this.end;

            return;
        } else if (this.length) this.free();

        this.length = length;
        this.is_shared = !!is_shared;

        this.begins[0] = this._buffer.allocate(length);
        this.begins[1] = this._buffer.allocate(length);
        this.begins[2] = this._buffer.allocate(length);

        this.ends[0] = this.begins[0] + length;
        this.ends[1] = this.begins[1] + length;
        this.ends[2] = this.begins[2] + length;

        this.currents[0] = new this.Vector(this.begins[0]);
        this.currents[1] = new this.Vector(this.begins[1]);
        this.currents[2] = new this.Vector(this.begins[2]);
    }

    free() {
        if (this.is_shared)
            super.free();
        else
            this._buffer.deallocate(this.begins[0], this.ends[2]);

        this.begins[0] = this.begins[1] = this.begins[2] = this.ends[0] = this.ends[1] = this.ends[2] = 0;
        this.current = this.currents[0] = this.currents[1] = this.currents[2] = null;
    }

    *iterFaceVertexValues(
        face_vertices?: FaceVertices
    ): Generator<[DataType, DataType, DataType]> {
        if (this.is_shared) {
            for (const [index_1, index_2, index_3] of face_vertices.values()) {
                this.currents[0].id = this.begin + index_1;
                this.currents[1].id = this.begin + index_2;
                this.currents[2].id = this.begin + index_3;

                yield this.currents;
            }
        } else {
            for (let face_index = 0; face_index < this.length; face_index++) {
                this.currents[0].id = this.begins[0] + face_index;
                this.currents[1].id = this.begins[1] + face_index;
                this.currents[2].id = this.begins[2] + face_index;

                yield this.currents;
            }
        }
    }
}

export class LoadableVertexAttribute<
    DataType extends DataTypes,
    InputAttributeType extends InputAttribute>
    extends VertexAttribute<DataType>
{
    protected _loadShared(input: InputAttributeType, face_vertices: FaceVertices): void {
        let in_index, out_index: number;
        const ref_indicies = face_vertices.arrays;
        for (const [in_components, out_component] of zip(input.vertices, this.arrays))
            for (const [in_indicies, out_indicies] of zip(input.faces_vertices, ref_indicies))
                for ([in_index, out_index] of zip(in_indicies, out_indicies))
                    out_component[this.begin + out_index] = in_components[in_index];
    }

    protected _loadUnshared(input: InputAttributeType) : void {
        let face_index, vertex_index: number;
        for (const [face_vertices, components, begin] of zip(input.faces_vertices, this.arrays, this.begins))
            for (const [inputs, component] of zip(input.vertices, components))
                for ([face_index, vertex_index] of face_vertices.entries())
                    component[begin + face_index] = inputs[vertex_index];
    }

    load(input: InputAttributeType, face_vertices: FaceVertices) : void {
        if (this.is_shared)
            this._loadShared(input, face_vertices);
        else
            this._loadUnshared(input);
    }
}

export class PulledVertexAttribute<
    DataType extends DataTypes,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends DataAttribute<DataType>>
    extends LoadableVertexAttribute<DataType, InputAttributeType>
{
    pull(input: FaceAttributeType, vertex_faces: VertexFaces): void {
        if (this.is_shared) {
            // Average vertex-attribute values from their related face's attribute values:
            const vertex_id__face_ids = vertex_faces.indices;
            let vertex_id, face_id: number;
            let face_ids: IntArray;

            for (const [v_component, f_component] of zip(this.arrays, input.arrays))
                for ([vertex_id, face_ids] of vertex_id__face_ids.entries()) {
                    // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
                    let accumulator = 0;
                    for (face_id of face_ids)
                        accumulator += f_component[input.begin + face_id];

                    v_component[this.begin + vertex_id] = accumulator / face_ids.length;
                }
        } else {
            // Copy over face-attribute values to their respective vertex-attribute values:
            const face_components = input.slices;
            for (const begin of this.begins)
                for (const [vertexcomponent, face_ccomponent] of zip(this.arrays, face_components))
                    vertexcomponent.set(face_ccomponent, begin);
        }
    }
}

export class PulledFaceAttribute<DataType extends DataTypes, VertexDataType extends DataTypes,
    VertexAttributeType extends VertexAttribute<VertexDataType>>
    extends DataAttribute<DataType>
{
    pull(input: VertexAttributeType, face_vertices: FaceVertices): void {
        if (input.is_shared) {
            let face_index: number;
            for (const [face_component, vertex_component] of zip(this.arrays, input.arrays)) {
                face_index = 0;

                for (const [vertex_index_1, vertex_index_2, vertex_index_3] of face_vertices.values()) {
                    face_component[input.begin + face_index] = (
                        vertex_component[input.begin + vertex_index_1] +
                        vertex_component[input.begin + vertex_index_2] +
                        vertex_component[input.begin + vertex_index_3]
                    ) / 3;

                    face_index++;
                }
            }
        } else {
            let face_index: number;
            for (const [vertex_component, face_component] of zip(input.arrays, this.arrays))
                for (face_index = this.begin; face_index < this.end; face_index++)
                    face_component[face_index] = (
                        vertex_component[input.begins[0] + face_index - this.begin] +
                        vertex_component[input.begins[1] + face_index - this.begin] +
                        vertex_component[input.begins[2] + face_index - this.begin]
                    ) / 3;
        }
    }
}

export class VertexPositions<PositionType extends PositionTypes>
    extends LoadableVertexAttribute<PositionType, InputPositions>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.position;

    protected _loadShared(input_attribute: InputPositions) : void {
        for (const [outputs, inputs] of zip(this.arrays, input_attribute.vertices))
            outputs.set(inputs);
    }
}

export class VertexNormals<DirectionType extends DirectionTypes, PositionType extends PositionTypes>
    extends PulledVertexAttribute<DirectionType, InputNormals, FaceNormals<DirectionType, PositionType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.normal;
}

export class VertexColors<ColorType extends ColorTypes>
    extends PulledVertexAttribute<ColorType, InputColors, FaceColors<ColorType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.color;

    generate(): void {
        for (const array of this.arrays)
            randomize(array, this.begins[0], this.ends[2]);
    }
}

export class VertexUVs<UVType extends UVTypes> extends LoadableVertexAttribute<UVType, InputUVs>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.uv;
}

export class FacePositions<
    PositionType extends PositionTypes>
    extends PulledFaceAttribute<
        PositionType,
        PositionType,
        VertexPositions<PositionType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.position;
}

export class FaceNormals<DirectionType extends DirectionTypes, PositionType extends PositionTypes,
    VertexPositionArribute extends VertexPositions<PositionType> = VertexPositions<PositionType>>
    extends PulledFaceAttribute<DirectionType, PositionType, VertexPositionArribute>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.normal;

    pull(vertex_positions: VertexPositionArribute, face_vertices: FaceVertices) {
        for (const [face_normal, [p1, p2, p3]] of zip(this, vertex_positions.iterFaceVertexValues(face_vertices))) {
            if (p1 instanceof Position3D &&
                p2 instanceof Position3D &&
                p3 instanceof Position3D) {

                p1.to(p2, dir1);
                p1.to(p3, dir2);
            } else {
                pos1.setTo(p1.x, p1.y, p1.z);
                pos2.setTo(p2.x, p2.y, p2.z);
                pos3.setTo(p3.x, p3.y, p3.z);

                pos1.to(pos2, dir1);
                pos1.to(pos3, dir2);
            }

            if (face_normal instanceof Direction3D) {
                dir1.cross(dir2).normalized(face_normal);
            } else {
                dir1.cross(dir2).normalize();
                face_normal.setTo(dir1.x, dir1.y, dir1.z, 0);
            }
        }
    }
}

export class FaceColors<ColorType extends ColorTypes>
    extends PulledFaceAttribute<ColorType, ColorType, VertexColors<ColorType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        for (const array of this.arrays)
            randomize(array, this.begin, this.end);
    }
}

abstract class AttributeCollection {
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

export class Faces<
    PositionType extends PositionTypes,
    NormalType extends DirectionTypes,
    ColorType extends ColorTypes,

    PositionAttributeType extends FacePositions<PositionType>,
    NormalAttributeType extends FaceNormals<NormalType, PositionType>,
    ColorAttributeType extends FaceColors<ColorType>,
    > extends AttributeCollection
{
    constructor(
        public readonly mesh: Mesh,

        public readonly positions: PositionAttributeType,
        public readonly normals: NormalAttributeType,
        public readonly colors: ColorAttributeType,

        public readonly vertices: FaceVertices
    ) {
        super(mesh);
    }

    get sizes() : BufferSizes {
        const sizes = new BufferSizes({
            face_vertices: this.mesh.vertex_count
        });

        const count = this.mesh.face_count;
        const attrs: ATTRIBUTE = this.mesh.options.face_attributes;

        if (attrs & ATTRIBUTE.position) sizes.incrementVec(this.positions.dim, count);
        if (attrs & ATTRIBUTE.normal) sizes.incrementVec(this.normals.dim, count);
        if (attrs & ATTRIBUTE.color) sizes.incrementVec(this.colors.dim, count);

        return sizes;
    }

    init() : void {
        const count = this.mesh.face_count;
        const included = this.mesh.options.face_attributes;

        this.vertices.init(count);

        if (included & ATTRIBUTE.position) this.positions.init(count);
        if (included & ATTRIBUTE.normal) this.normals.init(count);
        if (included & ATTRIBUTE.color) this.colors.init(count);
    }

    protected _validateParameters = () : void => {
        if (!(
            this._validate(this.mesh.face_count, 'Count') &&
            this._validate(this.mesh.options.face_attributes, 'included', 0b0001, 0b1111)
        ))
            throw `Invalid parameters! count: ${this.mesh.face_count} included: ${this.mesh.options.face_attributes}`;
    };
}

export class Vertices<
    PositionType extends PositionTypes,
    NormalType extends DirectionTypes,
    ColorType extends ColorTypes,
    UVsType extends UVTypes,

    PositionAttributeType extends VertexPositions<PositionType>,
    NormalAttributeType extends VertexNormals<NormalType, PositionType>,
    ColorAttributeType extends VertexColors<ColorType>,
    UVsAttributeType extends VertexUVs<UVsType>
    > extends AttributeCollection
{
    constructor(
        public readonly mesh: Mesh,

        public readonly positions: PositionAttributeType,
        public readonly normals: NormalAttributeType,
        public readonly colors: ColorAttributeType,
        public readonly uvs: UVsAttributeType,
        public readonly faces: VertexFaces
    ) {
        super(mesh);
    }

    public shared: number;

    get sizes() : BufferSizes {
        const sizes = new BufferSizes({
            vertex_faces: this.mesh.inputs.vertex_faces.size
        });

        const attrs: ATTRIBUTE = this.mesh.options.vertex_attributes;
        const count = this.mesh.vertex_count;

        sizes.incrementVec(this.positions.dim, count);

        if (attrs & ATTRIBUTE.normal) sizes.incrementVec(this.normals.dim, count);
        if (attrs & ATTRIBUTE.color) sizes.incrementVec(this.colors.dim, count);
        if (attrs & ATTRIBUTE.uv) sizes.incrementVec(this.uvs.dim, count);

        return sizes;
    }

    init() : void {
        const count = this.mesh.vertex_count;
        const included = this.mesh.options.vertex_attributes;
        const shared = this.mesh.options.share;

        this.faces.init(this.mesh.inputs.vertex_faces.size);
        this.positions.init(count, shared & ATTRIBUTE.position);

        if (included & ATTRIBUTE.normal) this.normals.init(count, shared & ATTRIBUTE.normal);
        if (included & ATTRIBUTE.color) this.colors.init(count, shared & ATTRIBUTE.color);
        if (included & ATTRIBUTE.uv) this.uvs.init(count, shared & ATTRIBUTE.uv);
    }

    protected _validateParameters = () : void => {
        if (!(
            this._validate(this.mesh.vertex_count, 'Count') &&
            this._validate(this.mesh.options.vertex_attributes, 'included', 0b0001, 0b1111) &&
            this._validate(this.mesh.options.share, 'shared', 0b0000, 0b1111)
        ))
            throw `Invalid parameters! count: ${this.mesh.vertex_count} included: ${this.mesh.options.vertex_attributes}`;
    };
}

const randomize = (array: FloatArray, begin: number, end: number): void => {
    for (let i = begin; i < end; i++)
        array[i] = Math.random();
};

const dir1 = dir3D();
const dir2 = dir3D();

const pos1 = pos3D();
const pos2 = pos3D();
const pos3 = pos3D();

