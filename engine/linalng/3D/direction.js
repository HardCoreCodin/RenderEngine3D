import Matrix3x3 from "./matrix.js";
import Position3D from "./position.js";
import { add, sub, minus, plus, mul, times, div, over, dot, cross, vecMatMul } from "./arithmatic/vector.js";
import { Buffer, VectorBufferLength } from "./arithmatic/constants.js";
export default class Direction3D {
    constructor(buffer) {
        if (buffer instanceof Buffer) {
            if (buffer.length === VectorBufferLength)
                this.buffer = buffer;
            else
                throw `Invalid buffer length ${buffer.length}`;
        }
        else if (buffer === undefined || buffer === null)
            this.buffer = new Buffer(VectorBufferLength);
        else
            throw `Invalid buffer ${buffer}`;
    }
    set x(x) { this.buffer[0] = x; }
    set y(y) { this.buffer[1] = y; }
    set z(z) { this.buffer[2] = z; }
    get x() { return this.buffer[0]; }
    get y() { return this.buffer[1]; }
    get z() { return this.buffer[2]; }
    get length() {
        return Math.sqrt(dot(this.buffer, this.buffer));
    }
    get norm() {
        return new Direction3D(over(this.buffer, this.length));
    }
    normalize() {
        this.div(this.length);
        return this;
    }
    dot(dir) {
        return dot(this.buffer, dir.buffer);
    }
    cross(dir, new_direction = new Direction3D()) {
        cross(this.buffer, dir.buffer, new_direction.buffer);
        return new_direction;
    }
    copy(new_direction = new Direction3D()) {
        new_direction.setTo(Buffer.from(this.buffer));
        return new_direction;
    }
    add(position) {
        add(this.buffer, position.buffer);
        return this;
    }
    sub(position) {
        sub(this.buffer, position.buffer);
        return this;
    }
    mul(scalar_or_matrix) {
        scalar_or_matrix instanceof Matrix3x3 ?
            vecMatMul(this.buffer, scalar_or_matrix.m0, scalar_or_matrix.m1, scalar_or_matrix.m2) :
            mul(this.buffer, scalar_or_matrix);
        return this;
    }
    div(scalar) {
        div(this.buffer, scalar);
        return this;
    }
    plus(position_or_direction) {
        return position_or_direction instanceof Direction3D ?
            new Direction3D(plus(this.buffer, position_or_direction.buffer)) :
            new Position3D(plus(this.buffer, position_or_direction.buffer));
    }
    minus(position_or_direction) {
        return position_or_direction instanceof Direction3D ?
            new Direction3D(minus(this.buffer, position_or_direction.buffer)) :
            new Position3D(minus(this.buffer, position_or_direction.buffer));
    }
    over(scalar, new_direction = new Direction3D()) {
        over(this.buffer, scalar, new_direction.buffer);
        return new_direction;
    }
    times(scalar_or_matrix, new_direction = new Direction3D()) {
        scalar_or_matrix instanceof Matrix3x3 ?
            vecMatMul(this.buffer, scalar_or_matrix.m0, scalar_or_matrix.m1, scalar_or_matrix.m2) :
            times(this.buffer, scalar_or_matrix, new_direction.buffer);
        return new_direction;
    }
    setTo(x, y, z) {
        if (x instanceof Direction3D ||
            x instanceof Position3D) {
            this.buffer.set(x.buffer);
            return this;
        }
        if (x instanceof Buffer &&
            x.length === VectorBufferLength) {
            this.buffer.set(x);
            return this;
        }
        if (typeof x === 'number') {
            this.buffer[0] = x;
            if (typeof y === 'number')
                this.buffer[1] = y;
            if (typeof z === 'number')
                this.buffer[2] = z;
            return this;
        }
        throw `Invalid arguments ${x}, ${y}, ${z}`;
    }
}
export const dir3 = (x, y = 0, z = 0) => x === undefined ?
    new Direction3D() :
    new Direction3D().setTo(x, y, z);
//# sourceMappingURL=direction.js.map