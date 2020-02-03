// import GLRenderEngine from "../lib/render/raster/hardware/engine.js";
// import GLMaterial from "../lib/render/raster/hardware/materials/_base.js";
// import CubeMesh from "../lib/geometry/cube.js";
//
// var g: {[k: string]: any} = {};
// globalThis.g = g;
//
// g.canvas = document.querySelector('canvas');
// g.engine = new GLRenderEngine(g.canvas);
// g.mesh = CubeMesh().load();
// g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
// // g.geometry.material = g.engine.scene.addMaterial(GLMaterial);
//
// g.engine.start();
//

import GLRenderEngine from "../lib/render/raster/hardware/engine.js";
import {rgba} from "../lib/accessors/color.js";
import Cube from "../lib/geometry/cube.js";
import {ATTRIBUTE} from "../constants.js";

globalThis.rgba = rgba;
globalThis.r = rgba(1, 0 ,0, 1);
globalThis.g = rgba(0, 1 ,0, 1);
globalThis.b = rgba(0, 0 ,1, 1);

const engine = globalThis.engine = new GLRenderEngine();
const display = engine.display;
const vp1 = display.active_viewport;
const camera = vp1.controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;

const mesh = Cube();
mesh.options.share |= ATTRIBUTE.uv;
mesh.load();
// g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
// g.geometry.material = g.engine.scene.addMaterial(GLMaterial);

for (let i=0; i < 10; i++)
    for (let j=0; j< 10; j++) {
        let geo = engine.scene.mesh_geometries.addGeometry(mesh);
        geo.transform.translation.x = i - 5;
        geo.transform.translation.z = j - 5;
        geo.transform.scale.x = geo.transform.scale.y = geo.transform.scale.z = 0.1
    }


engine.start();