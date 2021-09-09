import Node3D from "./base.js";
import Scene from "./scene.js";
import {Color3D} from "../accessors/color.js";
import {Direction3D} from "../accessors/direction.js";
import {Position3D} from "../accessors/position.js";

export default class PointLight extends Node3D
{
    readonly position: Position3D;

    constructor(
        readonly scene: Scene,
        public color = new Color3D(),
        public intensity = 1.0)
    {
        super(scene);
        scene.lights.add(this);
        if (scene.object_space_light_positions.length < scene.lights.size)
            scene.object_space_light_positions.init(scene.lights.size + 9);

        this.position = new Position3D(scene.object_space_light_positions.arrays[scene.lights.size - 1]);
    }

    setFrom(other: this): void {
        this.transform.setFrom(other.transform);
    }
}

export class DirectionalLight extends PointLight
{
    readonly direction = new Direction3D();
}