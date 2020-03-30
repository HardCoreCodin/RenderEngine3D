import Matrix4x4 from "../accessors/matrix4x4.js";
import {Position3D} from "../accessors/position.js";
import {Direction3D} from "../accessors/direction.js";
import {FLOAT32_ALLOCATOR} from "../memory/allocators.js";
import {multiply_all_3D_directions_by_a_4x4_matrix_to_out3} from "../math/vec3.js";
import {generateRayDirections} from "../render/raytrace/shaders/generation/ray_generation.js";

export class RayHit {
    distance_squared: number;

    constructor(
        readonly position: Position3D = new Position3D(),
        readonly surface_normal: Direction3D = new Direction3D()
    ) {}
}

export class Ray {
    constructor(
        public readonly origin: Position3D = new Position3D(),
        public readonly direction: Direction3D = new Direction3D(),
        public readonly closest_hit: RayHit = new RayHit(),
        public index = 0,
        public any_hit = false
    ) {}
}

export class Rays {
    constructor(
        max_count: number,
        public readonly origin: Position3D = new Position3D(),
        public readonly directions: Float32Array = FLOAT32_ALLOCATOR.allocateBuffer(max_count)[0],
        private readonly _source_ray_directions: Float32Array = FLOAT32_ALLOCATOR.allocateBuffer(max_count)[0],
        public readonly current: Ray = new Ray(origin),
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
            this.directions,
            0, this._length
        );
    }

    *[Symbol.iterator](): Generator<Ray> {
        let current_offset = 0;
        const ray = this.current;
        const ray_directions = this.directions;
        for (ray.index = 0; ray.index < this._count; ray.index++) {
            ray.closest_hit.distance_squared = 1000;
            ray.any_hit = false;

            ray.direction.array[0] = ray_directions[current_offset++];
            ray.direction.array[1] = ray_directions[current_offset++];
            ray.direction.array[2] = ray_directions[current_offset++];

            yield this.current;
        }
    }
}