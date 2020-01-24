import GLRenderEngine from "../lib/render/raster/hardware/engine.js";
import GLMaterial from "../lib/render/raster/hardware/materials/_base.js";
import CubeMesh from "../lib/geometry/cube.js";

var g: {[k: string]: any} = {};
globalThis.g = g;

g.canvas = document.querySelector('canvas');
g.engine = new GLRenderEngine(g.canvas);
g.mesh = CubeMesh().load();
g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
g.geometry.material = g.engine.scene.addMaterial(GLMaterial);

g.engine.start();