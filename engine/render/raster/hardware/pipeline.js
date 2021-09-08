import Matrix4x4 from "../../../accessors/matrix4x4.js";
import GLMeshBuffers from "./core/mesh_buffers.js";
import GLMaterial from "./materials/base.js";
import BaseRenderPipeline from "../../base/pipelines.js";
export default class GLRenderPipeline extends BaseRenderPipeline {
    constructor() {
        super(...arguments);
        this.model_to_clip = new Matrix4x4();
        this.mesh_buffers = new Map();
    }
    render(viewport) {
        for (const material of this.scene.materials)
            if (material instanceof GLMaterial) {
                material.program.use();
                for (const mesh of material.mesh_geometries.meshes) {
                    material.prepareMeshForDrawing(mesh, this);
                    for (const geometry of material.mesh_geometries.getGeometries(mesh)) {
                        geometry.model_to_world.mul(viewport.world_to_clip, this.model_to_clip);
                        material.drawMesh(mesh, this.model_to_clip);
                    }
                }
            }
    }
    on_mesh_loaded(mesh) {
        this.mesh_buffers.get(mesh).load();
    }
    on_mesh_added(mesh) {
        this.mesh_buffers.set(mesh, new GLMeshBuffers(this.context, mesh));
    }
    on_mesh_removed(mesh) {
        this.mesh_buffers.get(mesh).delete();
        this.mesh_buffers.delete(mesh);
    }
}
//# sourceMappingURL=pipeline.js.map