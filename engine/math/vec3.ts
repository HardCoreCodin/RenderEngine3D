import {PRECISION_DIGITS} from "../constants.js";
import {f_n, f_v, ff_b, ff_n, ff_v, fff_v, ffnf_v, Vector3DValues, Matrix3x3Values, fn_v, fnf_v} from "../types.js";
import {AbstractVector, ColorMixin} from "./vec.js";
import {BaseMatrix} from "./base.js";

let temp_number: number;
const temp_lhs = new Float32Array(3);
const temp_rhs = new Float32Array(3);
const temp_matrix = new Float32Array(9);

export const length : f_n = (
    a: Vector3DValues, i: number
) : number => Math.hypot(
    a[0][i],
    a[1][i],
    a[2][i]
);

export const distance : ff_n = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number
) : number => Math.hypot(
    (b[0][j] - a[0][i]),
    (b[1][j] - a[1][i]),
    (b[2][j] - a[2][i])
);

export const length_squared : f_n = (
    a: Vector3DValues, i: number
) : number => (
    a[0][i]**2 +
    a[1][i]**2 +
    a[2][i]**2
);

export const distance_squared : ff_n = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number
) : number => (
    (b[0][j] - a[0][i])**2 +
    (b[1][j] - a[1][i])**2 +
    (b[2][j] - a[2][i])**2
);

export const equals : ff_b = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number
) : boolean => {
    if (i === j && ((Object.is(a, b)) || (
        (Object.is(a[0], b[0]) || Object.is(a[0].buffer, b[0].buffer)) &&
        (Object.is(a[1], b[1]) || Object.is(a[1].buffer, b[1].buffer)) &&
        (Object.is(a[2], b[2]) || Object.is(a[2].buffer, b[2].buffer))
    ))) return true;

    if (a[0][i].toFixed(PRECISION_DIGITS) !== b[0][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[1][i].toFixed(PRECISION_DIGITS) !== b[1][j].toFixed(PRECISION_DIGITS)) return false;
    if (a[2][i].toFixed(PRECISION_DIGITS) !== b[2][j].toFixed(PRECISION_DIGITS)) return false;

    return true;
};

export const linearly_interpolate: ffnf_v = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number, t: number,
    o: Vector3DValues, k: number
) : void => {
    o[0][k] = (1-t)*a[0][i] + t*(b[0][j]);
    o[1][k] = (1-t)*a[1][i] + t*(b[1][j]);
    o[2][k] = (1-t)*a[2][i] + t*(b[2][j]);
};

export const add : fff_v = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number,
    o: Vector3DValues, k: number
) : void => {
    o[0][k] = a[0][i] + b[0][j];
    o[1][k] = a[1][i] + b[1][j];
    o[2][k] = a[2][i] + b[2][j];
};

export const add_in_place : ff_v = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number
) : void => {
    a[0][i] += b[0][j];
    a[1][i] += b[1][j];
    a[2][i] += b[2][j];
};

export const subtract : fff_v = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number,
    o: Vector3DValues, k: number
) : void => {
    o[0][k] = a[0][i] - b[0][j];
    o[1][k] = a[1][i] - b[1][j];
    o[2][k] = a[2][i] - b[2][j];
};

export const subtract_in_place : ff_v = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number
) : void => {
    a[0][i] -= b[0][j];
    a[1][i] -= b[1][j];
    a[2][i] -= b[2][j];
};

export const divide : fnf_v = (
    a: Vector3DValues, i: number, n: number,
    o: Vector3DValues, k: number
) : void => {
    o[0][k] = a[0][i] / n;
    o[1][k] = a[1][i] / n;
    o[2][k] = a[2][i] / n;
};

export const divide_in_place : fn_v = (
    a: Vector3DValues, i: number, n: number
) : void => {
    a[0][i] /= n;
    a[1][i] /= n;
    a[2][i] /= n;
};

export const scale : fnf_v = (
    a: Vector3DValues, i: number, n: number,
    o: Vector3DValues, k: number
) : void => {
    o[0][k] = a[0][i] * n;
    o[1][k] = a[1][i] * n;
    o[2][k] = a[2][i] * n;
};

export const scale_in_place : fn_v = (
    a: Vector3DValues, i: number, n: number
) : void => {
    a[0][i] *= n;
    a[1][i] *= n;
    a[2][i] *= n;
};

