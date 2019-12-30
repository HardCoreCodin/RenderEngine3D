import gl from "./gl/context.js";

import Program from "./gl/program.js";
import Buffer from "./gl/attributes.js";
import {FragmentShader, VertexShader} from "./gl/shaders.js";
import {mat4} from "../lib/accessors/matrix.js";
import {FaceVerticesInt8} from "../lib/geometry/indices.js";
import {VertexPositions3D} from "../lib/geometry/positions.js";

const vertex_shader = new VertexShader(document.scripts[0].innerText);
const fragment_shader = new FragmentShader(document.scripts[1].innerText);
const program = new Program(vertex_shader.shader, fragment_shader.shader);

const vertexDataArray = [

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

const indices = new FaceVerticesInt8(12);
const vertex_positions_attribute = new VertexPositions3D(indices, false);

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

    vertex_positions_attribute.arrays[0][v1_index] = vertexDataArray[c1_index];
    vertex_positions_attribute.arrays[1][v1_index] = vertexDataArray[c2_index];
    vertex_positions_attribute.arrays[2][v1_index] = vertexDataArray[c3_index];
    c1_index += 3;
    c2_index += 3;
    c3_index += 3;

    vertex_positions_attribute.arrays[0][v2_index] = vertexDataArray[c1_index];
    vertex_positions_attribute.arrays[1][v2_index] = vertexDataArray[c2_index];
    vertex_positions_attribute.arrays[2][v2_index] = vertexDataArray[c3_index];
    c1_index += 3;
    c2_index += 3;
    c3_index += 3;

    vertex_positions_attribute.arrays[0][v3_index] = vertexDataArray[c1_index];
    vertex_positions_attribute.arrays[1][v3_index] = vertexDataArray[c2_index];
    vertex_positions_attribute.arrays[2][v3_index] = vertexDataArray[c3_index];
    c1_index += 3;
    c2_index += 3;
    c3_index += 3;

    v1_index += 3;
    v2_index += 3;
    v3_index += 3;
}

const position_buffer = new Buffer(vertex_positions_attribute.toArray());
position_buffer.bindAttr(program.vertex_attributes['position'], 3);

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

let colorDataArray = [];
for (let face = 0; face < 6; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 6; vertex++) {
        colorDataArray.push(...faceColor);
    }
}

const color_buffer = new Buffer(new Float32Array(colorDataArray));
color_buffer.bindAttr(program.vertex_attributes['color'], 3);

//
// gl.clearColor(0.75, 0.85, 0.8, 1.0);
// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//
// gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
//
// const colorBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
//
// const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vertexShader, document.scripts[0].innerText);
// gl.compileShader(vertexShader);
//
// const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fragmentShader, document.scripts[1].innerText);
// gl.compileShader(fragmentShader);
// console.log(gl.getShaderInfoLog(fragmentShader));
//
// const positionLocation = gl.getAttribLocation(program, `position`);
// gl.enableVertexAttribArray(positionLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
//
// const colorLocation = gl.getAttribLocation(program, `color`);
// gl.enableVertexAttribArray(colorLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
//
// gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

// const uniformLocations = {
//     matrix: gl.getUniformLocation(program, `matrix`),
// };

const angle = Math.PI/2 / 70;
//
// import * as gl_mat4 from "./glMatrix/mat4.js";
// const matrix = gl_mat4.create();
// gl_mat4.translate(matrix, matrix, [.2, .5, 0]);
// gl_mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);


const ma = new Float32Array(16);
const m = mat4().setToIdentity();
m.translation.x = .2;
m.translation.y = .5;
m.scaleBy(.25);

// import Transform from "../lib/scene_graph/transform.js";
// const mt = new Float32Array(16);
// const t = new Transform();
// t.scale.x = t.scale.y = t.scale.z = .25;
// t.translation.x = .2;
// t.translation.y = .5;

function animate() {
    requestAnimationFrame(animate);
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    m.mat3.rotateAroundX(angle);
    m.mat3.rotateAroundZ(angle);
    m.toArray(ma);

    gl.uniformMatrix4fv(program.uniforms['matrix'],false, ma);

    // t.rotation.z += angle;
    // t.rotation.x += angle;
    // t.matrix.toArray(mt);
    // gl.uniformMatrix4fv(uniformLocations.matrix,false, mt);

    // gl_mat4.rotateZ(matrix, matrix, angle);
    // gl_mat4.rotateX(matrix, matrix, angle);
    // gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertex_positions_attribute.length);
}

animate();