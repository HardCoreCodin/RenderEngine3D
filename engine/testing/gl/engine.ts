import GLProgram from "./program.js";
import {GLIndexBuffer, GLVertexArray, GLVertexBuffer} from "./buffers.js";

import Mesh from "../../lib/geometry/mesh.js";
import Camera from "../../lib/render/camera.js";
import {Matrix4x4} from "../../lib/accessors/matrix.js";
import {FPSController} from "../../lib/input/controllers.js";

import {BaseScene} from "../../lib/scene_graph/scene.js";
import {BaseScreen} from "../../lib/render/screen.js";
import {BaseMaterial} from "../../lib/render/materials.js";
import {BaseViewport} from "../../lib/render/viewport.js";
import {BaseRenderPipeline} from "../../lib/render/pipelines.js";
import {BaseRenderEngine} from "../../lib/render/engine.js";

import {IVector2D} from "../../lib/_interfaces/vectors.js";
import {IRectangle, IViewport} from "../../lib/_interfaces/render.js";
import {IGLAttributeInputs} from "./types.js";

let gl: WebGL2RenderingContext;


class GLMeshBuffers {
    protected _positions: Float32Array;
    protected _normals: Float32Array;
    protected _colors: Float32Array;
    protected _uvs: Float32Array;

    constructor(
        readonly context: WebGL2RenderingContext,
        readonly mesh: Mesh,
        readonly index_buffer = new GLIndexBuffer(context, mesh.face_vertices.toArray()),
        readonly vertex_array = new GLVertexArray(context, mesh.vertex_count)
    ) {
        this.load();
    }

    load(): void {
        let length = this.mesh.vertices.positions.length * this.mesh.vertices.positions.arrays.length;
        if (!this._positions || this._positions.length !== length)
            this._positions = new Float32Array(length);

        const attributes: IGLAttributeInputs = {
            position: new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.positions.toArray(this._positions)
            )
        };

        if (this.mesh.vertices.normals) {
            let length = this.mesh.vertices.normals.length * this.mesh.vertices.normals.arrays.length;
            if (!this._normals || this._normals.length !== length)
                this._normals = new Float32Array(length);

            attributes.normal = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.normals.toArray(this._normals)
            )
        }

        if (this.mesh.vertices.colors) {
            let length = this.mesh.vertices.colors.length * this.mesh.vertices.colors.arrays.length;
            if (!this._colors || this._colors.length !== length)
                this._colors = new Float32Array(length);

            attributes.color = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.colors.toArray(this._colors)
            )
        }

        if (this.mesh.vertices.uvs) {
            let length = this.mesh.vertices.uvs.length * this.mesh.vertices.uvs.arrays.length;
            if (!this._uvs || this._uvs.length !== length)
                this._uvs = new Float32Array(length);

            attributes.uv = new GLVertexBuffer(
                this.context,
                this.mesh.vertex_count,
                this.mesh.vertices.uvs.toArray(this._uvs)
            )
        }
    }

    delete(): void {
        this.index_buffer.delete();
        this.vertex_array.delete();
    }
}

export abstract class GLMaterial extends BaseMaterial<WebGL2RenderingContext> {
    protected abstract _getVertexShaderCode(): string;
    protected abstract _getFragmentShaderShaderCode(): string;

    readonly program: GLProgram;

    protected _model_to_clip = new Float32Array(16);
    protected _mesh_buffers: GLMeshBuffers;

    constructor(scene: GLScene) {
        super(scene);
        this.program = new GLProgram(
            scene.context,
            this._getVertexShaderCode(),
            this._getFragmentShaderShaderCode()
        );
    }

    prepareMeshForDrawing(mesh: Mesh, render_pipeline: GLRenderPipeline): void {
        this._mesh_buffers = render_pipeline.mesh_buffers.get(mesh);
        this._mesh_buffers.vertex_array.bindToLocations(this.program.locations);
    }

