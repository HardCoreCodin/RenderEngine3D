import Position3D from "./position.js";
import Direction3D from "./direction.js";
import { equals, isIdentity, identity, transpose, matMatMul, rotationAroundX, rotationAroundY, rotationAroundZ, } from "./arithmatic/matrix.js";
import { Buffer, VectorBufferLength, } from "./arithmatic/constants.js";
export default class Matrix3x3 {
    constructor(m0 = new Buffer(VectorBufferLength), m1 = new Buffer(VectorBufferLength), m2 = new Buffer(VectorBufferLength), i = new Direction3D(m0), j = new Direction3D(m1), k = new Direction3D(m2)) {
        this.m0 = m0;
        this.m1 = m1;
        this.m2 = m2;
        this.i = i;
        this.j = j;
        this.k = k;
    }
    get isIdentity() {
        return isIdentity(this.m0, this.m1, this.m2);
    }
    get transposed() {
        return new Matrix3x3(...transpose(this.m0, this.m1, this.m2));
    }
    transpose() {
        transpose(this.m0, this.m1, this.m2);
        return this;
    }
    copy(new_matrix = new Matrix3x3()) {
        new_matrix.m0.set(this.m0);
        new_matrix.m1.set(this.m1);
        new_matrix.m2.set(this.m2);
        return new_matrix;
    }
    times(rhs, new_matrix = new Matrix3x3()) {
        matMatMul(this.m0, this.m1, this.m2, rhs.m0, rhs.m1, rhs.m2, new_matrix.m0, new_matrix.m1, new_matrix.m2);
        return new_matrix;
    }
    mul(rhs) {
        matMatMul(this.m0, this.m1, this.m2, rhs.m0, rhs.m1, rhs.m2, this.m0, this.m1, this.m2);
        return this;
    }
    setToIdentity() {
        identity(this.m0, this.m1, this.m2);
        return this;
    }
    setRotationAroundX(angle = 0, reset = true) {
        rotationAroundX(angle, reset, this.m0, this.m1, this.m2);
        return this;
    }
    setRotationAroundY(angle, reset = false) {
        rotationAroundY(angle, reset, this.m0, this.m1, this.m2);
        return this;
    }
    setRotationAroundZ(angle, reset = false) {
        rotationAroundZ(angle, reset, this.m0, this.m1, this.m2);
        return this;
    }
    static Identity() {
        return new Matrix3x3(...identity());
    }
    static RotationX(angle = 0) {
        return new Matrix3x3(...rotationAroundX(angle));
    }
    static RotationY(angle = 0) {
        return new Matrix3x3(...rotationAroundY(angle));
    }
    static RotationZ(angle = 0) {
        return new Matrix3x3(...rotationAroundZ(angle));
    }
    setTo(x0, y0, z0, x1, y1, z1, x2, y2, z2) {
        if (x0 instanceof Matrix3x3) {
            this.m0.set(x0.m0);
            this.m1.set(x0.m1);
            this.m2.set(x0.m2);
            return this;
        }
        if (x0 instanceof Buffer) {
            if (x0.length === VectorBufferLength) {
                this.m0.set(x0);
                if (y0 instanceof Buffer && y0.length === VectorBufferLength)
                    this.m1.set(y0);
                if (z0 instanceof Buffer && z0.length === VectorBufferLength)
                    this.m2.set(z0);
                return this;
            }
        }
        if (x0 instanceof Position3D || x0 instanceof Direction3D) {
            this.m0.set(x0.buffer);
            if (y0 instanceof Position3D || y0 instanceof Direction3D)
                this.m1.set(y0.buffer);
            if (z0 instanceof Position3D || z0 instanceof Direction3D)
                this.m2.set(z0.buffer);
            return this;
        }
        if (typeof x0 === 'number') {
            this.m0[0] = x0;
            if (typeof y0 === 'number')
                this.m0[1] = y0;
            if (typeof z0 === 'number')
                this.m0[2] = z0;
            if (typeof x1 === 'number')
                this.m1[4] = x1;
            if (typeof y1 === 'number')
                this.m1[5] = y1;
            if (typeof z1 === 'number')
                this.m1[6] = z1;
            if (typeof x2 === 'number')
                this.m2[8] = x2;
            if (typeof y2 === 'number')
                this.m2[9] = y2;
            if (typeof z2 === 'number')
                this.m2[10] = z2;
            return this;
        }
        throw `Invalid arguments: 
${x0}, ${y0}, ${z0}
${x1}, ${y1}, ${z1}
${x2}, ${y2}, ${z2}`;
    }
    equals(matrix, precision_digits = 3) {
        if (Object.is(matrix, this))
            return true;
        if (!(matrix instanceof Matrix3x3))
            return false;
        return equals(this.m0, this.m1, this.m2, matrix.m0, matrix.m1, matrix.m2, precision_digits);
    }
}
export const mat4 = (x0 = 1, y0, z0, x1, y1 = 1, z1, x2, y2, z2 = 1) => new Matrix3x3().setTo(x0, y0, z0, x1, y1, z1, x2, y2, z2);
//# sourceMappingURL=matrix.js.map