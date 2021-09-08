import Node3D from "./base.js";
import { DEFAULT_FOCAL_LENGTH, DEFAULT_ZOOM, DEGREES_TO_RADIANS_FACTOR, MAX_FOV, MIN_FOCAL_LENGTH, MIN_FOV, MIN_ZOOM, RADIANS_TO_DEGREES_FACTOR } from "../core/constants.js";
export default class Camera extends Node3D {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.is_perspective = true;
        this.lense = new Lense();
        scene.cameras.add(this);
    }
    setFrom(other) {
        this.lense.setFrom(other.lense);
        this.transform.setFrom(other.transform);
    }
}
export class Lense {
    constructor() {
        this._zoom = DEFAULT_ZOOM;
        this._focal_length = DEFAULT_FOCAL_LENGTH;
    }
    setFrom(other) {
        this.zoom = other.zoom;
        this.focal_length = other.focal_length;
    }
    get zoom() { return this._zoom; }
    set zoom(zoom) {
        if (zoom === this._zoom)
            return;
        if (zoom < MIN_ZOOM)
            zoom = MIN_ZOOM;
        this._zoom = zoom;
    }
    // angle_in_degrees
    get fov() { return (Math.atan(1.0 / this._focal_length) / 2) * RADIANS_TO_DEGREES_FACTOR; }
    set fov(angle_in_degrees) {
        if (angle_in_degrees > MAX_FOV)
            angle_in_degrees = MAX_FOV;
        if (angle_in_degrees < MIN_FOV)
            angle_in_degrees = MIN_FOV;
        this._focal_length = 1.0 / Math.tan(angle_in_degrees * DEGREES_TO_RADIANS_FACTOR / 2);
    }
    get focal_length() { return this._focal_length; }
    set focal_length(focal_length) {
        if (focal_length === this._focal_length)
            return;
        if (focal_length < MIN_FOCAL_LENGTH)
            focal_length = MIN_FOCAL_LENGTH;
        this._focal_length = focal_length;
    }
}
//# sourceMappingURL=camera.js.map