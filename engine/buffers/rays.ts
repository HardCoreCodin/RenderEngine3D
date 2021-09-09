import {Position3D} from "../accessors/position.js";
import {Direction3D} from "../accessors/direction.js";


export class RayHit {
    distance_squared: number;

    constructor(
        readonly position: Position3D = new Position3D(),
        readonly surface_normal: Direction3D = new Direction3D()
    ) {}
}

export class Ray {
    constructor(
        public origin: Position3D = new Position3D(),
        public direction: Direction3D = new Direction3D(),
        public closest_hit: RayHit = new RayHit(),
        public index = 0,
        public any_hit = false
    ) {}
}

