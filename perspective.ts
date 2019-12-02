// import MatrixType from "../linalng/matrix.js";
// import Transform from "./transform.js";
// import Direction from "../linalng/direction.js";
// import Position from "../linalng/position.js";
//
// export default class Camera {
//     // The forward-direction in camera-space, with projection-matrix applied to it
//     public readonly projected_position = new Position();
//
//     public readonly transform: Transform = new Transform();
//     public readonly position: Position = this.transform.translation; // Location in world space
//     public readonly forward: Direction = this.transform.rotation.matrix.k; // The camera's forward direction
//     private readonly right: Direction = this.transform.rotation.matrix.i; // The camera's right direction
//     private readonly up: Direction = this.transform.rotation.matrix.j; // The camera's up direction
//
//     // Target position in world space
//     private readonly orientation: Transform = new Transform();
//     private readonly target: Position = this.orientation.translation;
//     private readonly look_direction: Direction = this.orientation.matrix.k;
//
//     // MatrixType that converts from view space to screen space
//     public readonly projection: MatrixType = new MatrixType().setToIdentity();
//
//     constructor(public options: CameraOptions = new CameraOptions()) {}
//
//     public setOrientation(yaw: number, pitch: number) : MatrixType {
//         this.orientation.rotation.setXY(pitch, yaw);
//         this.target.setTo(this.position).add(this.look_direction);
//         this.forward.setTo(this.position.to(this.target).normalize());
//         this.up.y = this.forward.z;
//         this.up.x = -this.forward.x;
//         this.up.z = -this.forward.y;
//         this.up.cross(this.forward, this.right);
//
//         return this.transform.matrix;
//     }
//
//     setProjection(
//         screen_width: number = this.options.screen_width,
//         screen_height: number = this.options.screen_height,
//         fov: number = this.options.fov,
//         near: number = this.options.near,
//         far: number = this.options.far
//     ) : MatrixType {
//         this.options.updateIfNeeded(
//             screen_width,
//             screen_height,
//             fov,
//             near,
//             far
//         );
//
//         this.projection.setTo(
//             this.options.perspective_factor, 0, 0, 0,
//             0, this.options.perspective_factor * this.options.aspect_ratio, 0, 0,
//             0, 0, far / this.options.depth_span, 1,
//             0, 0,  (-far * near) / this.options.depth_span, 0
//         );
//
//         this.projected_position.w = 1;
//         this.projected_position.z = 0;
//         this.projected_position.mul(this.projection);
//
//         return this.projection;
//     }
// }
//
// export class CameraOptions {
//     public perspective_factor: number;
//     public depth_span: number;
//
//     constructor(
//         public screen_width: number = 1024,
//         public screen_height: number = 1024,
//         public near: number = 0.1,
//         public far: number = 1000,
//         public fov: number = 90,
//         public aspect_ratio: number = 1
//     ) {
//         this.setDepthSpan(near, far);
//         this.setAspectRatio(screen_width, screen_height);
//         this.setPerspectiveFactor(fov);
//     }
//
//     updateIfNeeded(
//         screen_width: number = this.screen_width,
//         screen_height: number = this.screen_height,
//         fov: number = this.fov,
//         near: number = this.near,
//         far: number = this.far
//     ) : boolean {
//         let updated = false;
//
//         if (fov !== this.fov) {
//             this.setPerspectiveFactor(fov);
//             updated = true;
//         }
//
//         if (near !== this.near ||
//             far !== this.far) {
//             this.setDepthSpan(near, far);
//             updated = true;
//         }
//
//         if (screen_width !== this.screen_width ||
//             screen_height !== this.screen_height) {
//             this.setAspectRatio(screen_width, screen_height);
//             updated = true;
//         }
//
//         return updated;
//     }
//
//     setPerspectiveFactor(fov: number) : void {
//         this.fov = fov;
//         this.perspective_factor = 1.0 / Math.tan(fov * 0.5 / 180.0 * Math.PI);
//     }
//
//     setAspectRatio(screen_width: number, screen_height: number) : void {
//         this.screen_height = screen_height;
//         this.screen_width = screen_width;
//         this.aspect_ratio = screen_width / screen_height;
//     }
//
//     setDepthSpan(near: number, far: number) : void {
//         this.near = near;
//         this.far = far;
//         this.depth_span = far - near;
//     }
// }


