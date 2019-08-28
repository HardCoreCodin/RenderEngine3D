import {Mesh, triangle} from "./mesh.js";
import {
    mat,
    mat4x4,
    Matrix_MakeProjection,
    Matrix_MakeRotationX, Matrix_MakeRotationY,
    Matrix_MakeRotationZ,
    Matrix_MakeTranslation,
    Matrix_MultiplyMatrix, Matrix_MultiplyVector, Matrix_PointAt, Matrix_QuickInverse
} from "./mat.js";
import {
    vec3d,
    Vector_Add,
    Vector_CrossProduct, Vector_Div,
    Vector_DotProduct,
    Vector_Mul,
    Vector_Normalize,
    Vector_Sub
} from "./vec.js";
import pressed from "./input.js";

export default class Engine3D {
    private mesh: Mesh;

    private matRotX = mat4x4.Identity();	// Rotation Matrix
    private matRotZ = mat4x4.Identity();	// Rotation Matrix
    private matTrans = mat4x4.Identity();	// Translation Matrix
    private matWorld = mat4x4.Identity();	// World transform Matrix

    private matProj = mat4x4.Identity();	// Matrix that converts from view space to screen space
    private matView = mat4x4.Identity();	// Matrix that converts from view space to screen space

    private camera = new vec3d();	// Location of camera in world space
    private lookDir = new vec3d();	// Direction vector along the direction camera points

    private yaw: number = 0;		// FPS Camera rotation in XZ plane
    private theta: number = 0;	// Spins World transform

    private movement_step = 0.2;
    private rotation_angle = 0.1;

    public screen_width: number;
    public screen_height: number;

    private context: CanvasRenderingContext2D;

    constructor(canvas, obj) {
        this.screen_width = canvas.width;
        this.screen_height = canvas.height;
        this.context = canvas.getContext('2d');

        this.mesh = Mesh.fromObj(obj);
        this.matProj = Matrix_MakeProjection(
            90.0,
            this.screen_height / this.screen_width,
            0.1,
            1000.0
        );
    }

