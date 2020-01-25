import {Lense} from "../../../nodes/camera.js";
import BaseViewport from "../../_base/viewport.js";
import Matrix4x4, {mat4} from "../../../accessors/matrix4x4.js";
import {IRasterViewport, ISize} from "../../../_interfaces/render.js";
import {I2D} from "../../../_interfaces/vectors.js";
import {DEFAULT_FAR_CLIPPING_PLANE_DISTANCE, DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE} from "../../../../constants.js";
import {Float16} from "../../../../types.js";


export default class RasterViewport<Context extends RenderingContext>
    extends BaseViewport<Context>
    implements IRasterViewport<Context>
{
    protected _perspective_projection_matrix: ProjectionMatrix<Context>;
    protected _orthographic_projection_matrix: ProjectionMatrix<Context>;

    world_to_view: Matrix4x4;
    world_to_clip: Matrix4x4;
    view_frustum: ViewFrustum<Context>;

    protected _init(size?: ISize, position?: I2D): void {
        super._init(size, position);
        this.world_to_view = mat4();
        this.world_to_clip = mat4();
        this.view_frustum = new ViewFrustum(this);
        this._perspective_projection_matrix = this._getPerspectiveProjectionMatrix();
        this._orthographic_projection_matrix = this._getOrthographicProjectionMatrix();
    };

    get projection_matrix(): ProjectionMatrix<Context> {
        return this._controller.camera.is_perspective ?
            this._perspective_projection_matrix :
            this._orthographic_projection_matrix;
    }

    setFrom(other: this): void {
        super.setFrom(other);
        this._perspective_projection_matrix.setFrom(other._perspective_projection_matrix);
        this._orthographic_projection_matrix.setFrom(other._orthographic_projection_matrix);
        this.view_frustum.setFrom(other.view_frustum);
        this.world_to_clip.setFrom(other.world_to_clip);
        this.world_to_view.setFrom(other.world_to_view);
    }

    reset(
        width: number,
        height: number,
        x: number = this._position.x,
        y: number = this._position.y
    ): void {
        super.reset(width, height, x, y);
        this.view_frustum.aspect_ratio = width / height;
    }

    update(): void {
        this.projection_matrix.update();
        this._controller.camera.transform.matrix.invert(this.world_to_view
        ).mul(this.projection_matrix, this.world_to_clip);
    }

    protected _getPerspectiveProjectionMatrix(): ProjectionMatrix<Context> {
        return new PerspectiveProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }

    protected _getOrthographicProjectionMatrix(): ProjectionMatrix<Context> {
        return new OrthographicProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }
}

export class ViewFrustum<Context extends RenderingContext>
{
    protected _aspect_ratio: number = 1;
    protected _near_clipping_plane_distance: number = DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE;
    protected _far_clipping_plane_distance: number = DEFAULT_FAR_CLIPPING_PLANE_DISTANCE;
    protected _one_over_depth_span: number;

    constructor(
        protected _viewport: IRasterViewport<Context>
    ) {
        this._one_over_depth_span = 1.0 / (
            this._far_clipping_plane_distance - this._near_clipping_plane_distance
        );
    }

    setFrom(other: this): void {
        this.aspect_ratio = other.aspect_ratio;
        this.near = other.near;
        this.far = other.far;
    }

    get one_over_depth_span(): number {
        return this._one_over_depth_span
    }

    get far(): number {
        return this._far_clipping_plane_distance
    }

    set far(far: number) {
        if (far === this._far_clipping_plane_distance)
            return;

        this._far_clipping_plane_distance = far;
        this._one_over_depth_span = 1.0 / (far - this._near_clipping_plane_distance);
        this._viewport.projection_matrix.updateZ();
    }

    get near(): number {
        return this._near_clipping_plane_distance
    }

    set near(near: number) {
        if (near === this._near_clipping_plane_distance)
            return;

        this._near_clipping_plane_distance = near;
        this._one_over_depth_span = 1.0 / (this._far_clipping_plane_distance - near);
        this._viewport.projection_matrix.updateZ();
    }

    get aspect_ratio(): number {
        return this._aspect_ratio
    }

    set aspect_ratio(aspect_ratio: number) {
        if (aspect_ratio === this._aspect_ratio)
            return;

        this._aspect_ratio = aspect_ratio;
        this._viewport.projection_matrix.updateXY();
    }
}

export abstract class ProjectionMatrix<Context extends RenderingContext>
    extends Matrix4x4
{
    abstract updateW(): void;
    abstract updateXY(): void;

    constructor(
        readonly lense: Lense,
        readonly view_frustum: ViewFrustum<Context>,
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

        this.scale.z = f * d;
        this.translation.z *= -n * d;
    }
}

export class PerspectiveProjectionMatrix<Context extends RenderingContext>
    extends ProjectionMatrix<Context>
{
    updateW(): void {
        this.m34 = 1;
        this.m44 = 0;
    }

    updateXY(): void {
        this.scale.x = this.lense.focal_length;
        this.scale.y = this.lense.focal_length * this.view_frustum.aspect_ratio;
    }
}

export class OrthographicProjectionMatrix<Context extends RenderingContext>
    extends ProjectionMatrix<Context>
{
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