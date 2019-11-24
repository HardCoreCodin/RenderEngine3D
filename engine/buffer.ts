import {CACHE_LINE_BYTES} from "./constants.js";
import {AnyConstructor, TypedArray, TypedArrayConstructor} from "./types.js";


export class TypedArraysBuffer2<ArrayType extends TypedArray = Float32Array|Uint32Array>
{
    protected _cursor: number = 0;

    protected _sub_arrays: ArrayType[][] = [];
    protected _array: ArrayType;
    protected _array_buffer: ArrayBuffer;

    constructor(
        public vector_dimension: number,
        protected readonly _constructor: AnyConstructor<ArrayType>,
        protected readonly _bytes_per_component = (_constructor as TypedArrayConstructor<ArrayType>).BYTES_PER_ELEMENT,
        protected readonly _bytes_per_vector = _bytes_per_component * vector_dimension,
        protected readonly _cache_line_length = CACHE_LINE_BYTES / _bytes_per_component
    ) {
        if (vector_dimension < 1)
            throw `Vectors must have a dimention of at least 1!`;
    }

    get length(): number {
        return this._array_buffer.byteLength / this._bytes_per_vector;
    }

    allocate(length: number): ArrayType[] {
        const new_arrays: ArrayType[] = Array<ArrayType>(this.vector_dimension);

        this._cursor += length;
        if (this._cursor > this.length) {
            const num_cache_lines = this._cursor / this._cache_line_length;
            const new_length = this._cache_line_length * Math.ceil(num_cache_lines);
            const new_size = this._bytes_per_vector * new_length;
            this._array_buffer = new ArrayBuffer(new_size);

            for (const [dimension, sub_arrays] of this._sub_arrays.entries()) {

                this.arrays[i] = new this._typed_array(
                    this._array_buffer,
                    array_size * i,
                    array_size
                );

                if (array)
                    this.arrays[i].set(array);
            }

        }

        return new_arrays;
    }

    setLength(length: number) {
        const byte_length = length * this._bytes_per_vector;
        const array_size = length * this._bytes_per_component;
        this._array_buffer = new ArrayBuffer(array_size * this.arrays.length);

        for (const [i, array] of this.arrays.entries()) {
            this.arrays[i] = new this._typed_array(
                this._array_buffer,
                array_size * i,
                array_size
            );

            if (array)
                this.arrays[i].set(array);
        }
    }


    deallocate(arrays: ArrayType[]) {
        const new_length = this.arrays[0].length - (end - begin);
        let a: number;
        for ([a, this._array] of this.arrays.entries()) {
            this.arrays[0].copyWithin(begin, end);
            this._array = new this._constructor(new_length);
            this._array.set(this.arrays[0].subarray(0, new_length - 1));
            this.arrays[a] = this._array;
        }

        this._postUpdate();
    }
}

export class TypedArraysBuffer<ArrayType extends TypedArray = Float32Array|Uint32Array>
{
    protected _cursor: number;
    protected _temp_cursor: number = 0;

    protected readonly _temp_length: number;
    protected readonly _cache_line_length: number;

    private _sub_arrays: ArrayType[][];

    private _array: ArrayType;

    constructor(
        public dim: number,
        protected readonly _constructor: AnyConstructor<ArrayType>,
        protected readonly _postUpdate: () => void = () => {},
        public arrays: ArrayType[] = Array<ArrayType>(dim),
        protected readonly _temp_cache_lines: number = 16,
        protected readonly _entry: number[] = Array<number>(dim)
    ) {
        if (dim < 1)
            throw `Must have at least 1 item in the buffer-array!`;

        this._cache_line_length = CACHE_LINE_BYTES / (_constructor as TypedArrayConstructor<ArrayType>).BYTES_PER_ELEMENT;
        this._temp_length = this._cache_line_length * this._temp_cache_lines;
        this._cursor = this._temp_length;

        for (let i = 0; i < dim; i++)
            this.arrays[i] = new this._constructor(this._temp_length);
    }

    allocateTemp(): number {
        return this._temp_cursor++ % this._temp_length;
    }

    get length(): number {
        return this.arrays[0].length - this._temp_length;
    }

