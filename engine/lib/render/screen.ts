import Camera from "./camera.js";
import Viewport from "./viewport.js";
import {IVector2D} from "../_interfaces/vectors.js";
import {IRectangle, IScreen, IViewport} from "../_interfaces/render.js";
import {IController} from "../_interfaces/input.js";


export abstract class BaseScreen<
    Context extends RenderingContext,
    ViewportType extends IViewport<Context>>
    implements IScreen<CanvasRenderingContext2D,  ViewportType>
{
    protected abstract _createContext(): Context;
    protected abstract _createViewport(camera: Camera, size: IRectangle, position?: IVector2D): ViewportType;
    abstract clear(): void;

    protected _active_viewport: ViewportType;
    protected readonly _viewports: ViewportType[] = [];
    protected readonly _context: Context;

    protected _prior_width = 0;
    protected _prior_height = 0;

    constructor(
        camera: Camera,
        public controller: IController,
        protected readonly _canvas: HTMLCanvasElement,
        protected readonly _size: IRectangle = {width: 1, height: 1}
    ) {
        this._context = this._createContext();
        this.addViewport(camera);
    }

    refresh() {
        const width = this._canvas.clientWidth;
        const height = this._canvas.clientHeight;
        if (width !== this._prior_width ||
            height !== this._prior_height) {
            this._prior_width = width;
            this._prior_height = height;
            this.resize(width, height);
        }

        this.clear();

        for (const viewport of this._viewports)
            viewport.refresh();
    }

    resize(width: number, height: number): void {
        const width_scale = width / this._size.width;
        const height_scale = height / this._size.height;

        for (const vp of this._viewports)
            vp.scale(width_scale, height_scale);

        this._size.width = width;
        this._size.height = height;
    }

    get viewports(): Generator<ViewportType> {return this._iterViewports()}
    private *_iterViewports(): Generator<ViewportType> {
        for (const viewport of this._viewports)
            yield viewport;
    }

    addViewport(
        camera: Camera,
        size: IRectangle = this._size,
        position: IVector2D = {
            x: 0,
            y: 0
        }
    ): ViewportType {
        const viewport = this._createViewport(camera, size, position);
        this._viewports.push(viewport);
        return viewport;
    }

    get active_viewport(): ViewportType {
        return this._active_viewport;
    }

    set active_viewport(viewport: ViewportType) {
        this._active_viewport = viewport;
        this.controller.camera = viewport.camera;
    }
}

export default class Screen extends BaseScreen<CanvasRenderingContext2D, Viewport> {
    protected _createContext(): CanvasRenderingContext2D {
        return this._canvas.getContext('2d');
    }

    protected _createViewport(camera: Camera, size: IRectangle, position?: IVector2D): Viewport {
        return new Viewport(this._context, camera, size, position);
    }

    clear() {
        this._context.clearRect(0, 0, this._size.width, this._size.height);
    }
}

