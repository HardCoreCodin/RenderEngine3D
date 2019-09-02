import Screen from "./screen.js";
import Camera from "./primitives/camera.js";
import Matrix4x4 from "./linalng/4D/matrix.js";
import Direction4D, {dir4} from "./linalng/4D/direction.js";
import {Meshes} from "./primitives/mesh.js";
import {col} from "./primitives/color.js";
import {tri, Triangle} from "./primitives/triangle.js";
import Position4D, {pos4} from "./linalng/4D/position.js";
import {FPSController} from "./input.js";

export default class Engine3D {
    public camera = new Camera();
    private cameraRay = new Direction4D();

    private fps_controller = new FPSController(this.camera);

    private turntable_angle = 0;
    private turntable_rotation_speed = 0.05;

    private lightDirection = dir4(0, 0, -1).normalize(); // Illumination

    private triWorld = tri();
    private triView = tri();
    private triClip = tri();
    private triNDC = tri();
    private triNormal = dir4();
    private trianglesToRaster: Triangle[] = [];

    private nearClippingPlanePosition = pos4(0, 0, this.camera.options.near);
    private nearClippingPlaneDirection = dir4(0, 0, 1);
    private clippedTriangles = [tri(), tri()];

    private worldToView = Matrix4x4.Identity();	// Matrix that converts from world space to view space
    private viewToClip = Matrix4x4.Identity();	// Matrix that converts from view space to clip space
    private NDCToScreen = Matrix4x4.Identity();	// Matrix that converts from NDC space to screen space

    private worldToClip = Matrix4x4.Identity();	// Matrix that converts from world space to clip space
    private localToClip = Matrix4x4.Identity();	// Matrix that converts from local space to clip space
    private localToView = Matrix4x4.Identity();	// Matrix that converts from local space to view space

    constructor(
        public screen: Screen,
        public meshes: Meshes = []
    ) {}

    update(deltaTime) {
        // Uncomment to spin me right round baby right round
        // this.turntable_angle += this.turntable_rotation_speed * deltaTime;
        this.fps_controller.update();


        // If position or orientation of the camera had changed:

        if (this.fps_controller.direction_changed ||
            this.fps_controller.position_changed) {

            // Make view matrix from camera
            this.camera.transform.matrix.inverse(this.worldToView);
        }

        // Update camera options
        this.camera.options.update(
            this.screen.width,
            this.screen.height,
            2 * Math.sin(deltaTime  / 180.0 * Math.PI)
        );

        this.render();
    }

