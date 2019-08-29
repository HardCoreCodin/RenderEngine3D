import Direction from "./direction.js";
import Matrix from "./matrix.js";
import {VectorArray} from "./arithmatic/types";
import {add, sub, minus, plus, mul, times, div, over, matMul} from "./arithmatic/vector.js";

export default class Position  {
    public buffer : Float32Array;

    constructor(buffer: Float32Array | VectorArray | Position = null) {
        if (buffer === null)
            this.buffer = new Float32Array(4);
        else  if (buffer instanceof Position)
            this.buffer = buffer.buffer;
        else if (buffer.length === 4)
            this.buffer = Float32Array.from(buffer);
        else
            throw `Invalid buffer ${buffer}`;

        this.buffer[0] = 1;
    }

    set x(x) {this.buffer[0] = x}
    set y(y) {this.buffer[1] = y}
    set z(z) {this.buffer[2] = z}
    set w(w) {this.buffer[3] = w}

    get x() {return this.buffer[0]}
    get y() {return this.buffer[1]}
    get z() {return this.buffer[2]}
    get w() {return this.buffer[3]}

    static of(x: number = 0, y: number = 0, z: number = 0) : Position {
        return new this(Float32Array.of(x, y, z, 1));
    }

    to(other: Position) : Direction {
        return new Direction(minus(other.buffer, this.buffer));
    }

    toDirection() : Direction {
        return new Direction(this.buffer);
    }

    copy() : Position {
        return new Position(Float32Array.from(this.buffer));
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
            matMul(this.buffer, scalar_or_matrix.buffer, this.buffer);
        else
            mul(this.buffer, scalar_or_matrix);

        return this;
    }

    times(scalar_or_matrix: number | Matrix) : Position {
        return new Position(
            scalar_or_matrix instanceof Matrix ?
                matMul(this.buffer, scalar_or_matrix.buffer) :
                times(this.buffer, scalar_or_matrix)
        )
    }
}
