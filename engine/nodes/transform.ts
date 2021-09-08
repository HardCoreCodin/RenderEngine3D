import Matrix4x4 from "../accessors/matrix4x4.js";
import {I2D, I3D} from "../core/interfaces/vectors.js";
import {IEulerRotation, IScale, ITransform} from "../core/interfaces/transform.js";
import {mat3} from "../accessors/matrix3x3.js";
import {dir3} from "../accessors/direction.js";


export default class Transform implements ITransform {
    private readonly _intermediary_matrix = mat3();
    private readonly _translation = dir3();
    readonly rotation: EulerRotation;
    readonly scale: Scale;

    constructor(
        readonly matrix: Matrix4x4 = new Matrix4x4().setToIdentity(),
        readonly translation = matrix.translation
    ) {
        this.scale = new Scale(this);
        this.rotation = new EulerRotation(this);
    }

    setFrom(other: this): void {
        this.scale.setFrom(other.scale, this);
        this.rotation.setFrom(other.rotation, this);
    }

    update() {
        this._translation.setFrom(this.translation);
        this.scale.matrix.mul(this.rotation.matrix, this._intermediary_matrix);

        this.matrix.setToIdentity();
        this.matrix.x_axis.setFrom(this._intermediary_matrix.x_axis);
        this.matrix.y_axis.setFrom(this._intermediary_matrix.y_axis);
        this.matrix.z_axis.setFrom(this._intermediary_matrix.z_axis);
        this.translation.setFrom(this._translation);
    }
}

export class EulerRotation implements IEulerRotation {
    protected _angles = dir3(0);
    public matrix = mat3().setToIdentity();

    constructor(protected _transform: Transform) {}

    setFrom(other: this, transform: Transform): void {
        this._angles.setFrom(other._angles);
        this._transform = transform;
        this._updateTransform();
    }

    get x(): number {return this._angles.x}
    get y(): number {return this._angles.y}
    get z(): number {return this._angles.z}

    set x(x: number) {
        this._angles.x = x;
        this._updateTransform();
    }

    set y(y: number) {
        this._angles.y = y;
        this._updateTransform();
    }

    set z(z: number) {
        this._angles.z = z;
        this._updateTransform();
    }

    set xy(xy: I2D) {
        this._angles.x = xy.x;
        this._angles.y = xy.y;
        this._updateTransform();
    }

    set xz(xz: I3D) {
        this._angles.x = xz.x;
        this._angles.z = xz.z;
        this._updateTransform();
    }

    set yz(yz: I3D) {
        this._angles.y = yz.y;
        this._angles.z = yz.z;
        this._updateTransform();
    }

    set xyz(xyz: I3D) {
        this._angles.x = xyz.x;
        this._angles.y = xyz.y;
        this._angles.z = xyz.z;
        this._updateTransform();
    }

    protected _updateTransform(): void {
        this.matrix.setRotationAroundZ(this._angles.z, true); // Roll
        this.matrix.rotateAroundX(this._angles.x); // Pitch
        this.matrix.rotateAroundY(this._angles.y); // Yaw
        this._transform.update();
    }
}

export class Scale implements IScale {
    public matrix = mat3().setToIdentity();

    constructor(
        protected _transform: Transform
    ) {}

    setFrom(other: this, transform: Transform): void {
        this.matrix.setFrom(other.matrix);
        this._transform = transform;
        this._transform.update();
    }

    get x(): number {return this.matrix.x_axis.x}
    get y(): number {return this.matrix.y_axis.y}
    get z(): number {return this.matrix.z_axis.z}

    set x(x: number) {
        this.matrix.x_axis.x = x;
        this._transform.update();
    }

    set y(y: number) {
        this.matrix.y_axis.y = y;
        this._transform.update();
    }

    set z(z: number) {
        this.matrix.z_axis.z = z;
        this._transform.update();
    }

    set xy(xy: I2D) {
        this.matrix.x_axis.x = xy.x;
        this.matrix.y_axis.y = xy.y;
        this._transform.update();
    }

    set xz(xz: I3D) {
        this.matrix.x_axis.x = xz.x;
        this.matrix.z_axis.z = xz.z;
        this._transform.update();
    }

    set yz(yz: I3D) {
        this.matrix.y_axis.y = yz.y;
        this.matrix.z_axis.z = yz.z;
        this._transform.update();
    }

    set xyz(xyz: I3D) {
        this.matrix.x_axis.x = xyz.x;
        this.matrix.y_axis.y = xyz.y;
        this.matrix.z_axis.z = xyz.z;
        this._transform.update();
    }
}