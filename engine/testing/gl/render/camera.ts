import Camera, {
    OrthographicProjectionMatrix,
    PerspectiveProjectionMatrix
} from "../../../lib/render/camera.js";
import {IProjectionMatrix,} from "../../../lib/_interfaces/render.js";


// Override DX-style projection matrix formulation with GL-style one:
function updateZ() {
    // GL clip-space has a depth-span of 2 (-1 to 1)
    this.z_axis.z = this.translation.z = 1 / (this.view_frustum.far - this.view_frustum.near);
    this.z_axis.z *= -(this.view_frustum.far + this.view_frustum.near);
    this.translation.z *= 2 * this.view_frustum.far * this.view_frustum.near;
}

export class GLPerspectiveProjectionMatrix extends PerspectiveProjectionMatrix {
    _updateZ(): void {updateZ.apply(this)}
}

export class GLOrthographicProjectionMatrix extends OrthographicProjectionMatrix {
    _updateZ(): void {updateZ.apply(this)}
}

export class GLCamera extends Camera {
    protected _getPerspectiveProjectionMatrix(): IProjectionMatrix {
        return new GLPerspectiveProjectionMatrix(this.lense, this.view_frustum);
    }
    protected _getOrthographicProjectionMatrix(): IProjectionMatrix {
        return new GLOrthographicProjectionMatrix(this.lense, this.view_frustum);
    }

}
