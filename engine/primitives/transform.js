import { defaultMatrix3x3Allocator, mat3x3, Matrix3x3 } from "../math/mat3x3.js";
import { defaultMatrix4x4Allocator, mat4x4 } from "../math/mat4x4.js";
export class EulerRotation {
    constructor(
    // Overall rotation matrix:
    matrix, 
    // Rotation matrices for X, Y and Z:
    rotationMatrixForX, rotationMatrixFroY, rotationMatrixForZ) {
        this.matrix = matrix;
        this.rotationMatrixForX = rotationMatrixForX;
        this.rotationMatrixFroY = rotationMatrixFroY;
        this.rotationMatrixForZ = rotationMatrixForZ;
        // Rotation angles for X, Y and Z:
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this.computeEagerly = true;
        matrix.setToIdentity();
        rotationMatrixForX.setToIdentity();
        rotationMatrixFroY.setToIdentity();
        rotationMatrixForZ.setToIdentity();
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }
    set x(x) {
        this._x = x;
        this.rotationMatrixForX.setRotationAroundX(x);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    set y(y) {
        this._y = y;
        this.rotationMatrixFroY.setRotationAroundY(y);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    set z(z) {
        this._z = z;
        this.rotationMatrixForZ.setRotationAroundZ(z);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    set xyz(xyz) {
        this._x = xyz.xs[xyz.id];
        this._y = xyz.ys[xyz.id];
        this._z = xyz.zs[xyz.id];
        this.rotationMatrixForX.setRotationAroundX(this._x);
        this.rotationMatrixFroY.setRotationAroundY(this._y);
        this.rotationMatrixForZ.setRotationAroundZ(this._z);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    setXY(x, y) {
        this._x = x;
        this._y = y;
        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixFroY.setRotationAroundY(y);
        this.computeMatrix();
    }
    setXZ(x, z) {
        this._x = x;
        this._z = z;
        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixForZ.setRotationAroundZ(z);
        this.computeMatrix();
    }
    setYZ(y, z) {
        this._y = y;
        this._z = z;
        this.rotationMatrixFroY.setRotationAroundY(y);
        this.rotationMatrixForZ.setRotationAroundZ(z);
        this.computeMatrix();
    }
    setXYZ(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixFroY.setRotationAroundY(y);
        this.rotationMatrixForZ.setRotationAroundZ(z);
        this.computeMatrix();
    }
    computeMatrix() {
        this.matrix
            .setToIdentity()
            .mul(this.rotationMatrixForZ)
            .mul(this.rotationMatrixForX)
            .mul(this.rotationMatrixFroY);
    }
}
export default class Transform {
    constructor(matrix, rotation_matrix_x, rotation_matrix_y, rotation_matrix_z, translation = matrix.t, rotation = new EulerRotation(new Matrix3x3([
        matrix.m11, matrix.m12, matrix.m13,
        matrix.m21, matrix.m22, matrix.m23,
        matrix.m31, matrix.m32, matrix.m33
    ], matrix.id), rotation_matrix_x, rotation_matrix_y, rotation_matrix_z)) {
        this.matrix = matrix;
        this.rotation_matrix_x = rotation_matrix_x;
        this.rotation_matrix_y = rotation_matrix_y;
        this.rotation_matrix_z = rotation_matrix_z;
        this.translation = translation;
        this.rotation = rotation;
        matrix.setToIdentity();
    }
}
export const trans = (matrix4x4_allocator = defaultMatrix4x4Allocator, matrix3x3_allocator = defaultMatrix3x3Allocator) => new Transform(mat4x4(matrix4x4_allocator), mat3x3(matrix3x3_allocator), mat3x3(matrix3x3_allocator), mat3x3(matrix3x3_allocator));
//# sourceMappingURL=transform.js.map