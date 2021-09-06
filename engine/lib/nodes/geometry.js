import Node3D from "./_base.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
class BaseGeometry extends Node3D {
    constructor(scene, is_rigid = true, is_renderable = true) {
        super(scene);
        this.scene = scene;
        this.is_rigid = is_rigid;
        this.is_renderable = is_renderable;
        this.world_to_model = new Matrix4x4();
        this.id = Geometry.LAST_ID++;
    }
    get material() {
        return this._material;
    }
    set material(material) {
        if (this._material && Object.is(this._material, material))
            return;
        this._material = material;
    }
    postWorldMatrixRefresh() {
        this.model_to_world.invert(this.world_to_model);
    }
}
BaseGeometry.LAST_ID = 0;
export default class Geometry extends BaseGeometry {
    constructor(scene, _mesh, is_rigid = true, is_renderable = true) {
        super(scene, is_rigid, is_renderable);
        this._mesh = _mesh;
        scene.mesh_geometries.addGeometry(this);
        this.material = scene.default_material;
    }
    get mesh() {
        return this._mesh;
    }
    set material(material) {
        if (this._material) {
            if (Object.is(this._material, material))
                return;
            this._material.mesh_geometries.removeGeometry(this);
        }
        material.mesh_geometries.addGeometry(this);
        this._material = material;
    }
    set mesh(mesh) {
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
    constructor(scene) {
        this.scene = scene;
        this.on_mesh_added = new Set();
        this.on_mesh_removed = new Set();
        this._map = new Map();
    }
    get meshes() { return this._iterMeshes(); }
    get mesh_count() { return this._map.size; }
    hasMesh(mesh) { return this._map.has(mesh); }
    hasGeometry(geometry) {
        const geometries = this._map.get(geometry.mesh);
        return geometries ? geometries.has(geometry) : false;
    }
    getGeometries(mesh) { return this._iterGeometries(mesh); }
    getGeometryCount(mesh) { return this._map.has(mesh) ? this._map.get(mesh).size : 0; }
    addGeometry(mesh_or_geometry) {
        const geometry = mesh_or_geometry instanceof Geometry ?
            mesh_or_geometry :
            new Geometry(this.scene, mesh_or_geometry);
        let geometries;
        if (this._map.has(geometry.mesh)) {
            geometries = this._map.get(geometry.mesh);
            if (!geometries.has(geometry))
                geometries.add(geometry);
        }
        else {
            geometries = new Set();
            geometries.add(geometry);
            this._map.set(geometry.mesh, geometries);
            if (this.on_mesh_added.size)
                for (const mesh_added of this.on_mesh_added)
                    mesh_added(geometry.mesh);
        }
        return geometry;
    }
    removeGeometry(geometry) {
        const geometries = this._map.get(geometry.mesh);
        if (geometries && geometries.has(geometry)) {
            if (geometries.size === 1) {
                this._map.delete(geometry.mesh);
                if (this.on_mesh_removed.size)
                    for (const mesh_removed of this.on_mesh_removed)
                        mesh_removed(geometry.mesh);
            }
            else
                geometries.delete(geometry);
        }
    }
    *_iterGeometries(mesh) {
        if (this._map.has(mesh))
            for (const geometry of this._map.get(mesh))
                yield geometry;
    }
    *_iterMeshes() {
        for (const mesh of this._map.keys())
            yield mesh;
    }
}
//# sourceMappingURL=geometry.js.map