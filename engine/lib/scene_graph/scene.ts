import Parent from "./parent.js";
import Mesh from "../geometry/mesh.js";
import Camera from "../render/camera.js";
import Geometry from "../render/geometry.js";
import {IMaterial} from "../_interfaces/render.js";
import {INode3D, IScene} from "../_interfaces/nodes.js";


export default class Scene extends Parent implements IScene {
    protected readonly _nodes: Set<INode3D> = new Set<INode3D>();
    protected readonly _cameras: Set<Camera> = new Set<Camera>();
    protected readonly _geometries: Set<Geometry> = new Set<Geometry>();
    protected readonly _materials: Set<IMaterial> = new Set<IMaterial>();

    get geometry_count(): number {
        return this._geometries.size
    }

    hasGeometry(geometry: Geometry): boolean {
        return this._geometries.has(geometry)
    }

    get geometries(): Generator<Geometry> {
        return this._iterGeometries()
    }

    protected *_iterGeometries(): Generator<Geometry> {
        for (const geometry of this._geometries)
            yield geometry;
    }

    addGeometry(mesh: Mesh): Geometry;
    addGeometry(geometry: Geometry): Geometry;
    addGeometry(mesh_or_geometry: Geometry | Mesh): Geometry {
        if (mesh_or_geometry instanceof Mesh) {
            const geometry = new Geometry(this, mesh_or_geometry);
            this._geometries.add(geometry);
            return geometry;
        } else {
            if (!this._geometries.has(mesh_or_geometry))
                this._geometries.add(mesh_or_geometry);

            return mesh_or_geometry;
        }
    }

    removeGeometry(geometry: Geometry) {
        if (this._geometries.has(geometry))
            this._geometries.delete(geometry);
    }

    get material_count(): number {
        return this._materials.size
    }

    hasMaterial(material: IMaterial): boolean {
        return this._materials.has(material)
    }

    get materials(): Generator<IMaterial> {
        return this._iterMaterials()
    }

    protected *_iterMaterials(): Generator<IMaterial> {
        for (const material of this._materials)
            yield material;
    }

    addMaterial(material: IMaterial): void {
        if (!this._materials.has(material))
            this._materials.add(material);
    }

    removeMaterial(material: IMaterial) {
        if (this._materials.has(material))
            this._materials.delete(material);
    }

    get node_count(): number {
        return this._nodes.size
    }

    hasNode(node: INode3D): boolean {
        return this._nodes.has(node)
    }

    get nodes(): Generator<INode3D> {
        return this._iterNodes()
    }

    protected *_iterNodes(): Generator<INode3D> {
        for (const node of this._nodes)
            yield node;
    }

    addNode(node: INode3D): void {
        if (this._nodes.has(node))
            return;

        this._nodes.add(node);

        if (node instanceof Geometry) this.addGeometry(node);
        if (node instanceof Camera) this.addCamera(node);
    }

    removeNode(node: INode3D): void {
        if (!this._nodes.has(node))
            return;

        this._nodes.delete(node);
        if (this.hasChild(node))
            this.removeChild(node);

        if (node instanceof Geometry) this.removeGeometry(node);
        if (node instanceof Camera) this.removeCamera(node);
    }

    addCamera(camera: Camera = new Camera(this)): Camera {
        if (!this._cameras.has(camera))
            this._cameras.add(camera);

        return camera;
    }

    removeCamera(camera: Camera): void {
        if (this._cameras.has(camera))
            this._cameras.delete(camera);
    }
}