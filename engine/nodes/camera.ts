import Node3D from "./base.js";
import Scene from "./scene.js";
import {
    DEFAULT_FOCAL_LENGTH,
    DEFAULT_ZOOM,
    DEGREES_TO_RADIANS_FACTOR,
    MAX_FOV,
    MIN_FOCAL_LENGTH,
    MIN_FOV,
    MIN_ZOOM,
    RADIANS_TO_DEGREES_FACTOR
} from "../core/constants.js";


export default class Camera
    extends Node3D
{
    is_perspective: boolean = true;
    readonly lense: Lense = new Lense();

    constructor(readonly scene: Scene) {
        super(scene);
        scene.cameras.add(this)
    }

    setFrom(other: this): void {
        this.lense.setFrom(other.lense);
        this.transform.setFrom(other.transform);
    }
}

export class Lense
{
    protected _zoom: number = DEFAULT_ZOOM;
    protected _focal_length: number = DEFAULT_FOCAL_LENGTH;

    setFrom(other: this): void {
        this.zoom = other.zoom;
        this.focal_length = other.focal_length;
    }

    get zoom(): number {return this._zoom}
    set zoom(zoom: number) {
        if (zoom === this._zoom)
            return;

        if (zoom < MIN_ZOOM)
            zoom = MIN_ZOOM;

        this._zoom = zoom;
    }

    // angle_in_degrees
    get fov(): number {return (Math.atan(1.0 / this._focal_length) / 2) * RADIANS_TO_DEGREES_FACTOR}
    set fov(angle_in_degrees: number) {
        if (angle_in_degrees > MAX_FOV)
            angle_in_degrees = MAX_FOV;
        if (angle_in_degrees < MIN_FOV)
            angle_in_degrees = MIN_FOV;

        this._focal_length = 1.0 / Math.tan(angle_in_degrees*DEGREES_TO_RADIANS_FACTOR / 2);
    }

    get focal_length(): number {return this._focal_length}
    set focal_length(focal_length: number) {
        if (focal_length === this._focal_length)
            return;

        if (focal_length < MIN_FOCAL_LENGTH)
            focal_length = MIN_FOCAL_LENGTH;

        this._focal_length = focal_length;
    }
}