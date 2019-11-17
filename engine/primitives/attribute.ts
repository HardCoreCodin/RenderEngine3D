import Mesh from "./mesh.js";
import {UV} from "../math/vec2.js";
import {Direction3D, Position3D, RGB, UVW, dir3D, pos3D} from "../math/vec3.js";
import {Direction4D, Position4D, RGBA} from "../math/vec4.js";
import {ATTRIBUTE, DIM, FACE_TYPE} from "../constants.js";
import {num2, num3, num4} from "../factories.js";
import {
    AnyConstructor,
    FaceInputNum,
    FaceInputs,
    FaceInputStr,
    FaceValues,
    FaceVertexIndices,
    IntArray, IntArrays3,
    NumArrays, NumArrays3,
    SharedVertexValues, TriangleInputNum,
    UnsharedVertexValues,
    VertexFacesIndices,
    VertexInputNum,
    VertexInputs,
    VertexInputStr,
} from "../types.js";
import {
    Allocators, AllocatorSizes,
    FaceVertexIndexAllocator, FloatBuffer, IntBuffer,
    Vector2DAllocator,
    Vector3DAllocator,
    Vector4DAllocator,
    VertexFacesIndicesAllocator
} from "../allocators.js";
import {Vector, Direction, Position, TexCoords, Color} from "../math/vec.js";

export abstract class Attribute {
    public readonly id: ATTRIBUTE;
}

export class InputAttribute extends Attribute {
    public readonly dim: DIM = DIM._3D;

    constructor(
        public face_type: FACE_TYPE = FACE_TYPE.TRIANGLE,
        public vertices?: VertexInputs,
        public faces?: FaceInputs,
    ) {
        super();

        if (!faces) switch (face_type) {
            case FACE_TYPE.TRIANGLE: this.faces = num3(); break;
            case FACE_TYPE.QUAD: this.faces = num4(); break;
            default:
                throw `Invalid face type ${face_type}! Only supports triangles and quads.`;
        }

        if (!vertices) switch (this.dim) {
            case DIM._2D: this.vertices = num2(); break;
            case DIM._3D: this.vertices = num3(); break;
            default:
                throw `Invalid vertex dimension ${this.dim}! Only supports 2D or 3D.`;
        }
    }

    triangulate() {
        if (this.face_type === FACE_TYPE.QUAD) {
            const v4 = this.faces.pop();
            const quad_count = v4.length;
            const [v1, v2, v3] = this.faces;

            v1.length *= 2;
            v2.length *= 2;
            v3.length *= 2;

            for (let quad_id = 0; quad_id < quad_count; quad_id++) {
                v1[quad_id + quad_count] = v1[quad_id];
                v2[quad_id + quad_count] = v3[quad_id];
                v3[quad_id + quad_count] = v4[quad_id];
            }

            this.face_type = FACE_TYPE.TRIANGLE;
        }
    }

    private getValue(value: number | string, is_index: boolean) : number {
        let error: string;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`
                } else
                    return value;
            } else
                error = `${value} is not a finite number`;
        } else if (typeof value === "string")
            return this.getValue(+value, is_index);
        else
            error = `Got ${typeof value} ${value} instead or a number or a string`;

        throw `Invalid ${this} ${is_index ? 'index' : 'value'}! ${error}`;
    }

    private checkInputSize(input_size: number, is_index: boolean) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this} ${
                is_index ? 'indices' : 'values'
            } input! Got ${input_size} ${
                is_index ? 'vertices per face' : 'dimensions'
            } instead of ${required_size}`;
    }

    pushVertex(vertex: VertexInputNum | VertexInputStr) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }

    pushFace(face: FaceInputNum | FaceInputStr) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces[vertex_num].push(this.getValue(vertex_index, true));
    }
}

abstract class AbstractVertexAttribute<VectorType extends Vector> extends Attribute {
    public is_shared = false;
    public offsets = [0, 0, 0];
    public size = 0;
    public buffer: FloatBuffer;

    protected Vector: AnyConstructor<VectorType>;
    public current: [VectorType, VectorType, VectorType];

