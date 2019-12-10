import Viewport from "./viewport.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {VertexPositions3D, VertexPositions4D} from "../geometry/positions.js";
import {IBuffer, IFaceVertices} from "../_interfaces/buffers.js";
import {cube_face_vertices} from "../geometry/cube.js";
import {CLIP, clipFaces, CULL, cullBackFaces, frustumCheck, perspectiveDevide} from "../math/rasterization.js";
import {FaceVerticesInt32, FromToIndicesInt32} from "../geometry/indices.js";
import {FaceAreas, LinearInterpolator4D} from "../geometry/interpolations.js";
import {DIM} from "../../constants.js";

const clip_box_face_flags = new Uint8Array(6);
const clip_box_vertex_flags = new Uint8Array(8);


export class ClippingInterpolator {
    constructor(
        readonly face_count: number,
        readonly vertex_count: number,
        readonly face_vertices: IFaceVertices,
        readonly face_flags: Uint8Array = new Uint8Array(face_count),
        readonly vertex_flags: Uint8Array = new Uint8Array(vertex_count),

        readonly interpolator_1 = new LinearInterpolator4D(face_vertices),
        readonly interpolator_2 = new LinearInterpolator4D(face_vertices),

        readonly from_to_indices_1 = new FromToIndicesInt32(face_count),
        readonly from_to_indices_2 = new FromToIndicesInt32(face_count)
    ) {}

    interpolate(buffer: IBuffer<DIM._4D>): this {
        this.interpolator_1.interpolateSome(this.vertex_flags, this.from_to_indices_1, buffer);
        this.interpolator_2.interpolateSome(this.vertex_flags, this.from_to_indices_2, buffer);

        return this;
    }
}

export class PixelAttributesInterpolator {
    constructor(
        face_areas: FaceAreas
    ) {}
}

const is_not_culled = (face: number): boolean => !!face;


export default class Rasterizer
{
    // readonly view_positions: VertexPositions3D;
    readonly vertex_positions: VertexPositions4D;
    readonly vertex_interpolator: ClippingInterpolator;

    readonly extra_positions: VertexPositions4D;
    readonly extra_interpolator: ClippingInterpolator;

    protected new_faces_count: number;
    protected result_flags: number;

    // readonly screen_positions: VertexPositions3D;

    constructor(
        readonly face_vertices: IFaceVertices,
        readonly local_positions: VertexPositions3D,
        readonly local_bbox_positions: VertexPositions3D,
        readonly local_to_world: Matrix4x4,

        readonly local_to_clip = new Matrix4x4(),
        readonly face_count = face_vertices.arrays[0].length,
        readonly vertex_count = local_positions.length,

        readonly face_flags: Uint8Array = new Uint8Array(face_count),
        readonly vertex_flags: Uint8Array = new Uint8Array(vertex_count),

        readonly face_areas = new Float32Array(face_count),
        readonly clip_bbox_positions = new VertexPositions4D(cube_face_vertices),
    ) {
        // this.view_positions = new VertexPositions3D(face_vertices);
        this.vertex_positions = new VertexPositions4D(face_vertices);
        this.extra_positions = new VertexPositions4D(face_vertices);

        this.vertex_interpolator = new ClippingInterpolator(face_count, vertex_count, face_vertices, face_flags, vertex_flags);
        this.extra_interpolator = new ClippingInterpolator(face_count, vertex_count, face_vertices);
        // this.screen_positions = new VertexPositions3D(face_vertices);

    }

    orient(world_to_clip: Matrix4x4) {
        this.local_to_world.times(world_to_clip, this.local_to_clip);
    }

    cullBoundingBox(): number {
        this.local_bbox_positions.mat4mul(this.local_to_clip, this.clip_bbox_positions);

        // Check if the clip-space bounding-box is visible in the view frustum:
        this.result_flags = frustumCheck(
            this.clip_bbox_positions.arrays,
            cube_face_vertices.arrays,
            clip_box_vertex_flags,
            clip_box_face_flags
        );

        return this.result_flags;
    }

    cullAndClip() {
        // The bounding box is visible in the view frustum.
        // Do the frustum check again, this time with the full mesh:
        this.local_positions.mat4mul(this.local_to_clip, this.vertex_positions);
        this.result_flags = frustumCheck(
            this.vertex_positions.arrays,
            this.face_vertices.arrays,
            this.vertex_flags,
            this.face_flags,
        );
        if (this.result_flags === CULL)
            return CULL;

        if (this.result_flags === CLIP) {
            this.new_faces_count = clipFaces(
                this.vertex_positions.arrays,
                this.face_vertices.arrays,

                this.face_flags,
                this.vertex_flags,
                this.vertex_interpolator.interpolator_1.arrays,
                this.vertex_interpolator.interpolator_2.arrays,
                this.vertex_interpolator.from_to_indices_1.arrays,
                this.vertex_interpolator.from_to_indices_2.arrays,

                this.extra_positions.arrays,
                this.extra_interpolator.face_flags,
                this.extra_interpolator.vertex_flags,
                this.extra_interpolator.interpolator_1.arrays,
                this.extra_interpolator.interpolator_2.arrays,
                this.extra_interpolator.from_to_indices_1.arrays,
                this.extra_interpolator.from_to_indices_2.arrays
            );
        } else
            this.new_faces_count = 0;

        // The mesh is visible in the frustum - project it and check for back-faces:
        perspectiveDevide(this.vertex_positions.arrays, this.vertex_flags);

        this.result_flags = cullBackFaces(
            this.vertex_positions.arrays,
            this.face_vertices.arrays,
            this.face_areas,
            this.face_flags,
            this.extra_interpolator.face_flags
        );

        if (this.result_flags === CULL)
            return CULL;

        if (this.new_faces_count && this.extra_interpolator.face_flags.some(is_not_culled)) {
            perspectiveDevide(this.extra_positions.arrays, this.extra_interpolator.vertex_flags);
            // TODO: Complete interpolation of all other vertex attributes using the interpolators
        }

        return this.result_flags;
    }
}