// import MatrixType from "../linalng/matrix.js";
// import Position from "../linalng/position.js";
// import Direction from "../linalng/direction.js";
//
// export class EulerRotation {
//     constructor(
//         public readonly matrix = new MatrixType().setToIdentity(), // Overall Rotation MatrixType
//         private readonly rotationMatrixForX = new MatrixType().setToIdentity(), // Rotation MatrixType for X
//         private readonly rotationMatrixFroY = new MatrixType().setToIdentity(), // Rotation MatrixType for Y
//         private readonly rotationMatrixForZ = new MatrixType().setToIdentity(), // Rotation MatrixType for Z
//         public readonly angles = new Direction()	// Rotation Angles for X, Y, and Z
//     ) {}
//
//     get x() : number {return this.angles.x}
//     get y() : number {return this.angles.y}
//     get z() : number {return this.angles.z}
//
//     set x(x: number) {
//         this.angles.x = x;
//         this.rotationMatrixForX.setRotationAroundX(x);
//         this.computeMatrix();
//     }
//
//     set y(y: number) {
//         this.angles.y = y;
//         this.rotationMatrixFroY.setRotationAroundY(y);
//         this.computeMatrix();
//     }
//
//     set z(z: number) {
//         this.angles.z = z;
//         this.rotationMatrixForZ.setRotationAroundZ(z);
//         this.computeMatrix();
//     }
//
//     set xyz(xyz: Direction) {
//         this.angles.setTo(xyz);
//
//         this.rotationMatrixForX.setRotationAroundX(xyz.x);
//         this.rotationMatrixFroY.setRotationAroundY(xyz.y);
//         this.rotationMatrixForZ.setRotationAroundZ(xyz.z);
//
//         this.computeMatrix();
//     }
//
//     setXY(x: number, y: number) {
//         this.angles.x = x;
//         this.angles.y = y;
//
//         this.rotationMatrixForX.setRotationAroundX(x);
//         this.rotationMatrixFroY.setRotationAroundY(y);
//
//         this.computeMatrix();
//     }
//
//     setXZ(x: number, z: number) {
//         this.angles.x = x;
//         this.angles.z = z;
//
//         this.rotationMatrixForX.setRotationAroundX(x);
//         this.rotationMatrixForZ.setRotationAroundZ(z);
//
//         this.computeMatrix();
//     }
//
//     setYZ(y: number, z: number) {
//         this.angles.y = y;
//         this.angles.z = z;
//
//         this.rotationMatrixFroY.setRotationAroundY(y);
//         this.rotationMatrixForZ.setRotationAroundZ(z);
//
//         this.computeMatrix();
//     }
//
//     setXYZ(x: number, y: number, z: number) {
//         this.angles.x = x;
//         this.angles.y = y;
//         this.angles.z = z;
//
//         this.rotationMatrixForX.setRotationAroundX(x);
//         this.rotationMatrixFroY.setRotationAroundY(y);
//         this.rotationMatrixForZ.setRotationAroundZ(z);
//
//         this.computeMatrix();
//     }
//
//     private computeMatrix() : void {
//         this.matrix
//             .setToIdentity()
//             .mul(this.rotationMatrixForZ)
//             .mul(this.rotationMatrixForX)
//             .mul(this.rotationMatrixFroY)
//     }
// }
//
// export default class Transform {
//     public readonly matrix: MatrixType = new MatrixType().setToIdentity();
//     public readonly rotation: EulerRotation = new EulerRotation(this.matrix);
//     public readonly translation: Position = this.matrix.t;
// }
//
//
// //
// // const DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE = 0.1;
// // const DEFAULT_FAR_CLIPPING_PLANE_DISTANCE = 1000;
// // const DEFAULT_FOCAL_LENGTH = 50; // in millimeters
// // const DEFAULT_FILM_BACK_WIDTH = 36; // in millimeters
// // const DEFAULT_FILM_BACK_HEIGHT = 24; // in millimeters
// // const DEFAULT_ASPECT_RATIO = DEFAULT_FILM_BACK_WIDTH / DEFAULT_FILM_BACK_HEIGHT;
// //
// // const Matrix_MakeFrustum = (
// //     near_clipping_plane_distance: number = DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE,
// //     far_clipping_plane_distance: number = DEFAULT_FAR_CLIPPING_PLANE_DISTANCE,
// //
// //     aspect_ratio: number = DEFAULT_ASPECT_RATIO,
// //     focal_length: number = DEFAULT_FOCAL_LENGTH,
// //
// //     film_back_width: number = DEFAULT_FILM_BACK_WIDTH,
// //     film_back_height: number = DEFAULT_FILM_BACK_HEIGHT
// // ) : mat4 => {
// //     // This is the projection matrix.
// //     // It converts coordinates from 'eye space' to 'clip space'.
// //     // From clip space, there is going to be a division by Ze,
// //     // so the projection transformation should account for that.
// //
// //     // First, some sanity checks:
// //     if (aspect_ratio <= 0)
// //         throw `Aspect ratio ${aspect_ratio} must be positive!`;
// //
// //     if (near_clipping_plane_distance <= 0)
// //         throw `Near clipping plane distance ${near_clipping_plane_distance} must be positive!`;
// //
// //     if (far_clipping_plane_distance <= 0)
// //         throw `Far clipping plane distance ${far_clipping_plane_distance} must be positive!`;
// //
// //     if (far_clipping_plane_distance <= near_clipping_plane_distance)
// //         throw `Far clipping plane distance ${far_clipping_plane_distance} must be greater
// //         than near clipping plane distance ${near_clipping_plane_distance} !`;
// //
// //     // The typical way of projecting is by providing an FOV angle.
// //     // ("field of view", typically in degrees).
// //     //
// //     // However this has some drawbacks:
// //     // 1) It loses ties to the real world of lenses.
// //     // 2) It involves an expensive transcendental function (tan/cot)
// //     //
// //     // Here we'll take a different approach using a real world lens metric.
// //     // This also has a nice side effect of simplifying the arithmetic
// //     // as it does not involve any angles or trigonometry.
// //     //
// //     // The magnitude of perspective comes from the type of lens used.
// //     // More specifically, it is determined by the lens's focal length.
// //     // A shorter focal length results in a stronger perspective distortion,
// //     // so the focal length is inversely proportional to the field of view.
// //     //
// //     // However, because the field of view is given in angles,
// //     // the magnitude of perspective scales non-linearl with respect
// //     // to the input value. This makes it more difficult to control
// //     // the magnitude of perspective via scaling the input linearly.
// //     //
// //     // Instead, if the input is the focal length itself,
// //     // because it's inversely proportional to magnitude of perspective,
// //     // it's impact on it scales much more linearly so it's easier to control.
// //     //
// //     // Moreover, using focal length as the input makes the computation
// //     // much simpler and cheaper, while at the same time making it
// //     // easier to reason about conceptually as it's easy to visualise.
// //     //
// //     // Projection of 3D space onto a 2D image plane scales any point
// //     // in space horizontally and vertically by some amount.
// //     // The scaling factors for each point depends on 2 things:
// //     // 1) Where the point is in space:
// //     //    In the real world, it is the distance of the point from the lens of the camera.
// //     //    In the virtual world, it is the z coordinate of the point in view space.
// //     // 2) A "ratio" of the dimensions of the projection plane to it's distance:
// //     //    In the real world, the projection plane is a film back
// //     //    sitting right on the focal plane of the lens, and the distance is
// //     //    focal plane to the lens
// //     //    The ratio is then between the distance of the focal plane to the lens
// //     //    (a.k.a: the "focal length" of the lens), and the dimensions of
// //     //    the film back (it's width and height).
// //     //    In the virtual world, the projection plane is the near clipping plane,
// //     //    and
// //     //    it is the ratio between the length of the
// //     //    film back (which sits on the focal plane). distance of the lens of the camera to the dimensions of the film back
// //     //
// //     //    In the virtual space, it is the ratio between the distance of the projection plane to it's dimensions.
// //     // The effect of the former is specific to each point,
// //     // so is applied later when dividing
// //
// //     // it's
// //     // distance from the camera with the len's
// //     // , scales every point's
// //     // horizontal and vertical scaling factors
// //     // for the projection transformation, all that is actually needed
// //     // is a ratio between the focal distance and the
// //     // of
// //     // The crucial realisation is that perspective strength results
// //     // from a "proportion" between the focal length and
// //
// //
// //     // The relevant portion of depth is between the 2 clipping planes.
// //     // We call this (here) the 'depth span' (z_span):
// //     // far_clipping_plane_distance - near_clipping_plane_distance
// //     // The near/far clipping plane arguments are measures of distance,
// //     // so they are positive.
// //     // Since we're using a right-handed coordinate system,
// //     // their actual Z coordinates would be negative:
// //     const z_near = -near_clipping_plane_distance;
// //     const z_far = -far_clipping_plane_distance;
// //     //
// //     // What needs to happen with the depth span, is the most
// //     // complicated portion of the projection transformation.
// //     //
// //     // The classical way of deriving it is purely algebraic,
// //     // relying on solving a system of 2 equations with 2 variables.
// //     // This enables constructing the projection matrix in one step
// //     // by just plugging the resulting expressions into the matrix.
// //     //
// //     // However doing so destroys clarity about what's actually
// //     // happening there geometrically, so it becomes challenging
// //     // to visualize the transformation.
// //     //
// //     // And so, instead, we're going to break it down to multiple steps,
// //     // each of which can be easily visualized in isolation.
// //     // We'll then compose the operation back into a single projection matrix,
// //     // so that the end result is the same.
// //     //
// //     // In NDC space, the projection plane needs to be at -1,
// //     // While the far clipping plane needs to bet at 1.
// //     // However, NDC space is AFTER the perspective divide,
// //     // and clip space if BEFORE it, so we need to invert that division.
// //     //
// //     // In other words:
// //     // For the projection plane, we need to stretch the depth space
// //     // such that it takes it away from it's NDC's target spot of -1,
// //     // back to whatever it needs to be such that applying the
// //     // perspective divide would land it at it's NDC target spot of -1.
// //     // Similarly, for the far clipping plane, we need to stretch the depth space
// //     // such that it takes it away from it's NDC's target spot of +1,
// //     // back to whatever it needs to be such that applying the
// //     // perspective divide would land it at it's NDC target spot of +1.
// //     //
// //     // The perspective divide would be squishing the depth space for
// //     // every coordinate by it's eye-space z coordinate, but negated: -Ze.
// //     //
// //     // For the projection plane, that would be: -z_near (or 'near_clipping_plane_distance')
// //     // For the far clipping plane, that would be: -z_far (or 'far_clipping_plane_distance')
// //     //
// //     // And so, for the projection plane:
// //     // Given how it needs to land at -1 in NDC,
// //     // applying the division by -Ze would be:
// //     // Zndc: -1 = Zc / -Ze
// //     // Inverting division is to matrix_multiply, so we get that:
// //     // Zc = -1 * -Ze = Ze
// //     // So, the Z coordinate of the the projection plane in clip space,
// //     // should be exactly the same as it's coordinate at view space:
// //     // Zc = Ze = z_near
// //
// //     // Similarly, for the far clipping plane:
// //     // Given that it needs to land at +1 in NDC,
// //     // applying the division by -Ze would be:
// //     // Zndc: +1 = Zc / -Ze
// //     // Inverting division is to matrix_multiply, so we get that:
// //     // Zc = +1 * -Ze = -Ze
// //     // So, the clip space Z coordinates of the the far clipping plane,
// //     // should be exactly the inverse of it's coordinate at view space:
// //     // Zc = -Ze = -z_near (or 'far_clipping_plane_distance')
// //
// //     // So, the depth span at clip space is from a distance of
// //     // near_clipping_plane_distance away from the origin in negative Z,
// //     // to a distance of far_clipping_plane_distance away from the origin
// //     // in positive Z, giving a clip-space depth span of:
// //     // near_clipping_plane_distance + far_clipping_plane_distance
// //     //
// //     // So, we need to come up with a transformation that would
// //     // bring the depth span from where it is at view space to where
// //     // it needs to be at clip space.
// //     // This will involve some complex combination of scaling and translating.
// //     // To make it easier to visualize, we'll break it down into multiple steps.
// //     //
// //     // For the first few transformations, it makes it simpler
// //     // to visualize if we start off with a normalized depth span,
// //     // such that the space between the near and far clipping plane
// //     // sit between 0 and 1.
// //
// //     // Start preparing the projection matrixL
// //     const projection_matrix = Matrix_MakeIdentity();
// //
// //     // Step 1: Fix the projection plane to the origin:
// //     // ===============================================
// //     // Align the projection plane's center with the origin, by
// //     // sliding space towards the camera by it's distance
// //     projection_matrix[2][3] = near_clipping_plane_distance;
// //     // The relevant depth span now starts with the projection plane at 0,
// //     // and goes backwards towards the far clipping plane,
// //     // which now sits at the back of the depth span.
// //
// //     // Transformation matrices apply scaling and then translation
// //     // in this specific order, so plugging a scale value into
// //     // the projection matrix as it currently is, would make it
// //     // scale around the origin BEFORE the translation that we've just set(!).
// //     // We want to apply the the scale to the "already translated"
// //     // depth space (AFTER the translation) so we can't do that.
// //     // Instead, we'll put the scale factor (and any subsequent translation)
// //     // in a temporary matrix, and then apply it onto the projection matrix:
// //     const op = Matrix_MakeIdentity();
// //
// //     // Step 2: Normalize the depth span:
// //     // =================================
// //     // We now want to bring the far clipping plane over to +1,
// //     // by scaling the depth space around the origin.
// //     // We need to squish the depth 'space' down towards the origin,
// //     // by the amount of the depth 'span' itself, however since the far
// //     // clipping plane currently sits on the negative side of Z,
// //     // that would would land it at -1, so instead we'll squish down by
// //     // negative of that amount:
// //     // -(far_clipping_plane_distance - near_clipping_plane_distance)
// //     // z_squish = near_clipping_plane_distance - far_clipping_plane_distance;
// //
// //     // Step 3: Fix the depth span:
// //     // ======================================================
// //     // The depth span would now be from the projection plane at the origin,
// //     // to the far clipping plane at Z = +1.
// //     // We need to now stretch it so it becomes the target depth span
// //     // described above:
// //     // z_stretch = near_clipping_plane_distance + far_clipping_plane_distance;
// //
// //     // We'll combine the stretching and squishing together into our
// //     // temporary matrix:
// //     op[2][2] = (
// //         near_clipping_plane_distance + far_clipping_plane_distance // z_stretch
// //     ) / (
// //         near_clipping_plane_distance - far_clipping_plane_distance // z_squish
// //     );
// //
// //     // Step 4: Slide the depth span:
// //     // ======================================================
// //     // The depth span would now be between the projection plane
// //     // at the origin, and the far clipping plane at positive z,
// //     // a distance of 'new depth span' away from the origin.
// //     // As described above, we need the projection plane to sit
// //     // back where it started at eye space, so we need to slide
// //     // the depth span back by the distance of the projection plane:
// //     // -near_clipping_plane_distance (or just: z_near)
// //     op[2][3] = z_near;
// //
// //     // We'll now apply the temporary matrix to the projection matrix.
// //     Matrix_MultiplyMatrix(op, projection_matrix, projection_matrix);
// //
// //     // Having taken care of what needs to happen to depth,
// //     // let's now shift our focus to the width and height:
// //
// //     // Step 5: Squeezing space horizontally and vertically:
// //     // ====================================================
// //
// //
// //     // The triangle(s) formed by the film-back(s) and focal length,
// //     // are similar to the ones formed by the projection plane and
// //     // it's distance from the origin (respectively):
// //
// //     // Let:
// //     // ppw = projection plane's width
// //     // pph = projection plane's height
// //     // ppd = projection plane's distance from the origin (z_near)
// //
// //     // And:
// //     // fbw = film back's width
// //     // fbh = film back's height
// //     // fbd = film back distance from the lens (focal length)
// //
// //     // We get:
// //     // fbd : fbw/2 = ppd : ppw/2
// //     // fbd : fbh/2 = ppd : pph/2
// //
// //     // In other words we can say:
// //     // z_near / right = 2 * focal_length / film_back_width
// //     // z_near / top = 2 * focal_length / film_back_height
// //     // So, instead of dividing the width and height in half,
// //     // we can simply double the focal length (without multiplying):
// //     focal_length += focal_length;
// //
// //     // So, then:
// //     projection_matrix[0][0] = focal_length / film_back_width;
// //     projection_matrix[1][1] = focal_length / film_back_height;
// //
// //     // The standard Full-Frame format is: 35mm (diagonal).
// //     // It's corresponding standard film-back dimensions are: 36x24mm.
// //     // The lens most typically used, has a focal length of: 50mm.
// //     // The lens distorts the incoming light towards the focal point,
// //     // at the center of the film-back.
// //     // The "field of view" (perspective magnitude) is proportional
// //     // to the ratio(s) between the dimension(s) of the film-back
// //     // and the focal-length of the len.
// //     // Using the standard metrics above:
// //     // The horizontal FOV has the proportion 36:50
// //     // The vertical FOV has the proportion 24:50
// //
// //     // If aspect ratio and/or film-back dimension(s) are non-default,
// //     // we ensure they all agree:
// //     if (aspect_ratio === DEFAULT_ASPECT_RATIO) {
// //         // Aspect ratio was not provided
// //
// //         if (film_back_width === DEFAULT_FILM_BACK_WIDTH) {
// //             // Aspect film-back width was not provided
// //
// //             if (film_back_height !== DEFAULT_FILM_BACK_HEIGHT) {
// //                 // Custom film-back height provided:
// //
// //                 film_back_width = film_back_height * aspect_ratio;
// //             }
// //         } else {
// //             // Custom film-back width provided:
// //
// //             if (film_back_height === DEFAULT_FILM_BACK_HEIGHT) {
// //                 // Custom film-back height was not provided
// //
// //                 film_back_height = film_back_width / aspect_ratio;
// //             } else {
// //                 // Custom film-back height provided:
// //
// //                 aspect_ratio = film_back_width / film_back_height
// //             }
// //         }
// //     } else {
// //         // Custom Aspect ratio provided
// //
// //         if (film_back_width === DEFAULT_FILM_BACK_WIDTH) {
// //             // Custom film-back width was not provided
// //
// //             if (film_back_height !== DEFAULT_FILM_BACK_HEIGHT) {
// //                 // Custom film-back height provided:
// //
// //                 film_back_width = film_back_height * aspect_ratio;
// //             }
// //         } else {
// //             // Custom film-back width provided
// //
// //             if (film_back_height === DEFAULT_FILM_BACK_HEIGHT) {
// //                 // Custom  film-back height was not provided
// //
// //                 film_back_height = film_back_width / aspect_ratio;
// //             } else {
// //                 // Custom film-back height provided
// //
// //                 if ((film_back_width / film_back_height) !== aspect_ratio)
// //                     throw `Aspect ratio must be the proportion of the film-back!`
// //             }
// //         }
// //     }
// //
// //
// //     const fovRad = 1 / Math.tan((fovDegrees / 360) * Math.PI);
// //     return [
// //         [fovRad * aspectRatio, 0, 0, 0],
// //         [0, fovRad, 0, 0],
// //         [0, 0, far / depth, 1],
// //         [0, 0, (-far * near) / depth, 0]
// //     ];
// // };
//
//
// // const Matrix_MakeProjection = (
// //     aspectRatio: number,
// //     focalLength: number = 0.5,
// //     near: number = 0.1,
// //     far: number = 1000
// // ) : mat4 => {
// //     const depth = far - near;
// //     return [
// //         [aspectRatio * 2 * near /focalLength, 0, 0, 0],
// //         [0, 2 * near / focalLength, 0, 0],
// //         [0, 0, far / depth, focalLength],
// //         [0, 0, (-far * near) / depth, 0]
// //     ];
// // };
//
//
//
//
// //
// // interface endPoint {
// //     x: number,
// //     y: number,
// //     z: number,
// //
// //     x_inc: number,
// //     z_inc: number
// //
// //     other_stuff
// // }
//
// // Scan conversion:
// // ================
// // Loop over each triangle and scan through it to map it's pixel coordinates.
//
// // Given the triangle ABC where:
// // A = [x1, y1, z1]
// // B = [x2, y2, z2]
// // C = [x3, y3, z3]
// //
// // The triangle could then be:
// // 1) Flat at the top.
// // 2) Flat at the bottom.
// // 3)
// // 2) There is a single vertex at the bottom, and a flat edge at the top.
// // 3) There is a single vertex at the top, and non-
// // 1.A) There is a flat edge at the bottom.
// // 1.B) There is no flat edge at the bottom.
// // 2) There is a single vertex at the bottom.
// // 2.A) There is a flat edge at the top.
// // 2.B) There is no flat edge at the top.
//
// // We first determine which vertex is the top one.
// // If there are 2 of the, we pick the left one.
// // For this example, we'll assume it's the vertex A.
// // There will then be 2 edges connecting to that top vertex.
// // going downward towards the other 2 vertices at points B and C.
// // The 2 edges may not have the same height in y, so one of them could be longer.
// // We pick the longer of the 2, and slide down along it, one unit of y at a time.
// // For each such horizontal scan-line, we'll scan from the pixel touching/on-it,
// // horizontally into the triangle, in single-pixel steps, until we reach the other edge.
// // For each pixel we'll determine it's corresponding x, y, x coordinates in camera-space,
// // as well as any other interpolated value.
// // Because there could be a shorter edge at the other end of the scan-line,
// // we'll often hit the other
// // We start from the top-most vertex (left of it if there are 2),
// // Then scan down the left edge.
//
// // Given top vertex: A (x1, y1, z1)
// // Scanning down towards: (x2, y2, z2)
// // We consider a right-triangle formed by the 2 vertices and some point horizontal to
// // We go along the edge, downwards to the next integer in y.
// // and consider the small right-triangle ABC where::
// // A = the point we're leaving from
// // B = the point right below us on the next integer of y
// // C = the next point on the edge
// // The line BC is horizontal as B and C have the same y coordinates
// // The triangle is "similar" to the once formed by the 2 vertices and a
// //
// // The coordinates of C will be:
// // Cx = (x1 - x2) / (y1 - y2)
// // The first right-triangle starts from the coordinates of the vertex:
// // A = [x1, y1. z1]     (the vertex coordinates)
// // B = [x1, floor(y1)]  (directly  below A, at the first integer of y)
// // C = []
// // The first initial point C sits x_
// // on the scan-line is:
// // x =
//
//
// // x = floor(x1)
// // y = floor(y1)
// // x_inc =
// // z_inc = (z1 - z2) / (y1 - y2)
//
//
// // Compute z_inc:
// // Let n be the normal vector of the triangle
// // (nx, ny, nz) . (1, 0, z_inc) = 0
// // nx + nz*z_inc = 0
// // z_inc = -nx / nz
