import Parent from "./parent.js";
import Camera from "../render/camera.js";
import Geometry, {MeshGeometries} from "../render/geometry.js";
import {ICamera, IMaterial} from "../_interfaces/render.js";
import {INode3D, IScene} from "../_interfaces/nodes.js";


export default class Scene extends Parent implements IScene {
    readonly mesh_geometries: MeshGeometries;

    protected readonly _nodes: Set<INode3D> = new Set<INode3D>();
    protected readonly _cameras: Set<ICamera> = new Set<ICamera>();
    protected readonly _materials: Set<IMaterial> = new Set<IMaterial>();

    constructor(){
        super();
        this.mesh_geometries = new MeshGeometries(this);
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

    addMaterial(material: IMaterial): typeof material {
        if (!this._materials.has(material))
            this._materials.add(material);

        return material;
    }

    removeMaterial(material: IMaterial): typeof material {
        if (this._materials.has(material))
            this._materials.delete(material);

        return material;
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

    addNode(node: INode3D): typeof node {
        if (this._nodes.has(node))
            return node;

        this._nodes.add(node);

        if (node instanceof Geometry) this.mesh_geometries.addGeometry(node);
        if (node instanceof Camera) this.addCamera(node);

        return node;
    }

    removeNode(node: INode3D): typeof node {
        if (!this._nodes.has(node))
            return node;

        this._nodes.delete(node);
        if (this.hasChild(node))
            this.removeChild(node);

        if (node instanceof Geometry) this.mesh_geometries.removeGeometry(node);
        if (node instanceof Camera) this.removeCamera(node);

        return node;
    }

    addCamera(camera: ICamera = new Camera(this)): typeof camera {
        if (!this._cameras.has(camera))
            this._cameras.add(camera);

        return camera;
    }

    removeCamera(camera: Camera): typeof camera {
        if (this._cameras.has(camera))
            this._cameras.delete(camera);

        return camera;
    }

    get camera_count(): number {
        return this._cameras.size
    }

    hasCamera(camera: Camera): boolean {
        return this._cameras.has(camera)
    }

    get cameras(): Generator<ICamera> {
        return this._iterCameras();
    }

    protected *_iterCameras(): Generator<ICamera> {
        for (const camera of this._cameras)
            yield camera;
    }
}