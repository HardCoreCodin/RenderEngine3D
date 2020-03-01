import {rgba} from "../lib/accessors/color.js";
import RasterEngine from "../lib/render/raster/software/engine.js";
import RayTracer from "../lib/render/raytrace/pipeline.js";
import RayTraceViewport from "../lib/render/raytrace/viewport.js";

globalThis.rgba = rgba;
// globalThis.r = rgba(1, 0 ,0, 1);
// globalThis.g = rgba(0, 1 ,0, 1);
// globalThis.b = rgba(0, 0 ,1, 1);

globalThis.RasterEngine = RasterEngine;
globalThis.RayTracer = RayTracer;
globalThis.RayTraceViewport = RayTraceViewport;


const engine = globalThis.engine = new RasterEngine();
const context = globalThis.context = engine.context;
const display = globalThis.display = engine.display;
const vp1 = display.active_viewport;
globalThis.grid = vp1.grid;
const controller = globalThis.controller = vp1.controller;
const camera = controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.x = 10;
camera.transform.translation.y = 10;
camera.transform.translation.z = 10;
camera.transform.rotation.x = -1;
camera.transform.rotation.y = 2.3;
engine.start();



// ray_tracer = new RayTracer(context, engine.scene);
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));


// const rt = new RayTracer(context, engine.scene);
// const vp2 = new RayTraceViewport(controller, rt, display);
// const vp3 = new RayTraceViewport(controller, rt, display);
// display.addViewport(controller, rt, vp2);
// display.addViewport(controller, rt, vp3);

// const viewport = engine.display.addViewport(controller, new Rasterizer(engine.context, engine.scene));
