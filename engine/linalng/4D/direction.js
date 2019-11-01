import Matrix4x4 from "./matrix.js";
import Position4D from "./position.js";
import { add, sub, minus, plus, mul, times, div, over, vecMatMul, equals } from "./arithmatic/vector.js";
import { dot, cross, lerp } from "../3D/arithmatic/vector.js";
import { Buffer, VectorBufferLength } from "./arithmatic/constants.js";
export default class Direction4D {
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
    set w(w) { this.buffer[3] = w; }
    get x() { return this.buffer[0]; }
    get y() { return this.buffer[1]; }
    get z() { return this.buffer[2]; }
    get w() { return this.buffer[3]; }
    get length() {
        return Math.sqrt(dot(this.buffer, this.buffer));
    }
    get norm() {
        return new Direction4D(over(this.buffer, this.length));
    }
    copy(new_direction = new Direction4D()) {
        new_direction.setTo(Buffer.from(this.buffer));
        return new_direction;
    }
    equals(other, precision_digits = 3) {
        if (Object.is(other, this))
            return true;
        if (!(other instanceof Direction4D))
            return false;
        return equals(this.buffer, other.buffer, precision_digits);
    }
    normalize() {
        this.div(this.length);
        return this;
    }
    normalizeTo(normalized = new Direction4D()) {
        over(this.buffer, this.length, normalized.buffer);
        return normalized;
    }
    dot(dir) {
        return dot(this.buffer, dir.buffer);
    }
    cross(dir, new_direction = new Direction4D()) {
        cross(this.buffer, dir.buffer, new_direction.buffer);
        return new_direction;
    }
    lerp(to, by, new_direction = new Direction4D()) {
        lerp(this.buffer, to.buffer, by, new_direction.buffer);
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
        scalar_or_matrix instanceof Matrix4x4 ?
            vecMatMul(this.buffer, scalar_or_matrix.buffer, this.buffer) :
            mul(this.buffer, scalar_or_matrix);
        return this;
    }
    div(scalar) {
        div(this.buffer, scalar);
        return this;
    }
    plus(position_or_direction, added = null) {
        if (added === null)
            added = position_or_direction instanceof Direction4D ?
                new Direction4D() :
                new Position4D();
        plus(this.buffer, position_or_direction.buffer, added.buffer);
        return added;
    }
    minus(position_or_direction, subtracted = null) {
        if (subtracted === null)
            subtracted = position_or_direction instanceof Direction4D ?
                new Direction4D() :
                new Position4D();
        minus(this.buffer, position_or_direction.buffer, subtracted.buffer);
        return subtracted;
    }
    over(scalar, new_direction = new Direction4D()) {
        over(this.buffer, scalar, new_direction.buffer);
        return new_direction;
    }
    times(scalar_or_matrix, new_direction = new Direction4D()) {
        scalar_or_matrix instanceof Matrix4x4 ?
            vecMatMul(this.buffer, scalar_or_matrix.buffer, new_direction.buffer) :
            times(this.buffer, scalar_or_matrix, new_direction.buffer);
        return new_direction;
    }
    setTo(x, y, z, w) {
        if (x instanceof Direction4D ||
            x instanceof Position4D) {
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
            if (typeof w === 'number')
                this.buffer[3] = w;
            return this;
        }
        throw `Invalid arguments ${x}, ${y}, ${z}, ${w}`;
    }
    toPosition(new_position = new Position4D()) {
        new_position.setTo(Buffer.from(this.buffer));
        return new_position;
    }
    asPosition(new_position = new Position4D()) {
        new_position.buffer = this.buffer;
        return new_position;
    }
}
export const dir4 = (x, y = 0, z = 0, w = 0) => x === undefined ?
    new Direction4D() :
    new Direction4D().setTo(x, y, z, w);
//# sourceMappingURL=direction.js.map