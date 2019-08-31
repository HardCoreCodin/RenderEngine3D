import axis from './axis.js';
import Engine3D from "./engine/engine.js";
import Screen from "./engine/screen.js";
import {Mesh} from "./engine/primitives/mesh.js";
import Cube from "./engine/primitives/cube.js";

const axis_mesh = Mesh.from(axis);
axis_mesh.transform.translation.z = 80;
axis_mesh.transform.translation.x = 0;

const cube_mesh = new Cube();
cube_mesh.transform.translation.z = 3;

const canvas: HTMLCanvasElement = document.getElementsByTagName('canvas')[0];
const engine = new Engine3D(new Screen(canvas), [cube_mesh]);

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