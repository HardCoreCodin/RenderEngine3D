import {
    FaceVertexIndices,
    FloatArray,
    FloatArrays, IntArray, IntArrays,
    Matrix2x2Values,
    Matrix3x3Values,
    Matrix4x4Values, TypedArray,
    Vector2DValues, Vector3DValues,
    Vector4DValues, VertexFacesIndices
} from "./types.js";
import {DIM} from "./constants.js";

abstract class AbstractArraysAllocator<ArraysType> {
    protected readonly _dim: DIM;
    protected readonly _buffer: TypedArray;
    public readonly arrays: ArraysType;
    public readonly length;
    public current: number = 0;

    constructor(protected readonly _size: number) {
        this.length = this._dim * _size;
        this._buffer = this._createBuffer();

        const arrays = new Array(this._dim);
        for (let i = 0; i < this._dim; i++)
            arrays[i] = this._buffer.slice(
                this._size * i,
                this._size * (i + 1)
            );

        this.arrays = this._createArrays(arrays);
    }

    abstract _createBuffer() : TypedArray;

    abstract _createArrays(arrays: FloatArrays | IntArrays) : ArraysType;

    allocate(size: number = 1) : ArraysType {
        this.current += size;

        if (this.current > this._size)
            throw `Buffer overflow!`;

        return this.arrays;
    }
}

abstract class AbstractFloatArraysAllocator<ArraysType> extends AbstractArraysAllocator<ArraysType> {
    protected readonly _buffer: FloatArray;
    _createBuffer = () : FloatArray => new FloatArray(this.length);
}
abstract class AbstractIntArraysAllocator<ArraysType> extends AbstractArraysAllocator<ArraysType> {
    protected readonly _buffer: IntArray;
    _createBuffer = () : IntArray => new IntArray(this.length);
}


export class Matrix4x4Allocator extends AbstractFloatArraysAllocator<Matrix4x4Values> {
    protected readonly _dim: DIM = DIM._16D;

    _createArrays = (arrays: FloatArrays) : Matrix4x4Values => [
        arrays[0], arrays[1], arrays[2], arrays[3],
        arrays[4], arrays[5], arrays[6], arrays[7],
        arrays[8], arrays[9], arrays[10], arrays[11],
        arrays[12], arrays[13], arrays[14], arrays[15],
    ];
}

export class Matrix3x3Allocator extends AbstractFloatArraysAllocator<Matrix3x3Values> {
    protected readonly _dim: DIM = DIM._9D;

    _createArrays = (arrays: FloatArrays) : Matrix3x3Values => [
        arrays[0], arrays[1], arrays[2],
        arrays[3], arrays[4], arrays[5],
        arrays[6], arrays[7], arrays[8],
    ];
}

export class Matrix2x2Allocator extends AbstractFloatArraysAllocator<Matrix2x2Values> {
    protected readonly _dim: DIM = DIM._4D;

    _createArrays = (arrays: FloatArrays) : Matrix2x2Values => [
        arrays[0], arrays[1],
        arrays[2], arrays[3],
    ];
}

export class Vector2DAllocator extends AbstractFloatArraysAllocator<Vector2DValues> {
    protected readonly _dim: DIM = DIM._2D;

    _createArrays = (arrays: FloatArrays) : Vector2DValues => [
        arrays[0],
        arrays[1],
    ];
}

export class Vector3DAllocator extends AbstractFloatArraysAllocator<Vector3DValues> {
    protected readonly _dim: DIM = DIM._3D;

    _createArrays = (arrays: FloatArrays) : Vector3DValues => [
        arrays[0],
        arrays[1],
        arrays[2],
    ];
}

export class Vector4DAllocator extends AbstractFloatArraysAllocator<Vector4DValues> {
    protected readonly _dim: DIM = DIM._4D;

    _createArrays = (arrays: FloatArrays) : Vector4DValues => [
        arrays[0],
        arrays[1],
        arrays[2],
        arrays[3],
    ];
}

export class FaceVertexIndexAllocator extends AbstractIntArraysAllocator<FaceVertexIndices> {
    protected readonly _dim: DIM = DIM._3D;

    _createArrays = (arrays: IntArrays) : FaceVertexIndices => [
        arrays[0],
        arrays[1],
        arrays[2],
    ];
}

export class VertexFacesIndicesAllocator extends AbstractIntArraysAllocator<VertexFacesIndices> {
    protected readonly _dim: DIM = DIM._1D;

    _createArrays = (arrays: IntArrays) : VertexFacesIndices => [
        arrays[0],
    ];
}

export class Allocators {
    constructor(
        public readonly mat3x3: Matrix3x3Allocator,
        public readonly mat4x4: Matrix4x4Allocator,

        public readonly vec2D: Vector2DAllocator,
        public readonly vec3D: Vector3DAllocator,
        public readonly vec4D: Vector4DAllocator,

        public readonly face_vertices: FaceVertexIndexAllocator,
        public readonly vertex_faces: VertexFacesIndicesAllocator
    ) {}
}

export interface IAllocatorSizes {
    mat3x3?: number,
    mat4x4?: number,

    vec2D?: number,
    vec3D?: number,
    vec4D?: number,

    face_vertices?: number,
    vertex_faces?: number
}

export class AllocatorSizes implements IAllocatorSizes {
    constructor(
        initial_values: IAllocatorSizes,

        public mat3x3: number = initial_values.mat3x3 | 0,
        public mat4x4: number = initial_values.mat4x4 | 0,

        public vec2D: number = initial_values.vec2D | 0,
        public vec3D: number = initial_values.vec3D | 0,
        public vec4D: number = initial_values.vec4D | 0,

        public face_vertices: number = initial_values.face_vertices | 0,
        public vertex_faces: number  = initial_values.vertex_faces | 0
    ) {}

    copy = () : AllocatorSizes => new AllocatorSizes(this);
    addedWith = (other: IAllocatorSizes) : AllocatorSizes => this.copy().add(other);
    add = (other: IAllocatorSizes) : AllocatorSizes => {
        if (other.mat3x3) this.mat3x3 += other.mat3x3;
        if (other.mat4x4) this.mat4x4 += other.mat4x4;

        if (other.vec2D) this.vec2D += other.vec2D;
        if (other.vec3D) this.vec3D += other.vec3D;
        if (other.vec4D) this.vec4D += other.vec4D;

        if (other.face_vertices) this.face_vertices += other.face_vertices;
        if (other.vertex_faces) this.vertex_faces += other.vertex_faces;

        return this;
    };

    times = (factor: number) : AllocatorSizes => {
        if (this.mat3x3) this.mat3x3 *= factor;
        if (this.mat4x4) this.mat4x4 *= factor;

        if (this.vec2D) this.vec2D *= factor;
        if (this.vec3D) this.vec3D *= factor;
        if (this.vec4D) this.vec4D *= factor;

        if (this.face_vertices) this.face_vertices *= factor;
        if (this.vertex_faces) this.vertex_faces *= factor;

        return this;
    };

    allocate = () : Allocators => new Allocators(
        new Matrix3x3Allocator(this.mat3x3),
        new Matrix4x4Allocator(this.mat4x4),

        new Vector2DAllocator(this.vec2D),
        new Vector3DAllocator(this.vec3D),
        new Vector4DAllocator(this.vec4D),

        new FaceVertexIndexAllocator(this.face_vertices),
        new VertexFacesIndicesAllocator(this.vertex_faces)
    );
}