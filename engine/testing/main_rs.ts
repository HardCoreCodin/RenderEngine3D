import RasterEngine from "../lib/render/raster/software/engine.js";
import Cube from "../lib/geometry/cube.js";
import {ATTRIBUTE, COLOR_SOURCING, NORMAL_SOURCING} from "../constants.js";
import SoftwareRasterViewport from "../lib/render/raster/software/viewport.js";
import SoftwareRasterMaterial from "../lib/render/raster/software/materials/_base.js";
import {
    shadePixelBarycentric,
    shadePixelDepth,
    shadePixelNormal,
    shadePixelUV,
    shadePixelCheckerboard
} from "../lib/render/raster/software/materials/shaders/pixel.js";
import {loadMeshFromObj} from "../lib/geometry/loaders.js";
import suzanne_obj from "../../monkey.js"
import {MeshOptions} from "./main2_exports.js";

const mesh_options = new MeshOptions(0, NORMAL_SOURCING.LOAD_VERTEX__NO_FACE, 0, true);
const suzanne_mesh = loadMeshFromObj(suzanne_obj, mesh_options).load();

globalThis.engine = new RasterEngine();
const scene = globalThis.engine.scene;
const camera = globalThis.engine.display.active_viewport.controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;

let geo = scene.mesh_geometries.addGeometry(Cube().load());
geo.is_static = true;
geo.transform.translation.y = -2;
geo.transform.translation.z = -6;
geo.transform.translation.x = -6;
geo.transform.scale.z = geo.transform.scale.x = 16;
// geo.transform.scale.y = 0.1;
geo.refreshWorldMatrix(false, true);
geo.material = new SoftwareRasterMaterial(scene, shadePixelCheckerboard);

for (let i=0; i < 2; i++)
    for (let j=0; j< 2; j++) {
        geo = scene.mesh_geometries.addGeometry(suzanne_mesh);
        geo.is_static = true;
        geo.transform.translation.x = i*5;
        geo.transform.translation.z = j*5;
        geo.refreshWorldMatrix(false, true);
        if (i) {
            if (j) {
                geo.material = new SoftwareRasterMaterial(scene, shadePixelBarycentric);
            } else {
                geo.material = new SoftwareRasterMaterial(scene, shadePixelDepth);
            }
        } else {
            if (j) {
                geo.material = new SoftwareRasterMaterial(scene, shadePixelUV);
            } else {
                geo.material = new SoftwareRasterMaterial(scene, shadePixelNormal);
            }
        }
    }

(globalThis.engine.display.active_viewport as SoftwareRasterViewport).view_frustum.near = 2;
globalThis.engine.start();