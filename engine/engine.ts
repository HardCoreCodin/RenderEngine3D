import Screen from "./screen.js";
import Camera from "./primitives/camera.js";
import Matrix4x4 from "./linalng/4D/matrix.js";
import Direction4D, {dir4} from "./linalng/4D/direction.js";
import {Meshes} from "./primitives/mesh.js";
import {tri, Triangle} from "./primitives/triangle.js";
import {FPSController} from "./input.js";
import {rgb} from "./linalng/3D/color.js";

export default class Engine3D {
    private frame_time = 1000 / 60;
    private last_timestamp = 0;
    private delta_time = 0;

    private ray = new Direction4D();

    private turntable_angle = 0;
    private turntable_rotation_speed = 0.05;

    private light_direction = dir4(0, 0, -1).normalize(); // Illumination

    private extra_triangle = tri();
    private triangle_in_clip_space = tri();
    private triangle_in_ndc_space = tri();
    private triangle_in_screen_space = tri();
    private triangle_normal = dir4();
    private triangle_color = rgb();
    private triangle_count: number;
    private triangles_to_raster: Triangle[] = [];

    private world_space_to_clip_space = Matrix4x4.Identity();	// Matrix that converts from world space to clip space
    private world_space_to_camera_space = Matrix4x4.Identity();	// Matrix that converts from world space to view space
    private local_space_to_clip_space = Matrix4x4.Identity();	// Matrix that converts from local space to clip space
    private camera_space_to_clip_space = Matrix4x4.Identity();	// Matrix that converts from view space to clip space
    private ndc_to_screen_space = Matrix4x4.Identity();	// Matrix that converts from NDC space to screen space

    constructor(
        private readonly canvas: HTMLCanvasElement,
        public meshes: Meshes = [],
        public camera = new Camera(),
        public screen = new Screen(canvas),
        private fps_controller = new FPSController(camera, screen)
    ) {}

    private draw = (timestamp) => {
        this.delta_time = (timestamp - this.last_timestamp) / this.frame_time;
        this.last_timestamp = timestamp;

        this.update();

        // try {
        //     engine.update();
        // } catch (e) {
        //     console.trace();
        //     console.debug(e.stack);
        // }
        requestAnimationFrame(this.draw);
    };

    start() {
        requestAnimationFrame(this.draw);
    }

    update() {
        // Uncomment to spin me right round baby right round
        this.turntable_angle += this.turntable_rotation_speed * this.delta_time;
        this.fps_controller.update(this.delta_time);

        // If position or orientation of the camera had changed:
        if (this.fps_controller.direction_changed ||
            this.fps_controller.position_changed) {

            // Make view matrix from camera
            this.camera.transform.matrix.inverse(this.world_space_to_camera_space);
        }

        // Update camera options
        this.camera.options.update(
            this.screen.width,
            this.screen.height,
            // 2 * Math.sin(deltaTime  / 180.0 * Math.PI)
        );

        this.render();
    }

    render() {
        const opts = this.camera.options;

        // Update projection matrix from camera (if needed);
        if (opts.projection_parameters_changed)
            this.camera.getProjectionMatrix(this.camera_space_to_clip_space);

        // Update concatenated world -> clip space matrix (if needed):
        if (this.fps_controller.direction_changed ||
            this.fps_controller.position_changed)
            this.world_space_to_camera_space.times(
                this.camera_space_to_clip_space,
                this.world_space_to_clip_space
            );

        // Set the NDC -> screen matrix
        if (opts.screen_width_changed ||
            opts.screen_height_changed) {
            this.ndc_to_screen_space.i.x = this.ndc_to_screen_space.t.x = this.screen.width * 0.5;
            this.ndc_to_screen_space.j.y = this.ndc_to_screen_space.t.y = this.screen.height * 0.5;
            this.ndc_to_screen_space.j.y *= -1;
        }

        // Store triangles for rasterizining later
        this.triangles_to_raster.length = 0;

        // Draw Meshes
        for (const mesh of this.meshes) {
            // mesh.transform.rotation.y = this.turntable_angle;

            // Update concatenated local->view and local->clip matrices:
            mesh.transform.matrix.times(
                this.world_space_to_clip_space,
                this.local_space_to_clip_space
            );

            // Draw Triangles
            for (const triangle of mesh.triangles) {

                // Generate clip-space triangle:
                triangle.transformedBy(
                    this.local_space_to_clip_space,
                    this.triangle_in_clip_space
                );

                // Frustum culling:
                if (this.triangle_in_clip_space.isOutOfView(opts.near, opts.far))
                    continue;

                // Back-face culling:
                this.triangle_in_clip_space.normal(this.triangle_normal);
                this.camera.projected_position.to(this.triangle_in_clip_space.vertices[0].position, this.ray);
                if (this.ray.dot(this.triangle_normal) >= 0)
                    continue;

                // Frustum clipping:
                this.triangle_count = this.triangle_in_clip_space.clipToNearClippingPlane(opts.near, this.extra_triangle);

                if (this.triangle_count === 0)
                    continue;

                // How "aligned" are light direction and triangle surface normal?
                this.triangle_color.setGreyScale(Math.max(0.1, this.light_direction.dot(this.triangle_normal)));

                this.triangle_in_clip_space.asNDC(this.triangle_in_ndc_space);
                this.triangle_in_ndc_space.transformedBy(this.ndc_to_screen_space, this.triangle_in_screen_space);
                if (this.triangle_in_clip_space.color.r === 1 ||
                    this.triangle_in_clip_space.color.g === 1 ||
                    this.triangle_in_clip_space.color.b === 1)
                    this.triangle_in_screen_space.color = this.triangle_in_clip_space.color;
                else
                    this.triangle_in_screen_space.color = this.triangle_color; // Set grey-scale color on all vertices

                // Store triangle for sorting
                this.triangles_to_raster.push(this.triangle_in_screen_space.copy());

                if (this.triangle_count === 2) {
                    // Do the same for the extra triangle generated:
                    this.extra_triangle.asNDC(this.triangle_in_ndc_space);
                    this.triangle_in_ndc_space.transformedBy(this.ndc_to_screen_space, this.triangle_in_screen_space);
                    this.triangle_in_screen_space.color = rgb(0, 0, 1);
                    // this.triangle_in_screen_space.color = this.triangle_color; // Set grey-scale color on all vertices

                    this.triangles_to_raster.push(this.triangle_in_screen_space.copy());
                }
            }

            // Sort triangles from back to front
            this.triangles_to_raster.sort(
                (
                    t1: Triangle,
                    t2: Triangle
                ) => (
                    (
                        t2.vertices[0].position.z +
                        t2.vertices[1].position.z +
                        t2.vertices[2].position.z
                    ) / 3
                ) - (
                    (
                        t1.vertices[0].position.z +
                        t1.vertices[1].position.z +
                        t1.vertices[2].position.z
                    ) / 3
                )
            );

            // Clear Screen
            this.screen.clear();

            for (const tri of this.triangles_to_raster) {
                // this.screen.drawTriangle(tri);
                this.screen.fillTriangle(tri);
            }
        }
    }
}