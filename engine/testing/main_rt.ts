import RayTraceEngine from "../lib/render/raytrace/engine.js";
import Rasterizer from "../lib/render/raster/software/pipeline.js";

var g: {[k: string]: any} = {};
globalThis.g = g;

const engine = g.engine = new RayTraceEngine();
const camera = g.c = engine.screen.active_viewport.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;

// const viewport = g.viewport = engine.screen.addViewport(camera);
// viewport.render_pipeline = new Rasterizer(engine.context, engine.scene.mesh_geometries, engine.scene.materials);

g.engine.start();