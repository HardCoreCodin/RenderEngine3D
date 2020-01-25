import RayTraceEngine from "../lib/render/raytrace/engine.js";

var g: {[k: string]: any} = {};
globalThis.g = g;

const engine = g.engine = new RayTraceEngine();
const camera = g.c = engine.display.active_viewport.controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;

// const viewport = g.viewport = engine.screen.addViewport(camera);
// viewport.render_pipeline = new Rasterizer(engine.context, engine.scene.mesh_geometries, engine.scene.materials);

g.engine.start();