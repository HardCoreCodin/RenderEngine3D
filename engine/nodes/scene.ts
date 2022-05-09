import Camera from "./camera.js";
import {Parent} from "./base.js";
import {MeshGeometries} from "./geometry.js";
import {IMaterial, IMaterialConstructor} from "../core/interfaces/render.js";
import Spheres from "../geometry/implicit/spheres.js";
import PointLight, {DirectionalLight} from "./light.js";
import {Color3D} from "../accessors/color.js";
import {Texture} from "../buffers/textures.js";


export default class Scene<
    Context extends RenderingContext = RenderingContext,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends Parent
{
    readonly mesh_geometries: MeshGeometries;
    readonly spheres = new Spheres();
    readonly ambient_color = new Color3D();
    readonly lights = new Set<PointLight>();
    readonly cameras = new Set<Camera>();
    readonly materials = new Set<IMaterial<Context>>();
    readonly default_material: MaterialType;
    public textures: Texture[] = [];

    constructor(public MaterialClass: IMaterialConstructor<Context, MaterialType>) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = new MaterialClass(this);
    }

    addMaterial(): MaterialType {
        return new this.MaterialClass(this);
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

    addTexture(
        context: Context,
        image: HTMLImageElement,
        load: boolean = true,
        wrap: boolean = false,
        mipmap: boolean = true,
        filter: boolean = true,
        width: number = image.width,
        height: number = image.height,
    ): Texture {
        const texture = new Texture(image, context as CanvasRenderingContext2D, wrap, mipmap, filter, width, height);
        this.textures.push(load ? texture.load(wrap, mipmap) : texture);
        return texture;
    }
}