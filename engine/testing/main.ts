import Program from "./gl/program.js";
import {IndexBuffer, Texture, VertexArray} from "./gl/buffers.js";
import {IUniform} from "./gl/types.js";

const susan_texture = new Texture(document.images[0]);
const vertex_shader = document.scripts[0].innerText;
const fragment_shader = document.scripts[1].innerText;
const program = new Program(vertex_shader, fragment_shader);
const matrix_uniform: IUniform = program.uniforms.matrix;
const texture_uniform: IUniform = program.uniforms.sampler;

(async () => {
    const susan = await (await fetch('Susan.json')).json();
    const position = new Float32Array(susan.meshes[0].vertices);
    const indices = new Uint32Array([].concat.apply([], susan.meshes[0].faces));
    const uv = new Float32Array(susan.meshes[0].texturecoords[0]);
    const vertex_count = position.length / 3;

    const index_buffer = new IndexBuffer(indices);
    const vertex_array = new VertexArray(vertex_count, program.locations, {uv, position});

    function animate() {
        requestAnimationFrame(animate);

        program.use();

        susan_texture.bind(5);
        texture_uniform.load(susan_texture.slot);
        matrix_uniform.load(matrix_array);

        vertex_array.bind();
        index_buffer.draw();
    }

    animate();
})();