    update(deltaTime) {
        this.handleInput(deltaTime);

        this.matWorld.setTo(
            this.matTrans.setTranslation(0.0, 0.0, 5.0)
        ).mul(
            this.matRotX.setRotationAroundX(this.theta)
        ).mul(
            this.matRotZ.setRotationAroundZ(this.theta * 0.5)
        );

        // Create "Point At" Matrix for camera
        const up = new vec3d( 0,1,0 );
        let target = new vec3d( 0,0,1 );

        const matCameraRot = Matrix_MakeRotationY(this.yaw);
        this.lookDir = Matrix_MultiplyVector(matCameraRot, target);
        target = Vector_Add(this.camera, this.lookDir);

        const matCamera = Matrix_PointAt(this.camera, target, up);

        // Make view matrix from camera
        const matView = matCamera;//Matrix_QuickInverse(matCamera);

        // Store triangles for rasterizining later
        const trianglesToRaster: triangle[] = [];

        // Clear Screen
        this.clearScreen();

        // Draw Triangles
        for (const tri of this.mesh.tris) {

            // World Matrix Transform
            const triTransformed = new triangle(
                [
                    Matrix_MultiplyVector(matWorld, tri.p[0]),
                    Matrix_MultiplyVector(matWorld, tri.p[1]),
                    Matrix_MultiplyVector(matWorld, tri.p[2])
                ]
            );

            // Calculate triangle Normal

            // Get lines either side of triangle
            const line1 = Vector_Sub(triTransformed.p[1], triTransformed.p[0]);
            const line2 = Vector_Sub(triTransformed.p[2], triTransformed.p[0]);

            // Take cross product of lines to get normal to triangle surface
            const normal = Vector_Normalize(Vector_CrossProduct(line1, line2));

            // Get Ray from triangle to camera
            const cameraRay = Vector_Sub(triTransformed.p[0], this.camera);

            // If ray is aligned with normal, then triangle is visible
            if (Vector_DotProduct(normal, cameraRay) < 0.0)
            {
                // Illumination
                const light_direction = Vector_Normalize(
                    new vec3d( 0.0, 1.0, -1.0 )
                );
                // How "aligned" are light direction and triangle surface normal?
                const dp = Math.max(0.1,
                    Vector_DotProduct(light_direction, normal)
                );

                // Choose console colours as required (much easier with RGB)
                triTransformed.col.r = dp;
                triTransformed.col.g = dp;
                triTransformed.col.b = dp;

                // Convert World Space --> View Space
                const triViewed = new triangle(
                    [
                        Matrix_MultiplyVector(matView, triTransformed.p[0]),
                        Matrix_MultiplyVector(matView, triTransformed.p[1]),
                        Matrix_MultiplyVector(matView, triTransformed.p[2])
                    ],
                    triTransformed.col
                );

                // Project triangles from 3D --> 2D
                const triProjected = new triangle(
                    [
                        Matrix_MultiplyVector(this.matProj, triViewed.p[0]),
                        Matrix_MultiplyVector(this.matProj, triViewed.p[1]),
                        Matrix_MultiplyVector(this.matProj, triViewed.p[2])
                    ],
                    triTransformed.col
                );

                // Scale into view, we moved the normalising into cartesian space
                // out of the matrix.vector function from the previous videos, so
                // do this manually
                triProjected.p[0] = Vector_Div(triProjected.p[0], triProjected.p[0].w);
                triProjected.p[1] = Vector_Div(triProjected.p[1], triProjected.p[1].w);
                triProjected.p[2] = Vector_Div(triProjected.p[2], triProjected.p[2].w);

                // Offset verts into visible normalised space
                const offsetView = new vec3d(1,1,0 );
                triProjected.p[0] = Vector_Add(triProjected.p[0], offsetView);
                triProjected.p[1] = Vector_Add(triProjected.p[1], offsetView);
                triProjected.p[2] = Vector_Add(triProjected.p[2], offsetView);
                triProjected.p[0].x *= 0.5 * this.screen_width;
                triProjected.p[0].y *= 0.5 * this.screen_height;
                triProjected.p[1].x *= 0.5 * this.screen_width;
                triProjected.p[1].y *= 0.5 * this.screen_height;
                triProjected.p[2].x *= 0.5 * this.screen_width;
                triProjected.p[2].y *= 0.5 * this.screen_height;

                // Store triangle for sorting
                trianglesToRaster.push(triProjected);
            }
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

        for (const tri of trianglesToRaster) {
            this.drawTriangle(tri);
            this.fillTriangle(tri);
        }
    }

    handleInput(deltaTime) {
        // Dont use these two in FPS mode, it is confusing :P
        if (pressed.ml) this.camera.x -= this.movement_step;	// Travel Along X-Axis
        if (pressed.mr) this.camera.x += this.movement_step;	// Travel Along X-Axis
        if (pressed.mu) this.camera.y += this.movement_step;	// Travel Upwards
        if (pressed.md) this.camera.y -= this.movement_step;	// Travel Downwards

        // Standard FPS Control scheme, but turn instead of strafe
        const forward = Vector_Mul(this.lookDir, this.movement_step);
        if (pressed.mf) this.camera = Vector_Add(this.camera, forward);
        if (pressed.mb) this.camera = Vector_Sub(this.camera, forward);
        if (pressed.tl) this.yaw -= this.rotation_angle;
        if (pressed.tr) this.yaw += this.rotation_angle;
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.screen_width, this.screen_height);
    }

    drawTriangle(tri: triangle) {
        this.context.beginPath();

        this.context.moveTo(tri.p[0].x, tri.p[0].y);
        this.context.lineTo(tri.p[1].x, tri.p[1].y);
        this.context.lineTo(tri.p[2].x, tri.p[2].y);
        this.context.lineTo(tri.p[0].x, tri.p[0].y);

        this.context.closePath();

        this.context.strokeStyle = `${tri.col}`;
        this.context.stroke();
    }

    fillTriangle(tri: triangle) {
        this.context.beginPath();

        this.context.moveTo(tri.p[0].x, tri.p[0].y);
        this.context.lineTo(tri.p[1].x, tri.p[1].y);
        this.context.lineTo(tri.p[2].x, tri.p[2].y);

        this.context.closePath();

        this.context.fillStyle = `${tri.col}`;
        this.context.fill();
    }

}
