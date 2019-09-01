// import {EulerRotation} from "./transform.js";
// import Direction3D from "../linalng/3D/direction.js";
// import Camera from "./camera.js";
// import Position3D from "../linalng/3D/position";
// import pressed from "../input.js";
//
// export class FPSController {
//     constructor(
//         private readonly camera: Camera,
//         public movement_speed: number = 0.25,
//         public rotation_speed: number = 0.05
//     ) {}
//
//     yawRight = () => this.camera.transform.rotation.y += this.rotation_speed;
//     yawLeft = () => this.camera.transform.rotation.y -= this.rotation_speed;
//
//     pitchUp = () => this.camera.transform.rotation.x += this.rotation_speed;
//     pitchDown = () => this.camera.transform.rotation.x -= this.rotation_speed;
//
//     panUp = () => this.camera.position.y += this.movement_speed;
//     panDown = () => this.camera.position.y -= this.movement_speed;
//
//     moveForward = () => this.camera.position.add(this.camera.forward.times(this.movement_speed));
//     moveBackwards = () => this.camera.position.sub(this.camera.forward.times(this.movement_speed));
//
//     straffRight = () => this.camera.position.add(this.camera.right.times(this.movement_speed));
//     straffLeft = () => this.camera.position.sub(this.camera.right.times(this.movement_speed));
//
//     update() : void {
//         if (pressed.yaw_left) this.fps_controller.yawLeft();
//         if (pressed.yaw_right) this.fps_controller.yawRight();
//         if (pressed.pitch_up) this.fps_controller.pitchUp();
//         if (pressed.pitch_down) this.fps_controller.pitchDown();
//
//     }
//
//
//
//
//     //
//     // public readonly forward = new Direction3D();
//     //
//     // private readonly delta_position = new Direction3D();
//     // private readonly delta_orientation = new EulerRotation();
//     // // public readonly forward = this.movement_orientation.matrix.k; // The player's forward direction
//     //
//     // orient() : void {
//     //     // Generate a fresh delta rotation matrix
//     //     // from the current yaw and pitch angles
//     //     this.delta_orientation.computeMatrix();
//     //
//     //     // Start with forward looking down the positive Z axis
//     //     this.forward.setTo(0, 0, 1);
//     //
//     //     // Generate a forward vector based on the current orientation
//     // }
//     //
//     //
//     // // private readonly right = this.transform.rotation.matrix.i; // The camera's right direction
//     // // private readonly up = this.transform.rotation.matrix.j; // The camera's up direction
//     // // private readonly look_direction = this.transform.rotation.matrix.k; // The camera's forward direction
//     // // private readonly movement_orientation = new EulerRotation(new Matrix3x3(this.transform.rotation.matrix.i.buffer));
//     // // public readonly forward = this.movement_orientation.matrix.k; // The player's forward direction
//     // //
//     // // // Target position in world space
//     // // private readonly target = new Position3D();
//     //
//     //
//     // public readonly forward = new Direction3D(); // The player's forward direction
//     //
//     // public setOrientationByAngles(yaw: number, pitch: number) : void {
//     //     this.transform.rotation.setXY(pitch, yaw);
//     //     // this.forward.z = this.transform.matrix.i.x;
//     //     // this.forward.x = -this.transform.matrix.i.z;
//     //     // this.forward.normalize();
//     //
//     //     var look_dir = new Direction3D();
//     //     look_dir.z = 1;
//     //     look_dir.mul(this.transform.rotation.matrix);
//     //
//     //     var target = new Position3D();
//     //     var forward = this.position.to(target);
//     //
//     //     // Create "Point At" Matrix for camera
//     //     var up = new Direction3D();
//     //     up.x = 0;
//     //     up.y = 1;
//     //     up.z = 0;
//     //
//     //
//     //     var target = { 0,0,1 };
//     //     mat4x4 matCameraRot = Matrix_MakeRotationY(fYaw);
//     //     vLookDir = Matrix_MultiplyVector(matCameraRot, vTarget);
//     //     vTarget = Vector_Add(vCamera, vLookDir);
//     //     mat4x4 matCamera = Matrix_PointAt(vCamera, vTarget, vUp);
//     //
//     //     this.position.plus(
//     //         this.target
//     //             .setTo(0, 0, 1) // Z-facing direction
//     //             .mul(this.transform.rotation.matrix), // Orient
//     //         this.target
//     //     );
//     //     this.position.to(
//     //         this.target,
//     //         this.forward
//     //     ).normalize();
//     // }
//     //
//     // public setOrientationByDirection(direction: Direction3D) : void  {
//     // }
//
//
// }