import {IVector3D, IVector4D} from "../math/interfaces.js";
import Matrix3x3, {defaultMatrix3x3Allocator, mat3x3} from "../math/mat3x3.js";
import Matrix4x4, {defaultMatrix4x4Allocator, mat4x4} from "../math/mat4x4.js";
import {Position4D} from "../math/vec4.js";
import {IAllocatorSizes, Matrix3x3Allocator, Matrix4x4Allocator} from "../allocators.js";

export class EulerRotation {
    // Rotation angles for X, Y and Z:
    private _x: number = 0;
    private _y: number = 0;
    private _z: number = 0;

    public computeEagerly = true;

    constructor(
        // Overall rotation matrix:
        public readonly matrix : Matrix3x3,

        // Rotation matrices for X, Y and Z:
        private readonly rotationMatrixForX: Matrix3x3,
        private readonly rotationMatrixFroY: Matrix3x3,
        private readonly rotationMatrixForZ: Matrix3x3,
    ) {
        matrix.setToIdentity();
        rotationMatrixForX.setToIdentity();
        rotationMatrixFroY.setToIdentity();
        rotationMatrixForZ.setToIdentity();
    }

    get x() : number {return this._x}
    get y() : number {return this._y}
    get z() : number {return this._z}

    set x(x: number) {
        this._x = x;
        this.rotationMatrixForX.setRotationAroundX(x);
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set y(y: number) {
        this._y = y;
        this.rotationMatrixFroY.setRotationAroundY(y);
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set z(z: number) {
        this._z = z;
        this.rotationMatrixForZ.setRotationAroundZ(z);
        if (this.computeEagerly)
            this.computeMatrix();
    }

    set xyz(xyz: IVector3D | IVector4D) {
        this._x = xyz.xs[xyz.id];
        this._y = xyz.ys[xyz.id];
        this._z = xyz.zs[xyz.id];

        this.rotationMatrixForX.setRotationAroundX(this._x);
        this.rotationMatrixFroY.setRotationAroundY(this._y);
        this.rotationMatrixForZ.setRotationAroundZ(this._z);

        if (this.computeEagerly)
            this.computeMatrix();
    }

    setXY(x: number, y: number) {
        this._x = x;
        this._y = y;

        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixFroY.setRotationAroundY(y);

        this.computeMatrix();
    }

    setXZ(x: number, z: number) {
        this._x = x;
        this._z = z;

        this.rotationMatrixForX.setRotationAroundX(x);
        this.rotationMatrixForZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    setYZ(y: number, z: number) {
        this._y = y;
        this._z = z;

        this.rotationMatrixFroY.setRotationAroundY(y);
        this.rotationMatrixForZ.setRotationAroundZ(z);

        this.computeMatrix();
    }

    setXYZ(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;

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
    static readonly SIZE: IAllocatorSizes = {
        mat4x4: 1,
        mat3x3: 3
    };

    constructor(
        public readonly matrix: Matrix4x4,
        public readonly rotation_matrix_x: Matrix3x3,
        public readonly rotation_matrix_y: Matrix3x3,
        public readonly rotation_matrix_z: Matrix3x3,

        public readonly translation: Position4D = matrix.t,
        public readonly rotation: EulerRotation = new EulerRotation(
            new Matrix3x3([
                matrix.m11, matrix.m12, matrix.m13,
                matrix.m21, matrix.m22, matrix.m23,
                matrix.m31, matrix.m32, matrix.m33],
                matrix.id
            ),

            rotation_matrix_x,
            rotation_matrix_y,
            rotation_matrix_z
        )
    ) {
        matrix.setToIdentity();
    }
}

export const trans = (
    matrix4x4_allocator: Matrix4x4Allocator = defaultMatrix4x4Allocator,
    matrix3x3_allocator: Matrix3x3Allocator = defaultMatrix3x3Allocator
) : Transform => new Transform(
    mat4x4(matrix4x4_allocator),
    mat3x3(matrix3x3_allocator),
    mat3x3(matrix3x3_allocator),
    mat3x3(matrix3x3_allocator)
);