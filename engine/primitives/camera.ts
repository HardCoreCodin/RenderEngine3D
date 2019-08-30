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

    constructor(aspect: number = 1, fov: number = 90, near: number = 0.1, far: number = 1000) {
        this.position = this.transform.translation;
        this.right = this.transform.rotation.matrix.i;
        this.up = this.transform.rotation.matrix.j;
        this.forward = this.transform.rotation.matrix.k;

        this.targetZ = 1;
        this.setProjection(aspect, fov, near, far);
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

    setProjection(aspect: number = 1, fov: number = 90, near: number = 0.1, far: number = 1000) : Matrix {
        this.projection.buffer.fill(0);
        this.projection.buffer[0] = this.projection.buffer[5] = 1.0 / Math.tan(fov * 0.5 / 180 * Math.PI);
        this.projection.buffer[0] *= aspect;
        this.projection.buffer[10] = this.projection.buffer[14] = 1.0 / (far - near);
        this.projection.buffer[10] *= far;
        this.projection.buffer[14] *= -far * near;
        this.projection.buffer[11] = 1;

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