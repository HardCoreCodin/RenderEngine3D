import Node3D from "./base.js";
import { Color3D } from "../accessors/color.js";
import { Direction3D } from "../accessors/direction.js";
import { Position3D } from "../accessors/position.js";
export default class PointLight extends Node3D {
    constructor(scene, color = new Color3D(), intensity = 1.0) {
        super(scene);
        this.scene = scene;
        this.color = color;
        this.intensity = intensity;
        scene.lights.add(this);
        this.position = new Position3D(this.transform.translation.array);
    }
    setFrom(other) {
        this.transform.setFrom(other.transform);
    }
}
export class DirectionalLight extends PointLight {
    constructor() {
        super(...arguments);
        this.direction = new Direction3D();
    }
}
//# sourceMappingURL=light.js.map