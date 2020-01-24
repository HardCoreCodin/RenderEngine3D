import GLCamera from "./camera.js";
import GLMaterial from "../materials/_base.js";

import BaseScene from "../../../../nodes/scene.js";
import {CameraConstructor, MaterialConstructor} from "../../../../_interfaces/render.js";

export default class GLScene extends BaseScene<WebGL2RenderingContext, GLCamera, GLMaterial> {
    protected _getDefaultCameraClass(): CameraConstructor<GLCamera> {
        return GLCamera
    };

    protected _getDefaultMaterialClass(): MaterialConstructor<WebGL2RenderingContext, GLMaterial> {
        return GLMaterial
    };
}