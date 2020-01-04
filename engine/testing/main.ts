import {mat4} from "../lib/accessors/matrix.js";

import Program from "./gl/program.js";
import {IndexBuffer, Texture, VertexArray} from "./gl/buffers.js";
import {IUniform} from "./gl/types.js";
import gl, {canvas} from "./gl/context.js";
// import susan_json from "./susan.js";
import {indices, position, uv, vertex_count} from "./data.js";

// const susan = JSON.parse(susan_json);

let old_width: number;
let old_height: number;

let width = canvas.clientWidth;
let height = canvas.clientHeight;

gl.enable(gl.DEPTH_TEST);

const texture = new Texture(document.images[0]);
const vertex_shader     = document.scripts[0].innerText;
const fragment_shader   = document.scripts[1].innerText;
const program = new Program(vertex_shader, fragment_shader);


const angle = Math.PI/2 / 70;
const matrix = mat4().setToIdentity();

matrix.translation.x = .2;
matrix.translation.y = .5;
matrix.scaleBy(.25);

const matrix_uniform: IUniform = program.uniforms.matrix;
const matrix_array = new Float32Array(16);

// const position = susan.meshes[0].vertices;
// const indices = [].concat.apply([], susan.meshes[0].faces);
// const uv = susan.meshes[0].texturecoords[0];
// const vertex_count = position.length / 3;

const index_buffer = new IndexBuffer(indices);
const vertex_array = new VertexArray(vertex_count, program.locations, {uv, position});


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
    matrix.toArray(matrix_array);

    program.use();
    matrix_uniform.load(matrix_array);
    texture.bind();
    vertex_array.bind();
    index_buffer.draw();
}

animate();