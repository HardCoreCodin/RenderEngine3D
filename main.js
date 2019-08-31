// import axis from './axis.js';
import spaceship from './spaceship.js';
import teapot from './teapot.js';
// import monkey from './monkey.js';
import Engine3D from "./engine/engine.js";
import Screen from "./engine/screen.js";
import { Mesh } from "./engine/primitives/mesh.js";
// import Cube from "./engine/primitives/cube.js";
//
// const axis_mesh = Mesh.from(axis);
// axis_mesh.transform.translation.z = 20;
// // axis_mesh.transform.translation.x = 0;
//
// const cube_mesh = new Cube();
// cube_mesh.transform.translation.z = 3;
const teapot_mesh = Mesh.from(teapot);
teapot_mesh.transform.translation.z = 5;
teapot_mesh.transform.translation.x = 5;
const spaceship_mesh = Mesh.from(spaceship);
spaceship_mesh.transform.translation.z = 5;
spaceship_mesh.transform.translation.x = -5;
const canvas = document.getElementsByTagName('canvas')[0];
const engine = new Engine3D(new Screen(canvas), [teapot_mesh, spaceship_mesh]);
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;
function drawingLoop(timestamp) {
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    engine.update(deltaTime);
    requestAnimationFrame(drawingLoop);
}
requestAnimationFrame(drawingLoop);
//# sourceMappingURL=main.js.map