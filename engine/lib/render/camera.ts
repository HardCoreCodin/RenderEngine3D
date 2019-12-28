import Viewport from "./viewport.js";
import Scene from "../scene_graph/scene.js";
import Node3D from "../scene_graph/node.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {Position3D, Position4D} from "../accessors/position.js";
import {DEGREES_TO_RADIANS_FACTOR} from "../../constants.js";
import {ICamera, IFrustom} from "../_interfaces/render.js";


export default class Camera
    extends Node3D
    implements ICamera
{
    viewport: Viewport;

    constructor(
        readonly scene: Scene,
        readonly frustum: Frustom = new Frustom(),

        // Position in space (0, 0, 0, 1) with perspective projection applied to it
        readonly projected_position = new Position4D(),
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

    updateProjectionMatrix(): void {
        // Update the matrix that converts from view space to clip space:
        this.scale.x = this.frustum.fov_factor;
        this.scale.y = this.frustum.fov_factor * this.viewport.aspect_ratio;
        this.scale.z = this.frustum.depth_factor;
        this.translation.z = this.frustum.depth_factor * -this.frustum.near;

        // Update the projected position:
        this.projected_position.w = 1;
        this.projected_position.z = 0;
        this.projected_position.imatmul(this.projection_matrix);
    }
}

export class Frustom
    implements IFrustom
{
    depth_factor: number;
    fov_factor: number;
    has_changed: boolean = false;

    constructor(
        private near_clipping_plane_distance: number = 0.1,
        private far_clipping_plane_distance: number = 1000,
        private field_of_view_in_degrees: number = 90,
        private field_of_view_in_radians: number = field_of_view_in_degrees * DEGREES_TO_RADIANS_FACTOR
    ) {
    }

    get fov(): number {
        return this.field_of_view_in_degrees;
    }

    set fov(degrees: number) {
        if (degrees === this.field_of_view_in_degrees)
            return;

        this.field_of_view_in_degrees = degrees;
        this.field_of_view_in_radians = degrees * DEGREES_TO_RADIANS_FACTOR;
        this.fov_factor = 1.0 / Math.tan(0.5 * this.field_of_view_in_radians);
        this.has_changed = true;
    }

    get far(): number {
        return this.far_clipping_plane_distance
    }

    set far(far: number) {
        if (far === this.far_clipping_plane_distance)
            return;

        this.far_clipping_plane_distance = far;
        this.depth_factor = far / (far - this.near_clipping_plane_distance);
        this.has_changed = true;
    }

    get near(): number {
        return this.near_clipping_plane_distance
    }

    set near(near: number) {
        if (near === this.near_clipping_plane_distance)
            return;

        this.near_clipping_plane_distance = near;
        this.depth_factor = this.far_clipping_plane_distance / (this.far_clipping_plane_distance - near);
        this.has_changed = true;
    }
}