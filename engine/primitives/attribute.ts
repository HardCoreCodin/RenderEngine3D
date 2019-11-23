import Mesh, {InputAttribute, InputColors, InputNormals, InputPositions, InputUVs} from "./mesh.js";
import {dir3D, Direction3D, pos3D, Position3D, Color3D, UV3D} from "../math/vec3.js";
import {Direction4D, Position4D, Color4D} from "../math/vec4.js";
import {ATTRIBUTE} from "../constants.js";
import {
    AnyConstructor,
    FloatArray,
    IntArray,
    Tuple,
    TypedArray,
} from "../types.js";
import {Direction, Position} from "../math/vec.js";
import {FaceVertices, VertexFaces} from "./index.js";
import {UV2D} from "../math/vec2.js";

type PositionTypes = Position3D | Position4D;
type DirectionTypes = Direction3D | Direction4D;
type ColorTypes = Color3D | Color4D;
type UVTypes = UV2D | UV3D;
type DataTypes = PositionTypes | DirectionTypes | ColorTypes | UVTypes;

export abstract class Data<
    Dim extends number,
    ArrayType extends TypedArray = FloatArray>
{
    public length: number;
    public begin: number;
    public end: number;

    protected _slices: Tuple<ArrayType, Dim>;
    protected _values: Tuple<number, Dim>;

    public arrays: Tuple<ArrayType, Dim>;

    constructor() {
        this._slices = Array<ArrayType>(this.arrays.length) as Tuple<ArrayType, Dim>;
        this._values = Array<number>(this.arrays.length) as Tuple<number, Dim>;
    }

    init(length: number) {
        this.length = length;
        this.begin = this._allocate(length);
        this.end = this.begin + length;
    }

    get slices(): Tuple<ArrayType, Dim>
    {
        for (const [i, array] of this.arrays.entries())
            this._slices[i] = array.subarray(this.begin, this.end) as ArrayType;

        return this._slices;
    }

    *values(
        begin: number = this.begin,
        end: number = this.end
    ): Generator<Tuple<number, Dim>> {
        for (let i = begin; i < end; i++)
            for (const [i, array] of this.arrays.entries())
                this._values[i] = array[i];

            yield this._values;
    }

    protected abstract _allocate(length: number): number;
}

export abstract class DataAttribute<
    Dim extends 2|3|4,
    DataType extends DataTypes>
    extends Data<Dim, FloatArray>
{
    public readonly attribute_type: ATTRIBUTE;

    protected Vector: AnyConstructor<DataType>;
    public current: DataType;

    init(length: number): void {
        super.init(length);

        this.current = new this.Vector(this.begin);
    }

    *[Symbol.iterator](): Generator<DataType> {
        for (let id = this.begin; id < this.end; id++) {
            this.current.id = id;
            yield this.current;
        }
    }
}

export abstract class VertexAttribute<
    Dim extends 2|3|4,
    DataType extends DataTypes>
    extends DataAttribute<Dim, DataType>
{
    public readonly currents: [DataType, DataType, DataType];
    public readonly begins: [number, number, number] = [0, 0, 0];
    public readonly ends: [number, number, number]  = [0, 0, 0];
    public is_shared: boolean;

    init(length: number, is_shared: boolean|number = this.is_shared): void {
        this.length = length;
        this.is_shared = !!is_shared;

        if (is_shared) {
            super.init(length);
            this.begins[0] = this.begins[1] = this.begins[2] = this.begin;
            this.ends[0] = this.ends[1] = this.ends[2] = this.end;

            return;
        }

        this.begins[0] = this._allocate(length);
        this.begins[1] = this._allocate(length);
        this.begins[2] = this._allocate(length);

        this.ends[0] = this.begins[0] + length;
        this.ends[1] = this.begins[1] + length;
        this.ends[2] = this.begins[2] + length;

        this.currents[0] = new this.Vector(this.begins[0]);
        this.currents[1] = new this.Vector(this.begins[1]);
        this.currents[2] = new this.Vector(this.begins[2]);
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

export abstract class LoadableVertexAttribute<
    Dim extends 2|3|4,
    DataType extends DataTypes,
    InputAttributeType extends InputAttribute
    >
    extends VertexAttribute<Dim, DataType>
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

export abstract class PulledVertexAttribute<
    Dim extends 3|4,
    DataType extends DataTypes,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends DataAttribute<Dim, DataType>>
    extends LoadableVertexAttribute<
        Dim,
        DataType,
        InputAttributeType>
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

                    v_component[this.begin + vertex_id] += accumulator / face_ids.length;
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

export abstract class PulledFaceAttribute<
    Dim extends 3|4,
    DataType extends DataTypes,
    VertexDataType extends DataTypes,
    VertexAttributeType extends VertexAttribute<Dim, VertexDataType>>
    extends DataAttribute<Dim, DataType>
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

export abstract class VertexPositions<
    Dim extends 3|4,
    PositionType extends PositionTypes = Dim extends 3 ? Position3D : Position4D>
    extends LoadableVertexAttribute<
        Dim,
        PositionType,
        InputPositions>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.position;

    protected _loadShared(input_attribute: InputPositions) : void {
        for (const [outputs, inputs] of zip(this.arrays, input_attribute.vertices))
            outputs.set(inputs);
    }
}

export abstract class VertexNormals<
    Dim extends 3|4,
    DirectionType extends DirectionTypes = Dim extends 3 ? Direction3D : Direction4D,
    PositionType extends PositionTypes = Dim extends 3 ? Position3D : Position4D>
    extends PulledVertexAttribute<
        Dim,
        DirectionType,
        InputNormals,
        FaceNormals<
            Dim,
            DirectionType,
            PositionType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.normal;
}

