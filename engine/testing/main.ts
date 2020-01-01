import {mat4} from "../lib/accessors/matrix.js";
import {FaceVerticesInt8} from "../lib/geometry/indices.js";
import {VertexPositions3D} from "../lib/geometry/positions.js";

import Program from "./gl/program.js";
import {VertexBuffer} from "./gl/buffers.js";
import {IUniform} from "./gl/types.js";
import gl from "./gl/context.js";

const positions = [

    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5
];

const position_component_count = 3;
const vertex_count = positions.length / position_component_count;
const face_count = vertex_count / 3;

const indices = new FaceVerticesInt8( positions.length / position_component_count);
const position_attribute = new VertexPositions3D(indices, false);

let v1_index = 0;
let v2_index = 1;
let v3_index = 2;

let c1_index = 0;
let c2_index = 1;
let c3_index = 2;

for (let face = 0; face < 12; face++) {
    indices.arrays[0][face] = v1_index;
    indices.arrays[1][face] = v2_index;
    indices.arrays[2][face] = v3_index;

    position_attribute.arrays[0][v1_index] = positions[c1_index];
    position_attribute.arrays[1][v1_index] = positions[c2_index];
    position_attribute.arrays[2][v1_index] = positions[c3_index];
    c1_index += 3;
    c2_index += 3;
    c3_index += 3;

    position_attribute.arrays[0][v2_index] = positions[c1_index];
    position_attribute.arrays[1][v2_index] = positions[c2_index];
    position_attribute.arrays[2][v2_index] = positions[c3_index];
    c1_index += 3;
    c2_index += 3;
    c3_index += 3;

    position_attribute.arrays[0][v3_index] = positions[c1_index];
    position_attribute.arrays[1][v3_index] = positions[c2_index];
    position_attribute.arrays[2][v3_index] = positions[c3_index];
    c1_index += 3;
    c2_index += 3;
    c3_index += 3;

    v1_index += 3;
    v2_index += 3;
    v3_index += 3;
}

type Color = [
    number,
    number,
    number
];
const color_component_copunt = 3;

const getRandomColor = (): Color => [
    Math.random(),
    Math.random(),
    Math.random()
];

let colors = [];
let color: Color;
let vertex: number;
const quad_count = face_count / 2;
const vertices_per_quad = 6;
for (let quad = 0; quad < quad_count; quad++) {
    color = getRandomColor();
    for (vertex = 0; vertex < vertices_per_quad; vertex++) {
        colors.push(...color);
    }
}

const buffer_array = new Float32Array(positions.length + colors.length);
const buffer_positions_array = buffer_array.subarray(0, positions.length);
const buffer_color_array = buffer_array.subarray(positions.length);

buffer_color_array.set(colors);
position_attribute.toArray(buffer_positions_array);

const vertex_buffer = new VertexBuffer(buffer_array, vertex_count, [
    ['position', position_component_count],
    ['color', color_component_copunt]
]);

const program = new Program(
    document.scripts[0].innerText,
    document.scripts[1].innerText,
    vertex_buffer
);

const matrix_uniform: IUniform = program.uniforms.matrix;

gl.enable(gl.DEPTH_TEST);

const angle = Math.PI/2 / 70;
const matrix_array = new Float32Array(16);
const matrix = mat4().setToIdentity();
matrix.translation.x = .2;
matrix.translation.y = .5;
matrix.scaleBy(.25);


function animate() {
    requestAnimationFrame(animate);

    matrix.mat3.rotateAroundX(angle);
    matrix.mat3.rotateAroundZ(angle);
    matrix.toArray(matrix_array);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program.draw();

    matrix_uniform.use(matrix_array);

}

animate();