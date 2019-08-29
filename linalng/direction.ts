import Matrix from "../linalng/matrix.js";
import Position from "./position.js";
import {add, sub, minus, plus, mul, times, div, over, dot, cross, matMul} from "./arithmatic/vector.js";
import {VectorArray} from "./arithmatic/types.js";

export default class Direction  {
    public buffer : Float32Array;

    constructor(buffer: Float32Array | VectorArray | Direction | Position = null) {
        if (buffer === null)
            this.buffer = new Float32Array(4);
        else  if (buffer instanceof Direction || buffer instanceof Position)
            this.buffer = buffer.buffer;
        else if (buffer.length === 4)
            this.buffer = Float32Array.from(buffer);
        else
            throw `Invalid buffer ${buffer}`;

        this.buffer[0] = 0;
    }

    set x(x) {this.buffer[0] = x}
    set y(y) {this.buffer[1] = y}
    set z(z) {this.buffer[2] = z}
    set w(w) {this.buffer[3] = w}

    get x() {return this.buffer[0]}
    get y() {return this.buffer[1]}
    get z() {return this.buffer[2]}
    get w() {return this.buffer[3]}

    get length() : number {
        return Math.sqrt(dot(this.buffer, this.buffer));
    }

    get norm() : Direction {
        return new Direction(over(this.buffer, this.length));
    }

    static of(x: number = 0, y: number = 0, z: number = 0) : Direction {
        return new this(Float32Array.of(x, y, z, 0));
    }

    to(other: Position) : Direction {
        return new Direction(minus(other.buffer, this.buffer));
    }

    normalize() : Direction {
        this.div(this.length);
        return this;
    }

    dot(dir: Direction) : number {
        return dot(this.buffer, dir.buffer);
    }

    cross(dir: Direction) : Direction {
        return new Direction(cross(this.buffer, dir.buffer));
    }

    copy() : Direction {
        return new Direction(Float32Array.from(this.buffer));
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

    over(scalar: number) : Direction {
        return new Direction(over(this.buffer, scalar));
    }

    mul(scalar_or_matrix: number | Matrix) : Direction {
        if (scalar_or_matrix instanceof Matrix)
            matMul(this.buffer, scalar_or_matrix.buffer, this.buffer);
        else
            mul(this.buffer, scalar_or_matrix);

        return this;
    }

    times(scalar_or_matrix: number | Matrix) : Direction {
        return new Direction(
            scalar_or_matrix instanceof Matrix ?
                matMul(this.buffer, scalar_or_matrix.buffer) :
                times(this.buffer, scalar_or_matrix)
        )
    }
}