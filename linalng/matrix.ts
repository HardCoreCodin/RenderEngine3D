import Position from "./position.js";
import Direction from "./direction.js";
import {
    identity,
    inverse,
    matMul,
    translation,
    projection,
    rotationAroundX,
    rotationAroundY,
    rotationAroundZ
} from "./arithmatic/matrix.js";
import {
    Buffer,

    VectorBufferLength,
    MatrixBufferLength,

    MatrixVectorBuffers,
    MatrixVectorArrays,

    VectorArray,
    MatrixArray,

    M0_Start,
    M1_Start,
    M2_Start,
    M3_Start,

    M0_End,
    M1_End,
    M2_End,
    M3_End,
} from "./arithmatic/types.js";

export default class Matrix {
    constructor(
        public buffer = new Buffer(MatrixBufferLength)
    ) {
        if (this.buffer.length !== MatrixBufferLength)
            throw `Invalid buffer length ${buffer.length}`;
    }

    public m0 = this.buffer.subarray(M0_Start, M0_End);
    public m1 = this.buffer.subarray(M1_Start, M1_End);
    public m2 = this.buffer.subarray(M2_Start, M2_End);
    public m3 = this.buffer.subarray(M3_Start, M3_End);

    public i = new Direction(this.m0);
    public j = new Direction(this.m1);
    public k = new Direction(this.m2);
    public t = new Direction(this.m3);

    // get det() : number {return det(this._buffer)}
    get inverse() : Matrix {
        return new Matrix(inverse(this.buffer));
    }

    copy() : Matrix {
        return new Matrix(Buffer.from(this.buffer));
    }

    times(rhs: Matrix) : Matrix {
        return new Matrix(matMul(this.buffer, rhs.buffer));
    }

    mul(rhs: Matrix) : Matrix {
        matMul(this.buffer, rhs.buffer, this.buffer);
        return this;
    }

    setToIdentity() : Matrix {
        identity(this.buffer);
        return this
    }

    setRotationAroundX(angle=0, reset=true) : Matrix {
        rotationAroundX(angle, reset, this.buffer);
        return this;
    }

    setRotationAroundY(angle: number, reset=false) : Matrix {
        rotationAroundY(angle, reset, this.buffer);
        return this;
    }

    setRotationAroundZ(angle: number, reset=false) : Matrix {
        rotationAroundZ(angle, reset, this.buffer);
        return this;
    }

    setTranslation(
        x: number | Buffer | Position = 0,
        y: number = 0,
        z: number = 0,
        reset=false
    ) : Matrix {
        if (x instanceof Position)
            translation(x.buffer, 0, 0, reset, this.buffer);
        else
            translation(x, y, z, reset, this.buffer);

        return this;
    }

    setTo(
        m0  : Buffer | VectorArray | Matrix,
        m1? : Buffer | VectorArray,
        m2? : Buffer | VectorArray,
        m3? : Buffer | VectorArray
    ) : Matrix {
        if (m0 instanceof Matrix)
            this.buffer.set(m0.buffer);
        else if (m0.length === VectorBufferLength || m0.length === MatrixBufferLength) {
            this.buffer.set(m0);

            if (m1 !== undefined) this.buffer.set(m1, M1_Start);
            if (m2 !== undefined) this.buffer.set(m1, M2_Start);
            if (m3 !== undefined) this.buffer.set(m1, M3_Start);
        } else
            throw `Invalid buffer length ${m0}`;

        return this;
    }

    static from() : Matrix {
        if (buffer === null)
            this.buffer = new Buffer(MatrixBufferLength);
        else if (buffer instanceof Matrix)
            this.buffer = buffer.buffer;
        else if (buffer instanceof Buffer)
            this.buffer = buffer;
        else if (buffer.length === 4)
            this.buffer = Buffer.of(...buffer[0], ...buffer[1], ...buffer[2], ...buffer[3]);
        else
            throw `Invalid buffer ${buffer}`;

        if (this.buffer.length !== 16)
            throw `Invalid buffer length ${buffer}`;
    }

    static of(
        m0: Buffer | VectorArray | Matrix,
        m1?: Buffer | VectorArray,
        m2?: Buffer | VectorArray,
        m3?: Buffer | VectorArray
    ) : Matrix {
        return new Matrix().setTo(m0, m1, m2, m3);
    }

    static Identity() : Matrix {
        return new Matrix(identity());
    }

    static RotationX(angle=0) : Matrix {
        return new Matrix(rotationAroundX(angle));
    }

    static RotationY(angle=0) : Matrix {
        return new Matrix(rotationAroundY(angle));
    }

    static RotationZ(angle=0) : Matrix {
        return new Matrix(rotationAroundZ(angle));
    }

    static Translation(
        x: number | Buffer | Position | Direction = 0,
        y: number = 0,
        z: number = 0
    ) : Matrix {
        return new Matrix(translation(x, y, z, true));
    }

    static Projection(
        fov: number,
        aspect: number,
        near: number,
        far: number
    ) : Matrix {
        return new Matrix(projection(fov, aspect, near, far, true));
    }

    static PointAt(pos: Position, target: Position, up: Direction) : Matrix {
        const forward = pos.to(target).normalize(); // Calculate new forward direction
        const new_up = up.minus(forward.times(up.dot(forward))).normalize(); // Calculate new Up direction
        const right = new_up.cross(forward); // New Right direction is easy, its just cross product
        const mat = Matrix.of(right, new_up, forward, pos);

        // Construct Dimensioning and Translation Matrix
        let matrix: Matrix = mat(
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        );

        matrix[0][0] = newRight.x;
        matrix[0][1] = newRight.y;
        matrix[0][2] = newRight.z;
        matrix[0][3] = 0.0;

        matrix[1][0] = newUp.x;
        matrix[1][1] = newUp.y;
        matrix[1][2] = newUp.z;
        matrix[1][3] = 0.0;

        matrix[2][0] = newForward.x;
        matrix[2][1] = newForward.y;
        matrix[2][2] = newForward.z;
        matrix[2][3] = 0.0;

        matrix[3][0] = pos.x;
        matrix[3][1] = pos.y;
        matrix[3][2] = pos.z;
        matrix[3][3] = 1.0;

        return matrix;
    }
}

export const mat = (
    m0?: Buffer | VectorArray | MatrixArray | MatrixVectorArrays | MatrixVectorBuffers | Matrix,
    m1?: Buffer | VectorArray,
    m2?: Buffer | VectorArray,
    m3?: Buffer | VectorArray
) : Matrix => {
    if (m0 === undefined)
        return new Matrix();

    if (m0 instanceof Matrix)
        return new Matrix(m0.buffer);

    if (m0 instanceof Buffer) {
        if (m0.length === MatrixBufferLength)
            return new Matrix(m0);

        if (m0.length === VectorBufferLength) {
            const matrix = new Matrix();
            matrix.setTo(m0, m1, m2, m3);
            return matrix;
        }
    }

    if (Array.isArray(m0)) {
        if (m0.length === MatrixBufferLength && m0.every(n => typeof n === 'number'))
            return new Matrix(Buffer.from(m0));

        if (m0.length === VectorBufferLength) {
            const matrix = new Matrix();
            matrix.setTo(m0, m1, m2, m3);
            return matrix;
        }
    }

    throw `Invalid arguments ${m0} ${m1} ${m2} ${m3}`;
};