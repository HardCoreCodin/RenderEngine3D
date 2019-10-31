import Matrix4x4 from "../linalng/4D/matrix.js";
import Matrix3x3 from "../linalng/3D/matrix.js";
import Direction3D from "../linalng/3D/direction.js";
export class EulerRotation {
    constructor(matrix = new Matrix3x3().setToIdentity(), // Overall Rotation Matrix
    rotationMatrixForX = new Matrix3x3().setToIdentity(), // Rotation Matrix for X
    rotationMatrixFroY = new Matrix3x3().setToIdentity(), // Rotation Matrix for Y
    rotationMatrixForZ = new Matrix3x3().setToIdentity(), // Rotation Matrix for Z
    angles = new Direction3D() // Rotation Angles for X, Y, and Z
    ) {
        this.matrix = matrix;
        this.rotationMatrixForX = rotationMatrixForX;
        this.rotationMatrixFroY = rotationMatrixFroY;
        this.rotationMatrixForZ = rotationMatrixForZ;
        this.angles = angles;
        this.computeEagerly = true;
    }
    get x() { return this.angles.x; }
    get y() { return this.angles.y; }
    get z() { return this.angles.z; }
    set x(x) {
        this.angles.x = x;
        this.rotationMatrixForX.setRotationAroundX(x);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    set y(y) {
        this.angles.y = y;
        this.rotationMatrixFroY.setRotationAroundY(y);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    set z(z) {
        this.angles.z = z;
        this.rotationMatrixForZ.setRotationAroundZ(z);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    set xyz(xyz) {
        this.angles.setTo(xyz);
        this.rotationMatrixForX.setRotationAroundX(xyz.x);
        this.rotationMatrixFroY.setRotationAroundY(xyz.y);
        this.rotationMatrixForZ.setRotationAroundZ(xyz.z);
        if (this.computeEagerly)
            this.computeMatrix();
    }
    setXY(x, y) {
        this.angles.x = x;
        this.angles.y = y;
        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixFroY.setRotationAroundY(y);
        this.computeMatrix();
    }
    setXZ(x, z) {
        this.angles.x = x;
        this.angles.z = z;
        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixForZ.setRotationAroundZ(z);
        this.computeMatrix();
    }
    setYZ(y, z) {
        this.angles.y = y;
        this.angles.z = z;
        this.rotationMatrixFroY.setRotationAroundY(y);
        this.rotationMatrixForZ.setRotationAroundZ(z);
        this.computeMatrix();
    }
    setXYZ(x, y, z) {
        this.angles.x = x;
        this.angles.y = y;
        this.angles.z = z;
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
    constructor(matrix = new Matrix4x4().setToIdentity(), translation = matrix.t, rotation = new EulerRotation(new Matrix3x3(matrix.i.buffer.subarray(0, 3), matrix.j.buffer.subarray(0, 3), matrix.k.buffer.subarray(0, 3)))) {
        this.matrix = matrix;
        this.translation = translation;
        this.rotation = rotation;
    }
}
//# sourceMappingURL=transform.js.map