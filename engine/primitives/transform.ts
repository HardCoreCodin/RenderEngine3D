import Matrix4x4 from "../linalng/4D/matrix.js";
import Position4D from "../linalng/4D/position.js";
import Direction4D from "../linalng/4D/direction.js";
import Matrix3x3 from "../linalng/3D/matrix.js";
import Direction3D from "../linalng/3D/direction.js";

export class EulerRotation {
    public computeEagerly = true;

    constructor(
        public readonly matrix : Matrix3x3 = new Matrix3x3().setToIdentity(), // Overall Rotation Matrix
        private readonly rotationMatrixForX: Matrix3x3 = new Matrix3x3().setToIdentity(), // Rotation Matrix for X
        private readonly rotationMatrixFroY: Matrix3x3 = new Matrix3x3().setToIdentity(), // Rotation Matrix for Y
        private readonly rotationMatrixForZ: Matrix3x3 = new Matrix3x3().setToIdentity(), // Rotation Matrix for Z
        public readonly angles = new Direction3D()	// Rotation Angles for X, Y, and Z
    ) {}

    get x() : number {return this.angles.x}
    get y() : number {return this.angles.y}
    get z() : number {return this.angles.z}

    set x(x: number) {
        this.angles.x = x;
        this.rotationMatrixForX.setRotationAroundX(x);
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set y(y: number) {
        this.angles.y = y;
        this.rotationMatrixFroY.setRotationAroundY(y);
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set z(z: number) {
        this.angles.z = z;
        this.rotationMatrixForZ.setRotationAroundZ(z);
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set xyz(xyz: Direction4D) {
        this.angles.setTo(xyz);

        this.rotationMatrixForX.setRotationAroundX(xyz.x);
        this.rotationMatrixFroY.setRotationAroundY(xyz.y);
        this.rotationMatrixForZ.setRotationAroundZ(xyz.z);

        if (this.computeEagerly)
            this.computeMatrix();
    }

    setXY(x: number, y: number) {
        this.angles.x = x;
        this.angles.y = y;

        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixFroY.setRotationAroundY(y);

        this.computeMatrix();
    }

    setXZ(x: number, z: number) {
        this.angles.x = x;
        this.angles.z = z;

        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixForZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    setYZ(y: number, z: number) {
        this.angles.y = y;
        this.angles.z = z;

        this.rotationMatrixFroY.setRotationAroundY(y);
        this.rotationMatrixForZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    setXYZ(x: number, y: number, z: number) {
        this.angles.x = x;
        this.angles.y = y;
        this.angles.z = z;

        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixFroY.setRotationAroundY(y);
        this.rotationMatrixForZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    public computeMatrix() : void {
        this.matrix
            .setToIdentity()
            .mul(this.rotationMatrixForZ)
            .mul(this.rotationMatrixForX)
            .mul(this.rotationMatrixFroY)
    }
}

export default class Transform {
    constructor(
        public readonly matrix: Matrix4x4 = new Matrix4x4().setToIdentity(),
        public readonly translation: Position4D = matrix.t,
        public readonly rotation: EulerRotation = new EulerRotation(
            new Matrix3x3(
                matrix.i.buffer.subarray(0, 3),
                matrix.j.buffer.subarray(0, 3),
                matrix.k.buffer.subarray(0, 3),
            )
        )
    ) {}
}