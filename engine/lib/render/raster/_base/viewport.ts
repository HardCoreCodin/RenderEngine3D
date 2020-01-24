import BaseViewport from "../../_base/viewport.js";
import Matrix4x4, {mat4} from "../../../accessors/matrix4x4.js";
import {IRasterCamera, IRasterViewport} from "../../../_interfaces/render.js";


export default class RasterViewport<Context extends RenderingContext,
    CameraType extends IRasterCamera>
    extends BaseViewport<Context, CameraType>
    implements IRasterViewport<Context, CameraType>
{
    world_to_view: Matrix4x4;
    world_to_clip: Matrix4x4;

    protected _init(): void {
        this.world_to_view = mat4();
        this.world_to_clip = mat4();
    };

    setFrom(other: this): void {
        this.world_to_clip.setFrom(other.world_to_clip);
        this.world_to_view.setFrom(other.world_to_view);
        this.reset(
            other._size.width,
            other._size.height,
            other._position.x,
            other._position.y
        )
    }

    reset(
        width: number,
        height: number,
        x: number = this._position.x,
        y: number = this._position.y
    ): void {
        this.camera.view_frustum.aspect_ratio = width / height;
        super.reset(width, height, x, y);
    }

    updateMatrices(): void {
        this.camera.transform.matrix.invert(this.world_to_view
        ).mul(this.camera.projection_matrix, this.world_to_clip);
    }
}