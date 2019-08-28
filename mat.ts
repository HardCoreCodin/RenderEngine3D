import {NumberArray, vec, vec3d, Vector_CrossProduct, Vector_DotProduct, Vector_Mul, Vector_Normalize, Vector_Sub} from "./vec.js";

type mat4x4FloatArrays = [
    Float32Array,
    Float32Array,
    Float32Array,
    Float32Array
];

export class mat4x4 {
    private m = new Float32Array(16);
    public m0 = this.m.subarray(0, 4);
    public m1 = this.m.subarray(4, 8);
    public m2 = this.m.subarray(8, 12);
    public m3 = this.m.subarray(12, 16);

    private trig = new Float32Array(2);

    copy = () : mat4x4 => new mat4x4().setTo(this);

    static refOther = (other: mat4x4) : mat4x4 => new mat4x4(
        other.m0,
        other.m1,
        other.m2,
        other.m3
    );

    static fromNumberArrays(
        t0: NumberArray = [1, 0, 0, 0],
        t1: NumberArray = [0, 1, 0, 0],
        t2: NumberArray = [0, 0, 1, 0],
        t3: NumberArray = [0, 0, 0, 1]
    ) : mat4x4 {
        const matrix = new mat4x4();

        const [m0, m1, m2, m3] = [matrix.m0, matrix.m1, matrix.m2, matrix.m3];

        if (Array.isArray(t0)) [m0[0], m0[1], m0[2], m0[3]] = [t0[0], t0[1], t0[2], t0[3]];
        if (Array.isArray(t1)) [m1[0], m1[1], m1[2], m1[3]] = [t1[0], t1[1], t1[2], t1[3]];
        if (Array.isArray(t2)) [m2[0], m2[1], m2[2], m2[3]] = [t2[0], t2[1], t2[2], t2[3]];
        if (Array.isArray(t3)) [m3[0], m3[1], m3[2], m3[3]] = [t3[0], t3[1], t3[2], t3[3]];

        return matrix;
    }

    static refFloatArrays = (...array: mat4x4FloatArrays) : mat4x4 => new mat4x4(...array);
    static fromArrayOfNumberArrays = (...array: NumberArray[]) : mat4x4 => mat4x4.fromNumberArrays(...array);

    static Identity = () : mat4x4 => new mat4x4().setToIdentity();
    static RotationX = (angle=0) : mat4x4 => new mat4x4().setRotationAroundX(angle, true);
    static RotationY = (angle=0) : mat4x4 => new mat4x4().setRotationAroundY(angle, true);
    static RotationZ = (angle=0) : mat4x4 => new mat4x4().setRotationAroundZ(angle, true);
    static Translation = (
        x: number | Float32Array | vec3d = 0,
        y: number = 0,
        z: number = 0
    ) : mat4x4 => new mat4x4().setTranslation(x, y, z, true);

    doTrig(angle: number) {
        this.trig[0] = Math.sin(angle);
        this.trig[1] = Math.cos(angle);

        return this.trig;
    }

    setTo(matrix: mat4x4) : mat4x4 {
        // const [
        //     [t0, t1, t2, t3],
        //     [m0, m1, m2, m3]
        // ] = [
        //     [this.m0, this.m1, this.m2, this.m3],
        //     [matrix.m0, matrix.m1, matrix.m2, matrix.m3]
        // ];
        // [
        //     [t0[0], t0[1], t0[2], t0[3]],
        //     [t1[0], t1[1], t1[2], t1[3]],
        //     [t2[0], t2[1], t2[2], t2[3]],
        //     [t3[0], t3[1], t3[2], t3[3]]
        // ] = [
        //     [m0[0], m0[1], m0[2], m0[3]],
        //     [m1[0], m1[1], m1[2], m1[3]],
        //     [m2[0], m2[1], m2[2], m2[3]],
        //     [m3[0], m3[1], m3[2], m3[3]]
        // ];

        return this;
    }

    setToIdentity() : mat4x4 {
        this.m0.fill(0);
        this.m1.fill(0);
        this.m2.fill(0);
        this.m3.fill(0);

        this.m0[0] = 1;
        this.m1[1] = 1;
        this.m2[3] = 1;
        this.m3[4] = 1;

        return this;
    };

    setRotationAroundX(angle: number, reset=false) : mat4x4 {
        if (reset)
            this.setToIdentity();
        [
            this.m1[2], // sin(angle)
            this.m1[1]  // con(angle)
        ] = [
            this.m2[1], // sin(angle)
            this.m2[2]  // con(angle)
        ] = this.doTrig(angle);

        this.m2[1] *= -1;

        return this;
    }

    setRotationAroundY(angle: number, reset=false) : mat4x4 {
        if (reset)
            this.setToIdentity();

        [
            this.m0[2], // sin(angle)
            this.m0[0]  // con(angle)
        ] = [
            this.m2[0], // sin(angle)
            this.m2[2]  // con(angle)
        ] = this.doTrig(angle);

        this.m2[0] *= -1;

        return this;
    }

