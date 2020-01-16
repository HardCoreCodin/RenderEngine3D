import Node3D from "../scene_graph/node.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {IScene} from "../_interfaces/nodes.js";
import {Float16} from "../../types.js";
import {ICamera, ILense, IProjectionMatrix, IViewFrustum} from "../_interfaces/render.js";
import {
    MAX_FOV,
    MIN_FOV,
    MIN_ZOOM,
    MIN_FOCAL_LENGTH,
    DEFAULT_FOV,
    DEFAULT_ZOOM,
    DEFAULT_FOCAL_LENGTH, DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE, DEFAULT_FAR_CLIPPING_PLANE_DISTANCE
} from "../../constants.js";


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

        this.is_perspective = is_perspective;
    }

    setFrom(other: this): void {
        this.lense.setFrom(other.lense);
        this.view_frustum.setFrom(other.view_frustum);
        this.transform.setFrom(other.transform);
        this._perspective_projection_matrix.setFrom(other._perspective_projection_matrix);
        this._orthographic_projection_matrix.setFrom(other._orthographic_projection_matrix);
        this.is_perspective = other.is_perspective;
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
        this._is_perspective = is_perspective;
        this._projection_matrix = is_perspective ?
            this._perspective_projection_matrix :
            this._orthographic_projection_matrix;
        this._projection_matrix.update();
    }
}

export class Lense implements ILense {
    protected _zoom: number = DEFAULT_ZOOM;
    protected _focal_length: number = DEFAULT_FOCAL_LENGTH;
    protected _field_of_view: number = DEFAULT_FOV;

    constructor(protected _camera: ICamera) {}

    setFrom(other: this): void {
        this._zoom = other._zoom;
        this._focal_length = other._focal_length;
        this._field_of_view = other._field_of_view;
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
        this._camera.projection_matrix.updateXY();
    }

    get fov(): number {
        return this._field_of_view
    }
    set fov(radians: number) {
        if (radians === this._field_of_view)
            return;

        if (radians > MAX_FOV)
            radians = MAX_FOV;
        if (radians < MIN_FOV)
            radians = MIN_FOV;

        this._field_of_view = radians;
        this._focal_length = 1.0 / Math.tan(this._field_of_view / 2);
        this._camera.projection_matrix.updateXY();
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
        this._field_of_view = Math.atan(1.0 / focal_length) / 2;
        this._camera.projection_matrix.updateXY();
    }
}

export class ViewFrustum implements IViewFrustum {
    protected _aspect_ratio: number = 1;
    protected _near_clipping_plane_distance: number = DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE;
    protected _far_clipping_plane_distance: number = DEFAULT_FAR_CLIPPING_PLANE_DISTANCE;
    protected _one_over_depth_span: number;

    constructor(
        protected _camera: ICamera
    ) {
        this._one_over_depth_span = 1.0 / (
            this._far_clipping_plane_distance - this._near_clipping_plane_distance
        );
    }

    setFrom(other: this): void {
        this._aspect_ratio = other._aspect_ratio;
        this._near_clipping_plane_distance = other._near_clipping_plane_distance;
        this._far_clipping_plane_distance = other._far_clipping_plane_distance;
        this._one_over_depth_span = other._one_over_depth_span;
    }

    get one_over_depth_span(): number {return this._one_over_depth_span}
    get far(): number {return this._far_clipping_plane_distance}
    set far(far: number) {
        if (far === this._far_clipping_plane_distance)
            return;

        this._far_clipping_plane_distance = far;
        this._one_over_depth_span = 1.0 / (far - this._near_clipping_plane_distance);
        this._camera.projection_matrix.updateZ();
    }

    get near(): number {return this._near_clipping_plane_distance}
    set near(near: number) {
        if (near === this._near_clipping_plane_distance)
            return;

        this._near_clipping_plane_distance = near;
        this._one_over_depth_span = 1.0 / (this._far_clipping_plane_distance - near);
        this._camera.projection_matrix.updateZ();
    }

    get aspect_ratio(): number {return this._aspect_ratio}
    set aspect_ratio(aspect_ratio: number) {
        if (aspect_ratio === this._aspect_ratio)
            return;

        this._aspect_ratio = aspect_ratio;
        this._camera.projection_matrix.updateXY();
    }
}

export abstract class ProjectionMatrix extends Matrix4x4 implements IProjectionMatrix {
    abstract updateW(): void;
    abstract updateXY(): void;

    constructor(
        readonly lense: ILense,
        readonly view_frustum: IViewFrustum,
        id?: number,
        arrays?: Float16
    ) {
        super(id, arrays);
        this.setToIdentity();
        this.updateW();
    }

    // Update the matrix that converts from view space to clip space:
    update(): void {
        this.updateXY();
        this.updateZ();
    }

    updateZ(): void {
        n = this.view_frustum.near;
        f = this.view_frustum.far;
        d = this.view_frustum.one_over_depth_span;

        this.scale.z        =  f * d;
        this.translation.z *= -n * d;
    }
}

export class PerspectiveProjectionMatrix extends ProjectionMatrix {
    updateW(): void {
        this.m34 = 1;
        this.m44 = 0;
    }

    updateXY(): void {
        this.scale.x = this.lense.focal_length;
        this.scale.y = this.lense.focal_length * this.view_frustum.aspect_ratio;
    }
}


export class OrthographicProjectionMatrix extends ProjectionMatrix {
    updateW(): void {
        this.m34 = 0;
        this.m44 = 1;
    }

    updateXY(): void {
        this.scale.x = this.lense.zoom;
        this.scale.y = this.lense.zoom * this.view_frustum.aspect_ratio;
    }
}

let n, f, d;