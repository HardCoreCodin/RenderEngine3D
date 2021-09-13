import Node3D from "./base.js";
import { DEGREES_TO_RADIANS_FACTOR, MAX_FOV, MIN_FOV, MIN_ZOOM, MIN_FOCAL_LENGTH, NAVIGATION_DEFAULT__TARGET_DISTANCE, RADIANS_TO_DEGREES_FACTOR, NAVIGATION_DEFAULT__ZOOM, NAVIGATION_DEFAULT__FOCAL_LENGTH } from "../core/constants.js";
import { pos3, Position3D } from "../accessors/position.js";
import { dir3, Direction3D } from "../accessors/direction.js";
const target_position = pos3();
const movement = dir3();
export default class Camera extends Node3D {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.moved = false;
        this.turned = false;
        this.target_distance = NAVIGATION_DEFAULT__TARGET_DISTANCE;
        this.dolly_amount = 0;
        this.is_perspective = true;
        this.lense = new Lense();
        this.velocity = new Direction3D().setAllTo(0);
        scene.cameras.add(this);
        this.position = new Position3D(this.transform.translation.array);
        this.right = new Direction3D(this.transform.matrix.x_axis.array);
        this.up = new Direction3D(this.transform.matrix.y_axis.array);
        this.forward = new Direction3D(this.transform.matrix.z_axis.array);
        this.rotation = this.transform.rotation;
    }
    setFrom(other) {
        this.lense.setFrom(other.lense);
        this.transform.setFrom(other.transform);
    }
    dolly(dolly) {
        this.position.add(this.forward.mul(this.target_distance, movement), target_position);
        // Compute new target distance:
        this.dolly_amount += dolly;
        this.target_distance = Math.pow(2, this.dolly_amount / 200) * NAVIGATION_DEFAULT__TARGET_DISTANCE;
        // Back-track from target position to new current position:
        target_position.sub(this.forward.mul(this.target_distance, movement), this.position);
        this.moved = true;
    }
    orbit(azimuth, altitude) {
        // Move the camera forward to the position of it's target:
        this.position.add(this.forward.mul(this.target_distance, movement), target_position);
        // Reorient the camera while it is at the position of it's target:
        this.rotation.xy = {
            x: this.rotation.x + altitude,
            y: this.rotation.y + azimuth
        };
        // Back the camera away from it's target position using the updated forward direction:
        target_position.sub(this.forward.mul(this.target_distance, movement), this.position);
        this.turned = true;
        this.moved = true;
    }
    orient(yaw, pitch) {
        this.rotation.xy = { x: pitch, y: yaw };
        this.turned = true;
    }
    pan(right, up) {
        this.position.iadd(this.up.mul(up, movement)).iadd(this.right.mul(right, movement));
        this.moved = true;
    }
    navigate(controller, delta_time) {
        const target_velocity = movement.setAllTo(0);
        if (controller.move.right)
            target_velocity.x += controller.settings.max_velocity;
        if (controller.move.left)
            target_velocity.x -= controller.settings.max_velocity;
        if (controller.move.up)
            target_velocity.y += controller.settings.max_velocity;
        if (controller.move.down)
            target_velocity.y -= controller.settings.max_velocity;
        if (controller.move.forward)
            target_velocity.z += controller.settings.max_velocity;
        if (controller.move.backward)
            target_velocity.z -= controller.settings.max_velocity;
        if (controller.turn.left) {
            this.rotation.y += delta_time * controller.settings.speeds.turn;
            this.turned = true;
        }
        if (controller.turn.right) {
            this.rotation.y -= delta_time * controller.settings.speeds.turn;
            this.turned = true;
        }
        // Update the current velocity:
        const velocity_difference = controller.settings.acceleration * delta_time;
        this.velocity.approach(target_velocity, velocity_difference);
        this.moved = this.velocity.isNonZero();
        if (this.moved) { // Update the current position:
            this.velocity.mul(delta_time, movement).imatmul(this.transform.matrix);
            this.position.iadd(movement);
        }
    }
}
export class Lense {
    constructor() {
        this._zoom_amount = NAVIGATION_DEFAULT__ZOOM;
        this._focal_length = NAVIGATION_DEFAULT__FOCAL_LENGTH;
        this.zoomed = false;
    }
    setFrom(other) {
        this.zoom_amount = other.zoom_amount;
        this.focal_length = other.focal_length;
    }
    zoom(amount) {
        const new_zoom = this.zoom_amount + amount;
        this.focal_length = new_zoom > 1 ? new_zoom : (new_zoom < -1 ? (-1 / new_zoom) : 1);
        this.zoom_amount = new_zoom;
        this.zoomed = true;
    }
    get zoom_amount() { return this._zoom_amount; }
    set zoom_amount(zoom_amount) {
        if (zoom_amount === this._zoom_amount)
            return;
        if (zoom_amount < MIN_ZOOM)
            zoom_amount = MIN_ZOOM;
        this._zoom_amount = zoom_amount;
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