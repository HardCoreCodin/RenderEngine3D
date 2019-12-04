import Mesh from "../geometry/mesh.js";
import Scene from "./scene.js";
import Node3D from "./node.js";
import Material from "../render/materials.js";
import {AABB4D} from "../geometry/bounds.js";

export default class Geometry
    extends Node3D
{
    public world_bounds: AABB4D = new AABB4D();
    public clip_bounds: AABB4D = new AABB4D();

    constructor(
        public readonly scene: Scene,
        public readonly mesh: Mesh,
        public material: Material = Material.DEFAULT
    ) {
        super(scene);
    }

    postWorldMatrixRefresh() {
        this.mesh.bounds.homogenize(this.world_bounds);
        this.world_bounds.transform(this.transform.matrix);
    }
}