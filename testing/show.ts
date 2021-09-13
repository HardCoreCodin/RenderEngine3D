import * as rnd from "../rasterizer.js";

const engine = new rnd.RasterEngine();
const scene = engine.scene;
const viewport = engine.display.active_viewport as rnd.SoftwareRasterViewport;
const camera = viewport.camera;
const texture = scene.addTexture(document.images[1], true, true);

viewport.show_wire_frame = false;

camera.position.x = -0.15;
camera.position.y = 0.4;
camera.position.z = -1.82;

engine.ui.addSliders('CameraPosition', camera.position, [-2, 2], 0.01);


camera.transform.rotation.x = -0.2;
camera.transform.rotation.y = 0.2;
camera.lense.fov = 50;

//rnd.loadMeshFromObj(rnd.objs.suzanne));
const mesh = rnd.Cube();
const geo = scene.mesh_geometries.addGeometry(mesh);
geo.transform.translation.x = -0.2;
geo.transform.translation.z = -0.5;

const material = scene.addMaterial() as rnd.SoftwareRasterMaterial;
material.params.textures.push(texture);

const controls = { mip_level: 0, repeat: 1 };
engine.ui.addSlider('Mip Level', controls, 'mip_level', [0, 6], 1);
engine.ui.addSlider('Repeat',    controls, 'repeat',    [1, 5], 1);

material.pixel_shader = (pixel, surface, scene) => {
    const tex = surface.material.textures[0];
    const mip = tex.mips[controls.mip_level];
    const uv = surface.UV.imul(controls.repeat);
    mip.sample(uv, pixel.color);
};
geo.material = material;

engine.update_callbacks.add((delta_time, elapsed_time) => {
    // geo.transform.rotation.x = 0.2 * elapsed_time / 1000;
    // geo.transform.rotation.y = -0.2 * elapsed_time / 1000;
    // console.log(camera.transform.translation.array);
});

engine.start();