import Camera from "../render/camera.js";
import {INode3D, IScene} from "../_interfaces/nodes.js";
import Mesh from "../geometry/mesh.js";
import Geometry from "../render/geometry.js";
import Material from "../render/materials.js";


export default class Scene
    implements IScene
{
    readonly children: INode3D[];
    protected readonly _nodes: INode3D[];

    readonly geometries: Geometry[] = Array<Geometry>();
    readonly cameras: Camera[] = Array<Camera>();
    readonly materials: Material[] = Array<Material>();

    _addMaterial(material: Material): void {
        if (this.materials.indexOf(material) === -1)
            this.materials.push(material);
    }

    _removeMaterial(material: Material): void {
        const index = this.materials.indexOf(material);
        if (index === -1)
            return;

        if (this.materials.length === 1)
            this.materials.length = 0;
        else
            this.materials.splice(index, 1);
    }

    _addNode(node: INode3D): void {
        if (this._nodes.indexOf(node) === -1)
            return;

        this._nodes.push(node);
        this.children.push(node);

        if (node instanceof Geometry) this.geometries.push(node);
        if (node instanceof Camera) this.cameras.push(node);
    }

    _removeNode(node: INode3D): void {
        const index = this.children.indexOf(node);
        if (index === -1)
            return;

        if (this.children.length === 1)
            this.children.length = 0;
        else
            this.children.splice(index, 1);

        if (node instanceof Geometry) this.geometries.splice(this.geometries.indexOf(node), 1);
        if (node instanceof Camera) this.cameras.splice(this.cameras.indexOf(node), 1);
    }

    addCamera = (): Camera => new Camera(this);
    addGeometry = (mesh: Mesh): Geometry => new Geometry(this, mesh);
}