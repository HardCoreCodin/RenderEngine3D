import * as rst from "./rasterizer.js";
import Scene from "./engine/nodes/scene.js";
import SoftwareRasterMaterial from "./engine/render/raster/software/materials/base.js";

const suzanne_mesh = rst.loadMeshFromObj(rst.objs.suzanne);
const scene = new Scene(SoftwareRasterMaterial);
const cube = scene.mesh_geometries.addGeometry(rst.Cube());
const mesh1 = scene.mesh_geometries.addGeometry(suzanne_mesh);
const mesh2 = scene.mesh_geometries.addGeometry(suzanne_mesh);
const light1 = scene.addPointLight();
const light2 = scene.addPointLight();
const light3 = scene.addPointLight();
const mat1 = scene.addMaterial() as rst.SoftwareRasterMaterial;
const mat2 = scene.addMaterial() as rst.SoftwareRasterMaterial;
const mat3 = scene.addMaterial() as rst.SoftwareRasterMaterial;

const camera = scene.addCamera();
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

// function binarySearch(arr, target, start, end) {
//     let index = Math.floor((end + start) / 2);
//     let value = arr[index];
//     if (arr[index] === target)
//         return index;
//     if (arr[index] > target)
//         return binarySearch(arr, target, start, index - 1);
//     else
//         return binarySearch(arr, target, index + 1, end);
// }
// let Arr = [1, 2, 3, 4, 5, 6, 7, 8];
// let Start = 0;
// let End = Arr.length - 1;
// let Target = 8;
// let Result = binarySearch(Arr, Target, Start, End);

class DemoRasterEngine extends rst.RasterEngine {
    OnUpdate() {
        mesh1.transform.rotation.y = this.elapsed_time * 1.5;
        mesh2.transform.rotation.y = (this.elapsed_time + 1) * 1.2;

        light1.position.x = cos(this.elapsed_time) * 0.6 + mesh1.transform.translation.x - 3;
        light1.position.z = sin(this.elapsed_time) * 0.6 + mesh1.transform.translation.z + 3;
        light1.position.y = sin(this.elapsed_time * 2 ) + 2;

        light2.position.x = sin(this.elapsed_time / 2) * 0.6 + mesh2.transform.translation.x + 3;
        light2.position.z = cos(this.elapsed_time / 2) * 0.6 + mesh2.transform.translation.z + 3;
        light2.position.y = cos(this.elapsed_time * 2 ) + 2;
    }
}

globalThis.engine = new DemoRasterEngine(scene, camera);