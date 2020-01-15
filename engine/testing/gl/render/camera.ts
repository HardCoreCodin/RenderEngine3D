import Camera, {
    OrthographicProjectionMatrix,
    PerspectiveProjectionMatrix
} from "../../../lib/render/camera.js";
import {IProjectionMatrix,} from "../../../lib/_interfaces/render.js";


export class GLPerspectiveProjectionMatrix extends PerspectiveProjectionMatrix {
    // Override DX-style projection matrix formulation with GL-style one:
    updateZ(): void {
        // GL clip-space has a depth-span of 2 (-1 to 1)
        n = this.view_frustum.near;
        f = this.view_frustum.far;
        d = this.view_frustum.one_over_depth_span;

        this.scale.z       =     (f + n) * d;
        this.translation.z = -2 * f * n  * d;
    }
}

export class GLOrthographicProjectionMatrix extends OrthographicProjectionMatrix {
    // Override DX-style projection matrix formulation with GL-style one:
    updateZ(): void {
        n = this.view_frustum.near;
        f = this.view_frustum.far;
        d = this.view_frustum.one_over_depth_span;

        this.scale.z =  -2 * d;
        this.translation.z = d * (f + n) ;
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

let n, f, d;