import {Matrix3x3, Matrix4x4} from "../accessors/matrix.js";
import {Direction3D} from "../accessors/direction.js";
import {IVector2D, IVector3D} from "../_interfaces/vectors.js";


export default class Transform {
    constructor(
        public readonly matrix: Matrix4x4 = new Matrix4x4(),

        X: Matrix3x3 = new Matrix3x3(),
        Y: Matrix3x3 = new Matrix3x3(),
        Z: Matrix3x3 = new Matrix3x3(),

        public readonly rotation = new EulerRotation(matrix.mat3, X, Y, Z),
        public readonly translation = matrix.pos3
    ) {
        matrix.setToIdentity();
    }
}

export class EulerRotation {
    public computeEagerly = true;

    constructor(
        // Overall rotation matrix:
        public readonly matrix: Matrix3x3 = new Matrix3x3(),

        // Rotation matrices for X, Y and Z:
        public readonly X: Matrix3x3 = new Matrix3x3(),
        public readonly Y: Matrix3x3 = new Matrix3x3(),
        public readonly Z: Matrix3x3 = new Matrix3x3(),

        public readonly angles: Direction3D = new Direction3D()
    ) {
        matrix.setToIdentity();

        X.setToIdentity();
        Y.setToIdentity();
        Z.setToIdentity();
    }

    get x(): number {
        return this.angles.x
    }

    get y(): number {
        return this.angles.y
    }

    get z(): number {
        return this.angles.z
    }

    set x(x: number) {
        this.angles.x = x;

        this.X.setRotationAroundX(x);

        if (this.computeEagerly)
            this.computeMatrix();
    }

    set y(y: number) {
        this.angles.y = y;

        this.Y.setRotationAroundY(y);

        if (this.computeEagerly)
            this.computeMatrix();
    }

    set z(z: number) {
        this.angles.z = z;

        this.Z.setRotationAroundZ(z);

        if (this.computeEagerly)
            this.computeMatrix();
    }

    set xy(xy: IVector2D) {
        const x = this.angles.x = xy.x;
        const y = this.angles.y = xy.y;

        this.X.setRotationAroundX(x);
        this.Y.setRotationAroundY(y);

        this.computeMatrix();
    }

    set xz(xz: IVector3D) {
        const x = this.angles.x = xz.x;
        const z = this.angles.z = xz.z;

        this.X.setRotationAroundX(x);
        this.Z.setRotationAroundZ(z);

        this.computeMatrix();
    }

    set yz(yz: IVector3D) {
        const y = this.angles.y = yz.y;
        const z = this.angles.z = yz.z;

        this.Y.setRotationAroundY(y);
        this.Z.setRotationAroundZ(z);

        this.computeMatrix();
    }

    set xyz(xyz: IVector3D) {
        const x = this.angles.x = xyz.x;
        const y = this.angles.y = xyz.y;
        const z = this.angles.z = xyz.z;

        this.X.setRotationAroundX(x);
        this.Y.setRotationAroundY(y);
        this.Z.setRotationAroundZ(z);

        if (this.computeEagerly)
            this.computeMatrix();
    }

    public computeMatrix(): void {
        this.matrix.setFrom(this.Z).mul(this.X).mul(this.Y)
    }
}