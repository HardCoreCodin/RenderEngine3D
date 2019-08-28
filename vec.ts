export type NumberArray = [number, number, number, number];

export class vec3d {
    constructor(
        public a = Float32Array.of(0, 0, 0, 1)
    ) {}

    copy() : vec3d {
        return new vec3d(Float32Array.from(this.a));
    }

    static fromOther(other: vec3d) : vec3d {
        return new vec3d(other.a);
    }

    static of(
        x: number = 0,
        y: number = 0,
        z: number = 0,
        w: number = 1
    ) {
        return new vec3d(Float32Array.of(z, y, z, w));
    }

    get x() {return this.a[0]}
    get y() {return this.a[1]}
    get z() {return this.a[2]}
    get w() {return this.a[3]}

    set x(x) {this.a[0] = x}
    set y(y) {this.a[1] = y}
    set z(z) {this.a[2] = z}
    set w(w) {this.a[3] = w}

    get length() : number {
        const [x, y, z] = this.a;
        return Math.sqrt(x*x + y*y + z*z);
    }

    get norm() : vec3d {
        const [x, y, z, w] = this.a;
        const l = this.length;
        return new vec3d(
            Float32Array.of(
                x / l,
                y / l,
                z / l,
                w / l
            )
        );
    }

    add(other: vec3d) : vec3d {
        add(this.a, other.a);
        return this;
    }
    plus(other: vec3d) : vec3d {
        return new vec3d(plus(this.a, other.a));
    }

    sub(other: vec3d) : vec3d {
        sub(this.a, other.a);
        return this;
    }
    minus(other: vec3d) : vec3d {
        return new vec3d(minus(this.a, other.a));
    }

    div(other: number) : vec3d {
        div(this.a, other);
        return this;
    }
    over(other: number) : vec3d {
        return new vec3d(over(this.a, other));
    }

    dot(other: vec3d) : number {
        return dot(this.a, other.a);
    }
    cross(other: vec3d) : vec3d {
        return new vec3d(cross(this.a, other.a));
    }
}

export const vec = (
    x: vec3d | Float32Array | number[] | number,
    y: number = 0,
    z: number = 0,
    w: number = 1
) : vec3d => {
    if (x instanceof vec3d) return vec3d.fromOther(x);
    if (x instanceof Float32Array) return new vec3d(Float32Array.of(...x));
    if (Array.isArray(x)) return vec3d.of(...x);
    return vec3d.of(x, y, z, w);
};

export const add = (
    v1: Float32Array,
    v2: Float32Array
) : Float32Array => {
    v1[0] += v2[0];
    v1[1] += v2[1];
    v1[2] += v2[2];
    v1[3] += v2[3];

    return v1;
};
export const plus = (
    v1: Float32Array,
    v2: Float32Array
) : Float32Array => Float32Array.of(
    v1[0] + v2[0],
    v1[1] + v2[1],
    v1[2] + v2[2],
    v1[3] + v2[3],
);

export const sub = (
    v1: Float32Array,
    v2: Float32Array
) : Float32Array => {
    v1[0] -= v2[0];
    v1[1] -= v2[1];
    v1[2] -= v2[2];
    v1[3] -= v2[3];

    return v1;
};
export const minus = (
    v1: Float32Array,
    v2: Float32Array
) : Float32Array => Float32Array.of(
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2],
    v1[3] - v2[3],
);

export const div = (
    v: Float32Array,
    k: number
) : Float32Array => {
    v[0] /= k;
    v[1] /= k;
    v[2] /= k;
    v[3] /= k;

    return v;
};
export const over = (
    v: Float32Array,
    k: number
) : Float32Array => Float32Array.of(
    v[0] / k,
    v[1] / k,
    v[2] / k,
    v[3] / k,
);

export const dot = (
    v1: Float32Array,
    v2: Float32Array
) : number => v1[0]*v2[0] + v1[1]*v2[1] +v1[2]*v2[2];

export const cross = (
    v1: Float32Array,
    v2: Float32Array
) : Float32Array => Float32Array.of(
    v1[1]*v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0]
);














export const Vector_Add = (
    v1: vec3d,
    v2: vec3d
): vec3d => vec3d.of(
    v1.x + v2.x,
    v1.y + v2.y,
    v1.z + v2.z
);
export const Vector_Sub = (
    v1: vec3d,
    v2: vec3d
): vec3d => vec3d.of(
    v1.x - v2.x,
    v1.y - v2.y,
    v1.z - v2.z
);
export const Vector_Mul = (
    v: vec3d,
    k: number
): vec3d => vec3d.of(
    v.x * k,
    v.y * k,
    v.z * k
);
export const Vector_Div = (
    v: vec3d,
    k: number
): vec3d => vec3d.of(
    v.x / k,
    v.y / k,
    v.z / k
);
export const Vector_DotProduct = (
    v1: vec3d,
    v2: vec3d
): number => (
    v1.x * v2.x +
    v1.y * v2.y +
    v1.z * v2.z
);
export const Vector_CrossProduct = (
    v1: vec3d,
    v2: vec3d
): vec3d => vec3d.of(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x
);
const Vector_Length = (v: vec3d): number => Math.sqrt(Vector_DotProduct(v, v));
export const Vector_Normalize = (v: vec3d): vec3d => Vector_Div(v, Vector_Length(v));