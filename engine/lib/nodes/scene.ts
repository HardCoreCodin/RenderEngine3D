import {Parent} from "./_base.js";
import Camera from "./camera.js";
import {IScene} from "../_interfaces/nodes.js";
import Mesh from "../mesh/_base.js";
import Geometry from "./geometry.js";


export class Scene
    extends Parent
    implements IScene
{
    addCamera = (): Camera => new Camera(this);
    addGeometry = (mesh: Mesh): Geometry => new Geometry(this, mesh);
}