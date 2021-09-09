import Camera from "./camera.js";
import {Parent} from "./base.js";
import {MeshGeometries} from "./geometry.js";
import {IMaterial, IMaterialConstructor} from "../core/interfaces/render.js";
import Spheres from "../geometry/implicit/spheres.js";
import PointLight, {DirectionalLight} from "./light.js";
import {Color3D} from "../accessors/color.js";
import {Positions3D} from "../buffers/vectors.js";


export default class Scene<
    Context extends RenderingContext = RenderingContext,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends Parent
{
    readonly mesh_geometries: MeshGeometries;
    readonly spheres = new Spheres();
    readonly lights = new Set<PointLight>();
    readonly cameras = new Set<Camera>();
    readonly materials = new Set<IMaterial<Context>>();
    readonly default_material: MaterialType;
    readonly object_space_light_positions = new Positions3D().init(10);

    constructor(
        public context: Context,
        DefaultMaterialClass: IMaterialConstructor<Context, MaterialType>
    ) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = new DefaultMaterialClass(this);
    }

    addCamera(): Camera {
        return new Camera(this)
    }

    addPointLight(color = new Color3D(), intensity = 1.0): PointLight {
        return new PointLight(this, color, intensity)
    }

    addDirectionalLight(color = new Color3D(), intensity = 1.0): DirectionalLight {
        return new DirectionalLight(this, color, intensity)
    }
}