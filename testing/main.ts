// import GLProgram from "../lib/render/raster/hardware/core/program.js";
// import {GLIndexBuffer, GLTexture, GLVertexArray} from "../lib/render/raster/hardware/core/buffers.js";
// import {IGLUniform} from "../lib/render/raster/hardware/core/types.js";
// import {mat4} from "../lib/accessors/matrix4x4.js";
//
// export const canvas: HTMLCanvasElement = document.querySelector('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
//
// const gl = canvas.getContext('webgl2');
// if (!gl)
//     alert('Your browser does not support WebGL');
//
//
//
// let old_width: number;
// let old_height: number;
//
// let width = canvas.clientWidth;
// let height = canvas.clientHeight;
//
// gl.enable(gl.BLEND);
// gl.enable(gl.DEPTH_TEST);
// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//
// const susan_texture = new GLTexture(gl, document.images[0]);
// const vertex_shader = document.scripts[0].innerText;
// const fragment_shader = document.scripts[1].innerText;
// const program = new GLProgram(gl, vertex_shader, fragment_shader);
//
//
// const angle = Math.PI/2 / 70;
// const matrix = mat4().setToIdentity();
//
// matrix.translation.x = .2;
// matrix.translation.y = .5;
// matrix.scaleBy(.25);
//
// const matrix_array = new Float32Array(16);
// const matrix_uniform: IGLUniform = program.uniforms.matrix;
// const texture_uniform: IGLUniform = program.uniforms.sampler;
//
// (async () => {
//     const susan = (await (await fetch('Susan.json')).json()).meshes[0];
//     const susan_positions = susan.vertices;
//     const susan_uvs = susan.texturecoords[0];
//     const vertex_count = susan_positions.length / 3;
//
//     const position = new Float32Array(susan_positions);
//     const indices = new Uint32Array([].concat.apply([], susan.faces));
//     const uv = new Float32Array(susan_uvs);
//
//     const index_buffer = new GLIndexBuffer(gl, indices);
//     const vertex_array = new GLVertexArray(gl, vertex_count, {uv, position}, program.locations);
//
//     function animate() {
//         requestAnimationFrame(animate);
//
//         width = canvas.clientWidth;
//         height = canvas.clientHeight;
//         if (width !== old_width || height !== old_height) {
//             old_width = gl.canvas.width = width;
//             old_height = gl.canvas.height = height;
//             gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
//         }
//
//         gl.clearColor(0, 0, 0, 1);
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//
//         matrix.mat3.rotateAroundX(angle);
//         matrix.mat3.rotateAroundZ(angle);
//         matrix.toArray(matrix_array);
//
//         program.use();
//
//         susan_texture.bind(5);
//         texture_uniform.load(susan_texture.slot);
//         matrix_uniform.load(matrix_array);
//
//         vertex_array.bind();
//         index_buffer.draw();
//     }
//
//     animate();
// })();
