import pressed from "./input.js";
import Screen from "./screen.js";
import Camera from "./primitives/camera.js";
import Matrix, {mat4} from "./linalng/matrix.js";
import Direction, {dir4} from "./linalng/direction.js";
import {Meshes} from "./primitives/mesh.js";
import {col} from "./primitives/color.js";
import {tri, Triangle} from "./primitives/triangle.js";
import {pos4} from "./linalng/position.js";

export default class Engine3D {
    public camera = new Camera();
    private cameraRay = new Direction();

    private lightDirection = dir4(0, 0, -1).normalize(); // Illumination

    private triColor = col(1 ,1 ,1 );
    private triWorld = tri(pos4(), pos4(), pos4(), this.triColor);
    private triView = tri(pos4(), pos4(), pos4(), this.triColor);
    private triClip = tri(pos4(), pos4(), pos4(), this.triColor);
    private triNDC = tri(pos4(), pos4(), pos4(), this.triColor);
    // private triScreen = tri(pos4(), pos4(), pos4(), this.triColor);
    private triNormal = dir4();
    private trianglesToRaster: Triangle[] = [];

    private worldToView = Matrix.Identity();	// Matrix that converts from world space to view space
    private viewToClip = Matrix.Identity();	// Matrix that converts from view space to clip space
    private NDCToScreen = Matrix.Identity();	// Matrix that converts from NDC space to screen space

    private yaw: number = 0;		// FPS Camera rotation in XZ plane
    private theta: number = 0;	// Spins World transform

    private movement_step = 0.2;
    private rotation_angle = 0.03;

    private matProj;

    constructor(
        public screen: Screen,
        public meshes: Meshes = []
    ) {
        // Projection Matrix
        let fNear = 0.1;
        let fFar = 1000.0;
        let fFov = 90.0;
        let fAspectRatio = this.screen.height / this.screen.width;
        let fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180.0 * Math.PI);

        this.matProj = mat4(
            fAspectRatio * fFovRad, 0, 0, 0,
            0, fFovRad, 0, 0,
            0, 0, fFar / (fFar - fNear), 1,
            0, 0,  (-fFar * fNear) / (fFar - fNear), 0
        );
    }

    update(deltaTime) {
        this.handleInput(deltaTime);

        this.theta += this.rotation_angle * deltaTime; // Uncomment to spin me right round baby right round

        // Make view matrix from camera
        this.worldToView.setTo(this.camera.transform.matrix.inverted);

        // Make projection matrix from camera
        this.viewToClip.setTo(
            this.camera.setProjection(
                this.screen.width,
                this.screen.height
            )
        );

        // Set the NDC -> screen matrix
        this.NDCToScreen.i.x = this.NDCToScreen.t.x = this.screen.width * 0.5;
        this.NDCToScreen.j.y = this.NDCToScreen.t.y = this.screen.height * 0.5;

        // Store triangles for rasterizining later
        this.trianglesToRaster.length = 0;

        // Clear Screen
        this.screen.clear();

        // Draw Meshes
        for (const mesh of this.meshes) {

            mesh.transform.setRotationAnglesForXZ(this.theta * 0.5, this.theta);

            // Draw Triangles
            for (const triangle of mesh.triangles) {
                // World Matrix Transform
                triangle.transformedBy(mesh.transform.matrix, this.triWorld);

                // Calculate triangle Normal
                this.triNormal = this.triWorld.normal;

                // Get Ray from triangle to camera
                this.camera.position.to(this.triWorld.p0, this.cameraRay);

                // If ray is aligned with normal, then triangle is visible
                if (this.cameraRay.dot(this.triNormal) >= 0)
                    continue;

                // Project triangles from 3D --> 2D
                this.triWorld.transformedBy(this.matProj, this.triClip);

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

            for (const tri of this.trianglesToRaster) {
                // this.screen.drawTriangle(tri);
                this.screen.fillTriangle(tri);
            }
        }
    }

    handleInput(deltaTime) {
        // Dont use these two in FPS mode, it is confusing :P
        if (pressed.ml) this.camera.position.x -= this.movement_step;	// Travel Along X-Axis
        if (pressed.mr) this.camera.position.x += this.movement_step;	// Travel Along X-Axis
        if (pressed.mu) this.camera.position.y += this.movement_step;	// Travel Upwards
        if (pressed.md) this.camera.position.y -= this.movement_step;	// Travel Downwards

        // Standard FPS Control scheme, but turn instead of strafe
        if (pressed.mf)
            this.camera.position.add(this.camera.forward.times(this.movement_step));

        if (pressed.mb)
            this.camera.position.sub(this.camera.forward.times(this.movement_step));

        if (pressed.tl) {
            this.yaw -= this.rotation_angle;
        }

        if (pressed.tr) this.yaw += this.rotation_angle;
    }
}
