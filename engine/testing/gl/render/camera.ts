import Camera from "../../../lib/render/camera.js";

export class GLCamera extends Camera {
    // Override DX-style projection matrix formulation with GL-style one:
    updateProjectionMatrix(): void {
        // Update the matrix that converts from view space to clip space:
        super.updateProjectionMatrix();

        // GL clip-space has a depth-span of 2 (-1 to 1)
        this.projection_matrix.z_axis.z      = -this.depth_factor * (this.far + this.near);
        this.projection_matrix.translation.z = this.depth_factor *  this.far * this.near * 2;
    }
}