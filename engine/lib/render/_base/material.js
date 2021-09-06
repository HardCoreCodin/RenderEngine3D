import { MeshGeometries } from "../../nodes/geometry.js";
export default class BaseMaterial {
    constructor(scene) {
        this.scene = scene;
        this.id = BaseMaterial.LAST_ID++;
        scene.materials.add(this);
        this.mesh_geometries = new MeshGeometries(scene);
    }
    prepareMeshForDrawing(mesh, render_pipeline) { }
    ;
    drawMesh(mesh, matrix) { }
    ;
}
BaseMaterial.LAST_ID = 0;
//# sourceMappingURL=material.js.map