    setCurrent(
        array_index_1: number,
        array_index_2: number = array_index_1,
        array_index_3: number = array_index_1
    ) : void {
        this.current[0].array_index = array_index_1;
        this.current[1].array_index = array_index_2;
        this.current[2].array_index = array_index_3;
    }

    init(buffer: FloatBuffer,
         size: number,
         is_shared: boolean | number = this.is_shared) {

        this.size = size;
        this.buffer = buffer;
        this.is_shared = !!(is_shared);
        if (is_shared) {
            this.offsets[0] = buffer.allocate(size);
            this.current[0] = new this.Vector(this.offsets[0]);
        } else {
            this.offsets[0] = buffer.allocate(size);
            this.offsets[1] = buffer.allocate(size);
            this.offsets[2] = buffer.allocate(size);
            this.current[0] = new this.Vector(this.offsets[0]);
            this.current[1] = new this.Vector(this.offsets[1]);
            this.current[2] = new this.Vector(this.offsets[2]);
        }
    }

    protected *_iterUnshared() {
        for (const offset of this.offsets)
            this.buffer.slice(this.size, offset);
    }

    get shared_values() {
        return this.buffer.slice(this.size, this.offsets[0]);
    }

    get unshared_values() {
        return this._iterUnshared();
    }
}

abstract class AbstractLoadableVertexAttribute<
    VectorType extends Vector,
    InputAttributeType extends InputAttribute
    > extends AbstractVertexAttribute<VectorType> {

    protected _loadShared(input_attribute: InputAttributeType, face_vertices: FaceVertices) : void {
        let input_id, output_id: number;
        for (const [in_component, out_component, offset] of
            zip(input_attribute.vertices, this.buffer.arrays, this.offsets)) {

        }
            for (const [output_ids, input_ids] of zip(face_vertices, input_attribute.faces))
                for ([output_id, input_id] of zip(output_ids, input_ids))
                    out_component[output_id] = in_component[input_id];
    }

    protected _loadUnShared(input_attribute: InputAttributeType) : void {
        let face_index, vertex_index: number;
        for (const [out_components, indices] of zip(this.unshared_values, input_attribute.faces))
            for (const [out_component, in_component] of zip(out_components, input_attribute.vertices))
                for ([face_index, vertex_index] of indices.entries())
                    out_component[face_index] = in_component[vertex_index];
    }

    load(input_attribute: InputAttributeType, face_vertices: FaceVertices) : void {
        if (this.is_shared)
            this._loadShared(input_attribute, face_vertices);
        else
            this._loadUnShared(input_attribute);
    }
}

abstract class AbstractPulledVertexAttribute<
    VectorType extends Vector,
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends AbstractFaceAttribute<VectorType>
    > extends AbstractLoadableVertexAttribute<VectorType, InputAttributeType> {

    pull(face_attribute: FaceAttributeType, vertex_faces: VertexFaces) : void {
        if (this.is_shared) // Average vertex-attribute values from their related face's attribute values:
            for (const [vertex_component, face_component] of zip(this.shared_values, face_attribute.face_values))
                for (const [vertex_id, face_ids] of vertex_faces.indices.entries()) {
                    let accumulator = 0;

                    // For each component 'accumulate-in' the face-value of all the faces of this vertex:
                    for (let face_id of face_ids)
                        accumulator += face_component[face_id];

                    vertex_component[vertex_id] += accumulator / face_ids.length;
                }
        else // Copy over face-attribute values to their respective vertex-attribute values:
            for (const vertex_components of this.unshared_values)
                for (const [vertex_component, face_component] of zip(vertex_components, face_attribute.face_values))
                    vertex_component.set(face_component);
    }
}

abstract class AbstractFaceAttribute<VectorType extends Vector> extends Attribute {
    public face_values: FaceValues;
    protected Vector: AnyConstructor<VectorType>;
    public current: VectorType;

    setCurrent(id: number) : void {
        this.current.id = id;
    }

    init(allocator: Vector3DAllocator, size: number) {
        if (!(this.face_values && this.face_values[0].length === size))
            this.face_values = allocator.allocate(size);

        if (!this.current)
            this.current = new this.Vector(this.face_values);
    }
}

