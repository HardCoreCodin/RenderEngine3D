import {rgba} from "../lib/accessors/color.js";
import RayTraceEngine from "../lib/render/raytrace/engine.js";
import RayTracer from "../lib/render/raytrace/pipeline.js";
import RayTraceViewport from "../lib/render/raytrace/viewport.js";
import Spheres from "../lib/geometry/implicit_surfaces/spheres.js";
import spheres from "../lib/geometry/implicit_surfaces/spheres.js";
import {Position3D} from "../lib/accessors/position.js";

globalThis.rgba = rgba;
// globalThis.r = rgba(1, 0 ,0, 1);
// globalThis.g = rgba(0, 1 ,0, 1);
// globalThis.b = rgba(0, 0 ,1, 1);

globalThis.RayTracer = RayTracer;
globalThis.RayTraceEngine = RayTraceEngine;
globalThis.RayTraceViewport = RayTraceViewport;


const engine = globalThis.engine = new RayTraceEngine();
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

const num_spheres_x = 5;
const num_spheres_z = 5;
engine.scene.spheres.init(num_spheres_x * num_spheres_z);
engine.scene.spheres.radii.fill(1);
let sphere_index = 0;
for (let x = 0; x < num_spheres_x; x++)
    for (let z = 0; z < num_spheres_z; z++)
        engine.scene.spheres.centers.arrays[sphere_index++].set([x * 3, 0, z * 3]);

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
