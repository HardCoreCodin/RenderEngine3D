import Mesh, {InputAttribute, InputColors, InputNormals, InputPositions, InputUVs} from "./mesh.js";
import {UV} from "../math/vec2.js";
import {dir3D, Direction3D, pos3D, Position3D, RGB, UVW} from "../math/vec3.js";
import {Direction4D, Position4D, RGBA} from "../math/vec4.js";
import {ATTRIBUTE, DIM} from "../constants.js";
import {
    AnyConstructor,
    FloatArray,
    IntArray, Num16, Num2, Num3, Num4, Num9, T16, T2, T3, T4, T9, TypedArray,
    // Num,
    // TArray, Tuple, TypedArray, TypedTuple,
    UnsharedValues,
    VectorValues,
} from "../types.js";
import {Buffer} from "../allocators.js";
import {Color, Direction, Position, TextureCoords, Vector} from "../math/vec.js";
import {FaceVertices, VertexFaces} from "./index.js";
// import {iterTypedArray} from "../utils.js";

export class Data<
    Dim extends DIM,
    ArrayType extends TypedArray = FloatArray>
{
    public length: number;
    public begin: number;
    public end: number;

    constructor(
        protected readonly _buffer: Buffer<Dim, ArrayType>,
        public arrays = _buffer.arrays,
        public dim = arrays.length
    ) {}

    // protected _raw_arrays: RawArray<ArrayType>[];

    init(length: number) {
        this.length = length;
        this.end = this._buffer.allocate(length);
        this.begin = this.end - length;
        // this.arrays = this._buffer.arrays;
        //
        // if (!this._raw_arrays) {
        //     this._raw_arrays = Array(this.dim);
        //     for (const [i, array] of this._buffer.arrays.entries())
        //         this._raw_arrays[i] = [array, 0 ,0];
        // }
    }

    // *rawArrayIterator(
    //     begin: number = this.begin,
    //     end: number = this.end,
    //     out: RawArray<ArrayType>[] = this._raw_arrays
    // ): Generator<RawArray<ArrayType>> {
    //     for (const [i, array] of this._buffer.arrays.entries()) {
    //         out[i][0] = array;
    //         out[i][1] = begin;
    //         out[i][2] = end;
    //
    //         yield out[i];
    //     }
    // }
    //
    get slices(): Dim extends DIM._1D ? [ArrayType] :
    Dim extends DIM._2D ? T2<ArrayType> :
        Dim extends DIM._3D ? T3<ArrayType> :
            Dim extends DIM._4D ? T4<ArrayType> :
                Dim extends DIM._9D ? T9<ArrayType> :
                    Dim extends DIM._16D ? T16<ArrayType> : never {
        return this._buffer.slice(this.begin, this.end);
    }

    // get raw_arrays(): RawArray<ArrayType>[] {
    //     for (const [raw_array, array] of zip(this._raw_arrays, this._buffer.arrays)) {
    //         raw_array[0] = array;
    //         raw_array[1] = this.begin;
    //         raw_array[2] = this.end;
    //     }
    //
    //     return this._raw_arrays;
    // }

    entries(
        begin: number = this.begin,
        end: number = this.end
    ): Generator<[number, Dim extends DIM._1D ? [number] :
    Dim extends DIM._2D ? Num2 :
        Dim extends DIM._3D ? Num3 :
            Dim extends DIM._4D ? Num4 :
                Dim extends DIM._9D ? Num9 :
                    Dim extends DIM._16D ? Num16 :
                        never]> {
        return this._buffer.entries(begin, end);
    }
}

export class FloatData<Dim extends DIM> extends Data<Dim , FloatArray> {}
export class IntData<Dim extends DIM> extends Data<Dim , IntArray> {}

export class DataAttribute<
    Dim extends DIM._2D | DIM._3D | DIM._4D,
    VectorType extends Vector<Dim>>
    extends FloatData<Dim>
{
    public readonly attribute_type: ATTRIBUTE;

    protected Vector: AnyConstructor<VectorType>;
    public current: VectorType;

    init(length: number): void {
        super.init(length);

        this.current = new this.Vector(this.begin);
    }

    setCurrent(array_index): void {
        this.current.array_index = array_index;
        this.current.buffer_offset = this.begin;
    }

    *[Symbol.iterator](): Generator<VectorType> {
        for (let i = 0; i < this.length; i++) {
            this.setCurrent(i);
            yield this.current;
        }
    }
}

