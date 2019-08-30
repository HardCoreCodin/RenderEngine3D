import pressed from "./input.js";
import Screen from "./screen.js";
import Camera from "./primitives/camera.js";
import Matrix, {mat4} from "./linalng/matrix.js";
import Direction, {dir4} from "./linalng/direction.js";
import {Meshes} from "./primitives/mesh.js";
import {col} from "./primitives/color.js";
import {tri, Triangle} from "./primitives/triangle.js";
import {pos4} from "./linalng/position.js";

import {add, sub, minus, plus, mul, times, div, over, dot, cross, vecMatMul} from "./linalng/arithmatic/vector.js";

export default class Engine3D {
    public camera = new Camera();
    private cameraRay = new Direction();

    private lightDirection = dir4( 0.0, 1.0, -1.0 ).normalize(); // Illumination

    private triColor = col(1 ,1 ,1 );
    private triWorld = tri(pos4(), pos4(), pos4(), this.triColor);
    private triView = tri(pos4(), pos4(), pos4(), this.triColor);
    private triClip = tri(pos4(), pos4(), pos4(), this.triColor);
    private triNDC = tri(pos4(), pos4(), pos4(), this.triColor);
    private triScreen = tri(pos4(), pos4(), pos4(), this.triColor);

    private triNormal = dir4();

    private worldToView = Matrix.Identity();	// Matrix that converts from world space to view space
    private viewToClip = Matrix.Identity();	// Matrix that converts from view space to clip space
    private NDCToScreen = Matrix.Identity();	// Matrix that converts from NDC space to screen space

    private yaw: number = 0;		// FPS Camera rotation in XZ plane
    private theta: number = 0;	// Spins World transform

    private movement_step = 0.2;
    private rotation_angle = 0.1;

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

        let matRotZ = mat4();
        let matRotX = mat4();

        // Rotation Z
        matRotZ.m0[0] = Math.cos(this.theta);
        matRotZ.m0[1] = Math.sin(this.theta);
        matRotZ.m1[0] = -Math.sin(this.theta);
        matRotZ.m1[1] = Math.cos(this.theta);
        matRotZ.m2[2] = 1;
        matRotZ.m3[3] = 1;

        // Rotation X
        matRotX.m0[0] = 1;
        matRotX.m1[1] = Math.cos(this.theta * 0.5);
        matRotX.m1[2] = Math.sin(this.theta * 0.5);
        matRotX.m2[1] = -Math.sin(this.theta * 0.5);
        matRotX.m2[2] = Math.cos(this.theta * 0.5);
        matRotX.m3[3] = 1;


        //
        // // Make view matrix from camera
        // this.camera.transform.matrix.inverse(this.worldToView); //Matrix_QuickInverse(matCamera);
        //
        // // Make projection matrix from camera
        // this.viewToClip.setTo(this.camera.projection);

        // // Set the NDC -> screen matrix
        // this.NDCToScreen.i.x = 0.5 * this.screen.width;
        // this.NDCToScreen.j.y = 0.5 * this.screen.height;
        // this.NDCToScreen.t.x = this.NDCToScreen.t.y = 1;
        //
        // // Store triangles for rasterizining later
        // const trianglesToRaster: Triangle[] = [];

        // Clear Screen
        this.screen.clear();

