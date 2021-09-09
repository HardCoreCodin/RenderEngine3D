import Matrix4x4 from "../../../accessors/matrix4x4.js";
import SoftwareRasterMaterial from "./materials/base.js";
import BaseRenderPipeline from "../../base/pipelines.js";
import { VertexPositions3D, VertexPositions4D } from "../../../buffers/attributes/positions.js";
import { CUBE_FACE_VERTICES, CUBE_VERTEX_COUNT } from "../../../geometry/cube.js";
import { FlagsBuffer1D } from "../../../buffers/flags.js";
import { cullFaces, cullVertices } from "./core/cull.js";
import { CLIP, CULL, MAX_RENDER_TARGET_SIZE } from "../../../core/constants.js";
import { projectFaceVertexPositions, projectSomeVertexPositions, shadeFace } from "./core/half_space.js";
import { Positions3D, UVs2D } from "../../../buffers/vectors.js";
import { clipFaces } from "./core/clip.js";
import { Color4D, rgba } from "../../../accessors/color.js";
import { Direction3D } from "../../../accessors/direction.js";
import { UV2D } from "../../../accessors/uv.js";
import { Position3D } from "../../../accessors/position.js";
// import {Position3D} from "../../../accessors/position.js";
// import {ProjectionPlane} from "../../base/viewport.js";
export default class Rasterizer extends BaseRenderPipeline {
    constructor() {
        super(...arguments);
        this.model_to_clip = new Matrix4x4();
        this.clip_to_model = new Matrix4x4();
        this.light_to_model = new Matrix4x4();
        // readonly position = new Position3D();
        // readonly projection_plane = new ProjectionPlane();
        // readonly projection_plane_object_space = new ProjectionPlane();
        this.current_max_face_count = 0;
        this.current_max_vertex_count = 0;
        this.depth_buffer = new Float32Array(MAX_RENDER_TARGET_SIZE);
        this.vertex_flags = new FlagsBuffer1D().init(CUBE_VERTEX_COUNT);
        this.face_flags = new FlagsBuffer1D().init(CUBE_FACE_VERTICES.length);
        this.object_space_vertex_positions = new VertexPositions3D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES);
        this.clip_space_vertex_positions = new VertexPositions4D().autoInit(CUBE_VERTEX_COUNT, CUBE_FACE_VERTICES);
        this.clipped_vertex_positions = new VertexPositions4D();
        this.clipped_vertex_normals = new VertexPositions3D();
        this.clipped_vertex_uvs = new UVs2D();
        this.view_space_triangle_vertex_positions = new Positions3D().init(3);
    }
    _updateClippingBuffers() {
        let max_face_count = 0;
        let max_vertex_count = 0;
        for (const mesh of this.scene.mesh_geometries.meshes) {
            for (const geometry of this.scene.mesh_geometries.getGeometries(mesh)) {
                if (geometry.is_renderable) {
                    if (geometry.mesh.face_count > max_face_count)
                        max_face_count = geometry.mesh.face_count;
                    if (geometry.mesh.vertex_count > max_vertex_count)
                        max_vertex_count = geometry.mesh.vertex_count;
                }
            }
        }
        if (max_face_count > this.current_max_face_count) {
            this.current_max_face_count = max_face_count;
            this.face_flags.init(max_face_count * 2);
        }
        if (max_vertex_count > this.current_max_vertex_count) {
            this.current_max_vertex_count = max_vertex_count;
            this.vertex_flags.init(max_vertex_count);
            this.clip_space_vertex_positions.init(max_vertex_count);
            this.clipped_vertex_positions.init(max_face_count * 6);
            this.clipped_vertex_normals.init(max_face_count * 6 + 1);
            this.clipped_vertex_uvs.init(max_face_count * 4 + 1);
            this.object_space_vertex_positions.init(max_face_count * 6 + 2);
        }
    }
    render(viewport) {
        if (!this.scene.mesh_geometries.mesh_count)
            return;
        viewport.render_target.clear();
        this._updateClippingBuffers();
        // this.projection_plane.reset(viewport);
        let mesh;
        let mesh_geometry;
        const half_width = viewport.size.width >>> 1;
        const half_height = viewport.size.height >>> 1;
        const world_to_clip = viewport.world_to_clip;
        const model_to_clip = this.model_to_clip;
        const clip_to_model = this.clip_to_model;
        const clip_positions = this.clip_space_vertex_positions;
        const clipped_vertices = this.clipped_vertex_positions.arrays;
        const positions = this.object_space_vertex_positions.arrays;
        const normals = this.clipped_vertex_normals.arrays;
        const uvs = this.clipped_vertex_uvs.arrays;
        let light_position = this.scene.object_space_light_positions.current;
        const n = viewport.view_frustum.near;
        const vf = this.vertex_flags.array;
        const ff = this.face_flags.array;
        let result, face_index, vertex_index, face_count, vertex_count, light_index, current_face_flags, v1_index, v2_index, v3_index;
        const pz = viewport.projection_matrix.translation.z;
        this.depth_buffer.fill(2);
        const pixel = {
            coords: { x: 0, y: 0 },
            depth: 0,
            perspective_corrected_barycentric_coords: { A: 0, B: 0, C: 0 },
            position: new Position3D(this.object_space_vertex_positions.arrays[this.object_space_vertex_positions.arrays.length - 1]),
            normal: new Direction3D(this.clipped_vertex_normals.arrays[this.clipped_vertex_normals.arrays.length - 1]),
            uv: new UV2D(this.clipped_vertex_uvs.arrays[this.clipped_vertex_uvs.arrays.length - 1]),
            color: new Color4D()
        };
        const image_size = viewport.size;
        const lights = this.scene.lights;
        const camera_position = new Position3D(this.object_space_vertex_positions.arrays[this.object_space_vertex_positions.arrays.length - 2]);
        const context = viewport.render_target.context;
        const wire_frame_color = `${rgba(1)}`;
        const wire_frame_clipped_color = `${rgba(1, 0, 0)}`;
        let v1, v2, v3;
        let mesh_has_normals, mesh_has_uvs;
        for (const material of this.scene.materials)
            if (material instanceof SoftwareRasterMaterial) {
                for (mesh of material.mesh_geometries.meshes) {
                    mesh_has_normals = mesh.options.normal >= 2 /* LOAD_VERTEX__NO_FACE */;
                    mesh_has_uvs = mesh.options.include_uvs;
                    const attributes = [[
                            mesh.vertices.positions.arrays,
                            mesh.face_vertices.arrays,
                            positions,
                            false
                        ]];
                    if (mesh_has_normals)
                        attributes.push([
                            mesh.vertices.normals.arrays,
                            mesh.face_vertices.arrays,
                            this.clipped_vertex_normals.arrays,
                            true
                        ]);
                    if (mesh_has_uvs)
                        attributes.push([
                            mesh.vertices.uvs.arrays,
                            mesh.face_vertices.arrays,
                            this.clipped_vertex_uvs.arrays,
                            false
                        ]);
                    for (mesh_geometry of material.mesh_geometries.getGeometries(mesh))
                        if (mesh_geometry.is_renderable) {
                            // Prepare a matrix for converting from model space to clip space:
                            mesh_geometry.model_to_world.mul(world_to_clip, model_to_clip);
                            model_to_clip.invert(clip_to_model);
                            // Bind the inputs and outputs for the mesh shader, and execute it.
                            // Skip this geometry if it returns a CULL flag (0):
                            if (material.mesh_shader(mesh, model_to_clip, clip_positions)) {
                                // The mesh shader did not cull this geometry.
                                // Cull the vertices against the view frustum:
                                face_count = mesh.face_count;
                                vertex_count = mesh.vertex_count;
                                if (cullVertices(clip_positions.arrays, vf, vertex_count)) {
                                    // The mesh could not be determined to be outside the view frustum based on vertex culling alone.
                                    // Check it's faces as well and check for clipping cases:
                                    result = cullFaces(clip_positions.arrays, mesh.face_vertices.arrays, ff, vf, true, viewport.cull_back_faces, pz);
                                    if (result === CULL)
                                        continue;
                                    if (result === CLIP) {
                                        face_count += clipFaces(positions, clip_positions.arrays, mesh.face_vertices.arrays, vf, ff, n, pz, clipped_vertices, attributes);
                                        projectFaceVertexPositions(clipped_vertices, face_count, ff, mesh.face_count, half_width, half_height);
                                    }
                                    else { // result === INSIDE :
                                        projectSomeVertexPositions(clip_positions.arrays, vertex_count, vf, half_width, half_height);
                                        vertex_index = 0;
                                        for (const current_face_vertex_indices of mesh.face_vertices.arrays)
                                            for (const index of current_face_vertex_indices)
                                                clipped_vertices[vertex_index++].set(clip_positions.arrays[index]);
                                        if (attributes) {
                                            for (const [attrs, indices, clipped_attrs] of attributes) {
                                                vertex_index = 0;
                                                for (const current_face_vertex_indices of indices)
                                                    for (const index of current_face_vertex_indices)
                                                        clipped_attrs[vertex_index++].set(attrs[index]);
                                            }
                                        }
                                    }
                                    light_index = 0;
                                    for (const light of this.scene.lights) {
                                        light_position.array = this.scene.object_space_light_positions.arrays[light_index++];
                                        light.model_to_world.translation.matmul(mesh_geometry.world_to_model, light_position);
                                    }
                                    // this.projection_plane.start.matmul(mesh_geometry.world_to_model, this.projection_plane_object_space.start);
                                    // this.projection_plane.start.add(this.projection_plane.right, this.position).imatmul(mesh_geometry.world_to_model);
                                    // this.projection_plane_object_space.start.to(this.position, this.projection_plane_object_space.right);
                                    // this.projection_plane.start.add(this.projection_plane.down, this.position).imatmul(mesh_geometry.world_to_model);
                                    // this.projection_plane_object_space.start.to(this.position, this.projection_plane_object_space.down);
                                    viewport.controller.camera.transform.translation.matmul(mesh_geometry.world_to_model, camera_position);
                                    vertex_index = 0;
                                    for (face_index = 0; face_index < face_count; face_index++) {
                                        current_face_flags = ff[face_index];
                                        v1_index = vertex_index++;
                                        v2_index = vertex_index++;
                                        v3_index = vertex_index++;
                                        if (current_face_flags) {
                                            v1 = clipped_vertices[v1_index];
                                            v2 = clipped_vertices[v2_index];
                                            v3 = clipped_vertices[v3_index];
                                            if (viewport.show_wire_frame) {
                                                context.beginPath();
                                                context.moveTo(v1[0], v1[1]);
                                                context.lineTo(v2[0], v2[1]);
                                                context.lineTo(v3[0], v3[1]);
                                                context.lineTo(v1[0], v1[1]);
                                                context.closePath();
                                                context.strokeStyle = face_index < mesh.face_count ? wire_frame_color : wire_frame_clipped_color;
                                                context.stroke();
                                            }
                                            else {
                                                shadeFace(material.pixel_shader, pixel, image_size, camera_position, lights, this.depth_buffer, viewport.render_target.array, v1, v2, v3, positions[v1_index], positions[v2_index], positions[v3_index], normals[v1_index], normals[v2_index], normals[v3_index], uvs[v1_index], uvs[v2_index], uvs[v3_index], mesh_has_normals, mesh_has_uvs);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                }
            }
        if (!viewport.show_wire_frame)
            viewport.render_target.draw();
    }
}
//# sourceMappingURL=pipeline.js.map