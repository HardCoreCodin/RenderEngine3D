import Camera, {
    OrthographicProjectionMatrix,
    PerspectiveProjectionMatrix
} from "../../../lib/render/camera.js";
import {IProjectionMatrix,} from "../../../lib/_interfaces/render.js";


export class GLPerspectiveProjectionMatrix extends PerspectiveProjectionMatrix {
    // Override DX-style projection matrix formulation with GL-style one:
    _updateZ(): void {
        // GL clip-space has a depth-span of 2 (-1 to 1)
        this.scale.z       = (    this.view_frustum.far + this.view_frustum.near) * this.view_frustum.one_over_depth_span;
        this.translation.z = -2 * this.view_frustum.far * this.view_frustum.near  * this.view_frustum.one_over_depth_span;
    }
}

export class GLOrthographicProjectionMatrix extends OrthographicProjectionMatrix {
    // Override DX-style projection matrix formulation with GL-style one:
    _updateZ(): void {
        this.scale.z =  -2 * this.view_frustum.one_over_depth_span;
        this.translation.z = this.view_frustum.one_over_depth_span * (this.view_frustum.far + this.view_frustum.near) ;
    }
}

export class GLCamera extends Camera {
    protected _getPerspectiveProjectionMatrix(): IProjectionMatrix {
        return new GLPerspectiveProjectionMatrix(this.lense, this.view_frustum);
    }
    protected _getOrthographicProjectionMatrix(): IProjectionMatrix {
        return new GLOrthographicProjectionMatrix(this.lense, this.view_frustum);
    }

}
