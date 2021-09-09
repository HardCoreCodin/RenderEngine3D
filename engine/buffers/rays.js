import { Position3D } from "../accessors/position.js";
import { Direction3D } from "../accessors/direction.js";
export class RayHit {
    constructor(position = new Position3D(), surface_normal = new Direction3D()) {
        this.position = position;
        this.surface_normal = surface_normal;
    }
}
export class Ray {
    constructor(origin = new Position3D(), direction = new Direction3D(), closest_hit = new RayHit(), index = 0, any_hit = false) {
        this.origin = origin;
        this.direction = direction;
        this.closest_hit = closest_hit;
        this.index = index;
        this.any_hit = any_hit;
    }
}
//# sourceMappingURL=rays.js.map