import Transform, {trans} from "./transform.js";
import {Position3D} from "../math/vec3.js";
import {defaultVector4DAllocator, pos4D, Position4D} from "../math/vec4.js";
import {defaultMatrix4x4Allocator, Matrix4x4} from "../math/mat4x4.js";
import {Matrix3x3Allocator, Matrix4x4Allocator, Vector4DAllocator} from "../allocators.js";
import {defaultMatrix3x3Allocator} from "../math/mat3x3.js";

export default class Camera {
    constructor(
        public readonly transform: Transform,

        // Position in space (0, 0, 0, 1) with perspective projection applied to it
        public readonly projected_position: Position4D,

        // Location in world space
        public readonly position = new Position3D([
            transform.translation.xs,
            transform.translation.ys,
            transform.translation.zs],
            transform.translation.id
        ),

        public options: CameraOptions = new CameraOptions()
    ) {}

    // Matrix that converts from view space to clip space
    getProjectionMatrix(projection_matrix: Matrix4x4) : Matrix4x4 {
        projection_matrix.setTo(
            this.options.perspective_factor, 0, 0, 0,
            0, this.options.perspective_factor * this.options.aspect_ratio, 0, 0,
            0, 0, this.options.far / this.options.depth_span, 1,
            0, 0,  (-this.options.far * this.options.near) / this.options.depth_span, 0
        );

        this.projected_position.w = 1;
        this.projected_position.z = 0;
        this.projected_position.mul(projection_matrix);

        return projection_matrix;
    }
}

export class CameraOptions {
    public perspective_factor: number;
    public depth_span: number;
    public aspect_ratio: number;

    public projection_parameters_changed : boolean = false;

    public depth_span_changed : boolean = false;
    public aspect_ratio_changed : boolean = false;
    public perspective_factor_changed : boolean = false;

    public screen_width_changed: boolean = false;
    public screen_height_changed: boolean = false;

    public far_changed: boolean = false;
    public near_changed: boolean = false;

    private _screen_width: number = 0;
    private _screen_height: number = 0;

    private _near: number = 0;
    private _far: number = 0;

    private _fov: number = 0;

    private _new_aspect_ratio: number = 0;
    private _new_depth_span: number = 0;

    constructor(
        screen_width: number = 1024,
        screen_height: number = 1024,

        near: number = 1,
        far: number = 1000,

        fov: number = 90
    ) {
        this.update(
            screen_width,
            screen_height,

            near,
            far,

            fov
        )
    }

    get fov() : number {return this._fov}
    get far() : number {return this._far}
    get near() : number {return this._near}
    get screen_width() : number {return this._screen_width}
    get screen_height() : number {return this._screen_height}

    update(
        screen_width: number = this._screen_width,
        screen_height: number = this._screen_height,

        near: number = this._near,
        far: number = this._far,

        fov: number = this._fov
    ) : void {
        this.projection_parameters_changed = false;
        this.setClippingPlaneDistances(near, far);
        this.setScreenDimensions(screen_width, screen_height);
        this.setFieldOfView(fov);
    }

    setFieldOfView(fov: number) : void {
        if (fov === this._fov) {
            this.perspective_factor_changed = false;
        } else {
            this._fov = fov;

            this.perspective_factor_changed = true;
            this.projection_parameters_changed = true;
            this.perspective_factor = 1.0 / Math.tan(fov * 0.5 / 180.0 * Math.PI);
        }
    }

    setScreenDimensions(screen_width: number, screen_height: number) : void {
        if (screen_width === this._screen_width && screen_height === this._screen_height) {
            this.screen_width_changed = false;
            this.screen_height_changed = false;
        } else {
            this.screen_width_changed = screen_width !== this._screen_width;
            this.screen_height_changed = screen_height !== this._screen_height;

            this._screen_width = screen_width;
            this._screen_height = screen_height;

            this._new_aspect_ratio = screen_width / screen_height;

            if (this._new_aspect_ratio === this.aspect_ratio) {
                this.aspect_ratio_changed = false;
            } else {
                this.aspect_ratio_changed = true;
                this.projection_parameters_changed = true;
                this.aspect_ratio = this._new_aspect_ratio;
            }
        }
    }

    setClippingPlaneDistances(near: number, far: number) : void {
        if (near === this._near && far === this._far) {
            this.near_changed = false;
            this.far_changed = false;
        } else {
            this.near_changed = near !== this._near;
            this.far_changed = far !== this._far;

            this._near = near;
            this._far = far;

            this._new_depth_span = far - near;

            if (this._new_depth_span === this.depth_span) {
                this.depth_span_changed = false;
            } else {
                this.depth_span_changed = true;
                this.projection_parameters_changed = true;
                this.depth_span = this._new_depth_span;
            }
        }
    }
}

export const cam = (
    matrix4x4_allocator: Matrix4x4Allocator = defaultMatrix4x4Allocator,
    matrix3x3_allocator: Matrix3x3Allocator = defaultMatrix3x3Allocator,
    positions_allocator: Vector4DAllocator = defaultVector4DAllocator
) : Camera => new Camera(trans(matrix4x4_allocator, matrix3x3_allocator), pos4D(positions_allocator));