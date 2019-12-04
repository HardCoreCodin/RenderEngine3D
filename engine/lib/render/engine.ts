import Screen from "./screen.js";
import Camera from "./camera.js";
import Scene from "../scene_graph/scene.js";
import {IController} from "../_interfaces/input.js";
import {FPSController} from "../input/controllers.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";

export default class RenderEngine {
    private readonly screen: Screen;

    private frame_time = 1000 / 60;
    private last_timestamp = 0;
    private delta_time = 0;

    private _controller: IController;
    private _active_viewport: Viewport;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        public readonly scene: Scene,
        camera: Camera = scene.cameras.length ? scene.cameras[0] : scene.addCamera(),
        private render_pipeline = new RenderPipeline(scene)
    ) {
        this.screen = new Screen(camera, canvas);
        this._controller = new FPSController(canvas, camera);
    }

    get controller(): IController {
        return this._controller;
    }

    set controller(controller: IController) {
        controller.camera = this._active_viewport.camera;
        this._controller = controller;
    }

    get active_viewport(): Viewport {
        return this._active_viewport;
    }

    set active_viewport(viewport: Viewport) {
        this._active_viewport = viewport;
        this._controller.camera = viewport.camera;
    }

    private update(timestamp): void {
        this.delta_time = (timestamp - this.last_timestamp) / this.frame_time;
        this.last_timestamp = timestamp;
        this._controller.update(this.delta_time);

        this._active_viewport.camera_hase_moved_or_rotated = this._controller.direction_changed || this._controller.position_changed;
        this._controller.direction_changed = this._controller.position_changed = false;

        this.scene.refreshWorldMatrix(); // update world-matrices for all dynamic nodes in the scene
        this.screen.refresh(this.render_pipeline); // Refresh viewports, screen sizes and camera matrices

        requestAnimationFrame(this.update);
    };

    start() {
        requestAnimationFrame(this.update);
    }
}