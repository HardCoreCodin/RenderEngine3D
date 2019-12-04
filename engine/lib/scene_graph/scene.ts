import Camera from "../render/camera.js";
import {INode3D, IScene} from "../_interfaces/nodes.js";
import Mesh from "../geometry/mesh.js";
import Geometry from "./geometry.js";
import {Parent} from "./parent.js";


export default class Scene
    extends Parent
    implements IScene
{
    public readonly geometries: Geometry[] = Array<Geometry>();
    public readonly cameras: Camera[] = Array<Camera>();

    _add(node: INode3D) {
        this.children.push(node);

        if (node instanceof Geometry) this.geometries.push(node);
        if (node instanceof Camera) this.cameras.push(node);
    }

    addCamera = (): Camera => new Camera(this);
    addGeometry = (mesh: Mesh): Geometry => new Geometry(this, mesh);
}