import GLCamera from "./nodes/camera.js";
import GLScreen from "./screen.js";
import GLScene from "./nodes/scene.js";
import GLRenderPipeline from "./pipeline.js";
import BaseRenderEngine from "../../_base/engine.js";
import GLMaterial from "./materials/_base.js";


export default class GLRenderEngine
    extends BaseRenderEngine<WebGL2RenderingContext, GLScene, GLScreen>
{
    protected _createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
        const gl = canvas.getContext('webgl2');

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        return gl;
    }

    protected _createDefaultScreen(camera: GLCamera): GLScreen {
        return new GLScreen(this.context,
            new GLRenderPipeline(
                this.context,
                this._scene.mesh_geometries,
                this._scene.materials as Set<GLMaterial>
            ),
            this.canvas,
            camera
        );
    }

    protected _createDefaultScene(): GLScene {
        return new GLScene(this.context);
    }

    protected _getDefaultCamera(): GLCamera {
        return this._scene.cameras.size ?
            this._scene.cameras[0] :
            this._scene.addCamera(GLCamera);
    }
}