import spaceship from './spaceship.js';
const copyRGBA = (color) => ({ r: color.r, g: color.g, b: color.b, a: color.a });
const getRGBAStyle = (color) => `rgba(${color.r * 255}, ${color.b * 255}, ${color.b * 255}, ${color.a * 255})`;
class vec3d {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
const Vector_Add = (v1, v2) => new vec3d(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
const Vector_Sub = (v1, v2) => new vec3d(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
const Vector_Mul = (v1, k) => new vec3d(v1.x * k, v1.y * k, v1.z * k);
const Vector_Div = (v1, k) => new vec3d(v1.x / k, v1.y / k, v1.z / k);
const Vector_DotProduct = (v1, v2) => (v1.x * v2.x +
    v1.y * v2.y +
    v1.z * v2.z);
const Vector_CrossProduct = (v1, v2) => new vec3d(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
const Vector_Length = (v) => Math.sqrt(Vector_DotProduct(v, v));
const Vector_Normalize = (v) => Vector_Div(v, Vector_Length(v));
const Matrix_MultiplyVector = (m, i) => new vec3d(i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + i.w * m[3][0], i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + i.w * m[3][1], i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + i.w * m[3][2], i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + i.w * m[3][3]);
const Matrix_MakeIdentity = () => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
];
const Matrix_MakeTranslation = (x, y, z) => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1],
];
const Matrix_MakeRotationX = (angleRad) => [
    [1, 0, 0, 0],
    [0, Math.cos(angleRad), Math.sin(angleRad), 0],
    [0, -Math.sin(angleRad), Math.cos(angleRad), 0],
    [0, 0, 0, 1]
];
const Matrix_MakeRotationY = (angleRad) => [
    [Math.cos(angleRad), 0, Math.sin(angleRad), 0],
    [0, 1, 0, 0],
    [-Math.sin(angleRad), 0, Math.cos(angleRad), 0],
    [0, 0, 0, 1]
];
const Matrix_MakeRotationZ = (angleRad) => [
    [Math.cos(angleRad), Math.sin(angleRad), 0, 0],
    [-Math.sin(angleRad), Math.cos(angleRad), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];
const Matrix_MakeProjection = (fovDegrees, aspectRatio, near, far) => {
    const fovRad = 1.0 / Math.tan(fovDegrees * 0.5 / 180 * Math.PI);
    return [
        [fovRad * aspectRatio, 0, 0, 0],
        [0, fovRad, 0, 0],
        [0, 0, far / (far - near), 1],
        [0, 0, (-far * near) / (far - near), 0]
    ];
};
// const Matrix_MakeProjection = (
//     aspectRatio: number,
//     focalLength: number = 0.5,
//     near: number = 0.1,
//     far: number = 1000
// ) : mat4x4 => {
//     const depth = far - near;
//     return [
//         [aspectRatio * 2 * near /focalLength, 0, 0, 0],
//         [0, 2 * near / focalLength, 0, 0],
//         [0, 0, far / depth, focalLength],
//         [0, 0, (-far * near) / depth, 0]
//     ];
// };
const Matrix_MultiplyMatrix = (m1, m2, result) => {
    if (result === undefined)
        result = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
    for (let c = 0; c < 4; c++)
        for (let r = 0; r < 4; r++)
            result[r][c] = (m1[r][0] * m2[0][c] +
                m1[r][1] * m2[1][c] +
                m1[r][2] * m2[2][c] +
                m1[r][3] * m2[3][c]);
    return result;
};
const default_color = { r: 1, g: 1, b: 1, a: 1 };
const copyVec3d = (v) => new vec3d(v.x, v.y, v.z, v.w);
const copyTriPoints = (tri) => [
    copyVec3d(tri[0]),
    copyVec3d(tri[1]),
    copyVec3d(tri[2])
];
const copyTri = (tri) => ({
    p: copyTriPoints(tri.p),
    col: tri.col ? copyRGBA(tri.col) : default_color
});
class mesh {
    constructor(tris = []) {
        this.tris = tris;
    }
    loadObj(obj) {
        const verts = [];
        let parts;
        for (const line of obj.split('\n')) {
            if (line[0] === 'v') {
                parts = line.split(' ');
                verts.push(new vec3d(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])));
            }
            if (line[0] === 'f') {
                parts = line.split(' ');
                this.tris.push({
                    p: [
                        verts[parseInt(parts[1]) - 1],
                        verts[parseInt(parts[2]) - 1],
                        verts[parseInt(parts[3]) - 1]
                    ]
                });
            }
        }
        return true;
    }
}
class Device {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext('2d');
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
        // this.context.beginPath();
    }
    present() {
        // this.context.closePath();
    }
    drawLine(start, end, color = default_color) {
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.strokeStyle = getRGBAStyle(color);
        this.context.stroke();
    }
    drawTriangle(tri) {
        this.context.beginPath();
        this.context.moveTo(tri.p[0].x, tri.p[0].y);
        this.context.lineTo(tri.p[1].x, tri.p[1].y);
        this.context.lineTo(tri.p[2].x, tri.p[2].y);
        this.context.lineTo(tri.p[0].x, tri.p[0].y);
        this.context.strokeStyle = getRGBAStyle(tri.col);
        this.context.stroke();
        this.context.closePath();
    }
    fillTriangle(tri) {
        this.context.beginPath();
        this.context.moveTo(tri.p[0].x, tri.p[0].y);
        this.context.lineTo(tri.p[1].x, tri.p[1].y);
        this.context.lineTo(tri.p[2].x, tri.p[2].y);
        this.context.fillStyle = getRGBAStyle(tri.col);
        this.context.fill();
        this.context.closePath();
    }
    render(meshes, vCamera, matProj, matWorld) {
        for (const m of meshes) {
            const trianglesToRaster = [];
            for (const tri of m.tris) {
                const triTransformed = { p: [
                        Matrix_MultiplyVector(matWorld, tri.p[0]),
                        Matrix_MultiplyVector(matWorld, tri.p[1]),
                        Matrix_MultiplyVector(matWorld, tri.p[2])
                    ] };
                const line1 = Vector_Sub(triTransformed.p[1], triTransformed.p[0]);
                const line2 = Vector_Sub(triTransformed.p[2], triTransformed.p[0]);
                const normal = Vector_Normalize(Vector_CrossProduct(line1, line2));
                const vCameraRay = Vector_Sub(triTransformed.p[0], vCamera);
                if (Vector_DotProduct(normal, vCameraRay) >= 0)
                    continue;
                const light_direction = Vector_Normalize(new vec3d(0, 1, -1));
                const dp = Math.max(0.1, Vector_DotProduct(light_direction, normal));
                triTransformed.col = {
                    r: dp,
                    g: dp,
                    b: dp,
                    a: 1
                };
                const triProjected = {
                    col: triTransformed.col,
                    p: [
                        Matrix_MultiplyVector(matProj, triTransformed.p[0]),
                        Matrix_MultiplyVector(matProj, triTransformed.p[1]),
                        Matrix_MultiplyVector(matProj, triTransformed.p[1])
                    ]
                };
                triProjected.p[0] = Vector_Div(triProjected.p[0], triProjected.p[0].w);
                triProjected.p[1] = Vector_Div(triProjected.p[1], triProjected.p[1].w);
                triProjected.p[2] = Vector_Div(triProjected.p[2], triProjected.p[2].w);
                const vOffsetView = new vec3d(1, 1);
                triProjected.p[0] = Vector_Add(triProjected.p[0], vOffsetView);
                triProjected.p[1] = Vector_Add(triProjected.p[1], vOffsetView);
                triProjected.p[2] = Vector_Add(triProjected.p[2], vOffsetView);
                triProjected.p[0].x *= 0.5 * this.width;
                triProjected.p[1].x *= 0.5 * this.width;
                triProjected.p[2].x *= 0.5 * this.width;
                triProjected.p[0].y *= 0.5 * this.height;
                triProjected.p[1].y *= 0.5 * this.height;
                triProjected.p[2].y *= 0.5 * this.height;
                trianglesToRaster.push(triProjected);
            }
            trianglesToRaster.sort((a, b) => (((a.p[0].z + a.p[1].z + a.p[2].z) / 3.0) >
                ((b.p[0].z + b.p[1].z + b.p[2].z) / 3.0)) ? 0 : 1);
            for (const tri of trianglesToRaster) {
                this.drawTriangle(tri);
                this.fillTriangle(tri);
            }
        }
    }
}
const meshCube = new mesh();
meshCube.loadObj(spaceship);
function init() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const device = new Device(canvas);
    const matProj = Matrix_MakeProjection(90.0, canvas.height / canvas.width, 0.1, 1000);
    // const matProj = Matrix_MakeProjection(canvas.height / canvas.width);
    let theta = 0;
    let vCamera = new vec3d();
    const perfectFrameTime = 1000 / 60;
    let deltaTime = 0;
    let lastTimestamp = 0;
    function drawingLoop(timestamp) {
        deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
        lastTimestamp = timestamp;
        theta += deltaTime / 60;
        const matRotX = Matrix_MakeRotationX(theta);
        const matRotZ = Matrix_MakeRotationZ(theta * 0.5);
        const matTrans = Matrix_MakeTranslation(0, 0, 16);
        const matWorld = Matrix_MultiplyMatrix(Matrix_MultiplyMatrix(matRotZ, matRotX), matTrans);
        device.clear();
        device.render([meshCube], vCamera, matProj, matWorld);
        device.present();
        requestAnimationFrame(drawingLoop);
    }
    requestAnimationFrame(drawingLoop);
}
document.addEventListener("DOMContentLoaded", init, false);
// Scan conversion:
// ================
// Loop over each triangle and scan through it to map it's pixel coordinates.
// Given the triangle ABC where:
// A = [x1, y1, z1]
// B = [x2, y2, z2]
// C = [x3, y3, z3]
//
// The triangle could then be:
// 1) Flat at the top.
// 2) Flat at the bottom.
// 3)
// 2) There is a single vertex at the bottom, and a flat edge at the top.
// 3) There is a single vertex at the top, and non-
// 1.A) There is a flat edge at the bottom.
// 1.B) There is no flat edge at the bottom.
// 2) There is a single vertex at the bottom.
// 2.A) There is a flat edge at the top.
// 2.B) There is no flat edge at the top.
// We first determine which vertex is the top one.
// If there are 2 of the, we pick the left one.
// For this example, we'll assume it's the vertex A.
// There will then be 2 edges connecting to that top vertex.
// going downward towards the other 2 vertices at points B and C.
// The 2 edges may not have the same height in y, so one of them could be longer.
// We pick the longer of the 2, and slide down along it, one unit of y at a time.
// For each such horizontal scan-line, we'll scan from the pixel touching/on-it,
// horizontally into the triangle, in single-pixel steps, until we reach the other edge.
// For each pixel we'll determine it's corresponding x, y, x coordinates in camera-space,
// as well as any other interpolated value.
// Because there could be a shorter edge at the other end of the scan-line,
// we'll often hit the other
// We start from the top-most vertex (left of it if there are 2),
// Then scan down the left edge.
// Given top vertex: A (x1, y1, z1)
// Scanning down towards: (x2, y2, z2)
// We consider a right-triangle formed by the 2 vertices and some point horizontal to
// We go along the edge, downwards to the next integer in y.
// and consider the small right-triangle ABC where::
// A = the point we're leaving from
// B = the point right below us on the next integer of y
// C = the next point on the edge
// The line BC is horizontal as B and C have the same y coordinates
// The triangle is "similar" to the once formed by the 2 vertices and a
//
// The coordinates of C will be:
// Cx = (x1 - x2) / (y1 - y2)
// The first right-triangle starts from the coordinates of the vertex:
// A = [x1, y1. z1]     (the vertex coordinates)
// B = [x1, floor(y1)]  (directly  below A, at the first integer of y)
// C = []
// The first initial point C sits x_
// on the scan-line is:
// x =
// x = floor(x1)
// y = floor(y1)
// x_inc =
// z_inc = (z1 - z2) / (y1 - y2)
// Compute z_inc:
// Let n be the normal vector of the triangle
// (nx, ny, nz) . (1, 0, z_inc) = 0
// nx + nz*z_inc = 0
// z_inc = -nx / nz
//# sourceMappingURL=main.js.map