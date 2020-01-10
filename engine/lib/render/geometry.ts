import Mesh from "../geometry/mesh.js";
import Scene from "../scene_graph/scene.js";
import Node3D from "../scene_graph/node.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {IMaterial} from "../_interfaces/render.js";
import {IGeometry} from "../_interfaces/geometry.js";


export default class Geometry
    extends Node3D implements IGeometry
{
    static LAST_ID = 0;
    protected _material: IMaterial;
    readonly world_to_model = new Matrix4x4();

    constructor(
        readonly scene: Scene,
        protected _mesh: Mesh,
        public is_rigid: boolean = true,
        public is_renderable: boolean = true,
        readonly id: number = Geometry.LAST_ID++
    ) {
        super(scene);
    }

    get mesh(): Mesh {
        return this._mesh;
    }

    get material(): IMaterial {
        return this._material;
    }

    set material(material: IMaterial) {
        if (this._material) {
            if (Object.is(this._material, material))
                return;

            this._material.removeGeometry(this);
        }

        material.addGeometry(this);
        this._material = material;
    }

    set mesh(mesh: Mesh) {
        if (Object.is(mesh, this._mesh))
            return;

        if (this._material && this._material.hasGeometry(this))
            this._material.removeGeometry(this);

        this._mesh = mesh;

        if (this._material)
            this._material.addGeometry(this);
    }

    postWorldMatrixRefresh(): void {
        this.model_to_world.invert(this.world_to_model);
    }
}
