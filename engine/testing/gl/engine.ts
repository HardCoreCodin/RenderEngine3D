import GLProgram from "./program.js";
import {GLIndexBuffer, GLVertexArray} from "./buffers.js";

import Mesh from "../../lib/geometry/mesh.js";
import Scene from "../../lib/scene_graph/scene.js";
import Camera from "../../lib/render/camera.js";
import {Matrix4x4} from "../../lib/accessors/matrix.js";
import {BaseScreen} from "../../lib/render/screen.js";
import {BaseMaterial} from "../../lib/render/materials.js";
import {BaseViewport} from "../../lib/render/viewport.js";
import {BaseRenderPipeline} from "../../lib/render/pipelines.js";
import {RenderEngineFPS} from "../../lib/render/engine.js";
import {IVector2D} from "../../lib/_interfaces/vectors.js";
import {IRectangle} from "../../lib/_interfaces/render.js";

let gl: WebGL2RenderingContext;

class GLMeshBuffers {
    constructor(
        context: WebGL2RenderingContext,
        mesh: Mesh,
        readonly index_buffer = new GLIndexBuffer(context, mesh.face_vertices.toArray()),
        readonly vertex_array = new GLVertexArray(context, mesh.vertex_count)
    ) {}

    delete(): void {
        this.index_buffer.delete();
        this.vertex_array.delete();
    }
}


export class GLMaterial extends BaseMaterial {
    constructor(
        context: WebGL2RenderingContext,
        scene: Scene,
        vertex_shader: string,
        fragment_shader: string,
        readonly program = new GLProgram(context, vertex_shader, fragment_shader)
    ) {
        super(scene);
    }

    prepareMeshForDrawing(mesh: Mesh): void {

    }

    drawMesh(mesh: Mesh, matrix: Matrix4x4) {

    }
}

export class GLRenderPipeline extends BaseRenderPipeline<WebGL2RenderingContext, GLViewport> {
    protected readonly _mesh_buffers = new Map<Mesh, GLMeshBuffers>();

    render(viewport: GLViewport): void {
        for (const material of viewport.camera.scene.materials) {
            for (const mesh of material.mesh_geometries.meshes) {
                material.prepareMeshForDrawing(mesh);

                for (const geometry of material.mesh_geometries.getGeometries(mesh))
                    material.drawMesh(mesh, geometry.model_to_world);
            }
        }
    }

    on_mesh_added(mesh: Mesh) {
        this._mesh_buffers.set(mesh, new GLMeshBuffers(this.context, mesh));
    }

    on_mesh_removed(mesh: Mesh) {
        const buffers = this._mesh_buffers.get(mesh);
        buffers.delete();
    }
}

let DEFAILT_RENDER_PIPELINE: GLRenderPipeline;

export class GLViewport extends BaseViewport<WebGL2RenderingContext> {
    protected _getDefaultRenderPipeline(context: WebGL2RenderingContext): GLRenderPipeline {
        if (!DEFAILT_RENDER_PIPELINE)
            DEFAILT_RENDER_PIPELINE = new GLRenderPipeline(context);

        return DEFAILT_RENDER_PIPELINE;
    }

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
        gl = this._canvas.getContext('webgl2');

        gl.enable(gl.DEPTH_TEST | gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        return gl;
    }

    protected _createViewport(camera: Camera, size: IRectangle, position?: IVector2D): GLViewport {
        return new GLViewport(this, camera, size, position);
    }

    clear() {
        gl = this.context;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

export default class GLRenderEngine extends RenderEngineFPS<GLScreen> {
    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): GLScreen {
        return new GLScreen(camera, this._controller, canvas);
    }
}