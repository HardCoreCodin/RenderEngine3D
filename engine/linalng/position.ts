import Direction from "./direction.js";
import Matrix from "./matrix.js";
import {Buffer, VectorBufferLength} from "./arithmatic/types.js";
import {add, sub, minus, plus, mul, times, div, over, vecMatMul} from "./arithmatic/vector.js";

export default class Position  {
    public buffer: Buffer;

    constructor(buffer?: Buffer) {
        if (buffer instanceof Buffer) {
            if (buffer.length === VectorBufferLength) {
                this.buffer = buffer;
                this.buffer[3] = 1;
            } else
                throw `Invalid buffer length ${buffer.length}`;
        } else if (buffer === undefined || buffer === null) {
            this.buffer = new Buffer(VectorBufferLength);
            this.buffer[3] = 1;
        } else
            throw `Invalid buffer ${buffer}`;
    }

    set x(x) {this.buffer[0] = x}
    set y(y) {this.buffer[1] = y}
    set z(z) {this.buffer[2] = z}
    set w(w) {this.buffer[3] = w}

    get x() : number {return this.buffer[0]}
    get y() : number {return this.buffer[1]}
    get z() : number {return this.buffer[2]}
    get w() : number {return this.buffer[3]}

    to(other: Position, direction = new Direction) : Direction {
        direction.setTo(minus(other.buffer, this.buffer));
        return direction;
    }

    copy() : Position {
        return new Position(Buffer.from(this.buffer));
    }

    add(position: Direction | Position) : Position {
        add(this.buffer, position.buffer);
        return this;
    }

    plus(position_or_direction: Direction | Position) : Position {
        return new Position(plus(this.buffer, position_or_direction.buffer));
    }

    sub(position: Direction | Position) : Position {
        sub(this.buffer, position.buffer);
        return this;
    }

    minus(direction: Direction | Position) : Position {
        return new Position(minus(this.buffer, direction.buffer));
    }

    div(scalar: number) : Position {
        div(this.buffer, scalar);
        return this;
    }

    over(scalar: number) : Position {
        return new Position(over(this.buffer, scalar));
    }

    mul(scalar_or_matrix: number | Matrix) : Position {
        if (scalar_or_matrix instanceof Matrix)
            vecMatMul(this.buffer, scalar_or_matrix.buffer, this.buffer);
        else
            mul(this.buffer, scalar_or_matrix);

        return this;
    }

    times(scalar_or_matrix: number | Matrix) : Position {
        return new Position(
            scalar_or_matrix instanceof Matrix ?
                vecMatMul(this.buffer, scalar_or_matrix.buffer) :
                times(this.buffer, scalar_or_matrix)
        )
    }

    toDirection() : Direction {
        return new Direction(Buffer.from(this.buffer));
    }

    asDirection() : Direction {
        return new Direction(this.buffer);
    }

    setTo(
        x: Number | Buffer | Position | Direction,
        y?: Number,
        z?: Number,
        w?: Number,
    ) : Position {
        if (x instanceof Direction ||
            x instanceof Position) {

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

            if (typeof y === 'number') this.buffer[1] = y;
            if (typeof z === 'number') this.buffer[2] = z;
            if (typeof w === 'number') this.buffer[3] = w;

            return this;
        }

        throw `Invalid arguments ${x}, ${y}, ${z}, ${w}`
    }
}

export const pos4 = (
    x?: Number | Buffer | Position | Direction,
    y: Number = 0,
    z: Number = 0,
    w: Number = 1,
) : Position => x === undefined ? new Position() : new Position().setTo(x, y, z, w);