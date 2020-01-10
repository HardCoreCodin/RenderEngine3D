import Camera from "../../lib/render/camera.js";
import {BaseScreen} from "../../lib/render/screen.js";
import {BaseViewport} from "../../lib/render/viewport.js";
import {BaseRenderPipeline} from "../../lib/render/pipelines.js";
import {RenderEngineFPS} from "../../lib/render/engine.js";
import {IRectangle} from "../../lib/_interfaces/render.js";
import {IVector2D} from "../../lib/_interfaces/vectors.js";


export class GLRenderPipeline extends BaseRenderPipeline<WebGL2RenderingContext, GLViewport> {
    render(viewport: GLViewport): void {
        for (const material of viewport.camera.scene.materials) {
            for (const mesh of material.meshes) {
                material.prepareMeshForDrawing(mesh);

                for (const geometry of material.getGeometries(mesh))
                    material.drawMesh(mesh, geometry)
            }
        }
    }
}

export class GLViewport extends BaseViewport<WebGL2RenderingContext> {
    render_pipeline = new GLRenderPipeline();

    reset(width: number, height: number, x: number, y: number): void {
        if (width !== this._size.width ||
            height !== this._size.height ||
            x !== this._position.x ||
            y !== this._position.y
        ) {
            super.reset(width, height, x, y);
            this._context.viewport(x, y, width, height);
        }
    }
}

export class GLScreen extends BaseScreen<WebGL2RenderingContext, GLViewport> {
    protected _createContext(): WebGL2RenderingContext {
        const context = this._canvas.getContext('webgl2');
        context.enable(context.DEPTH_TEST | context.BLEND);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
        return context;
    }

    protected _createViewport(camera: Camera, size: IRectangle, position?: IVector2D): GLViewport {
        return new GLViewport(this._context, camera, size, position);
    }

    clear() {
        this._context.clearColor(0, 0, 0, 1);
        this._context.clear(this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT);
    }
}

export default class GLRenderEngine extends RenderEngineFPS<GLScreen> {
    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): GLScreen {
        return new GLScreen(camera, this._controller, canvas);
    }
}