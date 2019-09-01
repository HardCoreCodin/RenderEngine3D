import spaceship from './spaceship.js';
import teapot from './teapot.js';
import Engine3D from "./engine/engine.js";
import Screen from "./engine/screen.js";
import { Mesh } from "./engine/primitives/mesh.js";
const teapot_mesh = Mesh.from(teapot);
// teapot_mesh.transform.rotationAngleForY = 180;
teapot_mesh.transform.translation.z = 5;
teapot_mesh.transform.translation.x = 5;
const spaceship_mesh = Mesh.from(spaceship);
// spaceship_mesh.transform.rotationAngleForY = 180;
spaceship_mesh.transform.translation.z = 5;
spaceship_mesh.transform.translation.x = -5;
const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new Engine3D(new Screen(canvas), [teapot_mesh, spaceship_mesh]);
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;
function drawingLoop(timestamp) {
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    try {
        engine.update(deltaTime);
    }
    catch (e) {
        console.trace();
        console.debug(e.stack);
    }
    requestAnimationFrame(drawingLoop);
}
requestAnimationFrame(drawingLoop);
//# sourceMappingURL=main.js.map