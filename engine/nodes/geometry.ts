import Node3D from "./_base.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import Scene from "./scene.js";
import Mesh from "../geometry/mesh.js";
import {IMaterial, IMeshCallback} from "../core/interfaces/render.js";


abstract class BaseGeometry<Context extends RenderingContext = RenderingContext>
    extends Node3D
{
    static LAST_ID = 0;
    readonly id: number;
    protected _material: IMaterial<Context>;
    readonly world_to_model = new Matrix4x4();

    constructor(
        readonly scene: Scene<Context>,
        public is_rigid: boolean = true,
        public is_renderable: boolean = true
    ) {
        super(scene);
        this.id = Geometry.LAST_ID++;
    }

    get material(): IMaterial<Context> {
        return this._material;
    }

    set material(material: IMaterial<Context>) {
        if (this._material && Object.is(this._material, material))
            return;

        this._material = material;
    }

    postWorldMatrixRefresh(): void {
        this.model_to_world.invert(this.world_to_model);
    }
}

export default class Geometry<Context extends RenderingContext = RenderingContext>
    extends BaseGeometry
{
    constructor(
        scene: Scene<Context>,
        protected _mesh: Mesh,
        is_rigid: boolean = true,
        is_renderable: boolean = true
    ) {
        super(scene, is_rigid, is_renderable);
        scene.mesh_geometries.addGeometry(this);
        this.material = scene.default_material;
    }

    get mesh(): Mesh {
        return this._mesh;
    }

    set material(material: IMaterial<Context>) {
        if (this._material) {
            if (Object.is(this._material, material))
                return;

            this._material.mesh_geometries.removeGeometry(this);
        }

        material.mesh_geometries.addGeometry(this);
        this._material = material;
    }

    set mesh(mesh: Mesh) {
        if (Object.is(mesh, this._mesh))
            return;

        if (this._material && this._material.mesh_geometries.hasGeometry(this))
            this._material.mesh_geometries.removeGeometry(this);

        this._mesh = mesh;

        if (this._material)
            this._material.mesh_geometries.addGeometry(this);
    }
}


export class MeshGeometries {
    readonly on_mesh_added = new Set<IMeshCallback>();
    readonly on_mesh_removed= new Set<IMeshCallback>();

    constructor(readonly scene: Scene) {}

    protected readonly _map = new Map<Mesh, Set<Geometry>>();

    get meshes(): Generator<Mesh> {return this._iterMeshes()}
    get mesh_count(): number {return this._map.size}

    hasMesh(mesh: Mesh): boolean {return this._map.has(mesh)}
    hasGeometry(geometry: Geometry): boolean {
        const geometries = this._map.get(geometry.mesh);
        return geometries ? geometries.has(geometry) : false;
    }

    getGeometries(mesh: Mesh): Generator<Geometry> {return this._iterGeometries(mesh)}
    getGeometryCount(mesh: Mesh): number {return this._map.has(mesh) ? this._map.get(mesh).size : 0}

    addGeometry(mesh: Mesh): Geometry;
    addGeometry(geometry: Geometry): Geometry;
    addGeometry(mesh_or_geometry: Geometry | Mesh): Geometry {
        const geometry = mesh_or_geometry instanceof Geometry ?
            mesh_or_geometry :
            new Geometry(this.scene, mesh_or_geometry);

        let geometries: Set<Geometry>;
        if (this._map.has(geometry.mesh)) {
            geometries = this._map.get(geometry.mesh);
            if (!geometries.has(geometry))
                geometries.add(geometry);
        } else {
            geometries = new Set<Geometry>();
            geometries.add(geometry);
            this._map.set(geometry.mesh, geometries);

            if (this.on_mesh_added.size)
                for (const mesh_added of this.on_mesh_added)
                    mesh_added(geometry.mesh);
        }

        return geometry;

    }

    removeGeometry(geometry: Geometry) {
        const geometries = this._map.get(geometry.mesh);
        if (geometries && geometries.has(geometry)) {
            if (geometries.size === 1) {
                this._map.delete(geometry.mesh);
                if (this.on_mesh_removed.size)
                    for (const mesh_removed of this.on_mesh_removed)
                        mesh_removed(geometry.mesh);
            } else
                geometries.delete(geometry);
        }
    }

    protected *_iterGeometries(mesh: Mesh): Generator<Geometry> {
        if (this._map.has(mesh))
            for (const geometry of this._map.get(mesh))
                yield geometry
    }

    protected *_iterMeshes(): Generator<Mesh> {
        for (const mesh of this._map.keys())
            yield mesh;
    }
}