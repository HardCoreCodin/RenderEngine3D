import {Position3D} from "../accessors/position.js";
import {Direction3D} from "../accessors/direction.js";
import {FLOAT32_ALLOCATOR} from "../memory/allocators.js";
import {multiply_all_3D_directions_by_a_4x4_matrix_to_out3} from "../math/vec3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {generateRayDirections} from "../render/raytrace/_core/ray_generation.js";

export class RayHit {
    constructor(
        readonly position: Position3D = new Position3D(),
        readonly surface_normal: Direction3D = new Direction3D()
    ) {}
}

export class Ray {
    constructor(
        public readonly origin: Position3D = new Position3D(),
        public readonly directions: Float32Array,
        public readonly closest_hit: RayHit = new RayHit(),
        public index = 0,
        public directions_offset = 0
    ) {}
}

export class Rays {
    constructor(
        max_count: number,
        public readonly origin: Position3D = new Position3D(),
        private readonly _directions: Float32Array = FLOAT32_ALLOCATOR.allocateBuffer(max_count)[0],
        private readonly _source_ray_directions: Float32Array = FLOAT32_ALLOCATOR.allocateBuffer(max_count)[0],
        public readonly current: Ray = new Ray(origin, _directions),
        private _count = max_count,
        private _length = max_count + max_count + max_count
    ) {}

    get count(): number {
        return this._count;
    }

    set count(count: number) {
        this._count = count;
        this._length = count + count + count;
    }

    generate(horizontal_count: number, vertical_count: number, focal_length: number) {
        this.count = horizontal_count * vertical_count;
        generateRayDirections(
            this._source_ray_directions,
            focal_length,
            horizontal_count,
            vertical_count
        );
    }

    rotate(matrix: Matrix4x4): void {
        multiply_all_3D_directions_by_a_4x4_matrix_to_out3(
            this._source_ray_directions,
            matrix.array,
            this._directions,
            0, this._length
        );
    }

    *[Symbol.iterator](): Generator<Ray> {
        let current_offset = 0;
        for (this.current.index = 0; this.current.index < this._count; this.current.index++) {
            this.current.directions_offset = current_offset;
            current_offset += 3;
            yield this.current;
        }
    }
}