import RasterEngine from "../lib/render/raster/software/engine.js";
import Cube from "../lib/geometry/cube.js";
import {ATTRIBUTE} from "../constants.js";
import SoftwareRasterViewport from "../lib/render/raster/software/viewport.js";

globalThis.RasterEngine = RasterEngine;
const engine = globalThis.engine = new RasterEngine();
const display = engine.display;
const vp1: SoftwareRasterViewport = display.active_viewport as SoftwareRasterViewport;
const camera = vp1.controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;
globalThis.viewport = vp1;
const mesh = Cube();
mesh.options.share |= ATTRIBUTE.uv;
mesh.load();
// g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
// g.geometry.material = g.engine.scene.addMaterial(GLMaterial);

for (let i=0; i < 1; i++)
    for (let j=0; j< 1; j++) {
        let geo = engine.scene.mesh_geometries.addGeometry(mesh);
        // geo.is_static = true;
        geo.transform.translation.x = i - 5;
        geo.transform.translation.z = j - 5;
        geo.transform.scale.x = geo.transform.scale.y = geo.transform.scale.z = 10;
        // geo.refreshWorldMatrix(false, true);
    }
vp1.view_frustum.near = 1;

engine.start();


// camera.is_static = false;
// camera.lense.fov = 75;
// camera.transform.translation.x = 10;
// camera.transform.translation.y = 10;
// camera.transform.translation.z = 10;
// camera.transform.rotation.x = -1;
// camera.transform.rotation.y = 2.3;
// engine.start();



// ray_tracer = new RayTracer(context, engine.scene);
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));


// const rt = new RayTracer(context, engine.scene);
// const vp2 = new RayTraceViewport(controller, rt, display);
// const vp3 = new RayTraceViewport(controller, rt, display);
// display.addViewport(controller, rt, vp2);
// display.addViewport(controller, rt, vp3);

// const viewport = engine.display.addViewport(controller, new Rasterizer(engine.context, engine.scene));
