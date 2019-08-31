import Matrix from "../linalng/matrix.js";
import Transform from "./transform.js";
import Direction from "../linalng/direction.js";
import Position from "../linalng/position.js";

export default class Camera {
    public readonly position: Position; // Location in world space
    public readonly forward: Direction; // The camera's forward direction
    private readonly up: Direction; // The camera's up direction
    private readonly right: Direction; // The camera's right direction

    public readonly transform: Transform = new Transform();

    // Matrix that converts from view space to screen space
    public readonly projection: Matrix = new Matrix().setToIdentity();

    // Target position in world space
    private readonly target: Position = new Position();

    private perspective_factor: number;
    private depth_span: number;

    constructor(
        private screen_width: number = 1024,
        private screen_height: number = 1024,
        private near: number = 0.1,
        private far: number = 1000,
        private fov: number = 90,
        private aspect_ratio: number = 1
    ) {
        this.position = this.transform.translation;
        this.right = this.transform.rotation.matrix.i;
        this.up = this.transform.rotation.matrix.j;
        this.forward = this.transform.rotation.matrix.k;

        this.targetZ = 1;

        this.setDepthSpan(near, far);
        this.setAspectRatio(screen_width, screen_height);
        this.setPerspectiveFactor(fov);
    }

    get targetX() : number {return this.target.x}
    get targetY() : number {return this.target.y}
    get targetZ() : number {return this.target.z}

    set targetX(x: number) {
        this.target.x = x;
        this.setOrientation();
    }

    set targetY(y: number) {
        this.target.y = y;
        this.setOrientation();
    }

    set targetZ(z: number) {
        this.target.z = z;
        this.setOrientation();
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

    setProjection(
        screen_width: number,
        screen_height: number,
        fov: number = this.fov,
        near: number = this.near,
        far: number = this.far
    ) : Matrix {
        if (fov !== this.fov)
            this.setPerspectiveFactor(fov);

        if (near !== this.near &&
            near !== this.far)
            this.setDepthSpan(near, far);

        if (screen_width !== this.screen_width ||
            screen_height !== this.screen_height)
            this.setAspectRatio(screen_width, screen_height);

        this.projection.setTo(
            this.perspective_factor, 0, 0, 0,
            0, this.perspective_factor * this.aspect_ratio, 0, 0,
            0, 0, far / this.depth_span, 1,
            0, 0,  (-far * near) / this.depth_span, 0
        );

        return this.projection;
    }

    private setOrientation() : Matrix {
        this.position.to(this.target, this.forward).normalize();
        this.up.y = this.forward.z;
        this.up.x = -this.forward.x;
        this.up.z = -this.forward.y;
        this.up.cross(this.forward, this.right);

        return this.transform.matrix;
    }

    // pointAt(target: Position) : void {
    //     this.position.to(target, this.forward).normalize();
    //
    //     const up = up_direction.minus(forward.times(forward.dot(up_direction))).normalize();
    //     const right = up.cross(forward);
    //     return mat4(right, up, forward, source);
    // }
}