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
const copyVec3d = (v) => ({ x: v.x, y: v.y, z: v.z });
const copyTri = (t) => [copyVec3d(t[0]), copyVec3d(t[1]), copyVec3d(t[2])];
const default_color = { r: 1, g: 1, b: 0, a: 1 };
class Device {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext('2d');
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.image_data = this.context.getImageData(0, 0, this.width, this.height);
    }
    present() {
        this.context.putImageData(this.image_data, 0, 0);
    }
    // project(vertex, matrix) {
    //     // const point = vec3.TransformCoordinates(vertex, matrix);
    //     //
    //     // let x = (0.5 + point.x) * this.width;
    //     // let y = (0.5 - point.y) * this.height;
    //     //
    //     // return new vec2(x >> 0, y >> 0)
    // }
    putPixel(x, y, color) {
        const data = this.image_data.data;
        let index = this.width * y;
        index += x;
        index *= 4;
        data[index] = color.r * 255;
        data[index + 1] = color.g * 255;
        data[index + 2] = color.b * 255;
        data[index + 3] = color.a * 255;
    }
    drawPoint(point, color = default_color) {
        if (0 <= point.x && point.x < this.width &&
            0 <= point.y && point.y < this.height)
            this.putPixel(point.x, point.y, color);
    }
    drawLine(point0, point1, color = default_color) {
        let x0 = point0.x >> 0;
        let y0 = point0.y >> 0;
        const x1 = point1.x >> 0;
        const y1 = point1.y >> 0;
        const x_diff = Math.abs(x1 - x0);
        const y_diff = Math.abs(y1 - y0);
        let x_step = (x0 < x1) ? 1 : -1;
        let y_step = (y0 < y1) ? 1 : -1;
        let error_amount = x_diff - y_diff;
        while (true) {
            this.drawPoint({ x: x0, y: y0 }, color);
            if ((x0 == x1) && (y0 == y1))
                break;
            let error_amount_doubled = 2 * error_amount;
            if (error_amount_doubled > -y_diff) {
                error_amount -= y_diff;
                x0 += x_step;
            }
            if (error_amount_doubled < x_diff) {
                error_amount += x_diff;
                y0 += y_step;
            }
        }
    }
    ;
    // drawLine(x1: number, y1: number, x2: number, y2: number) {
    //     ctx.beginPath();
    //     ctx.moveTo(x1, y1);
    //     ctx.lineTo(x2, y2);
    //     ctx.stroke();
    // }
    drawTriangle(tri) {
        this.drawLine(tri[0], tri[1]);
        this.drawLine(tri[1], tri[2]);
        this.drawLine(tri[2], tri[0]);
    }
    render(meshes, projection_matrix, matRotZ, matRotX) {
        for (const m of meshes) {
            for (const tri of m) {
                const triRotatedZ = [
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 }
                ];
                MultiplyMatrixVector(tri[0], triRotatedZ[0], matRotZ);
                MultiplyMatrixVector(tri[1], triRotatedZ[1], matRotZ);
                MultiplyMatrixVector(tri[2], triRotatedZ[2], matRotZ);
                const triRotatedZX = [
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 }
                ];
                MultiplyMatrixVector(triRotatedZ[0], triRotatedZX[0], matRotX);
                MultiplyMatrixVector(triRotatedZ[1], triRotatedZX[1], matRotX);
                MultiplyMatrixVector(triRotatedZ[2], triRotatedZX[2], matRotX);
                const triTranslated = copyTri(triRotatedZX);
                triTranslated[0].z += 3;
                triTranslated[1].z += 3;
                triTranslated[2].z += 3;
                const line1 = {
                    x: triTranslated[1].x - triTranslated[0].x,
                    y: triTranslated[1].y - triTranslated[0].y,
                    z: triTranslated[1].z - triTranslated[0].z,
                };
                const line2 = {
                    x: triTranslated[2].x - triTranslated[0].x,
                    y: triTranslated[2].y - triTranslated[0].y,
                    z: triTranslated[2].z - triTranslated[0].z,
                };
                const normal = {
                    x: line1.y * line2.z - line1.z * line2.y,
                    y: line1.z * line2.x - line1.x * line2.z,
                    z: line1.x * line2.y - line1.y * line2.x,
                };
                const l = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
                normal.x /= l;
                normal.y /= l;
                normal.z /= l;
                const triProjected = [
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 },
                    { x: 0, y: 0, z: 0 }
                ];
                MultiplyMatrixVector(triTranslated[0], triProjected[0], projection_matrix);
                MultiplyMatrixVector(triTranslated[1], triProjected[1], projection_matrix);
                MultiplyMatrixVector(triTranslated[2], triProjected[2], projection_matrix);
                triProjected[0].x++;
                triProjected[1].x++;
                triProjected[2].x++;
                triProjected[0].y++;
                triProjected[1].y++;
                triProjected[2].y++;
                triProjected[0].x *= 0.5 * this.width;
                triProjected[1].x *= 0.5 * this.width;
                triProjected[2].x *= 0.5 * this.width;
                triProjected[0].y *= 0.5 * this.height;
                triProjected[1].y *= 0.5 * this.height;
                triProjected[2].y *= 0.5 * this.height;
                this.drawTriangle(triProjected);
            }
            // const matrix = mesh.transform_matrix.multiply(projection_matrix);
            //
            // for (const vertex of mesh.vertices)
            //     this.drawPoint(this.project(vertex, matrix));
        }
    }
}
const meshCube = [
    // SOUTH
    [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }],
    [{ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 1, y: 0, z: 0 }],
    // EAST
    [{ x: 1, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 1, y: 1, z: 1 }],
    [{ x: 1, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 1, y: 0, z: 1 }],
    // NORTH
    [{ x: 1, y: 0, z: 1 }, { x: 1, y: 1, z: 1 }, { x: 0, y: 1, z: 1 }],
    [{ x: 1, y: 0, z: 1 }, { x: 0, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }],
    // EAST
    [{ x: 0, y: 0, z: 1 }, { x: 0, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }],
    [{ x: 0, y: 0, z: 1 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }],
    // TOP
    [{ x: 0, y: 1, z: 0 }, { x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }],
    [{ x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 0 }],
    // BOTTOM
    [{ x: 1, y: 0, z: 1 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 0 }],
    [{ x: 1, y: 0, z: 1 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }]
];
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
        device.render([meshCube], matProj, matRotZ, matRotX);
        device.present();
        requestAnimationFrame(drawingLoop);
    }
    requestAnimationFrame(drawingLoop);
}
document.addEventListener("DOMContentLoaded", init, false);
//# sourceMappingURL=main.js.map