    render() {

        // Update near clipping plane position (if needed);
        if (this.camera.options.near_changed)
            this.nearClippingPlanePosition.z = this.camera.options.near;

        // Update projection matrix from camera (if needed);
        if (this.camera.options.projection_parameters_changed) {
            this.camera.getProjectionMatrix(this.viewToClip);

            // Update concatenated world -> clip space matrix:
            this.worldToView.times(this.viewToClip, this.worldToClip);
        }

        // Set the NDC -> screen matrix
        if (this.camera.options.screen_width_changed ||
            this.camera.options.screen_height_changed) {
            this.NDCToScreen.i.x = this.NDCToScreen.t.x = this.screen.width * 0.5;
            this.NDCToScreen.j.y = this.NDCToScreen.t.y = this.screen.height * 0.5;
            this.NDCToScreen.j.y *= -1;
        }

        // Store triangles for rasterizining later
        this.trianglesToRaster.length = 0;

        // Draw Meshes
        for (const mesh of this.meshes) {

            // mesh.transform.rotation.y = this.turntable_angle;

            // Update concatenated local -> clip space matrix:
            mesh.transform.matrix.times(this.worldToClip, this.localToClip);

            // Update concatenated local -> view space matrix:
            mesh.transform.matrix.times(this.worldToView, this.localToView);

            // Draw Triangles
            for (const triangle of mesh.triangles) {

                // World Matrix Transform
                triangle.transformedBy(mesh.transform.matrix, this.triWorld);

                // View Matrix Transform
                this.triWorld.transformedBy(this.worldToView, this.triView);


                // Project triangles from 3D --> 2D
                this.triView.transformedBy(this.viewToClip, this.triClip);

                // Project triangles from 3D --> 2D
                // triangle.transformedBy(this.localToClip, this.triClip);

                // Frustum culling:
                if (
                    !(
                        this.triClip.p0.x > -this.triClip.p0.w ||
                        this.triClip.p0.x < this.triClip.p0.w ||

                        this.triClip.p0.y > -this.triClip.p0.w ||
                        this.triClip.p0.y < this.triClip.p0.w ||

                        this.triClip.p0.z >= 0 &&
                        this.triClip.p0.z <= this.triClip.p0.w ||


                        this.triClip.p1.x > -this.triClip.p1.w ||
                        this.triClip.p1.x < this.triClip.p1.w ||

                        this.triClip.p1.y > -this.triClip.p1.w ||
                        this.triClip.p1.y < this.triClip.p1.w ||

                        this.triClip.p1.z >= 0 ||
                        this.triClip.p1.z <= this.triClip.p1.w ||


                        this.triClip.p2.x > -this.triClip.p2.w ||
                        this.triClip.p2.x < this.triClip.p2.w ||

                        this.triClip.p2.y > -this.triClip.p2.w ||
                        this.triClip.p2.y < this.triClip.p2.w ||

                        this.triClip.p2.z >= 0 ||
                        this.triClip.p2.z <= this.triClip.p2.w
                    )
                ) {
                    continue;
                }

                // World+View Matrix Transform
                triangle.transformedBy(this.localToView, this.triView);
                //
                // // World Matrix Transform
                // triangle.transformedBy(mesh.transform.matrix, this.triWorld);
                //
                // // View Matrix Transform
                // this.triWorld.transformedBy(this.worldToView, this.triView);

                // Clip Viewed Triangle against near plane, this could form two additional
                // additional triangles.
                let nClippedTriangles = this.triView.clipAgainstPlane(
                    this.nearClippingPlanePosition,
                    this.nearClippingPlaneDirection,
                    this.clippedTriangles[0],
                    this.clippedTriangles[1]
                );

                // this.clippedTriangles[0].setTo(this.triView);
                // let nClippedTriangles = 1;

                // We may end up with multiple triangles form the clip, so project as
                // required
                for (let n = 0; n < nClippedTriangles; n++) {
                    // Calculate triangle Normal
                    this.triNormal = this.triView.normal;

                    // Get Ray from triangle to camera
                    this.camera.projected_position.to(this.triClip.p0, this.cameraRay);

                    // If ray is aligned with normal, then triangle is visible
                    if (this.cameraRay.dot(this.triNormal) >= 0)
                        continue;

                    // Project triangles from 3D --> 2D
                    this.triView.transformedBy(this.viewToClip, this.triClip);

                    // Convert to NDC
                    this.triClip.asNDC(this.triNDC);

                    // Scale into view
                    const triScreen = this.triNDC.transformedBy(this.NDCToScreen);

                    // How "aligned" are light direction and triangle surface normal?
                    triScreen.color = col();
                    triScreen.color.setGreyscale(Math.max(0.1, this.lightDirection.dot(this.triNormal)));

                    // Store triangle for sorting
                    this.trianglesToRaster.push(triScreen);
                }
            }

            // Sort triangles from back to front
            this.trianglesToRaster.sort(
                (t1: Triangle, t2: Triangle) =>
                    ((t2.p0.z + t2.p1.z + t2.p2.z) / 3)
                    -
                    ((t1.p0.z +  t1.p1.z + t1.p2.z) / 3)
            );

            // Clear Screen
            this.screen.clear();

            for (const tri of this.trianglesToRaster) {
                this.screen.drawTriangle(tri);
                // this.screen.fillTriangle(tri);
            }
        }
    }
}