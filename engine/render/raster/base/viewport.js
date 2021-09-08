import BaseViewport from "../../base/viewport.js";
import Matrix4x4, { mat4 } from "../../../accessors/matrix4x4.js";
import { DEFAULT_FAR_CLIPPING_PLANE_DISTANCE, DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE } from "../../../core/constants.js";
export default class RasterViewport extends BaseViewport {
    _init() {
        this.world_to_view = mat4();
        this.world_to_clip = mat4();
        this.view_frustum = new ViewFrustum(this);
        this._perspective_projection_matrix = this._getPerspectiveProjectionMatrix();
        this._orthographic_projection_matrix = this._getOrthographicProjectionMatrix();
        super._init();
    }
    ;
    get projection_matrix() {
        return this._controller.camera.is_perspective ?
            this._perspective_projection_matrix :
            this._orthographic_projection_matrix;
    }
    setFrom(other) {
        super.setFrom(other);
        this._perspective_projection_matrix.setFrom(other._perspective_projection_matrix);
        this._orthographic_projection_matrix.setFrom(other._orthographic_projection_matrix);
        this.view_frustum.setFrom(other.view_frustum);
        this.world_to_clip.setFrom(other.world_to_clip);
        this.world_to_view.setFrom(other.world_to_view);
    }
    reset(width, height, x = this.position.x, y = this.position.y) {
        super.setTo(width, height, x, y);
        this.view_frustum.aspect_ratio = width / height;
        this.update();
    }
    update() {
        this.projection_matrix.update();
        this._controller.camera.transform.matrix.invert(this.world_to_view).mul(this.projection_matrix, this.world_to_clip);
    }
    _getPerspectiveProjectionMatrix() {
        return new PerspectiveProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }
    _getOrthographicProjectionMatrix() {
        return new OrthographicProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }
}
export class ViewFrustum {
    constructor(_viewport) {
        this._viewport = _viewport;
        this._aspect_ratio = 1;
        this._near_clipping_plane_distance = DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE;
        this._far_clipping_plane_distance = DEFAULT_FAR_CLIPPING_PLANE_DISTANCE;
        this._one_over_depth_span = 1.0 / (this._far_clipping_plane_distance - this._near_clipping_plane_distance);
    }
    setFrom(other) {
        this.aspect_ratio = other.aspect_ratio;
        this.near = other.near;
        this.far = other.far;
    }
    get one_over_depth_span() {
        return this._one_over_depth_span;
    }
    get far() {
        return this._far_clipping_plane_distance;
    }
    set far(far) {
        if (far === this._far_clipping_plane_distance)
            return;
        this._far_clipping_plane_distance = far;
        this._one_over_depth_span = 1.0 / (far - this._near_clipping_plane_distance);
        this._viewport.update();
    }
    get near() {
        return this._near_clipping_plane_distance;
    }
    set near(near) {
        if (near === this._near_clipping_plane_distance)
            return;
        this._near_clipping_plane_distance = near;
        this._one_over_depth_span = 1.0 / (this._far_clipping_plane_distance - near);
        this._viewport.update();
    }
    get aspect_ratio() {
        return this._aspect_ratio;
    }
    set aspect_ratio(aspect_ratio) {
        if (aspect_ratio === this._aspect_ratio)
            return;
        this._aspect_ratio = aspect_ratio;
        this._viewport.update();
    }
}
export class ProjectionMatrix extends Matrix4x4 {
    constructor(lense, view_frustum, array) {
        super(array);
        this.lense = lense;
        this.view_frustum = view_frustum;
        this.setToIdentity();
        this.updateW();
    }
    // Update the matrix that converts from view space to clip space:
    update() {
        this.updateXY();
        this.updateZ();
    }
    updateZ() {
        this.z_axis.z = this.view_frustum.far * this.view_frustum.one_over_depth_span;
        this.translation.z = -this.view_frustum.near * this.z_axis.z;
    }
}
export class PerspectiveProjectionMatrix extends ProjectionMatrix {
    updateW() {
        this.m34 = 1;
        this.m44 = 0;
    }
    updateXY() {
        this.x_axis.x = this.lense.focal_length / this.view_frustum.aspect_ratio;
        this.y_axis.y = this.lense.focal_length;
    }
}
export class OrthographicProjectionMatrix extends ProjectionMatrix {
    updateW() {
        this.m34 = 0;
        this.m44 = 1;
    }
    updateXY() {
        this.x_axis.x = this.lense.zoom;
        this.y_axis.y = this.lense.zoom * this.view_frustum.aspect_ratio;
    }
}
//# sourceMappingURL=viewport.js.map