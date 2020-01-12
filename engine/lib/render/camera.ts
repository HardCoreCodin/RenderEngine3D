import Node3D from "../scene_graph/node.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {IScene} from "../_interfaces/nodes.js";
import {ICamera} from "../_interfaces/render.js";
import {DEGREES_TO_RADIANS_FACTOR, RADIANS_TO_DEGREES_FACTOR} from "../../constants.js";


export default class Camera extends Node3D implements ICamera {
    readonly projection_matrix = new Matrix4x4();

    protected _is_perspective: boolean = true;
    protected _near_clipping_plane_distance: number = 0.0001;
    protected _far_clipping_plane_distance: number = 10000;
    protected _field_of_view_in_degrees: number = 90;
    protected _field_of_view_in_radians: number = 90 * DEGREES_TO_RADIANS_FACTOR;
    protected _depth_factor: number = 1 / (10000 - 0.0001);
    protected _focal_length: number = 1;
    protected _aspect_ratio: number = 1;
    protected _zoom: number = 1;

    constructor(readonly scene: IScene) {
        super(scene);
        scene.cameras.add(this);
    }

    updateProjectionMatrix(): void {
        // Update the matrix that converts from view space to clip space:
        // Update the matrix that converts from view space to clip space:
        if (this._is_perspective) {
            this.projection_matrix.x_axis.x = this.zoom * this.focal_length;
            this.projection_matrix.y_axis.y = this.zoom * this.focal_length * this.aspect_ratio;
            this.projection_matrix.m34 = 1;
            this.projection_matrix.m44 = 0;
        } else {
            this.projection_matrix.x_axis.x = this.zoom;
            this.projection_matrix.y_axis.y = this.zoom * this.aspect_ratio;
            this.projection_matrix.m34 = 0;
            this.projection_matrix.m44 = 1;
        }

        this.projection_matrix.z_axis.z      = this.depth_factor * this.far;
        this.projection_matrix.translation.z = this.depth_factor * this.far * -this.near;
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
        this._focal_length = 1.0 / Math.tan(this._field_of_view_in_radians / 2);
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
        this._field_of_view_in_radians = Math.atan(1.0 / focal_length) / 2;
        this._field_of_view_in_degrees = this._field_of_view_in_radians * RADIANS_TO_DEGREES_FACTOR;
        this.updateProjectionMatrix();
    }

    get depth_factor(): number {return this._depth_factor}
    private _setDepthFactor(near: number, far: number) {
        this._near_clipping_plane_distance = near;
        this._far_clipping_plane_distance = far;
        this._depth_factor = 1 / (far - near);
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