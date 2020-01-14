import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {IVector2D, IVector3D} from "../_interfaces/vectors.js";
import {IEulerRotation, IScale, ITransform} from "../_interfaces/transform.js";
import {DEGREES_TO_RADIANS_FACTOR} from "../../constants.js";


export default class Transform implements ITransform {
    constructor(
        readonly matrix: Matrix4x4 = new Matrix4x4(),
        readonly translation = matrix.translation,
        readonly rotation = new EulerRotation(matrix.mat3),
        readonly scale = new Scale(matrix.mat3)
    ) {
        matrix.setToIdentity();
    }
}

export class EulerRotation implements IEulerRotation {
    computeEagerly = true;

    constructor(
        // Overall rotation matrix:
        protected readonly _matrix: Matrix3x3 = new Matrix3x3(),
        protected readonly _rotation_matrix: Matrix3x3 = new Matrix3x3(),

        protected _x_angle: number = 0,
        protected _y_angle: number = 0,
        protected _z_angle: number = 0,

        public angles_in_degrees = true
    ) {
        _rotation_matrix.setToIdentity();
    }

    get x(): number {return this._x_angle}
    get y(): number {return this._y_angle}
    get z(): number {return this._z_angle}

    set x(x: number) {
        this._x_angle = x;
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set y(y: number) {
        this._y_angle = y;
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set z(z: number) {
        this._z_angle = z;
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set xy(xy: IVector2D) {
        this._x_angle = xy.x;
        this._y_angle = xy.y;
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set xz(xz: IVector3D) {
        this._x_angle = xz.x;
        this._z_angle = xz.z;
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set yz(yz: IVector3D) {
        this._y_angle = yz.y;
        this._z_angle = yz.z;
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set xyz(xyz: IVector3D) {
        this._x_angle = xyz.x;
        this._y_angle = xyz.y;
        this._z_angle = xyz.z;
        if (this.computeEagerly)
            this.computeMatrix();
    }

    computeMatrix(): void {
        this._rotation_matrix.transpose();
        this._matrix.mul(this._rotation_matrix);

        if (this.angles_in_degrees) {
            this._rotation_matrix.setRotationAroundZ(this._z_angle*DEGREES_TO_RADIANS_FACTOR, true); // Roll
            this._rotation_matrix.rotateAroundX(this._x_angle*DEGREES_TO_RADIANS_FACTOR); // Pitch
            this._rotation_matrix.rotateAroundY(this._y_angle*DEGREES_TO_RADIANS_FACTOR); // Yaw
        } else {
            this._rotation_matrix.setRotationAroundZ(this._z_angle, true); // Roll
            this._rotation_matrix.rotateAroundX(this._x_angle); // Pitch
            this._rotation_matrix.rotateAroundY(this._y_angle); // Yaw
        }

        this._matrix.mul(this._rotation_matrix);
    }
}

export class Scale implements IScale {
    applyEagerly = true;

    constructor(
        protected readonly _matrix: Matrix3x3 = new Matrix3x3(),
        protected _prior_x_scale: number = 0,
        protected _prior_y_scale: number = 0,
        protected _prior_z_scale: number = 0,

        protected _x_scale: number = 0,
        protected _y_scale: number = 0,
        protected _z_scale: number = 0
    ) {}

    get x(): number {return this._x_scale}
    get y(): number {return this._y_scale}
    get z(): number {return this._z_scale}

    set x(x: number) {
        this._x_scale = x;
        if (this.applyEagerly)
            this.apply();
    }

    set y(y: number) {
        this._y_scale = y;
        if (this.applyEagerly)
            this.apply();
    }

    set z(z: number) {
        this._z_scale = z;
        if (this.applyEagerly)
            this.apply();
    }

    set xy(xy: IVector2D) {
        this._x_scale= xy.x;
        this._y_scale = xy.y;
        if (this.applyEagerly)
            this.apply();
    }

    set xz(xz: IVector3D) {
        this._x_scale = xz.x;
        this._z_scale = xz.z;
        if (this.applyEagerly)
            this.apply();
    }

    set yz(yz: IVector3D) {
        this._y_scale = yz.y;
        this._z_scale = yz.z;
        if (this.applyEagerly)
            this.apply();
    }

    set xyz(xyz: IVector3D) {
        this._x_scale = xyz.x;
        this._y_scale = xyz.y;
        this._z_scale = xyz.z;
        if (this.applyEagerly)
            this.apply();
    }

    apply(): void {
        if (this._x_scale &&
            this._x_scale !== 1 &&
            this._x_scale !== this._prior_x_scale
        ) this._matrix.x_axis.mul(
            this._prior_x_scale && this._prior_x_scale !== 1 ?
                this._x_scale / this._prior_x_scale :
                this._x_scale
        );

        if (this._y_scale &&
            this._y_scale !== 1 &&
            this._y_scale !== this._prior_y_scale
        ) this._matrix.y_axis.mul(
            this._prior_y_scale && this._prior_y_scale !== 1 ?
                this._y_scale / this._prior_y_scale :
                this._y_scale
        );

        if (this._z_scale &&
            this._z_scale !== 1 &&
            this._z_scale !== this._prior_z_scale
        ) this._matrix.z_axis.mul(
            this._prior_z_scale && this._prior_z_scale !== 1 ?
                this._z_scale / this._prior_z_scale :
                this._z_scale
        );

        this._prior_x_scale = this._x_scale;
        this._prior_y_scale = this._y_scale;
        this._prior_z_scale = this._z_scale;
    }
}