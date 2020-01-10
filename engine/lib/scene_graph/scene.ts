import Parent from "./parent.js";
import Camera from "../render/camera.js";
import Material from "../render/materials.js";
import {MeshGeometries} from "../render/geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {ICamera, IMaterial} from "../_interfaces/render.js";

export abstract class BaseScene
    extends Parent
    implements IScene
{
    protected abstract _createCamera(): ICamera;
    protected abstract _createMaterial(...args: any[]): IMaterial;

    readonly mesh_geometries: MeshGeometries;
    readonly cameras = new Set<ICamera>();
    readonly materials = new Set<IMaterial>();

    constructor() {
        super();
        this.mesh_geometries = new MeshGeometries(this);
    }

    addCamera(): ICamera {return this._createCamera()}
    addMaterial(...args: any[]): IMaterial {return this._createMaterial(...args)}
}

export default class Scene extends BaseScene {
    protected _createCamera(): Camera {return new Camera(this)}
    protected _createMaterial(...args: any[]): Material {return new Material(this)}
}