import Matrix from "../linalng/matrix.js";
import Position from "../linalng/position.js";
import Direction from "../linalng/direction.js";

// export class Translation {
//     public readonly position: Position; // Location in world space
//
//     constructor(
//         private readonly matrix: Matrix = new Matrix().setToIdentity(),	// Translation Matrix
//     ) {
//         this.position = matrix.t;
//     }
//
//     set x(x: number) {this.position.x = x}
//     set y(y: number) {this.position.y = y}
//     set z(z: number) {this.position.z = z}
//     set w(w: number) {this.position.w = w}
//
//     get x() : number {return this.position.x}
//     get y() : number {return this.position.y}
//     get z() : number {return this.position.z}
//     get w() : number {return this.position.w}
// }

export class EulerRotation {
    constructor(
        public readonly matrix = new Matrix().setToIdentity(), // Overall Rotation Matrix
        private readonly rotX = new Matrix().setToIdentity(), // Rotation Matrix for X
        private readonly rotY = new Matrix().setToIdentity(), // Rotation Matrix for Y
        private readonly rotZ = new Matrix().setToIdentity(), // Rotation Matrix for Z
        private readonly angles = new Direction()	// Rotation Angles for X, Y, and Z
    ) {}

    get x() : number {return this.angles.x}
    get y() : number {return this.angles.y}
    get z() : number {return this.angles.z}

    set x(x: number) {
        this.angles.x = x;
        this.rotX.setRotationAroundX(x);
        this.computeMatrix();
    }

    set y(y: number) {
        this.angles.y = y;
        this.rotY.setRotationAroundY(y);
        this.computeMatrix();
    }

    set z(z: number) {
        this.angles.z = z;
        this.rotZ.setRotationAroundZ(z);
        this.computeMatrix();
    }

    set xyz(xyz: Direction) {
        this.angles.setTo(xyz);

        this.rotX.setRotationAroundX(xyz.x);
        this.rotY.setRotationAroundY(xyz.y);
        this.rotZ.setRotationAroundZ(xyz.z);

        this.computeMatrix();
    }

    setXY(x: number, y: number) {
        this.angles.x = x;
        this.angles.y = y;

        this.rotX.setRotationAroundX(x);
        this.rotY.setRotationAroundY(y);

        this.computeMatrix();
    }

    setXZ(x: number, z: number) {
        this.angles.x = x;
        this.angles.z = z;

        this.rotX.setRotationAroundX(x);
        this.rotZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    setYZ(y: number, z: number) {
        this.angles.y = y;
        this.angles.z = z;

        this.rotY.setRotationAroundY(y);
        this.rotZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    setXYZ(x: number, y: number, z: number) {
        this.angles.x = x;
        this.angles.y = y;
        this.angles.z = z;

        this.rotX.setRotationAroundX(x);
        this.rotY.setRotationAroundY(y);
        this.rotZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    private computeMatrix() : void {
        this.matrix
            .setToIdentity()
            .mul(this.rotZ)
            .mul(this.rotX)
            .mul(this.rotY)
    }
}

export default class Transform {
    public readonly translation: Position;

    constructor(
        public readonly matrix: Matrix = new Matrix().setToIdentity(),
        // public readonly translation: Translation = new Translation(),
        public readonly rotation: EulerRotation = new EulerRotation()
    ) {
        this.translation = matrix.t;
    }

    get rotX() : number {return this.rotation.x}
    get rotY() : number {return this.rotation.y}
    get rotZ() : number {return this.rotation.z}

    set rotX(x: number) {
        this.rotation.x = x;
        this.setMatrix();
    }

    set rotY(y: number) {
        this.rotation.y = y;
        this.setMatrix();
    }

    set rotZ(z: number) {
        this.rotation.z = z;
        this.setMatrix();
    }

    setRotationXYZ(x: number, y: number, z: number) : void {
        this.rotation.setXYZ(x, y, z);
        this.setMatrix();
    }

    setRotationXY(x: number, y: number) : void {
        this.rotation.setXY(x, y);
        this.setMatrix();
    }

    setRotationXZ(x: number, z: number) : void {
        this.rotation.setXZ(x, z);
        this.setMatrix();
    }

    setRotationYZ(y: number, z: number) : void {
        this.rotation.setYZ(y, z);
        this.setMatrix();
    }

    private setMatrix() : void {
        this.matrix.m0.set(this.rotation.matrix.m0);
        this.matrix.m1.set(this.rotation.matrix.m1);
        this.matrix.m2.set(this.rotation.matrix.m2);
    }
}