export const normalize : ff_v = (
    a: Vector3DValues, i: number,
    o: Vector3DValues, k: number
) : void => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i]);

    o[0][k] = a[0][i] / temp_number;
    o[1][k] = a[1][i] / temp_number;
    o[2][k] = a[2][i] / temp_number;
};

export const normalize_in_place : f_v = (
    a: Vector3DValues, i: number
) : void => {
    temp_number = Math.hypot(a[0][i], a[1][i], a[2][i]);

    a[0][i] /= temp_number;
    a[1][i] /= temp_number;
    a[2][i] /= temp_number;
};

export const dot : ff_n = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number
) : number => (
    a[0][i] * b[0][j] +
    a[1][i] * b[1][j] +
    a[2][i] * b[2][j]
);

export const cross : fff_v = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number,
    o: Vector3DValues, k: number
) : void => {
    if (
        (
            k === i && (
                (Object.is(o, a)) || (
                    (Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
                    (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
                    (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer))
                )
            )
        ) || (
            k === j && (
                (Object.is(o, b)) || (
                    (Object.is(o[0], b[0]) || Object.is(o[0].buffer, b[0].buffer)) &&
                    (Object.is(o[1], b[1]) || Object.is(o[1].buffer, b[1].buffer)) &&
                    (Object.is(o[2], b[2]) || Object.is(o[2].buffer, b[2].buffer))
                )
            )
        )
    ) throw `Can not cross - shared buffer detected! (Use cross_in_place)`;

    o[0][k] = a[1][i]*b[2][j] - a[2][i]*b[1][j];
    o[1][k] = a[2][i]*b[0][j] - a[0][i]*b[2][j];
    o[2][k] = a[0][i]*b[1][j] - a[1][i]*b[0][j];
};

export const cross_in_place : ff_v = (
    a: Vector3DValues, i: number,
    b: Vector3DValues, j: number
) : void => {
    temp_lhs[0] = a[0][i];
    temp_lhs[1] = a[1][i];
    temp_lhs[2] = a[2][i];

    temp_rhs[0] = b[0][j];
    temp_rhs[1] = b[1][j];
    temp_rhs[2] = b[2][j];

    a[0][i] = temp_lhs[1]*temp_rhs[2] - temp_lhs[2]*temp_rhs[1];
    a[1][i] = temp_lhs[2]*temp_rhs[0] - temp_lhs[0]*temp_rhs[2];
    a[2][i] = temp_lhs[0]*temp_rhs[1] - temp_lhs[1]*temp_rhs[0];
};

export const multiply : fff_v = (
    a: Vector3DValues, i: number,
    b: Matrix3x3Values, j: number,
    o: Vector3DValues, k: number
) : void => {
    if (k === i && (
            (Object.is(o, a)) || (
                (Object.is(o[0], a[0]) || Object.is(o[0].buffer, a[0].buffer)) &&
                (Object.is(o[1], a[1]) || Object.is(o[1].buffer, a[1].buffer)) &&
                (Object.is(o[2], a[2]) || Object.is(o[2].buffer, a[2].buffer))
            )
        )
    ) throw `Can not multiply - shared buffer detected! (Use matrix_multiply_in_place)`;

    o[0][k] = a[0][i]*b[0][j] + a[1][i]*b[3][j] + a[2][i]*b[6][j];
    o[1][k] = a[0][i]*b[1][j] + a[1][i]*b[4][j] + a[2][i]*b[7][j];
    o[2][k] = a[0][i]*b[2][j] + a[1][i]*b[5][j] + a[2][i]*b[8][j];
};

export const multiply_in_place : ff_v = (
    a: Vector3DValues, i: number,
    b: Matrix3x3Values, j: number
) : void => {
    temp_lhs[0] = a[0][i];
    temp_lhs[1] = a[1][i];
    temp_lhs[2] = a[2][i];

    temp_matrix[0] = b[0][j];
    temp_matrix[1] = b[1][j];
    temp_matrix[2] = b[2][j];

    temp_matrix[3] = b[3][j];
    temp_matrix[4] = b[4][j];
    temp_matrix[5] = b[5][j];

    temp_matrix[6] = b[6][j];
    temp_matrix[7] = b[7][j];
    temp_matrix[8] = b[8][j];

    a[0][i] = temp_lhs[0]*temp_matrix[0] + temp_lhs[1]*temp_matrix[3] + temp_lhs[2]*temp_matrix[6];
    a[1][i] = temp_lhs[0]*temp_matrix[1] + temp_lhs[1]*temp_matrix[4] + temp_lhs[2]*temp_matrix[7];
    a[2][i] = temp_lhs[0]*temp_matrix[2] + temp_lhs[1]*temp_matrix[5] + temp_lhs[2]*temp_matrix[8];
};

export class Vector3D extends AbstractVector {
    public arrays: Vector3DValues;
    protected _dim: number = 3;

    lerp(to: this, by: number, out: this): this {
        linearly_interpolate(
            this.arrays,
            this.id,

            to.arrays,
            to.id,

            by,

            out.arrays,
            out.id
        );

        return out;
    }

    add(other: this): this {
        add_in_place(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );

        return this;
    }

    sub(other: this): this {
        subtract_in_place(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );

        return this;
    }

    div(denominator: number): this {
        divide_in_place(
            this.arrays,
            this.id,

            denominator
        );

        return this;
    }

    mul(factor_or_matrix: number | BaseMatrix): this {
        if (typeof factor_or_matrix === 'number')
            scale_in_place(
                this.arrays,
                this.id,

                factor_or_matrix
            );
        else
            multiply_in_place(
                this.arrays,
                this.id,

                factor_or_matrix.arrays,
                factor_or_matrix.id
            );

        return this;
    }

    plus(other: this, out: this): this {
        add(
            this.arrays,
            this.id,

            other.arrays,
            other.id,

            out.arrays,
            out.id
        );

        return out;
    }

    minus(other: this, out: this): this {
        subtract(
            this.arrays,
            this.id,

            other.arrays,
            other.id,

            out.arrays,
            out.id
        );

        return out;
    }

    over(denominator: number, out: this): this {
        divide(
            this.arrays,
            this.id,

            denominator,

            out.arrays,
            out.id
        );

        return out;
    }

    times(factor_or_matrix: number | BaseMatrix, out: this): this {
        if (typeof factor_or_matrix === 'number')
            scale(
                this.arrays,
                this.id,

                factor_or_matrix,

                out.arrays,
                out.id
            );
        else
            multiply(
                this.arrays,
                this.id,

                factor_or_matrix.arrays,
                factor_or_matrix.id,

                out.arrays,
                out.id
            );

        return out;
    }

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}
}

