import {rgba} from "../lib/accessors/color.js";
import RayTraceEngine from "../lib/render/raytrace/engine.js";
import RayTracer from "../lib/render/raytrace/pipeline.js";
import RayTraceViewport from "../lib/render/raytrace/viewport.js";
import Sphere from "../lib/geometry/implicit_surfaces/sphere.js";

globalThis.rgba = rgba;
// globalThis.r = rgba(1, 0 ,0, 1);
// globalThis.g = rgba(0, 1 ,0, 1);
// globalThis.b = rgba(0, 0 ,1, 1);

globalThis.RayTracer = RayTracer;
globalThis.RayTraceEngine = RayTraceEngine;
globalThis.RayTraceViewport = RayTraceViewport;


const engine = globalThis.engine = new RayTraceEngine();
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
vp1.render_pipeline.on_mesh_removed_callback
for (let i=0; i < 5; i++)
    for (let j=0; j < 5; j++) {
        let geo = new Sphere(engine.scene);
        geo.transform.translation.x = i*3;
        geo.transform.translation.z = j*3;
        // geo.transform.scale.x = geo.transform.scale.y = geo.transform.scale.z = 0.1;
        engine.scene.implicit_geometry_array.push(geo);
    }

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
