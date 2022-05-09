import Scene from "../../nodes/scene.js";
import Display from "./display.js";
import InputController, {InputControllerConstructor} from "../../input/controllers.js";
import {
    IRenderEngine,
    IRenderPipelineConstructor,
    IViewportConstructor,
    IMaterialConstructor
} from "../../core/interfaces/render.js";
import UILayer from "../../input/ui.js";
import InteractiveCanvas from "../../core/canvas.js";
import mouse from "../../input/mouse.js";
import Camera from "../../nodes/camera.js";

export default class RenderEngine<Context extends RenderingContext = CanvasRenderingContext2D>
    extends InteractiveCanvas<Context> implements IRenderEngine<Context>
{
    public readonly ui: UILayer;
    protected _display: Display<Context>;

    constructor(
        Viewport: IViewportConstructor<Context>,
        Material: IMaterialConstructor<Context>,
        RenderPipeline: IRenderPipelineConstructor<Context>,
        public scene: Scene<Context> = new Scene(Material),
        main_camera: Camera = scene.addCamera(),
        parent_element: HTMLElement = document.body,
        Controller: InputControllerConstructor = InputController,
    ) {
        super(document.createElement('canvas'));
        parent_element.appendChild(this.canvas);
        this.ui = new UILayer(parent_element);

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.style.cssText ='display: block; width: 100vw; height: 100vh;';
        this._display = new Display(this.context, main_camera, this.scene, RenderPipeline, Viewport, Controller);
    }

    get display(): Display<Context> {return this._display}
    set display(display: Display<Context>) {
        display.context = this.context;
        this._display = display;
    }

    OnUpdate(): void {
        this._display.active_viewport.controller.update(this._display.active_viewport.camera, this.delta_time);

        if (mouse.is_captured)
            this.canvas.requestPointerLock();
        else
            document.exitPointerLock();

        for (const viewport of this._display.viewports) viewport.update();
        for (const node of this.scene.children) node.refreshWorldMatrix();

        this._display.active_viewport.controller.reset(this._display.active_viewport.camera);

        this._display.refresh();

        this.ui.update();

        requestAnimationFrame(this._frame_request_callback);
    }

    OnKeyChanged(key_event: KeyboardEvent, key_is_pressed: boolean) {
        super.OnKeyChanged(key_event, key_is_pressed);
        this._display.active_viewport.controller.onKeyChanged(key_event.which, key_is_pressed);
    }
}