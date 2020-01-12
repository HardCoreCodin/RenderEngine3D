import Camera from "../../../lib/render/camera.js";

export class GLCamera extends Camera {
    // Override DX-style projection matrix formulation with GL-style one:
    updateProjectionMatrix(): void {
        // Update the matrix that converts from view space to clip space:
        this.projection_matrix.setToIdentity();

        if (this._is_perspective) {
            this.projection_matrix.x_axis.x = this.zoom * this.focal_length;
            this.projection_matrix.y_axis.y = this.zoom * this.focal_length * this.aspect_ratio;
            this.projection_matrix.m34 = -1; // GL perspective projection matrix mirrors around Z
        } else {
            this.projection_matrix.x_axis.x = this.zoom;
            this.projection_matrix.y_axis.y = this.zoom * this.aspect_ratio;
        }

        // GL clip-space has a depth-span of 2 (-1 to 1)
        this.projection_matrix.z_axis.z = this.depth_factor * (this.far + this.near) * -1;
        this.projection_matrix.translation.z = this.depth_factor * this.far * this.near * -2;
    }
}