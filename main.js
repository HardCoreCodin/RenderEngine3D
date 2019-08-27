import axis from './axis.js';
import Engine3D from "./engine.js";
const canvas = document.getElementsByTagName('canvas')[0];
const engine = new Engine3D(canvas, axis);
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