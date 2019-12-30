import Viewport from "./viewport.js";
import Scene from "../scene_graph/scene.js";
import Node3D from "../scene_graph/node.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {Position3D} from "../accessors/position.js";
import {DEGREES_TO_RADIANS_FACTOR} from "../../constants.js";
import {ICamera, IFrustom} from "../_interfaces/render.js";

let x_factor: number;

export default class Camera extends Node3D implements ICamera {
    viewport: Viewport;

    constructor(
        readonly scene: Scene,
        readonly frustum: Frustom = new Frustom(),
        readonly projection_matrix = new Matrix4x4(),
        readonly translation = projection_matrix.translation,
        readonly scale = new Position3D(projection_matrix.id, [
            projection_matrix.x_axis.arrays[0],
            projection_matrix.y_axis.arrays[1],
            projection_matrix.z_axis.arrays[2],
        ])
    ) {
        super(scene);
        this.projection_matrix.m34 = 1;
    }

    updateProjectionMatrix(perspective: boolean = true, zoom: number = 1): void {
        // Update the matrix that converts from view space to clip space:
        x_factor = perspective ? this.frustum.focal_length * zoom : zoom;
        this.scale.x = x_factor;
        this.scale.y = x_factor * this.viewport.aspect_ratio;
        this.scale.z = this.frustum.depth_factor;
        this.translation.z = this.frustum.depth_factor * -this.frustum.near;
    }
}

export class Frustom
    implements IFrustom
{
    depth_factor: number;
    focal_length: number;
    has_changed: boolean = false;

    constructor(
        private _near_clipping_plane_distance: number = 0.1,
        private _far_clipping_plane_distance: number = 1000,
        private _field_of_view_in_degrees: number = 90,
        private _field_of_view_in_radians: number = _field_of_view_in_degrees * DEGREES_TO_RADIANS_FACTOR
    ) {
    }

    get fov(): number {
        return this._field_of_view_in_degrees;
    }

    set fov(degrees: number) {
        if (degrees === this._field_of_view_in_degrees)
            return;

        this._field_of_view_in_degrees = degrees;
        this._field_of_view_in_radians = degrees * DEGREES_TO_RADIANS_FACTOR;
        this.focal_length = 1.0 / Math.tan(this._field_of_view_in_radians >> 1);
        this.has_changed = true;
    }

    get far(): number {
        return this._far_clipping_plane_distance
    }

    set far(far: number) {
        if (far === this._far_clipping_plane_distance)
            return;

        this._far_clipping_plane_distance = far;
        this.depth_factor = far / (far - this._near_clipping_plane_distance);
        this.has_changed = true;
    }

    get near(): number {
        return this._near_clipping_plane_distance
    }

    set near(near: number) {
        if (near === this._near_clipping_plane_distance)
            return;

        this._near_clipping_plane_distance = near;
        this.depth_factor = this._far_clipping_plane_distance / (this._far_clipping_plane_distance - near);
        this.has_changed = true;
    }
}