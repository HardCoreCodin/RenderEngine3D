import Matrix from "../linalng/matrix.js";
import Position from "../linalng/position.js";
import Direction from "../linalng/direction.js";

export class EulerRotation {
    constructor(
        public readonly matrix = new Matrix().setToIdentity(), // Overall Rotation Matrix
        private readonly rotationMatrixForX = new Matrix().setToIdentity(), // Rotation Matrix for X
        private readonly rotationMatrixFroY = new Matrix().setToIdentity(), // Rotation Matrix for Y
        private readonly rotationMatrixForZ = new Matrix().setToIdentity(), // Rotation Matrix for Z
        public readonly angles = new Direction()	// Rotation Angles for X, Y, and Z
    ) {}

    get x() : number {return this.angles.x}
    get y() : number {return this.angles.y}
    get z() : number {return this.angles.z}

    set x(x: number) {
        this.angles.x = x;
        this.rotationMatrixForX.setRotationAroundX(x);
        this.computeMatrix();
    }

    set y(y: number) {
        this.angles.y = y;
        this.rotationMatrixFroY.setRotationAroundY(y);
        this.computeMatrix();
    }

    set z(z: number) {
        this.angles.z = z;
        this.rotationMatrixForZ.setRotationAroundZ(z);
        this.computeMatrix();
    }

    set xyz(xyz: Direction) {
        this.angles.setTo(xyz);

        this.rotationMatrixForX.setRotationAroundX(xyz.x);
        this.rotationMatrixFroY.setRotationAroundY(xyz.y);
        this.rotationMatrixForZ.setRotationAroundZ(xyz.z);

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

    private computeMatrix() : void {
        this.matrix
            .setToIdentity()
            .mul(this.rotationMatrixForZ)
            .mul(this.rotationMatrixForX)
            .mul(this.rotationMatrixFroY)
    }
}

export default class Transform {
    public readonly translation: Position;

    constructor(
        public readonly matrix: Matrix = new Matrix().setToIdentity(),
        public readonly rotation: EulerRotation = new EulerRotation()
    ) {
        this.translation = matrix.t;
    }

    get rotationAngleForX() : number {return this.rotation.x}
    get rotationAngleForY() : number {return this.rotation.y}
    get rotationAngleForZ() : number {return this.rotation.z}

    set rotationAngleForX(x: number) {
        this.rotation.x = x;
        this.setMatrix();
    }

    set rotationAngleForY(y: number) {
        this.rotation.y = y;
        this.setMatrix();
    }

    set rotationAngleForZ(z: number) {
        this.rotation.z = z;
        this.setMatrix();
    }

    setRotationAnglesForXYZ(x: number, y: number, z: number) : void {
        this.rotation.setXYZ(x, y, z);
        this.setMatrix();
    }

    setRotationAnglesForXY(x: number, y: number) : void {
        this.rotation.setXY(x, y);
        this.setMatrix();
    }

    setRotationAnglesForXZ(x: number, z: number) : void {
        this.rotation.setXZ(x, z);
        this.setMatrix();
    }

    setRotationAnglesForYZ(y: number, z: number) : void {
        this.rotation.setYZ(y, z);
        this.setMatrix();
    }

    private setMatrix() : void {
        this.matrix.m0.set(this.rotation.matrix.m0);
        this.matrix.m1.set(this.rotation.matrix.m1);
        this.matrix.m2.set(this.rotation.matrix.m2);
    }
}