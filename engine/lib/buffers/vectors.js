import Matrix3x3 from "../accessors/matrix3x3.js";
import Buffer from "../memory/buffers.js";
import { UV2D, UV3D } from "../accessors/uv.js";
import { Color3D, Color4D } from "../accessors/color.js";
import { Position2D, Position3D, Position4D } from "../accessors/position.js";
import { Direction2D, Direction3D, Direction4D } from "../accessors/direction.js";
import { VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR } from "../memory/allocators.js";
import { multiply_all_2D_vectors_by_a_2x2_matrix_in_place, multiply_all_2D_vectors_by_a_2x2_matrix_to_out, multiply_some_2D_vectors_by_a_2x2_matrix_in_place, multiply_some_2D_vectors_by_a_2x2_matrix_to_out, normalize_all_2D_directions_in_place, normalize_some_2D_directions_in_place } from "../math/vec2.js";
import { multiply_all_3D_directions_by_a_4x4_matrix_in_place, multiply_all_3D_directions_by_a_4x4_matrix_to_out3, multiply_all_3D_directions_by_a_4x4_matrix_to_out4, multiply_all_3D_positions_by_a_4x4_matrix_in_place, multiply_all_3D_positions_by_a_4x4_matrix_to_out3, multiply_all_3D_positions_by_a_4x4_matrix_to_out4, multiply_all_3D_vectors_by_a_3x3_matrix_in_place, multiply_all_3D_vectors_by_a_3x3_matrix_to_out, multiply_some_3D_directions_by_a_4x4_matrix_in_place, multiply_some_3D_directions_by_a_4x4_matrix_to_out3, multiply_some_3D_directions_by_a_4x4_matrix_to_out4, multiply_some_3D_positions_by_a_4x4_matrix_in_place, multiply_some_3D_positions_by_a_4x4_matrix_to_out3, multiply_some_3D_positions_by_a_4x4_matrix_to_out4, multiply_some_3D_vectors_by_a_3x3_matrix_in_place, multiply_some_3D_vectors_by_a_3x3_matrix_to_out, normalize_all_3D_directions_in_place, normalize_some_3D_directions_in_place } from "../math/vec3.js";
import { multiply_all_4D_vectors_by_a_4x4_matrix_in_place, multiply_all_4D_vectors_by_a_4x4_matrix_to_out, multiply_some_4D_vectors_by_a_4x4_matrix_in_place, multiply_some_4D_vectors_by_a_4x4_matrix_to_out, normalize_all_4D_directions_in_place, normalize_some_4D_directions_in_place } from "../math/vec4.js";
export class VectorBuffer extends Buffer {
    constructor(Vector) {
        super();
        this.Vector = Vector;
    }
    init(length, array, arrays) {
        super.init(length, array, arrays);
        this._post_init();
        return this;
    }
    _post_init() {
        this.current = new this.Vector(this.arrays[0]);
    }
    *[Symbol.iterator]() {
        for (const array of this.arrays) {
            this.current.array = array;
            yield this.current;
        }
    }
    setFrom(other) {
        this.array.set(other.array);
        return this;
    }
    _randomize() {
        for (let i = 0; i < this.array.length; i++)
            this.array[i] = Math.random();
    }
}
export class VectorBuffer2D extends VectorBuffer {
    _getAllocator() { return VECTOR_2D_ALLOCATOR; }
}
export class VectorBuffer3D extends VectorBuffer {
    _getAllocator() { return VECTOR_3D_ALLOCATOR; }
}
export class VectorBuffer4D extends VectorBuffer {
    _getAllocator() { return VECTOR_4D_ALLOCATOR; }
}
export class UVs2D extends VectorBuffer2D {
    constructor() { super(UV2D); }
}
export class UVs3D extends VectorBuffer3D {
    constructor() { super(UV3D); }
}
export class Colors3D extends VectorBuffer3D {
    constructor() { super(Color3D); }
}
export class Colors4D extends VectorBuffer4D {
    constructor() { super(Color4D); }
}
export class Directions2D extends VectorBuffer2D {
    constructor() { super(Direction2D); }
    normalize(include, start = 0, end = this.arrays.length) {
        if (include)
            normalize_some_2D_directions_in_place(this.arrays, include, start, end);
        else
            normalize_all_2D_directions_in_place(this.arrays, start, end);
        return this;
    }
    mul(matrix, out, include, start = 0, end = this.arrays.length) {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        return out;
    }
    imul(matrix, include, start = 0, end = this.arrays.length) {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, include, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, start, end);
        return this;
    }
}
export class Directions3D extends VectorBuffer3D {
    constructor() { super(Direction3D); }
    normalize(include, start = 0, end = this.arrays.length) {
        if (include)
            normalize_some_3D_directions_in_place(this.arrays, include, start, end);
        else
            normalize_all_3D_directions_in_place(this.arrays, start, end);
        return this;
    }
    mul(matrix, out, include, start = 0, end = this.arrays.length) {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        }
        else {
            if (out.allocator.dim === 3) {
                if (include)
                    multiply_some_3D_directions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_directions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, out.arrays, start, end);
            }
            else {
                if (include)
                    multiply_some_3D_directions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_directions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, out.arrays, start, end);
            }
        }
        return out;
    }
    imul(matrix, include, start = 0, end = this.arrays.length) {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, start, end);
        }
        else {
            if (include)
                multiply_some_3D_directions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_directions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);
        }
        return this;
    }
}
export class Directions4D extends VectorBuffer4D {
    constructor() { super(Direction4D); }
    normalize(include, start = 0, end = this.arrays.length) {
        if (include)
            normalize_some_4D_directions_in_place(this.arrays, include, start, end);
        else
            normalize_all_4D_directions_in_place(this.arrays, start, end);
        return this;
    }
    mul(matrix, out, include, start = 0, end = this.arrays.length) {
        if (include)
            multiply_some_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        return out;
    }
    imul(matrix, include, start = 0, end = this.arrays.length) {
        if (include)
            multiply_some_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
        else
            multiply_all_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);
        return this;
    }
}
export class Positions2D extends VectorBuffer2D {
    constructor() { super(Position2D); }
    mul(matrix, out, include, start = 0, end = this.arrays.length) {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        return out;
    }
    imul(matrix, include, start = 0, end = this.arrays.length) {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, include, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, start, end);
        return this;
    }
}
export class Positions3D extends VectorBuffer3D {
    constructor() { super(Position3D); }
    mul(matrix, out, include, start = 0, end = this.arrays.length) {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        }
        else {
            if (out.allocator.dim === 3) {
                if (include)
                    multiply_some_3D_positions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_positions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, out.arrays, start, end);
            }
            else {
                if (include)
                    multiply_some_3D_positions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_positions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, out.arrays, start, end);
            }
        }
        return out;
    }
    imul(matrix, include, start = 0, end = this.arrays.length) {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, start, end);
        }
        else {
            if (include)
                multiply_some_3D_positions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_positions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);
        }
        return this;
    }
}
export class Positions4D extends VectorBuffer4D {
    constructor() { super(Position4D); }
    _post_init() {
        super._post_init();
        this.arrays[3].fill(1);
    }
    mul(matrix, out, include, start = 0, end = this.arrays.length) {
        if (include)
            multiply_some_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        return out;
    }
    imul(matrix, include, start = 0, end = this.arrays.length) {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, start, end);
        }
        else {
            if (include)
                multiply_some_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);
        }
        return this;
    }
}
//# sourceMappingURL=vectors.js.map