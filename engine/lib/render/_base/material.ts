import Mesh from "../../geometry/mesh.js";
import Matrix4x4 from "../../accessors/matrix4x4.js";
import {MeshGeometries} from "../../nodes/geometry.js";
import {IScene} from "../../_interfaces/nodes.js";
import {IMaterial, IRenderPipeline} from "../../_interfaces/render.js";


export default class BaseMaterial<Context extends RenderingContext,
    RenderPipelineType extends IRenderPipeline<Context>>
    implements IMaterial<Context> {
    static LAST_ID = 0;

    prepareMeshForDrawing(mesh: Mesh, render_pipeline: RenderPipelineType): void {
    };

    drawMesh(mesh: Mesh, matrix: Matrix4x4): void {
    };

    readonly id: number;
    readonly mesh_geometries: MeshGeometries;

    constructor(readonly scene: IScene<Context>) {
        this.id = BaseMaterial.LAST_ID++;
        scene.materials.add(this);
        this.mesh_geometries = new MeshGeometries(scene);
    }
}