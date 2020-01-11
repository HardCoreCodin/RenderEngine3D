import gl, {canvas} from "./gl/context.js";
import Mesh from "../lib/geometry/mesh.js";
import {MeshInputs} from "../lib/geometry/inputs.js";
import {mat4} from "../lib/accessors/matrix.js";
import GLProgram from "./gl/program.js";
import {GLIndexBuffer, GLTexture, GLVertexArray} from "./gl/buffers.js";
import {ATTRIBUTE, FACE_TYPE} from "../constants.js";
import {T2, T3} from "../types.js";
import {IGLUniform} from "./gl/types.js";

let old_width: number;
let old_height: number;

let width = canvas.clientWidth;
let height = canvas.clientHeight;

gl.enable(gl.BLEND);
gl.enable(gl.DEPTH_TEST);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

const susan_texture = new GLTexture(gl, document.images[0]);
const vertex_shader = document.scripts[0].innerText;
const fragment_shader = document.scripts[1].innerText;
const program = new GLProgram(gl, vertex_shader, fragment_shader);


const angle = Math.PI/2 / 70;
const matrix = mat4().setToIdentity();

matrix.translation.x = .2;
matrix.translation.y = .5;
matrix.scaleBy(.25);

const matrix_array = new Float32Array(16);
const matrix_uniform: IGLUniform = program.uniforms.matrix;
const texture_uniform: IGLUniform = program.uniforms.sampler;

(async () => {
    const susan = (await (await fetch('Susan.json')).json()).meshes[0];
    const susan_positions = susan.vertices;
    const susan_uvs = susan.texturecoords[0];
    const vertex_count = susan_positions.length / 3;

    const mesh_inputs = new MeshInputs(FACE_TYPE.TRIANGLE, ATTRIBUTE.position|ATTRIBUTE.uv);
    const input_positions = mesh_inputs.position;
    const input_uvs = mesh_inputs.uv;

    const vertex_uv = Array<number>(2) as T2<number>;
    const vertex_position = Array<number>(3) as T3<number>;

    let vertex_uv_offset = 0;
    let vertex_position_offset = 0;
    for (let vertex_id = 0; vertex_id < vertex_count; vertex_id++) {
        vertex_position[0] = susan_positions[vertex_position_offset];
        vertex_position[1] = susan_positions[vertex_position_offset + 1];
        vertex_position[2] = susan_positions[vertex_position_offset + 2];
        input_positions.pushVertex(vertex_position);

        vertex_uv[0] = susan_uvs[vertex_uv_offset];
        vertex_uv[1] = susan_uvs[vertex_uv_offset + 1];
        input_uvs.pushVertex(vertex_uv);

        vertex_uv_offset += 2;
        vertex_position_offset += 3;
    }
    for (const face of susan.faces)
        input_positions.pushFace(face);

    const mesh = globalThis.mesh = new Mesh(mesh_inputs);
    mesh.options.include_uvs = true;
    mesh.load();

    const position = new Float32Array(susan_positions);
    const indices = new Uint32Array([].concat.apply([], susan.faces));
    const uv = new Float32Array(susan_uvs);

    const index_buffer = new GLIndexBuffer(gl, indices);
    const vertex_array = new GLVertexArray(gl, vertex_count, {uv, position}, program.locations);

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

        susan_texture.bind(5);
        texture_uniform.load(susan_texture.slot);
        matrix_uniform.load(matrix_array);

        vertex_array.bind();
        index_buffer.draw();
    }

    animate();
})();