abstract class AbstractPulledFaceAttribute<
    FaceVector extends Vector,
    VertexVector extends Vector,
    VertexAttributeType extends AbstractVertexAttribute<VertexVector>
    > extends AbstractFaceAttribute<FaceVector> {

    pull(vertex_attribute: VertexAttributeType, face_vertices: FaceVertices): void {
        if (vertex_attribute.is_shared)
            for (const [output, input] of zip(this.face_values, vertex_attribute.shared_values))
                for (const [face_id, [id_0, id_1, id_2]] of [...zip(face_vertices)].entries())
                    output[face_id] = (input[id_0] + input[id_1] + input[id_2]) / 3;
        else
            for (const [output, ...inputs] of zip(this.face_values, ...vertex_attribute.unshared_values))
                for (const [face_id, values] of [...zip(...inputs)].entries())
                    output[face_id] = avg(values);
    }
}

class VertexPositions<PositionType extends Position = Position>
    extends AbstractLoadableVertexAttribute<PositionType, InputPositions> {

    public readonly id: ATTRIBUTE = ATTRIBUTE.position;

    protected _loadShared(input_attribute: InputPositions) : void {
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            out_component.set(in_component);
    }
}

class VertexNormals<
    DirectionType extends Direction = Direction,
    PositionType extends Position = Position
    > extends AbstractPulledVertexAttribute<
        DirectionType,
        InputNormals,
        FaceNormals<DirectionType, PositionType>
    > {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
}

class VertexColors<ColorType extends Color<ColorType>>
    extends AbstractPulledVertexAttribute<
        ColorType,
        InputColors,
        FaceColors<ColorType>
        > {

    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        if (this.is_shared)
            randomize(this.shared_values);
        else
            for (const values of this.unshared_values)
                randomize(values);
    }
}

class VertexUVs<UVType extends TexCoords<UVType>> extends AbstractLoadableVertexAttribute<UVType, InputUVs> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
}

export class InputPositions extends InputAttribute {public readonly id = ATTRIBUTE.position}
export class InputNormals extends InputAttribute {public readonly id = ATTRIBUTE.normal}
export class InputColors extends InputAttribute {public readonly id = ATTRIBUTE.color}
export class InputUVs extends InputAttribute {public readonly id = ATTRIBUTE.uv; public readonly dim = DIM._2D}

export class FacePositions<PositionType extends Position = Position>
    extends AbstractPulledFaceAttribute<PositionType, PositionType, VertexPositions<PositionType>> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
}

export class FaceNormals<
    DirectionType extends Direction = Direction,
    PositionType extends Position = Position
    > extends AbstractPulledFaceAttribute<DirectionType, PositionType, VertexPositions<PositionType>> {

    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;

    pull(attribute: VertexPositions<PositionType>, face_vertices: FaceVertices) {
        const [ids_0, ids_1, ids_2] = face_vertices.indices;

        face_normal.arrays = [
            this.face_values[0],
            this.face_values[1],
            this.face_values[2]
        ];
        if (attribute.is_shared)
            pos1.arrays = pos2.arrays = pos3.arrays = [
                attribute.shared_values[0],
                attribute.shared_values[1],
                attribute.shared_values[2]
            ];
        else {
            pos1.arrays = [
                attribute.unshared_values[0][0],
                attribute.unshared_values[0][1],
                attribute.unshared_values[0][2]
            ];
            pos2.arrays = [
                attribute.unshared_values[1][0],
                attribute.unshared_values[1][1],
                attribute.unshared_values[1][2]
            ];
            pos3.arrays = [
                attribute.unshared_values[2][0],
                attribute.unshared_values[2][1],
                attribute.unshared_values[2][2]
            ];
        }


        for (let face_id = 0; face_id < this.face_values[0].length; face_id++) {
            face_normal.id = face_id;

            if (attribute.is_shared) {
                pos1.id = ids_0[face_id];
                pos2.id = ids_1[face_id];
                pos3.id = ids_2[face_id];
            } else
                pos1.id = pos2.id = pos3.id = face_id;

            pos1.to(pos2,
                dir1).crossedWith(pos1.to(pos3, dir2),
                dir3).normalized(face_normal);
        }
    }
}

