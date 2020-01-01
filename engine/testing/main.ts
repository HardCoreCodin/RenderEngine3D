import {mat4} from "../lib/accessors/matrix.js";
import {FaceVerticesInt8} from "../lib/geometry/indices.js";
import {VertexPositions3D, VertexPositions4D} from "../lib/geometry/positions.js";

import Program from "./gl/program.js";
import {IndexBuffer, VertexBuffer} from "./gl/buffers.js";
import {IAttributeArrays, IAttributes, IUniform} from "./gl/types.js";
import gl from "./gl/context.js";
import {InputColors, InputPositions} from "../lib/geometry/inputs.js";
import {VertexColors3D, VertexColors4D} from "../lib/geometry/colors.js";

const vertex_shader = document.scripts[0].innerText;
const fragment_shader = document.scripts[1].innerText;

const input_positions = new InputPositions();
const input_colors = new InputColors();

// Top
input_positions.pushVertex([-1, 1, -1]),
input_positions.pushVertex([-1, 1,  1]),
input_positions.pushVertex([1,  1,  1]),
input_positions.pushVertex([1,  1, -1]),

// Left
input_positions.pushVertex([-1,  1,  1]);
input_positions.pushVertex([-1, -1,  1]);
input_positions.pushVertex([-1, -1, -1]);
input_positions.pushVertex([-1,  1, -1]);

// Right
input_positions.pushVertex([1,  1,  1]);
input_positions.pushVertex([1, -1,  1]);
input_positions.pushVertex([1, -1, -1]);
input_positions.pushVertex([1,  1, -1]);

// Front
input_positions.pushVertex([ 1,  1, 1]);
input_positions.pushVertex([ 1, -1, 1]);
input_positions.pushVertex([-1, -1, 1]);
input_positions.pushVertex([-1,  1, 1]);

// Back
input_positions.pushVertex([ 1,  1, -1]);
input_positions.pushVertex([ 1, -1, -1]);
input_positions.pushVertex([-1, -1, -1]);
input_positions.pushVertex([-1,  1, -1]);

// Bottom
input_positions.pushVertex([-1, -1, -1]);
input_positions.pushVertex([-1, -1,  1]);
input_positions.pushVertex([ 1, -1,  1]);
input_positions.pushVertex([ 1, -1, -1]);

// Top
input_positions.pushFace([0,  1,  2]);
input_positions.pushFace([0,  2,  3]);

// Left
input_positions.pushFace([5,  4,  6]);
input_positions.pushFace([6,  4,  7]);

// Right
input_positions.pushFace([8,  9,  10]);
input_positions.pushFace([8,  10, 11]);

// Front
input_positions.pushFace([13, 12, 14]);
input_positions.pushFace([15, 14, 12]);

// Back
input_positions.pushFace([16, 17, 18]);
input_positions.pushFace([16, 18, 19]);

// Bottom
input_positions.pushFace([21, 20, 22]);
input_positions.pushFace([22, 20, 23]);

// Top
input_colors.pushVertex([0.5, 0.5, 0.5]);
input_colors.pushVertex([0.5, 0.5, 0.5]);
input_colors.pushVertex([0.5, 0.5, 0.5]);
input_colors.pushVertex([0.5, 0.5, 0.5]); 

// Left
input_colors.pushVertex([0.75, 0.25, 0.5]);
input_colors.pushVertex([0.75, 0.25, 0.5]);
input_colors.pushVertex([0.75, 0.25, 0.5]);
input_colors.pushVertex([0.75, 0.25, 0.5]); 

// Right
input_colors.pushVertex([0.25, 0.25, 0.75]);
input_colors.pushVertex([0.25, 0.25, 0.75]);
input_colors.pushVertex([0.25, 0.25, 0.75]);
input_colors.pushVertex([0.25, 0.25, 0.75]); 

// Front
input_colors.pushVertex([1, 0, 0.15]);
input_colors.pushVertex([1, 0, 0.15]);
input_colors.pushVertex([1, 0, 0.15]);
input_colors.pushVertex([1, 0, 0.15]); 

// Back
input_colors.pushVertex([0, 1, 0.15]);
input_colors.pushVertex([0, 1, 0.15]);
input_colors.pushVertex([0, 1, 0.15]);
input_colors.pushVertex([0, 1, 0.15]); 

// Bottom
input_colors.pushVertex([0.5, 0.5, 1]);
input_colors.pushVertex([0.5, 0.5, 1]);
input_colors.pushVertex([0.5, 0.5, 1]);
input_colors.pushVertex([0.5, 0.5, 1]);

input_colors.faces_vertices = input_positions.faces_vertices;

const vertex_count = input_positions.vertex_count;
const face_vertices = new FaceVerticesInt8().load(input_positions);
const positions = new VertexPositions3D(vertex_count, face_vertices).load(input_positions);
const colors = new VertexColors3D(vertex_count, face_vertices).load(input_colors);
const color = colors.toArray();
const position = new Float32Array(vertex_count*4);
const attributes: IAttributeArrays = {position, color};
const index_buffer = new IndexBuffer(face_vertices.length, face_vertices.toArray());
const vertex_buffer = new VertexBuffer(positions.length, attributes, gl.DYNAMIC_DRAW);
const program = new Program(vertex_shader, fragment_shader, vertex_buffer, index_buffer);

const matrix_uniform: IUniform = program.uniforms.matrix;

gl.enable(gl.DEPTH_TEST);

const angle = Math.PI/2 / 70;
const matrix = mat4().setToIdentity();
matrix.translation.x = .2;
matrix.translation.y = .5;
matrix.scaleBy(.25);

const transformed_positions = new VertexPositions4D(vertex_count, face_vertices);

function animate() {
    requestAnimationFrame(animate);

    matrix.mat3.rotateAroundX(angle);
    matrix.mat3.rotateAroundZ(angle);
    positions.mat4mul(matrix, transformed_positions);
    transformed_positions.toArray(position);
    vertex_buffer.buffer_data.set(position);
    vertex_buffer.load(vertex_buffer.buffer_data, gl.DYNAMIC_DRAW);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program.draw();
}

animate();