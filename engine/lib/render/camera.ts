import Scene from "../scene_graph/scene.js";
import Node3D from "../scene_graph/node.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {Position3D} from "../accessors/position.js";
import {DEGREES_TO_RADIANS_FACTOR, RADIANS_TO_DEGREES_FACTOR} from "../../constants.js";
import {ICamera} from "../_interfaces/render.js";


export default class Camera extends Node3D implements ICamera {
    readonly projection_matrix = new Matrix4x4();

    private readonly _scale: Position3D;
    private _is_perspective: boolean = true;
    private _near_clipping_plane_distance: number = 0.1;
    private _far_clipping_plane_distance: number = 1000;
    private _field_of_view_in_degrees: number = 90;
    private _field_of_view_in_radians: number = 90 * DEGREES_TO_RADIANS_FACTOR;
    private _depth_factor: number = 1;
    private _focal_length: number = 1;
    private _aspect_ratio: number = 1;
    private _zoom: number = 1;

    constructor(readonly scene: Scene) {
        super(scene);

        this._scale = new Position3D(
            this.projection_matrix.id,
            [
                this.projection_matrix.x_axis.arrays[0],
                this.projection_matrix.y_axis.arrays[1],
                this.projection_matrix.z_axis.arrays[2],
            ]
        );
    }

    updateProjectionMatrix(): void {
        // Update the matrix that converts from view space to clip space:
        this.projection_matrix.setToIdentity();

        if (this._is_perspective) {
            this._scale.x = this._zoom * this._focal_length;
            this._scale.y = this._zoom * this._focal_length * this._aspect_ratio;
            this.projection_matrix.m34 = 1;
        } else {
            this._scale.x = this._zoom;
            this._scale.y = this._zoom * this._aspect_ratio;
        }

        this._scale.z = this._depth_factor;
        this.projection_matrix.translation.z = this._depth_factor * -this._near_clipping_plane_distance;
    }

    get is_perspective(): boolean {return this._is_perspective}
    set is_perspective(is_perspective: boolean) {
        this._is_perspective = is_perspective;
        this.updateProjectionMatrix();
    }

    get zoom(): number {return this._zoom}
    set zoom(zoom: number) {
        if (zoom !== this._zoom) {
            this._zoom = zoom;
            this.updateProjectionMatrix();
        }
    }

    get fov(): number {return this._field_of_view_in_degrees}
    set fov(degrees: number) {
        if (degrees === this._field_of_view_in_degrees)
            return;

        this._field_of_view_in_degrees = degrees;
        this._field_of_view_in_radians = degrees * DEGREES_TO_RADIANS_FACTOR;
        this._focal_length = 1.0 / Math.tan(this._field_of_view_in_radians >> 1);
        this.updateProjectionMatrix();
    }

    get far(): number {return this._far_clipping_plane_distance}
    set far(far: number) {
        if (far !== this._far_clipping_plane_distance)
            this._setDepthFactor(this._near_clipping_plane_distance, far);
    }

    get near(): number {return this._near_clipping_plane_distance}
    set near(near: number) {
        if (near !== this._near_clipping_plane_distance)
            this._setDepthFactor(near, this._far_clipping_plane_distance);
    }

    get focal_length(): number {return this._focal_length}
    set focal_length(focal_length: number) {
        if (focal_length === this._focal_length)
            return;

        this._focal_length = focal_length;
        this._field_of_view_in_radians = Math.atan(1.0 / focal_length) >> 1;
        this._field_of_view_in_degrees = this._field_of_view_in_radians * RADIANS_TO_DEGREES_FACTOR;
        this.updateProjectionMatrix();
    }

    get depth_factor(): number {return this._depth_factor}
    private _setDepthFactor(near: number, far: number) {
        this._near_clipping_plane_distance = near;
        this._far_clipping_plane_distance = far;
        this._depth_factor = far / (far - near);
        this.updateProjectionMatrix();
    }

    get aspect_ratio(): number {return this._aspect_ratio}
    set aspect_ratio(aspect_ratio: number) {
        if (aspect_ratio === this._aspect_ratio)
            return;

        this._aspect_ratio = aspect_ratio;
        this.updateProjectionMatrix();
    }
}