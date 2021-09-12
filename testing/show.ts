import * as rnd from "../rasterizer.js";

const engine = new rnd.RasterEngine();
const scene = engine.scene;
const viewport = engine.display.active_viewport as rnd.SoftwareRasterViewport;
const camera = viewport.controller.camera;
const texture = scene.addTexture(document.images[1], true, true);

viewport.show_wire_frame = false;

camera.transform.translation.x = -0.15;
camera.transform.translation.y = 0.4;
camera.transform.translation.z = -1.75;
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

material.pixel_shader = (pixel, surface, scene) => {
    surface.material.textures[0].sample(surface.UV.imul(2), surface.dUV, pixel.color);
    // surface.material.textures[0].mips[6].sample(surface.UV, pixel.color);
    // pixel.color.r = surface.uv.u;
    // pixel.color.g = surface.uv.v;
    // pixel.color.b = 0;
    // pixel.color.a = 1;

};
geo.material = material;

engine.update_callbacks.add((delta_time, elapsed_time) => {
    // geo.transform.rotation.x = 0.2 * elapsed_time / 1000;
    // geo.transform.rotation.y = -0.2 * elapsed_time / 1000;
    // console.log(camera.transform.translation.array);
});

engine.start();