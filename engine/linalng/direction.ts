import Matrix from "../linalng/matrix.js";
import Position from "./position.js";
import {add, sub, minus, plus, mul, times, div, over, dot, cross, vecMatMul} from "./arithmatic/vector.js";
import {Buffer, VectorBufferLength} from "./arithmatic/types.js";

export default class Direction  {
    public buffer: Buffer;

    constructor(buffer?: Buffer) {
        if (buffer instanceof Buffer) {
            if (buffer.length === VectorBufferLength)
                this.buffer = buffer;
            else
                throw `Invalid buffer length ${buffer.length}`;
        } else if (buffer === undefined || buffer === null)
            this.buffer = new Buffer(VectorBufferLength);
        else
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

    get length() : number {
        return Math.sqrt(dot(this.buffer, this.buffer));
    }

    get norm() : Direction {
        return new Direction(over(this.buffer, this.length));
    }

    normalize() : Direction {
        this.div(this.length);
        return this;
    }

    dot(dir: Direction) : number {
        return dot(this.buffer, dir.buffer);
    }

    cross(dir: Direction, new_direction: Direction = new Direction()) : Direction {
        cross(this.buffer, dir.buffer, new_direction.buffer);
        return new_direction;
    }

    copy(new_direction: Direction = new Direction()) : Direction {
        new_direction.setTo(Buffer.from(this.buffer));
        return new_direction;
    }

    add(position: Direction) : Direction {
        add(this.buffer, position.buffer);
        return this;
    }

    plus(position_or_direction: Position) : Position;
    plus(position_or_direction: Direction) : Direction;
    plus(position_or_direction: Direction | Position) : Direction | Position {
        if (position_or_direction instanceof Direction)
            return new Direction(plus(this.buffer, position_or_direction.buffer));
        else
            return new Position(plus(this.buffer, position_or_direction.buffer));
    }

    sub(position: Direction) : Direction {
        sub(this.buffer, position.buffer);
        return this;
    }

    minus(position_or_direction: Position) : Position;
    minus(position_or_direction: Direction) : Direction;
    minus(position_or_direction: Direction | Position) : Direction | Position {
        if (position_or_direction instanceof Direction)
            return new Direction(minus(this.buffer, position_or_direction.buffer));
        else
            return new Position(minus(this.buffer, position_or_direction.buffer));
    }

    div(scalar: number) : Direction {
        div(this.buffer, scalar);
        return this;
    }

    over(scalar: number, new_direction: Direction = new Direction()) : Direction {
        over(this.buffer, scalar, new_direction.buffer);
        return new_direction;
    }

    mul(scalar_or_matrix: number | Matrix) : Direction {
        if (scalar_or_matrix instanceof Matrix)
            vecMatMul(this.buffer, scalar_or_matrix.buffer, this.buffer);
        else
            mul(this.buffer, scalar_or_matrix);

        return this;
    }

    times(scalar_or_matrix: number | Matrix, new_direction: Direction = new Direction()) : Direction {
        if (scalar_or_matrix instanceof Matrix)
            vecMatMul(this.buffer, scalar_or_matrix.buffer, new_direction.buffer);
        else
            times(this.buffer, scalar_or_matrix, new_direction.buffer);

        return new_direction;
    }

    toPosition(new_position: Position = new Position()) : Position {
        new_position.setTo(Buffer.from(this.buffer));
        return new_position;
    }

    asPosition(new_position: Position = new Position()) : Position {
        new_position.buffer = this.buffer;
        return new_position;
    }

    setTo(
        x: Number | Buffer | Position | Direction,
        y?: Number,
        z?: Number,
        w?: Number,
    ) : Direction {
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

export const dir4 = (
    x?: Number | Buffer | Position | Direction,
    y: Number = 0,
    z: Number = 0,
    w: Number = 0,
) : Direction => x === undefined ? new Direction() : new Direction().setTo(x, y, z, w);