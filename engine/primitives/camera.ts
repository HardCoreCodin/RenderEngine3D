import Matrix4x4 from "../linalng/4D/matrix.js";
import Transform, {EulerRotation} from "./transform.js";
import Position4D from "../linalng/4D/position.js";
import Position3D from "../linalng/3D/position.js";
import Direction3D from "../linalng/3D/direction.js";
import Matrix3x3 from "../linalng/3D/matrix.js";

export default class Camera {
    // The forward-direction in camera-space, with projection-matrix applied to it
    public readonly projected_position = new Position4D();

    public readonly transform = new Transform();

    // Location in world space
    public readonly position = new Position3D(this.transform.translation.buffer.subarray(0, 3));
    private readonly right = this.transform.rotation.matrix.i; // The camera's right direction
    // private readonly look_up = this.transform.rotation.matrix.j; // The camera's up direction
    // public readonly look_direction = this.transform.rotation.matrix.k; // The camera's forward direction
    // private readonly movement_orientation = new EulerRotation(new Matrix3x3(this.right.buffer));
    // public readonly forward = this.movement_orientation.matrix.k; // The player's forward direction
    //
    // // Target position in world space
    // private readonly target = new Position3D();

    // Matrix that converts from view space to screen space
    public readonly projection: Matrix4x4 = new Matrix4x4().setToIdentity();

    constructor(
        public options: CameraOptions = new CameraOptions()
    ) {}

    public readonly forward = new Direction3D(); // The player's forward direction

    public setOrientationByAngles(yaw: number, pitch: number) : void {
        this.transform.rotation.setXY(pitch, yaw);
        this.forward.z = -this.right.z;
        this.forward.x = -this.right.x;


        // this.position.plus(
        //     this.look_direction
        //         .setTo(0, 0, 1) // Z-facing direction
        //         .mul(this.transform.rotation.matrix), // Orient
        //     this.target
        // );
        // this.position.to(
        //     this.target,
        //     this.forward
        // ).normalize();


        // this.position.plus(direction, this.target);
        // this.position.to(this.target, this.forward).normalize();
        //
        // this.up.y = this.forward.z;
        // this.up.x = -this.forward.x;
        // this.up.z = -this.forward.y;
        // this.up.cross(this.forward, this.right);
    }

    public setOrientationByDirection(direction: Direction3D) : void  {
        // TODO: Implement using quaternions...
    }

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