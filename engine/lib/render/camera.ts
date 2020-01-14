import Node3D from "../scene_graph/node.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {IScene} from "../_interfaces/nodes.js";
import {Float16} from "../../types.js";
import {ICamera, ILense, IProjectionMatrix, IViewFrustum} from "../_interfaces/render.js";
import {DEGREES_TO_RADIANS_FACTOR, RADIANS_TO_DEGREES_FACTOR, TWO_PIE} from "../../constants.js";


export default class Camera extends Node3D implements ICamera {
    protected readonly _perspective_projection_matrix: IProjectionMatrix;
    protected readonly _orthographic_projection_matrix: IProjectionMatrix;
    protected _projection_matrix: IProjectionMatrix;
    protected _is_perspective: boolean = true;

    readonly lense: ILense;
    readonly view_frustum: IViewFrustum;

    constructor(readonly scene: IScene, is_perspective: boolean = true) {
        super(scene);
        scene.cameras.add(this);

        this.lense = new Lense(this);
        this.view_frustum = new ViewFrustum(this);

        this._perspective_projection_matrix = this._getPerspectiveProjectionMatrix();
        this._orthographic_projection_matrix = this._getOrthographicProjectionMatrix();

        this._projection_matrix = is_perspective ?
            this._perspective_projection_matrix :
            this._orthographic_projection_matrix;
        this._projection_matrix.update();
    }

    protected _getPerspectiveProjectionMatrix(): IProjectionMatrix {
        return new PerspectiveProjectionMatrix(this.lense, this.view_frustum);
    }

    protected _getOrthographicProjectionMatrix(): IProjectionMatrix {
        return new OrthographicProjectionMatrix(this.lense, this.view_frustum);
    }

    get projection_matrix(): IProjectionMatrix {
        return this._projection_matrix;
    }

    set projection_matrix(projection_matrix: IProjectionMatrix ) {
        this._projection_matrix = projection_matrix;
    }

    get is_perspective(): boolean {return this._is_perspective}
    set is_perspective(is_perspective: boolean) {
        if (is_perspective === this._is_perspective)
            return;

        this._is_perspective = is_perspective;
        this._projection_matrix = is_perspective ?
            this._perspective_projection_matrix :
            this._orthographic_projection_matrix;
        this._projection_matrix.update();
    }
}

export class Lense implements ILense {
    protected _zoom: number = 1;
    protected _focal_length: number = 1;
    protected _field_of_view_in_degrees: number = 90;
    protected _field_of_view_in_radians: number = 90 * DEGREES_TO_RADIANS_FACTOR;

    constructor(protected _camera: ICamera) {}

    get zoom(): number {
        return this._zoom
    }

    set zoom(zoom: number) {
        if (zoom === this._zoom)
            return;

        if (zoom < 0.1)
            zoom = 0.1;

        this._zoom = zoom;
        this._camera.projection_matrix.update();
    }

    get field_of_view_in_radians(): number {
        return this._field_of_view_in_radians
    }
    set field_of_view_in_radians(radians: number) {
        if (radians === this._field_of_view_in_radians)
            return;

        if (radians > TWO_PIE - 0.1)
            radians = TWO_PIE - 0.1;
        if (radians < 0.1)
            radians = 0.1;

        this._field_of_view_in_radians = radians;
        this._field_of_view_in_degrees = radians * RADIANS_TO_DEGREES_FACTOR;
        this._focal_length = 1.0 / Math.tan(this._field_of_view_in_radians / 2);
        this._camera.projection_matrix.update();
    }

    get field_of_view_in_degrees(): number {
        return this._field_of_view_in_degrees
    }

    set field_of_view_in_degrees(degrees: number) {
        if (degrees === this._field_of_view_in_degrees)
            return;

        if (degrees > 179)
            degrees = 179;
        if (degrees < 1)
            degrees = 1;

        this._field_of_view_in_degrees = degrees;
        this._field_of_view_in_radians = degrees * DEGREES_TO_RADIANS_FACTOR;
        this._focal_length = 1.0 / Math.tan(this._field_of_view_in_radians / 2);
        this._camera.projection_matrix.update();
    }

    get focal_length(): number {
        return this._focal_length
    }

    set focal_length(focal_length: number) {
        if (focal_length === this._focal_length)
            return;

        if (focal_length < 0.1)
            focal_length = 0.1;

        this._focal_length = focal_length;
        this._field_of_view_in_radians = Math.atan(1.0 / focal_length) / 2;
        this._field_of_view_in_degrees = this._field_of_view_in_radians * RADIANS_TO_DEGREES_FACTOR;
        this._camera.projection_matrix.update();
    }
}

export class ViewFrustum implements IViewFrustum {
    protected _aspect_ratio: number = 1;
    protected _near_clipping_plane_distance: number = 0.0001;
    protected _far_clipping_plane_distance: number = 10000;

    constructor(protected _camera: ICamera) {}

    get far(): number {return this._far_clipping_plane_distance}
    set far(far: number) {
        if (far === this._far_clipping_plane_distance)
            return;

        this._far_clipping_plane_distance = far;
        this._camera.projection_matrix.update();
    }

    get near(): number {return this._near_clipping_plane_distance}
    set near(near: number) {
        if (near === this._near_clipping_plane_distance)
            return;

        this._near_clipping_plane_distance = near;
        this._camera.projection_matrix.update();
    }

    get aspect_ratio(): number {return this._aspect_ratio}
    set aspect_ratio(aspect_ratio: number) {
        if (aspect_ratio === this._aspect_ratio)
            return;

        this._aspect_ratio = aspect_ratio;
        this._camera.projection_matrix.update();
    }
}

export abstract class ProjectionMatrix extends Matrix4x4 implements IProjectionMatrix {
    constructor(
        readonly lense: ILense,
        readonly view_frustum: IViewFrustum,
        id?: number,
        arrays?: Float16
    ) {
        super(id, arrays);
        this.setToIdentity();
        this._updateW();
    }

    // Update the matrix that converts from view space to clip space:
    abstract update(): void;
    abstract _updateW(): void;
    _updateZ(): void {
        this.translation.z = this.z_axis.z = this.view_frustum.far / (this.view_frustum.far - this.view_frustum.near);
        this.translation.z *= -this.view_frustum.near;
    }
}

export class PerspectiveProjectionMatrix extends ProjectionMatrix {
    update(): void {
        this.y_axis.y = this.x_axis.x = this.lense.zoom * this.lense.focal_length;
        this.y_axis.y *= this.view_frustum.aspect_ratio;
        this._updateZ();
    }

    _updateW(): void {
        this.m34 = 1;
        this.m44 = 0;
    }
}


export class OrthographicProjectionMatrix extends ProjectionMatrix {
    update(): void {
        this.x_axis.x = this.lense.zoom;
        this.y_axis.y = this.lense.zoom * this.view_frustum.aspect_ratio;
        this._updateZ();
    }

    _updateW(): void {
        this.m34 = 0;
        this.m44 = 1;
    }
}