export class Position3D extends Vector3D {
    get length(): number {
        return length(
            this.arrays,
            this.id
        );
    }

    get length_squared(): number {
        return length_squared(
            this.arrays,
            this.id
        );
    }

    dot(other: this): number {
        return dot(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );
    }

    normalize(): this {
        normalize_in_place(
            this.arrays,
            this.id
        );

        return this;
    }

    normalized(out: this): this {
        normalize(
            this.arrays,
            this.id,

            out.arrays,
            out.id
        );

        return out;
    }

    squaredDistanceTo(other: this): number {
        return distance_squared(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );
    }

    distanceTo = (other: this) : number => distance(
        this.arrays,
        this.id,

        other.arrays,
        other.id
    );

    to(other: this, out: Direction3D): Direction3D {
        subtract(
            other.arrays,
            other.id,

            this.arrays,
            this.id,

            out.arrays,
            out.id
        );

        return out;
    }
}

export class Direction3D extends Vector3D {
    cross(other: this): this {
        cross_in_place(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );

        return this;
    }

    crossedWith(other: this, out: this): this {
        cross(
            this.arrays,
            this.id,

            other.arrays,
            other.id,

            out.arrays,
            out.id
        );

        return out;
    }
}

export class UV3D extends Vector3D {
    set u(u: number) {this.arrays[0][this.id] = u}
    set v(v: number) {this.arrays[1][this.id] = v}
    set w(w: number) {this.arrays[2][this.id] = w}

    get u(): number {return this.arrays[0][this.id]}
    get v(): number {return this.arrays[1][this.id]}
    get w(): number {return this.arrays[2][this.id]}
}

export class Color3D extends ColorMixin(Vector3D) {
    set r(r: number) {this.arrays[0][this.id] = r}
    set g(g: number) {this.arrays[1][this.id] = g}
    set b(b: number) {this.arrays[2][this.id] = b}

    get r(): number {return this.arrays[0][this.id]}
    get g(): number {return this.arrays[1][this.id]}
    get b(): number {return this.arrays[2][this.id]}
}