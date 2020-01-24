import {
    ICanvas2DRenderPipeline,
    IMaterial,
    IMeshCallback,
    IMeshGeometries,
    IRenderPipeline,
    ISize,
    IViewport
} from "../../_interfaces/render.js";
import {IMesh} from "../../_interfaces/geometry.js";
import {I2D, IColor} from "../../_interfaces/vectors.js";
import RenderTarget from "./render_target.js";


export abstract class BaseRenderPipeline<
    Context extends RenderingContext,
    ViewportType extends IViewport<Context> = IViewport<Context>,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    implements IRenderPipeline<Context, ViewportType, MaterialType>
{
    abstract render(viewport: ViewportType): void;

    readonly on_mesh_loaded_callback: IMeshCallback;
    readonly on_mesh_added_callback: IMeshCallback;
    readonly on_mesh_removed_callback: IMeshCallback;

    constructor(
        readonly context: Context,
        readonly mesh_geometries: IMeshGeometries,
        readonly materials: Set<MaterialType>
    ) {
        this.on_mesh_loaded_callback = this.on_mesh_loaded.bind(this);
        this.on_mesh_added_callback = this.on_mesh_added.bind(this);
        this.on_mesh_removed_callback = this.on_mesh_removed.bind(this);

        this.mesh_geometries.on_mesh_added.add(this.on_mesh_added_callback);
        this.mesh_geometries.on_mesh_removed.add(this.on_mesh_removed_callback);
    }

    resetRenderTarget(size: ISize, position: I2D): void {}

    on_mesh_loaded(mesh: IMesh) {}
    on_mesh_added(mesh: IMesh) {mesh.on_mesh_loaded.add(this.on_mesh_loaded_callback)}
    on_mesh_removed(mesh: IMesh) {mesh.on_mesh_loaded.delete(this.on_mesh_loaded_callback)}

    delete(): void {
        this.mesh_geometries.on_mesh_added.delete(this.on_mesh_added_callback);
        this.mesh_geometries.on_mesh_removed.delete(this.on_mesh_removed_callback);
    }
}

export default abstract class Canvas2DRenderPipeline<ViewportType extends IViewport<CanvasRenderingContext2D>,
    MaterialType extends IMaterial<CanvasRenderingContext2D> = IMaterial<CanvasRenderingContext2D>>
    extends BaseRenderPipeline<CanvasRenderingContext2D, ViewportType, MaterialType>
    implements ICanvas2DRenderPipeline<ViewportType, MaterialType> {
    protected _image: ImageData;
    protected _render_target: RenderTarget;

    protected abstract _render(viewport: ViewportType): void;

    resetRenderTarget(size: ISize, position: I2D): void {
        this._image = this.context.getImageData(
            position.x,
            position.y,

            size.width,
            size.height
        );
        if (!this._render_target)
            this._render_target = new RenderTarget(size);

        this._render_target.arrays[0] = new Uint32Array(this._image.data.buffer);
    }

    render(viewport: ViewportType): void {
        // this.context.clearRect(viewport.x, viewport.y, viewport.width, viewport.height);
        this._render(viewport);
        this.context.putImageData(this._image, viewport.x, viewport.y);
    }

    drawTriangle(v1: I2D, v2: I2D, v3: I2D, color: IColor) {
        this.context.beginPath();

        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);
        // this.context.lineTo(v1.x, v1.y);
        this.context.closePath();

        this.context.strokeStyle = `${color}`;
        this.context.stroke();
    }

    fillTriangle(v1: I2D, v2: I2D, v3: I2D, color: IColor) {
        this.context.beginPath();

        this.context.moveTo(v1.x, v1.y);
        this.context.lineTo(v2.x, v2.y);
        this.context.lineTo(v3.x, v3.y);

        this.context.closePath();

        this.context.fillStyle = `${color}`;
        this.context.fill();
    }
}