import Mesh from "../geometry/mesh.js";
import Scene from "../scene_graph/scene.js";
import Node3D from "../scene_graph/node.js";
import Material from "./materials.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";


export default class Geometry
    extends Node3D
{
    static LAST_ID = 0;
    protected _material: Material;
    readonly world_to_model = new Matrix4x4();

    constructor(
        public readonly scene: Scene,
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

    get material(): Material {
        return this._material;
    }

    set material(material: Material) {
        if (Object.is(material, this._material))
            return;

        // if (this._material.geometry_count === 1)
            this.scene._removeMaterial(this._material);
        // else
        //     this._material._removeGeometry(this);

        // material._addGeometry(this);
        this.scene._addMaterial(material);
        this._material = material;
    }

    set mesh(mesh: Mesh) {
        if (Object.is(mesh, this._mesh))
            return;
        //
        // if (this._mesh.geometry_count === 1)
        //     this.scene._removeMesh(this._mesh);
        // else
            this._mesh._removeGeometry(this);

        mesh._addGeometry(this);
        // this.scene._addMesh(mesh);
        this._mesh = mesh;
    }

    postWorldMatrixRefresh(): void {
        this.world_to_model.inverted(this.world_to_model);
    }
}