    setRotationAroundZ(angle: number, reset=false) : mat4x4 {
        if (reset)
            this.setToIdentity();

        [
            this.m0[1], // sin(angle)
            this.m0[0]  // con(angle)
        ] = [
            this.m1[0], // sin(angle)
            this.m1[1]  // con(angle)
        ] = this.doTrig(angle);

        this.m1[0] *= -1;

        return this;
    }

    setTranslation(
        x: number | Float32Array | vec3d,
        y: number,
        z: number,
        reset=false
    ) : mat4x4 {
        if (reset)
            this.setToIdentity();

        if (x instanceof Float32Array) {
            this.m3 = x;
            return this;
        }

        if (x instanceof vec3d) {
            this.m3 = x.a;
            return this;
        }

        if (Number.isFinite(x)) [
            this.m3[0],
            this.m3[1],
            this.m3[2],
            this.m3[3]
        ] = [x, y, z, 1];

        return this;
    }

    mul(lhs: mat4x4) {

        for (let c = 0; c < 4; c++)
            for (let r = 0; r < 4; r++)
                result[r][c] = (
                    m1[r][0] * m2[0][c] +
                    m1[r][1] * m2[1][c] +
                    m1[r][2] * m2[2][c] +
                    m1[r][3] * m2[3][c]
                );

        return result;
    }
}

export const mat = (
    m0: Float32Array | NumberArray | mat4x4,
    m1: Float32Array | NumberArray,
    m2: Float32Array | NumberArray,
    m3: Float32Array | NumberArray,
    copy=true
) : mat4x4 =>  {
    if (m0 instanceof mat4x4)
        return copy ?
            new mat4x4().setTo(m0) :
            mat4x4.refOther(m0);

    if (m0 instanceof Float32Array &&
        m1 instanceof Float32Array &&
        m2 instanceof Float32Array &&
        m3 instanceof Float32Array
    ) return copy ?
        new mat4x4(m0, m1, m2, m3) :
        mat4x4.refFloatArrays(m0, m1, m2, m3) ;

    // @ts-ignore
    return mat4x4.fromNumberArrays(m0, m1, m2, m3);
};

const vecmul = (
    m0: Float32Array,
    m1: Float32Array,
    m2: Float32Array,
    m3: Float32Array,
    v: Float32Array
) : Float32Array => Float32Array.of(
    v[0] * m0[0] + v[1] * m1[0] + v[2] * m2[0] + v[3] * m3[0],
    v[0] * m0[1] + v[1] * m1[1] + v[2] * m2[1] + v[3] * m3[1],
    v[0] * m0[2] + v[1] * m1[2] + v[2] * m2[2] + v[3] * m3[2],
    v[0] * m0[3] + v[1] * m1[3] + v[2] * m2[3] + v[3] * m3[3]
);

const matmul = (
    lhs_m0: Float32Array,
    lhs_m1: Float32Array,
    lhs_m2: Float32Array,
    lhs_m3: Float32Array,

    rhs_m0: Float32Array,
    rhs_m1: Float32Array,
    rhs_m2: Float32Array,
    rhs_m3: Float32Array,

    out_m0: Float32Array,
    out_m1: Float32Array,
    out_m2: Float32Array,
    out_m3: Float32Array,
) => {
    out_m0[0] = lhs_m0[0] * rhs_m[0] + lhs_m0[1] * rhs_m[4] + lhs_m0[2] * rhs_m0[8] + lhs_m[3] * rhs_m[12];
    out_m0[1] = lhs_m0[0] * rhs_m[1] + lhs_m0[1] * rhs_m[5] + lhs_m0[2] * rhs_m0[9] + lhs_m[3] * rhs_m[13];
    out_m0[2] = lhs_m0[0] * rhs_m[2] + lhs_m0[1] * rhs_m[6] + lhs_m0[2] * rhs_m0[10] + lhs_m[3] * rhs_m[14];
    out_m0[3] = lhs_m0[0] * rhs_m[3] + lhs_m0[1] * rhs_m[7] + lhs_m0[2] * rhs_m0[11] + lhs_m[3] * rhs_m[15];

    out_m1[0] = lhs_m[4] * rhs_m[0] + lhs_m[5] * rhs_m[4] + lhs_m[6] * rhs_m[8] + lhs_m[7] * rhs_m[12];
    out_m1[1]= lhs_m[4] * rhs_m[1] + lhs_m[5] * rhs_m[5] + lhs_m[6] * rhs_m[9] + lhs_m[7] * rhs_m[13];
    out_m1[2]= lhs_m[4] * rhs_m[2] + lhs_m[5] * rhs_m[6] + lhs_m[6] * rhs_m[10] + lhs_m[7] * rhs_m[14];
    out_m1[3]= lhs_m[4] * rhs_m[3] + lhs_m[5] * rhs_m[7] + lhs_m[6] * rhs_m[11] + lhs_m[7] * rhs_m[15];

    out_m2[0]= lhs_m[8] * rhs_m[0] + lhs_m[9] * rhs_m[4] + lhs_m[10] * rhs_m[8] + lhs_m[11] * rhs_m[12];
    out_m2[1]= lhs_m[8] * rhs_m[1] + lhs_m[9] * rhs_m[5] + lhs_m[10] * rhs_m[9] + lhs_m[11] * rhs_m[13];
    out_m2[2] = lhs_m[8] * rhs_m[2] + lhs_m[9] * rhs_m[6] + lhs_m[10] * rhs_m[10] + lhs_m[11] * rhs_m[14];
    out_m2[3]= lhs_m[8] * rhs_m[3] + lhs_m[9] * rhs_m[7] + lhs_m[10] * rhs_m[11] + lhs_m[11] * rhs_m[15];

    out_m3[0]= lhs_m[12] * rhs_m[0] + lhs_m[13] * rhs_m[4] + lhs_m[14] * rhs_m[8] + lhs_m[15] * rhs_m[12];
    out_m3[1]= lhs_m[12] * rhs_m[1] + lhs_m[13] * rhs_m[5] + lhs_m[14] * rhs_m[9] + lhs_m[15] * rhs_m[13];
    out_m3[2]= lhs_m[12] * rhs_m[2] + lhs_m[13] * rhs_m[6] + lhs_m[14] * rhs_m[10] + lhs_m[15] * rhs_m[14];
    out_m3[3]= lhs_m[12] * rhs_m[3] + lhs_m[13] * rhs_m[7] + lhs_m[14] * rhs_m[11] + lhs_m[15] * rhs_m[15];

    out_m0[0] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m0[1] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m0[2] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m0[3] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];

    out_m1[0] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m1[1] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m1[2] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m1[3] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];

    out_m2[0] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m2[1] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m2[2] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m2[3] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];

    out_m3[0] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m3[1] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m3[2] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
    out_m3[3] = lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0] + lhs_m0[0] * rhs_m0[0];
};
    for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
    out[r][c] = (
        lhs[r][0] * rhs[0][c] +
        lhs[r][1] * rhs[1][c] +
        lhs[r][2] * rhs[2][c] +
        lhs[r][3] * rhs[3][c]
    );
];