export class VertexAttribute<
    Dim extends DIM._2D | DIM._3D | DIM._4D,
    VectorType extends Vector<Dim>>
    extends DataAttribute<Dim, VectorType>
{
    public readonly currents: T3<VectorType>;
    public readonly begins: T3<number> = [0, 0, 0];
    public readonly ends: T3<number> = [0, 0, 0];
    public is_shared: boolean;

    private _unshared_arrays: UnsharedValues = [null, null, null];
    // private _unshared_iterators: UnsharedRawIterators = [null, null, null];
    // private _unshared_raw_arrays: UnsharedRawArrays = [
    //     [null, 0, 0],
    //     [null, 0, 0],
    //     [null, 0, 0]
    // ];
    // private _unshared_raw_components: UnsharedRawComponents;

    setCurrent(
        array_index_1: number,
        array_index_2: number = array_index_1,
        array_index_3: number = array_index_2
    ): void {
        this.currents[0].array_index = array_index_1;
        this.currents[1].array_index = array_index_2;
        this.currents[2].array_index = array_index_3;
    }

    init(length: number, is_shared: boolean|number = this.is_shared): void {
        this.length = length;
        this.is_shared = !!is_shared;

        if (is_shared) {
            super.init(length);
            this.begins[0] = this.begins[1] = this.begins[2] = this.begin;
            this.ends[0] = this.ends[1] = this.ends[2] = this.end;

            return;
        }

        this.ends[0] = this._buffer.allocate(length);
        this.ends[1] = this._buffer.allocate(length);
        this.ends[2] = this._buffer.allocate(length);

        this.begins[0] = this.ends[0] - length;
        this.begins[1] = this.ends[1] - length;
        this.begins[2] = this.ends[2] - length;

        // this.ends[0] = this._unshared_raw_arrays[0][2] = this._buffer.allocate(length);
        // this.ends[1] = this._unshared_raw_arrays[1][2] = this._buffer.allocate(length);
        // this.ends[2] = this._unshared_raw_arrays[2][2] = this._buffer.allocate(length);
        //
        // this.begins[0] = this._unshared_raw_arrays[0][1] = this.ends[0] - length;
        // this.begins[1] = this._unshared_raw_arrays[1][1] = this.ends[1] - length;
        // this.begins[2] = this._unshared_raw_arrays[2][1] = this.ends[2] - length;

        if (this._unshared_arrays[0] === null) {
            this._unshared_arrays[0] = [...this._buffer.arrays] as VectorValues;
            this._unshared_arrays[1] = [...this._buffer.arrays] as VectorValues;
            this._unshared_arrays[2] = [...this._buffer.arrays] as VectorValues;
        }

        // if (this._unshared_iterators[0] === null) {
        //     for (const [begin, end, vertex_num] of zip(this.begins, this.ends)) {
        //         this._unshared_iterators[vertex_num] = Array(this.dim);
        //         for
        //         this.unsharedRawArraysIterator(begin, end, this._unshared_iterators[vertex_num]);
        //     }
        //
        //     this._raw_arrays = Array(this.dim);
        //     for (const [i, array] of this._buffer.arrays.entries())
        //         this._raw_arrays[i] = [array, 0 ,0];
        // }

        this.currents[0] = new this.Vector(this.begins[0]);
        this.currents[1] = new this.Vector(this.begins[1]);
        this.currents[2] = new this.Vector(this.begins[2]);
    }

    // *unsharedRawArraysIterator(
    //     begin: number = this.begin,
    //     end: number = this.end,
    //     out: RawFloatArrays
    // ): Generator<RawFloatArrays> {
    //     for (const [i, array] of this._buffer.arrays.entries()) {
    //         out[i][0] = array;
    //         out[i][1] = begin;
    //         out[i][2] = end;
    //
    //         yield out[i];
    //     }
    // }

    // get unshared_raw_components(): UnsharedRawComponents {
    //     if (!this._unshared_raw_components) {
    //         this._unshared_raw_components = Array(this.dim);
    //         for (const [i, array] of this._buffer.arrays.entries()) {
    //             this._unshared_raw_components[i] = [
    //                 [array, this.begins[0], this.ends[0]],
    //                 [array, this.begins[1], this.ends[1]],
    //                 [array, this.begins[2], this.ends[2]]
    //             ];
    //         }
    //     } else
    //         for (const [i, array] of this._buffer.arrays.entries())
    //             this._unshared_raw_components[i][0][0] =
    //                 this._unshared_raw_components[i][1][0] =
    //                     this._unshared_raw_components[i][2][0] = array;
    //
    //     return this._unshared_raw_components;
    // }
    //
    // get unshared_raw_arrays(): UnsharedRawArrays {
    //     this._unshared_raw_arrays[0][0] =
    //         this._unshared_raw_arrays[1][0] =
    //             this._unshared_raw_arrays[2][0] = this._buffer.arrays;
    //
    //     return this._unshared_raw_arrays;
    // }

    // get unshared_iterators(): UnsharedRawIterators {
    //     for (const [begin, end, vertex_num] of zip(this.begins, this.ends))
    //         this._unshared_iterators[vertex_num] = iterTypedArray();
    //
    //     return this._unshared_iterators
    // }

    // get unshared_arrays(): UnsharedValues {
    //     for (const [begin, end, vertex_num] of zip(this.begins, this.ends))
    //         this._buffer.slice(begin, end, this._unshared_arrays[vertex_num]);
    //
    //     return this._unshared_arrays;
    // }

    *iterFaceVertexValues(
        face_vertices?: FaceVertices
    ): Generator<T3<VectorType>> {
        if (this.is_shared) {
            for (const [face_index, [index_1, index_2, index3]] of face_vertices.entries()) {
                this.setCurrent(index_1, index_2, index3);
                yield this.currents;
            }
        } else {
            for (let face_index = 0; face_index < this.length; face_index++) {
                this.setCurrent(face_index);
                yield this.currents;
            }
        }
    }
}

