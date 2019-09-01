import pressed from "./input.js";
import Screen from "./screen.js";
import Camera from "./primitives/camera.js";
import Matrix4x4 from "./linalng/4D/matrix.js";
import Direction4D, {dir4} from "./linalng/4D/direction.js";
import {Meshes} from "./primitives/mesh.js";
import {col} from "./primitives/color.js";
import {tri, Triangle} from "./primitives/triangle.js";
import {pos4} from "./linalng/4D/position.js";

export default class Engine3D {
    public camera = new Camera();
    private cameraRay = new Direction4D();

    private lightDirection = dir4(0, 0, -1).normalize(); // Illumination

    private triColor = col(1 ,1 ,1 );
    private triWorld = tri(pos4(), pos4(), pos4(), this.triColor);
    private triView = tri(pos4(), pos4(), pos4(), this.triColor);
    private triClip = tri(pos4(), pos4(), pos4(), this.triColor);
    private triNDC = tri(pos4(), pos4(), pos4(), this.triColor);
    private triNormal = dir4();
    private trianglesToRaster: Triangle[] = [];

    private worldToView = Matrix4x4.Identity();	// Matrix that converts from world space to view space
    private viewToClip = Matrix4x4.Identity();	// Matrix that converts from view space to clip space
    private NDCToScreen = Matrix4x4.Identity();	// Matrix that converts from NDC space to screen space

    private yaw: number = 0;		// FPS Camera rotation in XZ plane
    private pitch: number = 0;
    public rotate_using_angles: boolean = true;

    private turntable_angle: number = 0;

    private movement_step = 0.2;
    private rotation_angle = 0.03;

    constructor(
        public screen: Screen,
        public meshes: Meshes = []
    ) {}

    update(deltaTime) {
        // Uncomment to spin me right round baby right round
        // this.turntable_angle += this.rotation_angle * deltaTime;
        this.handleInput(deltaTime);
        this.render();
    }

    render() {
        // Make view matrix from camera
        this.worldToView.setTo(this.camera.transform.matrix.inverted);

        // Make projection matrix from camera
        if (this.camera.options.updateIfNeeded(
            this.screen.width,
            this.screen.height,
        )) {
            this.viewToClip.setTo(this.camera.setProjection());

            // Set the NDC -> screen matrix
            this.NDCToScreen.i.x = this.NDCToScreen.t.x = this.screen.width * 0.5;
            this.NDCToScreen.j.y = this.NDCToScreen.t.y = this.screen.height * 0.5;
            this.NDCToScreen.j.y *= -1;
        }

        // Store triangles for rasterizining later
        this.trianglesToRaster.length = 0;

        // Draw Meshes
        for (const mesh of this.meshes) {

            mesh.transform.rotation.y = this.turntable_angle;

            // Draw Triangles
            for (const triangle of mesh.triangles) {
                // World Matrix Transform
                triangle.transformedBy(mesh.transform.matrix, this.triWorld);

                // View Matrix Transform
                this.triWorld.transformedBy(this.worldToView, this.triView);

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
                // this.screen.drawTriangle(tri);
                this.screen.fillTriangle(tri);
            }
        }
    }

    handleInput(deltaTime: number) : void {
        if (pressed.yaw_left || pressed.yaw_right || pressed.pitch_up || pressed.pitch_down) {
            if (pressed.yaw_left) this.yaw -= this.rotation_angle;
            if (pressed.yaw_right) this.yaw += this.rotation_angle;
            if (pressed.pitch_up) this.pitch -= this.rotation_angle;
            if (pressed.pitch_down) this.pitch += this.rotation_angle;

            this.rotate_using_angles ?
                this.camera.setOrientationByAngles(this.yaw, this.pitch) :
                this.camera.setOrientationByDirection(this.lightDirection); /// TODO: ...
        }

        if (pressed.forward || pressed.backwards) {
            if (pressed.forward) this.camera.position.add(this.camera.forward.times(this.movement_step));
            if (pressed.backwards) this.camera.position.sub(this.camera.forward.times(this.movement_step));
        }

        /// TODO: ... Make work according to reoriented reference frame above...
        if (pressed.left) this.camera.position.x -= this.movement_step;
        if (pressed.right) this.camera.position.x += this.movement_step;
        if (pressed.up) this.camera.position.y += this.movement_step;
        if (pressed.down) this.camera.position.y -= this.movement_step;
    }
}
