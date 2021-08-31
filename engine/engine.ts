// import Camera from "./lib/nodes/camera.js";
// import Triangle4D, {tri} from "./lib/primitives/triangle.js";
// import {FPSController} from "./lib/input/controllers.js";
// import Matrix4x4, {mat4} from "./lib/accessors/matrix4x4.js";
// import {dir4, Direction4D} from "./lib/accessors/direction.js";
// import {rgb, Color3D} from "./lib/accessors/color.js";
// import {Allocators} from "./lib/memory/allocators.js";
// import MeshRenderer, {rend} from "./objects/renderable.js";
// // import {BufferSizes} from "./buffer.js";
// import Mesh from "./lib/geometry/mesh.js";
// import Transform from "./lib/nodes/transform.js";
//
// export default class Engine3D {
//     private readonly screen: Screen;
//     private readonly camera: Camera;
//     private readonly fps_controller: FPSController;
//     private readonly mesh_renderers: MeshRenderer[] = [];
//
//     private readonly allocators: Allocators;
//     // private readonly allocator_sizes: BufferSizes;
//
//     private depth_buffer: Float32Array;
//     private frame_time = 1000 / 60;
//     private last_timestamp = 0;
//     private delta_time = 0;
//
//     private readonly ray: Direction4D;
//
//     private turntable_angle = 0;
//     private turntable_rotation_speed = 0.05;
//
//     private light_direction: Direction4D; // Illumination
//
//     private readonly extra_triangle: Triangle4D;
//     private readonly triangle_in_clip_space: Triangle4D;
//     private readonly triangle_in_ndc_space: Triangle4D;
//     private readonly triangle_in_screen_space: Triangle4D;
//     private readonly triangle_normal: Direction4D;
//     private readonly triangle_color: Color3D;
//
//     private triangle_count: number;
//     private triangles_to_raster: Triangle4D[] = [];
//
//     private readonly world_space_to_clip_space: Matrix4x4;	// MatrixType that converts from world space to clip space
//     private readonly world_space_to_camera_space: Matrix4x4;	// MatrixType that converts from world space to view space
//     private readonly local_space_to_clip_space: Matrix4x4;	// MatrixType that converts from local space to clip space
//     private readonly camera_space_to_clip_space : Matrix4x4;	// MatrixType that converts from view space to clip space
//     private readonly ndc_to_screen_space: Matrix4x4;	// MatrixType that converts from NDC space to screen space
//
//     constructor(
//         private readonly canvas: HTMLCanvasElement,
//         public readonly meshes: Mesh[]
//     ) {
//         this.screen = new Screen(canvas);
//
//         // Load...
//         for (const mesh of meshes)
//             this.mesh_renderers.push(rend(mesh.load(this.allocators), this.allocators));
//
//         this.camera = new Camera(this.allocators);
//         this.camera_space_to_clip_space = this.camera.projection_matrix;
//         this.fps_controller = new FPSController(canvas, this.camera);
//
//         this.ray = dir4D(this.allocators.vec4D);
//         this.light_direction = dir4D(0, 0, -1, 0, this.allocators.vec4D);
//
//         this.extra_triangle = tri(this.allocators.vec4D, this.allocators.vec3D);
//         this.triangle_in_clip_space = tri(this.allocators.vec4D, this.allocators.vec3D);
//         this.triangle_in_ndc_space = tri(this.allocators.vec4D, this.allocators.vec3D);
//         this.triangle_in_screen_space = tri(this.allocators.vec4D, this.allocators.vec3D);
//         this.triangle_normal = dir4D(this.allocators.vec4D);
//         this.triangle_color = rgb(this.allocators.vec3D);
//
//         this.world_space_to_clip_space = mat4x4(this.allocators.mat4x4).setToIdentity();
//         this.world_space_to_camera_space = mat4x4(this.allocators.mat4x4).setToIdentity();
//         this.local_space_to_clip_space = mat4x4(this.allocators.mat4x4).setToIdentity();
//         this.ndc_to_screen_space = mat4x4(this.allocators.mat4x4).setToIdentity();
//     }
//
//     draw(timestamp) {
//         if (this.screen.width !== this.canvas.width ||
//             this.screen.height !== this.canvas.height)
//             this.screen.updateSize();
//
//         this.delta_time = (timestamp - this.last_timestamp) / this.frame_time;
//         this.last_timestamp = timestamp;
//
//         this.update();
//
//         // try {
//         //     engine.update();
//         // } catch (e) {
//         //     console.trace();
//         //     console.debug(e.stack);
//         // }
//         requestAnimationFrame(this.draw);
//     };
//
//     start() {
//         requestAnimationFrame(this.draw);
//     }
//
//     update() {
//         // Uncomment to spin me right round baby right round
//         this.turntable_angle += this.turntable_rotation_speed * this.delta_time;
//         this.fps_controller.update(this.delta_time);
//
//         // If position or orientation of the camera had changed:
//         if (this.fps_controller.direction_changed ||
//             this.fps_controller.position_changed) {
//
//             // Make view matrix from camera
//             this.camera.transform.matrix.inverted(this.world_space_to_camera_space);
//         }
//
//         // Update camera options
//         this.camera.options.update(
//             this.screen.width,
//             this.screen.height,
//             // 2 * Math.sin(deltaTime  / 180.0 * Math.PI)
//         );
//
//         this.render();
//     }
//
//     render() {
//         const opts = this.camera.options;
//
//         // Update projection matrix from camera (if needed);
//         if (opts.projection_parameters_changed)
//             this.camera.updateProjectionMatrix();
//
//         // Update concatenated world -> clip space matrix (if needed):
//         if (this.fps_controller.direction_changed ||
//             this.fps_controller.position_changed)
//             this.world_space_to_camera_space.times(
//                 this.camera_space_to_clip_space,
//                 this.world_space_to_clip_space
//             );
//
//         // Set the NDC -> screen matrix
//         if (opts.screen_width_changed ||
//             opts.screen_height_changed) {
//             this.ndc_to_screen_space.i.x = this.ndc_to_screen_space.t.x = this.screen.width * 0.5;
//             this.ndc_to_screen_space.j.y = this.ndc_to_screen_space.t.y = this.screen.height * 0.5;
//             this.ndc_to_screen_space.j.y *= -1;
//             this.depth_buffer = new Float32Array(this.screen.width * this.screen.height);
//         }
//
//         // Store triangles for rasterizining later
//         this.triangles_to_raster.length = 0;
//
//         // Draw Meshes
//         for (const mesh_renderer of this.mesh_renderers) {
//             // mesh.transform.rotation.y = this.turntable_angle;
//
//             // Update concatenated local->view and local->clip matrices:
//             mesh_renderer.transform.matrix.times(
//                 this.world_space_to_clip_space,
//                 this.local_space_to_clip_space
//             );
//
//             // Draw Triangles
//             let triangle: Triangle4D;
//             for (let t = 0; t < mesh_renderer.mesh.face_count; t++) {
//                 triangle = mesh_renderer.mesh.vertex.triangles.at(t);
//
//                 // Generate clip-space triangle:
//                 triangle.transformedBy(
//                     this.local_space_to_clip_space,
//                     this.triangle_in_clip_space
//                 );
//
//                 // Frustum culling:
//                 if (this.triangle_in_clip_space.isOutOfView(opts.near, opts.far))
//                     continue;
//
//                 // Back-face culling:
//                 this.triangle_in_clip_space.normal(this.triangle_normal);
//                 this.camera.projected_position.to(this.triangle_in_clip_space.vertices[0].position, this.ray);
//                 if (this.ray.dot(this.triangle_normal) >= 0)
//                     continue;
//
//                 // Frustum clipping:
//                 this.triangle_count = this.triangle_in_clip_space.clipToNearClippingPlane(opts.near, this.extra_triangle);
//
//                 if (this.triangle_count === 0)
//                     continue;
//
//                 // How "aligned" are light direction and triangle surface normal?
//                 this.triangle_color.setGreyScale(Math.max(0.1, this.light_direction.dot(this.triangle_normal)));
//
//                 this.triangle_in_clip_space.asNDC(this.triangle_in_ndc_space);
//                 this.triangle_in_ndc_space.transformedBy(this.ndc_to_screen_space, this.triangle_in_screen_space);
//                 if (this.triangle_in_clip_space.color.r === 1 ||
//                     this.triangle_in_clip_space.color.g === 1 ||
//                     this.triangle_in_clip_space.color.b === 1)
//                     this.triangle_in_screen_space.color = this.triangle_in_clip_space.color;
//                 else
//                     this.triangle_in_screen_space.color = this.triangle_color; // Set grey-scale color on all vertices
//
//                 // Store triangle for sorting
//                 this.triangles_to_raster.push(this.triangle_in_screen_space.copy());
//
//                 if (this.triangle_count === 2) {
//                     // Do the same for the extra triangle generated:
//                     this.extra_triangle.asNDC(this.triangle_in_ndc_space);
//                     this.triangle_in_ndc_space.transformedBy(this.ndc_to_screen_space, this.triangle_in_screen_space);
//                     this.triangle_in_screen_space.color = rgb(0, 0, 1);
//                     // this.triangle_in_screen_space.color = this.triangle_color; // Set grey-scale color on all vertices
//
//                     this.triangles_to_raster.push(this.triangle_in_screen_space.copy());
//                 }
//             }
//
//             // Sort triangles from back to front
//             this.triangles_to_raster.sort(
//                 (
//                     t1: Triangle4D,
//                     t2: Triangle4D
//                 ) => (
//                     (
//                         t2.vertices[0].position.z +
//                         t2.vertices[1].position.z +
//                         t2.vertices[2].position.z
//                     ) / 3
//                 ) - (
//                     (
//                         t1.vertices[0].position.z +
//                         t1.vertices[1].position.z +
//                         t1.vertices[2].position.z
//                     ) / 3
//                 )
//             );
//
//             // Clear Screen
//             this.screen.clear();
//
//             for (const tri of this.triangles_to_raster) {
//                 // this.screen.drawTriangle(tri);
//                 this.screen.fillTriangle(tri);
//             }
//         }
//     }
//
//     drawTriangle(triangle: Triangle4D) {
//         triangle.sort_vertices_vertically();
//
//         const [x1, y1, z1] = triangle.vertices[0].position.buffer;
//         const [x2, y2, z2] = triangle.vertices[1].position.buffer;
//         const [x3, y3, z3] = triangle.vertices[2].position.buffer;
//
//         const [u1, v1, w1] = triangle.vertices[0].uvs.buffer;
//         const [u2, v2, w2] = triangle.vertices[1].uvs.buffer;
//         const [u3, v3, w3] = triangle.vertices[2].uvs.buffer;
//
//         const dau = (u2 - u1) | 0;
//         const dav = (v2 - v1) | 0;
//         const daw = (w2 - w1) | 0;
//         const dax = (x2 - x1) | 0;
//         const day = (y2 - y1) | 0;
//         const daz = (z2 - z1) | 0;
//
//         const dbu = (u3 - u2) | 0;
//         const dbv = (v3 - v2) | 0;
//         const dbw = (w3 - w2) | 0;
//         const dbx = (x3 - x2) | 0;
//         const dby = (y3 - y2) | 0;
//         const dbz = (z3 - z2) | 0;
//
//         let dax_step = 0;
//         let dau_step = 0;
//         let dav_step = 0;
//         let daw_step = 0;
//         let dbx_step = 0;
//         let dbu_step = 0;
//         let dbv_step = 0;
//         let dbw_step = 0;
//
//         if (day) {
//             const abs_day = Math.abs(day);
//             if (dax) dax_step = dax / abs_day;
//             if (dau) dau_step = dau / abs_day;
//             if (dav) dav_step = dav / abs_day;
//             if (daw) daw_step = daw / abs_day;
//         }
//
//         if (dby) {
//             const abs_dby = Math.abs(dby);
//             if (dbx) dbx_step = dbx / abs_dby;
//             if (dbu) dbu_step = dbu / abs_dby;
//             if (dbv) dbv_step = dbv / abs_dby;
//             if (dbw) dbw_step = dbw / abs_dby;
//         }
//
//         const x_count = this.screen.width;
//
//         if (day) {
//             let ax: number;
//             let bx: number;
//
//             let dy: number;
//             let dz: number;
//
//             let tx: number;
//             let ty: number;
//             let tx_step: number;
//
//             let i: number;
//             let z: number;
//
//             for (let y = y1; y <= y2; y++) {
//                 dy = y - y1;
//                 // dz = daz + ;
//                 ty = dy / day;
//
//                 ax = dax_step ? x1 + dax_step * dy : x1;
//                 bx = dax_step ? x1 + dbx_step * dy : x1;
//
//                 let tex_au = u1 + dy * dau_step;
//                 let tex_av = v1 + dy * dav_step;
//                 let tex_aw = w1 + dy * daw_step;
//
//                 let tex_bu = u1 + dy * dbu_step;
//                 let tex_bv = v1 + dy * dbv_step;
//                 let tex_bw = w1 + dy * dbw_step;
//
//                 if (ax > bx) [ax, bx] = [bx, ax];
//
//                 tx_step = 1.0 / (bx - ax);
//                 tx = 0.0;
//
//                 for (let x = ax; x < bx; x++) {
//                     i = x + x_count * y;
//                     // z = ;
//                     if (z > this.depth_buffer[i]) {
//                         this.depth_buffer[i] = z;
//                     }
//
//                     tx += tx_step;
//                 }
//             }
//         }
//
//     }
// }