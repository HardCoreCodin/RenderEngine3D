import {Position3D} from "../accessors/position.js";
import {Direction3D} from "../accessors/direction.js";

export class Ray {
    direction_offset = 0;
    closest_distance_squared = 1000;

    constructor(
        public readonly origin: Position3D,
        public readonly directions: Float32Array
    ) {}
}

export class RayHit {
    constructor(
        readonly position: Position3D,
        readonly surface_normal: Direction3D
    ) {}
}