export class LoadableVertexAttribute<
    Dim extends DIM._2D | DIM._3D | DIM._4D,
    VectorType extends Vector<Dim>,
    InputAttributeType extends InputAttribute
    >
    extends VertexAttribute<Dim, VectorType>
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
    Dim extends DIM._3D | DIM._4D,
    VectorType extends Vector<Dim>,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends DataAttribute<Dim, VectorType>>
    extends LoadableVertexAttribute<
        Dim,
        VectorType,
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

export class PulledFaceAttribute<
    Dim extends DIM._3D | DIM._4D,
    FaceVector extends Vector<Dim>,
    VertexVector extends Vector<Dim>,
    VertexAttributeType extends VertexAttribute<Dim, VertexVector>>
    extends DataAttribute<Dim, FaceVector>
{
    pull(input: VertexAttributeType, face_vertices: FaceVertices): void {
        if (input.is_shared) {
            for (const [face_component, vertex_component] of zip(this.arrays, input.arrays))
                for (const [face_index, [vi_1, vi_2, vi_3]] of face_vertices.entries())
                    face_component[input.begin + face_index] = (
                        vertex_component[input.begin + vi_1] +
                        vertex_component[input.begin + vi_2] +
                        vertex_component[input.begin + vi_3]
                    ) / 3;
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

export class VertexPositions<
    Dim extends DIM._3D | DIM._4D,
    PositionType extends Position<Dim>>
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

export class VertexPositions3D extends VertexPositions<DIM._3D, Position3D> {}
export class VertexPositions4D extends VertexPositions<DIM._4D, Position4D> {}

export class VertexNormals<
    Dim extends DIM._3D | DIM._4D,
    DirectionType extends Direction<Dim>,
    PositionType extends Position<Dim>>
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

export class VertexNormals3D extends VertexNormals<DIM._3D, Direction3D, Position3D> {}
export class VertexNormals4D extends VertexNormals<DIM._4D, Direction4D, Position4D> {}

export class VertexColors<
    Dim extends DIM._3D | DIM._4D,
    ColorType extends Color<Dim>>
    extends PulledVertexAttribute<
        Dim,
        ColorType,
        InputColors,
        FaceColors<Dim, ColorType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.color;

    generate(): void {
        for (const array of this._buffer.arrays)
            randomize(array, this.begins[0], this.ends[2]);
    }
}

export class VertexRGB extends VertexColors<DIM._3D, RGB> {}
export class VertexRGBA extends VertexColors<DIM._4D, RGBA> {}

export class VertexUVs<
    Dim extends DIM._3D | DIM._2D,
    UVType extends TextureCoords<Dim>>
    extends LoadableVertexAttribute<
        Dim,
        UVType,
        InputUVs>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.uv;
}

export class VertexUV extends VertexUVs<DIM._2D, TextureCoords> {}
export class VertexUVW extends VertexUVs<DIM._3D, UVW> {}

export class FacePositions<
    Dim extends DIM._3D | DIM._4D,
    PositionType extends Position<Dim> = Dim extends DIM._3D ? Position3D : Position4D>
    extends PulledFaceAttribute<
        Dim,
        PositionType,
        PositionType,
        VertexPositions<Dim, PositionType>>
{
    public readonly attribute_type: ATTRIBUTE = ATTRIBUTE.position;
}

export class FaceNormals<
    Dim extends DIM._3D | DIM._4D,
    DirectionType extends Direction<Dim>,
    PositionType extends Position<Dim>,
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
            if (p1.dim === 3) {
                pos1.setFrom(p1);
                pos2.setFrom(p2);
                pos3.setFrom(p3);
            } else {
                pos1.setTo(p1.x, p1.y, p1.z);
                pos2.setTo(p2.x, p2.y, p2.z);
                pos3.setTo(p3.x, p3.y, p3.z);
            }

            (p1 as Position3D).to(p2 as Position3D);
            p1.to(p3);
            p1.to(p2).cross(dir2).normalize();

            if (face_normal.dim === 3)
                face_normal.setFrom(dir1);
            else
                face_normal.setTo(dir1.x, dir1.y, dir1.z);
        }
    }
}

export class FaceNormals3D extends FaceNormals<DIM._3D, Direction3D, Position3D> {}

export class FaceColors<
    Dim extends DIM._3D | DIM._4D,
    ColorType extends Color<Dim>>
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
        for (const array of this._buffer.arrays)
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
