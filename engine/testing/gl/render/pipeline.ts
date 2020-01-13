import {GLScene} from "./engine.js";
import {GLMeshBuffers} from "./mesh_buffers.js";
import {GLViewport} from "../display/viewport.js";
import {BaseRenderPipeline} from "../../../lib/render/pipelines.js";
import {IMesh} from "../../../lib/_interfaces/geometry.js";

export class GLRenderPipeline extends BaseRenderPipeline<WebGL2RenderingContext, GLScene> {
    readonly mesh_buffers = new Map<IMesh, GLMeshBuffers>();

    render(viewport: GLViewport): void {
        for (const material of viewport.scene.materials) {
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

    on_mesh_loaded(mesh: IMesh) {
        this.mesh_buffers.get(mesh).load();
    }

    on_mesh_added(mesh: IMesh) {
        this.mesh_buffers.set(mesh, new GLMeshBuffers(this.context, mesh));
    }

    on_mesh_removed(mesh: IMesh) {
        this.mesh_buffers.get(mesh).delete();
        this.mesh_buffers.delete(mesh);
    }
}