import * as rst from "./rasterizer.js";

const suzanne_mesh = rst.loadMeshFromObj(rst.objs.suzanne);

const engine = new rst.RasterEngine();
const scene = engine.scene;
const cube = scene.mesh_geometries.addGeometry(rst.Cube());
const mesh1 = scene.mesh_geometries.addGeometry(suzanne_mesh);
const mesh2 = scene.mesh_geometries.addGeometry(suzanne_mesh);
const light1 = scene.addPointLight();
const light2 = scene.addPointLight();
const light3 = scene.addPointLight();
const mat1 = scene.addMaterial() as rst.SoftwareRasterMaterial;
const mat2 = scene.addMaterial() as rst.SoftwareRasterMaterial;
const mat3 = scene.addMaterial() as rst.SoftwareRasterMaterial;

const camera = engine.display.active_viewport.camera;
camera.position.setTo(0, 15, -15);
camera.transform.rotation.x = -0.75;

scene.ambient_color.setTo(0.008, 0.008, 0.014);

mat1.pixel_shader = mat2.pixel_shader = mat3.pixel_shader = rst.pixel_shaders.classic;
mat1.params.has.diffuse = mat2.params.has.diffuse = mat3.params.has.diffuse = true;
mat2.params.has.specular = mat3.params.has.specular = true;
mat2.params.shininess    = mat3.params.shininess = 1;
mat2.params.uses.Blinn   = mat3.params.uses.Phong = true;
mat1.params.diffuse_color.setTo(0.8, 1.0, 0.8);
mat2.params.diffuse_color.setTo(0.1, 0.3, 0.1);
mat3.params.diffuse_color.setTo(0.2, 0.2, 0.3);
mat3.params.specular_color.setTo(1, 1, 1);
mat2.params.specular_color.setTo(1, 1, 1);
mat1.params.specular_color.setTo(1, 1, 1);

cube.transform.translation.setTo(-6, -3,0);
cube.transform.scale.z = cube.transform.scale.x = 16;
cube.material = mat3;
cube.is_static = true;
cube.refreshWorldMatrix(false, true);

mesh1.material = mat2;
mesh1.transform.translation.setTo(0, 0, 5);
mesh1.refreshWorldMatrix(false, true);

mesh2.material = mat1;
mesh2.transform.translation.setTo(5, 0, 5);
mesh2.refreshWorldMatrix(false, true);

light1.intensity = 15;
light1.color.r = 0.8;
light1.color.g = 0.3;
light1.color.b = 0.2;
light1.position.x = mesh1.transform.translation.x - 3;
light1.position.z = mesh1.transform.translation.z + 3;
light1.position.y = 5;

light2.intensity = 15;
light2.color.r = 0.2;
light2.color.g = 0.3;
light2.color.b = 0.8;
light2.position.x = mesh2.transform.translation.x + 3;
light2.position.z = mesh2.transform.translation.z + 3;
light2.position.y = 4;

light3.intensity = 9;
light3.color.r = 0.2;
light3.color.g = 0.9;
light3.color.b = 0.3;
light3.position.x = (mesh2.transform.translation.x + mesh1.transform.translation.x ) / 2;
light3.position.z = -1;
light3.position.y = 3;


const sin = Math.sin;
const cos = Math.cos;

engine.update_callbacks.add((delta_time: number, elapsed_time: number) => {
    mesh1.transform.rotation.y = elapsed_time / 1000 * 1.5;
    mesh2.transform.rotation.y = (elapsed_time / 1000 + 1) * 1.2;

    light1.position.x = cos(elapsed_time / 1000) * 0.6 + mesh1.transform.translation.x - 3;
    light1.position.z = sin(elapsed_time / 1000) * 0.6 + mesh1.transform.translation.z + 3;
    light1.position.y = sin(elapsed_time / 500 ) + 2;

    light2.position.x = sin(elapsed_time / 2000) * 0.6 + mesh2.transform.translation.x + 3;
    light2.position.z = cos(elapsed_time / 2000) * 0.6 + mesh2.transform.translation.z + 3;
    light2.position.y = cos(elapsed_time / 500 ) + 2;
});

engine.start();