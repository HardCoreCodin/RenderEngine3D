export class vec3d {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 1
    ) {
    }
}

export const Vector_Add = (
    v1: vec3d,
    v2: vec3d
): vec3d => new vec3d(
    v1.x + v2.x,
    v1.y + v2.y,
    v1.z + v2.z
);
export const Vector_Sub = (
    v1: vec3d,
    v2: vec3d
): vec3d => new vec3d(
    v1.x - v2.x,
    v1.y - v2.y,
    v1.z - v2.z
);
export const Vector_Mul = (
    v: vec3d,
    k: number
): vec3d => new vec3d(
    v.x * k,
    v.y * k,
    v.z * k
);
export const Vector_Div = (
    v: vec3d,
    k: number
): vec3d => new vec3d(
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
): vec3d => new vec3d(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x
);
const Vector_Length = (v: vec3d): number => Math.sqrt(Vector_DotProduct(v, v));
export const Vector_Normalize = (v: vec3d): vec3d => Vector_Div(v, Vector_Length(v));