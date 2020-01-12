import {GLRenderEngine} from "./gl/render/engine.js";
import {GLMaterial} from "./gl/materials/base.js";
import CubeMesh from "../lib/geometry/cube.js";

var g: {[k: string]: any} = {};
globalThis.g = g;

g.canvas = document.querySelector('canvas');
g.engine = new GLRenderEngine(g.canvas);
g.mesh = CubeMesh().load();
g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
g.geometry.material = g.engine.scene.addMaterial(GLMaterial);

g.engine.start();