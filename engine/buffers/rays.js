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
export class ProjectionPlane {
    constructor(viewport, start = new Position3D(), right = new Direction3D(), down = new Direction3D(), forward = new Direction3D()) {
        this.viewport = viewport;
        this.start = start;
        this.right = right;
        this.down = down;
        this.forward = forward;
        this.reset();
    }
    reset() {
        let camera = this.viewport.controller.camera;
        camera.transform.matrix.x_axis.mul(1 - this.viewport.width, this.right);
        camera.transform.matrix.y_axis.mul(this.viewport.height - 2, this.down);
        camera.transform.matrix.z_axis.mul(this.viewport.width * camera.lense.focal_length, this.forward);
        camera.transform.translation.add(this.forward, this.start);
        this.start.iadd(this.right);
        this.start.iadd(this.down);
        camera.transform.matrix.x_axis.mul(2, this.right);
        camera.transform.matrix.y_axis.mul(-2, this.down);
    }
}
//# sourceMappingURL=rays.js.map