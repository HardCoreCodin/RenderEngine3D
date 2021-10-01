import SoftwareRasterMaterial from "../engine/render/raster/software/materials/base.js";
import RasterEngine from "../engine/render/raster/software/engine.js";
import Cube from "../engine/geometry/cube.js";
import {IShaded} from "../engine/render/raster/software/materials/shaders/pixel.js";

const engine = new RasterEngine();
const camera   = engine.display.active_viewport.camera;
const cube     = engine.scene.mesh_geometries.addGeometry(Cube());
const material = engine.scene.addMaterial() as SoftwareRasterMaterial;
const texture  = engine.scene.addTexture(document.images[1], true, true);

camera.position.setTo(-0.15, 0.4, -3.82);
camera.transform.rotation.x = -0.2;
camera.transform.rotation.y = 0.2;
camera.lense.fov = 50;

const controls = { mip_level: 0, repeat: 1 };
material.params.textures.push(texture);
material.pixel_shader = (shaded: IShaded) => {
    shaded.material.textures[0].sample(
        shaded.UV.imul(controls.repeat),
        shaded.dUV.imul(controls.repeat),
        shaded.pixel.rgba
    );
};
cube.material = material;

engine.ui.addSliders('CameraPosition', camera.position, [-2, 2], 0.01);
engine.ui.addSlider('Mip Level', controls, 'mip_level', [0, 6], 1);
engine.ui.addSlider('Repeat',    controls, 'repeat',    [1, 5], 1);

engine.start();


