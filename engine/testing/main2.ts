import Mesh from "../lib/geometry/mesh.js";
import {MeshInputs} from "../lib/geometry/inputs.js";
import {ATTRIBUTE, FACE_TYPE} from "../constants.js";
import {MeshOptions} from "../lib/geometry/options.js";
import {GLRenderEngine} from "./gl/render/engine.js";
import {GLMaterial} from "./gl/materials/base.js";

var g: {[k: string]: any} = {};
globalThis.g = g;

g.canvas = document.querySelector('canvas');
const engine = g.engine = new GLRenderEngine(g.canvas);
const camera = g.c = engine.screen.active_viewport.camera;
camera.is_static = false;
camera.fov = 75;

camera.transform.translation.y = 1;



g.mesh_options = new MeshOptions(1, 0,0, true);
g.mesh_inputs = new MeshInputs(FACE_TYPE.TRIANGLE, ATTRIBUTE.position|ATTRIBUTE.uv);
g.input_positions = g.mesh_inputs.position;
g.input_uvs = g.mesh_inputs.uv;

(async () => {
    g.susan = (await (await fetch('Susan.json')).json()).meshes[0];
    g.susan_positions = g.susan.vertices;
    g.susan_uvs = g.susan.texturecoords[0];
    g.vertex_count = g.susan_positions.length / 3;

    const vertex_uv: [number, number] = [0, 0];
    const vertex_position: [number, number, number] = [0, 0, 0];

    let vertex_uv_offset = 0;
    let vertex_position_offset = 0;
    for (let vertex_id = 0; vertex_id < g.vertex_count; vertex_id++) {
        vertex_position[0] = g.susan_positions[vertex_position_offset];
        vertex_position[1] = g.susan_positions[vertex_position_offset + 1];
        vertex_position[2] = g.susan_positions[vertex_position_offset + 2];
        g.input_positions.pushVertex(vertex_position);

        vertex_uv[0] = g.susan_uvs[vertex_uv_offset];
        vertex_uv[1] = g.susan_uvs[vertex_uv_offset + 1];
        g.input_uvs.pushVertex(vertex_uv);

        vertex_uv_offset += 2;
        vertex_position_offset += 3;
    }
    for (const face of g.susan.faces)
        g.input_positions.pushFace(face);

    g.mesh = new Mesh(g.mesh_inputs, g.mesh_options).load();
    // g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
    // g.geometry.material = g.engine.scene.addMaterial(GLMaterial);

    for (let i=0; i < 10; i++)
        for (let j=0; j< 10; j++) {
            let geo = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
            geo.material = g.engine.scene.addMaterial(GLMaterial);

            geo.transform.translation.x = i - 5;
            geo.transform.translation.z = j - 5;
            geo.transform.scale.x = geo.transform.scale.y = geo.transform.scale.z = 0.1
        }


    g.engine.start();
})();
