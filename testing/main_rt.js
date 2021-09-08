import { rgba } from "../engine/accessors/color.js";
import RayTracer from "../engine/render/raytrace/pipeline.js";
import RayTraceEngine from "../engine/render/raytrace/engine.js";
import RayTraceViewport from "../engine/render/raytrace/viewport.js";
import { pos2 } from "../engine/accessors/position.js";
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
camera.transform.translation.x = 5;
camera.transform.translation.y = 5;
camera.transform.translation.z = 5;
camera.transform.rotation.x = -1;
camera.transform.rotation.y = 2.3;
// for (let i=0; i < 5; i++)
//     for (let j=0; j < 5; j++) {
//         let geo = new Sphere(engine.scene);
//         geo.transform.translation.x = i*3;
//         geo.transform.translation.z = j*3;
//     }
const num_spheres_x = 5;
const num_spheres_z = 5;
engine.scene.spheres.init(num_spheres_x * num_spheres_z);
engine.scene.spheres.radii.fill(1);
let sphere_index = 0;
for (let x = 0; x < num_spheres_x; x++)
    for (let z = 0; z < num_spheres_z; z++)
        engine.scene.spheres.centers.arrays[sphere_index++].set([x * 3, 0, z * 3]);
engine.start();
const Q = globalThis.Q = pos2();
const R = globalThis.R = pos2();
const P = globalThis.P = pos2();
const A = globalThis.A = pos2();
const B = globalThis.B = pos2();
const C = globalThis.C = pos2();
globalThis.setABC = (Ax, Ay, Bx, By, Cx, Cy) => {
    globalThis.A.setTo(Ax, Ay);
    globalThis.B.setTo(Bx, By);
    globalThis.C.setTo(Cx, Cy);
};
globalThis.getQt = () => (Q.x - A.x) / (B.x - A.x);
globalThis.getRt = () => (R.x - B.x) / (C.x - B.x);
globalThis.getPt = () => (P.x - Q.x) / (R.x - Q.x);
globalThis.getQ = (t) => { A.lerp(B, t, Q); return [Q.x, Q.y]; };
globalThis.getR = (t) => { B.lerp(C, t, R); return [R.x, R.y]; };
globalThis.getP = (t) => { Q.lerp(R, t, P); return [P.x, P.y]; };
globalThis.getPbyT = (t) => {
    globalThis.getQ(t);
    globalThis.getR(t);
    return globalThis.getP(t);
};
// ray_tracer = new RayTracer(context, engine.scene);
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));
// const rt = new RayTracer(context, engine.scene);
// const vp2 = new RayTraceViewport(controller, rt, display);
// const vp3 = new RayTraceViewport(controller, rt, display);
// display.addViewport(controller, rt, vp2);
// display.addViewport(controller, rt, vp3);
// const viewport = engine.display.addViewport(controller, new Rasterizer(engine.context, engine.scene));
//# sourceMappingURL=main_rt.js.map