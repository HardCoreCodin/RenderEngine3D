import {IViewport} from "../core/interfaces/render.js";
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

export class ProjectionPlane {
    constructor(
        public readonly viewport : IViewport,
        public start: Position3D = new Position3D(),
        public right: Direction3D = new Direction3D(),
        public down: Direction3D = new Direction3D(),
        public forward: Direction3D = new Direction3D()
    ) {
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