    set length(length: number) {
        if (length < this.length)
            throw `Can not shrink buffer!`;

        length += this._temp_length;

        for (const [i, array] of this.arrays.entries()) {
            this._array = new this._constructor(length);
            this._array.set(array);
            this.arrays[i] = this._array;
        }

        this._postUpdate();
    }

    *entries(begin: number = 0, end: number): Generator<number[]> {
        let a: number;

        for (let i = begin; i < end; i++) {
            for ([a, this._array] of this.arrays.entries())
                this._entry[a] = this.arrays[a][i];

            yield this._entry;
        }
    }

    allocate(length: number): number {
        const index = this._cursor;

        this._cursor += length;
        if (this._cursor > this.length)
            this.length = this._cache_line_length * Math.ceil(this._cursor / this._cache_line_length);

        return index;
    }

    deallocate(begin: number, end: number) {
        const new_length = this.arrays[0].length - (end - begin);
        let a: number;
        for ([a, this._array] of this.arrays.entries()) {
            this.arrays[0].copyWithin(begin, end);
            this._array = new this._constructor(new_length);
            this._array.set(this.arrays[0].subarray(0, new_length - 1));
            this.arrays[a] = this._array;
        }

        this._postUpdate();
    }
}

export interface IBufferSizes {
    mat2x2?: number,
    mat3x3?: number,
    mat4x4?: number,

    vec2D?: number,
    vec3D?: number,
    vec4D?: number,

    face_vertices?: number,
    vertex_faces?: number
}

export class BufferSizes implements IBufferSizes {
    constructor(
        initial_values: IBufferSizes,
        public mat2x2: number = initial_values.mat3x3 | 0,
        public mat3x3: number = initial_values.mat3x3 | 0,
        public mat4x4: number = initial_values.mat4x4 | 0,
        public vec2D: number = initial_values.vec2D | 0,
        public vec3D: number = initial_values.vec3D | 0,
        public vec4D: number = initial_values.vec4D | 0,
        public face_vertices: number = initial_values.face_vertices | 0,
        public vertex_faces: number = initial_values.vertex_faces | 0
    ) {}

    incrementVec(dim: number, increment: number): void {
        switch (dim) {
            case 2: this.vec2D += increment; break;
            case 3: this.vec3D += increment; break;
            case 4: this.vec4D += increment; break;
        }
    }

    copy = (): BufferSizes => new BufferSizes(this);
    addedWith = (other: IBufferSizes): BufferSizes => this.copy().add(other);
    add = (other: IBufferSizes): BufferSizes => {
        if (other.mat2x2) this.mat2x2 += other.mat2x2;
        if (other.mat3x3) this.mat3x3 += other.mat3x3;
        if (other.mat4x4) this.mat4x4 += other.mat4x4;

        if (other.vec2D) this.vec2D += other.vec2D;
        if (other.vec3D) this.vec3D += other.vec3D;
        if (other.vec4D) this.vec4D += other.vec4D;

        if (other.face_vertices) this.face_vertices += other.face_vertices;
        if (other.vertex_faces) this.vertex_faces += other.vertex_faces;

        return this;
    };

    times = (factor: number): BufferSizes => {
        if (this.mat2x2) this.mat2x2 *= factor;
        if (this.mat3x3) this.mat3x3 *= factor;
        if (this.mat4x4) this.mat4x4 *= factor;

        if (this.vec2D) this.vec2D *= factor;
        if (this.vec3D) this.vec3D *= factor;
        if (this.vec4D) this.vec4D *= factor;

        if (this.face_vertices) this.face_vertices *= factor;
        if (this.vertex_faces) this.vertex_faces *= factor;

        return this;
    };

    // allocate = () : Allocators => new Allocators(
    //     new Matrix3x3Allocator(this.mat3x3),
    //     new Matrix4x4Allocator(this.mat4x4),
    //
    //     new Vector2DAllocator(this.vec2D),
    //     new Vector3DAllocator(this.vec3D),
    //     new Vector4DAllocator(this.vec4D),
    //
    //     new FaceVertexIndexAllocator(this.face_vertices),
    //     new VertexFacesIndicesAllocator(this.vertex_faces)
    // );
}