export class FaceColors<ColorType extends Color<ColorType>>
    extends AbstractPulledFaceAttribute<ColorType, ColorType, VertexColors<ColorType>> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        randomize(this.face_values);
    }
}

class AttributeCollection<
    PositionAttributeType extends Attribute,
    NormalAttributeType extends Attribute,
    ColorAttributeType extends Attribute,
    > {
    public positions: PositionAttributeType;
    public normals: NormalAttributeType;
    public colors: ColorAttributeType;

    constructor(
        public readonly mesh: Mesh
    ) {
        this._validateParameters();
    }

    protected _validate(value: number, name: string,  min: number = 0, max: number = Number.MAX_SAFE_INTEGER) : boolean {
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

    protected _validateParameters = (): void => {};
}

export class FaceVertices {
    public indices: FaceVertexIndices;
    public readonly offsets: TriangleInputNum = [0, 0, 0];
    public size = 0;

    init(buffer: IntBuffer, size: number) {
        this.size = size;
        this.indices = buffer.arrays as FaceVertexIndices;
        this.offsets[0] = buffer.allocate(size);
        this.offsets[1] = buffer.allocate(size);
        this.offsets[2] = buffer.allocate(size);
    }

    load(inputs: FaceInputs) {
        for (const [array, offset, values] of zip(this.indices, this.offsets, inputs))
            array.set(values, offset);
    }

    *[Symbol.iterator]() {
        const size = this.size;
        for (const [array, offset] of zip(this.indices, this.offsets))
            yield function* () {
                for (let i = offset; i < offset + size; i++)
                    yield array[i];
            }
    }
}

export class VertexFaces {
    public indices: VertexFacesIndices;
    public readonly offsets: number[] = [0];
    public readonly sizes: number[] = [0];

    init(buffer: IntBuffer, size: number) {
        this.indices = buffer.arrays;
        this.offsets[0] = buffer.allocate(size);
    }

    load(inputs: NumArrays) {
        this.offsets.length = this.sizes.length = inputs.length;

        let offset = this.offsets[0];
        for (const [i, values] of inputs.entries()) {
            this.indices[0].set(values, offset);
            this.offsets[i] = offset;
            this.sizes[i] = values.length;
            offset += values.length;
        }
    }
}

export class Faces<
    PositionType extends Position = Position3D,
    DirectionType extends Direction = Direction3D,
    ColorType extends Color<ColorType> = RGB
    > extends AttributeCollection<
    FacePositions<PositionType>,
    FaceNormals<DirectionType, PositionType>,
    FaceColors<ColorType>
    > {
    public readonly positions = new FacePositions<PositionType>();
    public readonly normals = new FaceNormals<DirectionType, PositionType>();
    public readonly colors = new FaceColors<ColorType>();
    public readonly vertices = new FaceVertices();

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

export class Vertices<
        PositionType extends Position,
        DirectionType extends Direction,
        ColorType extends Color<ColorType>,
        UVType extends TexCoords<UVType>
    > extends AttributeCollection<
    VertexPositions<PositionType>,
    VertexNormals<DirectionType, PositionType>,
    VertexColors<ColorType>
    > {
    public readonly positions = new VertexPositions<PositionType>();
    public readonly normals = new VertexNormals<DirectionType, PositionType>();
    public readonly colors = new VertexColors<ColorType>();
    public readonly uvs =  new VertexUVs<UVType>();
    public readonly faces = new VertexFaces();

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

export class Vertices3D extends Vertices<Position3D, Direction3D, RGB, UV> {}
export class Vertices4D extends Vertices<Position4D, Direction4D, RGBA, UVW> {}


const randomize = (values: readonly Float32Array[]): void => {
    // Assigned random values:
    for (const array of values)
        for (const index of array.keys())
            array[index] = Math.random();
};

const dir1 = dir3D();
const dir2 = dir3D();
const dir3 = dir3D();

const pos1 = pos3D();
const pos2 = pos3D();
const pos3 = pos3D();
const face_normal = dir3D();

function *zip (...iterables){
    let iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        let results = iterators.map(iter => iter.next());
        if (results.some(res => res.done))
            return;
        else
            yield results.map(res => res.value);
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
