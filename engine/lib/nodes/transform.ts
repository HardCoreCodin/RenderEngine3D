import Matrix4x4 from "../accessors/matrix4x4.js";
import {I2D, I3D} from "../_interfaces/vectors.js";
import {IEulerRotation, IScale, ITransform} from "../_interfaces/transform.js";
import {mat3} from "../accessors/matrix3x3.js";


export default class Transform implements ITransform {
    constructor(
        readonly matrix: Matrix4x4 = new Matrix4x4(),
        readonly translation = matrix.translation,
        readonly rotation = new EulerRotation(matrix),
        readonly scale = new Scale(matrix)
    ) {
        matrix.setToIdentity();
    }

    setFrom(other: this): void {
        this.scale.setFrom(other.scale);
        this.rotation.setFrom(other.rotation);
        this.matrix.setFrom(other.matrix);
    }
}

export class EulerRotation implements IEulerRotation {
    protected _x_angle = 0;
    protected _y_angle = 0;
    protected _z_angle = 0;

    protected _rotation = mat3().setToIdentity();

    constructor(protected readonly _transform: Matrix4x4) {}

    setFrom(other: this): void {
        this._x_angle = other._x_angle;
        this._y_angle = other._y_angle;
        this._z_angle = other._z_angle;

        this._transform.setFrom(other._transform);
    }

    get x(): number {return this._x_angle}
    get y(): number {return this._y_angle}
    get z(): number {return this._z_angle}

    set x(x: number) {
        this._x_angle = x;
        this._updateTransform();
    }

    set y(y: number) {
        this._y_angle = y;
        this._updateTransform();
    }

    set z(z: number) {
        this._z_angle = z;
        this._updateTransform();
    }

    set xy(xy: I2D) {
        this._x_angle = xy.x;
        this._y_angle = xy.y;
        this._updateTransform();
    }

    set xz(xz: I3D) {
        this._x_angle = xz.x;
        this._z_angle = xz.z;
        this._updateTransform();
    }

    set yz(yz: I3D) {
        this._y_angle = yz.y;
        this._z_angle = yz.z;
        this._updateTransform();
    }

    set xyz(xyz: I3D) {
        this._x_angle = xyz.x;
        this._y_angle = xyz.y;
        this._z_angle = xyz.z;
        this._updateTransform();
    }

    protected _updateTransform(): void {
        this._rotation.transpose();
        this._transform.imul(this._rotation);

        this._rotation.setRotationAroundZ(this._z_angle, true); // Roll
        this._rotation.rotateAroundX(this._x_angle); // Pitch
        this._rotation.rotateAroundY(this._y_angle); // Yaw

        this._transform.imul(this._rotation);
    }
}

export class Scale implements IScale {
    constructor(
        protected readonly _matrix: Matrix4x4 = new Matrix4x4(),
        protected _prior_x_scale: number = 0,
        protected _prior_y_scale: number = 0,
        protected _prior_z_scale: number = 0,

        protected _x_scale: number = 0,
        protected _y_scale: number = 0,
        protected _z_scale: number = 0
    ) {}


    setFrom(other: this): void {
        this._prior_x_scale = other._prior_x_scale;
        this._prior_y_scale = other._prior_y_scale;
        this._prior_z_scale = other._prior_z_scale;

        this._x_scale = other._x_scale;
        this._y_scale = other._y_scale;
        this._z_scale = other._z_scale;

        this._matrix.setFrom(other._matrix);
    }

    get x(): number {return this._x_scale}
    get y(): number {return this._y_scale}
    get z(): number {return this._z_scale}

    set x(x: number) {
        this._x_scale = x;
        this._updateTransform();
    }

    set y(y: number) {
        this._y_scale = y;
        this._updateTransform();
    }

    set z(z: number) {
        this._z_scale = z;
        this._updateTransform();
    }

    set xy(xy: I2D) {
        this._x_scale= xy.x;
        this._y_scale = xy.y;
        this._updateTransform();
    }

    set xz(xz: I3D) {
        this._x_scale = xz.x;
        this._z_scale = xz.z;
        this._updateTransform();
    }

    set yz(yz: I3D) {
        this._y_scale = yz.y;
        this._z_scale = yz.z;
        this._updateTransform();
    }

    set xyz(xyz: I3D) {
        this._x_scale = xyz.x;
        this._y_scale = xyz.y;
        this._z_scale = xyz.z;
        this._updateTransform();
    }

    protected _updateTransform(): void {
        if (this._x_scale &&
            this._x_scale !== 1 &&
            this._x_scale !== this._prior_x_scale
        ) this._matrix.x_axis.imul(
            this._prior_x_scale && this._prior_x_scale !== 1 ?
                this._x_scale / this._prior_x_scale :
                this._x_scale
        );

        if (this._y_scale &&
            this._y_scale !== 1 &&
            this._y_scale !== this._prior_y_scale
        ) this._matrix.y_axis.imul(
            this._prior_y_scale && this._prior_y_scale !== 1 ?
                this._y_scale / this._prior_y_scale :
                this._y_scale
        );

        if (this._z_scale &&
            this._z_scale !== 1 &&
            this._z_scale !== this._prior_z_scale
        ) this._matrix.z_axis.imul(
            this._prior_z_scale && this._prior_z_scale !== 1 ?
                this._z_scale / this._prior_z_scale :
                this._z_scale
        );

        this._prior_x_scale = this._x_scale;
        this._prior_y_scale = this._y_scale;
        this._prior_z_scale = this._z_scale;
    }
}