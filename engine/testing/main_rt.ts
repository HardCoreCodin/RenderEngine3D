import {RayTraceEngine} from "../lib/render/engine.js";

var g: {[k: string]: any} = {};
globalThis.g = g;

const engine = g.engine = new RayTraceEngine();
const camera = g.c = engine.screen.active_viewport.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;

g.engine.start();