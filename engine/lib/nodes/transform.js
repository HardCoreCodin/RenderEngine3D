import Matrix4x4 from "../accessors/matrix4x4.js";
import { mat3 } from "../accessors/matrix3x3.js";
import { dir3 } from "../accessors/direction.js";
export default class Transform {
    constructor(matrix = new Matrix4x4().setToIdentity(), translation = matrix.translation) {
        this.matrix = matrix;
        this.translation = translation;
        this._intermediary_matrix = mat3();
        this._translation = dir3();
        this.scale = new Scale(this);
        this.rotation = new EulerRotation(this);
    }
    setFrom(other) {
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
export class EulerRotation {
    constructor(_transform) {
        this._transform = _transform;
        this._angles = dir3(0);
        this.matrix = mat3().setToIdentity();
    }
    setFrom(other, transform) {
        this._angles.setFrom(other._angles);
        this._transform = transform;
        this._updateTransform();
    }
    get x() { return this._angles.x; }
    get y() { return this._angles.y; }
    get z() { return this._angles.z; }
    set x(x) {
        this._angles.x = x;
        this._updateTransform();
    }
    set y(y) {
        this._angles.y = y;
        this._updateTransform();
    }
    set z(z) {
        this._angles.z = z;
        this._updateTransform();
    }
    set xy(xy) {
        this._angles.x = xy.x;
        this._angles.y = xy.y;
        this._updateTransform();
    }
    set xz(xz) {
        this._angles.x = xz.x;
        this._angles.z = xz.z;
        this._updateTransform();
    }
    set yz(yz) {
        this._angles.y = yz.y;
        this._angles.z = yz.z;
        this._updateTransform();
    }
    set xyz(xyz) {
        this._angles.x = xyz.x;
        this._angles.y = xyz.y;
        this._angles.z = xyz.z;
        this._updateTransform();
    }
    _updateTransform() {
        this.matrix.setRotationAroundZ(this._angles.z, true); // Roll
        this.matrix.rotateAroundX(this._angles.x); // Pitch
        this.matrix.rotateAroundY(this._angles.y); // Yaw
        this._transform.update();
    }
}
export class Scale {
    constructor(_transform) {
        this._transform = _transform;
        this.matrix = mat3().setToIdentity();
    }
    setFrom(other, transform) {
        this.matrix.setFrom(other.matrix);
        this._transform = transform;
        this._transform.update();
    }
    get x() { return this.matrix.x_axis.x; }
    get y() { return this.matrix.y_axis.y; }
    get z() { return this.matrix.z_axis.z; }
    set x(x) {
        this.matrix.x_axis.x = x;
        this._transform.update();
    }
    set y(y) {
        this.matrix.y_axis.y = y;
        this._transform.update();
    }
    set z(z) {
        this.matrix.z_axis.z = z;
        this._transform.update();
    }
    set xy(xy) {
        this.matrix.x_axis.x = xy.x;
        this.matrix.y_axis.y = xy.y;
        this._transform.update();
    }
    set xz(xz) {
        this.matrix.x_axis.x = xz.x;
        this.matrix.z_axis.z = xz.z;
        this._transform.update();
    }
    set yz(yz) {
        this.matrix.y_axis.y = yz.y;
        this.matrix.z_axis.z = yz.z;
        this._transform.update();
    }
    set xyz(xyz) {
        this.matrix.x_axis.x = xyz.x;
        this.matrix.y_axis.y = xyz.y;
        this.matrix.z_axis.z = xyz.z;
        this._transform.update();
    }
}
//# sourceMappingURL=transform.js.map