    uploadUniforms(): void {
        this.program.uniforms.model_to_clip.load(this._model_to_clip);
    }

    drawMesh(mesh: Mesh, model_to_clip: Matrix4x4) {
        model_to_clip.toArray(this._model_to_clip);

        this.uploadUniforms();

        this._mesh_buffers.index_buffer.draw();
    }
}

class GLScene extends BaseScene<WebGL2RenderingContext, GLCamera, GLMaterial> {}

export class GLRenderPipeline extends BaseRenderPipeline<WebGL2RenderingContext> {
    readonly mesh_buffers = new Map<Mesh, GLMeshBuffers>();

    render(viewport: GLViewport): void {
        for (const material of viewport.scene.materials) {
            material.program.use();

            for (const mesh of material.mesh_geometries.meshes) {
                material.prepareMeshForDrawing(mesh, this);

                for (const geometry of material.mesh_geometries.getGeometries(mesh)) {
                    geometry.model_to_world.mul(viewport.world_to_clip, this.model_to_clip);
                    material.drawMesh(mesh, this.model_to_clip);
                }
            }
        }
    }

    on_mesh_loaded(mesh: Mesh) {
        this.mesh_buffers.get(mesh).load();
    }

    on_mesh_added(mesh: Mesh) {
        this.mesh_buffers.set(mesh, new GLMeshBuffers(this.context, mesh));
    }

    on_mesh_removed(mesh: Mesh) {
        this.mesh_buffers.get(mesh).delete();
        this.mesh_buffers.delete(mesh);
    }
}

let DEFAILT_RENDER_PIPELINE: GLRenderPipeline;

export class GLViewport extends BaseViewport<WebGL2RenderingContext, GLScene, GLCamera, GLRenderPipeline, GLScreen> {
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

class GLScreen extends BaseScreen<WebGL2RenderingContext, GLScene, GLCamera, GLRenderPipeline, GLViewport> {
    protected _createViewport(camera: GLCamera, size: IRectangle, position?: IVector2D): GLViewport {
        return new GLViewport(camera, this, size, position);
    }

    clear() {
        gl = this.context;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

export class GLCamera extends Camera {
    // Override DX-style projection matrix formulation with GL-style one:
    updateProjectionMatrix(): void {
        // Update the matrix that converts from view space to clip space:
        this.projection_matrix.setToIdentity();

        if (this._is_perspective) {
            this.projection_matrix.x_axis.x = this.zoom * this.focal_length;
            this.projection_matrix.y_axis.y = this.zoom * this.focal_length * this.aspect_ratio;
            this.projection_matrix.m34 = -1; // GL perspective projection matrix mirrors around Z
        } else {
            this.projection_matrix.x_axis.x = this.zoom;
            this.projection_matrix.y_axis.y = this.zoom * this.aspect_ratio;
        }

        // GL clip-space has a depth-span of 2 (-1 to 1)
        this.projection_matrix.z_axis.z =      this.depth_factor * (this.far + this.near) * -1;
        this.projection_matrix.translation.z = this.depth_factor *  this.far * this.near  * -2;
    }
}


export class GLRenderEngine
    extends BaseRenderEngine<WebGL2RenderingContext, GLScene, GLCamera, GLRenderPipeline, GLViewport, GLScreen>
{
    protected _createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
        gl = canvas.getContext('webgl2');

        gl.enable(gl.DEPTH_TEST | gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        return gl;
    }

    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: GLCamera): GLScreen {
        return new GLScreen(camera, this.scene, this.context, this._controller, canvas);
    }

    protected _createDefaultController(canvas: HTMLCanvasElement, viewport: IViewport): FPSController {
        return new FPSController(viewport, canvas);
    }

    protected _createDefaultScene(): GLScene {
        return new GLScene(this.context);
    }

    protected _getDefaultCamera(): GLCamera {
        return this.scene.cameras.size ? this.scene.cameras[0] : this.scene.addCamera(GLCamera);
    }
}