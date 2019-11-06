import { trans } from "./transform.js";
import { Position3D } from "../math/vec3.js";
import { defaultVector4DAllocator, pos4D } from "../math/vec4.js";
import { defaultMatrix4x4Allocator } from "../math/mat4x4.js";
import { defaultMatrix3x3Allocator } from "../math/mat3x3.js";
export default class Camera {
    constructor(transform, 
    // Position in space (0, 0, 0, 1) with perspective projection applied to it
    projected_position, 
    // Location in world space
    position = new Position3D([
        transform.translation.xs,
        transform.translation.ys,
        transform.translation.zs
    ], transform.translation.id), options = new CameraOptions()) {
        this.transform = transform;
        this.projected_position = projected_position;
        this.position = position;
        this.options = options;
    }
    // Matrix that converts from view space to clip space
    getProjectionMatrix(projection_matrix) {
        projection_matrix.setTo(this.options.perspective_factor, 0, 0, 0, 0, this.options.perspective_factor * this.options.aspect_ratio, 0, 0, 0, 0, this.options.far / this.options.depth_span, 1, 0, 0, (-this.options.far * this.options.near) / this.options.depth_span, 0);
        this.projected_position.w = 1;
        this.projected_position.z = 0;
        this.projected_position.mul(projection_matrix);
        return projection_matrix;
    }
}
export class CameraOptions {
    constructor(screen_width = 1024, screen_height = 1024, near = 1, far = 1000, fov = 90) {
        this.projection_parameters_changed = false;
        this.depth_span_changed = false;
        this.aspect_ratio_changed = false;
        this.perspective_factor_changed = false;
        this.screen_width_changed = false;
        this.screen_height_changed = false;
        this.far_changed = false;
        this.near_changed = false;
        this._screen_width = 0;
        this._screen_height = 0;
        this._near = 0;
        this._far = 0;
        this._fov = 0;
        this._new_aspect_ratio = 0;
        this._new_depth_span = 0;
        this.update(screen_width, screen_height, near, far, fov);
    }
    get fov() { return this._fov; }
    get far() { return this._far; }
    get near() { return this._near; }
    get screen_width() { return this._screen_width; }
    get screen_height() { return this._screen_height; }
    update(screen_width = this._screen_width, screen_height = this._screen_height, near = this._near, far = this._far, fov = this._fov) {
        this.projection_parameters_changed = false;
        this.setClippingPlaneDistances(near, far);
        this.setScreenDimensions(screen_width, screen_height);
        this.setFieldOfView(fov);
    }
    setFieldOfView(fov) {
        if (fov === this._fov) {
            this.perspective_factor_changed = false;
        }
        else {
            this._fov = fov;
            this.perspective_factor_changed = true;
            this.projection_parameters_changed = true;
            this.perspective_factor = 1.0 / Math.tan(fov * 0.5 / 180.0 * Math.PI);
        }
    }
    setScreenDimensions(screen_width, screen_height) {
        if (screen_width === this._screen_width && screen_height === this._screen_height) {
            this.screen_width_changed = false;
            this.screen_height_changed = false;
        }
        else {
            this.screen_width_changed = screen_width !== this._screen_width;
            this.screen_height_changed = screen_height !== this._screen_height;
            this._screen_width = screen_width;
            this._screen_height = screen_height;
            this._new_aspect_ratio = screen_width / screen_height;
            if (this._new_aspect_ratio === this.aspect_ratio) {
                this.aspect_ratio_changed = false;
            }
            else {
                this.aspect_ratio_changed = true;
                this.projection_parameters_changed = true;
                this.aspect_ratio = this._new_aspect_ratio;
            }
        }
    }
    setClippingPlaneDistances(near, far) {
        if (near === this._near && far === this._far) {
            this.near_changed = false;
            this.far_changed = false;
        }
        else {
            this.near_changed = near !== this._near;
            this.far_changed = far !== this._far;
            this._near = near;
            this._far = far;
            this._new_depth_span = far - near;
            if (this._new_depth_span === this.depth_span) {
                this.depth_span_changed = false;
            }
            else {
                this.depth_span_changed = true;
                this.projection_parameters_changed = true;
                this.depth_span = this._new_depth_span;
            }
        }
    }
}
export const cam = (matrix4x4_allocator = defaultMatrix4x4Allocator, matrix3x3_allocator = defaultMatrix3x3Allocator, positions_allocator = defaultVector4DAllocator) => new Camera(trans(matrix4x4_allocator, matrix3x3_allocator), pos4D(positions_allocator));
//# sourceMappingURL=camera.js.map