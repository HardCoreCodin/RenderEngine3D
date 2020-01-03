import {mat4} from "../lib/accessors/matrix.js";
import {VertexPositions4D} from "../lib/geometry/positions.js";

import Program from "./gl/program.js";
import {IndexBuffer, VertexArray, VertexBuffer} from "./gl/buffers.js";
import {IUniform} from "./gl/types.js";
import gl, {canvas} from "./gl/context.js";
import {colors, face_count, face_vertices, positions, vertex_count} from "./data.js";

gl.enable(gl.DEPTH_TEST);

let transform_on_CPU = false;
document.onkeydown = (key_event): void => {
    if (key_event.which === 40) {
        if (transform_on_CPU) {
            transform_on_CPU = false;
            console.log('Trasnfromation switched to: GPU');
        } else {
            transform_on_CPU = true;
            console.log('Trasnfromation switched to: CPU');
        }
    }
};

const fragment_shader   = document.scripts[0].innerText;
const vertex_shader     = document.scripts[1].innerText;
const vertex_shader_CPU = document.scripts[2].innerText;
const program = new Program(vertex_shader, fragment_shader);
const program_CPU = new Program(vertex_shader_CPU, fragment_shader);

const color = colors.toArray();
const position = positions.toArray();

const index_buffer = new IndexBuffer(face_vertices.toArray());
const vertex_array = new VertexArray(vertex_count, program.locations, {color, position});

const positions_CPU = new Float32Array(vertex_count * 4);
const vertex_array_CPU = new VertexArray(vertex_count, program.locations, {
    color: vertex_array.attributes.color,
    position: positions_CPU
});

const angle = Math.PI/2 / 70;
const matrix = mat4().setToIdentity();

matrix.translation.x = .2;
matrix.translation.y = .5;
matrix.scaleBy(.25);

const matrix_array = new Float32Array(16);
const matrix_uniform: IUniform = program.uniforms.matrix;

const transformed_positions = new VertexPositions4D(vertex_count, face_vertices);

let old_width: number;
let old_height: number;

let width = canvas.clientWidth;
let height = canvas.clientHeight;

function animate() {
    requestAnimationFrame(animate);

    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (width !== old_width || height !== old_height) {
        old_width = gl.canvas.width = width;
        old_height = gl.canvas.height = height;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    matrix.mat3.rotateAroundX(angle);
    matrix.mat3.rotateAroundZ(angle);

    if (transform_on_CPU) {
        program_CPU.use();

        positions.mat4mul(matrix, transformed_positions).toArray(positions_CPU);
        vertex_array_CPU.attributes.position.load(positions_CPU);

        vertex_array_CPU.bind();
        index_buffer.draw();
    } else {
        program.use();

        matrix.toArray(matrix_array);
        matrix_uniform.load(matrix_array);

        vertex_array.bind();
        index_buffer.draw();
    }
}

animate();