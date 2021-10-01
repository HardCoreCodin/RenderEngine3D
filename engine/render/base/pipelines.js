import Matrix4x4 from "../../accessors/matrix4x4.js";
export default class BaseRenderPipeline {
    constructor(context, scene) {
        this.context = context;
        this.scene = scene;
        this.model_to_clip = new Matrix4x4();
        this.on_mesh_loaded_callback = this.on_mesh_loaded.bind(this);
        this.on_mesh_added_callback = this.on_mesh_added.bind(this);
        this.on_mesh_removed_callback = this.on_mesh_removed.bind(this);
        scene.mesh_geometries.on_mesh_added.add(this.on_mesh_added_callback);
        scene.mesh_geometries.on_mesh_removed.add(this.on_mesh_removed_callback);
    }
    on_mesh_loaded(mesh) { }
    on_mesh_added(mesh) { mesh.on_mesh_loaded.add(this.on_mesh_loaded_callback); }
    on_mesh_removed(mesh) { mesh.on_mesh_loaded.delete(this.on_mesh_loaded_callback); }
    delete() {
        this.scene.mesh_geometries.on_mesh_added.delete(this.on_mesh_added_callback);
        this.scene.mesh_geometries.on_mesh_removed.delete(this.on_mesh_removed_callback);
    }
}
//# sourceMappingURL=pipelines.js.map