export abstract class VertexColors<
    Dim extends 3|4,
    ColorType extends ColorTypes = Dim extends 3 ? Color3D : Color4D>
    extends PulledVertexAttribute<
        Dim,
        ColorType,
        InputColors,
        FaceColors<Dim, ColorType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.color;

    generate(): void {
        for (const array of this.arrays)
            randomize(array, this.begins[0], this.ends[2]);
    }
}

export abstract class VertexUVs<
    Dim extends 2|3,
    UVType extends UVTypes = Dim extends 3 ? UV3D : UV2D>
    extends LoadableVertexAttribute<
        Dim,
        UVType,
        InputUVs>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.uv;
}

export abstract class FacePositions<
    Dim extends 3|4,
    PositionType extends PositionTypes = Dim extends 3 ? Position3D : Position4D>
    extends PulledFaceAttribute<
        Dim,
        PositionType,
        PositionType,
        VertexPositions<Dim, PositionType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.position;
}

export abstract class FaceNormals<
    Dim extends 3|4,
    DirectionType extends DirectionTypes = Dim extends 3 ? Direction3D : Direction4D,
    PositionType extends PositionTypes = Dim extends 3 ? Position3D : Position4D,
    VertexPositionArribute extends VertexPositions<Dim, PositionType> = VertexPositions<Dim, PositionType>>
    extends PulledFaceAttribute<
        Dim,
        DirectionType,
        PositionType,
        VertexPositionArribute>
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

export abstract class FaceColors<
    Dim extends 3|4,
    ColorType extends ColorTypes = Dim extends 3 ? Color3D : Color4D>
    extends PulledFaceAttribute<
        Dim,
        ColorType,
        ColorType,
        VertexColors<
            Dim,
            ColorType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        for (const array of this.arrays)
            randomize(array, this.begin, this.end);
    }
}

class AttributeCollection {
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

    protected _validateParameters: () => void;
}

export class Faces<
    PositionType extends Position,
    NormalType extends Direction,
    ColorType extends Color,

    PositionAttributeType extends FacePositions<PositionType>,
    NormalAttributeType extends FaceNormals<NormalType, PositionType>,
    ColorAttributeType extends FaceColors<ColorType>,
    > extends AttributeCollection
{
    public readonly vertices = new FaceVertices();

    constructor(
        public readonly mesh: Mesh,

        public readonly positions: PositionAttributeType,
        public readonly normals: NormalAttributeType,
        public readonly colors: ColorAttributeType
    ) {
        super(mesh);
    }

    init(allocators: Allocators, count: number, included: number) : void {
        this.vertices.init(allocators.face_vertices, count);

        if (included & ATTRIBUTE.position) this.positions.init(allocators.vec3D, count);
        if (included & ATTRIBUTE.normal) this.normals.init(allocators.vec3D, count);
        if (included & ATTRIBUTE.color) this.colors.init(allocators.vec3D, count);
    }

    protected _validateParameters = () : void => {
        if (!(
            this._validate(this.mesh.face_count, 'Count') &&
            this._validate(this.mesh.options.face_attributes, 'included', 0b0001, 0b1111)
        ))
            throw `Invalid parameters! count: ${this.mesh.face_count} included: ${this.mesh.options.face_attributes}`;
    };
}

export class Faces3D extends Faces<Position3D, Direction3D, RGB> {}
export class Faces4D extends Faces<Position4D, Direction4D, RGBA> {}

export class Vertices extends AttributeCollection {
    constructor(
        public readonly positions: VertexPositions,
        public readonly normals: VertexNormals,
        public readonly colors: VertexColors,
        public readonly uvs: VertexUVs,
        public readonly faces: VertexFaces
    ) {
        super();
    }

    public shared: number;

