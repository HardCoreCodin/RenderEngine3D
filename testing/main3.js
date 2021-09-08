import GLRenderEngine from "../engine/render/raster/hardware/engine.js";
import { rgba } from "../engine/accessors/color.js";
import Cube from "../engine/geometry/cube.js";
globalThis.rgba = rgba;
const engine = globalThis.engine = new GLRenderEngine();
const display = engine.display;
const vp1 = display.active_viewport;
const camera = vp1.controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;
const mesh = Cube();
mesh.options.share |= 8 /* uv */;
mesh.load();
for (let i = 0; i < 10; i++)
    for (let j = 0; j < 10; j++) {
        let geo = engine.scene.mesh_geometries.addGeometry(mesh);
        geo.transform.translation.x = i - 5;
        geo.transform.translation.z = j - 5;
        geo.transform.scale.x = geo.transform.scale.y = geo.transform.scale.z = 0.1;
    }
engine.start();
//# sourceMappingURL=main3.js.map