export const Matrix_MultiplyVector = (m: mat4x4, i: vec3d): vec3d => vec(
    i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + i.w * m[3][0],
    i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + i.w * m[3][1],
    i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + i.w * m[3][2],
    i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + i.w * m[3][3]
);

export const Matrix_MakeProjection = (
    fovDegrees: number,
    aspectRatio: number,
    near: number,
    far: number
): mat4x4 => {
    const fovRad = 1.0 / Math.tan(fovDegrees * 0.5 / 180 * Math.PI);
    return mat(
        [fovRad * aspectRatio, 0, 0, 0],
        [0, fovRad, 0, 0],
        [0, 0, far / (far - near), 1],
        [0, 0, (-far * near) / (far - near), 0]
    );
};

export const Matrix_MultiplyMatrix = (m1: mat4x4, m2: mat4x4): mat4x4 => {
    const result: mat4x4 = mat(
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    );

    for (let c = 0; c < 4; c++)
        for (let r = 0; r < 4; r++)
            result[r][c] = (
                m1[r][0] * m2[0][c] +
                m1[r][1] * m2[1][c] +
                m1[r][2] * m2[2][c] +
                m1[r][3] * m2[3][c]
            );

    return result;
};

export const Matrix_PointAt = (pos: vec3d, target: vec3d, up: vec3d) : mat4x4 =>
{
    // Calculate new forward direction
    let newForward = Vector_Sub(target, pos);
    newForward = Vector_Normalize(newForward);

    // Calculate new Up direction
    let a = Vector_Mul(newForward, Vector_DotProduct(up, newForward));
    let newUp = Vector_Sub(up, a);
    newUp = Vector_Normalize(newUp);

    // New Right direction is easy, its just cross product
    let newRight = Vector_CrossProduct(newUp, newForward);

    // Construct Dimensioning and Translation Matrix
    let matrix: mat4x4 = mat(
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    );

    matrix[0][0] = newRight.x;	matrix[0][1] = newRight.y;	matrix[0][2] = newRight.z;	matrix[0][3] = 0.0;
    matrix[1][0] = newUp.x;		matrix[1][1] = newUp.y;		matrix[1][2] = newUp.z;		matrix[1][3] = 0.0;
    matrix[2][0] = newForward.x;	matrix[2][1] = newForward.y;	matrix[2][2] = newForward.z;	matrix[2][3] = 0.0;
    matrix[3][0] = pos.x;			matrix[3][1] = pos.y;			matrix[3][2] = pos.z;			matrix[3][3] = 1.0;

    return matrix;
};

export const Matrix_QuickInverse = (m: mat4x4): mat4x4 => mat(
    [m[0][0], m[1][0], m[2][0], 0],
    [m[0][1], m[1][1], m[2][0], 0],
    [m[0][2], m[1][2], m[2][2], 0],
    [
        -(
            m[3][0] * m[0][0] +
            m[3][1] * m[0][1] +
            m[3][2] * m[0][2]
        ),
        -(
            m[3][0] * m[1][0] +
            m[3][1] * m[1][1] +
            m[3][2] * m[1][2]
        ),
        -(
            m[3][0] * m[2][0] +
            m[3][1] * m[2][1] +
            m[3][2] * m[2][2]
        ),
        1
    ],
);