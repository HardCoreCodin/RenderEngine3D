import Matrix4x4 from "../linalng/4D/matrix.js";
import Transform from "./transform.js";
import Position4D from "../linalng/4D/position.js";
import Position3D from "../linalng/3D/position.js";

export default class Camera {
    public readonly transform = new Transform();
    // Location in world space

    public readonly position = new Position3D(this.transform.translation.buffer.subarray(0, 3));

    // Position in space (0, 0, 0, 1) with perspective projection applied to it
    public readonly projected_position = new Position4D();

    // Matrix that converts from view space to clip space
    public readonly projection: Matrix4x4 = new Matrix4x4().setToIdentity();

    constructor(
        public options: CameraOptions = new CameraOptions()
    ) {}

    setProjection(
        screen_width: number = this.options.screen_width,
        screen_height: number = this.options.screen_height,
        fov: number = this.options.fov,
        near: number = this.options.near,
        far: number = this.options.far
    ) : Matrix4x4 {
        this.options.updateIfNeeded(
            screen_width,
            screen_height,
            fov,
            near,
            far
        );

        this.projection.setTo(
            this.options.perspective_factor, 0, 0, 0,
            0, this.options.perspective_factor * this.options.aspect_ratio, 0, 0,
            0, 0, far / this.options.depth_span, 1,
            0, 0,  (-far * near) / this.options.depth_span, 0
        );

        this.projected_position.w = 1;
        this.projected_position.z = 0;
        this.projected_position.mul(this.projection);

        return this.projection;
    }
}

export class CameraOptions {
    public perspective_factor: number;
    public depth_span: number;

    constructor(
        public screen_width: number = 1024,
        public screen_height: number = 1024,
        public near: number = 0.1,
        public far: number = 1000,
        public fov: number = 90,
        public aspect_ratio: number = 1
    ) {
        this.setDepthSpan(near, far);
        this.setAspectRatio(screen_width, screen_height);
        this.setPerspectiveFactor(fov);
    }

    updateIfNeeded(
        screen_width: number = this.screen_width,
        screen_height: number = this.screen_height,
        fov: number = this.fov,
        near: number = this.near,
        far: number = this.far
    ) : boolean {
        let updated = false;

        if (fov !== this.fov) {
            this.setPerspectiveFactor(fov);
            updated = true;
        }

        if (near !== this.near ||
            far !== this.far) {
            this.setDepthSpan(near, far);
            updated = true;
        }

        if (screen_width !== this.screen_width ||
            screen_height !== this.screen_height) {
            this.setAspectRatio(screen_width, screen_height);
            updated = true;
        }

        return updated;
    }

    setPerspectiveFactor(fov: number) : void {
        this.fov = fov;
        this.perspective_factor = 1.0 / Math.tan(fov * 0.5 / 180.0 * Math.PI);
    }

    setAspectRatio(screen_width: number, screen_height: number) : void {
        this.screen_height = screen_height;
        this.screen_width = screen_width;
        this.aspect_ratio = screen_width / screen_height;
    }

    setDepthSpan(near: number, far: number) : void {
        this.near = near;
        this.far = far;
        this.depth_span = far - near;
    }
}