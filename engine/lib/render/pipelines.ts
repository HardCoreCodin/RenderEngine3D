import Scene from "../scene_graph/scene.js";
import Viewport from "./viewport.js";
import {clipFaces, clipSharedAttribute, clipUnsharedAttribute} from "../math/rendering/clipping.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";
import {cullFaces, cullVertices} from "../math/rendering/culling.js";
import {CLIP, CULL} from "../../constants.js";
import Geometry from "./geometry.js";
import {MeshShader} from "./materials.js";
import {VertexPositions4D} from "../geometry/positions.js";
import {cube_face_vertices} from "../geometry/cube.js";
import Mesh from "../geometry/mesh.js";
import {Float4, T2, T3} from "../../types.js";

export default class RenderPipeline {
    cull_back_faces: boolean = false;

    protected current_max_face_count: number = 0;
    protected current_max_vertex_count: number = 0;

    protected interpolations: Float32Array;
    protected src_trg_indices: Uint32Array;
    protected src_trg_numbers: Uint8Array;
    protected vertex_flags: Uint8Array;
    protected face_flags: Uint8Array;

    protected readonly clip_space_vertex_positions = new VertexPositions4D(cube_face_vertices);

    constructor(
        public scene: Scene,
        protected geometries = scene.geometries,

        protected readonly model_to_clip: Matrix4x4 = new Matrix4x4()
    ){}

    protected _updateClippingBuffers(): void {
        let max_face_count = 0;
        let max_vertex_count = 0;
        for (const geometry of this.geometries) {
            if (geometry.is_renderable) {
                if (geometry.mesh.face_count > max_face_count)
                    max_face_count = geometry.mesh.face_count;

                if (geometry.mesh.vertex_count> max_vertex_count)
                    max_vertex_count = geometry.mesh.vertex_count;
            }
        }

        if (max_face_count > this.current_max_face_count) {
            this.current_max_face_count = max_face_count;

            this.face_flags = new Uint8Array(max_face_count);
            this.clip_space_vertex_positions.arrays = VECTOR_4D_ALLOCATOR.allocate(max_face_count);

            this.src_trg_numbers = new Uint8Array(max_face_count);

            max_face_count += max_face_count;
            this.interpolations = new Float32Array(max_face_count);

            max_face_count += max_face_count;
            this.src_trg_indices = new Uint32Array(max_face_count);
        }

        if (max_vertex_count > this.current_max_vertex_count) {
            this.current_max_vertex_count = max_vertex_count;
            this.face_flags = new Uint8Array(max_vertex_count);
        }
    }

    render(viewport: Viewport): void {
        if (!this.geometries.length)
            return;

        this._updateClippingBuffers();

        let geometry: Geometry;
        let geometries: Geometry[];

        let mesh: Mesh;
        let mesh_shader: MeshShader;

        const n = viewport.camera.frustum.near;
        const world_to_clip = viewport.world_to_clip;
        const model_to_clip = this.model_to_clip;
        const clip_positions = this.clip_space_vertex_positions;
        const cp = clip_positions.arrays;

        const vf = this.vertex_flags;
        const ff = this.face_flags;
        const cbf = this.cull_back_faces;
        const cc = true; // Always do clipping checks

        const stn = this.src_trg_numbers;
        const sti = this.src_trg_indices;
        const ipl = this.interpolations;

        let fv: T3<Uint8Array|Uint16Array|Uint32Array>;
        let v1, v2, v3: Uint8Array|Uint16Array|Uint32Array;
        let vc, fc, ppx, ppy, ppz, result: number;

        if (cbf) {
            const pp = viewport.camera.projected_position;
            ppx = pp.x;
            ppy = pp.y;
            ppz = pp.z;
        }

        for (const material of this.scene.materials) {
            mesh_shader = material.mesh_shader;

            for ([mesh, geometries] of material.mesh_geometries.entries()) {
                fv = mesh.face_vertices.arrays;
                vc = mesh.vertex_count;
                fc = mesh.face_count;

                mesh_shader.bindMesh(mesh);

                for (geometry of geometries) if (geometry.is_renderable) {
                    // Prepare a matrix for converting from model space to clip space:
                    geometry.model_to_world.times(world_to_clip, model_to_clip);

                    // Bind the inputs and outputs for the mesh shader, and execute it.
                    // Skip this geometry if it returns a CULL flag (0):
                    if (mesh_shader.bindInputs(model_to_clip).bindOutputs(clip_positions).shade()) {
                        // The mesh shader did not cull this geometry.
                        // Cull the vertices against the view frustum:
                        if (cullVertices(cp, vf, vc)) {
                            // The mesh could not be determined to be outside the view frustum based on vertex culling alone.
                            // Check it's faces as well and check for clipping cases:
                            result = cullFaces(cp, fv, fc, ff, vf, cc, cbf, ppx, ppy, ppz);
                            if (result) {
                                if (result === CLIP) {

                                }
                            }
                        }

                        for (vertex_attribute of this.material.vertex_attributes) {
                            if (vertex_attribute.is_shared)
                                clipSharedAttribute(
                                    vertex_attribute.arrays,

                                    this.src_trg_indices,
                                    this.src_trg_numbers,
                                    this.interpolations,
                                    this.face_flags,

                                    clipped_vertex_attribute.arrays
                                );
                            else
                                clipUnsharedAttribute(
                                    vertex_attribute.arrays,

                                    this.src_trg_numbers,
                                    this.interpolations,
                                    this.face_flags,

                                    clipped_vertex_attribute.arrays
                                );
                        }

                        // Note:
                        // Additional vertex attributes might need to be 'clipped' as well if the mesh has any:
                        // if (this.result_flags === CLIP) {
                        //     this.clipper.clipAttr(this.in_vertex_attribute_1, out_vertex_attribute_1);
                        //     this.clipper.clipAttr(this.in_vertex_attribute_2, out_vertex_attribute_2);
                        //     ...
                        //     this.clipper.clipAttr(this.in_vertex_attribute_n, out_vertex_attribute_n);
                        // }
                    }

                }
            }
        }
    }
}
