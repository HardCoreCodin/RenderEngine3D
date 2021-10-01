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
        this.position = new Position3D(this.transform.translation.array);
    }

    setFrom(other: this): void {
        this.transform.setFrom(other.transform);
    }
}

export class DirectionalLight extends PointLight
{
    readonly direction = new Direction3D();
}