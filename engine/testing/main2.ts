import Mesh from "../lib/geometry/mesh.js";
import {MeshInputs} from "../lib/geometry/inputs.js";
import {MeshOptions} from "../lib/geometry/options.js";
import {ATTRIBUTE} from "../constants.js";

import GLRenderEngine from "../lib/render/raster/hardware/engine.js";
import {rgba} from "../lib/accessors/color.js";

globalThis.rgba = rgba;
// globalThis.r = rgba(1, 0 ,0, 1);
// globalThis.g = rgba(0, 1 ,0, 1);
// globalThis.b = rgba(0, 0 ,1, 1);

const engine = globalThis.engine = new GLRenderEngine();
const mesh_options = new MeshOptions(1, 0,0, true);
const mesh_inputs = new MeshInputs(ATTRIBUTE.position|ATTRIBUTE.uv);
const input_positions = mesh_inputs.position;
const input_uvs = mesh_inputs.uv;

const display = engine.display;
const vp1 = display.active_viewport;
const camera = vp1.controller.camera;
camera.is_static = false;
camera.lense.fov = 75;
camera.transform.translation.y = 1;


(async () => {
    const susan = (await (await fetch('Susan.json')).json()).meshes[0];
    const susan_positions = susan.vertices;
    const susan_uvs = susan.texturecoords[0];
    const vertex_count = susan_positions.length / 3;

    const vertex_uv: [number, number] = [0, 0];

    let vertex_uv_offset = 0;
    let vertex_position_offset = 0;
    for (let vertex_id = 0; vertex_id < vertex_count; vertex_id++) {
        input_positions.addVertex(
            susan_positions[vertex_position_offset    ],
            susan_positions[vertex_position_offset + 1],
            susan_positions[vertex_position_offset + 2]
        );
        input_uvs.addVertex(
            susan_uvs[vertex_uv_offset    ],
            susan_uvs[vertex_uv_offset + 1]
        );

        vertex_uv_offset += 2;
        vertex_position_offset += 3;
    }
    for (const face of susan.faces) {
        input_positions.addFace(...face);
        input_uvs.addFace(...face);
    }

    const mesh = new Mesh(mesh_inputs, mesh_options).load();
    // g.geometry = g.engine.scene.mesh_geometries.addGeometry(g.mesh);
    // g.geometry.material = g.engine.scene.addMaterial(GLMaterial);

    for (let i=0; i < 10; i++)
        for (let j=0; j< 10; j++) {
            let geo = engine.scene.mesh_geometries.addGeometry(mesh);
            geo.transform.translation.x = i - 5;
            geo.transform.translation.z = j - 5;
            geo.transform.scale.x = geo.transform.scale.y = geo.transform.scale.z = 0.1
        }


    engine.start();

    // display = engine.display;
    // vp1 = display.active_viewport;
    // vp2 = display.addViewport(vp1.controller);
    // vp3 = display.addViewport(vp1.controller);

})();

// globalThis.g = g;