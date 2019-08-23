// class vec3d
// {
//     constructor(
//         public x: number = 0,
//         public y: number = 0,
//         public z: number = 0
//     ){}
// }
//
// class triangle
// {
//     constructor(
//         public p: = [new vec3d()]
//     ){}
// }
//
// class mesh
// {
//     constructor(
//         public tris: triangle[] = []
//     ){}
// }
// const meshCube: mesh = new mesh([
//     // SOUTH
//     new triangle([0, 0, 0]), new triangle([0, 1, 0]), new triangle([1, 1, 0]),
//     new triangle([0, 0, 0]), new triangle([1, 1, 0]), new triangle([1, 0, 0]),
//
//     // EAST
//     new triangle([1, 0, 0]), new triangle([1, 1, 0]), new triangle([1, 1, 1]),
//     new triangle([1, 0, 0]), new triangle([1, 1, 1]), new triangle([1, 0, 1]),
//
//     // NORTH
//     new triangle([1, 0, 1]), new triangle([1, 1, 1]), new triangle([0, 1, 1]),
//     new triangle([1, 0, 1]), new triangle([0, 1, 1]), new triangle([0, 0, 1]),
//
//     // EAST
//     new triangle([0, 0, 1]), new triangle([0, 1, 1]), new triangle([0, 1, 0]),
//     new triangle([0, 0, 1]), new triangle([0, 1, 0]), new triangle([0, 0, 0]),
//
//     // TOP
//     new triangle([0, 1, 0]), new triangle([0, 1, 1]), new triangle([0, 1, 1]),
//     new triangle([0, 1, 0]), new triangle([1, 1, 1]), new triangle([1, 1, 0]),
//
//     // BOTTOM
//     new triangle([1, 0, 1]), new triangle([0, 0, 1]), new triangle([0, 0, 0]),
//     new triangle([1, 0, 1]), new triangle([0, 0, 0]), new triangle([1, 0, 0])
// ]);
// class Cube extends Mesh {
//     constructor(name='Cube') {
//         const vertices = [
//             [-1, 1, 1],
//             [1, 1, 1],
//             [-1, -1, 1],
//             [1, -1, 1],
//             [-1, 1, -1],
//             [1, 1, -1],
//             [1, -1, -1],
//             [-1, -1, -1]
//         ];
//
//         super(name, vertices);
//     }
// }
import spaceship from './spaceship.js';
const default_color = { r: 1, g: 1, b: 1, a: 1 };
const copyColor = (color) => ({ r: color.r, g: color.g, b: color.b, a: color.a });
const copyVec3d = (v) => ({ x: v.x, y: v.y, z: v.z, col: v.col });
const copyTriPoints = (t) => [copyVec3d(t[0]), copyVec3d(t[1]), copyVec3d(t[2])];
const copyTri = (t) => ({ p: copyTriPoints(t.p), col: t.col ? copyColor(t.col[3]) : default_color });
const getColorStyle = (color) => `rgba(${color.r * 255}, ${color.b * 255}, ${color.b * 255}, ${color.a * 255})`;
class mesh {
    constructor(tris) {
        this.tris = tris;
    }
    loadObj(obj) {
        const verts = [];
        let parts;
        for (const line of obj.split('\n')) {
            if (line[0] === 'v') {
                parts = line.split(' ');
                verts.push({
                    x: parseFloat(parts[1]),
                    y: parseFloat(parts[2]),
                    z: parseFloat(parts[3])
                });
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
class Device {
    // image_data: ImageData;
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext('2d');
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();
        // this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    }
    present() {
        this.context.closePath();
        // this.context.putImageData(this.image_data, 0, 0);
    }
    // project(vertex, matrix) {
    //     // const point = vec3.TransformCoordinates(vertex, matrix);
    //     //
    //     // let x = (0.5 + point.x) * this.width;
    //     // let y = (0.5 - point.y) * this.height;
    //     //
    //     // return new vec2(x >> 0, y >> 0)
    // }
    // putPixel(x: number, y: number, color: rgba) {
    //     if (!Number.isInteger(x)) x >>= 0;
    //     if (!Number.isInteger(y)) y >>= 0;
    //
    //     const data = this.image_data.data;
    //     let index = this.width * y;
    //     index += x;
    //     index *= 4;
    //
    //     data[index] = color.r * 255;
    //     data[index + 1] = color.g * 255;
    //     data[index + 2] = color.b * 255;
    //     data[index + 3] = color.a * 255;
    // }
    //
    // drawPoint(x: number, y: number, color: rgba = default_color) {
    //     if (0 <= x && x < this.width &&
    //         0 <= y && y < this.height)
    //         this.putPixel(x, y, color);
    // }
    // drawLineNaive(point0: vec2d, point1: vec2d, color: rgba = default_color) {
    //     const run = point1.x - point0.x;
    //     if (run) {
    //         // There is a horizontal distance between the points
    //
    //         const rise = point1.y - point0.y;
    //         if (rise) {
    //             // There is a vertical distance between the points
    //
    //             const slope = rise / run;
    //             if (slope === 1 || slope === -1) {
    //                 // The points are diagonal from each other - just draw a diagonal line
    //
    //             } else if ()
    //         }
    //     } else {
    //         // The points are right on top of each other, just draw a vertical line:
    //
    //         let x_step = (x0 < x1) ? 1 : -1;
    //         let y_step = (y0 < y1) ? 1 : -1;
    //     }
    // }
    //
    // drawLine(point0: vec2d, point1: vec2d, color: rgba = default_color) {
    //     let x = point0.x >> 0;
    //     let y = point0.y >> 0;
    //
    //     const x1 = point1.x >> 0;
    //     const y1 = point1.y >> 0;
    //
    //     const x_diff = Math.abs(x1 - x);
    //     const y_diff = Math.abs(y1 - y);
    //
    //     let x_step = (x < x1) ? 1 : -1;
    //     let y_step = (y < y1) ? 1 : -1;
    //
    //     let diff = x_diff - y_diff;
    //     let offset: number;
    //
    //     while (true) {
    //         this.drawPoint(x, y, color);
    //         if (x === x1 &&
    //             y === y1)
    //             break;
    //
    //         offset = diff + diff;
    //
    //         if (offset > -y_diff) {
    //             diff -= y_diff;
    //             x += x_step;
    //         }
    //
    //         if (offset < x_diff) {
    //             diff += x_diff;
    //             y += y_step;
    //         }
    //     }
    // };
    drawLine(start, end, color = default_color) {
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.strokeStyle = getColorStyle(color);
        this.context.stroke();
    }
    drawTriangle(tri) {
        this.context.moveTo(tri.p[0].x, tri.p[0].y);
        this.context.lineTo(tri.p[1].x, tri.p[1].y);
        this.context.lineTo(tri.p[2].x, tri.p[2].y);
        this.context.lineTo(tri.p[0].x, tri.p[0].y);
        this.context.strokeStyle = getColorStyle(tri.col);
        this.context.stroke();
        // this.drawLine(tri.p[0].x, tri.p[1]);
        // this.drawLine(tri.p[1].x, tri.p[2]);
        // this.drawLine(tri.p[2].x, tri.p[0]);
    }
    fillTriangle(tri) {
        this.context.beginPath();
        this.context.moveTo(tri.p[0].x, tri.p[0].y);
        this.context.lineTo(tri.p[1].x, tri.p[1].y);
        this.context.lineTo(tri.p[2].x, tri.p[2].y);
        this.context.fillStyle = getColorStyle(tri.col);
        this.context.fill();
        this.context.closePath();
    }
    render(meshes, vCamera, projection_matrix, matRotZ, matRotX) {
        for (const m of meshes) {
            const trianglesToRaster = [];
            for (const tri of m.tris) {
                const triRotatedZ = { p: [
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 }
                    ] };
                MultiplyMatrixVector(tri.p[0], triRotatedZ.p[0], matRotZ);
                MultiplyMatrixVector(tri.p[1], triRotatedZ.p[1], matRotZ);
                MultiplyMatrixVector(tri.p[2], triRotatedZ.p[2], matRotZ);
                const triRotatedZX = { p: [
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 }
                    ] };
                MultiplyMatrixVector(triRotatedZ.p[0], triRotatedZX.p[0], matRotX);
                MultiplyMatrixVector(triRotatedZ.p[1], triRotatedZX.p[1], matRotX);
                MultiplyMatrixVector(triRotatedZ.p[2], triRotatedZX.p[2], matRotX);
                const triTranslated = copyTri(triRotatedZX);
                triTranslated.p[0].z += 8;
                triTranslated.p[1].z += 8;
                triTranslated.p[2].z += 8;
                const l1 = {
                    x: triTranslated.p[1].x - triTranslated.p[0].x,
                    y: triTranslated.p[1].y - triTranslated.p[0].y,
                    z: triTranslated.p[1].z - triTranslated.p[0].z,
                };
                const l2 = {
                    x: triTranslated.p[2].x - triTranslated.p[0].x,
                    y: triTranslated.p[2].y - triTranslated.p[0].y,
                    z: triTranslated.p[2].z - triTranslated.p[0].z,
                };
                const n = {
                    x: l1.y * l2.z - l1.z * l2.y,
                    y: l1.z * l2.x - l1.x * l2.z,
                    z: l1.x * l2.y - l1.y * l2.x,
                };
                let q = (n.x ** 2 +
                    n.y ** 2 +
                    n.z ** 2);
                let l = Math.sqrt(q);
                n.x /= l;
                n.y /= l;
                n.z /= l;
                if (n.x * (triTranslated.p[1].x - vCamera.x) +
                    n.y * (triTranslated.p[1].y - vCamera.y) +
                    n.z * (triTranslated.p[1].z - vCamera.z) >= 0)
                    continue;
                const light_direction = { x: 0, y: 0, z: -1 };
                q = (light_direction.x ** 2 +
                    light_direction.y ** 2 +
                    light_direction.z ** 2);
                l = Math.sqrt(q);
                light_direction.x /= l;
                light_direction.y /= l;
                light_direction.z /= l;
                const dp = (n.x * light_direction.x +
                    n.y * light_direction.y +
                    n.z * light_direction.z);
                triTranslated.col = { r: dp, g: dp, b: dp, a: 1 };
                const triProjected = { p: [
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 },
                        { x: 0, y: 0, z: 0 }
                    ] };
                MultiplyMatrixVector(triTranslated.p[0], triProjected.p[0], projection_matrix);
                MultiplyMatrixVector(triTranslated.p[1], triProjected.p[1], projection_matrix);
                MultiplyMatrixVector(triTranslated.p[2], triProjected.p[2], projection_matrix);
                triProjected.col = triTranslated.col;
                triProjected.p[0].x++;
                triProjected.p[1].x++;
                triProjected.p[2].x++;
                triProjected.p[0].y++;
                triProjected.p[1].y++;
                triProjected.p[2].y++;
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
const Vector_Add = (v1, v2) => ({
    x: v1.x + v2.x,
    y: v1.x + v2.y,
    z: v1.z + v2.z
});
const Vector_Sub = (v1, v2) => ({
    x: v1.x - v2.x,
    y: v1.x - v2.y,
    z: v1.z - v2.z
});
const Vector_Mul = (v1, k) => ({
    x: v1.x * k,
    y: v1.x * k,
    z: v1.z * k
});
const Vector_Div = (v1, k) => ({
    x: v1.x / k,
    y: v1.x / k,
    z: v1.z / k
});
const Vector_DotProduct = (v1, v2) => (v1.x * v2.x +
    v1.x * v2.y +
    v1.z * v2.z);
const Vector_CrossProduct = (v1, v2) => (v1.x * v2.x +
    v1.x * v2.y +
    v1.z * v2.z);
const Vector_Length = (v) => Math.sqrt(Vector_DotProduct(v, v));
const Vector_Normalize = (v, k) => Vector_Div(v, Vector_Length(v));
const meshCube = new mesh([
// // SOUTH
//     {p:[{x:0, y:0, z:0}, {x:0, y:1, z:0}, {x:1, y:1, z:0}]},
//     {p:[{x:0, y:0, z:0}, {x:1, y:1, z:0}, {x:1, y:0, z:0}]},
//
// // EAST
//     {p:[{x:1, y:0, z:0}, {x:1, y:1, z:0}, {x:1, y:1, z:1}]},
//     {p:[{x:1, y:0, z:0}, {x:1, y:1, z:1}, {x:1, y:0, z:1}]},
//
// // NORTH
//     {p:[{x:1, y:0, z:1}, {x:1, y:1, z:1}, {x:0, y:1, z:1}]},
//     {p:[{x:1, y:0, z:1}, {x:0, y:1, z:1}, {x:0, y:0, z:1}]},
//
// // EAST
//     {p:[{x:0, y:0, z:1}, {x:0, y:1, z:1}, {x:0, y:1, z:0}]},
//     {p:[{x:0, y:0, z:1}, {x:0, y:1, z:0}, {x:0, y:0, z:0}]},
//
// // TOP
//     {p:[{x:0, y:1, z:0}, {x:0, y:1, z:1}, {x:1, y:1, z:1}]},
//     {p:[{x:0, y:1, z:0}, {x:1, y:1, z:1}, {x:1, y:1, z:0}]},
//
// // BOTTOM
// {p:[{x:1, y:0, z:1}, {x:0, y:0, z:1}, {x:0, y:0, z:0}]},
// {p:[{x:1, y:0, z:1}, {x:0, y:0, z:0}, {x:1, y:0, z:0}]}
]);
meshCube.loadObj(spaceship);
function MultiplyMatrixVector(i, o, m) {
    o.x = i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + m[3][0];
    o.y = i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + m[3][1];
    o.z = i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + m[3][2];
    const w = i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + m[3][3];
    if (w) {
        o.x /= w;
        o.y /= w;
        o.z /= w;
    }
}
function init() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const device = new Device(canvas);
    const n = 0.1;
    const f = 1000;
    const v = 90 / 180 * Math.PI;
    const a = canvas.height / canvas.width;
    const matProj = [
        [a / Math.tan(v / 2), 0, 0, 0],
        [0, 1 / Math.tan(v / 2), 0, 0],
        [0, 0, f / (f - n), 1 / Math.tan(v / 2)],
        [0, 0, (-f * n) / (f - n), 0]
    ];
    let theta = 0;
    let vCamera = { x: 0, y: 0, z: 0 };
    const perfectFrameTime = 1000 / 60;
    let deltaTime = 0;
    let lastTimestamp = 0;
    function drawingLoop(timestamp) {
        deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
        lastTimestamp = timestamp;
        theta += deltaTime / 60;
        const matRotZ = [
            [Math.cos(theta), Math.sin(theta), 0, 0],
            [-Math.sin(theta), Math.cos(theta), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        const matRotX = [
            [1, 0, 0, 0],
            [0, Math.cos(theta + 0.5), Math.sin(theta + 0.5), 0],
            [0, -Math.sin(theta + 0.5), Math.cos(theta + 0.5), 0],
            [0, 0, 0, 1]
        ];
        device.clear();
        device.render([meshCube], vCamera, matProj, matRotZ, matRotX);
        device.present();
        requestAnimationFrame(drawingLoop);
    }
    requestAnimationFrame(drawingLoop);
}
document.addEventListener("DOMContentLoaded", init, false);
//# sourceMappingURL=main.js.map