import GLCamera from "./nodes/camera.js";
import GLScreen from "./screen.js";
import GLScene from "./nodes/scene.js";
import GLRenderPipeline from "./pipeline.js";
import GLMaterial from "./materials/_base.js";
import GLViewport from "./viewport.js";
import BaseRenderEngine from "../../_base/engine.js";
import {CameraConstructor, MaterialConstructor} from "../../../_interfaces/render.js";
import Scene from "../../../nodes/scene.js";
import {IController} from "../../../_interfaces/input.js";

export default class GLRenderEngine
    extends BaseRenderEngine<WebGL2RenderingContext, GLScreen>//, GLScene, GLScreen>
{
    constructor(
        parent_element?: HTMLElement,
        scene?: Scene<WebGL2RenderingContext>,
        camera?: GLCamera,
        controller?: IController,
        screen?: GLScreen
    ) {
        super(
            GLCamera,
            GLMaterial,
            parent_element,
            scene,
            camera,
            controller,
            screen
        );
    }

    protected _createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
        const gl = canvas.getContext('webgl2');

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        return gl;
    }

    protected _createDefaultScreen(camera: GLCamera): GLScreen {
        return new GLScreen(
            camera,
            this.context,
            this.canvas,
            new GLRenderPipeline(this.context, this._scene.mesh_geometries, this._scene.materials as Set<GLMaterial>),
            GLViewport
        );
    }

    // protected _createDefaultScene(): GLScene {
    //     return new GLScene(this.context);
    // }

    protected _getDefaultCamera(): GLCamera {
        return this._scene.cameras.size ?
            this._scene.cameras[0] :
            this._scene.addCamera(GLCamera);
    }
}