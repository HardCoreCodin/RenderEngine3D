import * as rst from "./rasterizer.js";
const suzanne_mesh = rst.loadMeshFromObj(rst.objs.suzanne);
const engine = new rst.RasterEngine();
const scene = engine.scene;
const viewport = engine.display.active_viewport;
const camera = viewport.controller.camera;
viewport.view_frustum.near = 2;
viewport.show_wire_frame = false;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;
const cube_geo = scene.mesh_geometries.addGeometry(rst.Cube());
cube_geo.transform.translation.y = -3;
cube_geo.transform.translation.x = -6;
cube_geo.transform.translation.z = -6;
cube_geo.transform.scale.z = cube_geo.transform.scale.x = 16;
cube_geo.transform.rotation.z = 0.05;
cube_geo.transform.rotation.x = 0.07;
cube_geo.refreshWorldMatrix(false, true);
cube_geo.material = new rst.SoftwareRasterMaterial(scene, rst.pixel_shaders.lambert_checkerboard);
const light = scene.addPointLight();
// light.color.array.fill(1);
light.intensity = 15;
light.color.r = 0.8;
light.color.g = 0.3;
light.color.b = 0.2;
const light2 = scene.addPointLight();
// light2.color.array.fill(1);
light2.intensity = 15;
light2.color.r = 0.2;
light2.color.g = 0.3;
light2.color.b = 0.8;
const light3 = scene.addPointLight();
// light2.color.array.fill(1);
light3.intensity = 9;
light3.color.r = 0.2;
light3.color.g = 0.9;
light3.color.b = 0.3;
let x, z, x2, z2;
let rotating_head1, rotating_head2;
for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
        const geo = scene.mesh_geometries.addGeometry(suzanne_mesh);
        geo.is_static = true;
        geo.transform.translation.x = i * 5;
        geo.transform.translation.z = j * 5;
        geo.refreshWorldMatrix(false, true);
        if (i) {
            if (j) {
                geo.is_static = false;
                geo.material = new rst.SoftwareRasterMaterial(scene, rst.pixel_shaders.phong);
                x2 = geo.transform.translation.x;
                z2 = geo.transform.translation.z;
                rotating_head2 = geo;
            }
            else {
                geo.material = new rst.SoftwareRasterMaterial(scene, rst.pixel_shaders.depth);
                geo.is_renderable = false;
            }
        }
        else {
            if (j) {
                geo.is_static = false;
                geo.material = new rst.SoftwareRasterMaterial(scene, rst.pixel_shaders.lambert);
                rotating_head1 = geo;
                x = geo.transform.translation.x;
                z = geo.transform.translation.z;
            }
            else {
                geo.material = new rst.SoftwareRasterMaterial(scene, rst.pixel_shaders.normal);
                geo.is_renderable = false;
            }
        }
    }
light.transform.translation.x = x - 3;
light.transform.translation.z = z + 3;
light.transform.translation.y = 5;
light2.transform.translation.x = x2 + 3;
light2.transform.translation.z = z2 + 3;
light2.transform.translation.y = 4;
light3.transform.translation.x = (x2 + x) / 2;
light3.transform.translation.z = -1;
light3.transform.translation.y = 3;
engine.update_callbacks.add((delta_time, elapsed_time) => {
    rotating_head1.transform.rotation.y = Math.cos(elapsed_time / 1000) * 1.5;
    rotating_head2.transform.rotation.y = Math.sin(elapsed_time / 1000 + 1) * 1.2;
    // cube_geo.transform.rotation.y = Math.sin(elapsed_time / 1000) * 0.1;
    light.transform.translation.x = x - 3 + Math.cos(elapsed_time / 1000) * 0.6;
    light.transform.translation.z = z + 3 + Math.sin(elapsed_time / 1000) * 0.6;
    light.transform.translation.y = 2 + Math.sin(elapsed_time / 500);
    light2.transform.translation.x = x2 + 3 + Math.sin(elapsed_time / 2000) * 0.6;
    light2.transform.translation.z = z2 + 3 + Math.cos(elapsed_time / 2000) * 0.6;
    light2.transform.translation.y = 2 + Math.cos(elapsed_time / 500);
});
engine.start();
//# sourceMappingURL=main.js.map