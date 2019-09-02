import Direction3D from "./direction.js";
import Matrix3x3 from "./matrix.js";
import { Buffer, VectorBufferLength } from "./arithmatic/constants.js";
import { add, sub, minus, plus, mul, times, div, over, vecMatMul, equals } from "./arithmatic/vector.js";
export default class Position3D {
    constructor(buffer) {
        if (buffer instanceof Buffer) {
            if (buffer.length === VectorBufferLength) {
                this.buffer = buffer;
                this.buffer[3] = 1;
            }
            else
                throw `Invalid buffer length ${buffer.length}`;
        }
        else if (buffer === undefined || buffer === null) {
            this.buffer = new Buffer(VectorBufferLength);
            this.buffer[3] = 1;
        }
        else
            throw `Invalid buffer ${buffer}`;
    }
    set x(x) { this.buffer[0] = x; }
    set y(y) { this.buffer[1] = y; }
    set z(z) { this.buffer[2] = z; }
    get x() { return this.buffer[0]; }
    get y() { return this.buffer[1]; }
    get z() { return this.buffer[2]; }
    copy(new_position = new Position3D()) {
        new_position.buffer.set(Buffer.from(this.buffer));
        return new_position;
    }
    equals(other, precision_digits = 3) {
        if (Object.is(other, this))
            return true;
        if (!(other instanceof Position3D))
            return false;
        return equals(this.buffer, other.buffer, precision_digits);
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
    plus(position_or_direction, new_position = new Position3D()) {
        plus(this.buffer, position_or_direction.buffer, new_position.buffer);
        return new_position;
    }
    minus(position_or_direction, new_position = new Position3D()) {
        minus(this.buffer, position_or_direction.buffer, new_position.buffer);
        return new_position;
    }
    over(scalar, new_position = new Position3D()) {
        over(this.buffer, scalar, new_position.buffer);
        return new_position;
    }
    times(scalar_or_matrix, new_position = new Position3D()) {
        scalar_or_matrix instanceof Matrix3x3 ?
            vecMatMul(this.buffer, scalar_or_matrix.m0, scalar_or_matrix.m1, scalar_or_matrix.m2) :
            times(this.buffer, scalar_or_matrix, new_position.buffer);
        return new_position;
    }
    to(other, direction = new Direction3D) {
        direction.setTo(minus(other.buffer, this.buffer));
        return direction;
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
export const pos3 = (x, y = 0, z = 0) => x === undefined ?
    new Position3D() :
    new Position3D().setTo(x, y, z);
//# sourceMappingURL=position.js.map