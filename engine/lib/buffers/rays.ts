import {Position3D} from "../accessors/position.js";
import {Direction3D} from "../accessors/direction.js";
import {Directions3D} from "./vectors.js";

export class Ray {
    closest_distance_squared: number;
    readonly origin: Position3D;
    readonly direction: Direction3D;

    constructor(protected _rays: Rays) {
        this.origin = _rays.origin;
        this.direction = _rays.directions.current;
    }
}

export default class Rays {
    current: Ray;

    readonly directions = new Directions3D();
    constructor(readonly origin: Position3D) {}

    init(length: number): this {
        this.directions.init(length);
        this.current = new Ray(this);

        return this;
    }

    *[Symbol.iterator](): Generator<Ray> {
        for (const array of this.directions.arrays) {
            this.current.direction.array = array;
            yield this.current;
        }
    }
}

export class RayHit {
    constructor(
        readonly position: Position3D,
        readonly surface_normal: Direction3D
    ) {}
}
