import Mesh from "../geometry/mesh.js";
import Scene from "../scene_graph/scene.js";
import Node3D from "../scene_graph/node.js";
import Material from "./materials.js";
import {Matrix4x4} from "../accessors/matrix.js";
import Rasterizer from "./rasterizer.js";


export default class Geometry
    extends Node3D
{
    readonly would_to_local = new Matrix4x4();
    readonly raterizer: Rasterizer;

    constructor(
        public readonly scene: Scene,
        public readonly mesh: Mesh,
        public readonly is_rigid: boolean = true,
        public material: Material = Material.DEFAULT
    ) {
        super(scene);

        this.raterizer = new Rasterizer(
            mesh.face_vertices,
            mesh.data.vertices.positions,
            mesh.bbox.vertex_positions,
           this.local_to_world
        );
    }

    postWorldMatrixRefresh(): void {
        this.would_to_local.inverted(this.would_to_local);
    }
}
