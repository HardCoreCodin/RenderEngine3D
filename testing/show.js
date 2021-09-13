import * as rnd from "../rasterizer.js";
const engine = new rnd.RasterEngine();
const camera = engine.display.active_viewport.camera;
const cube = engine.scene.mesh_geometries.addGeometry(rnd.Cube());
const material = engine.scene.addMaterial();
const texture = engine.scene.addTexture(document.images[1], true, true);
camera.position.setTo(-0.15, 0.4, -3.82);
camera.transform.rotation.xy = { x: -0.2, y: 0.2 };
camera.lense.fov = 50;
const controls = { mip_level: 0, repeat: 1 };
material.params.textures.push(texture);
material.pixel_shader = (pixel, surface, scene) => {
    const tex = surface.material.textures[0];
    const mip = tex.mips[controls.mip_level];
    mip.sample(surface.UV.imul(controls.repeat), pixel.color);
};
cube.material = material;
engine.ui.addSliders('CameraPosition', camera.position, [-2, 2], 0.01);
engine.ui.addSlider('Mip Level', controls, 'mip_level', [0, 6], 1);
engine.ui.addSlider('Repeat', controls, 'repeat', [1, 5], 1);
engine.start();
//# sourceMappingURL=show.js.map