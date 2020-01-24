import Node3D from "./_base.js";
import {IScene} from "../_interfaces/nodes.js";
import {ICamera, ILense} from "../_interfaces/render.js";
import {
    DEFAULT_FOCAL_LENGTH,
    DEFAULT_ZOOM,
    DEGREES_TO_RADIANS_FACTOR,
    MAX_FOV,
    MIN_FOCAL_LENGTH,
    MIN_FOV,
    MIN_ZOOM,
    RADIANS_TO_DEGREES_FACTOR
} from "../../constants.js";


export abstract class Camera
    extends Node3D
    implements ICamera
{
    readonly lense: Lense;
    protected _is_perspective: boolean = true;

    constructor(readonly scene: IScene, is_perspective: boolean = true) {
        super(scene);
        scene.cameras.add(this);

        this.lense = this._getLense();

        this._init(is_perspective);
    }

    protected _init(is_perspective: boolean = true): void {
        this.is_perspective = is_perspective;
    }

    protected _getLense(): Lense {
        return new Lense(this);
    }

    setFrom(other: this): void {
        this.lense.setFrom(other.lense);
        this.transform.setFrom(other.transform);

        this._init(other.is_perspective);
    }

    get is_perspective(): boolean {return this._is_perspective}
    set is_perspective(is_perspective: boolean) {
        this._is_perspective = is_perspective;
    }
}


export class Lense<CameraType extends ICamera = ICamera>
    implements ILense
{
    protected _zoom: number = DEFAULT_ZOOM;
    protected _focal_length: number = DEFAULT_FOCAL_LENGTH;

    constructor(protected _camera: CameraType) {}

    setFrom(other: this): void {
        this._zoom = other._zoom;
        this._focal_length = other._focal_length;
    }

    get zoom(): number {
        return this._zoom
    }

    set zoom(zoom: number) {
        if (zoom === this._zoom)
            return;

        if (zoom < MIN_ZOOM)
            zoom = MIN_ZOOM;

        this._zoom = zoom;
    }

    get fov(): number { // angle_in_degrees
        return (Math.atan(1.0 / this._focal_length) / 2) * RADIANS_TO_DEGREES_FACTOR;
    }

    set fov(angle_in_degrees: number) {
        if (angle_in_degrees > MAX_FOV)
            angle_in_degrees = MAX_FOV;
        if (angle_in_degrees < MIN_FOV)
            angle_in_degrees = MIN_FOV;

        this._focal_length = 1.0 / Math.tan(angle_in_degrees*DEGREES_TO_RADIANS_FACTOR / 2);
    }

    get focal_length(): number {
        return this._focal_length
    }

    set focal_length(focal_length: number) {
        if (focal_length === this._focal_length)
            return;

        if (focal_length < MIN_FOCAL_LENGTH)
            focal_length = MIN_FOCAL_LENGTH;

        this._focal_length = focal_length;
    }
}