        // Draw Meshes
        for (const mesh of this.meshes) {

            // Draw Triangles
            for (const triangle of mesh.triangles) {
                let triProjected = tri();
                let triRotatedZ = tri();
                let triRotatedZX = tri();

                // Rotate in Z-Axis
                vecMatMul(triangle.p0.buffer, matRotZ.buffer, triRotatedZ.p0.buffer);
                vecMatMul(triangle.p1.buffer, matRotZ.buffer, triRotatedZ.p1.buffer);
                vecMatMul(triangle.p2.buffer, matRotZ.buffer, triRotatedZ.p2.buffer);

                // Rotate in X-Axis
                vecMatMul(triRotatedZ.p0.buffer, matRotZ.buffer, triRotatedZX.p0.buffer);
                vecMatMul(triRotatedZ.p1.buffer, matRotZ.buffer, triRotatedZX.p1.buffer);
                vecMatMul(triRotatedZ.p2.buffer, matRotZ.buffer, triRotatedZX.p2.buffer);

                // Offset into the screen
                let triTranslated = tri(triRotatedZX.p0, triRotatedZX.p1, triRotatedZX.p2);
                triTranslated.p0.z = triRotatedZX.p0.z + 3;
                triTranslated.p1.z = triRotatedZX.p1.z + 3;
                triTranslated.p2.z = triRotatedZX.p2.z + 3;

                // Project triangles from 3D --> 2D
                vecMatMul(triTranslated.p0.buffer, this.matProj.buffer, triProjected.p0.buffer);
                vecMatMul(triTranslated.p1.buffer, this.matProj.buffer, triProjected.p1.buffer);
                vecMatMul(triTranslated.p2.buffer, this.matProj.buffer, triProjected.p2.buffer);

                triProjected.p0.x /= triProjected.p0.w;
                triProjected.p0.y /= triProjected.p0.w;
                triProjected.p0.z /= triProjected.p0.w;
                triProjected.p0.w /= triProjected.p0.w;

                triProjected.p1.x /= triProjected.p1.w;
                triProjected.p1.y /= triProjected.p1.w;
                triProjected.p1.z /= triProjected.p1.w;
                triProjected.p1.w /= triProjected.p1.w;

                triProjected.p2.x /= triProjected.p2.w;
                triProjected.p2.y /= triProjected.p2.w;
                triProjected.p2.z /= triProjected.p2.w;
                triProjected.p2.w /= triProjected.p2.w;

                // Scale into view
                triProjected.p0.x += 1; triProjected.p0.y += 1;
                triProjected.p1.x += 1; triProjected.p1.y += 1;
                triProjected.p2.x += 1; triProjected.p2.y += 1;
                triProjected.p0.x *= 0.5 * this.screen.width;
                triProjected.p0.y *= 0.5 * this.screen.height;
                triProjected.p1.x *= 0.5 * this.screen.width;
                triProjected.p1.y *= 0.5 * this.screen.height;
                triProjected.p2.x *= 0.5 * this.screen.width;
                triProjected.p2.y *= 0.5 * this.screen.height;

                triProjected.color = this.triColor;

                this.screen.fillTriangle(triProjected);

                //
                // // World Matrix Transform
                // triangle.transformedBy(mesh.transform.matrix, this.triWorld);
                //
                // // Calculate triangle Normal
                // const world = this.triNormal = this.triWorld.normal;
                //
                // // Get Ray from triangle to camera
                // this.camera.position.to(this.triWorld.p0, this.cameraRay);
                //
                // // If ray is aligned with normal, then triangle is visible
                // if (this.cameraRay.dot(this.triNormal) < 0.0)
                // {
                //     // How "aligned" are light direction and triangle surface normal?
                //     this.triColor.setGreyscale(Math.max(0.1, this.lightDirection.dot(this.triNormal)));
                //
                //     // Convert World Space --> View Space
                //     const view = this.triWorld.transformedBy(this.worldToView, this.triView);
                //
                //     // Project triangles from 3D --> 2D
                //     const clip =this.triView.transformedBy(this.viewToClip, this.triClip);
                //
                //     // Convert to NDC
                //     const ndc = this.triClip.asNDC(this.triNDC);
                //
                //     // Offset verts into visible normalised space
                //     const screen = this.triNDC.transformedBy(this.NDCToScreen, this.triScreen);
                //
                //     // Store triangle for sorting
                //     trianglesToRaster.push(this.triScreen);
                // }
            }

            // Sort triangles from back to front
            // trianglesToRaster.sort(
            //     (t1: triangle, t2: triangle) =>
            //         t1.p[0].z +
            //         t1.p[1].z +
            //         t1.p[2].z -
            //         t2.p[0].z -
            //         t2.p[1].z -
            //         t2.p[2].z
            // );

            // for (const tri of trianglesToRaster) {
            //     this.screen.drawTriangle(tri);
            //     this.screen.fillTriangle(tri);
            // }
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
