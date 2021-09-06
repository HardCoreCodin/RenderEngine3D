import RasterEngine from "../lib/render/raster/software/engine.js";
import Cube from "../lib/geometry/cube.js";
import {ATTRIBUTE, NORMAL_SOURCING} from "../constants.js";
import SoftwareRasterViewport from "../lib/render/raster/software/viewport.js";
import SoftwareRasterMaterial from "../lib/render/raster/software/materials/_base.js";
import {
    shadePixelBarycentric,
    shadePixelDepth,
    shadePixelNormal, shadePixelUV
} from "../lib/render/raster/software/materials/shaders/pixel.js";
// import {loadMeshFromObj} from "../lib/geometry/loaders.js";
import suzanne_json from "./Susan.js";
import {MeshInputs, MeshOptions} from "./main2_exports.js";
import Mesh from "../lib/geometry/mesh.js";
// import {MeshInputs} from "./main2_exports.js";
// import Mesh from "../lib/geometry/mesh.js";

const source_mesh = suzanne_json.meshes[0];
const faces = source_mesh.faces;
const positions = source_mesh.vertices;
// const normals = source_mesh.normals;
const uvs = source_mesh.texturecoords[0];
const vertex_count = positions.length / 3;
const attributes = ATTRIBUTE.position | ATTRIBUTE.normal | ATTRIBUTE.uv;
const inputs = new MeshInputs(attributes);
let component3_index = 0;
let component2_index = 0;
for (let i = 0; i < vertex_count; i++, component3_index += 3, component2_index += 2) {
    inputs.position.addVertex(
        positions[component3_index],
        positions[component3_index+2],
        -positions[component3_index+1]
    );
    // inputs.normal.addVertex(
    //     normals[component3_index],
    //     normals[component3_index+1],
    //     normals[component3_index+2]
    // );
    inputs.uv.addVertex(
        uvs[component2_index],
        uvs[component2_index+1],
    );
}

for (const face of faces)  {
    inputs.position.addFace(face[0], face[2], face[1]);
    // inputs.normal.addFace(face[0], face[2], face[1]);
    inputs.uv.addFace(face[0], face[2], face[1]);
}
inputs.sanitize();
const mesh_options = new MeshOptions(attributes, NORMAL_SOURCING.GATHER_VERTEX__GENERATE_FACE, 0, true);
const suzanne_mesh = new Mesh(inputs, mesh_options);
suzanne_mesh.options.share = attributes;
suzanne_mesh.load();

globalThis.RasterEngine = RasterEngine;
const engine = globalThis.engine = new RasterEngine();
const display = engine.display;
const vp1: SoftwareRasterViewport = display.active_viewport as SoftwareRasterViewport;
const camera = vp1.controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;
globalThis.viewport = vp1;

// const suzanne_mesh = loadMeshFromObj(suzanne_obj);
const cube = Cube();
cube.options.share |= ATTRIBUTE.uv;
cube.load();
// suzanne_mesh.load();
// g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
// g.geometry.material = g.engine.scene.addMaterial(GLMaterial);

// (engine.scene.default_material as SoftwareRasterMaterial).pixel_shader = shadePixelBarycentric;

for (let i=0; i < 2; i++)
    for (let j=0; j< 2; j++) {
        let geo = engine.scene.mesh_geometries.addGeometry(suzanne_mesh);
        geo.is_static = true;
        geo.transform.translation.x = i*5;
        geo.transform.translation.z = j*5;
        // geo.transform.scale.x = geo.transform.scale.y = geo.transform.scale.z = 4;
        geo.refreshWorldMatrix(false, true);
        if (i) {
            if (j) {
                geo.material = new SoftwareRasterMaterial(engine.scene, shadePixelBarycentric);
            } else {
                geo.material = new SoftwareRasterMaterial(engine.scene, shadePixelDepth);
            }
        } else {
            if (j) {
                geo.material = new SoftwareRasterMaterial(engine.scene, shadePixelUV);
            } else {
                geo.material = new SoftwareRasterMaterial(engine.scene, shadePixelNormal);
            }
        }
    }
vp1.view_frustum.near = 1;

engine.start();


// camera.is_static = false;
// camera.lense.fov = 75;
// camera.transform.translation.x = 10;
// camera.transform.translation.y = 10;
// camera.transform.translation.z = 10;
// camera.transform.rotation.x = -1;
// camera.transform.rotation.y = 2.3;
// engine.start();



// ray_tracer = new RayTracer(context, engine.scene);
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));
// display.addViewport(controller, ray_tracer, new RayTraceViewport(controller, ray_tracer, display));


// const rt = new RayTracer(context, engine.scene);
// const vp2 = new RayTraceViewport(controller, rt, display);
// const vp3 = new RayTraceViewport(controller, rt, display);
// display.addViewport(controller, rt, vp2);
// display.addViewport(controller, rt, vp3);

// const viewport = engine.display.addViewport(controller, new Rasterizer(engine.context, engine.scene));
