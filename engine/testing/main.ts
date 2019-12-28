import Transform from "../lib/scene_graph/transform.js";

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
if (!gl) throw 'WebGL not supported';

const vertexData = Float32Array.of(
    0, 1, 0,    // V1.position
    1, -1, 0,   // V2.position
    -1, -1, 0,  // V3.position
);

const colorData = Float32Array.of(
    1, 0, 0,    // V1.color
    0, 1, 0,    // V2.color
    0, 0, 1,    // V3.color
);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.scripts[0].innerText);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.scripts[1].innerText);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const angle = Math.PI/2 / 70;

// import * as gl_mat4 from "./glMatrix/mat4.js";
// const matrix = gl_mat4.create();
// gl_mat4.translate(matrix, matrix, [.2, .5, 0]);
// gl_mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);

import {mat4} from "../lib/accessors/matrix.js";
const ma = new Float32Array(16);
const m = mat4().setToIdentity();
m.translation.x = .2;
m.translation.y = .5;
m.scaleBy(.25);

// const mt = new Float32Array(16);
// const t = new Transform();
// t.scale.x = t.scale.y = t.scale.z = .25;
// t.translation.x = .2;
// t.translation.y = .5;

function animate() {
    requestAnimationFrame(animate);
    m.mat3.rotateAroundZ(angle);
    m.toArray(ma);
    gl.uniformMatrix4fv(uniformLocations.matrix,false, ma);

    // t.rotation.z += angle;
    // t.matrix.toArray(mt);
    // gl.uniformMatrix4fv(uniformLocations.matrix,false, mt);

    // gl_mat4.rotateZ(matrix, matrix, angle);
    // gl.uniformMatrix4fv(uniformLocations.matrix,false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

animate();