import {vec3d, Vector_CrossProduct, Vector_DotProduct, Vector_Mul, Vector_Normalize, Vector_Sub} from "./vec.js";

type mat4x4column = [
    number,
    number,
    number,
    number
];

export type mat4x4 = [
    mat4x4column,
    mat4x4column,
    mat4x4column,
    mat4x4column
];

export const Matrix_MultiplyVector = (m: mat4x4, i: vec3d): vec3d => new vec3d(
    i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + i.w * m[3][0],
    i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + i.w * m[3][1],
    i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + i.w * m[3][2],
    i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + i.w * m[3][3]
);

export const Matrix_MakeIdentity = (): mat4x4 => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];

export const Matrix_MakeTranslation = (x: number, y: number, z: number): mat4x4 => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1],
];

export const Matrix_MakeRotationX = (angleRad: number): mat4x4 => [
    [1, 0, 0, 0],
    [0, Math.cos(angleRad), Math.sin(angleRad), 0],
    [0, -Math.sin(angleRad), Math.cos(angleRad), 0],
    [0, 0, 0, 1]
];

export const Matrix_MakeRotationY = (angleRad: number): mat4x4 => [
    [Math.cos(angleRad), 0, Math.sin(angleRad), 0],
    [0, 1, 0, 0],
    [-Math.sin(angleRad), 0, Math.cos(angleRad), 0],
    [0, 0, 0, 1]
];

export const Matrix_MakeRotationZ = (angleRad: number): mat4x4 => [
    [Math.cos(angleRad), Math.sin(angleRad), 0, 0],
    [-Math.sin(angleRad), Math.cos(angleRad), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];

export const Matrix_MakeProjection = (
    fovDegrees: number,
    aspectRatio: number,
    near: number,
    far: number
): mat4x4 => {
    const fovRad = 1.0 / Math.tan(fovDegrees * 0.5 / 180 * Math.PI);
    return [
        [fovRad * aspectRatio, 0, 0, 0],
        [0, fovRad, 0, 0],
        [0, 0, far / (far - near), 1],
        [0, 0, (-far * near) / (far - near), 0]
    ];
};

export const Matrix_MultiplyMatrix = (m1: mat4x4, m2: mat4x4): mat4x4 => {
    const result: mat4x4 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

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

export const Matrix_PointAt = (
    p: vec3d,
    t: vec3d,
    in_up: vec3d
): mat4x4 => {
    const f = Vector_Normalize(Vector_Sub(t, p));

    // Calculate new Up direction
    const u = Vector_Normalize(
        Vector_Sub(in_up, Vector_Mul(f, Vector_DotProduct(in_up, f)))
    );

    // Now Right direction is easy, it's just cross product
    const r = Vector_CrossProduct(u, f);

    return [
        [r.x, r.y, r.z, 0],
        [u.x, u.y, u.z, 0],
        [f.x, f.y, f.z, 0],
        [p.x, p.y, p.z, 1]
    ];
};

export const Matrix_QuickInverse = (m: mat4x4): mat4x4 => [
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
];