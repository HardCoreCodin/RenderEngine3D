import Scene from "../../nodes/scene.js";
import {IMesh} from "../../core/interfaces/geometry.js";
import {
    // IImplicitGeometryCallback,
    IMeshCallback,
    IRenderPipeline,
    IViewport
} from "../../core/interfaces/render.js";


export default abstract class BaseRenderPipeline<
    Context extends RenderingContext,
    ViewportType extends IViewport<Context> = IViewport<Context>>
    implements IRenderPipeline<Context, ViewportType>
{
    abstract render(viewport: ViewportType): void;

    // readonly on_implicit_geometry_added_callback: IImplicitGeometryCallback;
    // readonly on_implicit_geometry_removed_callback: IImplicitGeometryCallback;

    readonly on_mesh_loaded_callback: IMeshCallback;
    readonly on_mesh_added_callback: IMeshCallback;
    readonly on_mesh_removed_callback: IMeshCallback;

    constructor(
        readonly context: Context,
        readonly scene: Scene<Context>
    ) {
        this.on_mesh_loaded_callback = this.on_mesh_loaded.bind(this);
        this.on_mesh_added_callback = this.on_mesh_added.bind(this);
        this.on_mesh_removed_callback = this.on_mesh_removed.bind(this);

        scene.mesh_geometries.on_mesh_added.add(this.on_mesh_added_callback);
        scene.mesh_geometries.on_mesh_removed.add(this.on_mesh_removed_callback);
    }

    on_mesh_loaded(mesh: IMesh) {}
    on_mesh_added(mesh: IMesh) {mesh.on_mesh_loaded.add(this.on_mesh_loaded_callback)}
    on_mesh_removed(mesh: IMesh) {mesh.on_mesh_loaded.delete(this.on_mesh_loaded_callback)}

    delete(): void {
        this.scene.mesh_geometries.on_mesh_added.delete(this.on_mesh_added_callback);
        this.scene.mesh_geometries.on_mesh_removed.delete(this.on_mesh_removed_callback);
    }
}