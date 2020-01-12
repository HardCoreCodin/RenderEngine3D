import Mesh from "../lib/geometry/mesh.js";
import {MeshInputs} from "../lib/geometry/inputs.js";
import {ATTRIBUTE, FACE_TYPE} from "../constants.js";
import {MeshOptions} from "../lib/geometry/options.js";
import {GLRenderEngine} from "./gl/render/engine.js";
import {T2, T3} from "../types.js";
import {GLMaterial} from "./gl/materials/base.js";

const canvas: HTMLCanvasElement = document.querySelector('canvas');
const engine = globalThis.engine = new GLRenderEngine(canvas);

const mesh_options = new MeshOptions(0, 0,0, true);
const mesh_inputs = new MeshInputs(FACE_TYPE.TRIANGLE, ATTRIBUTE.position|ATTRIBUTE.uv);
const input_positions = mesh_inputs.position;
const input_uvs = mesh_inputs.uv;

(async () => {
    const susan = (await (await fetch('Susan.json')).json()).meshes[0];
    const susan_positions = susan.vertices;
    const susan_uvs = susan.texturecoords[0];
    const vertex_count = susan_positions.length / 3;

    const vertex_uv = Array<number>(2) as T2<number>;
    const vertex_position = Array<number>(3) as T3<number>;

    let vertex_uv_offset = 0;
    let vertex_position_offset = 0;
    for (let vertex_id = 0; vertex_id < vertex_count; vertex_id++) {
        vertex_position[0] = susan_positions[vertex_position_offset];
        vertex_position[1] = susan_positions[vertex_position_offset + 1];
        vertex_position[2] = susan_positions[vertex_position_offset + 2];
        input_positions.pushVertex(vertex_position);

        vertex_uv[0] = susan_uvs[vertex_uv_offset];
        vertex_uv[1] = susan_uvs[vertex_uv_offset + 1];
        input_uvs.pushVertex(vertex_uv);

        vertex_uv_offset += 2;
        vertex_position_offset += 3;
    }
    for (const face of susan.faces)
        input_positions.pushFace(face);

    const mesh = globalThis.mesh = new Mesh(mesh_inputs, mesh_options).load();
    const geometry = globalThis.geometry = engine.scene.mesh_geometries.addGeometry(mesh);
    geometry.material = globalThis.material = engine.scene.addMaterial(GLMaterial);

    engine.start();
})();