    get allocator_sizes() : AllocatorSizes {
        const result = new AllocatorSizes({
            face_vertices: this.mesh.vertex_count,
            vertex_faces: this.mesh.inputs.vertex_faces.size
        });

        const vertex_attributes: ATTRIBUTE = this.mesh.options.vertex_attributes;
        const face_attributes: ATTRIBUTE = this.mesh.options.face_attributes;

        const vertex_size = this.mesh.vertex_count * 4;
        result.vec3D += vertex_size;
        if (vertex_attributes & ATTRIBUTE.normal) result.vec3D += vertex_size;
        if (vertex_attributes & ATTRIBUTE.color) result.vec3D += vertex_size;
        if (vertex_attributes & ATTRIBUTE.uv) result.vec2D += vertex_size;

        if (face_attributes & ATTRIBUTE.position) result.vec3D += this.mesh.face_count;
        if (face_attributes & ATTRIBUTE.normal) result.vec3D += this.mesh.face_count;
        if (face_attributes & ATTRIBUTE.color) result.vec3D += this.mesh.face_count;

        return result;
    }

    init(allocators: Allocators, count: number, included: number, shared: number) : void {
        this.positions.init(allocators.vec3D, count, shared & ATTRIBUTE.position);
        if (included & ATTRIBUTE.normal) this.normals.init(allocators.vec3D, count, shared & ATTRIBUTE.normal);
        if (included & ATTRIBUTE.color) this.colors.init(allocators.vec3D, count, shared & ATTRIBUTE.color);
        if (included & ATTRIBUTE.uv) this.uvs.init(allocators.vec2D, count, shared & ATTRIBUTE.uv);
    }

    protected _validateParameters = () : void => {
        if (!(
            this._validate(this.mesh.vertex_count, 'Count') &&
            this._validate(this.mesh.options.vertex_attributes, 'included', 0b0001, 0b1111) &&
            this._validate(this.shared, 'shared', 0b0000, 0b1111)
        ))
            throw `Invalid parameters! count: ${this.mesh.vertex_count} included: ${this.mesh.options.vertex_attributes}`;
    };
}

export class Vertices3D extends Vertices<Position3D, Direction3D, RGB, TextureCoords> {}
export class Vertices4D extends Vertices<Position4D, Direction4D, RGBA, UVW> {}

const randomize = (array: FloatArray, begin: number, end: number): void => {
    for (let i = begin; i < end; i++)
        array[i] = Math.random();
};

const dir1 = dir3D();
const dir2 = dir3D();

const pos1 = pos3D();
const pos2 = pos3D();
const pos3 = pos3D();


export function *zip<A, B>(
    a: Iterable<A>,
    b: Iterable<B>
): Generator<[A, B, number]>;
export function *zip<A, B, C>(
    a: Iterable<A>,
    b: Iterable<B>,
    c?: Iterable<C>
): Generator<[A, B, C, number]>
export function *zip<A, B, C>(
    a: Iterable<A>,
    b: Iterable<B>,
    c?: Iterable<C>
): Generator<[A, B, C, number] | [A, B, number]> {
    const a_iterator = a[Symbol.iterator]();
    const b_iterator = b[Symbol.iterator]();
    const c_iterator = c![Symbol.iterator]();

    let result: [A, B, number] | [A, B, C, number];
    if (c)
        result = [null, null, null, 0];
    else
        result = [null, null, 0];

    let i = 0;
    while (true) {
        let a_result = a_iterator.next();
        let b_result = b_iterator.next();

        if (c) {
            let c_result = c_iterator.next();
            if (a_result.done || b_result.done || c_result.done)
                return;

            result[0] = a_result.value;
            result[1] = b_result.value;
            result[2] = c_result.value;
            result[3] = i;
        } else {
            if (a_result.done || b_result.done)
                return;

            result[0] = a_result.value;
            result[1] = b_result.value;
            result[2] = i;
        }

        yield result;

        i++;
    }
}

const avg = (values: number[]) : number => {
    let sum = 0;
    for (const value of values) sum += value;
    return sum / values.length;
};

function* iter2<
    T, U,
    A extends Array<T>,
    B extends Array<U>
    >(a: A, b: B, r: [number, T, U] = [0, a[0], b[0]]) : Generator<typeof r> {
    for (let i = 0; i < a.length; i++) {
        r[0] = i;
        r[1] = a[i];
        r[2] = b[i];
        yield r;
    }
}

function* iter3<T, U, V, A extends Array<T>, B extends Array<U>, C extends Array<V>>(a: A, b: B, c: C) {
    const result: [number, T, U, V] = [0, a[0], b[0], c[0]];
    for (let i = 0; i < a.length; i++) {
        result[0] = i;
        result[1] = a[i];
        result[2] = b[i];
        result[3] = c[i];
        yield result;
    }
}
